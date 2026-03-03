import { HeroSection } from "@/components/sections/HeroSection";
import { TrustBar } from "@/components/sections/TrustBar";
import { ServicesBentoGrid } from "@/components/sections/ServicesBentoGrid";
import { ProcessSteps } from "@/components/sections/ProcessSteps";
import { AboutUs } from "@/components/sections/AboutUs";
import { ContactForm } from "@/components/sections/ContactForm";
import { BottomFunnel } from "@/components/sections/BottomFunnel";

export default function Home() {
  return (
    <>
      <HeroSection />
      <TrustBar />
      <ServicesBentoGrid />
      <AboutUs />
      <ProcessSteps />
      <ContactForm />
      <BottomFunnel />
    </>
  );
}
