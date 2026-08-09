'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { GALLERY_IMAGES } from '@/data/eventData';

export default function GallerySection() {
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
    hidden: { opacity: 0, scale: 0.95 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: { duration: 0.6, ease: "easeOut" as const }
    },
  };

  return (
    <section id="gallery" className="py-24 md:py-36 bg-obsidian">
      <div className="max-w-7xl mx-auto section-pad">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
        >
          <div className="text-xs tracking-[0.3em] uppercase text-gold font-heading mb-4">
            GALLERY
          </div>
          <h2 className="text-3xl md:text-5xl font-heading font-[800] text-cream tracking-tight">
            ONE COMMUNITY.<br />
            MANY STORIES.
          </h2>
          <div className="w-16 h-px bg-gold/40 mt-6 mb-16" />
        </motion.div>

        <motion.div 
          className="grid grid-cols-2 md:grid-cols-3 auto-rows-[180px] md:auto-rows-[250px] gap-2 md:gap-3"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
        >
          {GALLERY_IMAGES.map((img, index) => {
            let spanClasses = '';
            
            // Desktop: grid-cols-3 auto-rows-[250px]
            // Item 0: col-span-2 row-span-2
            // Item 1: col-span-1 row-span-1
            // Item 2: col-span-1 row-span-2
            // Item 3: col-span-1 row-span-1
            // Item 4: col-span-2 row-span-1
            // Item 5: col-span-1 row-span-1
            
            // Mobile: grid-cols-2 auto-rows-[180px]
            // First item col-span-2, rest col-span-1
            
            if (index === 0) {
              spanClasses = 'col-span-2 row-span-1 md:row-span-2';
            } else if (index === 1) {
              spanClasses = 'col-span-1 row-span-1';
            } else if (index === 2) {
              spanClasses = 'col-span-1 row-span-1 md:row-span-2';
            } else if (index === 3) {
              spanClasses = 'col-span-1 row-span-1';
            } else if (index === 4) {
              spanClasses = 'col-span-1 md:col-span-2 row-span-1';
            } else if (index === 5) {
              spanClasses = 'col-span-1 row-span-1';
            } else {
              spanClasses = 'col-span-1 row-span-1';
            }

            return (
              <motion.div
                key={index}
                variants={itemVariants}
                className={`gallery-item group overflow-hidden relative ${spanClasses}`}
              >
                <Image
                  src={img.src}
                  alt={img.alt}
                  fill
                  style={{ objectFit: 'cover' }}
                  sizes="(max-width: 768px) 50vw, 33vw"
                  loading="lazy"
                  className="transition-transform duration-700 ease-out group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-obsidian/0 group-hover:bg-obsidian/20 transition-all duration-300 z-[1]" />
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
