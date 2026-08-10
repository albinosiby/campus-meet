"use client";

import { useEffect, useState } from "react";
import { Check, Copy } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import {
  buildUpiPayUrl,
  EVENT_PAYMENT,
} from "@/landing/data/eventData";

interface PaymentDetailsProps {
  variant?: "dark" | "light";
  showAmount?: boolean;
  className?: string;
}

function copyText(value: string): boolean {
  try {
    const textarea = document.createElement("textarea");
    textarea.value = value;
    textarea.setAttribute("readonly", "");
    textarea.style.position = "fixed";
    textarea.style.left = "-9999px";
    document.body.appendChild(textarea);
    textarea.select();
    const ok = document.execCommand("copy");
    document.body.removeChild(textarea);
    return ok;
  } catch {
    return false;
  }
}

export function PaymentDetails({
  variant = "dark",
  showAmount = true,
  className = "",
}: PaymentDetailsProps) {
  const [copied, setCopied] = useState(false);
  const upiUrl = buildUpiPayUrl();

  useEffect(() => {
    if (!copied) return;
    const timer = window.setTimeout(() => setCopied(false), 1800);
    return () => window.clearTimeout(timer);
  }, [copied]);

  function handleCopyUpiId() {
    const ok = copyText(EVENT_PAYMENT.upiId);
    setCopied(ok);
  }

  const isDark = variant === "dark";
  const panel = isDark
    ? "border-obsidian-border bg-obsidian-card"
    : "border-admin-border bg-admin-elevated";
  const title = isDark ? "text-cream" : "text-admin-ink";
  const muted = isDark ? "text-cream-muted" : "text-admin-muted";
  const button = isDark
    ? "border-obsidian-border bg-obsidian text-cream hover:border-gold/40"
    : "border-admin-border bg-admin-surface text-admin-ink hover:border-gold/40";

  return (
    <div className={`rounded-sm border ${panel} p-5 ${className}`}>
      {showAmount ? (
        <div className="mb-4 flex items-end justify-between gap-3">
          <div>
            <p
              className={`text-[11px] font-heading uppercase tracking-[0.2em] ${muted}`}
            >
              Registration Fee
            </p>
            <p className={`mt-1 font-heading text-2xl font-extrabold ${title}`}>
              {EVENT_PAYMENT.currencySymbol}
              {EVENT_PAYMENT.amount}
            </p>
          </div>
          <p className={`text-[11px] ${muted}`}>Pay via UPI</p>
        </div>
      ) : null}

      <div className="flex flex-col items-center gap-3">
        <div className="rounded-sm bg-white p-3">
          <QRCodeSVG
            value={upiUrl}
            size={168}
            level="M"
            includeMargin={false}
            bgColor="#ffffff"
            fgColor="#15171f"
          />
        </div>
        <p className={`text-center text-[11px] leading-relaxed ${muted}`}>
          Scan with any UPI app to pay {EVENT_PAYMENT.currencySymbol}
          {EVENT_PAYMENT.amount}
        </p>
      </div>

      <div className="mt-4">
        <p
          className={`mb-2 text-[11px] font-heading uppercase tracking-[0.16em] ${muted}`}
        >
          UPI ID
        </p>
        <div className="flex items-center gap-2">
          <code
            className={`min-w-0 flex-1 truncate rounded-sm border px-3 py-2.5 font-mono text-sm ${
              isDark
                ? "border-obsidian-border bg-obsidian text-cream"
                : "border-admin-border bg-admin-surface text-admin-ink"
            }`}
          >
            {EVENT_PAYMENT.upiId}
          </code>
          <button
            type="button"
            onClick={handleCopyUpiId}
            className={`inline-flex shrink-0 items-center gap-1.5 rounded-sm border px-3 py-2.5 text-xs font-heading uppercase tracking-[0.12em] transition-colors ${button}`}
            aria-label="Copy UPI ID"
          >
            {copied ? (
              <Check className="h-3.5 w-3.5 text-green-500" />
            ) : (
              <Copy className="h-3.5 w-3.5" />
            )}
            {copied ? "Copied" : "Copy"}
          </button>
        </div>
      </div>
    </div>
  );
}
