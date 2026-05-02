'use client';
import { Suspense, useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { useAuth } from '@/context/AuthContext';
import { FiUser, FiMail, FiLock, FiUserPlus, FiArrowLeft, FiEye, FiEyeOff, FiUpload, FiArrowRight, FiCheck, FiChevronRight, FiAlertCircle, FiFrown, FiWind, FiMoon, FiHeart, FiZap, FiActivity } from 'react-icons/fi';
import { FcGoogle } from 'react-icons/fc';
import Logo from '@/components/Logo';

const wellnessConcerns = [
  { id: 'anxiety', label: 'Anxiety', icon: <FiAlertCircle /> },
  { id: 'depression', label: 'Depression', icon: <FiFrown /> },
  { id: 'stress', label: 'Stress', icon: <FiWind /> },
  { id: 'insomnia', label: 'Sleep Issues', icon: <FiMoon /> },
  { id: 'loneliness', label: 'Loneliness', icon: <FiHeart /> },
  { id: 'anger', label: 'Anger Management', icon: <FiZap /> },
  { id: 'focus', label: 'Lack of Focus', icon: <FiActivity /> },
  { id: 'self_esteem', label: 'Low Self-Esteem', icon: <FiHeart /> },
];

const wellnessGoals = [
  { id: 'better_sleep', label: 'Better Sleep' },
  { id: 'reduce_anxiety', label: 'Reduce Anxiety' },
  { id: 'improve_mood', label: 'Improve Mood' },
  { id: 'build_confidence', label: 'Build Confidence' },
  { id: 'manage_stress', label: 'Manage Stress' },
  { id: 'mindfulness', label: 'Practice Mindfulness' },
];

function SignupContent() {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [avatar, setAvatar] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState('');
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [wellness, setWellness] = useState({
    stressLevel: 5,
    sleepQuality: 5,
    currentMood: 'neutral',
    concerns: [],
    goals: [],
    exerciseFrequency: 'rarely',
    meditationExperience: false,
  });
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login, googleLogin } = useAuth();
  const redirectTo = searchParams.get('redirect') || '/';

  useEffect(() => {
    if (searchParams.get('step') === '2' && searchParams.get('google') === 'true') {
      setIsGoogleSignup(true);
      setStep(2);
    }
  }, [searchParams]);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image must be less than 5MB');
      return;
    }

    setAvatarPreview(URL.createObjectURL(file));
    setUploading(true);

    const formData = new FormData();
    formData.append('image', file);

    try {
      const res = await fetch(`https://api.imgbb.com/1/upload?key=${process.env.NEXT_PUBLIC_IMGBB_API_KEY}`, {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (data.success) {
        setAvatar(data.data.display_url);
        toast.success('Image uploaded!');
      } else {
        toast.error('Image upload failed');
      }
    } catch {
      toast.error('Image upload failed');
    } finally {
      setUploading(false);
    }
  };

  const toggleConcern = (id) => {
    setWellness(prev => ({
      ...prev,
      concerns: prev.concerns.includes(id)
        ? prev.concerns.filter(c => c !== id)
        : [...prev.concerns, id],
    }));
  };

  const toggleGoal = (id) => {
    setWellness(prev => ({
      ...prev,
      goals: prev.goals.includes(id)
        ? prev.goals.filter(g => g !== id)
        : [...prev.goals, id],
    }));
  };

  const [isGoogleSignup, setIsGoogleSignup] = useState(false);

  const handleGoogleSignup = async () => {
    setLoading(true);
    try {
      const data = await googleLogin();
      if (data.isNewUser) {
        setIsGoogleSignup(true);
        setStep(2);
      } else {
        toast.success('Welcome back to Reflex!');
        router.push(redirectTo);
      }
    } catch (error) {
      toast.error(error.message || 'Google signup failed');
    } finally {
      setLoading(false);
    }
  };

  const handleCompleteGoogleProfile = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/users', {
        method: 'PATCH',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('reflex_token')}`
        },
        body: JSON.stringify({ wellnessProfile: wellness }),
      });
      if (res.ok) {
        toast.success('Welcome to Reflex!');
        router.push(redirectTo);
      } else {
        toast.error('Failed to save profile');
      }
    } catch {
      toast.error('Server error');
    } finally {
      setLoading(false);
    }
  };

  const handleStep1 = (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.password) {
      toast.error('Please fill in all fields');
      return;
    }
    if (form.password !== form.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    if (form.password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }
    setStep(2);
  };

  const handleSubmit = async () => {
    if (isGoogleSignup) {
      return handleCompleteGoogleProfile();
    }

    setLoading(true);
    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          password: form.password,
          avatar: avatar || '',
          wellnessProfile: wellness,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success('Welcome to Reflex!');
        login(data.token, data.user);
        router.push(redirectTo);
      } else {
        toast.error(data.message || 'Error creating account');
      }
    } catch {
      toast.error('Server error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-mesh flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <motion.div
          animate={{ x: [0, -50, 0], y: [0, 30, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-10 right-10 w-96 h-96 bg-primary-500/10 rounded-full blur-3xl"
        />
        <motion.div
          animate={{ x: [0, 50, 0], y: [0, -30, 0] }}
          transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute bottom-10 left-10 w-[500px] h-[500px] bg-teal-500/10 rounded-full blur-3xl"
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-lg relative z-10"
      >
        <Link href="/" className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-6 transition-colors">
          <FiArrowLeft /> Back to Home
        </Link>

        {/* Progress Indicator */}
        <div className="flex items-center gap-3 mb-6">
          {[1, 2].map((s) => (
            <div key={s} className="flex items-center gap-2 flex-1">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                step >= s ? 'bg-gradient-to-br from-primary-500 to-teal-500 text-white' : 'bg-white/10 text-gray-500'
              }`}>
                {step > s ? <FiCheck /> : s}
              </div>
              <span className={`text-xs font-bold uppercase tracking-wider ${step >= s ? 'text-primary-400' : 'text-gray-600'}`}>
                {s === 1 ? 'Account' : 'Wellness'}
              </span>
              {s < 2 && <div className={`flex-1 h-px ${step > s ? 'bg-primary-500' : 'bg-white/10'}`} />}
            </div>
          ))}
        </div>

        <div className="glass-card p-8 sm:p-10">
          <AnimatePresence mode="wait">
            {/* STEP 1: Account Details */}
            {step === 1 && (
              <motion.div key="step1" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}>
                <div className="text-center mb-8">
                <div className="flex justify-center mb-6">
                  <Logo className="w-16 h-16" />
                </div>
                  <h1 className="text-3xl font-bold font-display mb-2">Create Account</h1>
                  <p className="text-gray-400">Join our community and start your wellness journey</p>
                </div>

                {/* Google Signup */}
                <button
                  onClick={handleGoogleSignup}
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-3 px-6 py-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all mb-6 font-medium"
                >
                  <FcGoogle className="text-xl" />
                  Continue with Google
                </button>

                <div className="flex items-center gap-4 mb-6">
                  <div className="flex-1 h-px bg-white/10" />
                  <span className="text-xs text-gray-500 uppercase font-bold">or</span>
                  <div className="flex-1 h-px bg-white/10" />
                </div>

                {/* Avatar Upload */}
                <div className="flex justify-center mb-6">
                  <label className="relative cursor-pointer group">
                    <div className="w-20 h-20 rounded-2xl bg-white/5 border-2 border-dashed border-white/20 flex items-center justify-center overflow-hidden group-hover:border-primary-500/50 transition-colors">
                      {avatarPreview ? (
                        <Image src={avatarPreview} alt="Avatar" width={80} height={80} className="w-full h-full object-cover" />
                      ) : (
                        <FiUpload className="text-2xl text-gray-500 group-hover:text-primary-400 transition-colors" />
                      )}
                    </div>
                    {uploading && (
                      <div className="absolute inset-0 flex items-center justify-center bg-dark-900/80 rounded-2xl">
                        <div className="w-6 h-6 border-2 border-primary-400 border-t-transparent rounded-full animate-spin" />
                      </div>
                    )}
                    <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                    <p className="text-[10px] text-gray-500 text-center mt-2 uppercase font-bold">Upload Photo</p>
                  </label>
                </div>

                <form onSubmit={handleStep1} className="space-y-4">
                  <div className="relative">
                    <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                    <input type="text" placeholder="Full Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="input-field !pl-12" />
                  </div>
                  <div className="relative">
                    <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                    <input type="email" placeholder="Email Address" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="input-field !pl-12" autoComplete="email" />
                  </div>
                  <div className="relative">
                    <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                    <input type={showPassword ? 'text' : 'password'} placeholder="Password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} className="input-field !pl-12 !pr-12" />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300">
                      {showPassword ? <FiEyeOff /> : <FiEye />}
                    </button>
                  </div>
                  <div className="relative">
                    <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                    <input type={showConfirmPassword ? 'text' : 'password'} placeholder="Confirm Password" value={form.confirmPassword} onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })} className="input-field !pl-12 !pr-12" />
                    <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300">
                      {showConfirmPassword ? <FiEyeOff /> : <FiEye />}
                    </button>
                  </div>
                  <button type="submit" className="gradient-btn w-full !py-3 flex justify-center mt-2">
                    <span className="flex items-center gap-2">Next: Wellness Profile <FiArrowRight /></span>
                  </button>
                </form>

                <p className="text-center text-gray-400 mt-6 text-sm">
                  Already have an account?{' '}
                  <Link href={`/login${redirectTo !== '/' ? `?redirect=${redirectTo}` : ''}`} className="text-primary-400 hover:text-primary-300 font-medium">Log in</Link>
                </p>
              </motion.div>
            )}

            {/* STEP 2: Wellness Questionnaire */}
            {step === 2 && (
              <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <div className="text-center mb-8">
                  <h2 className="text-2xl font-bold font-display mb-2">Your Wellness Profile</h2>
                  <p className="text-gray-400 text-sm">Help us personalize your experience</p>
                </div>

                <div className="space-y-6 max-h-[55vh] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-primary-500/30">
                  {/* Stress Level */}
                  <div>
                    <label className="text-sm font-bold text-gray-300 mb-3 block">How stressed do you feel? ({wellness.stressLevel}/10)</label>
                    <input type="range" min="1" max="10" value={wellness.stressLevel} onChange={(e) => setWellness({ ...wellness, stressLevel: parseInt(e.target.value) })}
                      className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-primary-500" />
                    <div className="flex justify-between text-[10px] text-gray-500 mt-1"><span>Low</span><span>High</span></div>
                  </div>

                  {/* Sleep Quality */}
                  <div>
                    <label className="text-sm font-bold text-gray-300 mb-3 block">Sleep quality? ({wellness.sleepQuality}/10)</label>
                    <input type="range" min="1" max="10" value={wellness.sleepQuality} onChange={(e) => setWellness({ ...wellness, sleepQuality: parseInt(e.target.value) })}
                      className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-teal-500" />
                    <div className="flex justify-between text-[10px] text-gray-500 mt-1"><span>Poor</span><span>Excellent</span></div>
                  </div>

                  {/* Current Mood */}
                  <div>
                    <label className="text-sm font-bold text-gray-300 mb-3 block">Current mood?</label>
                    <div className="flex gap-2 flex-wrap">
                      {['happy', 'neutral', 'sad', 'anxious', 'stressed'].map(mood => (
                        <button key={mood} type="button" onClick={() => setWellness({ ...wellness, currentMood: mood })}
                          className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider border transition-all ${
                            wellness.currentMood === mood
                              ? 'bg-primary-500/20 border-primary-500/50 text-primary-400'
                              : 'bg-white/5 border-white/10 text-gray-400 hover:border-white/20'
                          }`}>
                          {mood}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Concerns */}
                  <div>
                    <label className="text-sm font-bold text-gray-300 mb-3 block">What concerns you most? (Select all)</label>
                    <div className="grid grid-cols-2 gap-2">
                      {wellnessConcerns.map(concern => (
                        <button key={concern.id} type="button" onClick={() => toggleConcern(concern.id)}
                          className={`p-3 rounded-xl text-xs font-bold border text-left transition-all ${
                            wellness.concerns.includes(concern.id)
                              ? 'bg-primary-500/20 border-primary-500/50 text-primary-400'
                              : 'bg-white/5 border-white/10 text-gray-400 hover:border-white/20'
                          }`}>
                          <span className="mr-2">{concern.icon}</span>{concern.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Goals */}
                  <div>
                    <label className="text-sm font-bold text-gray-300 mb-3 block">Your wellness goals? (Select all)</label>
                    <div className="grid grid-cols-2 gap-2">
                      {wellnessGoals.map(goal => (
                        <button key={goal.id} type="button" onClick={() => toggleGoal(goal.id)}
                          className={`p-3 rounded-xl text-xs font-bold border text-left transition-all ${
                            wellness.goals.includes(goal.id)
                              ? 'bg-teal-500/20 border-teal-500/50 text-teal-400'
                              : 'bg-white/5 border-white/10 text-gray-400 hover:border-white/20'
                          }`}>
                          <FiCheck className={`inline mr-2 ${wellness.goals.includes(goal.id) ? 'opacity-100' : 'opacity-0'}`} />
                          {goal.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Exercise */}
                  <div>
                    <label className="text-sm font-bold text-gray-300 mb-3 block">How often do you exercise?</label>
                    <div className="flex gap-2 flex-wrap">
                      {['never', 'rarely', 'sometimes', 'often', 'daily'].map(freq => (
                        <button key={freq} type="button" onClick={() => setWellness({ ...wellness, exerciseFrequency: freq })}
                          className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider border transition-all ${
                            wellness.exerciseFrequency === freq
                              ? 'bg-primary-500/20 border-primary-500/50 text-primary-400'
                              : 'bg-white/5 border-white/10 text-gray-400 hover:border-white/20'
                          }`}>
                          {freq}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Meditation Experience */}
                  <div className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10">
                    <span className="text-sm font-bold text-gray-300">Have meditation experience?</span>
                    <button type="button" onClick={() => setWellness({ ...wellness, meditationExperience: !wellness.meditationExperience })}
                      className={`w-12 h-6 rounded-full transition-all relative ${wellness.meditationExperience ? 'bg-primary-500' : 'bg-white/20'}`}>
                      <div className={`w-5 h-5 rounded-full bg-white absolute top-0.5 transition-all ${wellness.meditationExperience ? 'left-[26px]' : 'left-0.5'}`} />
                    </button>
                  </div>
                </div>

                <div className="flex gap-3 mt-6">
                  {!isGoogleSignup && (
                    <button onClick={() => setStep(1)} className="flex-1 px-6 py-3 rounded-xl border border-white/10 font-medium hover:bg-white/5 transition-all">
                      Back
                    </button>
                  )}
                  <button onClick={handleSubmit} disabled={loading}
                    className="flex-1 gradient-btn !py-3 flex justify-center disabled:opacity-70">
                    {loading ? (
                      <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <span className="flex items-center gap-2"><FiUserPlus /> {isGoogleSignup ? 'Complete Profile' : 'Create Account'}</span>
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

export default function Signup() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-mesh" />}>
      <SignupContent />
    </Suspense>
  );
}
