'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import DashboardLayout from '@/components/DashboardLayout';
import { FiUsers, FiActivity, FiStar, FiCheckCircle, FiAward, FiRefreshCw, FiHeart, FiSmile, FiMeh, FiFrown, FiAlertCircle, FiWind, FiCalendar, FiVideo, FiMessageCircle, FiX, FiClock, FiCheck } from 'react-icons/fi';
import doctorAnimation from '@/public/doctor.json';
import toast from 'react-hot-toast';
const Lottie = dynamic(() => import('lottie-react'), { ssr: false });

export default function DoctorDashboard() {
  const { isLoggedIn, isDoctor, user, token, loading: authLoading } = useAuth();
  const router = useRouter();
  const [patients, setPatients] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedAppt, setSelectedAppt] = useState(null);
  const [meetForm, setMeetForm] = useState({ meetLink: '', doctorResponse: '', status: 'Confirmed' });
  const [updating, setUpdating] = useState(false);

  useEffect(() => { if (!authLoading && (!isLoggedIn || !isDoctor)) router.push('/login'); }, [isLoggedIn, isDoctor, authLoading, router]);
  useEffect(() => { if (isDoctor && token) fetchPatients(); }, [isDoctor, token]);

  const fetchPatients = async () => {
    try {
      const res = await fetch('/api/users', { headers: { Authorization: `Bearer ${token}` } });
      const data = await res.json();
      if (res.ok) { setPatients((data.users || []).filter(u => u.role === 'user')); }
      
      const apptRes = await fetch('/api/appointments', { headers: { Authorization: `Bearer ${token}` } });
      const apptData = await apptRes.json();
      if (apptRes.ok && Array.isArray(apptData)) {
        const docName = (user?.name || '').toLowerCase();
        const filtered = apptData.filter(a => {
          const aDoc = (a.doctor || '').toLowerCase();
          return aDoc.includes(docName) || docName.includes(aDoc) || aDoc.includes(docName.split(' ')[0]);
        });
        setAppointments(filtered);
      }
    } catch {} finally { setLoading(false); }
  };

  const handleUpdateAppt = async (e) => {
    e.preventDefault();
    setUpdating(true);
    try {
      const res = await fetch('/api/appointments', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ id: selectedAppt._id, ...meetForm })
      });
      if (res.ok) {
        toast.success('Response sent!');
        setSelectedAppt(null);
        fetchPatients();
      }
    } catch { toast.error('Failed to update'); } finally { setUpdating(false); }
  };

  if (authLoading || loading) return <div className="min-h-screen bg-[#060a14] flex items-center justify-center"><div className="w-10 h-10 border-2 border-teal-500 border-t-transparent rounded-full animate-spin" /></div>;

  const totalSessions = patients.reduce((s, p) => s + (p.trackingData?.totalSessions || 0), 0);
  const avgStress = patients.length ? (patients.reduce((s, p) => s + (p.wellnessProfile?.stressLevel || 5), 0) / patients.length).toFixed(1) : '–';
  const avgSleep = patients.length ? (patients.reduce((s, p) => s + (p.wellnessProfile?.sleepQuality || 5), 0) / patients.length).toFixed(1) : '–';
  const moodMap = { happy: <FiSmile className="inline text-emerald-400" />, neutral: <FiMeh className="inline text-gray-400" />, sad: <FiFrown className="inline text-blue-400" />, anxious: <FiAlertCircle className="inline text-amber-400" />, stressed: <FiWind className="inline text-rose-400" /> };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: FiActivity, active: activeTab === 'overview', onClick: () => setActiveTab('overview') },
    { id: 'appointments', label: 'Appointments', icon: FiCalendar, active: activeTab === 'appointments', onClick: () => setActiveTab('appointments'), badge: appointments.filter(a => a.status === 'Pending').length },
    { id: 'patients', label: 'Patients', icon: FiUsers, active: activeTab === 'patients', onClick: () => setActiveTab('patients'), badge: patients.length },
    { id: 'profile', label: 'My Profile', icon: FiAward, active: activeTab === 'profile', onClick: () => setActiveTab('profile') },
  ];

  return (
    <DashboardLayout tabs={tabs} accentColor="teal" title={<>Dr. <span className="text-gradient">{user?.name?.split(' ')[0]}</span></>} subtitle="Doctor Panel" badge="Verified Doctor" lottieSlot={<Lottie animationData={doctorAnimation} loop />} onRefresh={fetchPatients}>
      <AnimatePresence mode="wait">
        {activeTab === 'overview' && (
          <motion.div key="ov" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
              {[{ l: 'Patients', v: patients.length, icon: FiUsers, c: 'teal' }, { l: 'Sessions', v: totalSessions, icon: FiActivity, c: 'primary' }, { l: 'Avg Stress', v: `${avgStress}/10`, icon: FiStar, c: 'amber' }, { l: 'Avg Sleep', v: `${avgSleep}/10`, icon: FiCheckCircle, c: 'emerald' }].map((s, i) => {
                const I = s.icon; return (
                  <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }} className="glass-card p-5 border-white/5">
                    <div className={`w-9 h-9 rounded-lg bg-${s.c}-500/15 flex items-center justify-center mb-3`}><I className={`text-${s.c}-400`} /></div>
                    <p className="text-2xl font-black text-white">{s.v}</p><p className="text-[10px] text-gray-500 mt-1 uppercase tracking-widest">{s.l}</p>
                  </motion.div>);
              })}
            </div>
            <div className="glass-card p-5 border-white/5">
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-sm font-bold text-white flex items-center gap-2"><FiHeart className="text-teal-400" /> Patient Wellness</h3>
                <button onClick={fetchPatients} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 text-[10px] text-gray-400 hover:bg-white/10 transition-all"><FiRefreshCw size={12} /> Refresh</button>
              </div>
              {patients.length === 0 ? <p className="text-gray-600 text-center py-10 text-sm">No active patients yet</p> : (
                <div className="space-y-2">{patients.slice(0, 8).map((p, i) => {
                  const services = p.trackingData?.servicesUsed || {};
                  const top = Object.entries(services).sort((a, b) => b[1] - a[1])[0];
                  return (
                    <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-white/[0.03] hover:bg-white/[0.06] transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-teal-500/10 flex items-center justify-center text-teal-400 font-bold text-xs overflow-hidden">{p.avatar ? <img src={p.avatar} alt="" className="w-full h-full object-cover" /> : p.name?.charAt(0)}</div>
                        <div><p className="text-sm font-medium text-white">{p.name}</p><div className="flex items-center gap-1 text-[10px] text-gray-600"><span>{p.trackingData?.totalSessions || 0} sessions ·</span> <span className="text-sm">{moodMap[p.wellnessProfile?.currentMood] || <FiMeh className="inline text-gray-400" />}</span> <span>{p.wellnessProfile?.currentMood || 'neutral'}</span></div></div>
                      </div>
                      <div className="flex gap-2">{top && top[1] > 0 && <span className="text-[9px] px-2 py-0.5 rounded-full bg-white/5 text-gray-400 font-bold capitalize">Favors: {top[0]}</span>}<span className="text-[9px] px-2 py-0.5 rounded-full bg-teal-500/10 text-teal-400 font-bold">Stress {p.wellnessProfile?.stressLevel || 5}/10</span></div>
                    </div>);
                })}</div>
              )}
            </div>
          </motion.div>
        )}

        {activeTab === 'patients' && (
          <motion.div key="pt" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            {patients.length === 0 ? <div className="glass-card p-16 text-center border-white/5"><FiUsers className="text-4xl text-gray-700 mx-auto mb-3" /><p className="text-gray-500 text-sm">No patients yet</p></div> : (
              <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">{patients.map((p, i) => {
                const services = p.trackingData?.servicesUsed || {};
                return (
                  <motion.div key={i} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }} className="glass-card p-5 border-white/5">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-11 h-11 rounded-full bg-teal-500/10 flex items-center justify-center text-teal-400 font-bold overflow-hidden">{p.avatar ? <img src={p.avatar} alt="" className="w-full h-full object-cover" /> : p.name?.charAt(0)}</div>
                      <div><h4 className="font-bold text-white text-sm">{p.name}</h4><p className="text-[10px] text-gray-600">{p.email}</p></div>
                    </div>
                    <div className="grid grid-cols-3 gap-2 mb-4">
                      <div className="bg-white/[0.03] rounded-lg p-2 text-center"><p className="text-base font-black text-primary-400">{p.trackingData?.totalSessions || 0}</p><p className="text-[8px] text-gray-600 uppercase">Sessions</p></div>
                      <div className="bg-white/[0.03] rounded-lg p-2 text-center"><p className="text-base font-black text-rose-400">{p.wellnessProfile?.stressLevel || 5}/10</p><p className="text-[8px] text-gray-600 uppercase">Stress</p></div>
                      <div className="bg-white/[0.03] rounded-lg p-2 text-center"><p className="text-base font-black text-teal-400">{p.wellnessProfile?.sleepQuality || 5}/10</p><p className="text-[8px] text-gray-600 uppercase">Sleep</p></div>
                    </div>
                    <div className="space-y-1">{Object.entries(services).filter(([, v]) => v > 0).map(([k, v]) => (
                      <div key={k} className="flex items-center gap-2"><span className="text-[9px] text-gray-600 capitalize w-14">{k}</span><div className="flex-1 h-1 rounded-full bg-white/5"><div className="h-full rounded-full bg-gradient-to-r from-teal-500 to-primary-500" style={{ width: `${Math.min((v / 15) * 100, 100)}%` }} /></div><span className="text-[9px] text-teal-400 font-bold">{v}</span></div>))}</div>
                    {(p.wellnessProfile?.concerns || []).length > 0 && <div className="flex flex-wrap gap-1 mt-3">{p.wellnessProfile.concerns.slice(0, 3).map(c => <span key={c} className="text-[8px] px-1.5 py-0.5 rounded-full bg-rose-500/10 text-rose-400 font-bold uppercase">{c.replace('_', ' ')}</span>)}</div>}
                  </motion.div>);
              })}</div>
            )}
          </motion.div>
        )}

        {activeTab === 'appointments' && (
          <motion.div key="appts" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            <div className="grid gap-4">
              {appointments.length === 0 ? <div className="glass-card p-16 text-center border-white/5"><FiCalendar className="text-4xl text-gray-700 mx-auto mb-3" /><p className="text-gray-500 text-sm">No appointment requests</p></div> : appointments.map((appt, i) => (
                <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }} className="glass-card p-5 border-white/5 hover:bg-white/[0.04] transition-all group cursor-pointer" onClick={() => { setSelectedAppt(appt); setMeetForm({ meetLink: appt.meetLink || '', doctorResponse: appt.doctorResponse || '', status: appt.status || 'Confirmed' }); }}>
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl ${appt.status === 'Confirmed' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-primary-500/10 text-primary-400'}`}><FiCalendar /></div>
                      <div>
                        <h4 className="font-bold text-white text-base">{appt.name}</h4>
                        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1 text-[10px] text-gray-500">
                          <span className="flex items-center gap-1"><FiClock className="text-teal-400" /> {appt.date} at {appt.time}</span>
                          <span className="flex items-center gap-1"><FiMessageCircle className="text-teal-400" /> {appt.service}</span>
                          <span className={`px-2 py-0.5 rounded-full font-black uppercase tracking-wider ${appt.status === 'Confirmed' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-primary-500/10 text-primary-400'}`}>{appt.status}</span>
                        </div>
                      </div>
                    </div>
                    <button className="px-4 py-2 rounded-lg bg-teal-500 text-black text-[10px] font-black hover:bg-teal-400 transition-all opacity-0 group-hover:opacity-100 uppercase tracking-widest">Respond</button>
                  </div>
                  {appt.message && <p className="mt-3 text-xs text-gray-400 italic bg-white/[0.02] p-2 rounded-lg">"{appt.message}"</p>}
                  {appt.meetLink && <div className="mt-3 flex items-center gap-2 text-[10px] text-emerald-400 font-bold bg-emerald-500/5 p-2 rounded-lg w-fit"><FiVideo /> Link Sent: {appt.meetLink.substring(0, 30)}...</div>}
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {activeTab === 'profile' && (
          <motion.div key="pr" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            <div className="glass-card p-8 border-white/5 max-w-2xl mx-auto">
              <div className="flex flex-col items-center text-center mb-8">
                <div className="w-20 h-20 rounded-full bg-teal-500/10 flex items-center justify-center overflow-hidden border-2 border-teal-500/20 mb-4">{user?.avatar ? <img src={user.avatar} alt="" className="w-full h-full object-cover" /> : <span className="text-2xl font-bold text-teal-400">{user?.name?.charAt(0)}</span>}</div>
                <h2 className="text-xl font-bold text-white">Dr. {user?.name}</h2>
                <p className="text-gray-500 text-sm">{user?.email}</p>
                <span className="mt-2 px-3 py-1 rounded-full bg-teal-500/15 text-teal-400 text-[10px] font-bold uppercase">Verified Doctor</span>
              </div>
              <div className="grid grid-cols-2 gap-3">{[['Specialization', user?.doctorProfile?.specialization || '–'], ['Degree', user?.doctorProfile?.degree || '–'], ['Experience', user?.doctorProfile?.experience ? `${user.doctorProfile.experience} yrs` : '–'], ['Fee', user?.doctorProfile?.fee ? `৳${user.doctorProfile.fee}` : '–'], ['Hospital', user?.doctorProfile?.hospital || '–'], ['Status', user?.doctorProfile?.status || '–']].map(([k, v]) => (
                <div key={k} className="bg-white/[0.03] rounded-xl p-3"><p className="text-[9px] text-gray-600 uppercase tracking-wider mb-1">{k}</p><p className="font-bold text-white text-sm capitalize">{v}</p></div>))}</div>
              {user?.doctorProfile?.bio && <div className="mt-3 bg-white/[0.03] rounded-xl p-3"><p className="text-[9px] text-gray-600 uppercase tracking-wider mb-1">Bio</p><p className="text-gray-300 text-sm leading-relaxed">{user.doctorProfile.bio}</p></div>}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Response Modal */}
      <AnimatePresence>
        {selectedAppt && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 20 }} className="glass-card w-full max-w-lg border-white/10 shadow-2xl overflow-hidden relative">
              <button onClick={() => setSelectedAppt(null)} className="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors"><FiX size={20} /></button>
              <div className="p-8">
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-12 h-12 rounded-2xl bg-teal-500/10 flex items-center justify-center text-2xl text-teal-400"><FiVideo /></div>
                  <div><h3 className="text-xl font-bold text-white">Appointment Response</h3><p className="text-sm text-gray-500">For {selectedAppt.name}</p></div>
                </div>
                <form onSubmit={handleUpdateAppt} className="space-y-6">
                  <div>
                    <label className="text-[10px] text-gray-500 uppercase tracking-widest font-black block mb-2">Google Meet Link</label>
                    <div className="relative">
                      <FiVideo className="absolute left-4 top-1/2 -translate-y-1/2 text-teal-500" />
                      <input placeholder="https://meet.google.com/..." value={meetForm.meetLink} onChange={e => setMeetForm({ ...meetForm, meetLink: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-xl py-3.5 pl-12 pr-4 text-sm text-white focus:border-teal-500/50 focus:bg-white/[0.08] transition-all outline-none" required />
                    </div>
                  </div>
                  <div>
                    <label className="text-[10px] text-gray-500 uppercase tracking-widest font-black block mb-2">Clinical Note / Message</label>
                    <textarea placeholder="Instruction for the patient..." rows={4} value={meetForm.doctorResponse} onChange={e => setMeetForm({ ...meetForm, doctorResponse: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-xl py-3.5 px-4 text-sm text-white focus:border-teal-500/50 focus:bg-white/[0.08] transition-all outline-none resize-none" />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <button type="button" onClick={() => setMeetForm({ ...meetForm, status: 'Cancelled' })} className={`py-3 rounded-xl border font-bold text-xs transition-all ${meetForm.status === 'Cancelled' ? 'bg-rose-500/10 border-rose-500 text-rose-400' : 'border-white/5 bg-white/5 text-gray-500 hover:bg-white/10'}`}>Cancel Appt</button>
                    <button type="button" onClick={() => setMeetForm({ ...meetForm, status: 'Confirmed' })} className={`py-3 rounded-xl border font-bold text-xs transition-all ${meetForm.status === 'Confirmed' ? 'bg-emerald-500/10 border-emerald-500 text-emerald-400' : 'border-white/5 bg-white/5 text-gray-500 hover:bg-white/10'}`}>Confirm Appt</button>
                  </div>
                  <button type="submit" disabled={updating} className="w-full gradient-btn !py-4 flex items-center justify-center gap-2 font-black uppercase tracking-widest text-xs shadow-glow-teal">
                    {updating ? <FiRefreshCw className="animate-spin" /> : <><FiCheck /> Send Response</>}
                  </button>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </DashboardLayout>
  );
}
