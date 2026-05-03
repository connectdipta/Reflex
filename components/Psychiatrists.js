'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiFacebook,
  FiTwitter,
  FiLinkedin,
  FiInstagram,
  FiChevronLeft,
  FiChevronRight,
  FiUser
} from 'react-icons/fi';
import { FaUserMd } from 'react-icons/fa';
import psychiatristsData from '@/data/psychiatrists.json';

export default function Psychiatrists() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [dynamicDoctors, setDynamicDoctors] = useState([]);
  const [mounted, setMounted] = useState(false);
  const [itemsPerView, setItemsPerView] = useState(3);

  useEffect(() => {
    setMounted(true);
    const handleResize = () => {
      setItemsPerView(window.innerWidth < 768 ? 1 : 3);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const res = await fetch('/api/doctors');
        const data = await res.json();
        if (res.ok && data.doctors && data.doctors.length > 0) {
          const formatted = data.doctors.map(d => ({
            _id: d._id,
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

  const displayData = [...psychiatristsData, ...dynamicDoctors];

  const next = () => {
    setCurrentIndex((prev) => (prev + 1) % displayData.length);
  };

  const prev = () => {
    setCurrentIndex((prev) => (prev - 1 + displayData.length) % displayData.length);
  };

  // Auto-play the carousel
  useEffect(() => {
    const timer = setInterval(() => {
      next();
    }, 4000);
    return () => clearInterval(timer);
  }, [displayData.length]);

  const getVisibleDoctors = () => {
    const visible = [];
    for (let i = 0; i < Math.min(itemsPerView, displayData.length); i++) {
      visible.push(displayData[(currentIndex + i) % displayData.length]);
    }
    return visible;
  };

  return (
    <section id="doctors" className="section-padding bg-mesh relative overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="section-heading mb-4">
            Our <span>Psychiatrists</span>
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Meet our team of certified mental health professionals dedicated to your
            wellness journey.
          </p>
        </motion.div>

        <div className="relative">
          {/* Navigation Buttons */}
          <button
            onClick={prev}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 w-12 h-12 rounded-full glass-card flex items-center justify-center hover:bg-primary-500/20 transition-colors"
          >
            <FiChevronLeft className="text-xl" />
          </button>
          <button
            onClick={next}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 w-12 h-12 rounded-full glass-card flex items-center justify-center hover:bg-primary-500/20 transition-colors"
          >
            <FiChevronRight className="text-xl" />
          </button>

          <div className="px-8 overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.4 }}
                className="grid sm:grid-cols-2 md:grid-cols-3 gap-6 transform-gpu"
              >
                {mounted && getVisibleDoctors().map((doctor, i) => (
                  <div
                    key={i}
                    className="glass-card-hover text-center p-8 group relative transform-gpu will-change-transform"
                  >
                    {/* Link overlay for the whole card but excluding social icons */}
                    <Link href={`/psychiatrists/${doctor.slug}`} className="absolute inset-0 z-0" aria-label={`View details of ${doctor.name}`} />
                    
                    {/* Avatar */}
                    <div className="relative w-28 h-28 mx-auto mb-6 pointer-events-none">
                      <div className="w-full h-full rounded-full bg-gradient-to-br from-primary-500/20 to-teal-500/20 flex items-center justify-center border-2 border-primary-500/20 group-hover:border-primary-500/50 transition-colors overflow-hidden relative">
                        {doctor.image ? (
                          <Image src={doctor.image} alt={doctor.name} fill sizes="(max-width: 768px) 112px, 112px" className="object-cover" />
                        ) : (
                          <FaUserMd className="text-4xl text-primary-400" />
                        )}
                      </div>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
                      className="absolute -inset-2 border border-dashed border-primary-500/20 rounded-full transform-gpu will-change-transform"
                    />
                  </div>

                  <div className="relative z-10 pointer-events-none">
                    <h3 className="text-xl font-bold mb-1">{doctor.name}</h3>
                    <p className="text-primary-400 text-sm font-medium mb-1">{doctor.degree}</p>
                    <p className="text-gray-400 text-sm mb-1">{doctor.specialty}</p>
                    <p className="text-teal-400 text-xs font-medium mb-4">{doctor.experience}</p>
                  </div>

                  <div className="flex justify-center gap-3 relative z-10">
                    {[
                      { icon: FiFacebook, href: doctor.social.facebook },
                      { icon: FiTwitter, href: doctor.social.twitter },
                      { icon: FiLinkedin, href: doctor.social.linkedin },
                      { icon: FiInstagram, href: doctor.social.instagram },
                    ].map((social, j) => {
                      const SocialIcon = social.icon;
                      return (
                        <a
                          key={j}
                          href={social.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-9 h-9 rounded-lg bg-white/5 flex items-center justify-center hover:bg-primary-500/20 hover:text-primary-400 transition-all duration-200"
                        >
                          <SocialIcon className="text-sm" />
                        </a>
                      );
                    })}
                  </div>
                  </div>
                ))}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Dots */}
          <div className="flex justify-center gap-2 mt-8">
            {psychiatristsData.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentIndex(i)}
                className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                  i === currentIndex
                    ? 'bg-primary-500 w-8'
                    : 'bg-white/20 hover:bg-white/40'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
