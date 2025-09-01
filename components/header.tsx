import { Shield, Menu } from "lucide-react"
import { Button } from "@/components/ui/button"

export function Header() {
  return (
    <header className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="h-8 w-8 text-accent" />
            <span className="text-xl font-bold text-foreground">FilecoinVault</span>
          </div>

          <nav className="hidden md:flex items-center gap-6">
            <a href="#features" className="text-muted-foreground hover:text-foreground transition-colors">
              Features
            </a>
            <a href="#security" className="text-muted-foreground hover:text-foreground transition-colors">
              Security
            </a>
            <a href="/encryption" className="text-muted-foreground hover:text-foreground transition-colors">
              Encryption
            </a>
            <a href="/recovery" className="text-muted-foreground hover:text-foreground transition-colors">
              Recovery
            </a>
            <a href="/dashboard" className="text-muted-foreground hover:text-foreground transition-colors">
              Dashboard
            </a>
            <a href="#docs" className="text-muted-foreground hover:text-foreground transition-colors">
              Documentation
            </a>
          </nav>

          <div className="flex items-center gap-4">
            <Button variant="ghost" className="hidden md:inline-flex">
              Sign In
            </Button>
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90">Get Started</Button>
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}
