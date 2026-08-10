'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, ChevronDown } from 'lucide-react';
import { EVENT_INFO } from '@/landing/data/eventData';

export default function Hero() {
  return (
    <section className="relative min-h-screen w-full flex flex-col justify-end overflow-hidden pt-20 md:pt-24 pb-[12vh] md:pb-[16vh]">
      {/* Background Image */}
      <Image
        src="/images/hero-bg.jpg"
        alt="Youth worship gathering"
        fill
        className="object-cover"
        priority
        quality={85}
      />

      {/* Overlays */}
      <div className="hero-overlay absolute inset-0 z-[1]"></div>
      <div className="hero-overlay-radial absolute inset-0 z-[2]"></div>

      {/* Content — top padding clears the fixed navbar */}
      <div className="relative z-[3] w-full max-w-7xl mx-auto px-5 md:px-8">
        <h1 className="flex flex-col">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-heading font-extrabold text-cream tracking-tight leading-[0.9]"
          >
            MALABAR
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-heading font-extrabold text-cream tracking-tight leading-[0.9]"
          >
            CAMPUS MEET
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
            className="text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-heading font-extrabold gold-gradient-text tracking-tight leading-[0.9]"
          >
            &apos;26
          </motion.div>
        </h1>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.9 }}
          className="text-sm md:text-base tracking-[0.4em] uppercase text-gold/80 font-heading font-medium mt-6"
        >
          GATHER. GROW. GO.
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.1 }}
          className="text-sm md:text-base text-cream-muted max-w-md mt-4 leading-relaxed font-body"
        >
          {EVENT_INFO.description}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.3 }}
          className="flex flex-wrap gap-4 mt-8"
        >
          <Link href={EVENT_INFO.registerUrl} className="btn-primary flex items-center justify-center">
            REGISTER NOW
            <ArrowRight className="btn-arrow w-5 h-5 ml-2" />
          </Link>
          <a href="#snapshot" className="btn-outline flex items-center gap-2 justify-center">
            EXPLORE THE MEET
            <ChevronDown className="w-5 h-5" />
          </a>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-[3] flex flex-col items-center animate-scroll-bounce">
        <div className="w-px h-8 bg-cream/20"></div>
        <div className="w-2 h-2 rounded-full bg-gold/60 mt-2"></div>
      </div>
    </section>
  );
}
