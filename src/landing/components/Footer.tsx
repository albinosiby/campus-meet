import Image from "next/image";
import { Instagram } from "lucide-react";
import { EVENT_INFO, SOCIAL_LINKS } from "@/landing/data/eventData";
import { EventWordmark } from "@/shared/components/EventWordmark";

export default function Footer() {
  const instagram = SOCIAL_LINKS[0];

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
            <EventWordmark size="md" />
          </div>

          {/* Tagline */}
          <p className="text-xs tracking-[0.4em] text-cream-muted uppercase hidden md:block">
            GATHER &bull; GROW &bull; GO
          </p>

          {/* Social — Instagram only */}
          <a
            href={instagram.url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="View on Instagram"
            className="text-cream-muted hover:text-gold transition-colors duration-300"
          >
            <Instagram className="w-5 h-5" />
          </a>
        </div>

        {/* Mobile Tagline */}
        <p className="text-xs tracking-[0.4em] text-cream-muted uppercase mt-8 md:hidden">
          GATHER &bull; GROW &bull; GO
        </p>

        <div className="mt-12 pt-8 border-t border-obsidian-border">
          <p className="text-xs text-cream-muted/50 text-center">
            &copy; {EVENT_INFO.year} Jesus Youth Malabar · {EVENT_INFO.name}
          </p>
        </div>
      </div>
    </footer>
  );
}
