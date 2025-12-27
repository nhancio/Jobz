import { useState } from 'react';
import { RoleSelection } from './components/RoleSelection';
import { CreateProfile } from './components/CreateProfile';
import { SwipeView } from './components/SwipeView';
import { MatchesView } from './components/MatchesView';
import { Job, Candidate } from './data/mockData';

export type View = 'create' | 'swipe' | 'matches';

export default function App() {
  const [userType, setUserType] = useState<'seeker' | 'employer' | null>(null);
  const [currentView, setCurrentView] = useState<View>('create');
  
  // State for created profile/job
  const [myProfile, setMyProfile] = useState<Candidate | null>(null);
  const [myJob, setMyJob] = useState<Job | null>(null);
  
  // Matches state
  const [matches, setMatches] = useState<(Job | Candidate)[]>([]);

  const handleRoleSelect = (role: 'seeker' | 'employer') => {
    setUserType(role);
    setCurrentView('create');
  };

  const handleProfileCreated = (data: any) => {
    if (userType === 'seeker') {
      setMyProfile(data);
    } else {
      setMyJob(data);
    }
    setCurrentView('swipe');
  };

  const handleMatch = (item: Job | Candidate) => {
    setMatches(prev => {
      if (prev.some(p => p.id === item.id)) return prev;
      return [...prev, item];
    });
  };

  if (!userType) {
    return <RoleSelection onSelectRole={handleRoleSelect} />;
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      {currentView === 'create' && (
        <CreateProfile 
          mode={userType} 
          onProfileCreated={handleProfileCreated} 
        />
      )}
      {currentView === 'swipe' && (
        <SwipeView 
          mode={userType}
          onMatch={handleMatch}
          onNavigate={setCurrentView}
        />
      )}
      {currentView === 'matches' && (
        <MatchesView 
          matches={matches}
          mode={userType}
          onBack={() => setCurrentView('swipe')}
        />
      )}
    </div>
  );
}
