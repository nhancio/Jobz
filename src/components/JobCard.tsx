import { MapPin, DollarSign, Building2, Clock, CheckCircle2 } from 'lucide-react';
import { Job } from '../data/mockData';

interface JobCardProps {
  job: Job;
}

export function JobCard({ job }: JobCardProps) {
  return (
    <div className="h-full bg-white rounded-2xl sm:rounded-3xl shadow-xl overflow-hidden border border-slate-200 flex flex-col will-change-transform">
      <div className="p-4 sm:p-6 md:p-8 pb-3 sm:pb-4">
        <div className="flex items-start justify-between mb-4 sm:mb-6">
          <img 
            src={job.logo} 
            alt={job.company} 
            className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl sm:rounded-2xl shadow-md object-cover border border-slate-100"
            loading="lazy"
          />
          <span className="px-3 py-1.5 sm:px-4 sm:py-2 bg-blue-50 text-blue-700 rounded-full text-xs sm:text-sm font-semibold">
            {job.postedAt}
          </span>
        </div>
        
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-2 leading-tight">{job.title}</h2>
        <div className="flex items-center gap-2 text-slate-600 font-medium mb-4 sm:mb-6">
          <Building2 className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" />
          <span className="text-sm sm:text-base truncate">{job.company}</span>
        </div>

        <div className="grid grid-cols-2 gap-2 sm:gap-3 mb-4 sm:mb-6">
          <div className="flex items-center gap-1.5 sm:gap-2 text-slate-600 bg-slate-50 p-2 sm:p-3 rounded-lg sm:rounded-xl">
            <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500 shrink-0" />
            <span className="text-xs sm:text-sm truncate">{job.location}</span>
          </div>
          <div className="flex items-center gap-1.5 sm:gap-2 text-slate-600 bg-slate-50 p-2 sm:p-3 rounded-lg sm:rounded-xl">
            <DollarSign className="w-4 h-4 sm:w-5 sm:h-5 text-green-500 shrink-0" />
            <span className="text-xs sm:text-sm truncate">{job.salary}</span>
          </div>
          <div className="flex items-center gap-1.5 sm:gap-2 text-slate-600 bg-slate-50 p-2 sm:p-3 rounded-lg sm:rounded-xl col-span-2">
            <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-orange-500 shrink-0" />
            <span className="text-xs sm:text-sm">{job.type}</span>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 sm:px-6 md:px-8 pb-6 sm:pb-8 overscroll-contain">
        <div className="mb-4 sm:mb-6">
          <h3 className="text-slate-900 font-semibold mb-2 sm:mb-3 text-sm sm:text-base">About the Role</h3>
          <p className="text-slate-600 leading-relaxed text-xs sm:text-sm">
            {job.description}
          </p>
        </div>

        <div>
          <h3 className="text-slate-900 font-semibold mb-2 sm:mb-3 text-sm sm:text-base">Requirements</h3>
          <ul className="space-y-1.5 sm:space-y-2">
            {job.requirements.map((req, idx) => (
              <li key={idx} className="flex items-start gap-2 sm:gap-3 text-slate-600 text-xs sm:text-sm">
                <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500 shrink-0 mt-0.5" />
                <span>{req}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
      
      {/* Gradient fade at bottom for scroll indication */}
      <div className="h-6 sm:h-8 bg-gradient-to-t from-white to-transparent pointer-events-none absolute bottom-0 left-0 right-0" />
    </div>
  );
}
