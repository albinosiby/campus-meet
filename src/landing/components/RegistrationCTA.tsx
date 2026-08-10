"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { EVENT_INFO, EVENT_PAYMENT } from "@/landing/data/eventData";

export default function RegistrationCTA() {
  return (
    <section className="relative overflow-hidden bg-obsidian-light py-28 md:py-40">
      <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 select-none font-heading text-[20rem] leading-none text-cream/[0.02] md:text-[30rem]">
        26
      </div>
      <div className="absolute top-1/2 left-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gold/5 blur-[100px]" />

      <div className="relative z-10 mx-auto max-w-2xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.95 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="flex flex-col items-center text-center"
        >
          <span className="mb-6 block text-xs font-heading uppercase tracking-[0.3em] text-gold">
            YOUR NEXT STEP
          </span>
          <h2 className="font-heading text-3xl tracking-tight text-cream md:text-5xl lg:text-6xl font-800">
            READY TO BE PART OF IT?
          </h2>
          <p className="mt-6 font-body text-base text-cream-muted md:text-lg">
            Your campus. Your community. Your moment.
          </p>
          <p className="mt-3 text-sm text-cream-muted/80">
            Registration fee{" "}
            <span className="font-heading font-semibold text-gold">
              {EVENT_PAYMENT.currencySymbol}
              {EVENT_PAYMENT.amount}
            </span>
          </p>

          <div className="mt-10">
            <Link
              href={EVENT_INFO.registerUrl}
              className="btn-primary inline-flex items-center gap-2 px-10 py-4 text-sm"
            >
              REGISTER NOW
              <ArrowRight className="btn-arrow h-4 w-4" />
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
