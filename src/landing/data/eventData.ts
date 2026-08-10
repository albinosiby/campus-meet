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
  target: "Campus Students",
  description:
    "A gathering of campus youth to encounter, connect, grow and live the mission together.",
  registerUrl: "/register",
  paymentUrl: "/payment",
};

/** Payment config. UPI details come from env so you can change them without code edits. */
export const EVENT_PAYMENT = {
  amount: 950,
  currency: "INR",
  currencySymbol: "₹",
  /** Fee is shown now but not charged at registration time. */
  collectLater: true,
  collectionNote:
    "Register free for now. The ₹950 fee will be collected later (in a few weeks) on a payment page. Use the same email ID you register with — that email is how we match your payment to this registration.",
  emailMatchNote:
    "Use an email you can access later. When payment opens, you must enter this same email ID so we can link your payment to this registration.",
  upiId: process.env.NEXT_PUBLIC_UPI_ID?.trim() || "",
  payeeName:
    process.env.NEXT_PUBLIC_UPI_PAYEE_NAME?.trim() || "Jesus Youth Malabar",
  upiNote:
    process.env.NEXT_PUBLIC_UPI_NOTE?.trim() || "Malabar Campus Meet 2026",
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

export const EXPERIENCES = [
  {
    number: "01",
    title: "WORSHIP",
    description: "Moments to pause, pray and encounter God.",
    image: "/images/worship.jpg",
    size: "large" as const,
  },
  {
    number: "02",
    title: "COMMUNITY",
    description:
      "Meet and connect with students from campuses across Malabar.",
    image: "/images/community.jpg",
    size: "small" as const,
  },
  {
    number: "03",
    title: "FORMATION",
    description: "Grow deeper in faith, understanding and purpose.",
    image: "/images/formation.jpg",
    size: "small" as const,
  },
  {
    number: "04",
    title: "MISSION",
    description:
      "Be inspired to carry the Gospel into everyday campus life.",
    image: "/images/mission.jpg",
    size: "large" as const,
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
      "The registration fee is ₹950 per participant. You can register free for now — payment will be collected later (in a few weeks) through a payment page.",
  },
  {
    question: "How do I register?",
    answer:
      'Click the "Register Now" button on this page to fill out the online registration form. Payment is not required at signup. Remember the email you use — you will need the same email when paying later.',
  },
  {
    question: "How do I make the payment?",
    answer:
      "No payment is needed while registering. Open the payment page later, enter the same email ID used for registration, pay ₹950 via UPI, and submit your transaction ID. Your email is used to match the payment to your registration.",
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
