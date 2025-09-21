import { Shield, Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { UserNav } from "@/components/user-nav"
import Link from "next/link"

export function Header() {
  return (
    <header className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <Link href="/" className="flex items-center gap-2">
              <Shield className="h-8 w-8 text-accent" />
              <span className="text-xl font-bold text-foreground">FilecoinVault</span>
            </Link>
          </div>

          <nav className="hidden md:flex items-center gap-6">
            <a href="#features" className="text-muted-foreground hover:text-foreground transition-colors">
              Features
            </a>
            <a href="#security" className="text-muted-foreground hover:text-foreground transition-colors">
              Security
            </a>
            <Link href="/encryption" className="text-muted-foreground hover:text-foreground transition-colors">
              Encryption
            </Link>
            <Link href="/recovery" className="text-muted-foreground hover:text-foreground transition-colors">
              Recovery
            </Link>
            <Link href="/dashboard" className="text-muted-foreground hover:text-foreground transition-colors">
              Dashboard
            </Link>
            <a href="#docs" className="text-muted-foreground hover:text-foreground transition-colors">
              Documentation
            </a>
          </nav>

          <div className="flex items-center gap-4">
            <div className="hidden md:flex">
              <UserNav />
            </div>
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}
