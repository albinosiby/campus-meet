"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { QRCodeSVG } from "qrcode.react";
import { ZONE_LABELS } from "@/admin/constants";
import type { Zone } from "@/admin/types";
import {
  EVENT_INFO,
  EVENT_PAYMENT,
  formatRegistrationFee,
} from "@/landing/data/eventData";

export interface RegistrationPassData {
  id: string;
  fullName: string;
  college: string;
  zone: Zone | string;
  email: string;
  phone: string;
}

interface RegistrationPassProps {
  pass: RegistrationPassData;
  onRegisterAnother: () => void;
}

function shortPassCode(id: string): string {
  return id.slice(0, 8).toUpperCase();
}

export function RegistrationPass({
  pass,
  onRegisterAnother,
}: RegistrationPassProps) {
  const zoneLabel =
    ZONE_LABELS[pass.zone as Zone] ?? String(pass.zone || "—");
  const passCode = shortPassCode(pass.id);
  const qrPayload = `MCM26:${pass.id}`;

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        className="relative"
      >
        {/* Soft glow behind pass */}
        <div
          aria-hidden
          className="pointer-events-none absolute -inset-6 rounded-[2rem] bg-gold/[0.07] blur-2xl"
        />

        <article className="relative overflow-hidden rounded-sm border border-gold/25 bg-obsidian-card shadow-[0_24px_80px_-40px_rgba(200,164,78,0.45)]">
          {/* Top brand strip */}
          <div className="relative border-b border-obsidian-border bg-gradient-to-br from-obsidian-light via-obsidian-card to-obsidian-card px-5 pb-5 pt-5 md:px-7">
            <div className="absolute inset-0 opacity-[0.14]">
              <Image
                src="/images/hero-bg.jpg"
                alt=""
                fill
                className="object-cover"
                sizes="640px"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-obsidian-card via-obsidian/80 to-obsidian/40" />
            </div>

            <div className="relative flex items-start justify-between gap-4">
              <div>
                <p className="text-[10px] font-heading uppercase tracking-[0.32em] text-gold">
                  Event Pass
                </p>
                <h2 className="mt-2 font-heading text-2xl font-extrabold tracking-tight text-cream md:text-3xl">
                  {EVENT_INFO.name}
                </h2>
                <p className="mt-1 text-xs font-heading uppercase tracking-[0.22em] text-cream-muted">
                  {EVENT_INFO.organizer} · {EVENT_INFO.year}
                </p>
              </div>
              <div className="rounded-sm border border-gold/30 bg-gold/10 px-3 py-2 text-right">
                <p className="text-[10px] font-heading uppercase tracking-[0.2em] text-gold">
                  MCM
                </p>
                <p className="font-heading text-lg font-bold text-cream">
                  {EVENT_INFO.shortYear}
                </p>
              </div>
            </div>
          </div>

          {/* Ticket notch + perforation */}
          <div className="relative border-b border-dashed border-obsidian-border">
            <div
              aria-hidden
              className="absolute -left-3 top-1/2 h-6 w-6 -translate-y-1/2 rounded-full bg-obsidian"
            />
            <div
              aria-hidden
              className="absolute -right-3 top-1/2 h-6 w-6 -translate-y-1/2 rounded-full bg-obsidian"
            />
            <div className="px-5 py-4 md:px-7">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-[10px] font-heading uppercase tracking-[0.2em] text-cream-muted">
                    Participant
                  </p>
                  <p className="mt-1 font-heading text-xl font-bold text-cream md:text-2xl">
                    {pass.fullName}
                  </p>
                </div>
                <div className="rounded-sm border border-gold/35 bg-gold/[0.08] px-3 py-2">
                  <p className="text-[9px] font-heading uppercase tracking-[0.18em] text-gold">
                    Fee due later
                  </p>
                  <p className="mt-0.5 font-heading text-sm font-semibold text-cream">
                    {formatRegistrationFee()}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Details + QR stub */}
          <div className="grid gap-6 px-5 py-6 md:grid-cols-[1fr_auto] md:px-7 md:py-7">
            <div className="space-y-5">
              <dl className="grid grid-cols-2 gap-4">
                <div>
                  <dt className="text-[10px] font-heading uppercase tracking-[0.18em] text-cream-muted">
                    Dates
                  </dt>
                  <dd className="mt-1 text-sm text-cream">{EVENT_INFO.dates}</dd>
                </div>
                <div>
                  <dt className="text-[10px] font-heading uppercase tracking-[0.18em] text-cream-muted">
                    Zone
                  </dt>
                  <dd className="mt-1 text-sm text-cream">{zoneLabel}</dd>
                </div>
                <div className="col-span-2">
                  <dt className="text-[10px] font-heading uppercase tracking-[0.18em] text-cream-muted">
                    Venue
                  </dt>
                  <dd className="mt-1 text-sm leading-relaxed text-cream">
                    {EVENT_INFO.venue}
                    <br />
                    <span className="text-cream-muted">
                      {EVENT_INFO.venueLocation}
                    </span>
                  </dd>
                </div>
                <div className="col-span-2">
                  <dt className="text-[10px] font-heading uppercase tracking-[0.18em] text-cream-muted">
                    College
                  </dt>
                  <dd className="mt-1 text-sm text-cream">{pass.college}</dd>
                </div>
              </dl>

              <p className="text-[11px] leading-relaxed text-cream-muted/70">
                No payment needed now. When ready, open the payment page, enter
                this email ({pass.email}), pay{" "}
                {EVENT_PAYMENT.currencySymbol}
                {EVENT_PAYMENT.amount}, and submit your transaction ID.
              </p>
            </div>

            <div className="flex flex-col items-center justify-center gap-3 border-t border-obsidian-border pt-5 md:border-l md:border-t-0 md:pl-6 md:pt-0">
              <div className="rounded-sm border border-obsidian-border bg-cream p-2.5">
                <QRCodeSVG
                  value={qrPayload}
                  size={112}
                  level="M"
                  bgColor="#f5f0e8"
                  fgColor="#090a0f"
                  marginSize={0}
                />
              </div>
              <div className="text-center">
                <p className="text-[9px] font-heading uppercase tracking-[0.2em] text-cream-muted">
                  Pass ID
                </p>
                <p className="mt-1 font-mono text-xs tracking-wider text-gold">
                  {passCode}
                </p>
              </div>
            </div>
          </div>

          <div className="border-t border-obsidian-border bg-obsidian-light/60 px-5 py-3 md:px-7">
            <p className="text-center text-[10px] font-heading uppercase tracking-[0.24em] text-cream-muted">
              {EVENT_INFO.tagline} · Keep this pass for check-in
            </p>
          </div>
        </article>
      </motion.div>

      <div className="flex flex-col items-center gap-3 text-center">
        <p className="max-w-sm text-sm leading-relaxed text-cream-muted">
          You&apos;re registered. Screenshot this pass or save the page — you
          may need it at the venue.
        </p>
        <button
          type="button"
          onClick={onRegisterAnother}
          className="btn-outline mt-2 inline-flex"
        >
          Register another person
        </button>
      </div>
    </div>
  );
}
