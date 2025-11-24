import React from 'react';
import { motion } from 'framer-motion';
import { HeartIcon, RefreshCwIcon, EyeIcon, BarChartIcon } from 'lucide-react';
interface GameOverModalProps {
  isVisible: boolean;
  onContinuePractice: () => void;
  onViewResults: () => void;
  onRestart: () => void;
}
const GameOverModal: React.FC<GameOverModalProps> = ({
  isVisible,
  onContinuePractice,
  onViewResults,
  onRestart
}) => {
  if (!isVisible) return null;
  return <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60"></div>
      <motion.div className="glass-card relative z-10 p-6 max-w-md w-full" initial={{
      scale: 0.8,
      y: 20
    }} animate={{
      scale: 1,
      y: 0
    }}>
        <div className="text-center mb-6">
          <div className="flex justify-center mb-4">
            <HeartIcon size={64} className="text-red-500" />
          </div>
          <h2 className="text-3xl font-bold mb-2 neon-text">Game Over</h2>
          <p className="text-white/80">
            You've run out of lives! Choose what you'd like to do next.
          </p>
        </div>
        <div className="space-y-3">
          <button className="glass-button w-full flex items-center justify-center bg-indigo-500/30 hover:bg-indigo-500/40" onClick={onContinuePractice}>
            <EyeIcon size={18} className="mr-2" />
            Continue Practice
            <span className="text-xs ml-2 opacity-70">(No XP)</span>
          </button>
          <button className="glass-button w-full flex items-center justify-center bg-purple-500/30 hover:bg-purple-500/40" onClick={onViewResults}>
            <BarChartIcon size={18} className="mr-2" />
            View Results
          </button>
          <button className="glass-button w-full flex items-center justify-center" onClick={onRestart}>
            <RefreshCwIcon size={18} className="mr-2" />
            Restart Session
          </button>
        </div>
      </motion.div>
    </div>;
};
export default GameOverModal;