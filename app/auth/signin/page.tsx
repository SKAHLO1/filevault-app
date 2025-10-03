"use client"

import type React from "react"

import { useState } from "react"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Wallet, Mail, Lock, Shield, AlertCircle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { switchToFilecoinTestnet } from "@/lib/wallet"

export default function SignInPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const router = useRouter()
  const { toast } = useToast()

  const connectWallet = async () => {
    try {
      setIsLoading(true)
      setError("")

      if (!window.ethereum) {
        setError("Please install MetaMask or another Web3 wallet")
        return
      }

      // Request account access
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      })

      if (!accounts || accounts.length === 0) {
        setError("No accounts found")
        return
      }

      const account = accounts[0]

      // Switch to Filecoin Calibration testnet
      try {
        await switchToFilecoinTestnet()
        toast({
          title: "Network Switched",
          description: "Connected to Filecoin Calibration testnet",
        })
      } catch (networkError) {
        console.error("Network switch error:", networkError)
        setError("Failed to switch to Filecoin testnet. Please switch manually in MetaMask.")
        return
      }

      // Create a message to sign
      const message = `Sign this message to authenticate with Filecoin Vault.\n\nAddress: ${account}\nTimestamp: ${Date.now()}`

      // Request signature
      const signature = await window.ethereum.request({
        method: "personal_sign",
        params: [message, account],
      })

      // Sign in with NextAuth
      const result = await signIn("ethereum", {
        message,
        signature,
        redirect: false,
      })

      if (result?.error) {
        setError("Authentication failed")
        return
      }

      toast({
        title: "Wallet Connected",
        description: "Successfully authenticated with your Web3 wallet on Filecoin testnet",
      })

      // Small delay to ensure session is set before redirect
      setTimeout(() => {
        router.push("/")
        router.refresh()
      }, 500)
    } catch (error) {
      console.error("Wallet connection error:", error)
      setError("Failed to connect wallet")
    } finally {
      setIsLoading(false)
    }
  }

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      })

      if (result?.error) {
        setError("Invalid email or password")
        return
      }

      toast({
        title: "Signed In",
        description: "Successfully signed in with email",
      })

      router.push("/dashboard")
    } catch (error) {
      console.error("Email sign in error:", error)
      setError("Sign in failed")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
            <Shield className="h-6 w-6 text-primary" />
          </div>
          <CardTitle className="text-2xl font-bold">Welcome Back</CardTitle>
          <CardDescription>Sign in to access your encrypted Filecoin storage</CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert className="mb-6 border-destructive/50 text-destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-4">
            <div className="text-center space-y-4">
              <p className="text-sm text-muted-foreground">
                Connect your Web3 wallet to securely access your Filecoin storage
              </p>
              <Button onClick={connectWallet} disabled={isLoading} className="w-full" size="lg">
                <Wallet className="mr-2 h-4 w-4" />
                {isLoading ? "Connecting..." : "Connect Wallet"}
              </Button>
              <p className="text-xs text-muted-foreground">
                Supports MetaMask, WalletConnect, and other Web3 wallets
              </p>
              <p className="text-xs text-muted-foreground mt-4">
                Will automatically connect to <span className="font-semibold">Filecoin Calibration testnet</span>
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
