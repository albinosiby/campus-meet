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
  target: "Campus Students",
  description:
    "A gathering of campus youth to encounter, connect, grow and live the mission together.",
  registerUrl: "/register",
};

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
    src: "/images/hero-bg.jpg",
    alt: "Youth worship gathering with stage lights",
    span: "col-span-2 row-span-2",
  },
  {
    src: "/images/gallery-bus.jpg",
    alt: "Students waving from campus bus",
    span: "col-span-1 row-span-1",
  },
  {
    src: "/images/gallery-prayer.jpg",
    alt: "Youth praying together in a circle",
    span: "col-span-1 row-span-2",
  },
  {
    src: "/images/about.jpg",
    alt: "College students chatting on campus green",
    span: "col-span-1 row-span-1",
  },
  {
    src: "/images/gallery-celebration.jpg",
    alt: "Students celebrating at campus event",
    span: "col-span-2 row-span-1",
  },
  {
    src: "/images/community.jpg",
    alt: "Youth fellowship around bonfire",
    span: "col-span-1 row-span-1",
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
      "Registration details including the fee will be announced soon. Follow our social media channels for the latest updates.",
  },
  {
    question: "How do I register?",
    answer:
      'Click the "Register Now" button on this page to fill out the online registration form. You will receive a confirmation once your registration and payment are verified.',
  },
  {
    question: "How do I make the payment?",
    answer:
      "Payment details will be provided during the registration process. Multiple payment methods will be available for your convenience.",
  },
  {
    question: "What should I bring?",
    answer:
      "Bring a Bible, a notebook, personal essentials, and an open heart. A detailed packing list will be shared closer to the event date.",
  },
  {
    question: "Where is the venue?",
    answer:
      "The event will be held at Don Bosco Arts & Science College, Angadikadavu, Kerala. Detailed directions and transportation options will be shared after registration.",
  },
] as const;

export const SOCIAL_LINKS = [
  {
    name: "Instagram",
    url: "#",
    icon: "instagram",
  },
  {
    name: "WhatsApp",
    url: "#",
    icon: "whatsapp",
  },
  {
    name: "YouTube",
    url: "#",
    icon: "youtube",
  },
] as const;
