import React from 'react';
import { CheckIcon, XIcon, HelpCircleIcon } from 'lucide-react';
interface Answer {
  questionId: number;
  selectedOption: string | null;
  isCorrect: boolean;
}
interface ReviewGridProps {
  currentIndex: number;
  totalQuestions: number;
  answers: Answer[];
  onQuestionSelect: (index: number) => void;
}
const ReviewGrid: React.FC<ReviewGridProps> = ({
  currentIndex,
  totalQuestions,
  answers,
  onQuestionSelect
}) => {
  return <div className="glass p-4 rounded-xl mb-6">
      <h3 className="text-lg font-medium mb-3">Question Overview</h3>
      <div className="grid grid-cols-5 sm:grid-cols-10 gap-2">
        {[...Array(totalQuestions)].map((_, index) => {
        const answer = answers[index];
        let bgColor = 'bg-white/10'; // Unanswered
        let icon = <HelpCircleIcon size={16} className="text-white/70" />;
        if (answer.selectedOption) {
          if (answer.isCorrect) {
            bgColor = 'bg-green-500/30';
            icon = <CheckIcon size={16} className="text-green-400" />;
          } else {
            bgColor = 'bg-red-500/30';
            icon = <XIcon size={16} className="text-red-400" />;
          }
        }
        return <button key={index} className={`h-10 rounded-lg flex items-center justify-center ${bgColor} ${index === currentIndex ? 'ring-2 ring-white/50' : 'hover:bg-white/20'}`} onClick={() => onQuestionSelect(index)}>
              {answer.selectedOption ? icon : index + 1}
            </button>;
      })}
      </div>
    </div>;
};
export default ReviewGrid;