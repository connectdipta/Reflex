'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { useAuth } from '@/context/AuthContext';
import { FiSend, FiUser, FiMail, FiMessageSquare, FiAlertTriangle, FiCheckCircle, FiInfo, FiUpload, FiLoader, FiX, FiShield, FiEdit3, FiList, FiGlobe } from 'react-icons/fi';

export default function Contact() {
  const { user, isLoggedIn } = useAuth();
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '', screenshot: '' });
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (isLoggedIn && user) {
      setForm(prev => ({ ...prev, name: user.name || '', email: user.email || '' }));
    }
  }, [isLoggedIn, user]);

  const handleScreenshotUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('image', file);
      // Using the same ImgBB key as used in the dashboard
      const res = await fetch(`https://api.imgbb.com/1/upload?key=${process.env.NEXT_PUBLIC_IMGBB_API_KEY}`, {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (data.success) {
        setForm(prev => ({ ...prev, screenshot: data.data.display_url }));
        toast.success('Screenshot attached!');
      } else {
        toast.error('Upload failed');
      }
    } catch {
      toast.error('Error uploading image');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.subject || !form.message) {
      toast.error('Please fill in all required fields');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/issues', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        setSuccess(true);
        setTimeout(() => {
          setSuccess(false);
          setForm(prev => ({ ...prev, subject: '', message: '', screenshot: '' }));
        }, 5000);
      } else {
        const data = await res.json();
        toast.error(data.message || 'Something went wrong');
      }
    } catch {
      toast.error('Failed to report issue');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contact" className="section-padding relative overflow-hidden bg-mesh">
      {/* Decorative Background Elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-[#060a14]/50" />
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.2, 0.1] }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute -top-[10%] -left-[10%] w-[50%] h-[50%] bg-rose-500/20 blur-[120px] rounded-full"
        />
        <motion.div
          animate={{ scale: [1, 1.1, 1], opacity: [0.1, 0.15, 0.1] }}
          transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
          className="absolute -bottom-[10%] -right-[10%] w-[50%] h-[50%] bg-primary-500/20 blur-[120px] rounded-full"
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <motion.div 
            initial={{ scale: 0.9 }}
            whileInView={{ scale: 1 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-rose-500/10 text-rose-400 text-[10px] font-black uppercase tracking-[0.2em] mb-4 border border-rose-500/20 shadow-lg shadow-rose-500/5"
          >
            <FiShield className="text-sm" /> Technical Support
          </motion.div>
          <h2 className="text-4xl md:text-5xl font-black font-display text-white mb-6">
            Help Us <span className="text-gradient">Improve</span>
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto leading-relaxed">
            Spotted something unusual? Report bugs or technical glitches directly to our development team.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-12 gap-8">
          {/* Form Side */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-7"
          >
            <div className="glass-card relative overflow-hidden p-1 bg-gradient-to-br from-white/10 to-transparent">
              <div className="bg-[#0a0f1c]/90 backdrop-blur-2xl rounded-[1.4rem] p-8">
                <AnimatePresence mode="wait">
                  {!success ? (
                    <motion.form
                      key="form"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      onSubmit={handleSubmit}
                      className="space-y-6"
                    >
                      <div className="grid sm:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1">Full Name</label>
                          <div className="relative group">
                            <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-rose-400 transition-colors" />
                            <input
                              type="text"
                              placeholder="Your Name"
                              value={form.name}
                              onChange={(e) => setForm({ ...form, name: e.target.value })}
                              className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-gray-600 focus:outline-none focus:border-rose-500/50 focus:bg-rose-500/[0.02] transition-all"
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1">Email Address</label>
                          <div className="relative group">
                            <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-rose-400 transition-colors" />
                            <input
                              type="email"
                              placeholder="hello@example.com"
                              value={form.email}
                              onChange={(e) => setForm({ ...form, email: e.target.value })}
                              className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-gray-600 focus:outline-none focus:border-rose-500/50 focus:bg-rose-500/[0.02] transition-all"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1">Subject</label>
                        <div className="relative group">
                          <FiInfo className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-rose-400 transition-colors" />
                          <input
                            type="text"
                            placeholder="What seems to be the problem?"
                            value={form.subject}
                            onChange={(e) => setForm({ ...form, subject: e.target.value })}
                            className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-gray-600 focus:outline-none focus:border-rose-500/50 focus:bg-rose-500/[0.02] transition-all"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1">Issue Details</label>
                        <div className="relative group">
                          <FiMessageSquare className="absolute left-4 top-4 text-gray-500 group-focus-within:text-rose-400 transition-colors" />
                          <textarea
                            placeholder="Describe the steps to reproduce the bug..."
                            rows={4}
                            value={form.message}
                            onChange={(e) => setForm({ ...form, message: e.target.value })}
                            className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-gray-600 focus:outline-none focus:border-rose-500/50 focus:bg-rose-500/[0.02] transition-all resize-none"
                          />
                        </div>
                      </div>

                      {/* Screenshot Attachment */}
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1">Visual Proof (Optional)</label>
                        <div className="flex flex-wrap gap-4 items-center">
                          {form.screenshot ? (
                            <div className="relative group/thumb">
                              <img src={form.screenshot} alt="Attached" className="w-20 h-20 object-cover rounded-xl border border-white/20" />
                              <button 
                                onClick={() => setForm(p => ({ ...p, screenshot: '' }))}
                                className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-rose-500 text-white flex items-center justify-center shadow-lg opacity-0 group-hover/thumb:opacity-100 transition-opacity"
                              >
                                <FiX size={12} />
                              </button>
                            </div>
                          ) : (
                            <label className="flex flex-col items-center justify-center w-20 h-20 rounded-xl bg-white/5 border border-dashed border-white/20 hover:border-rose-500/50 hover:bg-rose-500/5 transition-all cursor-pointer">
                              {uploading ? <FiLoader className="text-rose-400 animate-spin" /> : <FiUpload className="text-gray-500" />}
                              <span className="text-[8px] text-gray-500 mt-1 font-bold">Attach</span>
                              <input type="file" accept="image/*" onChange={handleScreenshotUpload} className="hidden" disabled={uploading} />
                            </label>
                          )}
                          <p className="text-[10px] text-gray-600 italic">Adding a screenshot helps us fix it faster.</p>
                        </div>
                      </div>

                      <motion.button
                        type="submit"
                        disabled={loading}
                        whileHover={{ scale: 1.02, y: -2 }}
                        whileTap={{ scale: 0.98 }}
                        className="w-full py-4 rounded-2xl bg-gradient-to-r from-rose-500 to-rose-600 text-white font-black text-sm uppercase tracking-widest shadow-xl shadow-rose-500/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-3 overflow-hidden group"
                      >
                        {loading ? (
                          <FiLoader className="animate-spin text-xl" />
                        ) : (
                          <>
                            <span className="group-hover:translate-x-1 transition-transform">Submit Report</span>
                            <FiSend className="group-hover:-translate-y-1 group-hover:translate-x-1 transition-transform" />
                          </>
                        )}
                      </motion.button>
                    </motion.form>
                  ) : (
                    <motion.div
                      key="success"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="py-12 text-center"
                    >
                      <div className="w-20 h-20 rounded-full bg-emerald-500/10 flex items-center justify-center mx-auto mb-6">
                        <FiCheckCircle className="text-4xl text-emerald-400" />
                      </div>
                      <h3 className="text-2xl font-bold text-white mb-2">Report Received!</h3>
                      <p className="text-gray-400 mb-8 max-w-xs mx-auto">
                        Thank you for helping us make Reflex better. Our team has been notified.
                      </p>
                      <button 
                        onClick={() => setSuccess(false)}
                        className="px-8 py-3 rounded-xl bg-white/5 text-white text-xs font-bold hover:bg-white/10 transition-colors"
                      >
                        Submit Another Report
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>

          {/* Guidelines Side */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-5 space-y-6"
          >
            <div className="glass-card p-8 border-white/5 bg-gradient-to-br from-white/[0.03] to-transparent h-full">
              <h3 className="text-xl font-bold text-white mb-8 flex items-center gap-3">
                <FiAlertTriangle className="text-amber-400" /> Bug Reporting Guide
              </h3>
              
              <div className="space-y-8 relative">
                <div className="absolute left-4 top-2 bottom-2 w-px bg-white/5" />
                
                {[
                  {
                    title: 'Be Descriptive',
                    desc: 'Explain exactly what you were doing when the issue occurred.',
                    icon: <FiEdit3 />,
                    color: 'rose'
                  },
                  {
                    title: 'Steps to Reproduce',
                    desc: 'List the clicks or actions that lead to the error.',
                    icon: <FiList />,
                    color: 'primary'
                  },
                  {
                    title: 'Check Browser',
                    desc: 'Mention if you are using Chrome, Safari, or another browser.',
                    icon: <FiGlobe />,
                    color: 'teal'
                  },
                  {
                    title: 'Resolution Time',
                    desc: 'Critical bugs are usually addressed within 24-48 hours.',
                    icon: '⏱️',
                    color: 'amber'
                  }
                ].map((item, i) => (
                  <motion.div 
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="relative pl-12"
                  >
                    <div className="absolute left-0 top-0 w-8 h-8 rounded-full bg-[#0a0f1c] border border-white/10 flex items-center justify-center text-sm z-10 shadow-lg">
                      {item.icon}
                    </div>
                    <h4 className="text-white font-bold text-sm mb-1">{item.title}</h4>
                    <p className="text-gray-500 text-xs leading-relaxed">{item.desc}</p>
                  </motion.div>
                ))}
              </div>

              <div className="mt-12 p-6 rounded-2xl bg-rose-500/5 border border-rose-500/10">
                <p className="text-rose-400 font-bold text-xs mb-2">Need Immediate Help?</p>
                <p className="text-gray-500 text-[10px] leading-relaxed">
                  If you can't access your account, please contact our support team at <span className="text-white">support@reflex.com</span>
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
