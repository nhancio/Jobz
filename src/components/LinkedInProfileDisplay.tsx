import { useState, useEffect } from 'react';
import { Linkedin, User as UserIcon, Mail, MapPin, Briefcase, Loader2 } from 'lucide-react';
import { motion } from 'motion/react';
import { useAuth } from '../contexts/AuthContext';

export function LinkedInProfileDisplay() {
  const { user, fetchLinkedInProfile } = useAuth();
  const [profileData, setProfileData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadProfile = async () => {
      if (user && user.id && !user.id.startsWith('demo-user-')) {
        setLoading(true);
        try {
          const data = await fetchLinkedInProfile();
          setProfileData(data);
        } catch (err: any) {
          setError(err.message || 'Failed to load LinkedIn profile');
        } finally {
          setLoading(false);
        }
      } else if (user?.id?.startsWith('demo-user-')) {
        // For demo users, show demo data
        setProfileData({
          fullName: user.user_metadata?.full_name || 'Demo User',
          email: user.email || 'demo@jobz.app',
          avatarUrl: user.user_metadata?.avatar_url,
        });
      }
    };

    loadProfile();
  }, [user, fetchLinkedInProfile]);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-4">
        <Loader2 className="w-5 h-5 animate-spin text-blue-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-xl p-4">
        <p className="text-sm text-red-700">{error}</p>
      </div>
    );
  }

  if (!profileData) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm"
    >
      <div className="flex items-start gap-4">
        {profileData.avatarUrl && (
          <img
            src={profileData.avatarUrl}
            alt={profileData.fullName || 'Profile'}
            className="w-16 h-16 rounded-full object-cover border-2 border-slate-200"
          />
        )}
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <Linkedin className="w-5 h-5 text-blue-600" />
            <h3 className="font-semibold text-slate-900">
              {profileData.fullName || 'LinkedIn User'}
            </h3>
          </div>
          
          <div className="space-y-2 text-sm text-slate-600">
            {profileData.email && (
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                <span>{profileData.email}</span>
              </div>
            )}
            {profileData.headline && (
              <div className="flex items-center gap-2">
                <Briefcase className="w-4 h-4" />
                <span>{profileData.headline}</span>
              </div>
            )}
            {profileData.location && (
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                <span>{profileData.location}</span>
              </div>
            )}
          </div>

          {profileData.linkedInId && (
            <div className="mt-3 pt-3 border-t border-slate-100">
              <p className="text-xs text-slate-500">
                LinkedIn ID: {profileData.linkedInId}
              </p>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

