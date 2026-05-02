'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import dynamic from 'next/dynamic';
import { useAuth } from '@/context/AuthContext';
import { FiArrowLeft, FiPlayCircle, FiHeart } from 'react-icons/fi';
import { FaHeart } from 'react-icons/fa';
import { GiMeditation } from 'react-icons/gi';
import toast from 'react-hot-toast';
import yogasanAnimation from '@/public/Yogasan.json';

const Lottie = dynamic(() => import('lottie-react'), { ssr: false });

const initialSessions = [
  { title: 'Morning Flow', duration: '20 MIN', level: 'Beginner', url: 'https://www.youtube.com/embed/dAqQqmaI9vY?autoplay=1', thumbnail: 'https://img.youtube.com/vi/dAqQqmaI9vY/maxresdefault.jpg' },
  { title: 'Yoga for Anxiety', duration: '35 MIN', level: 'All Levels', url: 'https://www.youtube.com/embed/C2RAjUEAoLI?autoplay=1', thumbnail: 'https://img.youtube.com/vi/C2RAjUEAoLI/maxresdefault.jpg' },
  { title: 'Deep Tissue Release', duration: '45 MIN', level: 'Intermediate', url: 'https://www.youtube.com/embed/nQwKKCqkJxg?autoplay=1', thumbnail: 'https://img.youtube.com/vi/nQwKKCqkJxg/maxresdefault.jpg' },
  { title: 'Bedtime Wind Down', duration: '15 MIN', level: 'Beginner', url: 'https://www.youtube.com/embed/LCyP3F7gRC4?autoplay=1', thumbnail: 'https://img.youtube.com/vi/LCyP3F7gRC4/maxresdefault.jpg' },
  { title: 'Core Strength Yoga', duration: '30 MIN', level: 'Intermediate', url: 'https://www.youtube.com/embed/cxm0zdZDLeE?autoplay=1', thumbnail: 'https://img.youtube.com/vi/cxm0zdZDLeE/maxresdefault.jpg' },
  { title: 'Full Body Flexibility', duration: '40 MIN', level: 'All Levels', url: 'https://www.youtube.com/embed/EvMTrP8eRvM?autoplay=1', thumbnail: 'https://img.youtube.com/vi/EvMTrP8eRvM/maxresdefault.jpg' },
  { title: 'Mindful Breathing', duration: '25 MIN', level: 'Beginner', url: 'https://www.youtube.com/embed/B4kNiCWTl7M?autoplay=1', thumbnail: 'https://img.youtube.com/vi/B4kNiCWTl7M/maxresdefault.jpg' },
];

