'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { useAuth } from '@/context/AuthContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { FiUser, FiAward, FiBriefcase, FiFileText, FiDollarSign, FiCalendar, FiSend, FiShield } from 'react-icons/fi';

const days = ['Saturday', 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

export default function ApplyDoctor() {
  const { isLoggedIn, token, user } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    specialization: '',
    degree: '',
    experience: '',
    hospital: '',
    bio: '',
    fee: '',
    availableDays: [],
  });

  const toggleDay = (day) => {
    setForm(prev => ({
      ...prev,
      availableDays: prev.availableDays.includes(day)
        ? prev.availableDays.filter(d => d !== day)
        : [...prev.availableDays, day],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isLoggedIn) {
      toast.error('Please login first');
      router.push('/login?redirect=/apply-doctor');
      return;
    }
    if (!form.specialization || !form.degree || !form.bio) {
      toast.error('Please fill in required fields');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/doctor-apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          ...form,
          experience: parseInt(form.experience) || 0,
          fee: parseInt(form.fee) || 0,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success(data.message);
        router.push('/');
      } else {
        toast.error(data.message);
      }
    } catch {
      toast.error('Server error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-dark-900 bg-mesh pt-32 pb-20 px-4 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary-500/5 blur-[150px] rounded-full" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-teal-500/5 blur-[150px] rounded-full" />

        <div className="max-w-3xl mx-auto relative z-10">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-500/10 border border-primary-500/20 text-primary-400 text-sm font-medium mb-6">
              <FiShield /> Professional Application
            </div>
            <h1 className="text-4xl md:text-5xl font-bold font-display mb-4">
              Apply as a <span className="text-gradient">Doctor</span>
            </h1>
            <p className="text-gray-400 text-lg max-w-xl mx-auto">
              Join our network of certified psychiatrists and help others on their mental wellness journey.
            </p>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <form onSubmit={handleSubmit} className="glass-card p-8 md:p-10 space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="text-sm font-bold text-gray-300 mb-2 block flex items-center gap-2"><FiAward className="text-primary-400" /> Specialization *</label>
                  <input type="text" placeholder="e.g. Clinical Psychology" value={form.specialization}
                    onChange={(e) => setForm({ ...form, specialization: e.target.value })} className="input-field" />
                </div>
                <div>
                  <label className="text-sm font-bold text-gray-300 mb-2 block flex items-center gap-2"><FiFileText className="text-primary-400" /> Degree *</label>
                  <input type="text" placeholder="e.g. MD, PhD" value={form.degree}
                    onChange={(e) => setForm({ ...form, degree: e.target.value })} className="input-field" />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="text-sm font-bold text-gray-300 mb-2 block flex items-center gap-2"><FiBriefcase className="text-primary-400" /> Experience (years)</label>
                  <input type="number" placeholder="0" value={form.experience}
                    onChange={(e) => setForm({ ...form, experience: e.target.value })} className="input-field" />
                </div>
                <div>
                  <label className="text-sm font-bold text-gray-300 mb-2 block flex items-center gap-2"><FiDollarSign className="text-primary-400" /> Consultation Fee (BDT)</label>
                  <input type="number" placeholder="500" value={form.fee}
                    onChange={(e) => setForm({ ...form, fee: e.target.value })} className="input-field" />
                </div>
              </div>

              <div>
                <label className="text-sm font-bold text-gray-300 mb-2 block flex items-center gap-2"><FiUser className="text-primary-400" /> Hospital / Clinic</label>
                <input type="text" placeholder="e.g. Dhaka Medical College" value={form.hospital}
                  onChange={(e) => setForm({ ...form, hospital: e.target.value })} className="input-field" />
              </div>

              <div>
                <label className="text-sm font-bold text-gray-300 mb-2 block flex items-center gap-2"><FiFileText className="text-primary-400" /> Professional Bio *</label>
                <textarea placeholder="Tell us about your expertise and approach to mental wellness..."
                  value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })}
                  className="input-field !h-32 resize-none" />
              </div>

              <div>
                <label className="text-sm font-bold text-gray-300 mb-3 block flex items-center gap-2"><FiCalendar className="text-primary-400" /> Available Days</label>
                <div className="flex flex-wrap gap-2">
                  {days.map(day => (
                    <button key={day} type="button" onClick={() => toggleDay(day)}
                      className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider border transition-all ${
                        form.availableDays.includes(day)
                          ? 'bg-primary-500/20 border-primary-500/50 text-primary-400'
                          : 'bg-white/5 border-white/10 text-gray-400 hover:border-white/20'
                      }`}>
                      {day}
                    </button>
                  ))}
                </div>
              </div>

              <button type="submit" disabled={loading}
                className="gradient-btn w-full !py-4 flex justify-center disabled:opacity-70 text-lg font-bold">
                {loading ? (
                  <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <span className="flex items-center gap-2"><FiSend /> Submit Application</span>
                )}
              </button>
            </form>
          </motion.div>
        </div>
      </main>
      <Footer />
    </>
  );
}
