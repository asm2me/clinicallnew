import {
  CTASection,
  FeatureGrid,
  HeroSection,
  HowItWorks,
  PricingSection,
  TestimonialsSection,
  TrustBand,
} from '@/components/marketing';

export default function HomePage() {
  return (
    <div className="relative overflow-hidden bg-background text-foreground">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[32rem] bg-gradient-to-b from-primary/10 via-transparent to-transparent" />
      <div className="pointer-events-none absolute left-0 top-40 h-72 w-72 rounded-full bg-accent/50 blur-3xl" />
      <div className="pointer-events-none absolute right-0 top-[32rem] h-80 w-80 rounded-full bg-secondary/40 blur-3xl" />

      <div className="relative">
        <HeroSection />
        <TrustBand />
        <FeatureGrid />
        <HowItWorks />
        <TestimonialsSection />
        <PricingSection />
        <CTASection />
      </div>
    </div>
  );
}