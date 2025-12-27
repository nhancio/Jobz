import { useState } from 'react';
import { Linkedin, Loader2, Play } from 'lucide-react';
import { motion } from 'motion/react';
import { useAuth } from '../contexts/AuthContext';

export function Login() {
  const { signInWithLinkedIn, signInDemo } = useAuth();
  const [loading, setLoading] = useState(false);
  const [demoLoading, setDemoLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async () => {
    try {
      setLoading(true);
      setError(null);
      await signInWithLinkedIn();
    } catch (err: any) {
      console.error('Login error:', err);
      setError(err.message || 'Failed to sign in. Please try again.');
      setLoading(false);
    }
  };

  const handleDemoLogin = async () => {
    try {
      setDemoLoading(true);
      setError(null);
      await signInDemo();
    } catch (err: any) {
      console.error('Demo login error:', err);
      setError(err.message || 'Failed to start demo mode.');
      setDemoLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="bg-white rounded-3xl shadow-2xl p-8 border border-slate-200">
          {/* Logo/Header */}
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", duration: 0.6 }}
              className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-2xl mb-4"
            >
              <Linkedin className="w-8 h-8 text-blue-600" />
            </motion.div>
            <h1 className="text-3xl font-bold text-slate-900 mb-2">
              Welcome to Jobz
            </h1>
            <p className="text-slate-600">
              Connect with opportunities that match your skills
            </p>
          </div>

          {/* Login Buttons */}
          <div className="space-y-3">
            <motion.button
              onClick={handleLogin}
              disabled={loading || demoLoading}
              whileTap={{ scale: 0.98 }}
              className="w-full bg-blue-600 text-white py-4 rounded-xl hover:bg-blue-700 hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 font-semibold text-lg"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Signing in...
                </>
              ) : (
                <>
                  <Linkedin className="w-5 h-5" />
                  Continue with LinkedIn
                </>
              )}
            </motion.button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-slate-500">or</span>
              </div>
            </div>

            <motion.button
              onClick={handleDemoLogin}
              disabled={loading || demoLoading}
              whileTap={{ scale: 0.98 }}
              className="w-full bg-slate-100 text-slate-700 py-4 rounded-xl hover:bg-slate-200 hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 font-semibold text-lg border border-slate-200"
            >
              {demoLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Starting demo...
                </>
              ) : (
                <>
                  <Play className="w-5 h-5" />
                  Try Demo Mode
                </>
              )}
            </motion.button>
          </div>

          {/* Error Message */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm"
            >
              {error}
            </motion.div>
          )}

          {/* Info */}
          <p className="mt-6 text-center text-sm text-slate-500">
            By continuing, you agree to our Terms of Service and Privacy Policy
          </p>
        </div>
      </motion.div>
    </div>
  );
}

