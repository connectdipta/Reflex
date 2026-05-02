'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiPlus, FiMinus, FiHelpCircle } from 'react-icons/fi';

const faqs = [
  {
    question: "What exactly is Reflex and how can it help me?",
    answer: "Reflex is a comprehensive mental wellness platform that combines technology with human expertise. We offer various therapies like Audio, Yoga, Reading, and Laughing Therapy, alongside direct access to certified psychiatrists. Our goal is to provide a holistic, digital-first approach to emotional well-being."
  },
  {
    question: "Are the psychiatrists on Reflex certified professionals?",
    answer: "Yes, absolutely. All psychiatrists on our platform are verified, board-certified specialists with extensive experience in clinical mental health. You can view their individual profiles, education, and achievements before booking a consultation."
  },
  {
    question: "How secure and private is my wellness data?",
    answer: "Data privacy is our top priority. All your interactions, consultation notes, and tracking data are encrypted and stored securely. We adhere to strict HIPAA-compliant standards to ensure your personal information remains confidential and is only accessible by you and your designated specialist."
  },
  {
    question: "Can I use Reflex alongside my existing clinical therapy?",
    answer: "Yes, Reflex is designed to complement existing treatments. Our self-care tools like Wellness Tracking and Audio Therapy are excellent supplementary resources. However, we always recommend informing your current primary therapist about any new wellness programs you begin."
  },
  {
    question: "What is the 'Wellness Intelligence' dashboard?",
    answer: "The Wellness Intelligence dashboard is an advanced analytics tool that tracks your mood, sleep, and meditation patterns. It uses your input to create visual trends, helping you and your psychiatrist understand your emotional trajectory and adjust your wellness plan accordingly."
  }
];

export default function FAQ() {
  const [activeIndex, setActiveIndex] = useState(null);

  return (
    <section id="faq" className="section-padding relative overflow-hidden bg-mesh">
      {/* Background Mesh Overlay */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary-500/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-teal-500/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-4xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="flex items-center justify-center gap-2 text-primary-400 font-bold text-sm uppercase tracking-widest mb-4">
            <FiHelpCircle /> Support Center
          </div>
          <h2 className="text-4xl md:text-5xl font-bold font-display mb-6">
            Commonly Asked <span className="text-gradient">Questions</span>
          </h2>
          <p className="text-gray-400 text-lg">
            Find answers to frequently asked questions about our services and platform.
          </p>
        </motion.div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              viewport={{ once: true }}
              className="glass-card border-white/5 overflow-hidden"
            >
              <button
                onClick={() => setActiveIndex(activeIndex === index ? null : index)}
                className="w-full p-6 md:p-8 flex items-center justify-between text-left transition-colors hover:bg-white/[0.02]"
              >
                <span className="text-lg font-bold text-gray-200 pr-8">
                  {faq.question}
                </span>
                <div className={`flex-shrink-0 w-8 h-8 rounded-full border border-white/10 flex items-center justify-center transition-all duration-300 ${activeIndex === index ? 'bg-primary-500 border-primary-500 text-white rotate-180' : 'text-gray-400'}`}>
                  {activeIndex === index ? <FiMinus /> : <FiPlus />}
                </div>
              </button>

              <AnimatePresence>
                {activeIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                  >
                    <div className="px-6 md:px-8 pb-8 text-gray-400 leading-relaxed border-t border-white/5 pt-6">
                      {faq.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
