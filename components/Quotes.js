'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const quotes = [
  { text: "Healing takes time, and asking for help is a courageous step.", author: "Mariska Hargitay" },
  { text: "You don't have to control your thoughts. You just have to stop letting them control you.", author: "Dan Millman" },
  { text: "There is hope, even when your brain tells you there isn't.", author: "John Green" },
  { text: "Mental health needs a great deal of attention. It’s the final taboo and it needs to be faced and dealt with.", author: "Adam Ant" },
  { text: "What mental health needs is more sunlight, more candor, and more unashamed conversation.", author: "Glenn Close" },
  { text: "Self-care is how you take your power back.", author: "Lalah Delia" },
];

export default function Quotes() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % quotes.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="py-24 md:py-32 relative overflow-hidden bg-[#0A1128]">
      {/* Dynamic Background Glow */}
      <motion.div 
        animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl h-40 bg-gradient-to-r from-primary-500/20 to-teal-500/20 blur-[100px] pointer-events-none rounded-full" 
      />

      <div className="max-w-5xl mx-auto px-6 relative z-10 text-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={current}
            initial={{ opacity: 0, y: 30, filter: "blur(12px)", scale: 0.95 }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)", scale: 1 }}
            exit={{ opacity: 0, y: -30, filter: "blur(12px)", scale: 0.95 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="flex flex-col items-center"
          >
            <span className="text-6xl md:text-8xl text-primary-500/20 mb-4 font-serif leading-none h-12">"</span>
            
            <p className="text-2xl md:text-4xl lg:text-5xl font-light text-white leading-relaxed mb-8 drop-shadow-xl px-4 md:px-12">
              {quotes[current].text}
            </p>
            
            <div className="flex items-center gap-6">
              <div className="w-16 h-[2px] bg-gradient-to-r from-transparent to-primary-500" />
              <p className="text-teal-400 tracking-[0.2em] uppercase text-sm md:text-base font-semibold drop-shadow-md">
                {quotes[current].author}
              </p>
              <div className="w-16 h-[2px] bg-gradient-to-l from-transparent to-teal-500" />
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Progress Line */}
      <div className="absolute bottom-0 left-0 w-full h-[2px] bg-white/5">
        <motion.div
          key={`progress-${current}`}
          initial={{ width: "0%" }}
          animate={{ width: "100%" }}
          transition={{ duration: 6, ease: "linear" }}
          className="h-full bg-gradient-to-r from-primary-500 to-teal-500"
        />
      </div>
    </section>
  );
}
