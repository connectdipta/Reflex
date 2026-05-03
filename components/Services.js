'use client';
import { motion } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import Swal from 'sweetalert2';
import { FiArrowRight, FiActivity, FiStar } from 'react-icons/fi';

// Dynamic import for Lottie to avoid SSR issues
const Lottie = dynamic(() => import('lottie-react'), { ssr: false });

// Import animations
import audioAnim from '@/public/listening music.json';
import psychAnim from '@/public/Psychiatrist.json';
import yogaAnim from '@/public/Yogasan.json';
import laughAnim from '@/public/laughing.json';
import readAnim from '@/public/Reading.json';
import trackAnim from '@/public/Tracking.json';

const services = [
  {
    animation: audioAnim,
    title: 'Audio Therapy',
    category: 'Relaxation',
    description: 'Immerse in curated soundscapes and guided audio sessions designed to calm your mind and uplift your mood.',
    color: 'from-violet-500 to-purple-600',
    glow: 'shadow-violet-500/20',
    link: '/services/audio',
  },
  {
    animation: psychAnim,
    title: 'Psychiatrist Consult',
    category: 'Medical',
    description: 'Connect with certified psychiatrists for personalized counseling and professional mental health guidance.',
    color: 'from-blue-500 to-cyan-600',
    glow: 'shadow-blue-500/20',
    link: '/booking',
  },
  {
    animation: yogaAnim,
    title: 'Yoga Therapy',
    category: 'Fitness',
    description: 'Practice mindful yoga sessions tailored to reduce anxiety, improve focus, and restore mental balance.',
    color: 'from-teal-500 to-emerald-600',
    glow: 'shadow-teal-500/20',
    link: '/services/yoga',
  },
  {
    animation: laughAnim,
    title: 'Laughing Therapy',
    category: 'Joy',
    description: 'Engage in laughter exercises that release endorphins, reduce stress hormones, and boost your immune system.',
    color: 'from-amber-500 to-orange-600',
    glow: 'shadow-amber-500/20',
    link: '/services/laughing',
  },
  {
    animation: readAnim,
    title: 'Reading Therapy',
    category: 'Growth',
    description: 'Discover curated motivational books and quotes that reshape your mindset and inspire positive thinking.',
    color: 'from-rose-500 to-pink-600',
    glow: 'shadow-rose-500/20',
    link: '/services/reading',
  },
  {
    animation: trackAnim,
    title: 'Wellness Tracking',
    category: 'Analytics',
    description: 'Monitor your mental health journey with intuitive mood tracking, journaling, and progress analytics.',
    color: 'from-sky-500 to-indigo-600',
    glow: 'shadow-sky-500/20',
    link: '/tracking',
  },
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.15 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 40, scale: 0.95 },
  visible: { 
    opacity: 1, 
    y: 0, 
    scale: 1,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } 
  },
};

export default function Services() {
  const { isLoggedIn } = useAuth();
  const router = useRouter();

  const handleExplore = (link) => {
    if (!isLoggedIn) {
      Swal.fire({
        icon: 'warning',
        title: 'Login Required',
        text: 'Please login to access our services.',
        confirmButtonText: 'Login Now',
        showCancelButton: true,
        cancelButtonText: 'Cancel',
        background: '#0d1528',
        color: '#fff',
        confirmButtonColor: '#00f2fe',
      }).then((result) => {
        if (result.isConfirmed) {
          router.push('/login');
        }
      });
      return;
    }
    router.push(link);
  };

  return (
    <section id="services" className="section-padding relative overflow-hidden bg-dark-900 bg-mesh">
      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
           style={{ backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

      {/* Dynamic Background Elements */}
      <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-primary-500/10 blur-[120px] rounded-full animate-pulse transform-gpu will-change-[opacity,transform]" />
      <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-teal-500/10 blur-[120px] rounded-full animate-pulse transform-gpu will-change-[opacity,transform]" style={{ animationDelay: '2s' }} />

      <div className="max-w-7xl mx-auto relative px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <motion.span 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="text-primary-400 font-bold text-sm uppercase tracking-[0.3em] mb-4 block"
          >
            Premium Solutions
          </motion.span>
          <h2 className="text-4xl md:text-6xl font-bold font-display mb-6">
            Our <span className="text-gradient">Services</span>
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto leading-relaxed">
            Science-backed mental wellness programs designed for modern life. 
            Experience holistic healing with a digital touch.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {services.map((service, i) => {
            return (
              <motion.div
                key={i}
                variants={cardVariants}
                whileHover={{ y: -12 }}
                className="group relative will-change-transform transform-gpu"
                onClick={() => handleExplore(service.link)}
              >
                {/* Glow Effect */}
                <div className={`absolute -inset-0.5 bg-gradient-to-br ${service.color} rounded-[2.5rem] opacity-0 group-hover:opacity-20 transition-opacity duration-500 blur-xl transform-gpu`} />
                
                <div className="relative h-full glass-card p-8 md:p-10 border-white/5 bg-white/[0.02] backdrop-blur-2xl rounded-[2.5rem] flex flex-col items-start overflow-hidden group-hover:border-white/10 transition-all duration-500 transform-gpu">
                  {/* Category Badge */}
                  <div className="flex justify-between w-full items-center mb-8">
                    <span className="px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-[10px] font-bold uppercase tracking-widest text-gray-400 group-hover:text-primary-400 transition-colors">
                      {service.category}
                    </span>
                    <FiStar className="text-gray-600 group-hover:text-yellow-500 transition-colors" />
                  </div>

                  {/* Lottie Container */}
                  <div className="relative w-full aspect-square max-w-[180px] mx-auto mb-8">
                    <div className={`absolute inset-0 bg-gradient-to-br ${service.color} opacity-0 group-hover:opacity-10 blur-3xl rounded-full transition-opacity duration-500`} />
                    <div className="relative w-full h-full transform group-hover:scale-110 group-hover:-rotate-3 transition-transform duration-500">
                      <Lottie 
                        animationData={service.animation} 
                        loop={true} 
                        className="w-full h-full object-contain"
                      />
                    </div>
                  </div>

                  {/* Text Content */}
                  <h3 className="text-2xl font-bold mb-4 group-hover:text-white transition-colors">
                    {service.title}
                  </h3>
                  <p className="text-gray-400 text-sm leading-relaxed mb-8 flex-grow">
                    {service.description}
                  </p>

                  {/* Action Link */}
                  <div className="flex items-center gap-3 text-sm font-bold text-primary-400 group-hover:text-white transition-all duration-300">
                    <span className="relative">
                      Explore Service
                      <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary-400 group-hover:w-full transition-all duration-300" />
                    </span>
                    <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-primary-500 group-hover:text-white transition-all duration-300">
                      <FiArrowRight />
                    </div>
                  </div>

                  {/* Subtle Background Pattern */}
                  <div className="absolute -bottom-10 -right-10 opacity-[0.02] group-hover:opacity-[0.05] transition-opacity pointer-events-none">
                    <FiActivity size={200} />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}

