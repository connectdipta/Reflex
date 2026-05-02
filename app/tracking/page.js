'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import dynamic from 'next/dynamic';
import { 
  FiActivity, 
  FiMoon, 
  FiHeart, 
  FiCheckCircle, 
  FiClock, 
  FiMessageSquare,
  FiTrendingUp,
  FiCalendar,
  FiUser,
  FiZap,
  FiSunrise
} from 'react-icons/fi';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart, 
  Pie, 
  Cell,
  BarChart,
  Bar,
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis
} from 'recharts';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import trackingData from '@/data/wellness_tracking.json';

// Dynamic import for Lottie
const Lottie = dynamic(() => import('lottie-react'), { ssr: false });
import trackingAnim from '@/public/Tracking.json';

export default function Tracking() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const averageMood = Math.round(trackingData.weeklyStats.reduce((acc, curr) => acc + curr.mood, 0) / 7);
  const totalMeditation = trackingData.weeklyStats.reduce((acc, curr) => acc + curr.meditation, 0);

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-dark-900 bg-mesh pt-32 pb-20 px-4 relative overflow-hidden">
        {/* Futuristic Background Decorations */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary-500/5 blur-[150px] rounded-full animate-pulse" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-teal-500/5 blur-[150px] rounded-full animate-pulse" style={{ animationDelay: '3s' }} />

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-start mb-16 gap-8">
            <div className="flex-grow">
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center gap-3 text-primary-400 font-bold text-sm uppercase tracking-widest mb-4"
              >
                <FiZap /> Personalized Analytics
              </motion.div>
              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-5xl md:text-7xl font-bold font-display mb-6"
              >
                Wellness <span className="text-gradient">Intelligence</span>
              </motion.h1>
              <p className="text-gray-400 text-lg max-w-xl leading-relaxed">
                Deep insights into your cognitive patterns and emotional trajectory.
                Our AI-driven analysis helps you stay ahead of your mental wellness goals.
              </p>
              
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="flex gap-4 mt-8"
              >
                <div className="glass-card px-8 py-5 border-primary-500/20 bg-primary-500/5 flex items-center gap-4 group">
                  <div className="w-12 h-12 rounded-full bg-primary-500/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <FiActivity className="text-primary-400 text-xl" />
                  </div>
                  <div>
                    <p className="text-[10px] uppercase font-bold text-gray-500">Avg. Mood</p>
                    <p className="text-2xl font-bold text-primary-400">{averageMood}%</p>
                  </div>
                </div>
                <div className="glass-card px-8 py-5 border-teal-500/20 bg-teal-500/5 flex items-center gap-4 group">
                  <div className="w-12 h-12 rounded-full bg-teal-500/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <FiClock className="text-teal-400 text-xl" />
                  </div>
                  <div>
                    <p className="text-[10px] uppercase font-bold text-gray-500">Meditation</p>
                    <p className="text-2xl font-bold text-teal-400">{totalMeditation}m</p>
                  </div>
                </div>
              </motion.div>
            </div>

            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="w-full md:w-[350px] aspect-square relative"
            >
              <div className="absolute inset-0 bg-primary-500/10 blur-3xl rounded-full animate-pulse" />
              <Lottie animationData={trackingAnim} loop={true} className="w-full h-full relative z-10" />
            </motion.div>
          </div>

          <div className="grid lg:grid-cols-12 gap-8">
            {/* Main Stats: Mood Trend */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="lg:col-span-8 glass-card p-8 md:p-10 border-white/5 bg-white/[0.02]"
            >
              <div className="flex items-center justify-between mb-10">
                <div>
                  <h2 className="text-2xl font-bold flex items-center gap-3 text-white">
                    <FiTrendingUp className="text-primary-400" /> Progress Trajectory
                  </h2>
                  <p className="text-sm text-gray-500">Cross-metric correlation analysis</p>
                </div>
                <div className="hidden sm:flex gap-4">
                  {['Mood', 'Sleep', 'Meditation'].map((label, i) => (
                    <span key={i} className="flex items-center gap-2 text-[10px] uppercase font-bold text-gray-400">
                      <div className={`w-2 h-2 rounded-full ${i === 0 ? 'bg-primary-500' : i === 1 ? 'bg-teal-500' : 'bg-purple-500'}`} /> {label}
                    </span>
                  ))}
                </div>
              </div>

              <div className="h-[400px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={trackingData.weeklyStats}>
                    <defs>
                      <linearGradient id="colorMood" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.4}/>
                        <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="colorSleep" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#14b8a6" stopOpacity={0.2}/>
                        <stop offset="95%" stopColor="#14b8a6" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                    <XAxis 
                      dataKey="day" 
                      stroke="#ffffff20" 
                      fontSize={12} 
                      tickLine={false} 
                      axisLine={false}
                      dy={10}
                    />
                    <YAxis 
                      stroke="#ffffff20" 
                      fontSize={12} 
                      tickLine={false} 
                      axisLine={false}
                      dx={-10}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#0d1528', 
                        border: '1px solid rgba(255,255,255,0.1)', 
                        borderRadius: '16px',
                        fontSize: '12px',
                        boxShadow: '0 10px 30px rgba(0,0,0,0.5)'
                      }}
                    />
                    <Area type="monotone" dataKey="mood" stroke="#0ea5e9" fill="url(#colorMood)" strokeWidth={4} dot={{ r: 4, fill: '#0ea5e9' }} activeDot={{ r: 8 }} />
                    <Area type="monotone" dataKey="sleep" stroke="#14b8a6" fill="url(#colorSleep)" strokeWidth={2} strokeDasharray="5 5" />
                    <Area type="monotone" dataKey="meditation" stroke="#a855f7" fill="transparent" strokeWidth={2} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </motion.div>

            {/* Side Card: Radar Chart */}
            <motion.div 
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              className="lg:col-span-4 glass-card p-8 border-white/5 bg-white/[0.02] flex flex-col items-center"
            >
              <h2 className="text-xl font-bold mb-8 text-center flex items-center gap-2 text-white">
                <FiSunrise className="text-teal-400" /> Emotional Spectrum
              </h2>
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart cx="50%" cy="50%" outerRadius="80%" data={trackingData.moodDistribution}>
                    <PolarGrid stroke="#ffffff10" />
                    <PolarAngleAxis dataKey="name" stroke="#ffffff40" fontSize={10} />
                    <Radar
                      name="Mood"
                      dataKey="value"
                      stroke="#0ea5e9"
                      fill="#0ea5e9"
                      fillOpacity={0.4}
                    />
                    <Tooltip 
                       contentStyle={{ 
                        backgroundColor: '#0d1528', 
                        border: '1px solid rgba(255,255,255,0.1)', 
                        borderRadius: '12px'
                      }}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
              
              <div className="mt-8 space-y-4 w-full">
                {trackingData.moodDistribution.map((item, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                      <span className="text-xs text-gray-400">{item.name}</span>
                    </div>
                    <span className="text-xs font-bold text-white">{item.value}%</span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Expert Insights */}
            <div className="lg:col-span-12 mt-12">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-3xl font-bold font-display flex items-center gap-3 text-white">
                  <FiMessageSquare className="text-primary-400" /> Clinical Feedback
                </h2>
                <div className="h-px flex-grow mx-8 bg-gradient-to-r from-white/10 to-transparent" />
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                {trackingData.consultations.map((consult, i) => (
                  <motion.div
                    key={consult.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="group glass-card p-10 border-white/5 hover:border-primary-500/20 bg-white/[0.01] hover:bg-primary-500/[0.02] transition-all"
                  >
                    <div className="flex justify-between items-start mb-8">
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-2xl bg-primary-500/10 flex items-center justify-center border border-primary-500/20 group-hover:bg-primary-500 group-hover:text-white transition-all">
                          <FiUser className="text-2xl" />
                        </div>
                        <div>
                          <h3 className="font-bold text-xl group-hover:text-primary-400 transition-colors text-white">{consult.doctor}</h3>
                          <p className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                            <FiCalendar /> {consult.date}
                          </p>
                        </div>
                      </div>
                      <span className={`px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest ${
                        consult.status === 'Completed' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                      }`}>
                        {consult.status}
                      </span>
                    </div>

                    <div className="relative">
                      <div className="absolute -left-4 top-0 bottom-0 w-1 bg-gradient-to-b from-primary-500 to-transparent opacity-30" />
                      <p className="text-gray-400 leading-relaxed italic text-lg pl-6">
                        "{consult.response}"
                      </p>
                    </div>

                    <div className="mt-10 flex items-center justify-between pt-6 border-t border-white/5">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] text-gray-600 uppercase font-bold">Recommended:</span>
                        <span className="text-xs text-teal-400 font-bold">{consult.prescribedService}</span>
                      </div>
                      <button className="text-[10px] uppercase font-bold text-primary-400 hover:text-white transition-colors">
                        View Full Report
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}


