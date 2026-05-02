'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import dynamic from 'next/dynamic';
import { useAuth } from '@/context/AuthContext';
import { FiArrowLeft, FiBookOpen, FiBookmark, FiDownload } from 'react-icons/fi';
import toast from 'react-hot-toast';
import readingAnimation from '@/public/Reading.json';

const Lottie = dynamic(() => import('lottie-react'), { ssr: false });

const quotes = [
  "You don't have to control your thoughts. You just have to stop letting them control you.",
  "Mental health needs a great deal of attention. It's the final taboo and it needs to be faced and dealt with.",
  "There is hope, even when your brain tells you there isn't.",
  "Take your time healing, as long as you want. Nobody else knows what you've been through."
];

const books = [
  { 
    title: 'Adhayapok', 
    author: 'Rabindranath Tagore', 
    category: 'Classics',
    cover: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=300&h=400&auto=format&fit=crop',
    link: 'https://dl.bdebooks.com/Indian%20Author/Rabindranath%20Tagore/Adhayapok%20By%20Rabindranath%20Tagore%20(BDeBooks.Com).pdf'
  },
  { 
    title: 'Adam', 
    author: 'Smaranjit Chakraborty', 
    category: 'Modern Literature',
    cover: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?q=80&w=300&h=400&auto=format&fit=crop',
    link: 'https://dl.bdebooks.com/Indian%20Author/Smaranjit%20Chakraborty/Adam%20by%20Smaranjit%20Chakraborty(BDebooks.Com).pdf'
  },
  { 
    title: 'Adhar Rater Atithi', 
    author: 'Sunil Gangopadhyay', 
    category: 'Literature',
    cover: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?q=80&w=300&h=400&auto=format&fit=crop',
    link: 'https://dl.bdebooks.com/Indian%20Author/Sunil%20Gangopadhyay/Adhar%20Rater%20Atithi%20By%20Sunil%20Gangopadhyay%20(BDeBooks.Com).pdf'
  },
  { 
    title: '25ti Sera Hasi', 
    author: 'Sanjib Chattopadhyay', 
    category: 'Humor',
    cover: 'https://images.unsplash.com/photo-1589998059171-988d887df646?q=80&w=300&h=400&auto=format&fit=crop',
    link: 'https://dl.bdebooks.com/Indian%20Author/Sanjib%20Chattopadhyay/25ti%20Sera%20Hasi%20by%20Sanjib%20Chattopadhyay(BDebooks.Com).pdf'
  },
  { 
    title: 'Bhabaghure O Anyanya', 
    author: 'Syed Mujtaba Ali', 
    category: 'Travelogue',
    cover: 'https://images.unsplash.com/photo-1516979187457-637abb4f9353?q=80&w=300&h=400&auto=format&fit=crop',
    link: 'https://dl.bdebooks.com/Bangladeshi%20Author/Syed%20Mujtaba%20Ali/Bhabaghure%20O%20Anyanya%20By%20Syed%20Mujtaba%20Ali%20(BDeBooks.Com).pdf'
  },
  { 
    title: 'Bholo Jhokon Raja Holo', 
    author: 'Shirshendu Mukhopadhyay', 
    category: 'Fantasy',
    cover: 'https://images.unsplash.com/photo-1474932430478-367dbb6832c1?q=80&w=300&h=400&auto=format&fit=crop',
    link: 'https://dl.bdebooks.com/Indian%20Author/Shirshendu%20Mukhopadhyay/Bholo%20jhokon%20raja%20holo%20Shirshendu%20Mukhopadhyay%20-%20(BdeBooks.Com).pdf'
  },
];

