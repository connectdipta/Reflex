'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import dynamic from 'next/dynamic';
import { useAuth } from '@/context/AuthContext';
import { 
  FiUser, 
  FiMail, 
  FiPhone, 
  FiCalendar, 
  FiClock, 
  FiMessageSquare, 
  FiArrowLeft,
  FiArrowRight,
  FiCheckCircle,
  FiStar
} from 'react-icons/fi';
import { GiStethoscope } from 'react-icons/gi';
import psychiatristsData from '@/data/psychiatrists.json';

// Dynamic import for Lottie
const Lottie = dynamic(() => import('lottie-react'), { ssr: false });
import psychiatristAnim from '@/public/Psychiatrist.json';

export default function Booking() {
  const { user, isLoggedIn, authLoading } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [dynamicDoctors, setDynamicDoctors] = useState([]);
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    date: '',
    time: '',
    doctor: null,
    service: 'Psychiatrist Consult',
    message: ''
  });

  useEffect(() => {
    if (!authLoading && !isLoggedIn) {
      toast.error('Please login to book an appointment');
      router.push('/login');
    } else if (user) {
      setForm(prev => ({
        ...prev,
        name: user.displayName || user.name || '',
        email: user.email || ''
      }));
    }
  }, [isLoggedIn, authLoading, user, router]);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const res = await fetch('/api/doctors');
        const data = await res.json();
        if (res.ok && data.doctors && data.doctors.length > 0) {
          const formatted = data.doctors.map(d => ({
            id: d._id,
            slug: d._id,
            name: d.name?.startsWith('Dr.') ? d.name : `Dr. ${d.name}`,
            specialty: d.doctorProfile?.specialization || 'General Psychiatry',
            experience: d.doctorProfile?.experience ? `${d.doctorProfile.experience}+ Years` : 'Experienced',
            degree: d.doctorProfile?.degree || 'MBBS',
            image: d.doctorProfile?.image || d.avatar || 'https://i.ibb.co/68v8L5D/doctor-placeholder.jpg',
            social: { facebook: '#', twitter: '#', linkedin: '#', instagram: '#' },
            rating: '5.0',
            patients: '100+'
          }));
          setDynamicDoctors(formatted);
        }
      } catch (err) {}
    };
    fetchDoctors();
  }, []);

  const displayDoctors = [...psychiatristsData, ...dynamicDoctors];

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!form.name || !form.email || !form.phone || !form.date || !form.time || !form.doctor) {
      toast.error('Please fill in all required fields');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          doctor: form.doctor.name,
          userId: user?.id || user?._id
        })
      });
      
      if (res.ok) {
        toast.success('Appointment booked successfully!');
        router.push('/');
      } else {
        const data = await res.json();
        toast.error(data.message || 'Failed to book appointment');
      }
    } catch (error) {
      toast.error('Server error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (authLoading || !isLoggedIn) return null;

  return (
    <div className="min-h-screen bg-mesh py-20 px-4 relative overflow-hidden">
      {/* Dynamic Background */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary-500/10 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2 animate-pulse" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-teal-500/10 blur-[120px] rounded-full translate-y-1/2 -translate-x-1/2 animate-pulse" style={{ animationDelay: '2s' }} />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
          <Link href="/#services" className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-all group">
            <div className="w-10 h-10 rounded-full glass-card flex items-center justify-center group-hover:bg-white/10 transition-colors">
              <FiArrowLeft className="group-hover:-translate-x-1 transition-transform" /> 
            </div>
            <span className="font-medium">Back to Services</span>
          </Link>

          <div className="flex items-center gap-4">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all ${step >= 1 ? 'bg-primary-500 text-white shadow-glow' : 'bg-white/10 text-gray-500'}`}>1</div>
            <div className={`h-1 w-12 rounded-full ${step >= 2 ? 'bg-primary-500' : 'bg-white/10'}`} />
            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all ${step >= 2 ? 'bg-primary-500 text-white shadow-glow' : 'bg-white/10 text-gray-500'}`}>2</div>
          </div>
        </div>
        
        <div className="grid lg:grid-cols-12 gap-12 items-start">
          {/* Left Column: Summary & Animation */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-4 space-y-8"
          >
            <div className="glass-card p-8 bg-white/5 border-white/10 relative overflow-hidden group">
              <div className="absolute -top-10 -right-10 w-32 h-32 bg-primary-500/10 rounded-full blur-2xl group-hover:bg-primary-500/20 transition-all" />
              
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-500 to-teal-500 flex items-center justify-center shadow-glow mb-8">
                <GiStethoscope className="text-3xl text-white" />
              </div>
              
              <h1 className="text-3xl font-bold font-display mb-4">
                Let's find your <span className="text-gradient">Peace</span>
              </h1>
              <p className="text-gray-400 leading-relaxed mb-8">
                Select a specialist and choose a time that works for you. Our experts are here to help you navigate your journey.
              </p>

              {form.doctor && (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="pt-6 border-t border-white/10 space-y-4"
                >
                  <div className="flex items-center gap-4">
                    <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-primary-500/30">
                      <Image src={form.doctor.image} alt={form.doctor.name} fill className="object-cover" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wider font-bold">Selected Doctor</p>
                      <h3 className="font-bold text-white">{form.doctor.name}</h3>
                    </div>
                  </div>
                  {form.date && (
                    <div className="flex items-center gap-3 text-sm text-gray-400">
                      <FiCalendar className="text-primary-400" />
                      <span>{new Date(form.date).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                    </div>
                  )}
                  {form.time && (
                    <div className="flex items-center gap-3 text-sm text-gray-400">
                      <FiClock className="text-primary-400" />
                      <span>{form.time}</span>
                    </div>
                  )}
                </motion.div>
              )}
            </div>

            <div className="relative h-[300px] w-full flex items-center justify-center">
              <Lottie animationData={psychiatristAnim} loop={true} className="w-full h-full scale-110" />
            </div>
          </motion.div>

          {/* Right Column: Steps */}
          <div className="lg:col-span-8">
            <AnimatePresence mode="wait">
              {step === 1 ? (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.05 }}
                  className="space-y-6"
                >
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold flex items-center gap-3">
                      Choose your Specialist
                    </h2>
                    <span className="text-gray-500 text-sm">{displayDoctors.length} experts available</span>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-6">
                    {displayDoctors.map((doc) => (
                      <motion.div
                        key={doc.id}
                        whileHover={{ y: -5 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setForm({ ...form, doctor: doc })}
                        className={`group relative cursor-pointer glass-card p-6 border transition-all duration-300 ${
                          form.doctor?.id === doc.id 
                            ? 'bg-primary-500/10 border-primary-500 shadow-glow' 
                            : 'bg-white/5 border-white/10 hover:border-white/30'
                        }`}
                      >
                        <div className="flex gap-4">
                          <div className="relative w-20 h-20 rounded-2xl overflow-hidden border-2 border-white/10 group-hover:border-primary-500/50 transition-colors">
                            <Image src={doc.image} alt={doc.name} fill className="object-cover" />
                            <div className="absolute top-1 right-1 bg-primary-500 text-white p-0.5 rounded-full shadow-lg">
                              <FiCheckCircle className="text-[10px]" />
                            </div>
                          </div>
                          <div className="flex-1">
                            <div className="flex justify-between items-start">
                              <h3 className="font-bold text-lg group-hover:text-primary-400 transition-colors">{doc.name}</h3>
                              {form.doctor?.id === doc.id && (
                                <FiCheckCircle className="text-primary-500 text-xl" />
                              )}
                            </div>
                            <p className="text-sm text-primary-400 font-medium">{doc.specialty}</p>
                            <div className="mt-3 flex items-center justify-between">
                              <div className="flex items-center gap-4 text-xs text-gray-500">
                                <span className="flex items-center gap-1"><FiStar className="text-yellow-500" /> {doc.rating}</span>
                                <span>{doc.patients} Patients</span>
                              </div>
                              <Link 
                                href={`/psychiatrists/${doc.slug}`}
                                className="text-[10px] uppercase font-bold text-primary-400 hover:text-primary-300 transition-colors"
                                onClick={(e) => e.stopPropagation()}
                              >
                                View Profile
                              </Link>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  <div className="pt-8 flex justify-end">
                    <button
                      onClick={() => form.doctor ? setStep(2) : toast.error('Please select a doctor')}
                      className="gradient-btn group px-12 !py-4 flex items-center gap-3 shadow-glow hover:shadow-glow-teal"
                    >
                      Next Step <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -30 }}
                >
                  <div className="glass-card p-8 sm:p-10 border-white/10 relative overflow-hidden">
                    <button 
                      onClick={() => setStep(1)}
                      className="absolute top-10 right-10 text-gray-500 hover:text-white flex items-center gap-2 transition-colors text-sm"
                    >
                      Change Doctor
                    </button>
                    
                    <h2 className="text-2xl font-bold mb-8 flex items-center gap-3">
                      Booking Schedule
                    </h2>

                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="grid sm:grid-cols-2 gap-6">
                        <div className="relative">
                          <label className="block text-sm font-medium text-gray-400 mb-2">Preferred Date *</label>
                          <div className="relative">
                            <FiCalendar className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 z-10" />
                            <input
                              type="date"
                              required
                              value={form.date}
                              onChange={(e) => setForm({ ...form, date: e.target.value })}
                              className="input-field !pl-12 w-full appearance-none bg-transparent"
                              style={{ colorScheme: 'dark' }}
                            />
                          </div>
                        </div>

                        <div className="relative">
                          <label className="block text-sm font-medium text-gray-400 mb-2">Preferred Time *</label>
                          <div className="relative">
                            <FiClock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 z-10" />
                            <input
                              type="time"
                              required
                              value={form.time}
                              onChange={(e) => setForm({ ...form, time: e.target.value })}
                              className="input-field !pl-12 w-full appearance-none bg-transparent"
                              style={{ colorScheme: 'dark' }}
                            />
                          </div>
                        </div>

                        <div className="relative">
                          <label className="block text-sm font-medium text-gray-400 mb-2">Full Name *</label>
                          <div className="relative">
                            <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                            <input
                              type="text"
                              required
                              value={form.name}
                              onChange={(e) => setForm({ ...form, name: e.target.value })}
                              className="input-field !pl-12"
                              placeholder="Your name"
                            />
                          </div>
                        </div>
                        
                        <div className="relative">
                          <label className="block text-sm font-medium text-gray-400 mb-2">Phone Number *</label>
                          <div className="relative">
                            <FiPhone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                            <input
                              type="tel"
                              required
                              value={form.phone}
                              onChange={(e) => setForm({ ...form, phone: e.target.value })}
                              className="input-field !pl-12"
                              placeholder="+880"
                            />
                          </div>
                        </div>

                        <div className="relative sm:col-span-2">
                          <label className="block text-sm font-medium text-gray-400 mb-2">Message for Doctor (Optional)</label>
                          <div className="relative">
                            <FiMessageSquare className="absolute left-4 top-4 text-gray-500" />
                            <textarea
                              rows={4}
                              value={form.message}
                              onChange={(e) => setForm({ ...form, message: e.target.value })}
                              className="input-field !pl-12 resize-none"
                              placeholder="Describe your concerns briefly..."
                            />
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col sm:flex-row gap-4 mt-8">
                        <button
                          type="button"
                          onClick={() => setStep(1)}
                          className="glass-card px-8 !py-4 text-gray-400 hover:text-white transition-all flex items-center justify-center gap-2"
                        >
                          Back
                        </button>
                        <button
                          type="submit"
                          disabled={loading}
                          className="gradient-btn flex-1 !py-4 text-lg disabled:opacity-70 disabled:cursor-not-allowed group shadow-glow"
                        >
                          {loading ? (
                            <span className="flex items-center justify-center gap-2">
                              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                              Finalizing...
                            </span>
                          ) : (
                            <span className="flex items-center justify-center gap-2">
                              Confirm Appointment
                            </span>
                          )}
                        </button>
                      </div>
                    </form>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
