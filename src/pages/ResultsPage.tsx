import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { DownloadIcon, HomeIcon, BarChart2Icon, RotateCwIcon, ShareIcon, TagIcon } from 'lucide-react';
import { usePractice } from '../contexts/PracticeContext';
import { useProgress } from '../contexts/ProgressContext';
import { exportToCSV } from '../utils/fileParser';
interface TagStats {
  tag: string;
  correct: number;
  total: number;
  percentage: number;
}
const ResultsPage: React.FC = () => {
  const {
    currentSession
  } = usePractice();
  const {
    sessionResults
  } = useProgress();
  const [tagStats, setTagStats] = useState<TagStats[]>([]);
  const navigate = useNavigate();
  // Get the most recent session result
  const latestResult = sessionResults[sessionResults.length - 1];
  // Redirect if no session data
  useEffect(() => {
    if (!currentSession || !latestResult) {
      navigate('/');
    }
  }, [currentSession, latestResult, navigate]);
  // Calculate tag statistics
  useEffect(() => {
    if (!currentSession) return;
    const tagMap = new Map<string, {
      correct: number;
      total: number;
    }>();
    currentSession.questions.forEach((question, index) => {
      const answer = currentSession.answers[index];
      question.tags.forEach(tag => {
        if (!tagMap.has(tag)) {
          tagMap.set(tag, {
            correct: 0,
            total: 0
          });
        }
        const stats = tagMap.get(tag)!;
        stats.total += 1;
        if (answer.isCorrect) {
          stats.correct += 1;
        }
      });
    });
    const stats = Array.from(tagMap.entries()).map(([tag, {
      correct,
      total
    }]) => ({
      tag,
      correct,
      total,
      percentage: Math.round(correct / total * 100)
    })).sort((a, b) => b.total - a.total);
    setTagStats(stats);
  }, [currentSession]);
  if (!currentSession || !latestResult) {
    return <div className="text-center p-8">Loading...</div>;
  }
  // Calculate results
  const correctAnswers = currentSession.answers.filter(a => a.isCorrect).length;
  const totalQuestions = currentSession.questions.length;
  const score = Math.round(correctAnswers / totalQuestions * 100);
  // Get incorrect questions
  const incorrectQuestions = currentSession.questions.filter((_, index) => !currentSession.answers[index].isCorrect);
  // Export incorrect questions
  const handleExportIncorrect = () => {
    exportToCSV(incorrectQuestions, 'pmp-incorrect-questions.csv');
  };
  return <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center neon-text">
          Session Results
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="glass-card flex flex-col items-center">
            <h2 className="text-xl font-semibold mb-4">Score</h2>
            <motion.div className="relative w-36 h-36 mb-4" initial={{
            opacity: 0,
            scale: 0.8
          }} animate={{
            opacity: 1,
            scale: 1
          }} transition={{
            duration: 0.5
          }}>
              <div className="absolute inset-0 rounded-full border-4 border-white/10"></div>
              <svg className="w-full h-full" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="40" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="8" />
                <motion.circle cx="50" cy="50" r="40" fill="none" stroke="url(#scoreGradient)" strokeWidth="8" strokeDasharray="251.2" strokeDashoffset="251.2" strokeLinecap="round" initial={{
                strokeDashoffset: 251.2
              }} animate={{
                strokeDashoffset: 251.2 - 251.2 * score / 100
              }} transition={{
                duration: 1.5,
                delay: 0.3
              }} />
                <defs>
                  <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#4f46e5" />
                    <stop offset="100%" stopColor="#ec4899" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <motion.span className="text-4xl font-bold" initial={{
                opacity: 0
              }} animate={{
                opacity: 1
              }} transition={{
                duration: 0.5,
                delay: 1
              }}>
                  {score}%
                </motion.span>
              </div>
            </motion.div>
            <p className="text-white/80 text-center">
              {correctAnswers} correct out of {totalQuestions} questions
            </p>
          </div>
          <div className="glass-card flex flex-col items-center">
            <h2 className="text-xl font-semibold mb-4">XP Earned</h2>
            <motion.div className="text-5xl font-bold mb-2 text-indigo-400" initial={{
            opacity: 0,
            y: 20
          }} animate={{
            opacity: 1,
            y: 0
          }} transition={{
            duration: 0.5,
            delay: 0.2
          }}>
              +{currentSession.xp}
            </motion.div>
            <div className="flex flex-col items-center">
              <div className="flex items-center mb-1">
                <span className="text-white/80 mr-2">Total XP:</span>
                <span className="font-semibold">{latestResult.xp}</span>
              </div>
              <div className="w-full h-3 bg-white/10 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-indigo-500 to-purple-500" style={{
                width: `${Math.min(100, latestResult.xp / 1000 * 100)}%`
              }}></div>
              </div>
            </div>
          </div>
          <div className="glass-card flex flex-col items-center">
            <h2 className="text-xl font-semibold mb-4">Best Streak</h2>
            <motion.div className="flex items-center justify-center mb-2" initial={{
            scale: 0.5,
            opacity: 0
          }} animate={{
            scale: 1,
            opacity: 1
          }} transition={{
            duration: 0.5,
            delay: 0.4
          }}>
              <div className="text-5xl font-bold text-orange-400">
                {currentSession.streak}
              </div>
              <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="#f97316" stroke="#f97316" strokeWidth="1" className="ml-2">
                <path d="M12 2C10.22 2 7 7.7 7 13c0 5.3 3.47 9 5 9s5-3.7 5-9c0-5.3-3.22-11-5-11z" />
              </svg>
            </motion.div>
            {currentSession.streak >= 10 ? <div className="text-center text-white/80">
                <span className="text-yellow-400 font-semibold">
                  Impressive!
                </span>{' '}
                You're on fire!
              </div> : currentSession.streak >= 5 ? <div className="text-center text-white/80">
                Great streak! Keep practicing!
              </div> : <div className="text-center text-white/80">
                Try to build longer streaks!
              </div>}
          </div>
        </div>
        <div className="glass-card mb-8">
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <TagIcon size={20} className="mr-2" />
            Performance by Topic
          </h2>
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="py-3 px-4 text-left">Topic</th>
                  <th className="py-3 px-4 text-center">Correct</th>
                  <th className="py-3 px-4 text-center">Total</th>
                  <th className="py-3 px-4 text-center">Percentage</th>
                </tr>
              </thead>
              <tbody>
                {tagStats.map((stat, index) => <tr key={index} className="border-b border-white/5">
                    <td className="py-3 px-4">{stat.tag}</td>
                    <td className="py-3 px-4 text-center">{stat.correct}</td>
                    <td className="py-3 px-4 text-center">{stat.total}</td>
                    <td className="py-3 px-4 text-center">
                      <div className="flex items-center justify-center">
                        <div className="w-full max-w-[100px] h-2 bg-white/10 rounded-full overflow-hidden mr-2">
                          <div className={`h-full ${stat.percentage >= 80 ? 'bg-green-500' : stat.percentage >= 60 ? 'bg-yellow-500' : 'bg-red-500'}`} style={{
                        width: `${stat.percentage}%`
                      }}></div>
                        </div>
                        <span>{stat.percentage}%</span>
                      </div>
                    </td>
                  </tr>)}
              </tbody>
            </table>
          </div>
        </div>
        {incorrectQuestions.length > 0 && <div className="glass-card mb-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold flex items-center">
                <XIcon size={20} className="mr-2 text-red-400" />
                Incorrect Answers ({incorrectQuestions.length})
              </h2>
              <button className="glass-button flex items-center text-sm" onClick={handleExportIncorrect}>
                <DownloadIcon size={16} className="mr-1" />
                Export
              </button>
            </div>
            <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
              {incorrectQuestions.map((question, index) => <div key={index} className="p-4 rounded-lg bg-white/5 border border-white/10">
                  <p className="mb-2 font-medium">{question.question}</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-3">
                    <div className="text-sm text-white/70">
                      <span className="text-red-400 font-medium">
                        Your answer:{' '}
                      </span>
                      {(() => {
                  const answerIndex = currentSession.questions.findIndex(q => q.id === question.id);
                  const option = currentSession.answers[answerIndex]?.selectedOption;
                  if (option === 'A') return question.optionA;
                  if (option === 'B') return question.optionB;
                  if (option === 'C') return question.optionC;
                  if (option === 'D') return question.optionD;
                  return 'None';
                })()}
                    </div>
                    <div className="text-sm text-white/70">
                      <span className="text-green-400 font-medium">
                        Correct answer:{' '}
                      </span>
                      {(() => {
                  if (question.correctAnswer === 'A') return question.optionA;
                  if (question.correctAnswer === 'B') return question.optionB;
                  if (question.correctAnswer === 'C') return question.optionC;
                  if (question.correctAnswer === 'D') return question.optionD;
                  return 'Unknown';
                })()}
                    </div>
                  </div>
                  <div className="text-sm text-white/70">
                    <span className="text-white/90 font-medium">
                      Explanation:{' '}
                    </span>
                    {question.explanation}
                  </div>
                </div>)}
            </div>
          </div>}
        <div className="flex flex-wrap justify-center gap-4">
          <button className="glass-button flex items-center" onClick={() => navigate('/')}>
            <HomeIcon size={18} className="mr-2" />
            Return Home
          </button>
          <button className="glass-button flex items-center bg-indigo-500/30 hover:bg-indigo-500/40" onClick={() => navigate('/practice')}>
            <RotateCwIcon size={18} className="mr-2" />
            Start New Practice
          </button>
          <button className="glass-button flex items-center" onClick={() => navigate('/progress')}>
            <BarChart2Icon size={18} className="mr-2" />
            View Progress
          </button>
          <button className="glass-button flex items-center">
            <ShareIcon size={18} className="mr-2" />
            Share Results
          </button>
        </div>
      </div>
    </div>;
};
// Helper component for the X icon
const XIcon: React.FC<{
  size: number;
  className?: string;
}> = ({
  size,
  className
}) => {
  return <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <line x1="18" y1="6" x2="6" y2="18"></line>
      <line x1="6" y1="6" x2="18" y2="18"></line>
    </svg>;
};
export default ResultsPage;