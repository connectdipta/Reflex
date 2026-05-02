'use client';
import dynamic from 'next/dynamic';
import logoData from '@/public/logo.json';

const Lottie = dynamic(() => import('lottie-react'), { ssr: false });

export default function Logo({ className = "w-10 h-10" }) {
  return (
    <div className={`${className} rounded-xl overflow-hidden shadow-glow transition-shadow duration-300`}>
      <Lottie 
        animationData={logoData} 
        loop={true} 
        className="w-full h-full"
      />
    </div>
  );
}
