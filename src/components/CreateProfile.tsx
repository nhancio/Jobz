import { useState, useRef } from 'react';
import { Camera, Sparkles, Mic, ArrowRight, Upload, Briefcase, User } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface CreateProfileProps {
  mode: 'seeker' | 'employer';
  onProfileCreated: (data: any) => void;
}

export function CreateProfile({ mode, onProfileCreated }: CreateProfileProps) {
  const [step, setStep] = useState(1);
  const [isRecording, setIsRecording] = useState(false);
  const [voiceData, setVoiceData] = useState<any>(null);
  
  // Form State
  const [name, setName] = useState(''); // Name or Company Name
  const [title, setTitle] = useState(''); // Job Title or Candidate Title
  const [location, setLocation] = useState('');
  const [photo, setPhoto] = useState<string>(''); // Avatar or Logo
  
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const handleVoiceInput = () => {
    setIsRecording(true);
    // Simulate AI processing voice input
    setTimeout(() => {
      setIsRecording(false);
      
      if (mode === 'seeker') {
        setVoiceData({
          bio: "I'm a passionate Full Stack Developer with 5 years of experience building scalable web applications. I love solving complex problems and working with modern technologies like React and Node.js.",
          skills: ["React", "TypeScript", "Node.js", "AWS", "System Design"],
          education: "BS Computer Science"
        });
      } else {
        setVoiceData({
          description: "We are looking for a Senior Product Designer to lead our design system initiatives. You should be proficient in Figma and have a strong portfolio of mobile and web apps. We offer a competitive salary and great benefits.",
          requirements: ["5+ years experience", "Figma Expert", "Design Systems", "Leadership"],
          salary: "$120k - $160k"
        });
      }
    }, 2500);
  };

  const handleComplete = () => {
    const data = {
      id: Date.now().toString(),
      name, // Company or Candidate Name
      title,
      location,
      logo: mode === 'employer' ? photo : undefined,
      avatar: mode === 'seeker' ? photo : undefined,
      ...voiceData
    };
    onProfileCreated(data);
  };

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

                <button
                  onClick={() => setStep(2)}
                  disabled={!name || !title || !location}
                  className="w-full bg-blue-600 text-white py-4 rounded-xl hover:bg-blue-700 hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 font-semibold"
                >
                  Continue
                  <ArrowRight className="w-5 h-5" />
                </button>
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
                  <button
                    onClick={() => setStep(3)}
                    disabled={!photo}
                    className="flex-1 bg-blue-600 text-white py-4 rounded-xl hover:bg-blue-700 hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 font-semibold"
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
                      disabled={isRecording || voiceData}
                      whileTap={{ scale: 0.95 }}
                      className={`w-24 h-24 rounded-full flex items-center justify-center transition-all shadow-lg ${
                        isRecording
                          ? 'bg-red-500 animate-pulse'
                          : voiceData
                          ? 'bg-green-500'
                          : 'bg-blue-600 hover:bg-blue-700'
                      }`}
                    >
                      <Mic className="w-10 h-10 text-white" />
                    </motion.button>
                    <p className="text-slate-700 font-medium">
                      {isRecording
                        ? 'Listening...'
                        : voiceData
                        ? 'Success! AI generated the details.'
                        : 'Tap to start recording'}
                    </p>
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
                  <button
                    onClick={handleComplete}
                    disabled={!voiceData}
                    className="flex-1 bg-blue-600 text-white py-4 rounded-xl hover:bg-blue-700 hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 font-semibold"
                  >
                    {mode === 'seeker' ? 'Create Profile' : 'Post Job'}
                    <Sparkles className="w-5 h-5" />
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
