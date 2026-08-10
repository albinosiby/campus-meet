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
    <section className="section-bright py-20 md:py-28 text-center">
      <div className="mx-auto mb-16 h-px w-full max-w-xs bg-gradient-to-r from-transparent via-gold/45 to-transparent" />

      <motion.div
        ref={ref}
        className="max-w-2xl mx-auto px-6"
        initial={{ opacity: 0, y: 30 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6 }}
      >
        <p className="text-sm tracking-[0.3em] uppercase text-ink-muted font-heading">
          SEE YOU AT
        </p>
        <h2 className="text-2xl md:text-4xl font-heading font-extrabold text-ink tracking-tight mt-3">
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
