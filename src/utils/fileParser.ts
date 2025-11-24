import * as XLSX from 'xlsx';
interface QuestionData {
  id: number;
  question: string;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
  correctAnswer: 'A' | 'B' | 'C' | 'D';
  explanation: string;
  tags: string[];
}
export const parseFile = async (file: File): Promise<QuestionData[]> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = e => {
      try {
        const data = e.target?.result;
        if (!data) {
          reject(new Error('Failed to read file'));
          return;
        }
        let questions: QuestionData[] = [];
        if (file.name.endsWith('.csv')) {
          questions = parseCSV(data as string);
        } else if (file.name.endsWith('.xlsx')) {
          questions = parseExcel(data);
        } else {
          reject(new Error('Unsupported file format. Please upload .csv or .xlsx files.'));
          return;
        }
        const validationError = validateQuestions(questions);
        if (validationError) {
          reject(new Error(validationError));
          return;
        }
        resolve(questions);
      } catch (error) {
        reject(new Error(`Error parsing file: ${error instanceof Error ? error.message : 'Unknown error'}`));
      }
    };
    reader.onerror = () => {
      reject(new Error('Error reading file'));
    };
    if (file.name.endsWith('.csv')) {
      reader.readAsText(file);
    } else {
      reader.readAsArrayBuffer(file);
    }
  });
};
const parseCSV = (csvData: string): QuestionData[] => {
  const lines = csvData.split('\n');
  const headers = lines[0].split(',').map(h => h.trim());
  
  const allQuestions = lines.slice(1).filter(line => line.trim()).map((line, index) => {
    const values = line.split(',').map(v => v.trim());
    const record: any = {};
    headers.forEach((header, i) => {
      record[header] = values[i] || '';
    });
    
    // Check if the file has separate option columns or a single Options column
    if (record.Options !== undefined || record.options !== undefined) {
      const options = parseOptionsField(record.Options || record.options || '');
      return {
        id: index + 1,
        question: record.Question || record.question || '',
        optionA: options.A || '',
        optionB: options.B || '',
        optionC: options.C || '',
        optionD: options.D || '',
        correctAnswer: record.Answer || record.correctAnswer || '',
        explanation: record.Explanation || record.explanation || '',
        tags: (record.Tags || record.tags || '').split(',').map((tag: string) => tag.trim()).filter(Boolean)
      };
    } else {
      // Original format with separate columns
      return {
        id: index + 1,
        question: record.question || '',
        optionA: record.optionA || '',
        optionB: record.optionB || '',
        optionC: record.optionC || '',
        optionD: record.optionD || '',
        correctAnswer: record.correctAnswer || '',
        explanation: record.explanation || '',
        tags: (record.tags || '').split(',').map((tag: string) => tag.trim()).filter(Boolean)
      };
    }
  });
  
  // Filter out invalid questions
  return allQuestions.filter(q => 
    q.question && 
    q.optionA && q.optionB && q.optionC && q.optionD && 
    ['A', 'B', 'C', 'D'].includes(q.correctAnswer)
  );
};
const parseExcel = (data: ArrayBuffer | string): QuestionData[] => {
  const workbook = XLSX.read(data, {
    type: 'array'
  });
  const firstSheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[firstSheetName];
  const jsonData = XLSX.utils.sheet_to_json(worksheet);
  
  const allQuestions = jsonData.map((row: any, index) => {
    // Check if the file has separate option columns or a single Options column
    if (row.Options !== undefined) {
      // Parse the Options field that contains all options separated by newlines
      const options = parseOptionsField(row.Options || '');
      return {
        id: index + 1,
        question: row.Question || row.question || '',
        optionA: options.A || '',
        optionB: options.B || '',
        optionC: options.C || '',
        optionD: options.D || '',
        correctAnswer: row.Answer || row.correctAnswer || '',
        explanation: row.Explanation || row.explanation || '',
        tags: (row.Tags || row.tags || '').split(',').map((tag: string) => tag.trim()).filter(Boolean)
      };
    } else {
      // Original format with separate columns
      return {
        id: index + 1,
        question: row.question || '',
        optionA: row.optionA || '',
        optionB: row.optionB || '',
        optionC: row.optionC || '',
        optionD: row.optionD || '',
        correctAnswer: row.correctAnswer || '',
        explanation: row.explanation || '',
        tags: (row.tags || '').split(',').map((tag: string) => tag.trim()).filter(Boolean)
      };
    }
  });
  
  // Filter out invalid questions
  return allQuestions.filter(q => 
    q.question && 
    q.optionA && q.optionB && q.optionC && q.optionD && 
    ['A', 'B', 'C', 'D'].includes(q.correctAnswer)
  );
};

