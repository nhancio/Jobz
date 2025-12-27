import { useState, useEffect } from 'react';
import { User, Briefcase, MapPin, Mail, Edit, ArrowLeft, Loader2, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';
import { useAuth } from '../contexts/AuthContext';
import { getProfile, ProfileData } from '../lib/profiles';
import { View } from '../App';

interface ProfileViewProps {
  mode: 'seeker' | 'employer';
  onBack: () => void;
  onNavigate: (view: View) => void;
}

export function ProfileView({ mode, onBack, onNavigate }: ProfileViewProps) {
  const { user, signOut } = useAuth();
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        setLoading(true);
        const data = await getProfile(mode);
        setProfile(data);
      } catch (err: any) {
        setError(err.message || 'Failed to load profile');
      } finally {
        setLoading(false);
      }
    };

    if (user && !user.id?.startsWith('demo-user-')) {
      loadProfile();
    } else {
      // Demo mode - show demo profile
      setProfile({
        id: 'demo',
        mode,
        name: 'Demo User',
        title: 'Demo Professional',
        location: 'Demo Location',
        bio: 'This is a demo profile. Sign in with LinkedIn to create your real profile!',
        skills: ['Demo', 'Skills'],
        experience: 'Demo',
        education: 'Demo',
      } as ProfileData);
      setLoading(false);
    }
  }, [user, mode]);

  const handleEdit = () => {
    onNavigate('create');
  };

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (err) {
      console.error('Error signing out:', err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
          <p className="text-slate-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (error && !profile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
        <div className="max-w-md w-full bg-white rounded-3xl shadow-xl p-8 border border-slate-200 text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={onBack}
            className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={onBack}
            className="w-12 h-12 bg-white rounded-xl flex items-center justify-center hover:shadow-md transition-all border border-slate-200"
          >
            <ArrowLeft className="w-5 h-5 text-slate-600" />
          </button>
          <div className="flex items-center gap-3">
            <button
              onClick={handleEdit}
              className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all flex items-center gap-2 font-medium"
            >
              <Edit className="w-4 h-4" />
              Edit
            </button>
            <button
              onClick={handleSignOut}
              className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl hover:bg-slate-200 transition-all font-medium"
            >
              Sign Out
            </button>
          </div>
        </div>

        {/* Profile Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden"
        >
          {/* Cover/Header Section */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 h-48 relative">
            <div className="absolute bottom-0 left-0 right-0 p-6">
              <div className="flex items-end gap-4">
                {profile?.avatar || profile?.logo ? (
                  <img
                    src={profile.avatar || profile.logo}
                    alt={profile.name}
                    className="w-24 h-24 rounded-2xl border-4 border-white shadow-xl object-cover"
                  />
                ) : (
                  <div className="w-24 h-24 rounded-2xl border-4 border-white shadow-xl bg-white/20 backdrop-blur flex items-center justify-center">
                    {mode === 'seeker' ? (
                      <User className="w-12 h-12 text-white" />
                    ) : (
                      <Briefcase className="w-12 h-12 text-white" />
                    )}
                  </div>
                )}
                <div className="flex-1 text-white pb-2">
                  <h1 className="text-3xl font-bold mb-1">{profile?.name || 'No Name'}</h1>
                  <p className="text-white/90 text-lg">{profile?.title || 'No Title'}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Content Section */}
          <div className="p-6 space-y-6">
            {/* Location */}
            {profile?.location && (
              <div className="flex items-center gap-3 text-slate-600">
                <MapPin className="w-5 h-5" />
                <span>{profile.location}</span>
              </div>
            )}

            {/* Email (if available) */}
            {user?.email && (
              <div className="flex items-center gap-3 text-slate-600">
                <Mail className="w-5 h-5" />
                <span>{user.email}</span>
              </div>
            )}

            {/* Bio/Description */}
            {(profile?.bio || profile?.description) && (
              <div>
                <h2 className="text-xl font-bold text-slate-900 mb-3">
                  {mode === 'seeker' ? 'About Me' : 'Job Description'}
                </h2>
                <p className="text-slate-600 leading-relaxed">
                  {profile.bio || profile.description}
                </p>
              </div>
            )}

            {/* Skills/Requirements */}
            {(profile?.skills?.length || profile?.requirements?.length) && (
              <div>
                <h2 className="text-xl font-bold text-slate-900 mb-3">
                  {mode === 'seeker' ? 'Skills' : 'Requirements'}
                </h2>
                <div className="flex flex-wrap gap-2">
                  {(profile.skills || profile.requirements || []).map((item: string, idx: number) => (
                    <span
                      key={idx}
                      className="px-4 py-2 bg-blue-50 text-blue-700 rounded-xl text-sm font-medium border border-blue-100"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Experience & Education (for seekers) */}
            {mode === 'seeker' && (profile?.experience || profile?.education) && (
              <div className="grid grid-cols-2 gap-4">
                {profile.experience && (
                  <div>
                    <h3 className="text-sm font-semibold text-slate-500 mb-1">Experience</h3>
                    <p className="text-slate-900">{profile.experience}</p>
                  </div>
                )}
                {profile.education && (
                  <div>
                    <h3 className="text-sm font-semibold text-slate-500 mb-1">Education</h3>
                    <p className="text-slate-900">{profile.education}</p>
                  </div>
                )}
              </div>
            )}

            {/* Salary & Type (for employers) */}
            {mode === 'employer' && (profile?.salary || profile?.type) && (
              <div className="grid grid-cols-2 gap-4">
                {profile.salary && (
                  <div>
                    <h3 className="text-sm font-semibold text-slate-500 mb-1">Salary</h3>
                    <p className="text-slate-900">{profile.salary}</p>
                  </div>
                )}
                {profile.type && (
                  <div>
                    <h3 className="text-sm font-semibold text-slate-500 mb-1">Job Type</h3>
                    <p className="text-slate-900">{profile.type}</p>
                  </div>
                )}
              </div>
            )}

            {/* Demo Mode Notice */}
            {user?.id?.startsWith('demo-user-') && (
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                <p className="text-sm text-blue-700">
                  <strong>Demo Mode:</strong> This is a demo profile. Sign in with LinkedIn to create and save your real profile!
                </p>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}

