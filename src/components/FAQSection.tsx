"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { Plus, Minus } from "lucide-react";
import { FAQ_ITEMS } from "@/data/eventData";

export default function FAQSection() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const toggle = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <section id="faq" className="py-24 md:py-36 bg-obsidian">
      <div className="max-w-3xl mx-auto section-pad">
        {/* Header */}
        <motion.div
          ref={ref}
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <p className="text-xs tracking-[0.3em] uppercase text-gold font-heading mb-4">
            FAQ
          </p>
          <h2 className="text-3xl md:text-4xl font-heading font-extrabold text-cream tracking-tight">
            QUICK QUESTIONS
          </h2>
          <div className="w-16 h-px bg-gold/40 mx-auto mt-6" />
        </motion.div>

        {/* Accordion */}
        <div>
          {FAQ_ITEMS.map((item, index) => (
            <motion.div
              key={index}
              className="faq-item"
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.4, delay: 0.1 * index }}
            >
              <button
                onClick={() => toggle(index)}
                className="w-full flex justify-between items-center py-6 px-0 text-left cursor-pointer bg-transparent border-none"
                aria-expanded={activeIndex === index}
                aria-controls={`faq-answer-${index}`}
              >
                <span className="text-sm md:text-base font-heading font-semibold text-cream pr-4">
                  {item.question}
                </span>
                <span className="text-gold/60 flex-shrink-0">
                  {activeIndex === index ? (
                    <Minus className="w-4 h-4" />
                  ) : (
                    <Plus className="w-4 h-4" />
                  )}
                </span>
              </button>

              <AnimatePresence initial={false}>
                {activeIndex === index && (
                  <motion.div
                    id={`faq-answer-${index}`}
                    role="region"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="overflow-hidden"
                  >
                    <p className="text-sm text-cream-muted leading-relaxed pb-6">
                      {item.answer}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
