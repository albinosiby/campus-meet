'use client';

import { useRef } from 'react';
import { motion, useInView, type Variants } from 'framer-motion';
import { ExternalLink, MapPin } from 'lucide-react';
import { EVENT_INFO, SNAPSHOT_ITEMS } from '@/landing/data/eventData';

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
    <section
      id="snapshot"
      className="section-bright relative py-28 md:py-40 overflow-hidden"
    >
      <div
        aria-hidden
        className="absolute inset-0 opacity-[0.04] mix-blend-multiply pointer-events-none"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
        }}
      />

      <div ref={sectionRef} className="relative max-w-6xl mx-auto section-pad">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col items-center text-center mb-16 md:mb-24"
        >
          <span className="text-[10px] tracking-[0.45em] uppercase text-gold-dim font-heading font-medium">
            Event details
          </span>

          <motion.div
            initial={{ scaleX: 0 }}
            animate={isInView ? { scaleX: 1 } : { scaleX: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="mt-6 mb-6 flex items-center gap-3 origin-center"
          >
            <span className="block w-8 h-px bg-gold/50" />
            <span className="block w-1 h-1 rotate-45 bg-gold" />
            <span className="block w-8 h-px bg-gold/50" />
          </motion.div>

          <h2 className="text-2xl md:text-4xl lg:text-[2.75rem] font-heading font-extrabold text-ink tracking-[0.08em] uppercase leading-tight">
            The moment is coming
          </h2>

          <p className="mt-5 text-sm md:text-[15px] text-ink-muted font-body max-w-md leading-relaxed">
            Four days. One campus. A gathering that shapes the year ahead.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
          transition={{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          className="relative bg-white/55 backdrop-blur-sm"
        >
          <div
            aria-hidden
            className="absolute inset-0 border border-gold/25 pointer-events-none"
          />
          <div
            aria-hidden
            className="absolute inset-[5px] border border-gold/10 pointer-events-none"
          />

          <span aria-hidden className="absolute top-0 left-0 w-6 h-6 border-t border-l border-gold/55" />
          <span aria-hidden className="absolute top-0 right-0 w-6 h-6 border-t border-r border-gold/55" />
          <span aria-hidden className="absolute bottom-0 left-0 w-6 h-6 border-b border-l border-gold/55" />
          <span aria-hidden className="absolute bottom-0 right-0 w-6 h-6 border-b border-r border-gold/55" />

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
              const isVenue = item.label === 'VENUE';

              return (
                <motion.div
                  key={item.label}
                  variants={itemVariants}
                  className="group relative flex flex-col items-center text-center px-5 md:px-8 py-6 md:py-2"
                >
                  {showDesktopDivider && (
                    <div
                      aria-hidden
                      className="hidden md:block absolute right-0 top-[18%] bottom-[18%] w-px bg-gradient-to-b from-transparent via-gold/30 to-transparent"
                    />
                  )}
                  {showMobileColDivider && (
                    <div
                      aria-hidden
                      className="md:hidden absolute right-0 top-[15%] bottom-[15%] w-px bg-gradient-to-b from-transparent via-gold/25 to-transparent"
                    />
                  )}
                  {showMobileRowDivider && (
                    <div
                      aria-hidden
                      className="md:hidden absolute left-[18%] right-[18%] bottom-0 h-px bg-gradient-to-r from-transparent via-gold/25 to-transparent"
                    />
                  )}

                  <p className="text-[10px] tracking-[0.38em] uppercase text-gold-dim font-heading font-semibold mb-4">
                    {item.label}
                  </p>

                  <p className="text-lg md:text-xl lg:text-[1.35rem] text-ink font-heading font-bold tracking-tight leading-snug">
                    {item.value}
                  </p>

                  {item.detail && (
                    <p className="mt-2.5 text-[11px] md:text-xs tracking-[0.18em] uppercase text-ink-muted font-heading font-medium">
                      {item.detail}
                    </p>
                  )}

                  {isVenue ? (
                    <a
                      href={EVENT_INFO.venueMapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-4 inline-flex items-center gap-1.5 text-[10px] font-heading font-semibold uppercase tracking-[0.2em] text-gold-dim transition-colors hover:text-gold"
                    >
                      <MapPin className="h-3 w-3" />
                      Open in Maps
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  ) : (
                    <div className="mt-6 h-px w-0 group-hover:w-10 bg-gradient-to-r from-transparent via-gold/60 to-transparent transition-all duration-500 ease-out" />
                  )}
                </motion.div>
              );
            })}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
