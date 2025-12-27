import { MapPin, DollarSign, Building2, Clock, CheckCircle2 } from 'lucide-react';
import { Job } from '../data/mockData';

interface JobCardProps {
  job: Job;
}

export function JobCard({ job }: JobCardProps) {
  return (
    <div className="h-full bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-200 flex flex-col">
      <div className="p-8 pb-4">
        <div className="flex items-start justify-between mb-6">
          <img 
            src={job.logo} 
            alt={job.company} 
            className="w-20 h-20 rounded-2xl shadow-md object-cover border border-slate-100"
          />
          <span className="px-4 py-2 bg-blue-50 text-blue-700 rounded-full text-sm font-semibold">
            {job.postedAt}
          </span>
        </div>
        
        <h2 className="text-2xl font-bold text-slate-900 mb-2">{job.title}</h2>
        <div className="flex items-center gap-2 text-slate-600 font-medium mb-6">
          <Building2 className="w-5 h-5" />
          {job.company}
        </div>

        <div className="grid grid-cols-2 gap-3 mb-6">
          <div className="flex items-center gap-2 text-slate-600 bg-slate-50 p-3 rounded-xl">
            <MapPin className="w-5 h-5 text-blue-500" />
            <span className="text-sm">{job.location}</span>
          </div>
          <div className="flex items-center gap-2 text-slate-600 bg-slate-50 p-3 rounded-xl">
            <DollarSign className="w-5 h-5 text-green-500" />
            <span className="text-sm">{job.salary}</span>
          </div>
          <div className="flex items-center gap-2 text-slate-600 bg-slate-50 p-3 rounded-xl">
            <Clock className="w-5 h-5 text-orange-500" />
            <span className="text-sm">{job.type}</span>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-8 pb-8 custom-scrollbar">
        <div className="mb-6">
          <h3 className="text-slate-900 font-semibold mb-3">About the Role</h3>
          <p className="text-slate-600 leading-relaxed text-sm">
            {job.description}
          </p>
        </div>

        <div>
          <h3 className="text-slate-900 font-semibold mb-3">Requirements</h3>
          <ul className="space-y-2">
            {job.requirements.map((req, idx) => (
              <li key={idx} className="flex items-start gap-3 text-slate-600 text-sm">
                <CheckCircle2 className="w-5 h-5 text-blue-500 shrink-0" />
                {req}
              </li>
            ))}
          </ul>
        </div>
      </div>
      
      {/* Gradient fade at bottom for scroll indication */}
      <div className="h-8 bg-gradient-to-t from-white to-transparent pointer-events-none absolute bottom-0 left-0 right-0" />
    </div>
  );
}
