import { useNavigate, useLocation } from "react-router-dom";
import Header from "./components/Header";
import AnimatedGradientHero from "./components/AnimatedGradientHero";
import PassProbabilityFeatureCard from "./components/PassProbabilityFeatureCard";
import GradientProgressionCard from "./components/GradientProgressionCard";
import FeaturesRow from "./components/FeaturesRow";
import HowItWorksSection from "./components/HowItWorksSection";
import ComparisonSection from "./components/ComparisonSection";
import PricingSection from "./components/PricingSection";
import ContactSection from "./components/ContactSection";
import FAQSection from "./components/FAQSection";
import TermsOfService from "./components/TermsOfService";
import PrivacyPolicy from "./components/PrivacyPolicy";
import CopyrightSection from "./components/CopyrightSection";
import Footer from "./components/Footer";
import { useEffect } from "react";

export default function LandingPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const scrollToId = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const scrollTo = params.get("scrollTo");
    if (scrollTo) {
      setTimeout(() => {
        scrollToId(scrollTo);
        // Clean up URL
        window.history.replaceState({}, "", "/");
      }, 100);
    }
  }, [location]);

  const handleGetStarted = () => navigate("/login");

  return (
    <div className="min-h-screen bg-background text-foreground" id="top">
      {/* Header */}
      <Header handleGetStarted={handleGetStarted} scrollToId={scrollToId} />

      {/* Animated Gradient Hero */}
      <AnimatedGradientHero
        handleGetStarted={handleGetStarted}
        scrollToId={scrollToId}
      />

      {/* Large Pass Probability Feature Card */}
      <PassProbabilityFeatureCard />

      {/* Garden Progression Section */}
      <GradientProgressionCard handleGetStarted={handleGetStarted} />

      {/* Features Row */}
      <FeaturesRow />

      {/* Comparison Section */}
      <ComparisonSection />

      {/* How It Works */}
      <HowItWorksSection />

      {/* Pricing */}
      <PricingSection handleGetStarted={handleGetStarted} />

      {/* Contact Us Section */}
      <ContactSection />

      {/* FAQ Section */}
      <FAQSection />

      {/* TODO: Remove this section after verifying the new /terms page matches all requirements. Kept for beta. */}
      <TermsOfService />

      {/* TODO: Remove this section after verifying the new /privacy page matches all requirements. Kept for beta. */}
      <PrivacyPolicy />

      {/* Copyright & Legal Architecture Section */}
      <CopyrightSection />

      {/* Footer with Section Links */}
      <Footer scrollToId={scrollToId} />
    </div>
  );
}
