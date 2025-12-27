import { MapPin, Briefcase, GraduationCap } from 'lucide-react';
import { Candidate } from '../data/mockData';

interface CandidateCardProps {
  candidate: Candidate;
}

export function CandidateCard({ candidate }: CandidateCardProps) {
  return (
    <div className="h-full bg-white rounded-2xl sm:rounded-3xl shadow-xl overflow-hidden border border-slate-200 flex flex-col will-change-transform">
      <div className="relative h-2/5 min-h-[180px] sm:min-h-[200px]">
        <img 
          src={candidate.avatar} 
          alt={candidate.name} 
          className="w-full h-full object-cover"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent" />
        <div className="absolute bottom-4 sm:bottom-6 left-4 sm:left-6 text-white">
          <h2 className="text-2xl sm:text-3xl font-bold mb-1 leading-tight">{candidate.name}</h2>
          <p className="text-base sm:text-lg text-slate-200 opacity-90">{candidate.title}</p>
        </div>
      </div>

      <div className="flex-1 p-4 sm:p-6 overflow-y-auto overscroll-contain">
        <div className="flex flex-wrap gap-2 mb-4 sm:mb-6">
          <span className="px-2.5 sm:px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full text-xs sm:text-sm font-medium flex items-center gap-1">
            <Briefcase className="w-3 h-3 shrink-0" />
            <span className="truncate">{candidate.experience}</span>
          </span>
          <span className="px-2.5 sm:px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs sm:text-sm font-medium flex items-center gap-1">
            <MapPin className="w-3 h-3 shrink-0" />
            <span className="truncate">{candidate.location}</span>
          </span>
          <span className="px-2.5 sm:px-3 py-1 bg-purple-50 text-purple-700 rounded-full text-xs sm:text-sm font-medium flex items-center gap-1">
            <GraduationCap className="w-3 h-3 shrink-0" />
            <span className="truncate">{candidate.education}</span>
          </span>
        </div>

        <div className="mb-4 sm:mb-6">
          <h3 className="text-slate-900 font-semibold mb-2 text-sm sm:text-base">About</h3>
          <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
            {candidate.bio}
          </p>
        </div>

        <div>
          <h3 className="text-slate-900 font-semibold mb-2 sm:mb-3 text-sm sm:text-base">Skills</h3>
          <div className="flex flex-wrap gap-2">
            {candidate.skills.map((skill, idx) => (
              <span 
                key={idx}
                className="px-3 sm:px-4 py-1.5 sm:py-2 bg-slate-100 text-slate-700 rounded-lg text-xs sm:text-sm font-medium"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
