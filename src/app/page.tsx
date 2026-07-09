"use client";

import dynamic from "next/dynamic";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const GlobeHero = dynamic(() => import("@/components/GlobeHero"), { ssr: false });
import FeaturesSection from "@/components/sections/FeaturesSection";
import StatsSection from "@/components/sections/StatsSection";
import TestimonialsSection from "@/components/sections/TestimonialsSection";
import PricingSection from "@/components/sections/PricingSection";
import FAQSection from "@/components/sections/FAQSection";
import CTASection from "@/components/sections/CTASection";

export default function Home() {
  return (
    <div className="relative overflow-hidden noise-overlay">
      {/* Background Gradient Orbs */}
      <div
        className="gradient-orb gradient-orb-blue w-[600px] h-[600px] -top-48 -left-48 animate-[orb-float-1_8s_ease-in-out_infinite]"
        aria-hidden="true"
      />
      <div
        className="gradient-orb gradient-orb-purple w-[500px] h-[500px] top-1/3 -right-32 animate-[orb-float-2_12s_ease-in-out_infinite]"
        aria-hidden="true"
      />
      <div
        className="gradient-orb gradient-orb-cyan w-[400px] h-[400px] bottom-1/4 left-1/4 animate-[orb-float_3_10s_ease-in-out_infinite]"
        aria-hidden="true"
      />

      {/* Page Content */}
      <div className="relative z-[1]">
        <Navbar />
        <main>
          <GlobeHero />
          <FeaturesSection />
          <StatsSection />
          <TestimonialsSection />
          <PricingSection />
          <FAQSection />
          <CTASection />
        </main>
        <Footer />
      </div>
    </div>
  );
}
