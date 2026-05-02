'use client';

import Lottie from 'lottie-react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { FiArrowLeft, FiHome } from 'react-icons/fi';
import animationData from '@/public/404 website error animation.json';

export default function NotFound() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-[#0a0f1c] relative overflow-hidden flex flex-col items-center justify-center p-4">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 -left-[10%] w-[50%] h-[50%] bg-sky-500/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 -right-[10%] w-[50%] h-[50%] bg-teal-500/10 rounded-full blur-[120px]" />
      </div>

      <div className="relative z-10 flex flex-col items-center max-w-2xl mx-auto text-center">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md mb-8 drop-shadow-[0_0_30px_rgba(14,165,233,0.2)]"
        >
          <Lottie
            animationData={animationData}
            loop={true}
            autoplay={true}
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
        >
          <p className="text-gray-400 text-lg mb-10 max-w-md mx-auto leading-relaxed">
            The page you're searching for has drifted away. Let's get you back to a more mindful place.
          </p>

          <div className="flex flex-wrap justify-center gap-4">
            <button
              onClick={() => router.back()}
              className="px-8 py-4 bg-white/5 hover:bg-white/10 text-white rounded-2xl transition-all duration-300 border border-white/10 font-bold flex items-center gap-2 group"
            >
              <FiArrowLeft className="group-hover:-translate-x-1 transition-transform" /> Go Back
            </button>
            <button
              onClick={() => router.push('/')}
              className="gradient-btn !px-8 !py-4 shadow-xl shadow-sky-500/20"
            >
              <span className="flex items-center gap-2">
                <FiHome /> Return Home
              </span>
            </button>
          </div>
        </motion.div>
      </div>

      {/* Floating Particles */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ 
              top: Math.random() * 100 + '%', 
              left: Math.random() * 100 + '%',
              scale: Math.random() * 0.5 + 0.5
            }}
            animate={{ 
              y: [0, -30, 0],
              opacity: [0.3, 0.7, 0.3]
            }}
            transition={{ 
              duration: Math.random() * 5 + 5, 
              repeat: Infinity, 
              ease: "easeInOut" 
            }}
            className="absolute w-1 h-1 bg-sky-400 rounded-full"
          />
        ))}
      </div>
    </div>
  );
}