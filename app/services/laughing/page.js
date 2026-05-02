'use client';
import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import dynamic from 'next/dynamic';
import { useAuth } from '@/context/AuthContext';
import { FiArrowLeft, FiSmile, FiClock, FiCheckCircle, FiZap, FiHeart, FiStar } from 'react-icons/fi';
import toast from 'react-hot-toast';
import laughingAnimation from '@/public/laughing.json';

const Lottie = dynamic(() => import('lottie-react'), { ssr: false });

const sessionSteps = [
  { 
    title: 'Warm Up: Gentle Breathing', 
    desc: 'Close your eyes, take a deep breath, and let out a soft "he-he-he" as you exhale.',
    duration: 60 
  },
  { 
    title: 'The Silent Giggle', 
    desc: 'Try to laugh without making any sound. Shake your shoulders and belly as if you are laughing hard.',
    duration: 60
  },
  { 
    title: 'Belly Laughter', 
    desc: 'Place your hands on your stomach and laugh out loud. Feel the vibrations in your core!',
    duration: 60
  },
  { 
    title: 'The Lion\'s Laugh', 
    desc: 'Stick your tongue out, open your eyes wide, and let out a roar of laughter!',
    duration: 60
  },
  { 
    title: 'Pure Joy: Free Laugh', 
    desc: 'Just let it all out. Laugh about nothing and everything. You are doing great!',
    duration: 60
  }
];

