import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FlameIcon } from 'lucide-react';
interface StreakModalProps {
  streak: number;
  isVisible: boolean;
  onClose: () => void;
}
const StreakModal: React.FC<StreakModalProps> = ({
  streak,
  isVisible,
  onClose
}) => {
  // Auto-dismiss after 3 seconds
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onClose();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);
  return <AnimatePresence>
      {isVisible && <motion.div className="fixed inset-0 z-50 flex items-center justify-center p-4" initial={{
      opacity: 0
    }} animate={{
      opacity: 1
    }} exit={{
      opacity: 0
    }}>
          <div className="absolute inset-0 bg-black/40" onClick={onClose}></div>
          <motion.div className="glass-card relative z-10 p-6 text-center max-w-md w-full" initial={{
        scale: 0.8,
        y: 20
      }} animate={{
        scale: 1,
        y: 0
      }} exit={{
        scale: 0.8,
        y: 20
      }}>
            <div className="flex justify-center mb-4">
              {[...Array(3)].map((_, i) => <motion.div key={i} initial={{
            rotate: 0,
            scale: 1
          }} animate={{
            rotate: [0, 15, -15, 0],
            scale: [1, 1.2, 1]
          }} transition={{
            duration: 0.5,
            delay: i * 0.2,
            repeat: Infinity,
            repeatDelay: 1.5
          }} className={`text-orange-500 mx-1 ${i === 1 ? 'text-4xl' : 'text-3xl'}`}>
                  <FlameIcon size={i === 1 ? 64 : 48} fill="#f97316" />
                </motion.div>)}
            </div>
            <h2 className="text-3xl font-bold mb-2 neon-text">
              {streak} Streak!
            </h2>
            <p className="text-white/80 mb-6">
              {streak >= 20 ? "Incredible! You're on fire!" : streak >= 10 ? 'Amazing streak! Keep it going!' : "You're on a roll! Keep it up!"}
            </p>
            <motion.div className="w-full h-2 bg-white/10 rounded-full overflow-hidden mb-6" initial={{
          width: '0%'
        }} animate={{
          width: '100%'
        }} transition={{
          duration: 3
        }}>
              <div className="h-full bg-gradient-to-r from-orange-500 to-red-500"></div>
            </motion.div>
            <button className="glass-button bg-white/20 hover:bg-white/30" onClick={onClose}>
              Continue Now
            </button>
          </motion.div>
        </motion.div>}
    </AnimatePresence>;
};
export default StreakModal;