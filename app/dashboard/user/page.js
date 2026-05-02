'use client';
import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { useAuth } from '@/context/AuthContext';
import DashboardLayout from '@/components/DashboardLayout';
import { FiActivity, FiTrendingUp, FiUser, FiFileText, FiRefreshCw, FiAward, FiHeart, FiSmile, FiMeh, FiFrown, FiAlertCircle, FiWind, FiTarget, FiMoon, FiCheck, FiAlertTriangle, FiZap, FiDownload, FiCamera, FiUpload, FiCalendar, FiVideo, FiClock, FiCheckCircle, FiPieChart, FiSend } from 'react-icons/fi';
import { GiMeditation, GiYoga } from 'react-icons/gi';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, RadarChart, Radar, PolarGrid, PolarAngleAxis, BarChart, Bar } from 'recharts';

const SVC = { audio: { label: 'Audio', color: '#8b5cf6' }, yoga: { label: 'Yoga', color: '#14b8a6' }, reading: { label: 'Reading', color: '#ec4899' }, laughing: { label: 'Laughing', color: '#f59e0b' }, meditation: { label: 'Meditation', color: '#0ea5e9' } };

export default function UserDashboard() {
  const { isLoggedIn, user, token, loading: authLoading, updateUser } = useAuth();
  const router = useRouter();
  const [trackingData, setTrackingData] = useState(null);
  const [wellnessProfile, setWellnessProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [doctorForm, setDoctorForm] = useState({ specialization: '', degree: '', experience: '', fee: '', hospital: '', bio: '', availableDays: [], image: '' });
  const [applyingDoctor, setApplyingDoctor] = useState(false);
  const [uploadingImg, setUploadingImg] = useState(false);
  const [imgPreview, setImgPreview] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [loadingAppts, setLoadingAppts] = useState(true);
  const hasApplied = !!(user?.doctorProfile?.degree && user.doctorProfile.degree !== '');

  const refreshProfile = useCallback(async () => {
    if (!token) return;
    setRefreshing(true);
    try {
      const res = await fetch('/api/users', { headers: { Authorization: `Bearer ${token}` } });
      const data = await res.json();
      if (res.ok && data.user) {
        updateUser(data.user);
        if (data.user.role === 'doctor') router.push('/dashboard/doctor');
      }
    } catch {} finally { setRefreshing(false); }
  }, [token, updateUser, router]);

  const fetchTracking = useCallback(async () => {
    if (!token) return;
    try { const res = await fetch('/api/tracking', { headers: { Authorization: `Bearer ${token}` } }); const data = await res.json();
      if (res.ok) { setTrackingData(data.trackingData); setWellnessProfile(data.wellnessProfile); }
    } catch {} finally { setLoading(false); }
  }, [token]);

  useEffect(() => { if (!authLoading && !isLoggedIn) router.push('/login?redirect=/dashboard/user'); }, [isLoggedIn, authLoading, router]);
  useEffect(() => { if (isLoggedIn && token) { fetchTracking(); const iv = setInterval(fetchTracking, 30000); return () => clearInterval(iv); } }, [isLoggedIn, token, fetchTracking]);

  const fetchAppointments = useCallback(async () => {
    if (!token || !user) return;
    try {
      const res = await fetch('/api/appointments', { headers: { Authorization: `Bearer ${token}` } });
      const data = await res.json();
      if (res.ok && Array.isArray(data)) {
        const uid = user?.id || user?._id || '';
        const uemail = (user?.email || '').toLowerCase();
        const myAppts = data.filter(a => {
          const aUserId = (a.userId || '').toString();
          const aEmail = (a.email || '').toLowerCase();
          return (uid && aUserId === uid.toString()) || (uemail && aEmail === uemail);
        });
        setAppointments(myAppts);
      }
    } catch (err) { console.error(err); } finally { setLoadingAppts(false); }
  }, [token, user]);

  useEffect(() => { if (isLoggedIn) fetchAppointments(); }, [isLoggedIn, fetchAppointments]);

  if (authLoading || loading) return <div className="min-h-screen bg-[#060a14] flex items-center justify-center"><div className="w-10 h-10 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" /></div>;

  const td = trackingData || { totalSessions: 0, servicesUsed: { audio: 0, yoga: 0, reading: 0, laughing: 0, meditation: 0 }, moodHistory: [], weeklyStats: [] };
  const wp = wellnessProfile || { stressLevel: 5, sleepQuality: 5, currentMood: 'neutral', concerns: [], goals: [] };
  const moodEmoji = { happy: <FiSmile className="inline text-emerald-400" />, neutral: <FiMeh className="inline text-gray-400" />, sad: <FiFrown className="inline text-blue-400" />, anxious: <FiAlertCircle className="inline text-amber-400" />, stressed: <FiWind className="inline text-rose-400" /> };
  const wellnessScore = Math.round(((10 - wp.stressLevel) * 4 + wp.sleepQuality * 4 + Math.min(td.totalSessions, 10) * 2) / 10 * 10);

  const serviceData = Object.entries(td.servicesUsed).map(([k, v]) => ({ name: SVC[k]?.label || k, value: v || 0, color: SVC[k]?.color || '#888' })).filter(s => s.value > 0);
  const barData = Object.entries(td.servicesUsed).map(([k, v]) => ({ name: SVC[k]?.label || k, count: v || 0, fill: SVC[k]?.color || '#888' }));
  const weeklyStats = td.weeklyStats.length > 0 ? td.weeklyStats.slice(-7) : [{ week: 'Mon', mood: 60, sleep: 70 }, { week: 'Tue', mood: 65, sleep: 65 }, { week: 'Wed', mood: 55, sleep: 75 }, { week: 'Thu', mood: 70, sleep: 80 }, { week: 'Fri', mood: 75, sleep: 70 }, { week: 'Sat', mood: 80, sleep: 85 }, { week: 'Sun', mood: 85, sleep: 90 }];
  const radarData = [{ subject: 'Stress Ctrl', A: Math.round((10 - wp.stressLevel) * 10) }, { subject: 'Sleep', A: Math.round(wp.sleepQuality * 10) }, { subject: 'Activity', A: Math.min(td.totalSessions * 5, 100) }, { subject: 'Mood', A: wp.currentMood === 'happy' ? 90 : wp.currentMood === 'neutral' ? 60 : 30 }, { subject: 'Consistency', A: Math.min(td.totalSessions * 4, 100) }];

  const handleDoctorApply = async () => {
    if (!doctorForm.specialization || !doctorForm.degree) { toast.error('Specialization and Degree are required'); return; }
    setApplyingDoctor(true);
    try {
      const res = await fetch('/api/doctor-apply', { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify(doctorForm) });
      const data = await res.json();
      if (res.ok) { toast.success('Application submitted!'); refreshProfile(); setActiveTab('overview'); } else toast.error(data.message || 'Failed');
    } catch { toast.error('Server error'); } finally { setApplyingDoctor(false); }
  };

  const DAYS = ['Saturday', 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  const toggleDay = (day) => setDoctorForm(p => ({ ...p, availableDays: p.availableDays.includes(day) ? p.availableDays.filter(d => d !== day) : [...p.availableDays, day] }));

  const generateDemoData = () => {
    setDoctorForm({
      specialization: 'Psychiatry, Cognitive Behavioral Therapy',
      degree: 'MBBS, MD Psychiatry',
      experience: '8',
      fee: '1500',
      hospital: 'National Mental Health Institute',
      bio: 'I specialize in treating anxiety, depression, and mood disorders. My approach combines evidence-based psychiatric treatments with holistic lifestyle changes to help patients achieve long-term mental wellness.',
      availableDays: ['Saturday', 'Monday', 'Wednesday'],
      image: doctorForm.image || ''
    });
    toast.success('Demo data generated!');
  };

  const handleImgBBUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Set local preview immediately
    setImgPreview(URL.createObjectURL(file));
    setUploadingImg(true);
    
    try {
      const formData = new FormData();
      formData.append('image', file);
      const res = await fetch(`https://api.imgbb.com/1/upload?key=${process.env.NEXT_PUBLIC_IMGBB_API_KEY}`, { method: 'POST', body: formData });
      const data = await res.json();
      if (data.success) {
        const imageUrl = data.data.url; // Using direct URL
        setDoctorForm(prev => ({ ...prev, image: imageUrl }));
        setImgPreview(imageUrl); // Update preview with final URL
        toast.success('Image uploaded!');
      } else {
        toast.error('Upload failed');
        setImgPreview(null);
      }
    } catch { 
      toast.error('Upload error');
      setImgPreview(null);
    } finally { 
      setUploadingImg(false); 
    }
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: FiActivity, active: activeTab === 'overview', onClick: () => setActiveTab('overview') },
    { id: 'appointments', label: 'My Bookings', icon: FiCalendar, active: activeTab === 'appointments', onClick: () => setActiveTab('appointments') },
    { id: 'analytics', label: 'Analytics', icon: FiTrendingUp, active: activeTab === 'analytics', onClick: () => setActiveTab('analytics') },
    { id: 'apply', label: 'Apply as Doctor', icon: FiFileText, active: activeTab === 'apply', onClick: () => setActiveTab('apply') },
    { id: 'profile', label: 'My Profile', icon: FiUser, active: activeTab === 'profile', onClick: () => setActiveTab('profile') },
  ];

  const handleRefresh = async () => { await fetchTracking(); await refreshProfile(); await fetchAppointments(); };

  return (
    <DashboardLayout tabs={tabs} accentColor="primary" title={<>Hello, <span className="text-gradient">{user?.name?.split(' ')[0]}</span> {moodEmoji[wp.currentMood] || ''}</>} subtitle="Wellness Dashboard" badge="Member" onRefresh={handleRefresh}>
      <AnimatePresence mode="wait">
        {activeTab === 'appointments' && (
          <motion.div key="appt" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            {appointments.length === 0 ? (
              <div className="glass-card p-16 text-center border-white/5 bg-white/[0.02]">
                <FiCalendar className="text-4xl text-gray-700 mx-auto mb-3" />
                <p className="text-gray-500 text-sm">No appointments booked yet.</p>
                <Link href="/booking" className="inline-block mt-4 text-xs font-bold text-primary-400 hover:text-primary-300">Book Now</Link>
              </div>
            ) : (
              <div className="grid gap-4">
                {appointments.map((appt, i) => (
                  <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }} className="glass-card p-6 border-white/5 relative overflow-hidden group">
                    <div className={`absolute top-0 right-0 w-24 h-24 blur-[60px] opacity-20 transition-all group-hover:opacity-40 ${appt.status === 'Confirmed' ? 'bg-emerald-500' : 'bg-primary-500'}`} />
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
                      <div className="flex items-center gap-5">
                        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-xl ${appt.status === 'Confirmed' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-primary-500/10 text-primary-400'}`}>
                          <FiCalendar />
                        </div>
                        <div>
                          <h4 className="text-lg font-bold text-white">{appt.doctor}</h4>
                          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1">
                            <span className="flex items-center gap-1.5 text-xs text-gray-400"><FiCalendar className="text-primary-400" /> {new Date(appt.date).toLocaleDateString()}</span>
                            <span className="flex items-center gap-1.5 text-xs text-gray-400"><FiClock className="text-primary-400" /> {appt.time}</span>
                            <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider ${appt.status === 'Confirmed' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-primary-500/10 text-primary-400'}`}>{appt.status}</span>
                          </div>
                        </div>
                      </div>

                      {appt.meetLink && (
                        <a href={appt.meetLink} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-500 text-black text-sm font-black hover:bg-emerald-400 transition-all shadow-lg shadow-emerald-500/20 active:scale-95">
                          <FiVideo className="text-lg" /> Join Google Meet
                        </a>
                      )}
                    </div>

                    {appt.doctorResponse && (
                      <div className="mt-6 p-4 rounded-xl bg-white/[0.03] border border-white/5">
                        <p className="text-[10px] text-primary-400 font-black uppercase tracking-widest mb-2">Doctor's Note</p>
                        <p className="text-sm text-gray-300 italic leading-relaxed">"{appt.doctorResponse}"</p>
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        )}

        {activeTab === 'overview' && (
          <motion.div key="ov" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            {/* Score + Stats */}
            <div className="grid sm:grid-cols-2 xl:grid-cols-5 gap-4 mb-6">
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="glass-card p-5 border-white/5 flex flex-col items-center text-center bg-gradient-to-br from-primary-500/10 to-teal-500/5">
                <FiAward className="text-2xl text-primary-400 mb-2" /><p className="text-4xl font-black text-white">{wellnessScore}</p><p className="text-[9px] text-gray-500 uppercase tracking-widest mt-1">Wellness Score</p>
                <div className="w-full bg-white/10 rounded-full h-1 mt-3"><div className="h-full rounded-full bg-gradient-to-r from-primary-500 to-teal-500 transition-all duration-1000" style={{ width: `${wellnessScore}%` }} /></div>
              </motion.div>
              {[{ l: 'Sessions', v: td.totalSessions, icon: FiActivity, c: 'primary' }, { l: 'Stress', v: `${wp.stressLevel}/10`, icon: FiHeart, c: 'rose', n: wp.stressLevel <= 4 ? <span className="flex items-center gap-1"><FiCheck /> Good</span> : wp.stressLevel <= 7 ? <span className="flex items-center gap-1"><FiAlertTriangle /> Mid</span> : <span className="flex items-center gap-1"><FiZap /> High</span> }, { l: 'Sleep', v: `${wp.sleepQuality}/10`, icon: FiMoon, c: 'teal', n: wp.sleepQuality >= 7 ? <span className="flex items-center gap-1"><FiCheck /> Good</span> : <span className="flex items-center gap-1"><FiAlertTriangle /> Low</span> }, { l: 'Goals', v: wp.goals?.length || 0, icon: FiTarget, c: 'amber' }].map((s, i) => {
                const I = s.icon; return (
                  <motion.div key={i} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: (i + 1) * 0.06 }} className="glass-card p-5 border-white/5">
                    <I className={`text-lg text-${s.c}-400 mb-2`} /><p className="text-2xl font-black text-white">{s.v}</p><p className="text-[9px] text-gray-500 uppercase tracking-widest mt-1">{s.l}</p>
                    {s.n && <div className="text-[9px] text-primary-400 font-bold mt-1">{s.n}</div>}
                  </motion.div>);
              })}
            </div>

            {/* Chart + Services */}
            <div className="grid lg:grid-cols-12 gap-5 mb-5">
              <div className="lg:col-span-8 glass-card p-5 border-white/5">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2"><FiTrendingUp className="text-primary-400" /> Weekly Progress</h3>
                  {td.weeklyStats.length === 0 && <span className="text-[9px] text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full font-bold">Sample data</span>}
                </div>
                <div className="h-[200px]">
                  <ResponsiveContainer width="100%" height="100%" id="chart-mood">
                    <AreaChart data={weeklyStats}>
                      <defs><linearGradient id="mG" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.3} /><stop offset="95%" stopColor="#0ea5e9" stopOpacity={0} /></linearGradient><linearGradient id="sG" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#14b8a6" stopOpacity={0.2} /><stop offset="95%" stopColor="#14b8a6" stopOpacity={0} /></linearGradient></defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                      <XAxis dataKey="week" stroke="#ffffff15" fontSize={10} tickLine={false} axisLine={false} />
                      <YAxis stroke="#ffffff15" fontSize={10} tickLine={false} axisLine={false} domain={[0, 100]} />
                      <Tooltip contentStyle={{ backgroundColor: '#0d1528', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '10px', fontSize: '11px' }} />
                      <Area type="monotone" dataKey="mood" name="Mood" stroke="#0ea5e9" fill="url(#mG)" strokeWidth={2} />
                      <Area type="monotone" dataKey="sleep" name="Sleep" stroke="#14b8a6" fill="url(#sG)" strokeWidth={1.5} strokeDasharray="4 4" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
              <div className="lg:col-span-4 glass-card p-5 border-white/5">
                <h3 className="text-sm font-bold text-white text-center mb-3">Balance</h3>
                <div className="h-[190px]">
                  <ResponsiveContainer width="100%" height="100%" id="chart-radar">
                    <RadarChart cx="50%" cy="50%" outerRadius="68%" data={radarData}>
                      <PolarGrid stroke="#ffffff08" /><PolarAngleAxis dataKey="subject" stroke="#ffffff30" fontSize={8} />
                      <Radar dataKey="A" stroke="#0ea5e9" fill="#0ea5e9" fillOpacity={0.2} />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* Service Usage + Quick Access */}
            <div className="grid lg:grid-cols-12 gap-5">
              <div className="lg:col-span-5 glass-card p-5 border-white/5">
                <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2"><FiPieChart className="text-primary-400" /> Services</h3>
                {serviceData.length === 0 ? <div className="text-center py-8"><p className="text-gray-600 text-xs">No services used yet</p><Link href="/#services" className="text-primary-400 text-xs font-bold hover:underline mt-2 block">Explore →</Link></div> : (
                  <div className="flex flex-col items-center gap-4">
                    <div className="h-[140px] w-full"><ResponsiveContainer width="100%" height="100%" id="chart-pie"><PieChart><Pie data={serviceData} cx="50%" cy="50%" innerRadius={40} outerRadius={65} paddingAngle={4} dataKey="value">{serviceData.map((e, i) => <Cell key={i} fill={e.color} />)}</Pie><Tooltip contentStyle={{ backgroundColor: '#0d1528', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', fontSize: '11px' }} /></PieChart></ResponsiveContainer></div>
                    <div className="w-full space-y-1.5">{serviceData.map((s, i) => <div key={i} className="flex items-center gap-2"><div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: s.color }} /><span className="text-[10px] text-gray-400 flex-1">{s.name}</span><span className="text-[10px] font-bold text-white">{s.value}x</span></div>)}</div>
                  </div>
                )}
              </div>
              <div className="lg:col-span-7 glass-card p-5 border-white/5">
                <h3 className="text-sm font-bold text-white mb-4">Service Breakdown</h3>
                <div className="h-[180px]">
                  <ResponsiveContainer width="100%" height="100%" id="chart-bar">
                    <BarChart data={barData} layout="vertical" margin={{ left: 10 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" horizontal={false} />
                      <XAxis type="number" stroke="#ffffff15" fontSize={10} tickLine={false} axisLine={false} />
                      <YAxis type="category" dataKey="name" stroke="#ffffff30" fontSize={10} tickLine={false} axisLine={false} width={65} />
                      <Tooltip contentStyle={{ backgroundColor: '#0d1528', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', fontSize: '11px' }} />
                      <Bar dataKey="count" radius={[0, 6, 6, 0]} barSize={16}>{barData.map((e, i) => <Cell key={i} fill={e.fill} fillOpacity={0.7} />)}</Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-4 pt-4 border-t border-white/5">
                  <p className="text-[9px] text-gray-600 uppercase tracking-wider mb-2">Quick Access</p>
                  <div className="flex flex-wrap gap-2">{[{ l: 'Audio', h: '/services/audio', c: 'violet' }, { l: 'Yoga', h: '/services/yoga', c: 'teal' }, { l: 'Reading', h: '/services/reading', c: 'pink' }, { l: 'Laughing', h: '/services/laughing', c: 'amber' }].map(s => <Link key={s.l} href={s.h} className={`px-3 py-1 rounded-full text-[10px] font-bold bg-${s.c}-500/10 text-${s.c}-400 hover:bg-${s.c}-500/20 transition-all`}>{s.l}</Link>)}</div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'analytics' && (
          <motion.div key="an" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            <div className="grid lg:grid-cols-2 gap-5 mb-5">
              <div className="glass-card p-5 border-white/5">
                <h3 className="text-sm font-bold text-white mb-4">Mood History</h3>
                {td.moodHistory.length === 0 ? <p className="text-gray-600 text-center py-10 text-xs">No mood data yet. Use services to track!</p> : (
                  <div className="h-[200px]"><ResponsiveContainer width="100%" height="100%" id="chart-mood-history"><AreaChart data={td.moodHistory.slice(-14).map((m, i) => ({ idx: i + 1, mood: m.mood }))}>
                    <defs><linearGradient id="mhG" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#ec4899" stopOpacity={0.3} /><stop offset="95%" stopColor="#ec4899" stopOpacity={0} /></linearGradient></defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} /><XAxis dataKey="idx" stroke="#ffffff15" fontSize={9} tickLine={false} axisLine={false} /><YAxis stroke="#ffffff15" fontSize={9} tickLine={false} axisLine={false} domain={[0, 100]} />
                    <Tooltip contentStyle={{ backgroundColor: '#0d1528', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', fontSize: '11px' }} />
                    <Area type="monotone" dataKey="mood" stroke="#ec4899" fill="url(#mhG)" strokeWidth={2} />
                  </AreaChart></ResponsiveContainer></div>
                )}
              </div>
              <div className="glass-card p-5 border-white/5">
                <h3 className="text-sm font-bold text-white mb-4">Wellness Metrics</h3>
                <div className="space-y-4">
                  {[{ l: 'Stress Control', v: (10 - wp.stressLevel) * 10, c: 'from-rose-500 to-pink-500' }, { l: 'Sleep Quality', v: wp.sleepQuality * 10, c: 'from-teal-500 to-emerald-500' }, { l: 'Activity Level', v: Math.min(td.totalSessions * 5, 100), c: 'from-primary-500 to-sky-500' }, { l: 'Goal Progress', v: (wp.goals?.length || 0) > 0 ? Math.min(td.totalSessions * 10, 100) : 0, c: 'from-amber-500 to-orange-500' }].map((m, i) => (
                    <div key={i}><div className="flex justify-between mb-1"><span className="text-[10px] text-gray-400 font-medium">{m.l}</span><span className="text-[10px] text-white font-bold">{m.v}%</span></div>
                    <div className="h-2 rounded-full bg-white/5"><div className={`h-full rounded-full bg-gradient-to-r ${m.c} transition-all duration-1000`} style={{ width: `${m.v}%` }} /></div></div>
                  ))}
                </div>
              </div>
            </div>
            <div className="glass-card p-5 border-white/5">
              <h3 className="text-sm font-bold text-white mb-4">Session Timeline</h3>
              <div className="flex items-center gap-4 text-center">
                <div className="flex-1 bg-white/[0.03] rounded-xl p-4"><p className="text-2xl font-black text-primary-400">{td.totalSessions}</p><p className="text-[9px] text-gray-600 uppercase">Total Sessions</p></div>
                <div className="flex-1 bg-white/[0.03] rounded-xl p-4"><p className="text-2xl font-black text-teal-400">{td.moodHistory.length}</p><p className="text-[9px] text-gray-600 uppercase">Mood Entries</p></div>
                <div className="flex-1 bg-white/[0.03] rounded-xl p-4"><p className="text-2xl font-black text-amber-400">{td.weeklyStats.length}</p><p className="text-[9px] text-gray-600 uppercase">Weekly Logs</p></div>
                <div className="flex-1 bg-white/[0.03] rounded-xl p-4"><p className="text-sm font-black text-white">{td.lastActive ? new Date(td.lastActive).toLocaleDateString() : '–'}</p><p className="text-[9px] text-gray-600 uppercase">Last Active</p></div>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'apply' && (
          <motion.div key="ap" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            <div className="glass-card p-6 border-white/5 max-w-2xl mx-auto">
              <div className="text-center mb-6 relative">
                <button onClick={generateDemoData} className="absolute right-0 top-0 text-[10px] bg-teal-500/10 text-teal-400 px-3 py-1.5 rounded-lg font-bold hover:bg-teal-500/20 transition-colors">Generate Demo</button>
                <div className="w-14 h-14 rounded-2xl bg-teal-500/10 flex items-center justify-center mx-auto mb-3"><FiFileText className="text-2xl text-teal-400" /></div>
                <h2 className="text-xl font-bold text-white">Apply as a Doctor</h2>
                <p className="text-gray-500 text-sm mt-1">Join our professional team and help users on their wellness journey</p>
              </div>

              {hasApplied ? (
                <div className="text-center py-8">
                  <div className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold ${
                    user.doctorProfile.status === 'pending' ? 'bg-amber-500/15 text-amber-400' :
                    user.doctorProfile.status === 'approved' ? 'bg-emerald-500/15 text-emerald-400' :
                    'bg-red-500/15 text-red-400'
                  }`}>
                    {user.doctorProfile.status === 'pending' && <><FiClock className="inline text-lg" /> Application Pending Review</>}
                    {user.doctorProfile.status === 'approved' && <><FiCheckCircle className="inline text-lg" /> Application Approved!</>}
                    {user.doctorProfile.status === 'rejected' && <><FiXCircle className="inline text-lg" /> Application Rejected</>}
                  </div>
                  {user.doctorProfile.status === 'approved' && (
                    <p className="text-gray-500 text-xs mt-3">Your role will be updated by an admin shortly.</p>
                  )}
                  <button onClick={refreshProfile} disabled={refreshing} className="mt-6 flex items-center gap-2 mx-auto px-4 py-2 rounded-xl bg-white/5 text-gray-400 text-[10px] font-bold hover:bg-white/10 transition-all">
                    <FiRefreshCw className={refreshing ? 'animate-spin' : ''} /> {refreshing ? 'Refreshing...' : 'Refresh Status'}
                  </button>
                </div>
              ) : (
                <>
                  <div className="mb-4">
                    <label className="text-[9px] text-gray-500 uppercase tracking-wider mb-2 block">Profile Picture (Optional)</label>
                    <div className="flex flex-col sm:flex-row items-center gap-4">
                      <div className="w-20 h-20 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center overflow-hidden shrink-0">
                        {imgPreview ? <img src={imgPreview} alt="Profile" className="w-full h-full object-cover" /> : <FiUser className="text-2xl text-gray-600" />}
                      </div>
                      <div className="flex-1 w-full">
                        <label className="flex items-center justify-center gap-2 w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-xs text-gray-400 cursor-pointer hover:bg-white/10 transition-all">
                          {uploadingImg ? <><FiRefreshCw className="animate-spin" /> Uploading...</> : <><FiUpload /> Choose Image (ImgBB)</>}
                          <input type="file" accept="image/*" onChange={handleImgBBUpload} className="hidden" disabled={uploadingImg} />
                        </label>
                      </div>
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-3 mb-4">
                    <div>
                      <label className="text-[9px] text-gray-500 uppercase tracking-wider mb-1 block">Specialization *</label>
                      <input placeholder="e.g. Psychiatry, Clinical Psychology" value={doctorForm.specialization} onChange={e => setDoctorForm({ ...doctorForm, specialization: e.target.value })} className="input-field w-full" />
                    </div>
                    <div>
                      <label className="text-[9px] text-gray-500 uppercase tracking-wider mb-1 block">Degree *</label>
                      <input placeholder="e.g. MBBS, MD Psychiatry" value={doctorForm.degree} onChange={e => setDoctorForm({ ...doctorForm, degree: e.target.value })} className="input-field w-full" />
                    </div>
                    <div>
                      <label className="text-[9px] text-gray-500 uppercase tracking-wider mb-1 block">Experience (years)</label>
                      <input type="number" placeholder="e.g. 5" value={doctorForm.experience} onChange={e => setDoctorForm({ ...doctorForm, experience: e.target.value })} className="input-field w-full" />
                    </div>
                    <div>
                      <label className="text-[9px] text-gray-500 uppercase tracking-wider mb-1 block">Consultation Fee (৳)</label>
                      <input type="number" placeholder="e.g. 500" value={doctorForm.fee} onChange={e => setDoctorForm({ ...doctorForm, fee: e.target.value })} className="input-field w-full" />
                    </div>
                    <div className="col-span-2">
                      <label className="text-[9px] text-gray-500 uppercase tracking-wider mb-1 block">Hospital / Clinic</label>
                      <input placeholder="e.g. National Mental Health Institute" value={doctorForm.hospital} onChange={e => setDoctorForm({ ...doctorForm, hospital: e.target.value })} className="input-field w-full" />
                    </div>
                  </div>

                  <div className="mb-4">
                    <label className="text-[9px] text-gray-500 uppercase tracking-wider mb-2 block">Available Days</label>
                    <div className="flex flex-wrap gap-2">
                      {DAYS.map(day => (
                        <button key={day} onClick={() => toggleDay(day)} className={`px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all border ${doctorForm.availableDays.includes(day) ? 'bg-teal-500/15 border-teal-500/30 text-teal-400' : 'bg-white/5 border-white/10 text-gray-500 hover:bg-white/10'}`}>{day.slice(0, 3)}</button>
                      ))}
                    </div>
                  </div>

                  <div className="mb-4">
                    <label className="text-[9px] text-gray-500 uppercase tracking-wider mb-1 block">Bio</label>
                    <textarea placeholder="Tell us about your experience and approach to mental wellness..." value={doctorForm.bio} onChange={e => setDoctorForm({ ...doctorForm, bio: e.target.value })} className="input-field w-full resize-none" rows={3} />
                  </div>

                  <button onClick={handleDoctorApply} disabled={applyingDoctor} className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-teal-500/20 to-primary-500/20 text-teal-400 text-sm font-bold hover:from-teal-500/30 hover:to-primary-500/30 transition-all disabled:opacity-50 border border-teal-500/20">
                    <FiSend /> {applyingDoctor ? 'Submitting...' : 'Submit Application'}
                  </button>
                </>
              )}
            </div>
          </motion.div>
        )}

        {activeTab === 'profile' && (
          <motion.div key="pr" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            <div className="glass-card p-6 border-white/5 max-w-2xl mx-auto">
              <div className="flex flex-col items-center text-center mb-6">
                <div className="w-20 h-20 rounded-full bg-primary-500/10 flex items-center justify-center overflow-hidden border-2 border-primary-500/20 mb-3">{user?.avatar ? <img src={user.avatar} alt="" className="w-full h-full object-cover" /> : <span className="text-2xl font-bold text-primary-400">{user?.name?.charAt(0)}</span>}</div>
                <h2 className="text-xl font-bold text-white">{user?.name}</h2><p className="text-gray-500 text-sm">{user?.email}</p>
              </div>
              <div className="grid sm:grid-cols-2 gap-3 mb-4">
                <div className="bg-white/[0.03] rounded-xl p-4"><p className="text-[9px] text-gray-600 uppercase tracking-wider mb-1">Mood</p><div className="text-2xl mb-1">{moodEmoji[wp.currentMood] || <FiMeh className="inline text-gray-400" />}</div><p className="text-sm font-bold text-white capitalize">{wp.currentMood}</p></div>
                <div className="bg-white/[0.03] rounded-xl p-4"><p className="text-[9px] text-gray-600 uppercase tracking-wider mb-1">Exercise</p><p className="text-sm font-bold text-white capitalize">{wp.exerciseFrequency || 'Not set'}</p><p className="text-[10px] text-gray-600 mt-1">Meditation: {wp.meditationExperience ? 'Experienced' : 'Beginner'}</p></div>
              </div>
              <div className="grid sm:grid-cols-2 gap-3">
                <div className="bg-white/[0.03] rounded-xl p-4"><p className="text-[9px] text-gray-600 uppercase tracking-wider mb-2">Concerns</p><div className="flex flex-wrap gap-1">{(wp.concerns || []).length === 0 ? <span className="text-[10px] text-gray-700">None</span> : wp.concerns.map(c => <span key={c} className="text-[9px] px-1.5 py-0.5 rounded-full bg-rose-500/10 text-rose-400 font-bold uppercase">{c.replace('_', ' ')}</span>)}</div></div>
                <div className="bg-white/[0.03] rounded-xl p-4"><p className="text-[9px] text-gray-600 uppercase tracking-wider mb-2">Goals</p><div className="flex flex-wrap gap-1">{(wp.goals || []).length === 0 ? <span className="text-[10px] text-gray-700">None</span> : wp.goals.map(g => <span key={g} className="text-[9px] px-1.5 py-0.5 rounded-full bg-teal-500/10 text-teal-400 font-bold uppercase">{g.replace('_', ' ')}</span>)}</div></div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </DashboardLayout>
  );
}
