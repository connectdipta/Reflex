'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { useAuth } from '@/context/AuthContext';
import DashboardLayout from '@/components/DashboardLayout';
import { FiUsers, FiUserCheck, FiShield, FiActivity, FiTrash2, FiCheckCircle, FiXCircle, FiLayout, FiFileText, FiMusic, FiBook, FiPlus, FiX, FiRefreshCw, FiSearch, FiLoader, FiUpload, FiLink, FiAlertTriangle, FiCheck } from 'react-icons/fi';
import { GiMeditation } from 'react-icons/gi';
import adminAnimation from '@/public/admin.json';
const Lottie = dynamic(() => import('lottie-react'), { ssr: false });

const CONTENT_TYPES = [
  { id: 'music', label: 'Music', icon: FiMusic, color: 'violet' },
  { id: 'book', label: 'Books', icon: FiBook, color: 'sky' },
  { id: 'yoga', label: 'Yoga', icon: GiMeditation, color: 'teal' },
];

export default function AdminDashboard() {
  const { isLoggedIn, isAdmin, token, loading: authLoading, user } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('overview');
  const [users, setUsers] = useState([]);
  const [applications, setApplications] = useState([]);
  const [content, setContent] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ total: 0, doctors: 0, admins: 0, pending: 0 });
  const [contentTab, setContentTab] = useState('music');
  const [showAddForm, setShowAddForm] = useState(false);
  const [newContent, setNewContent] = useState({ title: '', description: '', url: '', link: '', thumbnail: '', duration: '', tag: '', author: '' });
  const [addingContent, setAddingContent] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [fetchingYT, setFetchingYT] = useState(false);
  const [uploadingImg, setUploadingImg] = useState(false);
  const [issues, setIssues] = useState([]);
  const [pendingIssues, setPendingIssues] = useState(0);

  useEffect(() => { if (!authLoading && (!isLoggedIn || !isAdmin)) router.push('/login'); }, [isLoggedIn, isAdmin, authLoading, router]);
  useEffect(() => { if (isAdmin && token) { fetchAll(); } }, [isAdmin, token]);

  const fetchAll = () => { fetchUsers(); fetchApplications(); fetchContent(); fetchIssues(); };
  const fetchUsers = async () => {
    try { const res = await fetch('/api/users', { headers: { Authorization: `Bearer ${token}` } }); const data = await res.json();
      if (res.ok) { setUsers(data.users || []); const u = data.users || []; setStats({ total: u.length, doctors: u.filter(x => x.role === 'doctor').length, admins: u.filter(x => x.role === 'admin').length, pending: u.filter(x => x.doctorProfile?.status === 'pending' && x.doctorProfile?.degree).length }); }
    } catch {} finally { setLoading(false); }
  };
  const fetchApplications = async () => { try { const res = await fetch('/api/doctor-apply', { headers: { Authorization: `Bearer ${token}` } }); const data = await res.json(); if (res.ok) setApplications(data.applications || []); } catch {} };
  const fetchContent = async () => { try { const res = await fetch('/api/content', { headers: { Authorization: `Bearer ${token}` } }); const data = await res.json(); if (res.ok) setContent(data.content || []); } catch {} };
  const fetchIssues = async () => { try { const res = await fetch('/api/issues', { headers: { Authorization: `Bearer ${token}` } }); const data = await res.json(); if (res.ok) { setIssues(data.issues || []); setPendingIssues(data.issues.filter(i => i.status === 'pending').length); } } catch {} };

  const handleRoleChange = async (userId, newRole) => { try { const res = await fetch('/api/users', { method: 'PATCH', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify({ targetUserId: userId, newRole }) }); if (res.ok) { toast.success(`Role → ${newRole}`); fetchUsers(); } } catch { toast.error('Failed'); } };
  const handleDeleteUser = async (userId) => { if (!confirm('Delete this user?')) return; try { const res = await fetch(`/api/users?id=${userId}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } }); if (res.ok) { toast.success('Deleted'); fetchUsers(); } } catch { toast.error('Failed'); } };
  const handleApplication = async (userId, action) => { try { const res = await fetch('/api/doctor-apply', { method: 'PATCH', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify({ userId, action }) }); if (res.ok) { toast.success(`${action}d`); fetchApplications(); fetchUsers(); } } catch { toast.error('Failed'); } };
  const handleAddContent = async () => { if (!newContent.title) { toast.error('Title required'); return; } setAddingContent(true); try { const res = await fetch('/api/content', { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify({ ...newContent, type: contentTab }) }); if (res.ok) { toast.success('Added!'); setShowAddForm(false); setNewContent({ title: '', description: '', url: '', link: '', thumbnail: '', duration: '', tag: '', author: '' }); fetchContent(); } } catch { toast.error('Error'); } finally { setAddingContent(false); } };
  const handleDeleteContent = async (id) => { if (!confirm('Delete?')) return; try { const res = await fetch(`/api/content?id=${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } }); if (res.ok) { toast.success('Deleted'); fetchContent(); } } catch {} };

  const handleIssueStatus = async (issueId, status) => { try { const res = await fetch('/api/issues', { method: 'PATCH', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify({ issueId, status }) }); if (res.ok) { toast.success(`Issue ${status}`); fetchIssues(); } } catch { toast.error('Failed'); } };
  const handleDeleteIssue = async (id) => { if (!confirm('Delete this report?')) return; try { const res = await fetch(`/api/issues?id=${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } }); if (res.ok) { toast.success('Deleted'); fetchIssues(); } } catch { toast.error('Failed'); } };

  const fetchYoutubeMeta = async (url) => {
    if (!url) return;
    setFetchingYT(true);
    try {
      const res = await fetch('/api/youtube-meta', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ url }) });
      const data = await res.json();
      if (res.ok) {
        setNewContent(prev => ({ ...prev, title: data.title || prev.title, thumbnail: data.thumbnail || prev.thumbnail, duration: data.duration || prev.duration, description: data.description || prev.description, url: data.embedUrl || url }));
        toast.success('YouTube data fetched!');
      } else toast.error(data.message || 'Failed');
    } catch { toast.error('Could not fetch'); } finally { setFetchingYT(false); }
  };

  const handleImgBBUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingImg(true);
    try {
      const formData = new FormData();
      formData.append('image', file);
      const res = await fetch('https://api.imgbb.com/1/upload?key=7a4a8aedb4583592f2e0e9e0e3a0e8f4', { method: 'POST', body: formData });
      const data = await res.json();
      if (data.success) {
        setNewContent(prev => ({ ...prev, thumbnail: data.data.display_url }));
        toast.success('Image uploaded!');
      } else toast.error('Upload failed');
    } catch { toast.error('Upload error'); } finally { setUploadingImg(false); }
  };

  if (authLoading || loading) return <div className="min-h-screen bg-[#060a14] flex items-center justify-center"><div className="w-10 h-10 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" /></div>;

  const tabs = [
    { id: 'overview', label: 'Overview', icon: FiLayout, active: activeTab === 'overview', onClick: () => setActiveTab('overview') },
    { id: 'users', label: 'Users', icon: FiUsers, active: activeTab === 'users', onClick: () => setActiveTab('users') },
    { id: 'applications', label: 'Doctor Apps', icon: FiFileText, active: activeTab === 'applications', onClick: () => setActiveTab('applications'), badge: stats.pending },
    { id: 'content', label: 'Content', icon: FiMusic, active: activeTab === 'content', onClick: () => setActiveTab('content') },
    { id: 'issues', label: 'Issues', icon: FiAlertTriangle, active: activeTab === 'issues', onClick: () => setActiveTab('issues'), badge: pendingIssues },
  ];

  const filteredUsers = searchQuery ? users.filter(u => u.name?.toLowerCase().includes(searchQuery.toLowerCase()) || u.email?.toLowerCase().includes(searchQuery.toLowerCase())) : users;
  const filteredContent = content.filter(c => c.type === contentTab);

  return (
    <DashboardLayout tabs={tabs} accentColor="purple" title={<>Control <span className="text-gradient">Center</span></>} subtitle="Admin Panel" badge="Administrator" lottieSlot={<Lottie animationData={adminAnimation} loop />} onRefresh={fetchAll}>
      <AnimatePresence mode="wait">
        {activeTab === 'overview' && (
          <motion.div key="ov" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
              {[{ l: 'Total Users', v: stats.total, icon: FiUsers, c: 'primary' }, { l: 'Doctors', v: stats.doctors, icon: FiUserCheck, c: 'teal' }, { l: 'Admins', v: stats.admins, icon: FiShield, c: 'purple' }, { l: 'Pending', v: stats.pending, icon: FiActivity, c: 'amber' }].map((s, i) => {
                const I = s.icon; return (
                  <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }} className="glass-card p-5 border-white/5 hover:border-white/10 transition-colors">
                    <div className={`w-9 h-9 rounded-lg bg-${s.c}-500/15 flex items-center justify-center mb-3`}><I className={`text-${s.c}-400`} /></div>
                    <p className="text-2xl font-black text-white">{s.v}</p><p className="text-[10px] text-gray-500 mt-1 uppercase tracking-widest">{s.l}</p>
                  </motion.div>);
              })}
            </div>
            <div className="grid lg:grid-cols-5 gap-5">
              <div className="lg:col-span-3 glass-card p-5 border-white/5">
                <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2"><FiUsers className="text-purple-400" /> Recent Users</h3>
                <div className="space-y-2">{users.slice(0, 8).map((u, i) => (
                  <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-white/[0.03] hover:bg-white/[0.06] transition-colors">
                    <div className="flex items-center gap-3"><div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-xs font-bold text-purple-400 overflow-hidden">{u.avatar ? <img src={u.avatar} alt="" className="w-full h-full object-cover" /> : u.name?.charAt(0)}</div>
                    <div><p className="text-sm font-medium text-white">{u.name}</p><p className="text-[10px] text-gray-600">{u.email}</p></div></div>
                    <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase ${u.role === 'admin' ? 'bg-purple-500/15 text-purple-400' : u.role === 'doctor' ? 'bg-teal-500/15 text-teal-400' : 'bg-white/5 text-gray-500'}`}>{u.role}</span>
                  </div>))}</div>
              </div>
              <div className="lg:col-span-2 glass-card p-5 border-white/5">
                <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2"><FiMusic className="text-purple-400" /> Content</h3>
                <div className="space-y-3">{CONTENT_TYPES.map(ct => { const I = ct.icon; const count = content.filter(c => c.type === ct.id).length; return (
                  <div key={ct.id} className="flex items-center justify-between p-4 rounded-xl bg-white/[0.03]">
                    <div className="flex items-center gap-3"><I className={`text-${ct.color}-400`} /><span className="text-sm font-medium text-white">{ct.label}</span></div>
                    <span className={`text-xl font-black text-${ct.color}-400`}>{count}</span>
                  </div>); })}</div>
                <button onClick={fetchAll} className="mt-4 w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 text-xs font-medium text-gray-400 hover:bg-white/10 transition-all"><FiRefreshCw /> Refresh All</button>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'users' && (
          <motion.div key="us" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            <div className="flex items-center gap-3 mb-5">
              <div className="flex-1 relative"><FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600" /><input placeholder="Search users..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="input-field pl-10 !py-2.5 w-full" /></div>
              <span className="text-xs text-gray-500 shrink-0">{filteredUsers.length} users</span>
            </div>
            <div className="glass-card border-white/5 overflow-x-auto">
              <table className="w-full min-w-[650px]">
                <thead><tr className="border-b border-white/5">{['User', 'Email', 'Sessions', 'Joined', 'Role', ''].map(h => <th key={h} className="text-left py-3 px-4 text-[10px] font-bold text-gray-600 uppercase tracking-wider">{h}</th>)}</tr></thead>
                <tbody>{filteredUsers.map((u, i) => (
                  <tr key={i} className="border-b border-white/[0.03] hover:bg-white/[0.02] transition-colors">
                    <td className="py-3 px-4"><div className="flex items-center gap-3"><div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-xs font-bold text-purple-400 overflow-hidden">{u.avatar ? <img src={u.avatar} alt="" className="w-full h-full object-cover rounded-full" /> : u.name?.charAt(0)}</div><span className="text-sm font-medium text-white">{u.name}</span></div></td>
                    <td className="py-3 px-4 text-sm text-gray-500">{u.email}</td>
                    <td className="py-3 px-4 text-sm font-bold text-purple-400">{u.trackingData?.totalSessions || 0}</td>
                    <td className="py-3 px-4 text-[11px] text-gray-600">{u.createdAt ? new Date(u.createdAt).toLocaleDateString() : '–'}</td>
                    <td className="py-3 px-4"><select value={u.role} onChange={e => handleRoleChange(u._id, e.target.value)} className="bg-white/5 border border-white/10 rounded-lg px-2 py-1 text-xs text-white cursor-pointer focus:outline-none focus:border-purple-500/50"><option value="user" className="bg-[#0d1528]">User</option><option value="doctor" className="bg-[#0d1528]">Doctor</option><option value="admin" className="bg-[#0d1528]">Admin</option></select></td>
                    <td className="py-3 px-4"><button onClick={() => handleDeleteUser(u._id)} className="p-1.5 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors"><FiTrash2 size={13} /></button></td>
                  </tr>))}</tbody>
              </table>
            </div>
          </motion.div>
        )}

        {activeTab === 'applications' && (
          <motion.div key="ap" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-4">
            {applications.filter(a => a.doctorProfile?.status).length === 0 ? (
              <div className="glass-card p-16 text-center border-white/5"><FiFileText className="text-4xl text-gray-700 mx-auto mb-3" /><p className="text-gray-500 text-sm">No doctor applications</p></div>
            ) : applications.filter(a => a.doctorProfile?.status).map((app, i) => (
              <div key={i} className="glass-card p-5 border-white/5">
                <div className="flex flex-col md:flex-row justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-11 h-11 rounded-full bg-white/5 flex items-center justify-center text-purple-400 font-bold overflow-hidden">{app.avatar ? <img src={app.avatar} alt="" className="w-full h-full object-cover" /> : app.name?.charAt(0)}</div>
                      <div><h3 className="font-bold text-white text-sm">{app.name}</h3><p className="text-[10px] text-gray-600">{app.email}</p></div>
                      <span className={`ml-auto px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase ${app.doctorProfile.status === 'pending' ? 'bg-amber-500/15 text-amber-400' : app.doctorProfile.status === 'approved' ? 'bg-emerald-500/15 text-emerald-400' : 'bg-red-500/15 text-red-400'}`}>{app.doctorProfile.status}</span>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">{[['Spec.', app.doctorProfile.specialization], ['Degree', app.doctorProfile.degree], ['Exp.', `${app.doctorProfile.experience} yrs`], ['Fee', `৳${app.doctorProfile.fee}`]].map(([k, v]) => <div key={k} className="bg-white/[0.03] rounded-lg p-2.5"><p className="text-[9px] text-gray-600 mb-0.5">{k}</p><p className="text-xs font-bold text-white">{v}</p></div>)}</div>
                  </div>
                  {app.doctorProfile.status === 'pending' && (
                    <div className="flex md:flex-col gap-2 justify-end">
                      <button onClick={() => handleApplication(app._id, 'approve')} className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-500/15 text-emerald-400 hover:bg-emerald-500/25 text-xs font-bold transition-colors"><FiCheckCircle /> Approve</button>
                      <button onClick={() => handleApplication(app._id, 'reject')} className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-red-500/15 text-red-400 hover:bg-red-500/25 text-xs font-bold transition-colors"><FiXCircle /> Reject</button>
                    </div>)}
                </div>
              </div>))}
          </motion.div>
        )}

        {activeTab === 'content' && (
          <motion.div key="ct" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
              <div className="flex gap-2">{CONTENT_TYPES.map(ct => { const I = ct.icon; return (<button key={ct.id} onClick={() => { setContentTab(ct.id); setShowAddForm(false); }} className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all border ${contentTab === ct.id ? `bg-${ct.color}-500/15 border-${ct.color}-500/30 text-${ct.color}-400` : 'bg-white/5 border-white/5 text-gray-500 hover:bg-white/10'}`}><I /> {ct.label}</button>); })}</div>
              <button onClick={() => setShowAddForm(!showAddForm)} className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all border ${showAddForm ? 'bg-red-500/15 border-red-500/30 text-red-400' : 'bg-purple-500/15 border-purple-500/30 text-purple-400'}`}>{showAddForm ? <><FiX /> Cancel</> : <><FiPlus /> Add</>}</button>
            </div>
            <AnimatePresence>{showAddForm && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="glass-card p-5 border-white/5 mb-5 overflow-hidden">
                {/* YouTube URL with auto-fetch (for music/yoga) */}
                {contentTab !== 'book' ? (
                  <div className="mb-4">
                    <label className="text-[10px] text-gray-500 uppercase tracking-wider mb-1.5 block">YouTube URL — paste and fetch metadata</label>
                    <div className="flex gap-2">
                      <input placeholder="https://youtube.com/watch?v=..." value={newContent.url} onChange={e => setNewContent({ ...newContent, url: e.target.value })} className="input-field flex-1" />
                      <button onClick={() => fetchYoutubeMeta(newContent.url)} disabled={fetchingYT || !newContent.url} className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-purple-500/15 text-purple-400 text-xs font-bold hover:bg-purple-500/25 transition-colors disabled:opacity-40 shrink-0">
                        {fetchingYT ? <><FiLoader className="animate-spin" /> Fetching...</> : <><FiLink /> Fetch</>}
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="mb-4">
                    <label className="text-[10px] text-gray-500 uppercase tracking-wider mb-1.5 block">Book Link</label>
                    <input placeholder="https://example.com/book-link" value={newContent.link} onChange={e => setNewContent({ ...newContent, link: e.target.value })} className="input-field w-full" />
                  </div>
                )}

                {/* Thumbnail preview + upload */}
                {newContent.thumbnail && <div className="mb-4 w-full max-w-xs"><img src={newContent.thumbnail} alt="Preview" className="w-full rounded-lg border border-white/10" onError={e => { e.target.style.display = 'none'; }} /></div>}

                <div className="grid sm:grid-cols-2 gap-3">
                  <input placeholder="Title *" value={newContent.title} onChange={e => setNewContent({ ...newContent, title: e.target.value })} className="input-field" />
                  <input placeholder="Tag (e.g. Calm)" value={newContent.tag} onChange={e => setNewContent({ ...newContent, tag: e.target.value })} className="input-field" />

                  {contentTab === 'book' ? (
                    <div className="col-span-2 sm:col-span-1">
                      <label className="text-[10px] text-gray-500 uppercase tracking-wider mb-1 block">Thumbnail (ImgBB Upload)</label>
                      <label className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-xs text-gray-400 cursor-pointer hover:bg-white/10 transition-all">
                        {uploadingImg ? <><FiLoader className="animate-spin" /> Uploading...</> : <><FiUpload /> Choose Image</>}
                        <input type="file" accept="image/*" onChange={handleImgBBUpload} className="hidden" />
                      </label>
                    </div>
                  ) : (
                    <input placeholder="Thumbnail URL" value={newContent.thumbnail} onChange={e => setNewContent({ ...newContent, thumbnail: e.target.value })} className="input-field" />
                  )}

                  <input placeholder={contentTab === 'book' ? 'Author' : 'Duration'} value={contentTab === 'book' ? newContent.author : newContent.duration} onChange={e => setNewContent({ ...newContent, [contentTab === 'book' ? 'author' : 'duration']: e.target.value })} className="input-field" />
                  <textarea placeholder="Description" value={newContent.description} onChange={e => setNewContent({ ...newContent, description: e.target.value })} className="input-field col-span-2 resize-none" rows={2} />
                </div>
                <button onClick={handleAddContent} disabled={addingContent} className="mt-3 px-6 py-2 rounded-xl bg-purple-500/20 text-purple-400 text-xs font-bold hover:bg-purple-500/30 transition-colors disabled:opacity-50">{addingContent ? 'Adding...' : 'Add Content'}</button>
              </motion.div>
            )}</AnimatePresence>
            {filteredContent.length === 0 ? (
              <div className="glass-card p-16 text-center border-white/5"><FiMusic className="text-4xl text-gray-700 mx-auto mb-3" /><p className="text-gray-500 text-sm">No {contentTab} yet</p></div>
            ) : (
              <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">{filteredContent.map((item, i) => (
                <motion.div key={item._id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }} className="glass-card p-4 border-white/5 group">
                  {item.thumbnail && <div className="w-full aspect-video rounded-lg overflow-hidden mb-3 bg-white/5"><img src={item.thumbnail} alt="" className="w-full h-full object-cover opacity-70 group-hover:opacity-100 transition-opacity" /></div>}
                  <div className="flex items-start justify-between gap-2">
                    <div><h4 className="font-bold text-white text-sm mb-1">{item.title}</h4><div className="flex gap-1.5 flex-wrap">{item.tag && <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-purple-500/10 text-purple-400 font-bold">{item.tag}</span>}{item.duration && <span className="text-[9px] text-gray-600">{item.duration}</span>}{item.author && <span className="text-[9px] text-gray-600">by {item.author}</span>}</div></div>
                    <button onClick={() => handleDeleteContent(item._id)} className="shrink-0 p-1.5 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors opacity-0 group-hover:opacity-100"><FiTrash2 size={12} /></button>
                  </div>
                </motion.div>))}</div>
            )}
          </motion.div>
        )}
        {activeTab === 'issues' && (
          <motion.div key="is" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-4">
            {issues.length === 0 ? (
              <div className="glass-card p-16 text-center border-white/5"><FiAlertTriangle className="text-4xl text-gray-700 mx-auto mb-3" /><p className="text-gray-500 text-sm">No issues reported</p></div>
            ) : issues.map((issue, i) => (
              <div key={i} className="glass-card p-5 border-white/5 bg-white/[0.01]">
                <div className="flex flex-col md:flex-row justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase ${issue.status === 'pending' ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'}`}>{issue.status}</span>
                      <h3 className="font-bold text-white text-sm">{issue.subject}</h3>
                      <span className="text-[10px] text-gray-600 ml-auto">{new Date(issue.createdAt).toLocaleString()}</span>
                    </div>
                    <p className="text-gray-400 text-xs mb-4 leading-relaxed">{issue.message}</p>
                    {issue.screenshot && (
                      <div className="mb-4 group/ss relative inline-block">
                        <img src={issue.screenshot} alt="Screenshot" className="max-h-32 rounded-lg border border-white/10 hover:border-purple-500/50 transition-all cursor-zoom-in" onClick={() => window.open(issue.screenshot, '_blank')} />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/ss:opacity-100 flex items-center justify-center rounded-lg transition-opacity pointer-events-none">
                          <FiLink className="text-white" />
                        </div>
                      </div>
                    )}
                    <div className="flex items-center gap-3 py-2 border-t border-white/5">
                      <div className="w-6 h-6 rounded-full bg-white/5 flex items-center justify-center text-[10px] text-purple-400 font-bold shrink-0">{issue.name.charAt(0)}</div>
                      <div className="min-w-0">
                        <p className="text-[10px] text-white font-medium truncate">{issue.name}</p>
                        <p className="text-[9px] text-gray-600 truncate">{issue.email}</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex md:flex-col gap-2 justify-end shrink-0">
                    {issue.status === 'pending' ? (
                      <button onClick={() => handleIssueStatus(issue._id, 'fixed')} className="flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 text-[10px] font-bold transition-all"><FiCheck /> Mark Fixed</button>
                    ) : (
                      <button onClick={() => handleIssueStatus(issue._id, 'pending')} className="flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-amber-500/10 text-amber-400 hover:bg-amber-500/20 text-[10px] font-bold transition-all"><FiRefreshCw /> Reopen</button>
                    )}
                    <button onClick={() => handleDeleteIssue(issue._id)} className="flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 text-[10px] font-bold transition-all"><FiTrash2 /> Delete</button>
                  </div>
                </div>
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </DashboardLayout>
  );
}