export default function ReadingTherapy() {
  const { isLoggedIn, loading, token } = useAuth();
  const router = useRouter();
  const [showAllBooks, setShowAllBooks] = useState(false);

  const updateTracking = async (serviceName) => {
    if (!isLoggedIn || !token) return;
    try {
      await fetch('/api/tracking', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ service: serviceName })
      });
    } catch (error) {
      console.error('Error updating tracking:', error);
    }
  };

  const displayedBooks = showAllBooks ? books : books.slice(0, 4);

  useEffect(() => {
    if (!loading && !isLoggedIn) {
      toast.error('Please login to access Reading Therapy');
      router.push('/login');
    }
  }, [isLoggedIn, loading, router]);

  if (loading || !isLoggedIn) return null;

  return (
    <div className="min-h-screen bg-[#0a0f1c] relative overflow-hidden py-24 px-4">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
        <div className="absolute -top-[20%] -left-[10%] w-[60%] h-[60%] bg-sky-500/10 rounded-full blur-[120px]" />
        <div className="absolute top-[40%] -right-[10%] w-[50%] h-[50%] bg-teal-500/10 rounded-full blur-[120px]" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <Link href="/#services" className="inline-flex items-center gap-2 text-gray-400 hover:text-sky-400 transition-all mb-12 group">
          <FiArrowLeft className="group-hover:-translate-x-1 transition-transform" /> 
          <span className="font-medium">Back to Services</span>
        </Link>

        <div className="grid lg:grid-cols-2 gap-16 items-center mb-24">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-sky-500/10 border border-sky-500/20 text-sky-400 text-sm font-semibold mb-8">
              <FiBookOpen className="text-lg" /> Bibliotherapy
            </div>
            <h1 className="text-5xl md:text-7xl font-bold font-display mb-8 tracking-tight">
              Heal Your Mind <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 via-teal-500 to-sky-500">
                Through Words
              </span>
            </h1>
            <p className="text-gray-400 text-xl leading-relaxed mb-10 max-w-xl">
              Immerse yourself in a world of transformative literature and curated quotes. 
              Our collection is hand-picked to inspire hope, resilience, and personal growth.
            </p>
            <div className="flex flex-wrap gap-4">
              <button onClick={() => { setShowAllBooks(true); updateTracking('reading'); }} className="gradient-btn !px-8 !py-4 shadow-xl shadow-sky-500/20">
                <span>Explore Library</span>
              </button>
              <button 
                onClick={() => document.getElementById('quotes-section')?.scrollIntoView({ behavior: 'smooth' })}
                className="px-8 py-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all font-semibold"
              >
                Daily Quotes
              </button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative"
          >
            <div className="absolute inset-0 bg-sky-500/20 rounded-full blur-[80px] animate-pulse" />
            <div className="w-full aspect-square max-w-md mx-auto relative z-10 flex items-center justify-center">
              <Lottie animationData={readingAnimation} loop={true} className="w-full h-full drop-shadow-2xl" />
            </div>
          </motion.div>
        </div>

        <div className="grid lg:grid-cols-12 gap-16">
          {/* Quotes Section */}
          <motion.div
            id="quotes-section"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-4 scroll-mt-24"
          >
            <div className="flex items-center justify-between mb-10">
              <h2 className="text-3xl font-bold">Daily Wisdom</h2>
              <div className="w-12 h-[2px] bg-gradient-to-r from-sky-500 to-transparent" />
            </div>
            <div className="space-y-6">
              {quotes.map((quote, i) => (
                <motion.div 
                  key={i} 
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="glass-card p-8 group hover:bg-gradient-to-br hover:from-white/10 hover:to-transparent transition-all border-l-4 border-l-sky-500/50 hover:border-l-sky-400"
                >
                  <span className="text-4xl text-sky-500/20 font-serif block mb-4 group-hover:text-sky-500/40 transition-colors">"</span>
                  <p className="text-lg text-gray-300 leading-relaxed font-medium italic">
                    {quote}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Books Section */}
          <div className="lg:col-span-8">
            <div className="flex items-center justify-between mb-10">
              <h2 className="text-3xl font-bold">Curated Library</h2>
              <button 
                onClick={() => setShowAllBooks(!showAllBooks)}
                className="text-sky-400 font-semibold hover:text-sky-300 transition-colors flex items-center gap-2"
              >
                {showAllBooks ? 'Show Less' : 'View All'}
              </button>
            </div>
            
            <motion.div 
              layout
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4"
            >
              <AnimatePresence mode="popLayout">
                {displayedBooks.map((book, i) => (
                  <motion.a 
                    layout
                    key={book.title}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.4 }}
                    href={book.link} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    onClick={() => updateTracking('reading')}
                    className="glass-card group p-3 hover:border-sky-500/40 transition-all duration-500 flex flex-col h-full relative overflow-hidden"
                  >
                    <div className="absolute top-0 right-0 w-24 h-24 bg-sky-500/5 rounded-full blur-2xl -mr-12 -mt-12 group-hover:bg-sky-500/10 transition-all" />
                    
                    <div className="relative aspect-video rounded-lg overflow-hidden mb-3 shadow-lg">
                      <img 
                        src={book.cover} 
                        alt={book.title}
                        className="w-full h-full object-cover transition-transform group-hover:scale-110 duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all transform scale-90 group-hover:scale-100 duration-500">
                        <div className="w-12 h-12 rounded-full bg-sky-500 text-white flex items-center justify-center shadow-2xl">
                          <FiDownload className="text-xl" />
                        </div>
                      </div>
                    </div>
 
                    <div className="flex justify-between items-start mb-2">
                      <span className="px-2 py-0.5 rounded-full bg-sky-500/10 text-[10px] uppercase tracking-widest font-bold text-sky-400 border border-sky-500/20">
                        {book.category}
                      </span>
                      <FiBookmark className="text-gray-500 group-hover:text-sky-400 transition-colors" />
                    </div>
                    
                    <h3 className="font-bold text-lg mb-1 group-hover:text-sky-400 text-white transition-colors line-clamp-1">
                      {book.title}
                    </h3>
                    <p className="text-gray-400 text-sm font-medium mb-3">{book.author}</p>
                    
                    <div className="mt-auto pt-3 border-t border-white/5 flex items-center justify-between">
                      <span className="text-[10px] font-semibold text-gray-500 group-hover:text-gray-300 transition-colors">Access Resource</span>
                      <div className="w-6 h-6 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-sky-500/20 transition-all">
                        <FiArrowLeft className="rotate-180 text-gray-400 text-xs group-hover:text-sky-400" />
                      </div>
                    </div>
                  </motion.a>
                ))}
              </AnimatePresence>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
