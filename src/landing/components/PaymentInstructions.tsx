"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import {
  buildUpiPaymentLink,
  EVENT_PAYMENT,
  formatRegistrationFee,
  isUpiConfigured,
} from "@/landing/data/eventData";

export function PaymentInstructions({ className = "" }: { className?: string }) {
  const [copied, setCopied] = useState(false);
  const configured = isUpiConfigured();
  const upiLink = configured ? buildUpiPaymentLink() : "";

  async function copyUpi() {
    if (!configured) return;
    try {
      await navigator.clipboard.writeText(EVENT_PAYMENT.upiId);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  }

  return (
    <div
      className={`rounded-sm border border-obsidian-border bg-obsidian-card p-5 ${className}`}
    >
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-[11px] font-heading uppercase tracking-[0.2em] text-cream-muted">
            Amount to pay
          </p>
          <p className="mt-1 font-heading text-2xl font-extrabold text-cream">
            {formatRegistrationFee()}
          </p>
        </div>
        <p className="rounded-sm border border-gold/30 bg-gold/10 px-2.5 py-1 text-[11px] font-heading uppercase tracking-[0.14em] text-gold">
          UPI
        </p>
      </div>

      {!configured ? (
        <p className="mt-5 text-sm leading-relaxed text-cream-muted">
          UPI details are not configured yet. Set{" "}
          <code className="text-gold">NEXT_PUBLIC_UPI_ID</code> and rebuild, or
          check back shortly for payment instructions.
        </p>
      ) : (
        <div className="mt-5 grid gap-5 sm:grid-cols-[auto_1fr] sm:items-center">
          <div className="mx-auto w-fit rounded-sm border border-obsidian-border bg-cream p-2.5">
            <QRCodeSVG
              value={upiLink}
              size={132}
              level="M"
              bgColor="#f5f0e8"
              fgColor="#090a0f"
              marginSize={0}
            />
          </div>

          <div className="space-y-3">
            <div>
              <p className="text-[10px] font-heading uppercase tracking-[0.18em] text-cream-muted">
                Pay to
              </p>
              <p className="mt-1 text-sm text-cream">{EVENT_PAYMENT.payeeName}</p>
            </div>

            <div>
              <p className="text-[10px] font-heading uppercase tracking-[0.18em] text-cream-muted">
                UPI ID
              </p>
              <div className="mt-1.5 flex items-center gap-2">
                <code className="flex-1 truncate rounded-sm border border-obsidian-border bg-obsidian-light px-3 py-2 font-mono text-sm text-gold">
                  {EVENT_PAYMENT.upiId}
                </code>
                <button
                  type="button"
                  onClick={() => void copyUpi()}
                  className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-sm border border-obsidian-border text-cream-muted transition-colors hover:border-gold/40 hover:text-cream"
                  aria-label="Copy UPI ID"
                >
                  {copied ? (
                    <Check className="h-4 w-4 text-gold" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            <p className="text-[11px] leading-relaxed text-cream-muted/70">
              Scan the QR or pay exactly {formatRegistrationFee()} to this UPI
              ID, then enter the transaction ID below.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
