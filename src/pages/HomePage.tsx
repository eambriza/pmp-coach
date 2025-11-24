import React, { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDropzone } from 'react-dropzone';
import { UploadIcon, FileTextIcon, CheckCircleIcon, AlertCircleIcon, SparklesIcon } from 'lucide-react';
import { usePractice } from '../contexts/PracticeContext';
import { parseFile } from '../utils/fileParser';
const HomePage: React.FC = () => {
  const {
    setQuestions,
    startSession
  } = usePractice();
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const navigate = useNavigate();
  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;
    const file = acceptedFiles[0];
    setFileName(file.name);
    setIsUploading(true);
    setError(null);
    try {
      const parsedQuestions = await parseFile(file);
      setQuestions(parsedQuestions);
      setUploadSuccess(true);
      setIsUploading(false);
    } catch (err) {
      setError((err as Error).message);
      setIsUploading(false);
      setUploadSuccess(false);
    }
  }, [setQuestions]);
  const {
    getRootProps,
    getInputProps,
    isDragActive
  } = useDropzone({
    onDrop,
    accept: {
      'text/csv': ['.csv'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx']
    },
    maxFiles: 1
  });
  const handleStartPractice = () => {
    startSession();
    navigate('/practice');
  };
  
  const {
    questions
  } = usePractice();
  const hasPreloadedQuestions = questions.length > 0;
  return <div className="container mx-auto px-4 py-8">
      <div className="glass-card max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-center">
          Welcome to PMP Drill Coach
        </h1>
        {hasPreloadedQuestions && <div className="bg-green-500/20 border border-green-500/30 rounded-lg p-4 mb-6 flex items-start">
            <CheckCircleIcon size={20} className="text-green-400 mr-3 mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="font-semibold mb-1">Ready to Practice!</h4>
              <p className="text-sm text-white/80">
                {questions.length} PMP questions are preloaded and ready. Click "Start Practice" to begin!
              </p>
            </div>
          </div>}
        <p className="text-center mb-8 text-white/80">
          {hasPreloadedQuestions ? 'Start practicing immediately or upload your own questions.' : 'Upload your PMP questions to start practicing and tracking your progress.'}
        </p>
        <div {...getRootProps()} className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-300 mb-6 ${isDragActive ? 'border-white/50 bg-white/10' : 'border-white/30 hover:border-white/50 hover:bg-white/5'}`}>
          <input {...getInputProps()} />
          <div className="flex flex-col items-center justify-center">
            <UploadIcon size={48} className="mb-4 text-white/70" />
            <h3 className="text-xl font-semibold mb-2">
              {isDragActive ? 'Drop your file here' : 'Drag & drop your question file here'}
            </h3>
            <p className="text-white/70 mb-4">or click to select a file</p>
            <p className="text-sm text-white/50">
              Supported formats: .xlsx, .csv
            </p>
          </div>
        </div>
        {isUploading && <div className="flex items-center justify-center p-4 mb-6">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-white"></div>
            <span className="ml-3">Uploading...</span>
          </div>}
        {error && <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-4 mb-6 flex items-start">
            <AlertCircleIcon size={20} className="text-red-400 mr-3 mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="font-semibold mb-1">Upload Error</h4>
              <p className="text-sm text-white/80">{error}</p>
            </div>
          </div>}
        {uploadSuccess && <div className="bg-green-500/20 border border-green-500/30 rounded-lg p-4 mb-6 flex items-start">
            <CheckCircleIcon size={20} className="text-green-400 mr-3 mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="font-semibold mb-1">Upload Successful</h4>
              <p className="text-sm text-white/80">
                {fileName && <span className="font-medium">{fileName}</span>}{' '}
                has been successfully uploaded.
              </p>
            </div>
          </div>}
        <div className="flex flex-col sm:flex-row justify-center gap-4 mt-8">
          <button className="glass-button flex items-center justify-center" onClick={() => document.querySelector<HTMLInputElement>('input[type="file"]')?.click()}>
            <FileTextIcon size={18} className="mr-2" />
            {hasPreloadedQuestions ? 'Upload Custom Questions' : 'Upload Questions'}
          </button>
          <button className={`glass-button ${!uploadSuccess && !hasPreloadedQuestions ? 'opacity-50 cursor-not-allowed' : 'bg-indigo-500/30 hover:bg-indigo-500/40'}`} disabled={!uploadSuccess && !hasPreloadedQuestions} onClick={handleStartPractice}>
            <PlayIcon size={18} className="mr-2" />
            Start Practice
          </button>
        </div>
      </div>
      <div className="glass-card mt-8 max-w-3xl mx-auto">
        <h2 className="text-xl font-semibold mb-4">
          How to Use PMP Drill Coach
        </h2>
        {hasPreloadedQuestions && <div className="mb-6 p-4 bg-indigo-500/10 rounded-lg border border-indigo-500/20">
            <p className="text-white/90 flex items-center">
              <SparklesIcon size={18} className="mr-2 text-indigo-400" />
              <strong>Quick Start:</strong>&nbsp;Click "Start Practice" to begin with {questions.length} preloaded PMP questions!
            </p>
          </div>}
        <ol className="list-decimal list-inside space-y-3 text-white/80">
          <li>
            {hasPreloadedQuestions ? 'Click "Start Practice" to use preloaded questions, or upload your own' : 'Upload a spreadsheet (.xlsx) or CSV file containing your PMP questions'}
          </li>
          <li>Practice with 20 randomly selected questions per session</li>
          <li>Answer questions within the 25-minute time limit</li>
          <li>Track your progress and improve your PMP exam readiness</li>
        </ol>
        <h3 className="text-lg font-semibold mt-6 mb-2">
          Required File Format
        </h3>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white/5 rounded-lg">
            <thead>
              <tr>
                <th className="py-2 px-4 border-b border-white/10 text-left">
                  Column Name
                </th>
                <th className="py-2 px-4 border-b border-white/10 text-left">
                  Description
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="py-2 px-4 border-b border-white/10">#</td>
                <td className="py-2 px-4 border-b border-white/10">
                  Question number (optional)
                </td>
              </tr>
              <tr>
                <td className="py-2 px-4 border-b border-white/10">Question</td>
                <td className="py-2 px-4 border-b border-white/10">
                  The question text
                </td>
              </tr>
              <tr>
                <td className="py-2 px-4 border-b border-white/10">Options</td>
                <td className="py-2 px-4 border-b border-white/10">
                  All answer options (A, B, C, D) separated by line breaks, each starting with the letter and period (e.g., "A. Option text")
                </td>
              </tr>
              <tr>
                <td className="py-2 px-4 border-b border-white/10">Answer</td>
                <td className="py-2 px-4 border-b border-white/10">
                  Correct answer letter (A, B, C, or D)
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="mt-4 p-4 bg-white/5 rounded-lg">
          <p className="text-sm text-white/70">
            <strong>Example:</strong> Your file should have 1,417 questions with columns: #, Question, Options, Answer
          </p>
        </div>
      </div>
    </div>;
};
// Helper component for the play icon
const PlayIcon: React.FC<{
  size: number;
  className?: string;
}> = ({
  size,
  className
}) => {
  return <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <polygon points="5 3 19 12 5 21 5 3"></polygon>
    </svg>;
};
export default HomePage;