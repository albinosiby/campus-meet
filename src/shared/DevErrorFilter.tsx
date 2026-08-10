"use client";

import { useEffect } from "react";

/**
 * Next.js / webpack can surface failed resource or HMR events as
 * Runtime Error: [object Event]. Filter those noise errors in development.
 */
export function DevErrorFilter() {
  useEffect(() => {
    if (process.env.NODE_ENV === "production") return;

    const onError = (event: ErrorEvent) => {
      const isSpuriousEventMessage = event.message === "[object Event]";
      const isRawEvent =
        event.error instanceof Event && !(event.error instanceof Error);

      if (isSpuriousEventMessage || isRawEvent) {
        event.preventDefault();
        event.stopImmediatePropagation();
      }
    };

    window.addEventListener("error", onError, true);
    return () => window.removeEventListener("error", onError, true);
  }, []);

  return null;
}
