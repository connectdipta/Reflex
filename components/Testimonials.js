'use client';
import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { RiDoubleQuotesL } from 'react-icons/ri';
import { FaStar } from 'react-icons/fa';

const testimonials = [
  {
    name: 'Morijorch Allen',
    role: 'Wellness Advocate',
    text: 'Reflex has been a game-changer for my mental health. The mindfulness practices and guided sessions have helped me find peace in my daily life. I feel more centered and calm than ever before.',
    rating: 5,
  },
  {
    name: 'Rochak Sharma',
    role: 'Student',
    text: 'I was struggling with anxiety, and Reflex provided me with the tools I needed to cope. The supportive community and resources are incredible! The yoga therapy sessions are my favorite.',
    rating: 5,
  },
  {
    name: 'Brad Johnson',
    role: 'Software Engineer',
    text: 'Reflex has transformed my outlook on life. The blend of music therapy, counseling, and mindfulness has truly enriched my well-being. Highly recommend to anyone feeling overwhelmed.',
    rating: 5,
  },
  {
    name: 'Sarah Mitchell',
    role: 'Teacher',
    text: 'The psychiatrist consult feature is phenomenal. Being able to connect with professionals from home has made seeking help so much easier. Reflex truly cares about its users.',
    rating: 4,
  },
];

export default function Testimonials() {
  const [current, setCurrent] = useState(0);

  const next = useCallback(() => setCurrent((prev) => (prev + 1) % testimonials.length), []);
  const prev = () => setCurrent((prev) => (prev - 1 + testimonials.length) % testimonials.length);

  // Auto-play
  useEffect(() => {
    const timer = setInterval(() => {
      next();
    }, 5000);
    return () => clearInterval(timer);
  }, [next]);

  const handleDragEnd = (e, { offset, velocity }) => {
    const swipe = offset.x;
    if (swipe < -50) {
      next();
    } else if (swipe > 50) {
      prev();
    }
  };

  return (
    <section id="testimonials" className="section-padding relative overflow-hidden bg-mesh">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-teal-500/5 rounded-full blur-3xl pointer-events-none" />
      
      {/* Decorative background quotes */}
      <motion.div
        animate={{ y: [0, -20, 0], rotate: [0, 10, -10, 0], scale: [1, 1.1, 1] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-20 lg:top-40 left-10 lg:left-32 text-8xl text-primary-500/10 pointer-events-none"
      >
        <RiDoubleQuotesL />
      </motion.div>
      <motion.div
        animate={{ y: [0, 30, 0], rotate: [0, -15, 10, 0], scale: [1, 1.2, 1] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        className="absolute bottom-20 lg:bottom-40 right-10 lg:right-32 text-9xl text-teal-500/10 pointer-events-none"
      >
        <RiDoubleQuotesL />
      </motion.div>

      <div className="max-w-4xl mx-auto relative">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="section-heading mb-4">
            What People <span>Say</span>
          </h2>
          <p className="text-gray-400 text-lg">
            Real stories from real people whose lives have been transformed.
          </p>
        </motion.div>

        <div className="relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              initial={{ opacity: 0, x: 100, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: -100, scale: 0.95 }}
              transition={{ duration: 0.5, type: 'spring', bounce: 0.3 }}
              className="glass-card-hover p-8 md:p-12 text-center relative overflow-hidden group cursor-grab active:cursor-grabbing border border-white/5 hover:border-primary-500/30"
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.8}
              onDragEnd={handleDragEnd}
            >
              {/* Subtle animated gradient background on hover */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary-500/0 via-teal-500/0 to-primary-500/0 group-hover:from-primary-500/5 group-hover:via-teal-500/5 group-hover:to-primary-500/5 transition-all duration-500 pointer-events-none" />

              <RiDoubleQuotesL className="text-5xl text-primary-500/40 mx-auto mb-6 group-hover:scale-110 transition-transform duration-500" />

              <p className="text-xl md:text-2xl text-gray-200 leading-relaxed mb-8 italic font-light drop-shadow-md">
                &ldquo;{testimonials[current].text}&rdquo;
              </p>

              <div className="flex justify-center gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <FaStar
                    key={i}
                    className={`text-lg ${
                      i < testimonials[current].rating ? 'text-amber-400' : 'text-gray-600'
                    }`}
                  />
                ))}
              </div>

              <div className="flex items-center justify-center gap-4 relative z-10">
                <div className="relative">
                  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary-500 to-teal-500 flex items-center justify-center text-xl font-bold text-white shadow-[0_0_20px_rgba(45,212,191,0.4)] group-hover:shadow-[0_0_30px_rgba(45,212,191,0.6)] transition-shadow duration-300">
                    {testimonials[current].name[0]}
                  </div>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
                    className="absolute -inset-1.5 border border-dashed border-primary-400/40 rounded-full"
                  />
                </div>
                <div className="text-left">
                  <h4 className="font-bold text-lg">{testimonials[current].name}</h4>
                  <p className="text-sm text-gray-400">{testimonials[current].role}</p>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Controls */}
          <div className="flex items-center justify-center gap-4 mt-8">
            <button
              onClick={prev}
              className="w-12 h-12 rounded-full glass-card flex items-center justify-center hover:bg-primary-500/20 transition-colors"
            >
              <FiChevronLeft className="text-xl" />
            </button>

            <div className="flex gap-2">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrent(i)}
                  className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                    i === current
                      ? 'bg-primary-500 w-8'
                      : 'bg-white/20 hover:bg-white/40'
                  }`}
                />
              ))}
            </div>

            <button
              onClick={next}
              className="w-12 h-12 rounded-full glass-card flex items-center justify-center hover:bg-primary-500/20 transition-colors"
            >
              <FiChevronRight className="text-xl" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
