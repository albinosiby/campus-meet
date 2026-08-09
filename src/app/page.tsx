import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import EventSnapshot from "@/components/EventSnapshot";
import AboutSection from "@/components/AboutSection";
import ExperienceSection from "@/components/ExperienceSection";
import ThemeSection from "@/components/ThemeSection";
import GallerySection from "@/components/GallerySection";
import RegistrationCTA from "@/components/RegistrationCTA";
import FAQSection from "@/components/FAQSection";
import FinalCTA from "@/components/FinalCTA";
import Footer from "@/components/Footer";
import MobileStickyCTA from "@/components/MobileStickyCTA";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <EventSnapshot />
        <AboutSection />
        <ExperienceSection />
        <ThemeSection />
        <GallerySection />
        <RegistrationCTA />
        <FAQSection />
        <FinalCTA />
      </main>
      <Footer />
      <MobileStickyCTA />
    </>
  );
}
