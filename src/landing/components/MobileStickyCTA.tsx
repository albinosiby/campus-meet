"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { EVENT_INFO } from "@/landing/data/eventData";

export default function MobileStickyCTA() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY > window.innerHeight);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed bottom-0 left-0 right-0 z-50 md:hidden"
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        >
          <div
            className="px-4 pt-3 bg-obsidian/90 border-t border-obsidian-border"
            style={{
              paddingBottom: "max(1rem, env(safe-area-inset-bottom))",
              backdropFilter: "blur(20px)",
              WebkitBackdropFilter: "blur(20px)",
            }}
          >
            <Link
              href={EVENT_INFO.registerUrl}
              className="btn-primary w-full justify-center text-center no-underline"
            >
              REGISTER NOW
              <ArrowRight className="w-4 h-4 btn-arrow" />
            </Link>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
