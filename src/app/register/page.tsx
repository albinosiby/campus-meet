"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { ArrowLeft, ArrowRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { addRegistration } from "@/admin/storage";
import type {
  Dietary,
  Gender,
  YearOfStudy,
  Zone,
} from "@/admin/types";
import { FeeNotice } from "@/landing/components/FeeNotice";
import {
  RegistrationPass,
  type RegistrationPassData,
} from "@/landing/components/RegistrationPass";
import { EVENT_INFO, EVENT_PAYMENT } from "@/landing/data/eventData";
import { McmWordmark } from "@/shared/components/McmWordmark";
import {
  clearRegistrationDraft,
  EMPTY_REGISTRATION_DRAFT,
  loadRegistrationDraft,
  saveRegistrationDraft,
  type RegistrationDraft,
} from "@/landing/lib/registrationDraft";

const fieldClass =
  "w-full bg-obsidian-card border border-obsidian-border text-cream text-sm px-4 py-3 rounded-sm focus:border-gold/40 focus:outline-none transition-colors placeholder:text-cream-muted/40 font-body";

const selectClass = `${fieldClass} appearance-none`;

export default function RegisterPage() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const [submitting, setSubmitting] = useState(false);
  const [pass, setPass] = useState<RegistrationPassData | null>(null);
  const [error, setError] = useState("");
  const [draftReady, setDraftReady] = useState(false);
  const [draft, setDraft] = useState<RegistrationDraft>(EMPTY_REGISTRATION_DRAFT);

  useEffect(() => {
    setDraft(loadRegistrationDraft());
    setDraftReady(true);
  }, []);

  useEffect(() => {
    if (!draftReady || pass) return;
    saveRegistrationDraft(draft);
  }, [draft, draftReady, pass]);

  function updateField<K extends keyof RegistrationDraft>(
    key: K,
    value: RegistrationDraft[K]
  ) {
    setDraft((prev) => ({ ...prev, [key]: value }));
  }

  function handleRegisterAnother() {
    setPass(null);
    setDraft(EMPTY_REGISTRATION_DRAFT);
    setError("");
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      const registration = await addRegistration({
        fullName: draft.fullName.trim(),
        email: draft.email.trim(),
        phone: draft.phone.trim(),
        gender: draft.gender as Gender,
        college: draft.college.trim(),
        course: draft.course.trim(),
        year: draft.year as YearOfStudy,
        zone: draft.zone as Zone,
        diocese: draft.diocese.trim(),
        dietary: (draft.dietary || "none") as Dietary,
        amount: EVENT_PAYMENT.amount,
        transactionId: "",
        paymentStatus: "unpaid",
      });
      clearRegistrationDraft();
      setDraft(EMPTY_REGISTRATION_DRAFT);
      setPass({
        id: registration.id,
        fullName: registration.fullName,
        college: registration.college,
        zone: registration.zone,
        email: registration.email,
        phone: registration.phone,
      });
    } catch {
      setError(
        "Could not save registration. Check your connection and try again."
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-obsidian relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none select-none">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gold/[0.03] rounded-full blur-[150px]" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-accent-blue/[0.03] rounded-full blur-[120px]" />
      </div>

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
        <McmWordmark size="sm" align="right" />
      </nav>

      <div className="relative z-10 max-w-2xl mx-auto section-pad py-12 md:py-20">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          {pass ? (
            <>
              <p className="text-xs tracking-[0.3em] uppercase text-gold font-heading mb-4">
                Confirmed
              </p>
              <h1 className="text-3xl md:text-5xl font-heading font-extrabold text-cream tracking-tight">
                YOUR EVENT
                <br />
                PASS
              </h1>
              <p className="text-sm text-cream-muted mt-4 leading-relaxed max-w-md">
                Registration complete. Hold on to this pass for Malabar Campus
                Meet {EVENT_INFO.year}.
              </p>
              <div className="w-16 h-px bg-gold/40 mt-6 mb-10" />
              <RegistrationPass
                pass={pass}
                onRegisterAnother={handleRegisterAnother}
              />
            </>
          ) : (
            <>
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

              {!draftReady ? (
                <div className="flex h-40 items-center justify-center">
                  <div className="h-8 w-8 animate-spin rounded-full border-2 border-gold/30 border-t-gold" />
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <p className="text-[11px] text-cream-muted/50">
                    Your answers are saved automatically as you type.
                  </p>

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
                        value={draft.fullName}
                        onChange={(e) => updateField("fullName", e.target.value)}
                        className={fieldClass}
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
                          value={draft.email}
                          onChange={(e) => updateField("email", e.target.value)}
                          className={fieldClass}
                          placeholder="you@email.com"
                          autoComplete="email"
                        />
                        <p className="mt-2 text-[11px] leading-relaxed text-gold/80">
                          {EVENT_PAYMENT.emailMatchNote}
                        </p>
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
                          value={draft.phone}
                          onChange={(e) => updateField("phone", e.target.value)}
                          className={fieldClass}
                          placeholder="+91 XXXXX XXXXX"
                          autoComplete="tel"
                        />
                        <p className="mt-2 text-[11px] leading-relaxed text-cream-muted/50">
                          For event updates. Payment is matched by email, not
                          phone.
                        </p>
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
                        value={draft.gender}
                        onChange={(e) => updateField("gender", e.target.value)}
                        className={selectClass}
                      >
                        <option value="">Select</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                      </select>
                    </div>
                  </fieldset>

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
                        value={draft.college}
                        onChange={(e) => updateField("college", e.target.value)}
                        className={fieldClass}
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
                          value={draft.course}
                          onChange={(e) => updateField("course", e.target.value)}
                          className={fieldClass}
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
                          value={draft.year}
                          onChange={(e) => updateField("year", e.target.value)}
                          className={selectClass}
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

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label
                          htmlFor="zone"
                          className="block text-xs text-cream-muted mb-2 font-heading"
                        >
                          Zone *
                        </label>
                        <select
                          id="zone"
                          name="zone"
                          required
                          value={draft.zone}
                          onChange={(e) => updateField("zone", e.target.value)}
                          className={selectClass}
                        >
                          <option value="">Select zone</option>
                          <option value="kannur">Kannur</option>
                          <option value="kasargod">Kasargod</option>
                          <option value="thalassery">Thalassery</option>
                          <option value="kozhikode">Kozhikode</option>
                        </select>
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
                          value={draft.diocese}
                          onChange={(e) => updateField("diocese", e.target.value)}
                          className={fieldClass}
                          placeholder="Optional"
                        />
                      </div>
                    </div>
                  </fieldset>

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
                        value={draft.dietary}
                        onChange={(e) => updateField("dietary", e.target.value)}
                        className={selectClass}
                      >
                        <option value="none">No preference</option>
                        <option value="veg">Vegetarian</option>
                        <option value="nonveg">Non-Vegetarian</option>
                      </select>
                    </div>
                  </fieldset>

                  <fieldset className="space-y-4 pt-4 border-t border-obsidian-border">
                    <legend className="text-xs tracking-[0.2em] uppercase text-gold/60 font-heading mb-4">
                      Registration Fee
                    </legend>
                    <FeeNotice variant="dark" />
                  </fieldset>

                  <div className="pt-6">
                    {error ? (
                      <p
                        className="mb-3 text-center text-xs text-red-400/90"
                        role="alert"
                      >
                        {error}
                      </p>
                    ) : null}
                    <button
                      type="submit"
                      disabled={submitting}
                      className="btn-primary w-full justify-center disabled:opacity-60"
                    >
                      {submitting ? "SUBMITTING…" : "SUBMIT REGISTRATION"}
                      <ArrowRight className="w-4 h-4 btn-arrow" />
                    </button>
                    <p className="text-[11px] text-cream-muted/40 text-center mt-4 leading-relaxed">
                      By registering, you agree to receive event-related
                      communications. Your details will be handled securely.
                    </p>
                  </div>
                </form>
              )}
            </>
          )}
        </motion.div>
      </div>
    </div>
  );
}
