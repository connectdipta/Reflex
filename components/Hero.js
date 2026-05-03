'use client';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { FiArrowRight, FiHeart, FiStar } from 'react-icons/fi';
import dynamic from 'next/dynamic';
import Typewriter from 'typewriter-effect';
import doctorAnimation from '../public/doctor.json';

const Lottie = dynamic(() => import('lottie-react'), { ssr: false });

export default function Hero() {
  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center overflow-hidden bg-mesh"
    >
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{ x: [0, 30, 0], y: [0, -20, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-20 left-10 w-72 h-72 bg-primary-500/10 rounded-full blur-3xl will-change-transform transform-gpu"
        />
        <motion.div
          animate={{ x: [0, -20, 0], y: [0, 30, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute bottom-20 right-10 w-96 h-96 bg-teal-500/8 rounded-full blur-3xl will-change-transform transform-gpu"
        />
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 6, repeat: Infinity }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary-600/5 rounded-full blur-3xl will-change-transform transform-gpu"
        />

        {/* Floating Particles */}
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            animate={{
              y: [0, -30, 0],
              opacity: [0.2, 0.6, 0.2],
            }}
            transition={{
              duration: 4 + i,
              repeat: Infinity,
              delay: i * 0.5,
            }}
            className="absolute w-2 h-2 rounded-full bg-primary-400/30 will-change-transform transform-gpu"
            style={{
              top: `${20 + i * 12}%`,
              left: `${10 + i * 15}%`,
            }}
          />
        ))}
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 md:py-0">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="text-center lg:text-left"
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-500/10 border border-primary-500/20 text-primary-400 text-sm font-medium mb-6"
            >
              <FiHeart className="animate-pulse" />
              Your Mental Wellness Matters
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-5xl sm:text-6xl lg:text-7xl font-bold font-display leading-tight mb-6"
            >
              RE
              <span className="text-gradient">FLEX</span>
              <br />
              <span className="text-3xl sm:text-4xl lg:text-5xl text-gray-400 font-normal inline-block h-[1.2em]">
                <Typewriter
                  options={{
                    strings: [
                      'Find Your Inner Peace',
                      'Overcome Daily Stress',
                      'Nurture Mental Health',
                      'Discover True Balance',
                    ],
                    autoStart: true,
                    loop: true,
                    delay: 50,
                    deleteSpeed: 30,
                    cursorClassName: "text-primary-500 animate-pulse",
                  }}
                />
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="text-gray-400 text-lg md:text-xl leading-relaxed max-w-xl mx-auto lg:mx-0 mb-8"
            >
              A mental wellness platform designed to help you manage stress, anxiety, and
              depression through guided relaxation, mindfulness practices, and expert
              psychiatric support.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
            >
              <Link href="/#services" className="gradient-btn text-center">
                <span className="flex items-center justify-center gap-2">
                  Explore Services
                  <FiArrowRight />
                </span>
              </Link>
              <Link
                href="/booking"
                className="px-8 py-3 rounded-xl border border-white/10 font-semibold hover:bg-white/5 hover:border-primary-500/30 transition-all duration-300 text-center"
              >
                Book Psychiatrist
              </Link>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 }}
              className="flex gap-8 mt-12 justify-center lg:justify-start"
            >
              {[
                { value: '500+', label: 'Users Helped' },
                { value: '50+', label: 'Therapists' },
                { value: '4.9', label: 'Rating', icon: FiStar },
              ].map((stat, i) => (
                <div key={i} className="text-center">
                  <p className="text-2xl md:text-3xl font-bold text-gradient flex items-center justify-center gap-1">
                    {stat.value}
                    {stat.icon && <stat.icon className="text-teal-400 text-lg" />}
                  </p>
                  <p className="text-sm text-gray-500 mt-1">{stat.label}</p>
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* Right Visual (Lottie Animation) */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="relative hidden lg:flex items-center justify-center w-full"
          >
            {/* Lottie Animation container */}
            <div className="w-full max-w-[600px] relative z-10 drop-shadow-[0_0_30px_rgba(45,212,191,0.2)]">
              <Lottie 
                animationData={doctorAnimation} 
                loop={true} 
                className="w-full h-auto"
              />
            </div>
            
            {/* Background Glow behind animation */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}
              className="absolute w-[450px] h-[450px] border border-primary-500/10 rounded-full z-0"
            />
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <div className="w-6 h-10 rounded-full border-2 border-white/20 flex justify-center">
          <motion.div
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="w-1.5 h-3 bg-primary-400 rounded-full mt-2"
          />
        </div>
      </motion.div>
    </section>
  );
}
