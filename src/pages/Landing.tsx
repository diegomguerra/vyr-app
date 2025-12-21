import {
  LandingNav,
  Hero,
  ProductCard,
  HowItWorks,
  BenefitSection,
  FAQ,
  Footer,
  GradientBanner,
} from "@/components/landing";

export default function Landing() {
  return (
    <div className="min-h-screen bg-background">
      <LandingNav />
      <Hero />
      <ProductCard />
      <GradientBanner variant="newsletter" />
      <HowItWorks />
      <GradientBanner variant="info" />
      <BenefitSection />
      <GradientBanner variant="cta" />
      <FAQ />
      <Footer />
    </div>
  );
}
