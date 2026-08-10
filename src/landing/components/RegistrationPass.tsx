"use client";

import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { toPng } from "html-to-image";
import { Download, MapPin } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { ZONE_LABELS } from "@/admin/constants";
import type { Zone } from "@/admin/types";
import { EVENT_INFO } from "@/landing/data/eventData";
import { formatPassId, passQrPayload } from "@/shared/passId";

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

export function RegistrationPass({
  pass,
  onRegisterAnother,
}: RegistrationPassProps) {
  const passRef = useRef<HTMLElement>(null);
  const [downloading, setDownloading] = useState(false);
  const [downloadError, setDownloadError] = useState("");

  const zoneLabel =
    ZONE_LABELS[pass.zone as Zone] ?? String(pass.zone || "—");
  const passCode = formatPassId(pass.id);
  const qrPayload = passQrPayload(pass.id);

  async function handleDownload() {
    if (!passRef.current) return;
    setDownloadError("");
    setDownloading(true);

    try {
      const dataUrl = await toPng(passRef.current, {
        cacheBust: true,
        pixelRatio: 2,
        backgroundColor: "#090a0f",
      });
      const link = document.createElement("a");
      const safeName = pass.fullName
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");
      link.download = `malabar-campus-meet-2026-pass-${safeName || passCode}.png`;
      link.href = dataUrl;
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch {
      setDownloadError("Could not download the pass image. Try again.");
    } finally {
      setDownloading(false);
    }
  }

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        className="relative"
      >
        <div
          aria-hidden
          className="pointer-events-none absolute -inset-6 rounded-[2rem] bg-gold/[0.07] blur-2xl"
        />

        <article
          ref={passRef}
          className="relative overflow-hidden rounded-sm border border-gold/25 bg-obsidian shadow-[0_24px_80px_-40px_rgba(200,164,78,0.45)]"
        >
          {/* Hero background across the full pass */}
          <div className="absolute inset-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/hero-bg.jpg"
              alt=""
              className="h-full w-full object-cover object-center"
              crossOrigin="anonymous"
            />
            <div className="absolute inset-0 bg-obsidian/78" />
            <div className="absolute inset-0 bg-gradient-to-b from-obsidian/40 via-obsidian/55 to-obsidian/88" />
          </div>

          <div className="relative border-b border-gold/15 px-5 pb-5 pt-5 md:px-7">
            <div className="flex items-start justify-between gap-4">
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
              <div className="rounded-sm border border-gold/30 bg-obsidian/50 px-3 py-2 text-right backdrop-blur-sm">
                <p className="text-[10px] font-heading uppercase tracking-[0.14em] text-gold">
                  {EVENT_INFO.name}
                </p>
                <p className="mt-1 font-heading text-sm font-bold text-cream">
                  {EVENT_INFO.shortYear}
                </p>
              </div>
            </div>
          </div>

          <div className="relative border-b border-dashed border-gold/20">
            <div
              aria-hidden
              className="absolute -left-3 top-1/2 h-6 w-6 -translate-y-1/2 rounded-full bg-obsidian"
            />
            <div
              aria-hidden
              className="absolute -right-3 top-1/2 h-6 w-6 -translate-y-1/2 rounded-full bg-obsidian"
            />
            <div className="px-5 py-4 md:px-7">
              <p className="text-[10px] font-heading uppercase tracking-[0.2em] text-cream-muted">
                Participant
              </p>
              <p className="mt-1 font-heading text-xl font-bold text-cream md:text-2xl">
                {pass.fullName}
              </p>
            </div>
          </div>

          <div className="relative grid gap-6 px-5 py-6 md:grid-cols-[1fr_auto] md:px-7 md:py-7">
            <div>
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
                  <a
                    href={EVENT_INFO.venueMapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 inline-flex items-center gap-1.5 text-[10px] font-heading uppercase tracking-[0.18em] text-gold transition-colors hover:text-gold-bright"
                  >
                    <MapPin className="h-3 w-3" />
                    Open in Maps
                  </a>
                </div>
                <div className="col-span-2">
                  <dt className="text-[10px] font-heading uppercase tracking-[0.18em] text-cream-muted">
                    College
                  </dt>
                  <dd className="mt-1 text-sm text-cream">{pass.college}</dd>
                </div>
              </dl>
            </div>

            <div className="flex flex-col items-center justify-center gap-3 border-t border-gold/15 pt-5 md:border-l md:border-t-0 md:pl-6 md:pt-0">
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

          <div className="relative border-t border-gold/15 bg-obsidian/50 px-5 py-3 backdrop-blur-sm md:px-7">
            <p className="text-center text-[10px] font-heading uppercase tracking-[0.24em] text-cream-muted">
              {EVENT_INFO.tagline} · Keep this pass for check-in
            </p>
          </div>
        </article>
      </motion.div>

      <div className="flex flex-col items-center gap-3 text-center">
        <p className="max-w-sm text-sm leading-relaxed text-cream-muted">
          You&apos;re registered. Download your pass as an image and keep it for
          check-in.
        </p>
        {downloadError ? (
          <p className="text-xs text-red-400/90" role="alert">
            {downloadError}
          </p>
        ) : null}
        <div className="mt-2 flex flex-col items-center gap-3 sm:flex-row">
          <button
            type="button"
            onClick={() => void handleDownload()}
            disabled={downloading}
            className="btn-primary inline-flex disabled:opacity-60"
          >
            <Download className="h-4 w-4" />
            {downloading ? "Saving image…" : "Download pass image"}
          </button>
          <button
            type="button"
            onClick={onRegisterAnother}
            className="btn-outline inline-flex"
          >
            Register another person
          </button>
        </div>
      </div>
    </div>
  );
}
