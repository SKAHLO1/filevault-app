import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Shield, Key, Server, Eye, Lock, CheckCircle } from "lucide-react"

export function SecuritySection() {
  const securityFeatures = [
    {
      icon: Key,
      title: "AES-256 Encryption",
      description: "Military-grade encryption ensures your data remains secure at all times.",
      status: "Active",
    },
    {
      icon: Eye,
      title: "Zero-Knowledge Architecture",
      description: "We never see your data - encryption happens client-side before upload.",
      status: "Active",
    },
    {
      icon: Server,
      title: "Distributed Storage",
      description: "Files are distributed across multiple Filecoin storage providers.",
      status: "Active",
    },
    {
      icon: Lock,
      title: "Private Key Control",
      description: "You control your encryption keys - we never have access to them.",
      status: "Active",
    },
  ]

  return (
    <section id="security" className="py-20 bg-muted/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Shield className="h-8 w-8 text-accent" />
            <h2 className="text-3xl font-bold">Enterprise-Grade Security</h2>
          </div>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Your sensitive documents deserve the highest level of protection. Our security measures ensure your data
            remains private and secure.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {securityFeatures.map((feature, index) => (
            <Card key={index} className="border-border">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="bg-accent/10 p-3 rounded-lg flex-shrink-0">
                    <feature.icon className="h-6 w-6 text-accent" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold">{feature.title}</h3>
                      <Badge variant="secondary" className="text-xs">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        {feature.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <Card className="max-w-2xl mx-auto border-accent/20 bg-accent/5">
            <CardContent className="p-8">
              <Shield className="h-12 w-12 text-accent mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Security Guarantee</h3>
              <p className="text-muted-foreground">
                We use the same security standards trusted by banks and government institutions. Your documents are
                protected by multiple layers of encryption and distributed across the most secure decentralized network.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}
