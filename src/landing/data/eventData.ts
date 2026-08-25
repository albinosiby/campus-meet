// ============================================
// CENTRALIZED EVENT DATA
// Easy to update when official details arrive
// ============================================

export const EVENT_INFO = {
  name: "Malabar Campus Meet",
  year: "2026",
  shortYear: "'26",
  organizer: "Jesus Youth",
  region: "Malabar",
  tagline: "Gather. Grow. Go.",
  posterTagline: "Abhi Nahi Toh Kab?",
  dates: "September 18–21, 2026",
  dateShort: "Sep 18–21",
  venue: "Don Bosco Arts & Science College",
  venueLocation: "Angadikadavu",
  venueMapsUrl: "https://maps.app.goo.gl/p9pcmKgKoyFak8GVA",
  /** Embeddable map view for the venue (same place as venueMapsUrl). */
  venueMapsEmbedUrl:
    "https://maps.google.com/maps?q=Don+Bosco+Arts+and+Science+College,+Angadikadavu,+Kerala&z=16&output=embed",
  target: "Campus Students",
  description:
    "A gathering of campus youth to encounter, connect, grow and live the mission together.",
  registerUrl: "/register",
  paymentUrl: "/payment",
  contacts: [
    {
      label: "+91 92072 00525",
      tel: "+919207200525",
    },
    {
      label: "+91 90619 15105",
      tel: "+919061915105",
    },
  ],
};

/** Payment config. UPI defaults can be overridden with env vars. */
export const EVENT_PAYMENT = {
  amount: 950,
  currency: "INR",
  currencySymbol: "₹",
  /** Fee is collected during registration via UPI. */
  collectLater: false,
  collectionNote:
    "Pay the ₹950 registration fee via UPI using the QR code or UPI ID below, then enter the amount paid and your transaction ID to complete registration.",
  emailMatchNote:
    "Use an email you can access. Keep your transaction ID ready after paying.",
  upiId:
    process.env.NEXT_PUBLIC_UPI_ID?.trim() || "ajinaugestin-1@okhdfcbank",
  payeeName:
    process.env.NEXT_PUBLIC_UPI_PAYEE_NAME?.trim() || "Jesus Youth Malabar",
  upiNote:
    process.env.NEXT_PUBLIC_UPI_NOTE?.trim() || "Malabar Campus Meet 2026",
  /** Official bank / GPay QR shown on the registration form. */
  qrImage: "/images/upi-qr.jpg",
};

export function formatRegistrationFee(): string {
  return `${EVENT_PAYMENT.currencySymbol}${EVENT_PAYMENT.amount}`;
}

export function buildUpiPaymentLink(): string {
  const params = new URLSearchParams({
    pa: EVENT_PAYMENT.upiId,
    pn: EVENT_PAYMENT.payeeName,
    am: String(EVENT_PAYMENT.amount),
    cu: EVENT_PAYMENT.currency,
    tn: EVENT_PAYMENT.upiNote,
  });
  return `upi://pay?${params.toString()}`;
}

export function isUpiConfigured(): boolean {
  return EVENT_PAYMENT.upiId.length > 0;
}

export const SNAPSHOT_ITEMS = [
  {
    label: "DATE",
    value: "Sep 18 – 21",
    detail: "2026",
    icon: "calendar",
  },
  {
    label: "VENUE",
    value: "Don Bosco College",
    detail: "Angadikadavu",
    icon: "map-pin",
  },
  {
    label: "FOR",
    value: "Campus Students",
    detail: "Across Malabar",
    icon: "users",
  },
  {
    label: "YEAR",
    value: "2026",
    detail: "Edition",
    icon: "flame",
  },
] as const;

export const GALLERY_IMAGES = [
  {
    src: "/images/gallery-clapping.jpg",
    alt: "Students smiling and clapping together at an evening campus gathering",
    span: "col-span-2 row-span-1 md:row-span-2",
  },
  {
    src: "/images/gallery-adoration.jpg",
    alt: "Silhouetted crowd with raised hands in worship before the Eucharist",
    span: "col-span-1 row-span-1",
  },
  {
    src: "/images/gallery-hands-up.jpg",
    alt: "Campus meet participants raising their hands in shared enthusiasm",
    span: "col-span-1 row-span-1 md:row-span-2",
  },
  {
    src: "/images/gallery-circle.jpg",
    alt: "Students sitting in a circle holding hands during campus meet",
    span: "col-span-2 md:col-span-2 row-span-1",
  },
] as const;

export const FAQ_ITEMS = [
  {
    question: "Who can attend?",
    answer:
      "The Malabar Campus Meet is open to all college and university students across the Malabar region. Whether you are already part of Jesus Youth or new to the community, you are welcome.",
  },
  {
    question: "What is the registration fee?",
    answer:
      "The registration fee is ₹950 per participant. Pay via UPI on the registration form using the QR code or UPI ID, then enter your transaction ID.",
  },
  {
    question: "How do I register?",
    answer:
      'Click "Register Now", fill in your details, pay ₹950 via UPI, and submit the amount paid with your UPI transaction ID to complete registration.',
  },
  {
    question: "How do I make the payment?",
    answer:
      "On the registration page, scan the UPI QR or pay to ajinaugestin-1@okhdfcbank, then enter the amount you paid and the UPI transaction ID in the form.",
  },
  {
    question: "What should I bring?",
    answer:
      "Bring a Bible, a notebook, personal essentials, and an open heart. A detailed packing list will be shared closer to the event date.",
  },
  {
    question: "Where is the venue?",
    answer:
      "The event will be held at Don Bosco Arts & Science College, Angadikadavu, Kerala. Open the location on Google Maps from the Event details section on this page.",
  },
] as const;

export const SCRIPTURE_QUOTES = {
  gather: {
    label: "Word of God",
    text: "For where two or three are gathered in my name, there am I among them.",
    reference: "Matthew 18:20",
  },
} as const;

export const SOCIAL_LINKS = [
  {
    name: "Instagram",
    url: "https://www.instagram.com/p/Db3QgVfv3hn/?igsh=MW9sdTRvcnk0Nm81aQ==",
    icon: "instagram",
  },
] as const;
