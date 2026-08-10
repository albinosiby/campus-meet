import Image from "next/image";
import { Instagram, MessageCircle, Youtube } from "lucide-react";
import { EVENT_INFO } from "@/landing/data/eventData";

export default function Footer() {
  return (
    <footer className="bg-obsidian-light border-t border-obsidian-border">
      <div className="max-w-7xl mx-auto section-pad py-16">
        {/* Top Row */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
          {/* Brand */}
          <div className="flex items-center gap-3">
            <div className="relative w-10 h-10 rounded-full overflow-hidden border border-gold/30 flex-shrink-0">
              <Image
                src="/images/jy-logo.png"
                alt="Jesus Youth Logo"
                fill
                className="object-cover"
                sizes="40px"
              />
            </div>
            <div>
              <p className="text-lg font-heading font-extrabold text-cream leading-tight">
                JESUS YOUTH
              </p>
              <p className="text-xs tracking-[0.2em] text-gold uppercase mt-0.5">
                MALABAR CAMPUS MEET {EVENT_INFO.shortYear}
              </p>
            </div>
          </div>

          {/* Tagline */}
          <p className="text-xs tracking-[0.4em] text-cream-muted uppercase hidden md:block">
            GATHER &bull; GROW &bull; GO
          </p>

          {/* Social */}
          <div className="flex items-center gap-5">
            <a
              href="#"
              aria-label="Follow us on Instagram"
              className="text-cream-muted hover:text-gold transition-colors duration-300"
            >
              <Instagram className="w-5 h-5" />
            </a>
            <a
              href="#"
              aria-label="Join our WhatsApp group"
              className="text-cream-muted hover:text-gold transition-colors duration-300"
            >
              <MessageCircle className="w-5 h-5" />
            </a>
            <a
              href="#"
              aria-label="Watch on YouTube"
              className="text-cream-muted hover:text-gold transition-colors duration-300"
            >
              <Youtube className="w-5 h-5" />
            </a>
          </div>
        </div>

        {/* Mobile Tagline */}
        <p className="text-xs tracking-[0.4em] text-cream-muted uppercase mt-8 md:hidden">
          GATHER &bull; GROW &bull; GO
        </p>

        {/* Bottom */}
        <div className="mt-12 pt-8 border-t border-obsidian-border">
          <p className="text-xs text-cream-muted/50 text-center">
            &copy; {EVENT_INFO.year} Jesus Youth Malabar
          </p>
        </div>
      </div>
    </footer>
  );
}
