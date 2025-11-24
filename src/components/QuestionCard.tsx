import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckIcon, XIcon, SparklesIcon } from 'lucide-react';
interface Question {
  id: number;
  question: string;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
  correctAnswer: 'A' | 'B' | 'C' | 'D';
  explanation: string;
}
interface Answer {
  selectedOption: string | null;
  isCorrect: boolean;
}
interface QuestionCardProps {
  question: Question;
  answer: Answer | null;
  onAnswer: (selectedOption: string) => void;
  reviewMode: boolean;
}
const QuestionCard: React.FC<QuestionCardProps> = ({
  question,
  answer,
  onAnswer,
  reviewMode
}) => {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  // Reset selected option when question changes
  useEffect(() => {
    setSelectedOption(answer?.selectedOption || null);
    setShowExplanation(!!answer?.selectedOption);
    setShowFeedback(false);
  }, [question.id, answer]);
  const handleOptionSelect = (option: string) => {
    if (selectedOption || reviewMode) return;
    setSelectedOption(option);
    setShowFeedback(true);
    // Delay showing explanation for animation
    setTimeout(() => {
      setShowExplanation(true);
    }, 400);
    onAnswer(option);
  };
  const getOptionClass = (option: string) => {
    if (!selectedOption && !reviewMode) {
      return 'bg-white/10 hover:bg-white/15 hover:scale-[1.01]';
    }
    if (option === question.correctAnswer) {
      return 'bg-green-500/30 border-green-500/50';
    }
    if (option === selectedOption && option !== question.correctAnswer) {
      return 'bg-red-500/30 border-red-500/50';
    }
    return 'bg-white/5 opacity-70';
  };
  return <AnimatePresence mode="wait">
      <motion.div key={question.id} className="glass-card overflow-hidden" initial={{
      opacity: 0,
      x: 20
    }} animate={{
      opacity: 1,
      x: 0
    }} exit={{
      opacity: 0,
      x: -20
    }} transition={{
      duration: 0.3
    }}>
        <div className="question-text mb-6">
          <h3 className="text-xl font-medium mb-2">Question</h3>
          <motion.p initial={{
          opacity: 0,
          y: 10
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          delay: 0.1
        }}>
            {question.question}
          </motion.p>
        </div>
        <div className="options space-y-3 mb-6">
          {[{
          key: 'A',
          text: question.optionA
        }, {
          key: 'B',
          text: question.optionB
        }, {
          key: 'C',
          text: question.optionC
        }, {
          key: 'D',
          text: question.optionD
        }].map(({
          key,
          text
        }, index) => <motion.button key={key} className={`option w-full text-left p-4 rounded-lg border border-white/10 transition-all duration-200 flex items-start ${getOptionClass(key)}`} onClick={() => handleOptionSelect(key)} disabled={!!selectedOption || reviewMode} initial={{
          opacity: 0,
          y: 10
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          delay: 0.15 + index * 0.05
        }} whileHover={!selectedOption && !reviewMode ? {
          scale: 1.01
        } : {}} whileTap={!selectedOption && !reviewMode ? {
          scale: 0.99
        } : {}}>
              <span className="option-key w-8 h-8 rounded-full bg-white/10 flex items-center justify-center mr-3 flex-shrink-0">
                {key}
              </span>
              <span className="option-text flex-grow">{text}</span>
              <AnimatePresence>
                {selectedOption && key === question.correctAnswer && <motion.div initial={{
              scale: 0,
              rotate: -180
            }} animate={{
              scale: 1,
              rotate: 0
            }} exit={{
              scale: 0
            }} transition={{
              type: 'spring',
              stiffness: 200,
              damping: 15
            }}>
                    <CheckIcon size={20} className="text-green-400 ml-2 flex-shrink-0" />
                  </motion.div>}
                {selectedOption === key && key !== question.correctAnswer && <motion.div initial={{
              scale: 0,
              rotate: 180
            }} animate={{
              scale: 1,
              rotate: 0
            }} exit={{
              scale: 0
            }} transition={{
              type: 'spring',
              stiffness: 200,
              damping: 15
            }}>
                    <XIcon size={20} className="text-red-400 ml-2 flex-shrink-0" />
                  </motion.div>}
              </AnimatePresence>
            </motion.button>)}
        </div>
        <AnimatePresence>
          {showExplanation && <motion.div className="explanation mt-6 p-4 rounded-lg bg-white/5 border border-white/10" initial={{
          opacity: 0,
          height: 0,
          marginTop: 0
        }} animate={{
          opacity: 1,
          height: 'auto',
          marginTop: 24
        }} exit={{
          opacity: 0,
          height: 0,
          marginTop: 0
        }} transition={{
          duration: 0.3
        }}>
              <motion.h4 className="font-semibold mb-2 flex items-center" initial={{
            opacity: 0,
            x: -10
          }} animate={{
            opacity: 1,
            x: 0
          }} transition={{
            delay: 0.2
          }}>
                <span className="w-6 h-6 rounded-full bg-gradient-to-br from-teal-500 to-blue-500 flex items-center justify-center mr-2 text-sm">
                  {question.correctAnswer}
                </span>
                Explanation
              </motion.h4>
              <motion.p className="text-white/80" initial={{
            opacity: 0
          }} animate={{
            opacity: 1
          }} transition={{
            delay: 0.3
          }}>
                {question.explanation}
              </motion.p>
            </motion.div>}
        </AnimatePresence>
        {/* Feedback animation overlay */}
        <AnimatePresence>
          {showFeedback && selectedOption === question.correctAnswer && <motion.div className="absolute inset-0 pointer-events-none flex items-center justify-center" initial={{
          opacity: 0
        }} animate={{
          opacity: 1
        }} exit={{
          opacity: 0
        }} transition={{
          duration: 0.5
        }}>
              <motion.div initial={{
            scale: 0,
            rotate: -180
          }} animate={{
            scale: 1.5,
            rotate: 0
          }} exit={{
            scale: 0,
            opacity: 0
          }} transition={{
            type: 'spring',
            stiffness: 200,
            damping: 20
          }}>
                <SparklesIcon size={64} className="text-green-400" />
              </motion.div>
            </motion.div>}
        </AnimatePresence>
      </motion.div>
    </AnimatePresence>;
};
export default QuestionCard;