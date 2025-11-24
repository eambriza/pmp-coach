import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeftIcon, ChevronRightIcon, GridIcon, StopCircleIcon } from 'lucide-react';
import { usePractice } from '../contexts/PracticeContext';
import SessionHeader from '../components/SessionHeader';
import QuestionCard from '../components/QuestionCard';
import ReviewGrid from '../components/ReviewGrid';
import StreakModal from '../components/StreakModal';
import GameOverModal from '../components/GameOverModal';
const PracticePage: React.FC = () => {
  const {
    currentSession,
    timeRemaining,
    isPaused,
    togglePause,
    answerQuestion,
    nextQuestion,
    previousQuestion,
    jumpToQuestion,
    endSession,
    resetSession,
    isReviewMode,
    setIsReviewMode
  } = usePractice();
  const [showReviewGrid, setShowReviewGrid] = useState(false);
  const [showStreakModal, setShowStreakModal] = useState(false);
  const [showGameOverModal, setShowGameOverModal] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    if (!currentSession) {
      navigate('/');
    }
  }, [currentSession, navigate]);
  useEffect(() => {
    if (!currentSession) return;
    const streakMilestones = [3, 5, 10, 15, 20];
    if (streakMilestones.includes(currentSession.streak)) {
      setShowStreakModal(true);
    }
  }, [currentSession?.streak]);
  useEffect(() => {
    if (currentSession && currentSession.lives <= 0 && !isReviewMode) {
      setShowGameOverModal(true);
    }
  }, [currentSession?.lives, isReviewMode]);
  if (!currentSession) {
    return <div className="flex items-center justify-center min-h-screen">
        <motion.div initial={{
        opacity: 0
      }} animate={{
        opacity: 1
      }} className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-white mx-auto mb-4"></div>
          <p>Loading...</p>
        </motion.div>
      </div>;
  }
  const currentQuestion = currentSession.questions[currentSession.currentQuestionIndex];
  const currentAnswer = currentSession.answers[currentSession.currentQuestionIndex];
  const handleAnswerQuestion = (selectedOption: string) => {
    answerQuestion(selectedOption);
  };
  const handleContinuePractice = () => {
    setIsReviewMode(true);
    setShowGameOverModal(false);
  };
  const handleViewResults = () => {
    endSession();
  };
  const handleRestart = () => {
    resetSession();
    setShowGameOverModal(false);
  };
  const handleNextQuestion = () => {
    nextQuestion();
  };
  const handlePreviousQuestion = () => {
    previousQuestion();
  };
  return <motion.div className="container mx-auto px-4 py-4" initial={{
    opacity: 0
  }} animate={{
    opacity: 1
  }} transition={{
    duration: 0.4
  }}>
      <SessionHeader timeRemaining={timeRemaining} lives={currentSession.lives} streak={currentSession.streak} xp={currentSession.xp} currentQuestion={currentSession.currentQuestionIndex + 1} totalQuestions={currentSession.questions.length} isPaused={isPaused} onTogglePause={togglePause} />
      <AnimatePresence mode="wait">
        {showReviewGrid && <motion.div initial={{
        opacity: 0,
        height: 0
      }} animate={{
        opacity: 1,
        height: 'auto'
      }} exit={{
        opacity: 0,
        height: 0
      }} transition={{
        duration: 0.3
      }}>
            <ReviewGrid currentIndex={currentSession.currentQuestionIndex} totalQuestions={currentSession.questions.length} answers={currentSession.answers} onQuestionSelect={index => {
          jumpToQuestion(index);
          setShowReviewGrid(false);
        }} />
          </motion.div>}
      </AnimatePresence>
      <QuestionCard question={currentQuestion} answer={currentAnswer} onAnswer={handleAnswerQuestion} reviewMode={isReviewMode} />
      <motion.div className="flex justify-between mt-6" initial={{
      opacity: 0,
      y: 20
    }} animate={{
      opacity: 1,
      y: 0
    }} transition={{
      delay: 0.3
    }}>
        <div className="flex gap-3">
          <motion.button className="glass-button flex items-center" onClick={handlePreviousQuestion} disabled={currentSession.currentQuestionIndex === 0} whileHover={{
          scale: 1.05
        }} whileTap={{
          scale: 0.95
        }}>
            <ChevronLeftIcon size={18} className="mr-1" />
            Previous
          </motion.button>
          <motion.button className="glass-button flex items-center" onClick={() => setShowReviewGrid(prev => !prev)} whileHover={{
          scale: 1.05
        }} whileTap={{
          scale: 0.95
        }}>
            <GridIcon size={18} className="mr-1" />
            {showReviewGrid ? 'Hide Grid' : 'Review Grid'}
          </motion.button>
        </div>
        <div className="flex gap-3">
          <motion.button className="glass-button bg-red-500/20 hover:bg-red-500/30 flex items-center" onClick={endSession} whileHover={{
          scale: 1.05
        }} whileTap={{
          scale: 0.95
        }}>
            <StopCircleIcon size={18} className="mr-1" />
            End Session
          </motion.button>
          {currentAnswer.selectedOption && <motion.button className="glass-button bg-gradient-to-r from-teal-500/30 to-blue-500/30 hover:from-teal-500/40 hover:to-blue-500/40 flex items-center" onClick={handleNextQuestion} disabled={currentSession.currentQuestionIndex === currentSession.questions.length - 1} initial={{
          opacity: 0,
          scale: 0.8
        }} animate={{
          opacity: 1,
          scale: 1
        }} transition={{
          type: 'spring',
          stiffness: 200
        }} whileHover={{
          scale: 1.05
        }} whileTap={{
          scale: 0.95
        }}>
              Next Question
              <ChevronRightIcon size={18} className="ml-1" />
            </motion.button>}
        </div>
      </motion.div>
      <StreakModal streak={currentSession.streak} isVisible={showStreakModal} onClose={() => setShowStreakModal(false)} />
      <GameOverModal isVisible={showGameOverModal} onContinuePractice={handleContinuePractice} onViewResults={handleViewResults} onRestart={handleRestart} />
    </motion.div>;
};
export default PracticePage;