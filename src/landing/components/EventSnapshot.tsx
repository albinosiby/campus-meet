'use client';

import { useRef } from 'react';
import { motion, useInView, type Variants } from 'framer-motion';
import { SNAPSHOT_ITEMS } from '@/landing/data/eventData';

export default function EventSnapshot() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-80px' });

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.14,
        delayChildren: 0.25,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 28 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.7,
        ease: [0.16, 1, 0.3, 1],
      },
    },
  };

  return (
    <section id="snapshot" className="relative py-28 md:py-40 overflow-hidden">
      {/* Layered atmosphere */}
      <div className="absolute inset-0 bg-[#0b0d14]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,rgba(200,164,78,0.09)_0%,transparent_55%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,rgba(9,10,15,0.9)_0%,transparent_55%)]" />
      <div
        aria-hidden
        className="absolute inset-0 opacity-[0.035] mix-blend-overlay pointer-events-none"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
        }}
      />

      <div ref={sectionRef} className="relative max-w-6xl mx-auto section-pad">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col items-center text-center mb-16 md:mb-24"
        >
          <span className="text-[10px] tracking-[0.45em] uppercase text-gold/60 font-heading font-medium">
            Event details
          </span>

          <motion.div
            initial={{ scaleX: 0 }}
            animate={isInView ? { scaleX: 1 } : { scaleX: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="mt-6 mb-6 flex items-center gap-3 origin-center"
          >
            <span className="block w-8 h-px bg-gold/40" />
            <span className="block w-1 h-1 rotate-45 bg-gold/70" />
            <span className="block w-8 h-px bg-gold/40" />
          </motion.div>

          <h2 className="text-2xl md:text-4xl lg:text-[2.75rem] font-heading font-extrabold text-cream tracking-[0.08em] uppercase leading-tight">
            The moment is coming
          </h2>

          <p className="mt-5 text-sm md:text-[15px] text-cream-muted/75 font-body max-w-md leading-relaxed">
            Four days. One campus. A gathering that shapes the year ahead.
          </p>
        </motion.div>

        {/* Premium facts band */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
          transition={{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          className="relative"
        >
          {/* Thin gold frame */}
          <div
            aria-hidden
            className="absolute inset-0 border border-gold/15 pointer-events-none"
          />
          <div
            aria-hidden
            className="absolute inset-[5px] border border-gold/[0.06] pointer-events-none"
          />

          {/* Corner accents */}
          <span aria-hidden className="absolute top-0 left-0 w-6 h-6 border-t border-l border-gold/45" />
          <span aria-hidden className="absolute top-0 right-0 w-6 h-6 border-t border-r border-gold/45" />
          <span aria-hidden className="absolute bottom-0 left-0 w-6 h-6 border-b border-l border-gold/45" />
          <span aria-hidden className="absolute bottom-0 right-0 w-6 h-6 border-b border-r border-gold/45" />

          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate={isInView ? 'visible' : 'hidden'}
            className="grid grid-cols-2 md:grid-cols-4 py-10 md:py-14 px-2 md:px-4"
          >
            {SNAPSHOT_ITEMS.map((item, index) => {
              const showDesktopDivider = index < SNAPSHOT_ITEMS.length - 1;
              const showMobileColDivider = index % 2 === 0;
              const showMobileRowDivider = index < 2;
              const indexLabel = String(index + 1).padStart(2, '0');

              return (
                <motion.div
                  key={item.label}
                  variants={itemVariants}
                  className="group relative flex flex-col items-center text-center px-5 md:px-8 py-6 md:py-2"
                >
                  {showDesktopDivider && (
                    <div
                      aria-hidden
                      className="hidden md:block absolute right-0 top-[18%] bottom-[18%] w-px bg-gradient-to-b from-transparent via-gold/20 to-transparent"
                    />
                  )}
                  {showMobileColDivider && (
                    <div
                      aria-hidden
                      className="md:hidden absolute right-0 top-[15%] bottom-[15%] w-px bg-gradient-to-b from-transparent via-gold/15 to-transparent"
                    />
                  )}
                  {showMobileRowDivider && (
                    <div
                      aria-hidden
                      className="md:hidden absolute left-[18%] right-[18%] bottom-0 h-px bg-gradient-to-r from-transparent via-gold/15 to-transparent"
                    />
                  )}

                  <span className="font-heading text-[10px] tracking-[0.35em] text-gold/35 font-medium mb-5 group-hover:text-gold/70 transition-colors duration-500">
                    {indexLabel}
                  </span>

                  <p className="text-[10px] tracking-[0.38em] uppercase text-gold font-heading font-semibold mb-4">
                    {item.label}
                  </p>

                  <p className="text-lg md:text-xl lg:text-[1.35rem] text-cream font-heading font-bold tracking-tight leading-snug">
                    {item.value}
                  </p>

                  {item.detail && (
                    <p className="mt-2.5 text-[11px] md:text-xs tracking-[0.18em] uppercase text-cream-muted/55 font-heading font-medium">
                      {item.detail}
                    </p>
                  )}

                  <div className="mt-6 h-px w-0 group-hover:w-10 bg-gradient-to-r from-transparent via-gold/50 to-transparent transition-all duration-500 ease-out" />
                </motion.div>
              );
            })}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
