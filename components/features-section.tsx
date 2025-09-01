import { Card, CardContent } from "@/components/ui/card"
import { Globe, Zap, Users, Code, FileText, Smartphone } from "lucide-react"

export function FeaturesSection() {
  const features = [
    {
      icon: Globe,
      title: "Global Accessibility",
      description: "Access your documents from anywhere in the world with Filecoin's distributed network.",
    },
    {
      icon: Zap,
      title: "Fast Retrieval",
      description: "Quick document access with optimized retrieval protocols and caching mechanisms.",
    },
    {
      icon: Users,
      title: "Multi-User Support",
      description: "Share documents securely with team members and control access permissions.",
    },
    {
      icon: Code,
      title: "Developer API",
      description: "Integrate with your dApps using our comprehensive REST API and SDKs.",
    },
    {
      icon: FileText,
      title: "Document Types",
      description: "Support for IDs, certificates, medical records, financial proofs, and more.",
    },
    {
      icon: Smartphone,
      title: "Mobile Ready",
      description: "Responsive design works perfectly on desktop, tablet, and mobile devices.",
    },
  ]

  return (
    <section id="features" className="py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4">Powerful Features</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Everything you need to securely store and manage your sensitive documents on the decentralized web.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="border-border hover:border-accent/50 transition-colors">
              <CardContent className="p-6">
                <div className="bg-accent/10 p-3 rounded-lg w-fit mb-4">
                  <feature.icon className="h-6 w-6 text-accent" />
                </div>
                <h3 className="font-semibold mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
