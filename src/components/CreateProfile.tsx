import { useState, useRef, useEffect } from 'react';
import { Camera, Sparkles, Mic, ArrowRight, Upload, Briefcase, User, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { extractProfileFromText } from '../lib/gemini';
import { saveProfile } from '../lib/profiles';
import { useAuth } from '../contexts/AuthContext';

interface CreateProfileProps {
  mode: 'seeker' | 'employer';
  onProfileCreated: (data: any) => void;
}

export function CreateProfile({ mode, onProfileCreated }: CreateProfileProps) {
  const { user, fetchLinkedInProfile } = useAuth();
  const isDemoMode = user?.id?.startsWith('demo-user-') || !user;
  const [step, setStep] = useState(1);
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [voiceData, setVoiceData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [linkedInData, setLinkedInData] = useState<any>(null);
  
  // Form State
  const [name, setName] = useState(''); // Name or Company Name
  const [title, setTitle] = useState(''); // Job Title or Candidate Title
  const [location, setLocation] = useState('');
  const [photo, setPhoto] = useState<string>(''); // Avatar or Logo

  // Fetch LinkedIn profile data on mount
  useEffect(() => {
    const loadLinkedInData = async () => {
      if (user && user.id && !user.id.startsWith('demo-user-')) {
        try {
          const data = await fetchLinkedInProfile();
          setLinkedInData(data);
          
          // Auto-populate form fields from LinkedIn
          if (data.fullName) setName(data.fullName);
          if (data.avatarUrl) setPhoto(data.avatarUrl);
          if (data.headline) setTitle(data.headline);
          if (data.location) setLocation(data.location);
        } catch (err) {
          console.log('Could not fetch LinkedIn profile:', err);
          // Silently fail - user can still fill form manually
        }
      }
    };
    
    loadLinkedInData();
  }, [user, fetchLinkedInProfile]);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const recognitionRef = useRef<any>(null);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhoto(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const startRecording = () => {
    try {
      setError(null);
      
      // Check for browser support
      if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
        setError('Speech recognition not supported. Please use Chrome or Edge browser.');
        return;
      }

      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      
      recognition.continuous = true;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      let fullTranscript = '';

      recognition.onresult = (event: any) => {
        // Accumulate all results
        for (let i = event.resultIndex; i < event.results.length; i++) {
          if (event.results[i].isFinal) {
            fullTranscript += event.results[i][0].transcript + ' ';
          }
        }
      };

      recognition.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        setError(`Speech recognition error: ${event.error}`);
        setIsRecording(false);
        setIsProcessing(false);
      };

      recognition.onend = async () => {
        setIsRecording(false);
        
        if (fullTranscript.trim()) {
          // Process with Gemini (with graceful fallback)
          setIsProcessing(true);
          try {
            const profileData = await extractProfileFromText(fullTranscript.trim(), mode);
            setVoiceData(profileData);
            // Clear any previous errors on success
            setError(null);
          } catch (err: any) {
            console.error('Error processing voice:', err);
            // Don't show error to user - fallback data should be returned
            // Only show error if it's a critical issue
            if (!err.message?.includes('fallback')) {
              setError('AI processing unavailable, but you can still continue. Your input has been saved.');
            }
            // Set basic voice data from transcript as fallback
            setVoiceData({
              bio: fullTranscript.trim(),
              skills: [],
              experience: 'Not specified',
              education: 'Not specified',
            });
          } finally {
            setIsProcessing(false);
          }
        } else {
          setError('No speech detected. Please try again.');
          setIsProcessing(false);
        }
      };

      recognitionRef.current = recognition;
      recognition.start();
      setIsRecording(true);
    } catch (err: any) {
      console.error('Error starting recording:', err);
      setError('Failed to start speech recognition. Please check permissions.');
      setIsRecording(false);
    }
  };

  const stopRecording = () => {
    if (recognitionRef.current && isRecording) {
      recognitionRef.current.stop();
      setIsRecording(false);
    }
  };

  const handleVoiceInput = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  const handleComplete = async () => {
    try {
      setError(null);
      setIsProcessing(true);
      
      // In demo mode, use defaults if fields are empty
      const profileData = {
        mode,
        name: name || (mode === 'seeker' ? 'Demo User' : 'Demo Company'),
        title: title || (mode === 'seeker' ? 'Demo Professional' : 'Demo Position'),
        location: location || 'Demo Location',
        logo: mode === 'employer' ? photo : undefined,
        avatar: mode === 'seeker' ? photo : undefined,
        // Use voice data if available, otherwise use defaults
        ...(voiceData || {
          bio: mode === 'seeker' ? 'Demo profile created in demo mode.' : undefined,
          description: mode === 'employer' ? 'Demo job posting created in demo mode.' : undefined,
          skills: mode === 'seeker' ? ['Demo', 'Skills'] : undefined,
          requirements: mode === 'employer' ? ['Demo requirements'] : undefined,
          experience: 'Demo',
          education: 'Demo',
          salary: 'Demo',
          type: 'Full-time',
        })
      };

      // Save to database
      const savedProfile = await saveProfile(profileData);
      
      // Callback with saved data
      onProfileCreated(savedProfile);
    } catch (err: any) {
      console.error('Error saving profile:', err);
      setError(err.message || 'Failed to save profile. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (recognitionRef.current && isRecording) {
        recognitionRef.current.stop();
      }
    };
  }, [isRecording]);

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-slate-50">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-2xl"
      >
        <div className="bg-white rounded-3xl shadow-xl p-8 border border-slate-200">
          {/* Header */}
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", duration: 0.6 }}
              className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-2xl mb-4"
            >
              {mode === 'seeker' ? (
                <User className="w-8 h-8 text-blue-600" />
              ) : (
                <Briefcase className="w-8 h-8 text-blue-600" />
              )}
            </motion.div>
            <h1 className="text-2xl font-bold text-slate-900 mb-2">
              {mode === 'seeker' ? 'Build Your Profile' : 'Post a Job'}
            </h1>
            <p className="text-slate-600">
              {mode === 'seeker' 
                ? 'Let employers find you' 
                : 'Find your perfect candidate'}
            </p>
            {isDemoMode && (
              <div className="mt-4">
                <button
                  onClick={handleComplete}
                  className="text-sm text-blue-600 hover:text-blue-700 underline font-medium"
                >
                  Skip and use demo data →
                </button>
              </div>
            )}
          </div>

          {/* Progress Steps */}
          <div className="flex items-center justify-center gap-2 mb-8">
            {[1, 2, 3].map((s) => (
              <div
                key={s}
                className={`h-2 rounded-full transition-all duration-300 ${
                  s === step ? 'w-12 bg-blue-600' : 'w-2 bg-slate-200'
                }`}
              />
            ))}
          </div>

          <AnimatePresence mode="wait">
            {/* Step 1: Basic Info */}
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                {linkedInData && (
                  <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                    <p className="text-sm text-blue-700 font-medium mb-1">
                      ✓ LinkedIn profile data loaded
                    </p>
                    <p className="text-xs text-blue-600">
                      Fields have been pre-filled from your LinkedIn profile
                    </p>
                  </div>
                )}
                <div>
                  <label className="block text-slate-700 font-medium mb-2">
                    {mode === 'seeker' ? 'Full Name' : 'Company Name'}
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                    placeholder={mode === 'seeker' ? "Jane Doe" : "Acme Corp"}
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-medium mb-2">
                    {mode === 'seeker' ? 'Job Title' : 'Position Title'}
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                    placeholder={mode === 'seeker' ? "Frontend Developer" : "Senior Engineer"}
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-medium mb-2">Location</label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                    placeholder="San Francisco, CA"
                  />
                </div>

                <div className="flex gap-3">
                  {isDemoMode && (
                    <button
                      onClick={() => {
                        // Skip to final step in demo mode
                        setStep(3);
                      }}
                      className="flex-1 border border-slate-300 text-slate-700 py-4 rounded-xl hover:bg-slate-50 transition-all font-medium"
                    >
                      Skip All
                    </button>
                  )}
                  <button
                    onClick={() => setStep(2)}
                    disabled={!isDemoMode && (!name || !title || !location)}
                    className={`${isDemoMode ? 'flex-1' : 'w-full'} bg-blue-600 text-white py-4 rounded-xl hover:bg-blue-700 hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 font-semibold`}
                  >
                    Continue
                    <ArrowRight className="w-5 h-5" />
                  </button>
                </div>
              </motion.div>
            )}

            {/* Step 2: Photo/Logo */}
            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div>
                  <label className="block text-slate-700 font-medium mb-3">
                    {mode === 'seeker' ? 'Profile Photo' : 'Company Logo'}
                  </label>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handlePhotoUpload}
                    accept="image/*"
                    className="hidden"
                  />
                  {!photo ? (
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full h-64 border-2 border-dashed border-slate-300 rounded-2xl hover:border-blue-500 transition-all flex flex-col items-center justify-center gap-3 bg-slate-50 hover:bg-slate-100 group"
                    >
                      <div className="w-16 h-16 bg-white rounded-full shadow-sm flex items-center justify-center group-hover:scale-110 transition-transform">
                        {mode === 'seeker' ? (
                          <Camera className="w-8 h-8 text-slate-400 group-hover:text-blue-500" />
                        ) : (
                          <Upload className="w-8 h-8 text-slate-400 group-hover:text-blue-500" />
                        )}
                      </div>
                      <span className="text-slate-500 font-medium">Upload Image</span>
                    </button>
                  ) : (
                    <div className="relative">
                      <img src={photo} alt="Preview" className="w-full h-64 object-cover rounded-2xl border border-slate-200" />
                      <button
                        onClick={() => setPhoto('')}
                        className="absolute top-3 right-3 bg-white/90 backdrop-blur px-4 py-2 rounded-full hover:bg-white transition-all text-sm font-medium shadow-sm"
                      >
                        Change
                      </button>
                    </div>
                  )}
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => setStep(1)}
                    className="flex-1 border border-slate-300 text-slate-700 py-4 rounded-xl hover:bg-slate-50 transition-all font-medium"
                  >
                    Back
                  </button>
                  {isDemoMode && (
                    <button
                      onClick={() => setStep(3)}
                      className="flex-1 border border-slate-300 text-slate-700 py-4 rounded-xl hover:bg-slate-50 transition-all font-medium"
                    >
                      Skip Photo
                    </button>
                  )}
                  <button
                    onClick={() => setStep(3)}
                    disabled={!isDemoMode && !photo}
                    className={`${isDemoMode ? 'flex-1' : 'flex-1'} bg-blue-600 text-white py-4 rounded-xl hover:bg-blue-700 hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 font-semibold`}
                  >
                    Continue
                    <ArrowRight className="w-5 h-5" />
                  </button>
                </div>
              </motion.div>
            )}

            {/* Step 3: Voice Input */}
            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="text-center">
                  <h3 className="text-slate-900 font-bold text-lg mb-2">
                    {mode === 'seeker' ? 'Tell Us About Yourself' : 'Describe the Role'}
                  </h3>
                  <p className="text-slate-600">
                    Use voice input and let AI {mode === 'seeker' ? 'write your bio' : 'create the job description'}
                  </p>
                </div>

                <div className="bg-slate-50 rounded-2xl p-8 border border-slate-100">
                  <div className="flex flex-col items-center gap-6">
                    <motion.button
                      onClick={handleVoiceInput}
                      disabled={isProcessing || voiceData}
                      whileTap={{ scale: 0.95 }}
                      className={`w-24 h-24 rounded-full flex items-center justify-center transition-all shadow-lg ${
                        isRecording
                          ? 'bg-red-500 animate-pulse'
                          : isProcessing
                          ? 'bg-yellow-500'
                          : voiceData
                          ? 'bg-green-500'
                          : 'bg-blue-600 hover:bg-blue-700'
                      }`}
                    >
                      {isProcessing ? (
                        <Loader2 className="w-10 h-10 text-white animate-spin" />
                      ) : (
                        <Mic className="w-10 h-10 text-white" />
                      )}
                    </motion.button>
                    <p className="text-slate-700 font-medium text-center">
                      {isRecording
                        ? 'Recording... Click again to stop'
                        : isProcessing
                        ? 'Processing with AI...'
                        : voiceData
                        ? 'Success! AI generated the details.'
                        : 'Tap to start recording'}
                    </p>
                    {error && (
                      <p className="text-red-600 text-sm text-center bg-red-50 p-3 rounded-lg border border-red-200">
                        {error}
                      </p>
                    )}
                  </div>
                </div>

                {voiceData && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-4 bg-white rounded-2xl p-6 border border-slate-200 shadow-sm"
                  >
                    <div>
                      <label className="block text-slate-700 font-medium mb-2">
                        {mode === 'seeker' ? 'Generated Bio' : 'Job Description'}
                      </label>
                      <p className="text-slate-600 text-sm bg-slate-50 p-4 rounded-xl border border-slate-100">
                        {mode === 'seeker' ? voiceData.bio : voiceData.description}
                      </p>
                    </div>
                    <div>
                      <label className="block text-slate-700 font-medium mb-2">
                        {mode === 'seeker' ? 'Extracted Skills' : 'Requirements'}
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {(mode === 'seeker' ? voiceData.skills : voiceData.requirements).map((item: string, idx: number) => (
                          <span key={idx} className="px-3 py-1 bg-blue-50 text-blue-700 rounded-lg text-sm font-medium">
                            {item}
                          </span>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}

                <div className="flex gap-3">
                  <button
                    onClick={() => setStep(2)}
                    className="flex-1 border border-slate-300 text-slate-700 py-4 rounded-xl hover:bg-slate-50 transition-all font-medium"
                  >
                    Back
                  </button>
                  {isDemoMode && (
                    <button
                      onClick={handleComplete}
                      disabled={isProcessing}
                      className="flex-1 border border-blue-300 text-blue-700 py-4 rounded-xl hover:bg-blue-50 transition-all font-medium"
                    >
                      Skip Voice
                    </button>
                  )}
                  <button
                    onClick={handleComplete}
                    disabled={!isDemoMode && (!voiceData || isProcessing)}
                    className={`${isDemoMode ? 'flex-1' : 'flex-1'} bg-blue-600 text-white py-4 rounded-xl hover:bg-blue-700 hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 font-semibold`}
                  >
                    {isProcessing ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        {mode === 'seeker' ? 'Create Profile' : 'Post Job'}
                        <Sparkles className="w-5 h-5" />
                      </>
                    )}
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}
