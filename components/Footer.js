'use client';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  FiFacebook,
  FiTwitter,
  FiLinkedin,
  FiInstagram,
  FiMail,
  FiPhone,
  FiMapPin,
  FiArrowUp,
  FiHeart,
  FiGithub,
} from 'react-icons/fi';
import Logo from './Logo';

const quickLinks = [
  { label: 'Home', href: '/#home' },
  { label: 'About', href: '/#about' },
  { label: 'Services', href: '/#services' },
  { label: 'Psychiatrists', href: '/#doctors' },
  { label: 'Join as Doctor', href: '/apply-doctor' },
  { label: 'Testimonial', href: '/#testimonials' },
  { label: 'Contact', href: '/#contact' },
];

const servicesLinks = [
  { label: 'Audio Therapy', href: '/services/audio' },
  { label: 'Yoga Therapy', href: '/services/yoga' },
  { label: 'Reading Therapy', href: '/services/reading' },
  { label: 'Laughing Therapy', href: '/services/laughing' },
  { label: 'Psychiatrist Consult', href: '/booking' },
  { label: 'Wellness Tracking', href: '/tracking' },
];

const socialLinks = [
  { icon: FiFacebook, href: 'https://facebook.com' },
  { icon: FiTwitter, href: 'https://twitter.com' },
  { icon: FiLinkedin, href: 'https://linkedin.com' },
  { icon: FiInstagram, href: 'https://instagram.com' },
  { icon: FiGithub, href: 'https://github.com/connectdipta' },
];

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="relative bg-dark-800 border-t border-white/5">
      {/* Newsletter */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="glass-card p-8 md:p-10 bg-gradient-to-r from-primary-500/10 to-teal-500/10"
        >
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="text-2xl font-bold mb-2">
                Subscribe to Our <span className="text-gradient">Newsletter</span>
              </h3>
              <p className="text-gray-400">
                Get the latest wellness tips and updates directly in your inbox.
              </p>
            </div>
            <div className="flex w-full md:w-auto gap-3">
              <input
                type="email"
                placeholder="Your email address"
                className="input-field flex-1 md:w-72"
              />
              <button className="gradient-btn whitespace-nowrap">
                <span>Subscribe</span>
              </button>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 mt-8">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Logo className="w-10 h-10" />
              <span className="text-xl font-bold font-display">
                RE<span className="text-gradient">FLEX</span>
              </span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed mb-6">
              Your trusted companion for mental wellness. We believe everyone deserves
              peace of mind and emotional well-being.
            </p>
            <div className="flex gap-3">
              {socialLinks.map((item, i) => {
                const Icon = item.icon;
                return (
                  <a
                    key={i}
                    href={item.href}
                    target={item.href !== '#' ? '_blank' : '_self'}
                    rel={item.href !== '#' ? 'noopener noreferrer' : ''}
                    className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center hover:bg-primary-500/20 hover:text-primary-400 transition-all duration-200"
                  >
                    <Icon />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-bold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              {quickLinks.map((link, i) => (
                <li key={i}>
                  <Link
                    href={link.href}
                    className="text-gray-400 hover:text-primary-400 transition-colors text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-lg font-bold mb-4">Services</h4>
            <ul className="space-y-2">
              {servicesLinks.map((service, i) => (
                <li key={i}>
                  <Link
                    href={service.href}
                    className="text-gray-400 hover:text-primary-400 transition-colors text-sm"
                  >
                    {service.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-bold mb-4">Contact</h4>
            <div className="space-y-3">
              {[
                { icon: FiMapPin, text: 'Dhaka, Bangladesh' },
                { icon: FiPhone, text: '+88 01844858504' },
                { icon: FiMail, text: 'connect.dipta@gmail.com' },
              ].map((item, i) => {
                const Icon = item.icon;
                return (
                  <div key={i} className="flex items-center gap-3 text-gray-400 text-sm">
                    <Icon className="text-primary-400 flex-shrink-0" />
                    {item.text}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-gray-500 text-sm">
            © {new Date().getFullYear()} Reflex. All Rights Reserved by{' '}
            <span className="text-primary-400 font-bold tracking-wider">DIPTA</span>
          </p>
          <p className="text-gray-500 text-sm flex items-center gap-1">
            Made with <FiHeart className="text-red-400" /> for mental wellness
          </p>
        </div>
      </div>
    </footer>
  );
}
