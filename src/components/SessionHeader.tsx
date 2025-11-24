import React from 'react';
import { motion } from 'framer-motion';
import { HeartIcon, FlameIcon, ClockIcon, PauseIcon, PlayIcon } from 'lucide-react';
interface SessionHeaderProps {
  timeRemaining: number;
  lives: number;
  streak: number;
  xp: number;
  currentQuestion: number;
  totalQuestions: number;
  isPaused: boolean;
  onTogglePause: () => void;
}
const SessionHeader: React.FC<SessionHeaderProps> = ({
  timeRemaining,
  lives,
  streak,
  xp,
  currentQuestion,
  totalQuestions,
  isPaused,
  onTogglePause
}) => {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  const xpLevel = Math.min(100, Math.floor(xp / 500 * 100));
  return <motion.div className="glass rounded-xl p-4 mb-6" initial={{
    opacity: 0,
    y: -20
  }} animate={{
    opacity: 1,
    y: 0
  }} transition={{
    duration: 0.4
  }}>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center">
          <motion.div className="flex items-center mr-6" animate={timeRemaining < 60 ? {
          scale: [1, 1.05, 1]
        } : {}} transition={{
          duration: 1,
          repeat: timeRemaining < 60 ? Infinity : 0
        }}>
            <ClockIcon size={20} className={`mr-2 ${timeRemaining < 60 ? 'text-red-400' : 'text-white/80'}`} />
            <span className={`font-mono text-xl ${timeRemaining < 60 ? 'text-red-400' : ''}`}>
              {formatTime(timeRemaining)}
            </span>
            <motion.button className="ml-2 p-1 rounded-full bg-white/10 hover:bg-white/20 transition-colors" onClick={onTogglePause} whileHover={{
            scale: 1.1
          }} whileTap={{
            scale: 0.95
          }}>
              {isPaused ? <PlayIcon size={16} className="text-white" /> : <PauseIcon size={16} className="text-white" />}
            </motion.button>
          </motion.div>
          <div className="flex items-center mr-6">
            <div className="flex">
              {[...Array(3)].map((_, i) => <motion.div key={i} initial={{
              scale: 0
            }} animate={{
              scale: 1
            }} transition={{
              delay: i * 0.1,
              type: 'spring'
            }}>
                  <HeartIcon size={20} className={`${i < lives ? 'text-red-500' : 'text-white/30'} ${i > 0 ? '-ml-1' : ''}`} fill={i < lives ? '#ef4444' : 'none'} />
                </motion.div>)}
            </div>
            <span className="ml-1 text-white/80">{lives}</span>
          </div>
          <motion.div className="flex items-center" animate={streak > 0 ? {
          scale: [1, 1.1, 1]
        } : {}} transition={{
          duration: 0.5
        }}>
            <FlameIcon size={20} className={`mr-1 ${streak > 0 ? 'text-orange-400' : 'text-white/50'}`} fill={streak > 0 ? '#fb923c' : 'none'} />
            <span className={`${streak > 0 ? 'text-orange-400 font-semibold' : 'text-white/80'}`}>
              {streak}
            </span>
          </motion.div>
        </div>
        <div className="flex items-center">
          <div className="mr-4 w-32">
            <div className="flex justify-between mb-1 text-xs">
              <span>XP</span>
              <motion.span key={xp} initial={{
              scale: 1.2,
              color: '#10b4d9'
            }} animate={{
              scale: 1,
              color: '#ffffff'
            }} transition={{
              duration: 0.3
            }}>
                {xp}
              </motion.span>
            </div>
            <div className="h-2 bg-white/10 rounded-full overflow-hidden">
              <motion.div className="h-full bg-gradient-to-r from-teal-500 to-blue-500" initial={{
              width: 0
            }} animate={{
              width: `${xpLevel}%`
            }} transition={{
              duration: 0.5,
              ease: 'easeOut'
            }} />
            </div>
          </div>
          <motion.div className="px-3 py-1 bg-white/10 rounded-lg text-sm" key={currentQuestion} initial={{
          scale: 1.1
        }} animate={{
          scale: 1
        }} transition={{
          type: 'spring',
          stiffness: 300
        }}>
            {currentQuestion} / {totalQuestions}
          </motion.div>
        </div>
      </div>
    </motion.div>;
};
export default SessionHeader;