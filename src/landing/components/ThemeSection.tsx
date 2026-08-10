'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { EVENT_INFO } from '@/landing/data/eventData';

export default function ThemeSection() {
  return (
    <section className="py-0 w-full relative min-h-[70vh] md:min-h-[80vh] flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/theme-bg.jpg"
          alt="Dramatic youth gathering atmosphere"
          fill
          style={{ objectFit: 'cover' }}
          quality={80}
        />
      </div>

      {/* Dark overlay */}
      <div className="absolute inset-0 bg-obsidian/75 z-[1]" />

      {/* Second overlay: radial gradient */}
      <div className="absolute inset-0 z-[2] bg-[radial-gradient(circle_at_center,rgba(200,164,78,0.05)_0%,transparent_70%)]" />

      {/* Content */}
      <div className="z-[3] relative text-center max-w-4xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="flex flex-col items-center"
        >
          {/* Large decorative quotation marks */}
          <div className="text-8xl md:text-9xl text-gold/10 font-serif leading-none mb-[-2rem] md:mb-[-3rem]">
            &ldquo;
          </div>
          
          {/* Main quote */}
          <h2 className="text-4xl md:text-6xl lg:text-7xl font-heading font-[800] text-cream tracking-tight italic">
            Gather. Grow. Go.
          </h2>
          
          {/* Secondary tagline */}
          <p className="text-lg md:text-xl text-gold font-heading tracking-widest uppercase mt-6">
            Abhi Nahi Toh Kab?
          </p>
          
          {/* Gold rule */}
          <div className="w-16 h-px bg-gold/40 mx-auto mt-8 mb-6" />
          
          {/* Attribution */}
          <p className="text-xs tracking-[0.3em] uppercase text-cream-muted font-heading">
            {EVENT_INFO?.name ? EVENT_INFO.name.toUpperCase() : 'JESUS YOUTH MALABAR CAMPUS MEET 2026'}
          </p>
        </motion.div>
      </div>
    </section>
  );
}
