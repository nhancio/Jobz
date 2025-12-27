import { useState } from 'react';
import { motion, useMotionValue, useTransform, AnimatePresence } from 'motion/react';
import { Heart, X, MessageCircle, Briefcase } from 'lucide-react';
import { View } from '../App';
import { Job, Candidate, mockJobs, mockCandidates } from '../data/mockData';
import { JobCard } from './JobCard';
import { CandidateCard } from './CandidateCard';

interface SwipeViewProps {
  mode: 'seeker' | 'employer';
  onMatch: (item: Job | Candidate) => void;
  onNavigate: (view: View) => void;
}

export function SwipeView({ mode, onMatch, onNavigate }: SwipeViewProps) {
  const [items, setItems] = useState<(Job | Candidate)[]>(
    mode === 'seeker' ? mockJobs : mockCandidates
  );
  const [currentIndex, setCurrentIndex] = useState(0);
  const [exitDirection, setExitDirection] = useState<'left' | 'right' | null>(null);

  const currentItem = items[currentIndex];

  const handleSwipe = (direction: 'left' | 'right') => {
    if (direction === 'right' && currentItem) {
      onMatch(currentItem);
    }
    setExitDirection(direction);
    setTimeout(() => {
      setCurrentIndex(prev => prev + 1);
      setExitDirection(null);
    }, 300);
  };

  if (!currentItem) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Briefcase className="w-12 h-12 text-blue-600" />
          </div>
          <h2 className="text-slate-800 text-xl font-bold mb-2">
            No more {mode === 'seeker' ? 'jobs' : 'candidates'}
          </h2>
          <p className="text-slate-600 mb-6">Check back later for new opportunities!</p>
          <button
            onClick={() => setCurrentIndex(0)}
            className="px-8 py-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 hover:shadow-lg transition-all font-medium"
          >
            Start Over
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 flex flex-col">
      {/* Header */}
      <div className="max-w-md w-full mx-auto mb-4 flex-shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg">
              <Briefcase className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-xl font-bold text-slate-900">
              {mode === 'seeker' ? 'Find Jobs' : 'Find Talent'}
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => onNavigate('matches')}
              className="w-12 h-12 bg-white rounded-xl flex items-center justify-center hover:shadow-md transition-all border border-slate-200"
            >
              <MessageCircle className="w-5 h-5 text-slate-600" />
            </button>
          </div>
        </div>
      </div>

      {/* Card Stack */}
      <div className="max-w-md w-full mx-auto relative flex-1 min-h-[500px]">
        <AnimatePresence>
          {currentItem && (
            <SwipeCard
              key={currentItem.id}
              item={currentItem}
              mode={mode}
              onSwipe={handleSwipe}
              exitDirection={exitDirection}
            />
          )}
        </AnimatePresence>

        {/* Next card preview */}
        {items[currentIndex + 1] && (
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute inset-0 bg-white/80 rounded-3xl transform scale-95 translate-y-2 -z-10 shadow-lg border border-slate-200" />
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="max-w-md w-full mx-auto mt-6 flex items-center justify-center gap-8 pb-4">
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => handleSwipe('left')}
          className="w-16 h-16 bg-white rounded-full shadow-lg flex items-center justify-center hover:shadow-xl transition-all border border-slate-100 text-slate-400 hover:text-red-500"
        >
          <X className="w-8 h-8" />
        </motion.button>
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => handleSwipe('right')}
          className="w-20 h-20 bg-blue-600 rounded-full shadow-xl flex items-center justify-center hover:shadow-2xl hover:bg-blue-700 transition-all text-white"
        >
          <Heart className="w-10 h-10" fill="currentColor" />
        </motion.button>
      </div>
    </div>
  );
}

interface SwipeCardProps {
  item: Job | Candidate;
  mode: 'seeker' | 'employer';
  onSwipe: (direction: 'left' | 'right') => void;
  exitDirection: 'left' | 'right' | null;
}

function SwipeCard({ item, mode, onSwipe, exitDirection }: SwipeCardProps) {
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-15, 15]);
  const opacity = useTransform(x, [-200, -100, 0, 100, 200], [0, 1, 1, 1, 0]);

  const handleDragEnd = (_event: any, info: any) => {
    if (Math.abs(info.offset.x) > 100) {
      onSwipe(info.offset.x > 0 ? 'right' : 'left');
    }
  };

  return (
    <motion.div
      style={{ x, rotate, opacity }}
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      onDragEnd={handleDragEnd}
      exit={{
        x: exitDirection === 'right' ? 400 : -400,
        opacity: 0,
        transition: { duration: 0.3 }
      }}
      className="absolute inset-0 cursor-grab active:cursor-grabbing"
    >
      {mode === 'seeker' ? (
        <JobCard job={item as Job} />
      ) : (
        <CandidateCard candidate={item as Candidate} />
      )}
    </motion.div>
  );
}
