import { GlassmorphismNav } from "./_component/ui/glassmorphism-nav"
import { HeroSection } from "./_component/ui/hero-section"
import { FeaturesSection } from "./_component/ui/features-section"
import Aurora from "./_component/ui/Aurora"
import { TestimonialsSection } from "./_component/ui/testimonials-section"
import { CTASection } from "./_component/ui/cta-section"
import { Footer } from "./_component/ui/footer"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-black overflow-hidden">
      <main className="min-h-screen relative overflow-hidden">
        <div className="fixed inset-0 w-full h-full">
          <Aurora colorStops={["#1e3a8a", "#3b82f6", "#1e3a8a"]} amplitude={1.2} blend={0.6} speed={0.8} />
        </div>
        <div className="relative z-10">
          <GlassmorphismNav />
          <HeroSection />
          <FeaturesSection />
          <TestimonialsSection />
          <CTASection />
          <Footer />
        </div>
      </main>
    </div>
  )
}
