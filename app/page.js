'use client';
import AOSInit from '@/components/AOSInit';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import About from '@/components/About';
import Services from '@/components/Services';
import Psychiatrists from '@/components/Psychiatrists';
import Quotes from '@/components/Quotes';
import Testimonials from '@/components/Testimonials';
import FAQ from '@/components/FAQ';
import Contact from '@/components/Contact';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <>
      <AOSInit />
      <Navbar />
      <main>
        <Hero />
        <About />
        <Services />
        <Psychiatrists />
        <Quotes />
        <Testimonials />
        <FAQ />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
