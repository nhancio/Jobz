import { motion } from 'motion/react';
import { Briefcase, Search, ArrowRight } from 'lucide-react';

interface RoleSelectionProps {
  onSelectRole: (role: 'seeker' | 'employer') => void;
}

export function RoleSelection({ onSelectRole }: RoleSelectionProps) {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <div className="max-w-4xl w-full">
        <div className="text-center mb-12">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl font-bold text-slate-900 mb-4"
          >
            Welcome to JobSwipe
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg text-slate-600"
          >
            Find your next opportunity or candidate in seconds.
          </motion.p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <motion.button
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            onClick={() => onSelectRole('seeker')}
            className="group relative bg-white rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all border border-slate-200 text-left overflow-hidden"
          >
            <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
              <Search className="w-48 h-48 text-blue-500" />
            </div>
            <div className="relative z-10">
              <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Search className="w-8 h-8 text-blue-600" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900 mb-2">I'm a Job Seeker</h2>
              <p className="text-slate-600 mb-6">
                Browse thousands of jobs and swipe right to apply instantly.
              </p>
              <div className="flex items-center text-blue-600 font-semibold group-hover:gap-2 transition-all">
                Find a Job <ArrowRight className="w-5 h-5 ml-2" />
              </div>
            </div>
          </motion.button>

          <motion.button
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            onClick={() => onSelectRole('employer')}
            className="group relative bg-white rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all border border-slate-200 text-left overflow-hidden"
          >
            <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
              <Briefcase className="w-48 h-48 text-indigo-500" />
            </div>
            <div className="relative z-10">
              <div className="w-16 h-16 bg-indigo-100 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Briefcase className="w-8 h-8 text-indigo-600" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900 mb-2">I'm an Employer</h2>
              <p className="text-slate-600 mb-6">
                Find top talent matching your requirements and connect instantly.
              </p>
              <div className="flex items-center text-indigo-600 font-semibold group-hover:gap-2 transition-all">
                Find Candidates <ArrowRight className="w-5 h-5 ml-2" />
              </div>
            </div>
          </motion.button>
        </div>
      </div>
    </div>
  );
}