const parseOptionsField = (optionsText: string): { A: string; B: string; C: string; D: string } => {
  const options = { A: '', B: '', C: '', D: '' };
  
  // Split by various newline formats (handles \n, \r\n, and \r)
  const lines = optionsText.split(/\r?\n/).map(line => line.trim()).filter(line => line.length > 0);
  
  let currentOption = '';
  let currentText = '';
  
  for (const line of lines) {
    // Check if line starts with A., B., C., or D.
    const match = line.match(/^([A-D])\.\s*(.*)$/);
    if (match) {
      // Save previous option if exists
      if (currentOption && currentText) {
        options[currentOption as 'A' | 'B' | 'C' | 'D'] = currentText.trim();
      }
      // Start new option
      currentOption = match[1];
      currentText = match[2];
    } else if (currentOption) {
      // Continue previous option (multi-line option text)
      currentText += ' ' + line;
    }
  }
  
  // Save the last option
  if (currentOption && currentText) {
    options[currentOption as 'A' | 'B' | 'C' | 'D'] = currentText.trim();
  }
  
  return options;
};
const validateQuestions = (questions: QuestionData[]): string | null => {
  if (questions.length === 0) {
    return 'No questions found in the file.';
  }
  
  let invalidCount = 0;
  const maxInvalid = 50; // Allow up to 50 invalid questions
  
  for (let i = 0; i < questions.length; i++) {
    const q = questions[i];
    if (!q.question) {
      invalidCount++;
      if (invalidCount > maxInvalid) {
        return `Too many questions with missing question text (more than ${maxInvalid}).`;
      }
      continue;
    }
    if (!q.optionA || !q.optionB || !q.optionC || !q.optionD) {
      invalidCount++;
      if (invalidCount > maxInvalid) {
        return `Too many questions with missing answer options (more than ${maxInvalid}).`;
      }
      continue;
    }
    if (!['A', 'B', 'C', 'D'].includes(q.correctAnswer)) {
      invalidCount++;
      if (invalidCount > maxInvalid) {
        return `Too many questions with invalid correct answers (more than ${maxInvalid}).`;
      }
      continue;
    }
  }
  
  // Filter out invalid questions
  const validQuestions = questions.filter(q => 
    q.question && 
    q.optionA && q.optionB && q.optionC && q.optionD && 
    ['A', 'B', 'C', 'D'].includes(q.correctAnswer)
  );
  
  if (validQuestions.length === 0) {
    return 'No valid questions found in the file.';
  }
  
  if (invalidCount > 0) {
    console.warn(`Skipped ${invalidCount} invalid questions. Loaded ${validQuestions.length} valid questions.`);
  }
  
  return null;
};
export const convertToCSV = (questions: QuestionData[]): string => {
  const headers = ['question', 'optionA', 'optionB', 'optionC', 'optionD', 'correctAnswer', 'explanation', 'tags'];
  const rows = questions.map(q => [q.question, q.optionA, q.optionB, q.optionC, q.optionD, q.correctAnswer, q.explanation, q.tags.join(',')].map(value => `"${value.replace(/"/g, '""')}"`).join(','));
  return [headers.join(','), ...rows].join('\n');
};
export const exportToCSV = (questions: QuestionData[], filename: string): void => {
  const csv = convertToCSV(questions);
  const blob = new Blob([csv], {
    type: 'text/csv;charset=utf-8;'
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};