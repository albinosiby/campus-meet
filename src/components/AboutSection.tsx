'use client';

import { useRef } from 'react';
import Image from 'next/image';
import { motion, useInView } from 'framer-motion';

export default function AboutSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: '-100px' });

  return (
    <section id="about" className="py-24 md:py-36 bg-obsidian relative overflow-hidden">
      {/* Decorative Number */}
      <div className="absolute top-0 right-0 md:right-12 decorative-number">
        01
      </div>

      <div className="max-w-7xl mx-auto section-pad" ref={containerRef}>
        <div className="grid md:grid-cols-2 gap-12 md:gap-20 items-center">
          
          {/* Left Column (Image) */}
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="aspect-[3/4] md:aspect-[4/5] relative overflow-hidden border border-obsidian-border order-first"
          >
            <Image 
              src="/images/gallery-prayer.jpg" 
              fill
              className="object-cover object-center"
              alt="Campus youth holding hands in prayer, sharing faith and friendship"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
            {/* Gold Accent Bar */}
            <div className="absolute bottom-0 left-0 w-1 h-1/3 bg-gradient-to-t from-gold/40 to-transparent" />
          </motion.div>

          {/* Right Column (Text) */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          >
            <p className="text-xs tracking-[0.3em] uppercase text-gold font-heading mb-6">
              ABOUT THE MEET
            </p>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-heading font-[800] text-cream leading-tight tracking-tight">
              MORE THAN A MEET.<br />
              A MOMENT TO BELONG.
            </h2>
            <div className="gold-rule w-16 my-8" />
            <p className="text-base text-cream-muted leading-relaxed font-body">
              A gathering of campus students from across Malabar to come together in faith, friendship, formation and mission.
            </p>
            <p className="mt-4 text-sm text-cream-muted/70 leading-relaxed">
              An opportunity to connect with other young people, grow in faith and discover the call to live the Gospel on campus.
            </p>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
