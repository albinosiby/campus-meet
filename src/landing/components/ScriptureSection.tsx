'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { SCRIPTURE_QUOTES } from '@/landing/data/eventData';

export default function ScriptureSection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const quote = SCRIPTURE_QUOTES.gather;

  return (
    <section className="section-bright relative py-28 md:py-36 overflow-hidden">
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-gold/35 to-transparent" />
      <div className="absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-gold/35 to-transparent" />

      <div ref={ref} className="relative max-w-3xl mx-auto section-pad text-center">
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
          transition={{ duration: 0.6 }}
          className="text-[10px] md:text-xs tracking-[0.4em] uppercase text-gold-dim font-heading font-medium mb-10"
        >
          Word of God
        </motion.p>

        <motion.div
          initial={{ scaleX: 0 }}
          animate={isInView ? { scaleX: 1 } : { scaleX: 0 }}
          transition={{ duration: 0.7, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          className="flex items-center justify-center gap-3 mb-10 origin-center"
        >
          <span className="block w-10 h-px bg-gold/45" />
          <span className="block w-1.5 h-1.5 rotate-45 border border-gold/60" />
          <span className="block w-10 h-px bg-gold/45" />
        </motion.div>

        <motion.blockquote
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
        >
          <p className="font-heading text-2xl md:text-3xl lg:text-4xl text-ink font-medium leading-snug tracking-tight">
            <span className="text-gold-dim/50 mr-1">&ldquo;</span>
            {quote.text}
            <span className="text-gold-dim/50 ml-1">&rdquo;</span>
          </p>
        </motion.blockquote>

        <motion.cite
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.6, delay: 0.45 }}
          className="mt-10 block not-italic text-xs md:text-sm tracking-[0.28em] uppercase text-gold-dim font-heading font-semibold"
        >
          — {quote.reference}
        </motion.cite>
      </div>
    </section>
  );
}
