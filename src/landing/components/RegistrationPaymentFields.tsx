"use client";

import { useState } from "react";
import Image from "next/image";
import { Check, Copy } from "lucide-react";
import {
  EVENT_PAYMENT,
  formatRegistrationFee,
  isUpiConfigured,
} from "@/landing/data/eventData";

interface RegistrationPaymentFieldsProps {
  amountPaid: string;
  transactionId: string;
  onAmountChange: (value: string) => void;
  onTransactionIdChange: (value: string) => void;
}

const fieldClass =
  "w-full bg-obsidian-card border border-obsidian-border text-cream text-sm px-4 py-3 rounded-sm focus:border-gold/40 focus:outline-none transition-colors placeholder:text-cream-muted/40 font-body";

export function RegistrationPaymentFields({
  amountPaid,
  transactionId,
  onAmountChange,
  onTransactionIdChange,
}: RegistrationPaymentFieldsProps) {
  const [copied, setCopied] = useState(false);
  const configured = isUpiConfigured();

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
    <div className="space-y-5">
      <div className="rounded-sm border border-obsidian-border bg-obsidian-card p-5">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-[11px] font-heading uppercase tracking-[0.2em] text-cream-muted">
              Registration fee
            </p>
            <p className="mt-1 font-heading text-2xl font-extrabold text-cream">
              {formatRegistrationFee()}
            </p>
          </div>
          <p className="rounded-sm border border-gold/30 bg-gold/10 px-2.5 py-1 text-[11px] font-heading uppercase tracking-[0.14em] text-gold">
            Pay now
          </p>
        </div>
        <p className="mt-3 text-sm leading-relaxed text-cream-muted">
          {EVENT_PAYMENT.collectionNote}
        </p>

        {configured ? (
          <div className="mt-6 grid gap-6 sm:grid-cols-[auto_1fr] sm:items-center">
            <div className="mx-auto w-fit rounded-sm border-2 border-gold/50 bg-cream p-3 shadow-[0_0_0_4px_rgba(0,0,0,0.35)] ring-1 ring-gold/20 sm:p-4">
              <Image
                src={EVENT_PAYMENT.qrImage}
                alt="UPI payment QR code"
                width={240}
                height={240}
                className="h-52 w-52 object-contain sm:h-56 sm:w-56"
                priority
              />
            </div>
            <div className="space-y-3">
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
                Scan this QR with any UPI app, then enter the amount and
                transaction ID below.
              </p>
            </div>
          </div>
        ) : null}
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div>
          <label
            htmlFor="amountPaid"
            className="mb-2 block text-xs font-heading text-cream-muted"
          >
            Amount you are paying (of {formatRegistrationFee()}) *
          </label>
          <input
            type="number"
            id="amountPaid"
            name="amountPaid"
            required
            min={1}
            max={EVENT_PAYMENT.amount}
            step={1}
            value={amountPaid}
            onChange={(e) => onAmountChange(e.target.value)}
            className={fieldClass}
            placeholder="Enter amount paid"
          />
        </div>
        <div>
          <label
            htmlFor="transactionId"
            className="mb-2 block text-xs font-heading text-cream-muted"
          >
            UPI Transaction ID *
          </label>
          <input
            type="text"
            id="transactionId"
            name="transactionId"
            required
            minLength={8}
            value={transactionId}
            onChange={(e) => onTransactionIdChange(e.target.value)}
            className={fieldClass}
            placeholder="Enter UPI reference / transaction ID"
            autoComplete="off"
          />
          <p className="mt-2 text-[11px] leading-relaxed text-cream-muted/50">
            Find this in your UPI app after paying.
          </p>
        </div>
      </div>
    </div>
  );
}
