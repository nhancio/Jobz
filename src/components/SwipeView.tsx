import { useState, useEffect } from 'react';
import { motion, useMotionValue, useTransform, AnimatePresence } from 'motion/react';
import { Heart, X, MessageCircle, Briefcase, User, Loader2 } from 'lucide-react';
import { View } from '../App';
import { Job, Candidate } from '../data/mockData';
import { JobCard } from './JobCard';
import { CandidateCard } from './CandidateCard';
import { fetchJobs, fetchCandidates } from '../lib/fetchProfiles';

interface SwipeViewProps {
  mode: 'seeker' | 'employer';
  onMatch: (item: Job | Candidate) => void;
  onNavigate: (view: View) => void;
}

export function SwipeView({ mode, onMatch, onNavigate }: SwipeViewProps) {
  const [items, setItems] = useState<(Job | Candidate)[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [exitDirection, setExitDirection] = useState<'left' | 'right' | null>(null);

  // Fetch data from Supabase on mount
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        if (mode === 'seeker') {
          const jobs = await fetchJobs();
          setItems(jobs);
        } else {
          const candidates = await fetchCandidates();
          setItems(candidates);
        }
      } catch (error) {
        console.error('Error loading data:', error);
        // If Supabase fails, items will remain empty array
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [mode]);

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

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-slate-50">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
          <p className="text-slate-600">Loading {mode === 'seeker' ? 'jobs' : 'candidates'}...</p>
        </div>
      </div>
    );
  }

  // Show empty state if no items
  if (!currentItem || items.length === 0) {
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
    <div className="min-h-screen p-2 sm:p-4 flex flex-col bg-slate-50">
      {/* Header */}
      <div className="max-w-md w-full mx-auto mb-2 sm:mb-4 flex-shrink-0 px-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg">
              <Briefcase className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>
            <h1 className="text-lg sm:text-xl font-bold text-slate-900">
              {mode === 'seeker' ? 'Find Jobs' : 'Find Talent'}
            </h1>
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={() => onNavigate('profile')}
              className="w-10 h-10 sm:w-12 sm:h-12 bg-white rounded-xl flex items-center justify-center active:shadow-md transition-all border border-slate-200 touch-manipulation"
              title="View Profile"
            >
              <User className="w-4 h-4 sm:w-5 sm:h-5 text-slate-600" />
            </button>
            <button
              onClick={() => onNavigate('matches')}
              className="w-10 h-10 sm:w-12 sm:h-12 bg-white rounded-xl flex items-center justify-center active:shadow-md transition-all border border-slate-200 touch-manipulation"
              title="Matches"
            >
              <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5 text-slate-600" />
            </button>
          </div>
        </div>
      </div>

      {/* Card Stack */}
      <div className="max-w-md w-full mx-auto relative flex-1 min-h-[400px] sm:min-h-[500px] px-2">
        <AnimatePresence mode="wait">
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
      <div className="max-w-md w-full mx-auto mt-4 sm:mt-6 flex items-center justify-center gap-6 sm:gap-8 pb-4 sm:pb-6">
        <motion.button
          whileTap={{ scale: 0.85 }}
          onClick={() => handleSwipe('left')}
          className="w-14 h-14 sm:w-16 sm:h-16 bg-white rounded-full shadow-lg flex items-center justify-center active:shadow-xl transition-all border border-slate-100 text-slate-400 active:text-red-500 touch-manipulation"
          aria-label="Pass"
        >
          <X className="w-7 h-7 sm:w-8 sm:h-8" />
        </motion.button>
        <motion.button
          whileTap={{ scale: 0.85 }}
          onClick={() => handleSwipe('right')}
          className="w-18 h-18 sm:w-20 sm:h-20 bg-blue-600 rounded-full shadow-xl flex items-center justify-center active:shadow-2xl active:bg-blue-700 transition-all text-white touch-manipulation"
          aria-label="Like"
        >
          <Heart className="w-9 h-9 sm:w-10 sm:h-10" fill="currentColor" />
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
  const rotate = useTransform(x, [-300, 300], [-20, 20]);
  const opacity = useTransform(x, [-300, -150, 0, 150, 300], [0, 0.5, 1, 0.5, 0]);
  
  // Calculate threshold based on screen width for better mobile experience
  const swipeThreshold = typeof window !== 'undefined' ? Math.min(window.innerWidth * 0.25, 100) : 100;

  const handleDragEnd = (_event: any, info: any) => {
    const threshold = swipeThreshold;
    if (Math.abs(info.offset.x) > threshold || Math.abs(info.velocity.x) > 500) {
      onSwipe(info.offset.x > 0 ? 'right' : 'left');
    } else {
      // Spring back to center if not swiped far enough
      x.set(0);
    }
  };

  return (
    <motion.div
      style={{ 
        x, 
        rotate, 
        opacity,
        willChange: 'transform',
        touchAction: 'pan-y pinch-zoom',
      } as any}
      drag="x"
      dragConstraints={{ left: -300, right: 300 }}
      dragElastic={0.2}
      dragMomentum={false}
      onDragEnd={handleDragEnd}
      exit={{
        x: exitDirection === 'right' ? (typeof window !== 'undefined' ? window.innerWidth : 400) : (typeof window !== 'undefined' ? -window.innerWidth : -400),
        opacity: 0,
        scale: 0.8,
        transition: { 
          duration: 0.2,
          ease: [0.4, 0, 0.2, 1]
        }
      }}
      initial={{ scale: 0.95, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
      className="absolute inset-0 cursor-grab active:cursor-grabbing swipe-card"
    >
      {mode === 'seeker' ? (
        <JobCard job={item as Job} />
      ) : (
        <CandidateCard candidate={item as Candidate} />
      )}
    </motion.div>
  );
}