export default function LaughingTherapy() {
  const { isLoggedIn, loading, token } = useAuth();
  const router = useRouter();
  
  const [isSessionActive, setIsSessionActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes
  const [isCompleted, setIsCompleted] = useState(false);
  const timerRef = useRef(null);

  const updateTracking = async (serviceName) => {
    if (!isLoggedIn || !token) return;
    try {
      await fetch('/api/tracking', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ service: serviceName })
      });
    } catch (error) {
      console.error('Error updating tracking:', error);
    }
  };

  const startSession = () => {
    setIsSessionActive(true);
    setIsCompleted(false);
    setTimeLeft(300);
    updateTracking('laughing');
    toast.success('Session Started! Get ready to laugh!');
  };

  const currentStepIndex = Math.min(
    Math.floor((300 - timeLeft) / 60),
    sessionSteps.length - 1
  );
  const currentStep = sessionSteps[currentStepIndex];

  const stopSession = () => {
    setIsSessionActive(false);
    if (timerRef.current) clearInterval(timerRef.current);
  };

  useEffect(() => {
    if (isSessionActive && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsSessionActive(false);
      setIsCompleted(true);
      if (timerRef.current) clearInterval(timerRef.current);
      toast.success('Wonderful session! Keep that smile on your face.');
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isSessionActive, timeLeft]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  useEffect(() => {
    if (!loading && !isLoggedIn) {
      toast.error('Please login to access Laughing Therapy');
      router.push('/login');
    }
  }, [isLoggedIn, loading, router]);

  if (loading || !isLoggedIn) return null;

  return (
    <div className="min-h-screen bg-[#0a0f1c] relative overflow-hidden py-24 px-4">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
        <div className="absolute -top-[20%] -left-[10%] w-[60%] h-[60%] bg-sky-500/10 rounded-full blur-[120px]" />
        <div className="absolute top-[40%] -right-[10%] w-[50%] h-[50%] bg-teal-500/10 rounded-full blur-[120px]" />
      </div>

      <div className="max-w-5xl mx-auto relative z-10">
        <Link href="/#services" className="inline-flex items-center gap-2 text-gray-400 hover:text-sky-400 transition-all mb-12 group">
          <FiArrowLeft className="group-hover:-translate-x-1 transition-transform" /> 
          <span className="font-medium">Back to Services</span>
        </Link>

        <div className="grid lg:grid-cols-2 gap-16 items-center mb-16">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-sky-500/10 border border-sky-500/20 text-sky-400 text-sm font-semibold mb-8">
              <FiSmile className="text-lg" /> Laughter Yoga
            </div>
            <h1 className="text-5xl md:text-7xl font-bold font-display mb-8 tracking-tight">
              Joy is the Best <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 via-teal-500 to-sky-500">
                Medicine
              </span>
            </h1>
            <p className="text-gray-400 text-xl leading-relaxed mb-10 max-w-xl">
              Laughter triggers the release of endorphins, the body\'s natural feel-good chemicals. 
              Our structured sessions help you unlock instant joy and stress relief.
            </p>
            {!isSessionActive && !isCompleted && (
              <div className="flex flex-wrap gap-4">
                <button onClick={startSession} className="gradient-btn !px-8 !py-4 shadow-xl shadow-sky-500/20">
                  <span>Start 5-Min Session</span>
                </button>
                <div className="flex items-center gap-4 text-sm text-gray-500 font-medium">
                  <div className="flex -space-x-2">
                    {[1,2,3].map(i => (
                      <div key={i} className="w-8 h-8 rounded-full border-2 border-dark-900 bg-dark-800 flex items-center justify-center text-[10px]">
                        {String.fromCharCode(64 + i)}
                      </div>
                    ))}
                  </div>
                  <span>1.2k+ joined today</span>
                </div>
              </div>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative"
          >
            <div className="absolute inset-0 bg-sky-500/20 rounded-full blur-[80px] animate-pulse" />
            <div className="w-full aspect-square max-w-md mx-auto relative z-10 flex items-center justify-center">
              <Lottie animationData={laughingAnimation} loop={true} className="w-full h-full drop-shadow-2xl" />
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-card p-1 md:p-1 overflow-hidden"
        >
          <div className="p-8 md:p-12 relative">
            <div className="absolute inset-0 bg-gradient-to-br from-sky-500/5 to-teal-500/5" />
            
            <AnimatePresence mode="wait">
              {isCompleted ? (
                <motion.div
                  key="completed"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="relative z-10 text-center py-8"
                >
                  <div className="w-24 h-24 bg-teal-500/20 text-teal-500 rounded-full flex items-center justify-center mx-auto mb-6">
                    <FiCheckCircle className="text-6xl" />
                  </div>
                  <h2 className="text-4xl font-bold mb-4">You Nailed It!</h2>
                  <p className="text-gray-300 text-lg mb-8 max-w-md mx-auto">
                    Your brain is now flooded with happy endorphins. Keep this vibration going throughout your day!
                  </p>
                  <div className="flex justify-center gap-4">
                    <button 
                      onClick={() => setIsCompleted(false)}
                      className="px-8 py-3 rounded-xl bg-white/5 hover:bg-white/10 transition-all border border-white/10 font-semibold"
                    >
                      Restart Session
                    </button>
                    <button 
                      onClick={() => router.push('/#services')}
                      className="gradient-btn !px-8 !py-3"
                    >
                      <span>Explore More</span>
                    </button>
                  </div>
                </motion.div>
              ) : isSessionActive ? (
                <motion.div
                  key="active"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="relative z-10"
                >
                  <div className="flex items-center justify-between mb-12">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 rounded-2xl bg-sky-500/20 flex items-center justify-center text-sky-400">
                        <FiClock className="text-3xl animate-pulse" />
                      </div>
                      <div>
                        <div className="text-3xl font-bold text-white tabular-nums">{formatTime(timeLeft)}</div>
                        <div className="text-xs text-sky-400 font-bold uppercase tracking-widest">Time Remaining</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-gray-500 font-bold uppercase tracking-widest mb-1">Session Progress</div>
                      <div className="text-lg font-bold text-white">Step {currentStepIndex + 1} <span className="text-gray-500">/ 5</span></div>
                    </div>
                  </div>

                  <div className="mb-12 min-h-[160px] bg-white/5 rounded-3xl p-8 border border-white/10">
                    <motion.div
                      key={currentStep.title}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      <h3 className="text-3xl font-bold text-sky-400 mb-4">{currentStep.title}</h3>
                      <p className="text-xl text-gray-300 leading-relaxed">{currentStep.desc}</p>
                    </motion.div>
                  </div>

                  <div className="w-full h-3 bg-white/5 rounded-full overflow-hidden mb-12">
                    <motion.div 
                      initial={{ width: '100%' }}
                      animate={{ width: `${(timeLeft / 300) * 100}%` }}
                      className="h-full bg-gradient-to-r from-sky-400 to-teal-500"
                    />
                  </div>

                  <div className="flex justify-center">
                    <button 
                      onClick={stopSession}
                      className="px-8 py-3 rounded-xl bg-rose-500/10 text-rose-500 border border-rose-500/20 hover:bg-rose-500/20 transition-all font-bold"
                    >
                      End Session Early
                    </button>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="start"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="relative z-10"
                >
                  <div className="flex items-center justify-between mb-12">
                    <h3 className="text-3xl font-bold text-white">Interactive Exercises</h3>
                    <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/10 border border-sky-500/20 text-sky-400 text-xs font-bold uppercase">
                      <FiZap /> Quick Boost
                    </div>
                  </div>
                  
                  <div className="grid sm:grid-cols-3 gap-6 mb-12">
                    {[
                      { icon: <FiZap />, step: '1', title: 'Deep Inhale', desc: 'Fill your lungs with fresh energy.', color: 'sky' },
                      { icon: <FiHeart />, step: '2', title: 'Hold & Smile', desc: 'Visualize a moment of pure happiness.', color: 'teal' },
                      { icon: <FiStar />, step: '3', title: 'Loud Release', desc: 'Exhale with a vibrant "HA-HA-HA".', color: 'indigo' },
                    ].map((s, i) => (
                      <div key={i} className="group p-6 rounded-3xl bg-white/5 border border-white/10 hover:border-sky-500/30 transition-all duration-500">
                        <div className="w-12 h-12 rounded-2xl bg-sky-500/10 text-sky-400 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                          {s.icon}
                        </div>
                        <h4 className="text-xl font-bold mb-3 text-white">{s.title}</h4>
                        <p className="text-gray-400 leading-relaxed">{s.desc}</p>
                      </div>
                    ))}
                  </div>

                  <div className="flex justify-center">
                    <button 
                      onClick={startSession}
                      className="gradient-btn !px-12 !py-5 text-xl"
                    >
                      <span>Launch 5-Minute Session</span>
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Benefits Section */}
        <div className="grid md:grid-cols-2 gap-8 mt-24">
          <div className="glass-card p-8 flex items-start gap-6">
            <div className="w-14 h-14 rounded-2xl bg-sky-500/20 flex items-center justify-center text-sky-400 shrink-0">
              <FiZap className="text-2xl" />
            </div>
            <div>
              <h4 className="text-xl font-bold mb-2">Instant Energy</h4>
              <p className="text-gray-400 leading-relaxed">Laughing increases oxygen intake and stimulates your heart, lungs, and muscles.</p>
            </div>
          </div>
          <div className="glass-card p-8 flex items-start gap-6">
            <div className="w-14 h-14 rounded-2xl bg-teal-500/20 flex items-center justify-center text-teal-400 shrink-0">
              <FiHeart className="text-2xl" />
            </div>
            <div>
              <h4 className="text-xl font-bold mb-2">Stress Relief</h4>
              <p className="text-gray-400 leading-relaxed">It fires up and then cools down your stress response, creating a relaxed feeling.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

