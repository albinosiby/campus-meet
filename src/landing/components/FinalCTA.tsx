"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { EVENT_INFO } from "@/landing/data/eventData";

export default function FinalCTA() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section className="py-20 md:py-28 bg-obsidian text-center">
      <div className="gold-rule w-full max-w-xs mx-auto mb-16" />

      <motion.div
        ref={ref}
        className="max-w-2xl mx-auto px-6"
        initial={{ opacity: 0, y: 30 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6 }}
      >
        <p className="text-sm tracking-[0.3em] uppercase text-cream-muted font-heading">
          SEE YOU AT
        </p>
        <h2 className="text-2xl md:text-4xl font-heading font-extrabold text-cream tracking-tight mt-3">
          MALABAR CAMPUS MEET {EVENT_INFO.shortYear}
        </h2>
        <div className="mt-8">
          <Link href={EVENT_INFO.registerUrl} className="btn-primary no-underline">
            REGISTER NOW
            <ArrowRight className="w-4 h-4 btn-arrow" />
          </Link>
        </div>
      </motion.div>
    </section>
  );
}
