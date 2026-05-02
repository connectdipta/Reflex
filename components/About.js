'use client';
import { motion } from 'framer-motion';
import { FiCheckCircle, FiTarget, FiHeart, FiTrendingUp } from 'react-icons/fi';
import dynamic from 'next/dynamic';
import mentalTherapyAnimation from '../public/Mental Therapy.json';

const Lottie = dynamic(() => import('lottie-react'), { ssr: false });


const features = [
  { icon: FiHeart, text: 'Personalized wellness plans' },
  { icon: FiTarget, text: 'Mindfulness & CBT practices' },
  { icon: FiCheckCircle, text: 'Progress tracking tools' },
  { icon: FiTrendingUp, text: 'Expert psychiatric support' },
];

export default function About() {
  return (
    <section id="about" className="section-padding bg-mesh relative overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left - Visual */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="relative"
          >
            <div className="relative">
              <div className="glass-card p-4 md:p-8 flex items-center justify-center relative overflow-hidden bg-gradient-to-br from-primary-500/5 to-teal-500/5">
                <div className="w-full max-w-[400px]">
                  <Lottie 
                    animationData={mentalTherapyAnimation} 
                    loop={true} 
                    className="w-full h-auto drop-shadow-2xl"
                  />
                </div>
              </div>

              {/* Floating stat card */}
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="absolute -bottom-6 -right-6 glass-card p-4 shadow-glow"
              >
                <p className="text-3xl font-bold text-gradient">98%</p>
                <p className="text-sm text-gray-400">Satisfaction Rate</p>
              </motion.div>
            </div>
          </motion.div>

          {/* Right - Content */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            <h2 className="section-heading mb-6">
              About <span>Reflex</span>
            </h2>
            <p className="text-gray-400 text-lg leading-relaxed mb-8">
              Reflex is a mental wellness platform designed to help users manage and
              alleviate symptoms of depression through guided relaxation, mindfulness
              practices, and cognitive-behavioral therapy tools. Our app offers a
              personalized, supportive experience with features that empower users to
              monitor and improve their mental well-being.
            </p>

            <div className="space-y-4 mb-8">
              {features.map((feature, i) => {
                const Icon = feature.icon;
                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 + i * 0.1 }}
                    className="flex items-center gap-3 group"
                  >
                    <div className="w-10 h-10 rounded-xl bg-primary-500/10 flex items-center justify-center group-hover:bg-primary-500/20 transition-colors">
                      <Icon className="text-primary-400" />
                    </div>
                    <span className="text-gray-300 group-hover:text-white transition-colors">
                      {feature.text}
                    </span>
                  </motion.div>
                );
              })}
            </div>

            <motion.a
              href="#services"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="gradient-btn inline-block"
            >
              <span>Learn More</span>
            </motion.a>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
