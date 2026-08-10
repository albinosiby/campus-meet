import { MapPin } from "lucide-react";
import { EVENT_INFO } from "@/landing/data/eventData";

export default function LocationSection() {
  return (
    <section
      id="location"
      className="border-t border-obsidian-border bg-obsidian"
      aria-labelledby="location-heading"
    >
      <div className="mx-auto flex max-w-7xl items-end justify-between gap-4 section-pad py-8 md:py-10">
        <div>
          <p className="text-[10px] font-heading uppercase tracking-[0.3em] text-gold">
            Location
          </p>
          <h2
            id="location-heading"
            className="mt-2 font-heading text-sm font-semibold text-cream md:text-base"
          >
            {EVENT_INFO.venue}
          </h2>
          <p className="mt-1 text-xs text-cream-muted">
            {EVENT_INFO.venueLocation}
          </p>
        </div>
        <a
          href={EVENT_INFO.venueMapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex shrink-0 items-center gap-1.5 text-[10px] font-heading uppercase tracking-[0.18em] text-gold transition-colors hover:text-gold-bright"
        >
          <MapPin className="h-3.5 w-3.5" />
          Open in Maps
        </a>
      </div>
      <div className="relative h-56 w-full overflow-hidden border-t border-obsidian-border md:h-72 lg:h-80">
        <iframe
          title={`${EVENT_INFO.venue} location map`}
          src={EVENT_INFO.venueMapsEmbedUrl}
          className="absolute inset-0 h-full w-full border-0 grayscale-[20%] contrast-[1.05]"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          allowFullScreen
        />
      </div>
    </section>
  );
}
