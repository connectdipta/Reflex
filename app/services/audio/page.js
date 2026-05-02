'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import dynamic from 'next/dynamic';
import { useAuth } from '@/context/AuthContext';
import { FiArrowLeft, FiPlayCircle, FiHeart, FiMusic } from 'react-icons/fi';
import { FaHeart } from 'react-icons/fa';
import toast from 'react-hot-toast';
import listeningMusicAnimation from '@/public/listening music.json';

const Lottie = dynamic(() => import('lottie-react'), { ssr: false });

const initialTracks = [
  { title: 'Binaural Healing Frequencies', duration: '45 MIN', tag: 'Sleep', url: 'https://www.youtube.com/embed/YRJ6xoiRcpQ?autoplay=1' },
  { title: 'Deep Meditation State', duration: '30 MIN', tag: 'Focus', url: 'https://www.youtube.com/embed/yhFccHgf_FQ?autoplay=1' },
  { title: 'Nervous System Reset', duration: '20 MIN', tag: 'Calm', url: 'https://www.youtube.com/embed/D0eE8l87oyY?autoplay=1' },
  { title: 'Ambient Soundscape Collection', duration: '60 MIN', tag: 'Relax', url: 'https://www.youtube.com/embed/videoseries?list=OLAK5uy_koVrOjh9NVFYukB9niSTiawelzXDWxWhg&autoplay=1' },
  { title: 'Mindful Breathing Journey', duration: '45 MIN', tag: 'Focus', url: 'https://www.youtube.com/embed/videoseries?list=OLAK5uy_nyjP35Aa9CnSEWPnuuBp_DPhjHSRvwRV4&autoplay=1' },
  { title: 'Soothing Nature Retreat', duration: '90 MIN', tag: 'Relax', url: 'https://www.youtube.com/embed/videoseries?list=RDCLAK5uy_l2OjbOL4oVkkHE86UT6oQCNufuv8d0luQ&autoplay=1' },
  { title: 'Stress Relief Harmony', duration: '50 MIN', tag: 'Calm', url: 'https://www.youtube.com/embed/videoseries?list=OLAK5uy_nBw1z4PxtS561BIac3DEgobLTTDL_LNHE&autoplay=1' },
];

export default function AudioTherapy() {
  const { isLoggedIn, loading, token } = useAuth();
  const router = useRouter();
  const [currentTrack, setCurrentTrack] = useState(null);
  const [tracks, setTracks] = useState(initialTracks);

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

  const handleStartListening = () => {
    const randomTrack = tracks[Math.floor(Math.random() * tracks.length)];
    setCurrentTrack(randomTrack.url);
    updateTracking('audio');
  };

  const handleViewLibrary = () => {
    document.getElementById('audio-library')?.scrollIntoView({ behavior: 'smooth' });
  };

  const toggleFavorite = (e, url) => {
    e.stopPropagation();
    setTracks(prevTracks => {
      const newTracks = prevTracks.map(t => t.url === url ? { ...t, isFavorite: !t.isFavorite } : t);
      const track = newTracks.find(t => t.url === url);
      
      if (track.isFavorite) {
        toast.success('Added to favorites!');
      } else {
        toast.success('Removed from favorites');
      }

      const favs = newTracks.filter(t => t.isFavorite);
      const nonFavs = newTracks.filter(t => !t.isFavorite);
      return [...favs, ...nonFavs];
    });
  };

  useEffect(() => {
    if (!loading && !isLoggedIn) {
      toast.error('Please login to access Audio Therapy');
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

        <div className="grid lg:grid-cols-5 gap-12 items-center mb-16">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-3"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-400 text-sm mb-6">
              <FiMusic /> Premium Audio Experience
            </div>
            <h1 className="text-4xl md:text-5xl font-bold font-display mb-6">
              Find Peace Through <span className="text-gradient">Sound</span>
            </h1>
            <p className="text-gray-400 text-lg leading-relaxed mb-8">
              Immerse yourself in our curated collection of therapeutic audio. From binaural beats 
              to guided meditations and nature soundscapes, discover the power of auditory healing.
            </p>
            <div className="flex gap-4">
              <button onClick={handleStartListening} className="gradient-btn !px-6 !py-3">
                <span>Start Listening</span>
              </button>
              <button onClick={handleViewLibrary} className="px-6 py-3 rounded-xl border border-white/10 hover:bg-white/5 transition-colors">
                View Library
              </button>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="lg:col-span-2 relative"
          >
            {currentTrack ? (
              <div className="w-full aspect-video md:aspect-square rounded-3xl overflow-hidden shadow-[0_0_50px_rgba(139,92,246,0.2)] border border-violet-500/30 bg-black">
                <iframe
                  width="100%"
                  height="100%"
                  src={currentTrack}
                  title="YouTube music player"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full"
                ></iframe>
              </div>
            ) : (
              <div 
                onClick={handleStartListening}
                className="w-full aspect-square rounded-full bg-gradient-to-br from-violet-500/20 to-purple-500/20 border border-violet-500/30 flex items-center justify-center relative shadow-[0_0_50px_rgba(139,92,246,0.3)] overflow-hidden cursor-pointer hover:scale-[1.02] transition-transform group"
              >
                <motion.div 
                  animate={{ rotate: 360 }} 
                  transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                  className="absolute inset-4 rounded-full border border-dashed border-violet-500/40 z-10 group-hover:border-violet-400/60 transition-colors"
                />
                
                {/* Lottie Animation */}
                <div className="absolute inset-0 flex items-center justify-center opacity-80 mix-blend-screen pointer-events-none z-0">
                  <Lottie animationData={listeningMusicAnimation} loop={true} className="w-[80%] h-[80%]" />
                </div>
              </div>
            )}
          </motion.div>
        </div>

        <motion.div 
          id="audio-library"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid sm:grid-cols-2 gap-6"
        >
          {tracks.map((track, i) => (
            <div 
              key={i} 
              onClick={() => {
                setCurrentTrack(track.url);
                updateTracking('audio');
              }}
              className={`glass-card-hover p-5 flex items-center justify-between cursor-pointer group transition-all ${
                currentTrack === track.url ? 'border-violet-500 bg-violet-500/10' : ''
              }`}
            >
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors ${
                  currentTrack === track.url ? 'bg-violet-500 text-white' : 'bg-violet-500/10 text-violet-400 group-hover:bg-violet-500 group-hover:text-white'
                }`}>
                  <FiPlayCircle className="text-xl" />
                </div>
                <div>
                  <h3 className={`font-bold transition-colors ${
                    currentTrack === track.url ? 'text-white' : 'text-gray-200 group-hover:text-white'
                  }`}>{track.title}</h3>
                  <div className="flex items-center gap-3 text-xs mt-1">
                    <span className="text-violet-400">{track.tag}</span>
                    <span className="text-gray-500">•</span>
                    <span className="text-gray-500">{track.duration}</span>
                  </div>
                </div>
              </div>
              <button 
                onClick={(e) => toggleFavorite(e, track.url)}
                className={`transition-colors ${track.isFavorite ? 'text-rose-400' : 'text-gray-500 hover:text-rose-400'}`}
              >
                {track.isFavorite ? <FaHeart className="text-xl" /> : <FiHeart className="text-xl" />}
              </button>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
