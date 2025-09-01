import { Button } from "@/components/ui/button"
import { ArrowRight, Shield, Database, Lock } from "lucide-react"

export function HeroSection() {
  return (
    <section className="py-20 lg:py-32">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-balance mb-6">
            Secure Document Storage on <span className="text-accent">Filecoin</span>
          </h1>

          <p className="text-xl text-muted-foreground text-pretty mb-8 max-w-2xl mx-auto">
            Store your sensitive documents with end-to-end encryption on the decentralized Filecoin network. Perfect for
            IDs, certificates, medical records, and financial proofs.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90">
              Start Uploading
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button size="lg" variant="outline">
              View Documentation
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl mx-auto">
            <div className="flex flex-col items-center text-center">
              <div className="bg-accent/10 p-3 rounded-lg mb-4">
                <Lock className="h-8 w-8 text-accent" />
              </div>
              <h3 className="font-semibold mb-2">End-to-End Encryption</h3>
              <p className="text-sm text-muted-foreground">Your documents are encrypted before leaving your device</p>
            </div>

            <div className="flex flex-col items-center text-center">
              <div className="bg-accent/10 p-3 rounded-lg mb-4">
                <Database className="h-8 w-8 text-accent" />
              </div>
              <h3 className="font-semibold mb-2">Decentralized Storage</h3>
              <p className="text-sm text-muted-foreground">Powered by Filecoin's distributed network</p>
            </div>

            <div className="flex flex-col items-center text-center">
              <div className="bg-accent/10 p-3 rounded-lg mb-4">
                <Shield className="h-8 w-8 text-accent" />
              </div>
              <h3 className="font-semibold mb-2">Enterprise Security</h3>
              <p className="text-sm text-muted-foreground">Bank-grade security for your sensitive data</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
