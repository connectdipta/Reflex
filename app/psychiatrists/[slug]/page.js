'use client';
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  FiArrowLeft, 
  FiFacebook, 
  FiTwitter, 
  FiLinkedin, 
  FiInstagram,
  FiStar,
  FiAward,
  FiBookOpen,
  FiCheckCircle,
  FiCalendar
} from 'react-icons/fi';
import psychiatristsData from '@/data/psychiatrists.json';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function DoctorDetails() {
  const { slug } = useParams();
  const [dynamicDoctor, setDynamicDoctor] = useState(null);
  const [loading, setLoading] = useState(!psychiatristsData.find(d => d.slug === slug));

  useEffect(() => {
    if (psychiatristsData.find(d => d.slug === slug)) return;

    const fetchDoctor = async () => {
      try {
        const res = await fetch('/api/doctors');
        const data = await res.json();
        if (res.ok && data.doctors) {
          const d = data.doctors.find(doc => doc._id === slug);
          if (d) {
            setDynamicDoctor({
              slug: d._id,
              name: d.name?.startsWith('Dr.') ? d.name : `Dr. ${d.name}`,
              specialty: d.doctorProfile?.specialization || 'General Psychiatry',
              experience: d.doctorProfile?.experience ? `${d.doctorProfile.experience}+ Years` : 'Experienced',
              degree: d.doctorProfile?.degree || 'MBBS',
              bio: d.doctorProfile?.bio || 'Dedicated mental health professional focused on holistic psychiatric care.',
              image: d.doctorProfile?.image || d.avatar || 'https://i.ibb.co/68v8L5D/doctor-placeholder.jpg',
              social: { facebook: '#', twitter: '#', linkedin: '#', instagram: '#' },
              rating: '5.0',
              patients: '100+',
              education: [d.doctorProfile?.degree || 'MBBS'],
              achievements: ['Certified Mental Health Professional']
            });
          }
        }
      } catch (err) {} finally {
        setLoading(false);
      }
    };
    fetchDoctor();
  }, [slug]);

  const doctor = psychiatristsData.find(d => d.slug === slug) || dynamicDoctor;

  if (loading) {
    return (
      <div className="min-h-screen bg-mesh flex items-center justify-center">
        <div className="w-10 h-10 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!doctor) {
    return (
      <div className="min-h-screen bg-mesh flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4 text-white">Doctor Not Found</h1>
          <Link href="/#doctors" className="gradient-btn px-6 py-2">
            Back to Team
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-mesh pt-32 pb-20 px-4 overflow-hidden">
        {/* Background Decorations */}
        <div className="absolute top-1/4 left-0 w-96 h-96 bg-primary-500/10 blur-[120px] rounded-full -translate-x-1/2" />
        <div className="absolute bottom-1/4 right-0 w-96 h-96 bg-teal-500/10 blur-[120px] rounded-full translate-x-1/2" />

        <div className="max-w-6xl mx-auto relative z-10">
          <Link href="/#doctors" className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-12 transition-all group">
            <div className="w-10 h-10 rounded-full glass-card flex items-center justify-center group-hover:bg-white/10 transition-colors">
              <FiArrowLeft className="group-hover:-translate-x-1 transition-transform" /> 
            </div>
            <span className="font-medium font-display">Back to Specialists</span>
          </Link>

          <div className="grid lg:grid-cols-12 gap-12">
            {/* Left Column: Image & Quick Info */}
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              className="lg:col-span-5 space-y-8"
            >
              <div className="relative aspect-[4/5] w-full rounded-3xl overflow-hidden border border-white/10 shadow-glow">
                <Image 
                  src={doctor.image} 
                  alt={doctor.name} 
                  fill 
                  className="object-cover transition-transform duration-700 hover:scale-105"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-dark-900 via-transparent to-transparent opacity-60" />
                <div className="absolute bottom-6 left-6 right-6">
                   <div className="flex gap-4">
                      {[
                        { icon: FiFacebook, href: doctor.social.facebook },
                        { icon: FiTwitter, href: doctor.social.twitter },
                        { icon: FiLinkedin, href: doctor.social.linkedin },
                        { icon: FiInstagram, href: doctor.social.instagram },
                      ].map((social, i) => {
                        const Icon = social.icon;
                        return (
                          <a 
                            key={i} 
                            href={social.href} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="w-11 h-11 rounded-xl glass-card flex items-center justify-center text-white hover:bg-primary-500 hover:text-white transition-all duration-300"
                          >
                            <Icon className="text-lg" />
                          </a>
                        );
                      })}
                   </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="glass-card p-6 text-center">
                  <FiStar className="text-yellow-500 text-2xl mx-auto mb-2" />
                  <div className="text-xl font-bold">{doctor.rating}</div>
                  <div className="text-xs text-gray-500 uppercase tracking-widest font-bold">Rating</div>
                </div>
                <div className="glass-card p-6 text-center">
                  <FiCheckCircle className="text-teal-400 text-2xl mx-auto mb-2" />
                  <div className="text-xl font-bold">{doctor.patients}</div>
                  <div className="text-xs text-gray-500 uppercase tracking-widest font-bold">Patients</div>
                </div>
              </div>

              <Link href="/booking" className="gradient-btn w-full !py-5 text-lg flex items-center justify-center gap-3 shadow-glow group">
                <FiCalendar className="group-hover:rotate-12 transition-transform" />
                Book Session with {doctor.name.split(' ')[1]}
              </Link>
            </motion.div>

            {/* Right Column: Detailed Info */}
            <motion.div 
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              className="lg:col-span-7 space-y-10"
            >
              <div>
                <h1 className="text-4xl md:text-5xl font-bold font-display mb-4">
                  {doctor.name}
                </h1>
                <div className="flex flex-wrap items-center gap-4 text-primary-400 font-medium text-lg">
                  <span>{doctor.specialty}</span>
                  <div className="w-1.5 h-1.5 rounded-full bg-white/20" />
                  <span className="text-teal-400">{doctor.experience} Experience</span>
                </div>
                <p className="mt-4 text-gray-400 font-medium tracking-wide">
                  {doctor.degree}
                </p>
              </div>

              <div className="space-y-6">
                <h2 className="text-2xl font-bold font-display flex items-center gap-3">
                  <span className="w-8 h-8 rounded-lg bg-primary-500/20 flex items-center justify-center text-primary-400 text-sm">01</span>
                  Professional Biography
                </h2>
                <p className="text-gray-400 leading-relaxed text-lg italic">
                  "{doctor.bio}"
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold font-display flex items-center gap-3">
                    <FiBookOpen className="text-primary-400" />
                    Education
                  </h2>
                  <ul className="space-y-4">
                    {doctor.education.map((item, i) => (
                      <li key={i} className="flex gap-3 text-gray-400 text-sm">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary-500 mt-1.5 shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="space-y-6">
                  <h2 className="text-2xl font-bold font-display flex items-center gap-3">
                    <FiAward className="text-teal-400" />
                    Achievements
                  </h2>
                  <ul className="space-y-4">
                    {doctor.achievements.map((item, i) => (
                      <li key={i} className="flex gap-3 text-gray-400 text-sm">
                        <div className="w-1.5 h-1.5 rounded-full bg-teal-400 mt-1.5 shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="glass-card p-8 border-primary-500/20 bg-primary-500/5 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary-500/10 blur-3xl rounded-full" />
                <h3 className="text-xl font-bold mb-4">Book a Consultation</h3>
                <p className="text-gray-400 mb-6">
                  Schedule a private session with {doctor.name} to discuss your mental wellness journey.
                </p>
                <Link href="/booking" className="inline-flex items-center gap-2 text-primary-400 font-bold hover:text-primary-300 transition-colors">
                  Check Availability <FiArrowLeft className="rotate-180" />
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
