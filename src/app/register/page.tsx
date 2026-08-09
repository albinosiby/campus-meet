"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { ArrowLeft, ArrowRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { EVENT_INFO } from "@/data/eventData";

export default function RegisterPage() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  return (
    <div className="min-h-screen bg-obsidian relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none select-none">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gold/[0.03] rounded-full blur-[150px]" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-accent-blue/[0.03] rounded-full blur-[120px]" />
      </div>

      {/* Nav */}
      <nav className="relative z-10 max-w-7xl mx-auto section-pad py-6 flex items-center justify-between">
        <Link
          href="/"
          className="flex items-center gap-3 text-cream-muted hover:text-cream transition-colors no-underline"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="text-xs tracking-[0.2em] uppercase font-heading">
            Back to Home
          </span>
        </Link>
        <div className="text-right">
          <p className="text-sm font-heading font-bold text-cream">
            JESUS YOUTH
          </p>
          <p className="text-[10px] tracking-[0.2em] text-gold uppercase">
            MCM {EVENT_INFO.shortYear}
          </p>
        </div>
      </nav>

      {/* Content */}
      <div className="relative z-10 max-w-2xl mx-auto section-pad py-12 md:py-20">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          {/* Header */}
          <p className="text-xs tracking-[0.3em] uppercase text-gold font-heading mb-4">
            REGISTRATION
          </p>
          <h1 className="text-3xl md:text-5xl font-heading font-extrabold text-cream tracking-tight">
            JOIN THE
            <br />
            GATHERING
          </h1>
          <p className="text-sm text-cream-muted mt-4 leading-relaxed max-w-md">
            Fill in your details to register for {EVENT_INFO.name}{" "}
            {EVENT_INFO.year}. Spots are limited — secure yours today.
          </p>
          <div className="w-16 h-px bg-gold/40 mt-6 mb-10" />

          {/* Event Info Card */}
          <div className="glass-card rounded-sm p-6 mb-10">
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 relative rounded-sm overflow-hidden flex-shrink-0">
                <Image
                  src="/images/hero-bg.jpg"
                  alt="Event"
                  fill
                  className="object-cover"
                  sizes="64px"
                />
              </div>
              <div>
                <p className="text-sm font-heading font-semibold text-cream">
                  {EVENT_INFO.name} {EVENT_INFO.shortYear}
                </p>
                <p className="text-xs text-cream-muted mt-1">
                  {EVENT_INFO.dates}
                </p>
                <p className="text-xs text-cream-muted">
                  {EVENT_INFO.venue}, {EVENT_INFO.venueLocation}
                </p>
              </div>
            </div>
          </div>

          {/* Registration Form */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              /* Firebase integration placeholder */
            }}
            className="space-y-6"
          >
            {/* Personal Details */}
            <fieldset className="space-y-4">
              <legend className="text-xs tracking-[0.2em] uppercase text-gold/60 font-heading mb-4">
                Personal Details
              </legend>

              <div>
                <label
                  htmlFor="fullName"
                  className="block text-xs text-cream-muted mb-2 font-heading"
                >
                  Full Name *
                </label>
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  required
                  className="w-full bg-obsidian-card border border-obsidian-border text-cream text-sm px-4 py-3 rounded-sm focus:border-gold/40 focus:outline-none transition-colors placeholder:text-cream-muted/40 font-body"
                  placeholder="Enter your full name"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="email"
                    className="block text-xs text-cream-muted mb-2 font-heading"
                  >
                    Email *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    className="w-full bg-obsidian-card border border-obsidian-border text-cream text-sm px-4 py-3 rounded-sm focus:border-gold/40 focus:outline-none transition-colors placeholder:text-cream-muted/40 font-body"
                    placeholder="you@email.com"
                  />
                </div>
                <div>
                  <label
                    htmlFor="phone"
                    className="block text-xs text-cream-muted mb-2 font-heading"
                  >
                    Phone *
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    required
                    className="w-full bg-obsidian-card border border-obsidian-border text-cream text-sm px-4 py-3 rounded-sm focus:border-gold/40 focus:outline-none transition-colors placeholder:text-cream-muted/40 font-body"
                    placeholder="+91 XXXXX XXXXX"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="gender"
                  className="block text-xs text-cream-muted mb-2 font-heading"
                >
                  Gender *
                </label>
                <select
                  id="gender"
                  name="gender"
                  required
                  className="w-full bg-obsidian-card border border-obsidian-border text-cream text-sm px-4 py-3 rounded-sm focus:border-gold/40 focus:outline-none transition-colors font-body appearance-none"
                >
                  <option value="">Select</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
              </div>
            </fieldset>

            {/* College Info */}
            <fieldset className="space-y-4 pt-4 border-t border-obsidian-border">
              <legend className="text-xs tracking-[0.2em] uppercase text-gold/60 font-heading mb-4">
                College / Campus Info
              </legend>

              <div>
                <label
                  htmlFor="college"
                  className="block text-xs text-cream-muted mb-2 font-heading"
                >
                  College / University *
                </label>
                <input
                  type="text"
                  id="college"
                  name="college"
                  required
                  className="w-full bg-obsidian-card border border-obsidian-border text-cream text-sm px-4 py-3 rounded-sm focus:border-gold/40 focus:outline-none transition-colors placeholder:text-cream-muted/40 font-body"
                  placeholder="Your college name"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="course"
                    className="block text-xs text-cream-muted mb-2 font-heading"
                  >
                    Course / Program *
                  </label>
                  <input
                    type="text"
                    id="course"
                    name="course"
                    required
                    className="w-full bg-obsidian-card border border-obsidian-border text-cream text-sm px-4 py-3 rounded-sm focus:border-gold/40 focus:outline-none transition-colors placeholder:text-cream-muted/40 font-body"
                    placeholder="e.g. B.Tech, BA, BSc"
                  />
                </div>
                <div>
                  <label
                    htmlFor="year"
                    className="block text-xs text-cream-muted mb-2 font-heading"
                  >
                    Year of Study *
                  </label>
                  <select
                    id="year"
                    name="year"
                    required
                    className="w-full bg-obsidian-card border border-obsidian-border text-cream text-sm px-4 py-3 rounded-sm focus:border-gold/40 focus:outline-none transition-colors font-body appearance-none"
                  >
                    <option value="">Select</option>
                    <option value="1">1st Year</option>
                    <option value="2">2nd Year</option>
                    <option value="3">3rd Year</option>
                    <option value="4">4th Year</option>
                    <option value="5">5th Year</option>
                    <option value="pg">PG</option>
                  </select>
                </div>
              </div>

              <div>
                <label
                  htmlFor="diocese"
                  className="block text-xs text-cream-muted mb-2 font-heading"
                >
                  Diocese / Parish
                </label>
                <input
                  type="text"
                  id="diocese"
                  name="diocese"
                  className="w-full bg-obsidian-card border border-obsidian-border text-cream text-sm px-4 py-3 rounded-sm focus:border-gold/40 focus:outline-none transition-colors placeholder:text-cream-muted/40 font-body"
                  placeholder="Optional"
                />
              </div>
            </fieldset>

            {/* Preferences */}
            <fieldset className="space-y-4 pt-4 border-t border-obsidian-border">
              <legend className="text-xs tracking-[0.2em] uppercase text-gold/60 font-heading mb-4">
                Preferences
              </legend>

              <div>
                <label
                  htmlFor="dietary"
                  className="block text-xs text-cream-muted mb-2 font-heading"
                >
                  Dietary Preferences
                </label>
                <select
                  id="dietary"
                  name="dietary"
                  className="w-full bg-obsidian-card border border-obsidian-border text-cream text-sm px-4 py-3 rounded-sm focus:border-gold/40 focus:outline-none transition-colors font-body appearance-none"
                >
                  <option value="none">No preference</option>
                  <option value="veg">Vegetarian</option>
                  <option value="nonveg">Non-Vegetarian</option>
                </select>
              </div>
            </fieldset>

            {/* Submit */}
            <div className="pt-6">
              <button type="submit" className="btn-primary w-full justify-center">
                SUBMIT REGISTRATION
                <ArrowRight className="w-4 h-4 btn-arrow" />
              </button>
              <p className="text-[11px] text-cream-muted/40 text-center mt-4 leading-relaxed">
                By registering, you agree to receive event-related communications.
                Your details will be handled securely.
              </p>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
