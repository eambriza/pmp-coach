import React, { useEffect, useState, createContext, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProgress } from './ProgressContext';
import preloadedQuestions from '../data/questions.json';
interface Question {
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
interface Answer {
  questionId: number;
  selectedOption: string | null;
  isCorrect: boolean;
  timeSpent: number;
}
interface PracticeSession {
  id: string;
  questions: Question[];
  answers: Answer[];
  startTime: Date;
  endTime: Date | null;
  timeLimit: number;
  currentQuestionIndex: number;
  lives: number;
  streak: number;
  xp: number;
  isComplete: boolean;
}
interface PracticeContextType {
  questions: Question[];
  setQuestions: React.Dispatch<React.SetStateAction<Question[]>>;
  currentSession: PracticeSession | null;
  startSession: () => void;
  endSession: () => void;
  answerQuestion: (selectedOption: string) => void;
  nextQuestion: () => void;
  previousQuestion: () => void;
  jumpToQuestion: (index: number) => void;
  resetSession: () => void;
  timeRemaining: number;
  isPaused: boolean;
  togglePause: () => void;
  isReviewMode: boolean;
  setIsReviewMode: React.Dispatch<React.SetStateAction<boolean>>;
}
const PracticeContext = createContext<PracticeContextType | undefined>(undefined);
export const usePractice = () => {
  const context = useContext(PracticeContext);
  if (context === undefined) {
    throw new Error('usePractice must be used within a PracticeProvider');
  }
  return context;
};
export const PracticeProvider: React.FC<{
  children: React.ReactNode;
}> = ({
  children
}) => {
  const [questions, setQuestions] = useState<Question[]>(preloadedQuestions as Question[]);
  const [currentSession, setCurrentSession] = useState<PracticeSession | null>(null);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isReviewMode, setIsReviewMode] = useState(false);
  const navigate = useNavigate();
  const {
    addSessionResult
  } = useProgress();
  // Initialize or load session from storage
  useEffect(() => {
    const savedSession = localStorage.getItem('currentSession');
    if (savedSession) {
      const parsedSession = JSON.parse(savedSession);
      setCurrentSession(parsedSession);
      // Calculate remaining time
      if (!parsedSession.isComplete) {
        const elapsedMs = new Date().getTime() - new Date(parsedSession.startTime).getTime();
        const remainingMs = Math.max(0, parsedSession.timeLimit * 60 * 1000 - elapsedMs);
        setTimeRemaining(Math.ceil(remainingMs / 1000));
      }
    }
  }, []);
  // Save session to storage whenever it changes
  useEffect(() => {
    if (currentSession) {
      localStorage.setItem('currentSession', JSON.stringify(currentSession));
    }
  }, [currentSession]);
  // Timer logic
  useEffect(() => {
    if (!currentSession || currentSession.isComplete || isPaused || timeRemaining <= 0) return;
    const timer = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          endSession();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [currentSession, isPaused, timeRemaining]);
  // Start a new practice session
  const startSession = () => {
    if (questions.length === 0) return;
    // Select 20 random questions or all if less than 20
    const sessionQuestions = questions.length <= 20 ? [...questions] : [...questions].sort(() => 0.5 - Math.random()).slice(0, 20);
    const newSession: PracticeSession = {
      id: Date.now().toString(),
      questions: sessionQuestions,
      answers: sessionQuestions.map(q => ({
        questionId: q.id,
        selectedOption: null,
        isCorrect: false,
        timeSpent: 0
      })),
      startTime: new Date(),
      endTime: null,
      timeLimit: 25,
      currentQuestionIndex: 0,
      lives: 3,
      streak: 0,
      xp: 0,
      isComplete: false
    };
    setCurrentSession(newSession);
    setTimeRemaining(25 * 60); // 25 minutes in seconds
    setIsPaused(false);
    setIsReviewMode(false);
    navigate('/practice');
  };
  // End the current session
  const endSession = () => {
    if (!currentSession) return;
    const updatedSession = {
      ...currentSession,
      endTime: new Date(),
      isComplete: true
    };
    setCurrentSession(updatedSession);
    // Calculate results
    const correctAnswers = updatedSession.answers.filter(a => a.isCorrect).length;
    const totalQuestions = updatedSession.questions.length;
    const score = Math.round(correctAnswers / totalQuestions * 100);
    // Add to progress history
    addSessionResult({
      id: updatedSession.id,
      date: new Date(),
      score,
      questionsTotal: totalQuestions,
      questionsCorrect: correctAnswers,
      timeSpent: 25 * 60 - timeRemaining,
      xp: updatedSession.xp,
      streak: updatedSession.streak
    });
    navigate('/results');
  };
  // Answer the current question
  const answerQuestion = (selectedOption: string) => {
    if (!currentSession) return;
    const currentQuestion = currentSession.questions[currentSession.currentQuestionIndex];
    const isCorrect = selectedOption === currentQuestion.correctAnswer;
    // Update answer
    const updatedAnswers = [...currentSession.answers];
    updatedAnswers[currentSession.currentQuestionIndex] = {
      ...updatedAnswers[currentSession.currentQuestionIndex],
      selectedOption,
      isCorrect,
      timeSpent: 0 // We would calculate this in a real app
    };
    // Update streak and XP
    let streak = isCorrect ? currentSession.streak + 1 : 0;
    let lives = isCorrect ? currentSession.lives : currentSession.lives - 1;
    // Calculate XP (base + streak bonus)
    let xpGain = 0;
    if (isCorrect) {
      xpGain = 10; // Base XP for correct answer
      // Streak bonuses
      if (streak >= 3) xpGain += 5;
      if (streak >= 5) xpGain += 10;
      if (streak >= 10) xpGain += 20;
      if (streak >= 15) xpGain += 30;
    }
    const updatedSession = {
      ...currentSession,
      answers: updatedAnswers,
      streak,
      lives,
      xp: currentSession.xp + xpGain
    };
    setCurrentSession(updatedSession);
    // Check if game over (lives = 0)
    if (lives <= 0 && !isReviewMode) {
      // We'll handle this in the UI to show game over modal
      // but won't end the session yet to allow the user to choose
    }
  };
  // Move to next question
  const nextQuestion = () => {
    if (!currentSession) return;
    if (currentSession.currentQuestionIndex < currentSession.questions.length - 1) {
      setCurrentSession({
        ...currentSession,
        currentQuestionIndex: currentSession.currentQuestionIndex + 1
      });
    }
  };
  // Move to previous question
  const previousQuestion = () => {
    if (!currentSession) return;
    if (currentSession.currentQuestionIndex > 0) {
      setCurrentSession({
        ...currentSession,
        currentQuestionIndex: currentSession.currentQuestionIndex - 1
      });
    }
  };
  // Jump to specific question
  const jumpToQuestion = (index: number) => {
    if (!currentSession) return;
    if (index >= 0 && index < currentSession.questions.length) {
      setCurrentSession({
        ...currentSession,
        currentQuestionIndex: index
      });
    }
  };
  // Reset the current session
  const resetSession = () => {
    startSession();
  };
  // Toggle pause state
  const togglePause = () => {
    setIsPaused(prev => !prev);
  };
  const value = {
    questions,
    setQuestions,
    currentSession,
    startSession,
    endSession,
    answerQuestion,
    nextQuestion,
    previousQuestion,
    jumpToQuestion,
    resetSession,
    timeRemaining,
    isPaused,
    togglePause,
    isReviewMode,
    setIsReviewMode
  };
  return <PracticeContext.Provider value={value}>
      {children}
    </PracticeContext.Provider>;
};