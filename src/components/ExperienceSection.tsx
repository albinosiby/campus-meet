'use client';

import { useRef } from 'react';
import Image from 'next/image';
import { motion, useInView } from 'framer-motion';
import { EXPERIENCES } from '@/data/eventData';

export default function ExperienceSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.21, 0.47, 0.32, 0.98] as [number, number, number, number],
      },
    },
  };

  const getCardClasses = (index: number) => {
    switch (index) {
      case 0:
        return 'md:col-span-1 aspect-[4/5] md:aspect-[3/4]';
      case 1:
        return 'md:col-span-1 aspect-[4/3]';
      case 2:
        return 'md:col-span-1 aspect-[4/3]';
      case 3:
        return 'md:col-span-1 aspect-[4/5] md:aspect-[3/4]';
      default:
        return 'md:col-span-1 aspect-[4/3]';
    }
  };

  return (
    <section id="experience" className="py-24 md:py-36 bg-obsidian">
      <div className="max-w-7xl mx-auto section-pad">
        <div className="mb-16">
          <p className="text-xs tracking-[0.3em] uppercase text-gold font-heading mb-4">
            EXPERIENCE
          </p>
          <h2 className="text-3xl md:text-5xl font-heading font-800 text-cream tracking-tight">
            WHAT AWAITS YOU
          </h2>
          <p className="text-sm text-cream-muted mt-3 font-body">
            One gathering. Four experiences. One community.
          </p>
          <div className="w-16 h-px bg-gold/40 mt-6 mb-16" />
        </div>

        <motion.div
          ref={ref}
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5"
        >
          {EXPERIENCES.map((exp, index) => {
            const num = (index + 1).toString().padStart(2, '0');
            return (
              <motion.div
                key={exp.number}
                variants={itemVariants}
                className={`exp-card relative w-full rounded-none overflow-hidden ${getCardClasses(index)}`}
              >
                <Image
                  src={exp.image}
                  alt={exp.title}
                  fill
                  className="object-cover exp-card-img"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
                
                <div className="absolute bottom-0 left-0 right-0 z-[2] p-6 md:p-8">
                  <div className="text-5xl md:text-6xl font-heading font-800 text-cream/10 leading-none">
                    {num}
                  </div>
                  <h3 className="text-lg md:text-xl font-heading font-700 text-cream tracking-wide uppercase mt-2">
                    {exp.title}
                  </h3>
                  <p className="text-sm text-cream-muted/80 mt-2 max-w-xs leading-relaxed">
                    {exp.description}
                  </p>
                  <div className="w-8 h-px bg-gold/40 mt-4" />
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
