'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { EVENT_INFO } from '@/data/eventData';

export default function RegistrationCTA() {
  return (
    <section className="py-28 md:py-40 bg-obsidian-light relative overflow-hidden">
      {/* Decorative background */}
      <div className="absolute font-heading font-800 text-[20rem] md:text-[30rem] text-cream/[0.02] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none select-none leading-none">
        26
      </div>
      
      {/* Subtle gold glow */}
      <div className="absolute w-96 h-96 rounded-full bg-gold/5 blur-[100px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />

      <div className="relative z-10 text-center max-w-2xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.95 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="flex flex-col items-center"
        >
          <span className="text-xs tracking-[0.3em] uppercase text-gold font-heading mb-6 block">
            YOUR NEXT STEP
          </span>
          <h2 className="text-3xl md:text-5xl lg:text-6xl font-heading font-800 text-cream tracking-tight">
            READY TO BE PART OF IT?
          </h2>
          <p className="text-base md:text-lg text-cream-muted mt-6 font-body">
            Your campus. Your community. Your moment.
          </p>
          <div className="mt-10">
            <Link 
              href={EVENT_INFO.registerUrl}
              className="btn-primary px-10 py-4 text-sm inline-flex items-center gap-2"
            >
              REGISTER NOW
              <ArrowRight className="w-4 h-4 btn-arrow" />
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