export default function YogaTherapy() {
  const { isLoggedIn, loading, token } = useAuth();
  const router = useRouter();
  const [currentTrack, setCurrentTrack] = useState(null);
  const [sessions, setSessions] = useState(initialSessions);

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

  const handleStartSession = () => {
    const randomTrack = sessions[Math.floor(Math.random() * sessions.length)];
    setCurrentTrack(randomTrack.url);
    updateTracking('yoga');
    document.getElementById('video-player')?.scrollIntoView({ behavior: 'smooth' });
  };

  const toggleFavorite = (e, url) => {
    e.stopPropagation();
    setSessions(prev => {
      const newSessions = prev.map(s => s.url === url ? { ...s, isFavorite: !s.isFavorite } : s);
      const session = newSessions.find(s => s.url === url);
      
      if (session.isFavorite) {
        toast.success('Added to favorites!');
      } else {
        toast.success('Removed from favorites');
      }

      const favs = newSessions.filter(s => s.isFavorite);
      const nonFavs = newSessions.filter(s => !s.isFavorite);
      return [...favs, ...nonFavs];
    });
  };

  useEffect(() => {
    if (!loading && !isLoggedIn) {
      toast.error('Please login to access Yoga Therapy');
      router.push('/login');
    }
  }, [isLoggedIn, loading, router]);

  if (loading || !isLoggedIn) return null;

  return (
    <div className="min-h-screen bg-mesh py-24 px-4">
      <div className="max-w-5xl mx-auto">
        <Link href="/#services" className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-8">
          <FiArrowLeft /> Back to Services
        </Link>

        <div className="grid lg:grid-cols-2 gap-16 items-center mb-16">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-teal-500/10 border border-teal-500/20 text-teal-400 text-sm mb-6">
              <GiMeditation /> Mindful Movement
            </div>
            <h1 className="text-4xl md:text-5xl font-bold font-display mb-6">
              Restore Balance with <span className="text-gradient">Yoga</span>
            </h1>
            <p className="text-gray-400 text-lg leading-relaxed mb-8">
              Connect your mind and body through guided yoga sessions. Our practices are 
              specifically designed to release physical tension, calm the nervous system, 
              and promote emotional well-being.
            </p>
            <button onClick={handleStartSession} className="gradient-btn !px-8 py-3 w-full sm:w-auto">
              <span>Start Today's Session</span>
            </button>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative w-full"
            id="video-player"
          >
            {currentTrack ? (
              <div className="w-full aspect-video rounded-3xl overflow-hidden shadow-[0_0_50px_rgba(20,184,166,0.2)] border border-teal-500/30 bg-black">
                <iframe
                  width="100%"
                  height="100%"
                  src={currentTrack}
                  title="YouTube video player"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full"
                ></iframe>
              </div>
            ) : (
              <div 
                onClick={handleStartSession}
                className="glass-card p-2 rounded-3xl overflow-hidden relative group cursor-pointer w-full hover:scale-[1.02] transition-transform"
              >
                <div className="aspect-video bg-gradient-to-br from-teal-500/20 to-emerald-500/20 rounded-2xl flex items-center justify-center border border-teal-500/20 group-hover:border-teal-500/40 transition-colors relative overflow-hidden">
                  {/* Lottie Animation */}
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0 mix-blend-screen opacity-90">
                    <Lottie animationData={yogasanAnimation} loop={true} className="w-full h-full object-cover" />
                  </div>
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors z-10" />
                  <FiPlayCircle className="text-6xl text-white opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all z-20" />
                </div>
                <div className="absolute bottom-6 left-6 right-6 z-20 pointer-events-none">
                  <h3 className="text-xl font-bold mb-1 drop-shadow-md text-white">Introduction to Mindful Yoga</h3>
                  <p className="text-sm text-gray-200 drop-shadow-md">10 MIN • Welcome Session</p>
                </div>
              </div>
            )}
          </motion.div>
        </div>

        <motion.h3 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-2xl font-bold mb-6"
        >
          Recommended for you
        </motion.h3>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {sessions.map((session, i) => (
            <motion.div 
              layout
              key={session.url}
              onClick={() => {
                setCurrentTrack(session.url);
                updateTracking('yoga');
                document.getElementById('video-player')?.scrollIntoView({ behavior: 'smooth' });
              }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className={`glass-card-hover p-5 cursor-pointer group transition-all relative ${
                currentTrack === session.url ? 'border-teal-500 bg-teal-500/10' : ''
              }`}
            >
              <button 
                onClick={(e) => toggleFavorite(e, session.url)}
                className={`absolute top-4 right-4 z-10 p-2 transition-colors ${session.isFavorite ? 'text-rose-400' : 'text-gray-500 hover:text-rose-400'}`}
              >
                {session.isFavorite ? <FaHeart className="text-xl" /> : <FiHeart className="text-xl" />}
              </button>

              <div className={`aspect-video rounded-xl mb-4 flex items-center justify-center transition-all overflow-hidden relative ${
                currentTrack === session.url ? 'ring-2 ring-teal-500 shadow-[0_0_15px_rgba(20,184,166,0.3)]' : 'group-hover:ring-1 group-hover:ring-teal-500/50'
              }`}>
                {/* Background Thumbnail Image */}
                <img 
                  src={session.thumbnail} 
                  alt={session.title} 
                  className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-opacity duration-300" 
                  loading="lazy"
                />
                {/* Dark Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0f1c] via-[#0a0f1c]/40 to-transparent pointer-events-none" />

                {/* Centered Play Button */}
                <div className="relative z-10 w-12 h-12 rounded-full bg-teal-500/30 backdrop-blur-md flex items-center justify-center group-hover:bg-teal-500/60 transition-colors border border-white/10">
                  <FiPlayCircle className={`text-2xl transition-colors ${
                    currentTrack === session.url ? 'text-teal-300' : 'text-white'
                  }`} />
                </div>
              </div>
              <h4 className={`font-bold mb-1 transition-colors ${
                currentTrack === session.url ? 'text-white' : 'group-hover:text-teal-400'
              }`}>{session.title}</h4>
              <div className="flex justify-between items-center text-xs text-gray-400">
                <span>{session.duration}</span>
                <span className="px-2 py-0.5 rounded bg-white/5">{session.level}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
