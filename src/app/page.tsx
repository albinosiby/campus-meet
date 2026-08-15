import Navbar from "@/landing/components/Navbar";
import Hero from "@/landing/components/Hero";
import EventSnapshot from "@/landing/components/EventSnapshot";
import AboutSection from "@/landing/components/AboutSection";
import ScriptureSection from "@/landing/components/ScriptureSection";
import ThemeSection from "@/landing/components/ThemeSection";
import GallerySection from "@/landing/components/GallerySection";
import RegistrationCTA from "@/landing/components/RegistrationCTA";
import FAQSection from "@/landing/components/FAQSection";
import FinalCTA from "@/landing/components/FinalCTA";
import LocationSection from "@/landing/components/LocationSection";
import Footer from "@/landing/components/Footer";
import MobileStickyCTA from "@/landing/components/MobileStickyCTA";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <EventSnapshot />
        <AboutSection />
        <ScriptureSection />
        <ThemeSection />
        <GallerySection />
        <RegistrationCTA />
        <FAQSection />
        <FinalCTA />
        <LocationSection />
      </main>
      <Footer />
      <MobileStickyCTA />
    </>
  );
}
