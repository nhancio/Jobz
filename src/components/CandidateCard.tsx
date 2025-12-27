import { MapPin, Briefcase, GraduationCap } from 'lucide-react';
import { Candidate } from '../data/mockData';

interface CandidateCardProps {
  candidate: Candidate;
}

export function CandidateCard({ candidate }: CandidateCardProps) {
  return (
    <div className="h-full bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-200 flex flex-col">
      <div className="relative h-2/5">
        <img 
          src={candidate.avatar} 
          alt={candidate.name} 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent" />
        <div className="absolute bottom-6 left-6 text-white">
          <h2 className="text-3xl font-bold mb-1">{candidate.name}</h2>
          <p className="text-lg text-slate-200 opacity-90">{candidate.title}</p>
        </div>
      </div>

      <div className="flex-1 p-6 overflow-y-auto">
        <div className="flex flex-wrap gap-2 mb-6">
          <span className="px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full text-sm font-medium flex items-center gap-1">
            <Briefcase className="w-3 h-3" />
            {candidate.experience}
          </span>
          <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm font-medium flex items-center gap-1">
            <MapPin className="w-3 h-3" />
            {candidate.location}
          </span>
          <span className="px-3 py-1 bg-purple-50 text-purple-700 rounded-full text-sm font-medium flex items-center gap-1">
            <GraduationCap className="w-3 h-3" />
            {candidate.education}
          </span>
        </div>

        <div className="mb-6">
          <h3 className="text-slate-900 font-semibold mb-2">About</h3>
          <p className="text-slate-600 text-sm leading-relaxed">
            {candidate.bio}
          </p>
        </div>

        <div>
          <h3 className="text-slate-900 font-semibold mb-3">Skills</h3>
          <div className="flex flex-wrap gap-2">
            {candidate.skills.map((skill, idx) => (
              <span 
                key={idx}
                className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg text-sm font-medium"
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
