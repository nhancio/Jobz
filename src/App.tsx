import { useState, useEffect } from 'react';
import { RoleSelection } from './components/RoleSelection';
import { CreateProfile } from './components/CreateProfile';
import { SwipeView } from './components/SwipeView';
import { MatchesView } from './components/MatchesView';
import { ProfileView } from './components/ProfileView';
import { Login } from './components/Login';
import { Job, Candidate } from './data/mockData';
import { useAuth } from './contexts/AuthContext';
import { getProfile } from './lib/profiles';
import { Loader2 } from 'lucide-react';

export type View = 'create' | 'swipe' | 'matches' | 'profile';

export default function App() {
  const { user, loading } = useAuth();
  const [userType, setUserType] = useState<'seeker' | 'employer' | null>(null);
  const [currentView, setCurrentView] = useState<View>('create');
  
  // State for created profile/job
  const [myProfile, setMyProfile] = useState<Candidate | null>(null);
  const [myJob, setMyJob] = useState<Job | null>(null);
  
  // Matches state
  const [matches, setMatches] = useState<(Job | Candidate)[]>([]);
  const [profileLoading, setProfileLoading] = useState(false);

  // Load user profile when authenticated
  useEffect(() => {
    if (user && userType) {
      setProfileLoading(true);
      getProfile(userType)
        .then((profile) => {
          if (profile) {
            if (userType === 'seeker') {
              setMyProfile(profile as any);
            } else {
              setMyJob(profile as any);
            }
            setCurrentView('swipe');
          }
        })
        .catch((err) => {
          console.error('Error loading profile:', err);
        })
        .finally(() => {
          setProfileLoading(false);
        });
    }
  }, [user, userType]);

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

  // Show loading state
  if (loading || profileLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
          <p className="text-slate-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Show login if not authenticated
  if (!user) {
    return <Login />;
  }

  // Show role selection if no role selected
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
      {currentView === 'profile' && (
        <ProfileView 
          mode={userType}
          onBack={() => setCurrentView('swipe')}
          onNavigate={setCurrentView}
        />
      )}
    </div>
  );
}
