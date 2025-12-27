import { motion } from 'motion/react';
import { ArrowLeft, MessageSquare, Briefcase } from 'lucide-react';
import { Job, Candidate } from '../data/mockData';

interface MatchesViewProps {
  matches: (Job | Candidate)[];
  mode: 'seeker' | 'employer';
  onBack: () => void;
}

export function MatchesView({ matches, mode, onBack }: MatchesViewProps) {
  const isJob = (item: Job | Candidate): item is Job => {
    return (item as Job).company !== undefined;
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-md p-4 border-b border-slate-200">
          <div className="flex items-center justify-between">
            <button
              onClick={onBack}
              className="flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors font-medium"
            >
              <ArrowLeft className="w-5 h-5" />
              Back
            </button>
            <h2 className="text-lg font-bold text-slate-900">
              {mode === 'seeker' ? 'Applied Jobs' : 'Shortlisted Candidates'}
            </h2>
            <div className="w-16" />
          </div>
        </div>

        <div className="p-6">
          {matches.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-20"
            >
              <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Briefcase className="w-10 h-10 text-slate-400" />
              </div>
              <h3 className="text-slate-900 font-semibold mb-2">No matches yet</h3>
              <p className="text-slate-600">
                {mode === 'seeker' 
                  ? 'Start applying to jobs to see them here!'
                  : 'Start shortlisting candidates to see them here!'}
              </p>
            </motion.div>
          ) : (
            <div className="space-y-4">
              {matches.map((match, idx) => (
                <motion.div
                  key={match.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200 flex items-center gap-4 hover:shadow-md transition-all cursor-pointer"
                >
                  {isJob(match) ? (
                    // Job List Item
                    <>
                      <img 
                        src={match.logo} 
                        alt={match.company} 
                        className="w-16 h-16 rounded-xl object-cover border border-slate-100"
                      />
                      <div className="flex-1">
                        <h3 className="font-bold text-slate-900">{match.title}</h3>
                        <p className="text-slate-600 text-sm">{match.company}</p>
                        <p className="text-slate-400 text-xs mt-1">{match.location}</p>
                      </div>
                    </>
                  ) : (
                    // Candidate List Item
                    <>
                      <img 
                        src={(match as Candidate).avatar} 
                        alt={(match as Candidate).name} 
                        className="w-16 h-16 rounded-full object-cover border border-slate-100"
                      />
                      <div className="flex-1">
                        <h3 className="font-bold text-slate-900">{(match as Candidate).name}</h3>
                        <p className="text-slate-600 text-sm">{(match as Candidate).title}</p>
                        <p className="text-slate-400 text-xs mt-1">{(match as Candidate).experience} experience</p>
                      </div>
                    </>
                  )}
                  
                  <button className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors">
                    <MessageSquare className="w-5 h-5" />
                  </button>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
