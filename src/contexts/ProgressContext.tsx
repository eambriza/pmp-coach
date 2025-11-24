import React, { useEffect, useState, createContext, useContext } from 'react';
interface SessionResult {
  id: string;
  date: Date;
  score: number;
  questionsTotal: number;
  questionsCorrect: number;
  timeSpent: number;
  xp: number;
  streak: number;
}
interface ProgressContextType {
  sessionResults: SessionResult[];
  addSessionResult: (result: SessionResult) => void;
  clearAllProgress: () => void;
  getTotalXp: () => number;
  getAverageScore: () => number;
  getTotalQuestionsAnswered: () => number;
  getBestStreak: () => number;
}
const ProgressContext = createContext<ProgressContextType | undefined>(undefined);
export const useProgress = () => {
  const context = useContext(ProgressContext);
  if (context === undefined) {
    throw new Error('useProgress must be used within a ProgressProvider');
  }
  return context;
};
export const ProgressProvider: React.FC<{
  children: React.ReactNode;
}> = ({
  children
}) => {
  const [sessionResults, setSessionResults] = useState<SessionResult[]>([]);
  useEffect(() => {
    const savedProgress = localStorage.getItem('sessionResults');
    if (savedProgress) {
      try {
        const parsedResults = JSON.parse(savedProgress);
        const resultsWithDates = parsedResults.map((result: any) => ({
          ...result,
          date: new Date(result.date)
        }));
        setSessionResults(resultsWithDates);
      } catch (error) {
        console.error('Error parsing saved progress:', error);
      }
    }
  }, []);
  useEffect(() => {
    localStorage.setItem('sessionResults', JSON.stringify(sessionResults));
  }, [sessionResults]);
  const addSessionResult = (result: SessionResult) => {
    setSessionResults(prev => [...prev, result]);
  };
  const clearAllProgress = () => {
    if (window.confirm('Are you sure you want to clear all progress data? This cannot be undone.')) {
      setSessionResults([]);
      localStorage.removeItem('sessionResults');
    }
  };
  const getTotalXp = () => {
    return sessionResults.reduce((sum, result) => sum + result.xp, 0);
  };
  const getAverageScore = () => {
    if (sessionResults.length === 0) return 0;
    const sum = sessionResults.reduce((sum, result) => sum + result.score, 0);
    return Math.round(sum / sessionResults.length);
  };
  const getTotalQuestionsAnswered = () => {
    return sessionResults.reduce((sum, result) => sum + result.questionsTotal, 0);
  };
  const getBestStreak = () => {
    if (sessionResults.length === 0) return 0;
    return Math.max(...sessionResults.map(result => result.streak));
  };
  const value = {
    sessionResults,
    addSessionResult,
    clearAllProgress,
    getTotalXp,
    getAverageScore,
    getTotalQuestionsAnswered,
    getBestStreak
  };
  return <ProgressContext.Provider value={value}>
      {children}
    </ProgressContext.Provider>;
};