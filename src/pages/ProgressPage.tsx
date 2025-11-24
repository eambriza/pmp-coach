import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { PlayIcon, TrashIcon, CalendarIcon, ClockIcon, CheckIcon } from 'lucide-react';
import { useProgress } from '../contexts/ProgressContext';
import { Line } from 'recharts';
const ProgressPage: React.FC = () => {
  const {
    sessionResults,
    clearAllProgress,
    getTotalXp,
    getAverageScore,
    getTotalQuestionsAnswered,
    getBestStreak
  } = useProgress();
  const navigate = useNavigate();
  // Format date
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit'
    }).format(date);
  };
  // Format time duration
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };
  // Prepare chart data
  const chartData = sessionResults.slice(-10) // Last 10 sessions
  .map((result, index) => ({
    name: `Session ${index + 1}`,
    score: result.score,
    date: formatDate(result.date)
  }));
  // Calculate progress ring percentages
  const accuracyPercentage = getAverageScore();
  const questionsAnswered = getTotalQuestionsAnswered();
  const questionsPercentage = Math.min(100, questionsAnswered / 500 * 100); // 500 as goal
  const xpEarned = getTotalXp();
  const xpPercentage = Math.min(100, xpEarned / 5000 * 100); // 5000 as goal
  return <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center neon-text">
          Your Progress
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <ProgressRing title="Accuracy" percentage={accuracyPercentage} value={`${accuracyPercentage}%`} subtitle="Average score" color="from-green-500 to-emerald-500" delay={0} />
          <ProgressRing title="Questions" percentage={questionsPercentage} value={questionsAnswered} subtitle="Total answered" color="from-blue-500 to-indigo-500" delay={0.2} />
          <ProgressRing title="Experience" percentage={xpPercentage} value={xpEarned} subtitle="Total XP" color="from-purple-500 to-pink-500" delay={0.4} />
        </div>
        <div className="glass-card mb-8">
          <h2 className="text-xl font-semibold mb-6">Performance History</h2>
          {sessionResults.length > 1 ? <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                  <XAxis dataKey="name" stroke="rgba(255,255,255,0.7)" tick={{
                fill: 'rgba(255,255,255,0.7)'
              }} />
                  <YAxis stroke="rgba(255,255,255,0.7)" tick={{
                fill: 'rgba(255,255,255,0.7)'
              }} domain={[0, 100]} tickFormatter={value => `${value}%`} />
                  <Tooltip contentStyle={{
                backgroundColor: 'rgba(15, 23, 42, 0.8)',
                borderColor: 'rgba(255,255,255,0.2)',
                borderRadius: '8px',
                color: 'white'
              }} labelStyle={{
                color: 'white',
                fontWeight: 'bold'
              }} formatter={value => [`${value}%`, 'Score']} labelFormatter={value => chartData[value]?.date || ''} />
                  <Line type="monotone" dataKey="score" stroke="url(#colorScore)" strokeWidth={3} dot={{
                fill: '#6366f1',
                r: 4
              }} activeDot={{
                r: 6,
                fill: '#4f46e5'
              }} />
                  <defs>
                    <linearGradient id="colorScore" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor="#6366f1" />
                      <stop offset="100%" stopColor="#ec4899" />
                    </linearGradient>
                  </defs>
                </LineChart>
              </ResponsiveContainer>
            </div> : <div className="text-center py-8 text-white/70">
              Complete more sessions to see your performance history.
            </div>}
        </div>
        <div className="glass-card mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Recent Sessions</h2>
            <div className="text-sm text-white/70">
              <span className="font-semibold text-white">Best streak:</span>{' '}
              {getBestStreak()}
            </div>
          </div>
          {sessionResults.length > 0 ? <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="py-3 px-4 text-left">Date</th>
                    <th className="py-3 px-4 text-center">Score</th>
                    <th className="py-3 px-4 text-center">Questions</th>
                    <th className="py-3 px-4 text-center">Time</th>
                    <th className="py-3 px-4 text-center">XP</th>
                    <th className="py-3 px-4 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {sessionResults.slice().reverse().slice(0, 10).map((result, index) => <tr key={index} className="border-b border-white/5">
                        <td className="py-3 px-4 flex items-center">
                          <CalendarIcon size={16} className="mr-2 text-white/50" />
                          {formatDate(result.date)}
                        </td>
                        <td className="py-3 px-4 text-center">
                          <span className={`px-2 py-1 rounded-full text-sm ${result.score >= 80 ? 'bg-green-500/20 text-green-400' : result.score >= 60 ? 'bg-yellow-500/20 text-yellow-400' : 'bg-red-500/20 text-red-400'}`}>
                            {result.score}%
                          </span>
                        </td>
                        <td className="py-3 px-4 text-center">
                          <div className="flex items-center justify-center">
                            <CheckIcon size={16} className="mr-1 text-white/50" />
                            {result.questionsCorrect}/{result.questionsTotal}
                          </div>
                        </td>
                        <td className="py-3 px-4 text-center">
                          <div className="flex items-center justify-center">
                            <ClockIcon size={16} className="mr-1 text-white/50" />
                            {formatTime(result.timeSpent)}
                          </div>
                        </td>
                        <td className="py-3 px-4 text-center">
                          <span className="text-indigo-400">+{result.xp}</span>
                        </td>
                        <td className="py-3 px-4 text-center">
                          <button className="text-white/70 hover:text-white transition-colors" onClick={() => navigate(`/results?id=${result.id}`)}>
                            View Details
                          </button>
                        </td>
                      </tr>)}
                </tbody>
              </table>
            </div> : <div className="text-center py-8 text-white/70">
              No sessions recorded yet. Start practicing to track your progress!
            </div>}
        </div>
        <div className="flex flex-wrap justify-center gap-4">
          <button className="glass-button flex items-center bg-indigo-500/30 hover:bg-indigo-500/40" onClick={() => navigate('/practice')}>
            <PlayIcon size={18} className="mr-2" />
            Start New Practice
          </button>
          {sessionResults.length > 0 && <button className="glass-button flex items-center bg-red-500/20 hover:bg-red-500/30" onClick={clearAllProgress}>
              <TrashIcon size={18} className="mr-2" />
              Clear History
            </button>}
        </div>
      </div>
    </div>;
};
interface ProgressRingProps {
  title: string;
  percentage: number;
  value: number | string;
  subtitle: string;
  color: string;
  delay: number;
}
const ProgressRing: React.FC<ProgressRingProps> = ({
  title,
  percentage,
  value,
  subtitle,
  color,
  delay
}) => {
  return <motion.div className="glass-card flex flex-col items-center" initial={{
    opacity: 0,
    y: 20
  }} animate={{
    opacity: 1,
    y: 0
  }} transition={{
    duration: 0.5,
    delay
  }}>
      <h3 className="text-lg font-semibold mb-4">{title}</h3>
      <motion.div className="relative w-32 h-32 mb-2" initial={{
      opacity: 0,
      scale: 0.8
    }} animate={{
      opacity: 1,
      scale: 1
    }} transition={{
      duration: 0.5,
      delay: delay + 0.2
    }}>
        <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="40" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="8" />
          <motion.circle cx="50" cy="50" r="40" fill="none" stroke={`url(#gradient-${title})`} strokeWidth="8" strokeDasharray="251.2" strokeDashoffset="251.2" strokeLinecap="round" initial={{
          strokeDashoffset: 251.2
        }} animate={{
          strokeDashoffset: 251.2 - 251.2 * percentage / 100
        }} transition={{
          duration: 1.5,
          delay: delay + 0.3
        }} />
          <defs>
            <linearGradient id={`gradient-${title}`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" className={`${color.split(' ')[0]}`} />
              <stop offset="100%" className={`${color.split(' ')[1]}`} />
            </linearGradient>
          </defs>
        </svg>
        <div className="absolute inset-0 flex items-center justify-center flex-col">
          <motion.span className="text-2xl font-bold" initial={{
          opacity: 0
        }} animate={{
          opacity: 1
        }} transition={{
          duration: 0.5,
          delay: delay + 0.8
        }}>
            {value}
          </motion.span>
        </div>
      </motion.div>
      <p className="text-white/70 text-center text-sm">{subtitle}</p>
    </motion.div>;
};
// Recharts components (simplified for this example)
const ResponsiveContainer: React.FC<{
  width: string;
  height: string;
  children: React.ReactNode;
}> = ({
  children
}) => <div style={{
  width: '100%',
  height: '100%'
}}>
    {children}
  </div>;
const LineChart: React.FC<{
  data: any[];
  children: React.ReactNode;
}> = ({
  children
}) => <div style={{
  width: '100%',
  height: '100%',
  position: 'relative'
}}>
    {children}
  </div>;
const CartesianGrid: React.FC<{
  strokeDasharray: string;
  stroke: string;
}> = () => null;
const XAxis: React.FC<{
  dataKey: string;
  stroke: string;
  tick: any;
}> = () => null;
const YAxis: React.FC<{
  stroke: string;
  tick: any;
  domain: number[];
  tickFormatter: (value: number) => string;
}> = () => null;
const Tooltip: React.FC<{
  contentStyle: any;
  labelStyle: any;
  formatter: any;
  labelFormatter: any;
}> = () => null;
export default ProgressPage;