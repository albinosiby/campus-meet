'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { AbhiNahiLogo } from '@/landing/components/AbhiNahiLogo';
import { EVENT_INFO } from '@/landing/data/eventData';

export default function ThemeSection() {
  return (
    <section className="py-0 w-full relative min-h-[70vh] md:min-h-[80vh] flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/theme-bg.jpg"
          alt="Dramatic youth gathering atmosphere"
          fill
          style={{ objectFit: 'cover' }}
          quality={80}
        />
      </div>

      <div className="absolute inset-0 bg-obsidian/55 z-[1]" />
      <div className="absolute inset-0 z-[2] bg-gradient-to-t from-obsidian via-obsidian/50 to-obsidian/20" />
      <div className="absolute inset-0 z-[2] bg-[radial-gradient(circle_at_center,rgba(200,164,78,0.06)_0%,transparent_70%)]" />

      <div className="z-[3] relative text-center max-w-4xl mx-auto px-6 py-16">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="flex flex-col items-center"
        >
          <AbhiNahiLogo
            className="mb-4 w-[min(78vw,300px)] h-auto text-cream drop-shadow-[0_0_32px_rgba(200,164,78,0.28)] md:w-[340px]"
          />

          <h2 className="text-4xl md:text-6xl lg:text-7xl font-heading font-[800] text-cream tracking-tight italic">
            Gather. Grow. Go.
          </h2>

          <div className="w-16 h-px bg-gold/40 mx-auto mt-8 mb-6" />

          <p className="text-xs tracking-[0.3em] uppercase text-cream-muted font-heading">
            {EVENT_INFO.name.toUpperCase()} {EVENT_INFO.year}
          </p>
        </motion.div>
      </div>
    </section>
  );
}
