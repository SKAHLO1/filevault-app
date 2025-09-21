import { Header } from "@/components/header"
import { HeroSection } from "@/components/hero-section"
import { UploadSection } from "@/components/upload-section"
import { FeaturesSection } from "@/components/features-section"
import { SecuritySection } from "@/components/security-section"
import { Footer } from "@/components/footer"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <HeroSection />
        <UploadSection />
        <FeaturesSection />
        <SecuritySection />
      </main>
      <Footer />
    </div>
  )
}
