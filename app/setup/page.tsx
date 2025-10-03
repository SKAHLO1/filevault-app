"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle, AlertCircle, Loader2, Settings } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function SetupPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [setupComplete, setSetupComplete] = useState(false)
  const [error, setError] = useState("")
  const { toast } = useToast()

  const [depositAmount, setDepositAmount] = useState("10")
  const [rateAllowance, setRateAllowance] = useState("1")
  const [lockupAllowance, setLockupAllowance] = useState("10")
  const [maxLockupPeriod, setMaxLockupPeriod] = useState("86400")

  const handleSetup = async () => {
    try {
      setIsLoading(true)
      setError("")

      const response = await fetch("/api/filecoin/setup-payment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          depositAmount,
          rateAllowance,
          lockupAllowance,
          maxLockupPeriod: parseInt(maxLockupPeriod),
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Setup failed")
      }

      setSetupComplete(true)
      toast({
        title: "Setup Complete!",
        description: "Filecoin payment setup successful. You can now upload files.",
      })
    } catch (err) {
      console.error("Setup error:", err)
      setError(err instanceof Error ? err.message : "Setup failed")
      toast({
        title: "Setup Failed",
        description: err instanceof Error ? err.message : "An error occurred",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Filecoin Payment Setup</h1>
          <p className="text-muted-foreground">
            One-time setup required before uploading files to Filecoin testnet
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Configure Synapse SDK Payments
            </CardTitle>
            <CardDescription>
              This will deposit USDFC tokens and approve the Warm Storage service for automated payments
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {setupComplete && (
              <Alert className="bg-green-50 text-green-900 border-green-200">
                <CheckCircle className="h-4 w-4" />
                <AlertDescription>
                  Payment setup complete! You can now upload files to Filecoin.
                </AlertDescription>
              </Alert>
            )}

            <div className="space-y-4">
              <div>
                <Label htmlFor="depositAmount">Deposit Amount (USDFC)</Label>
                <Input
                  id="depositAmount"
                  type="number"
                  value={depositAmount}
                  onChange={(e) => setDepositAmount(e.target.value)}
                  placeholder="10"
                  disabled={isLoading || setupComplete}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Amount to deposit to your Synapse account (recommended: 10 USDFC)
                </p>
              </div>

              <div>
                <Label htmlFor="rateAllowance">Rate Allowance (USDFC per epoch)</Label>
                <Input
                  id="rateAllowance"
                  type="number"
                  value={rateAllowance}
                  onChange={(e) => setRateAllowance(e.target.value)}
                  placeholder="1"
                  disabled={isLoading || setupComplete}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Maximum cost per epoch (recommended: 1 USDFC)
                </p>
              </div>

              <div>
                <Label htmlFor="lockupAllowance">Lockup Allowance (USDFC)</Label>
                <Input
                  id="lockupAllowance"
                  type="number"
                  value={lockupAllowance}
                  onChange={(e) => setLockupAllowance(e.target.value)}
                  placeholder="10"
                  disabled={isLoading || setupComplete}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Total amount that can be locked up (recommended: 10 USDFC)
                </p>
              </div>

              <div>
                <Label htmlFor="maxLockupPeriod">Max Lockup Period (epochs)</Label>
                <Input
                  id="maxLockupPeriod"
                  type="number"
                  value={maxLockupPeriod}
                  onChange={(e) => setMaxLockupPeriod(e.target.value)}
                  placeholder="86400"
                  disabled={isLoading || setupComplete}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Maximum duration for lockup - 86400 epochs ≈ 30 days
                </p>
              </div>
            </div>

            <div className="pt-4">
              <Button
                onClick={handleSetup}
                disabled={isLoading || setupComplete}
                className="w-full"
                size="lg"
              >
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {setupComplete ? "Setup Complete" : "Run Payment Setup"}
              </Button>
            </div>

            <div className="text-sm text-muted-foreground space-y-2">
              <p className="font-semibold">What this does:</p>
              <ol className="list-decimal list-inside space-y-1">
                <li>Deposits USDFC tokens to your Synapse account</li>
                <li>Approves the Warm Storage service for automated payments</li>
                <li>Enables file uploads to Filecoin with PDP guarantees</li>
              </ol>
              <p className="mt-4 text-xs">
                ⚠️ Make sure you have tFIL tokens in your wallet. Get them from:{" "}
                <a
                  href="https://faucet.calibration.fildev.network/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  Filecoin Faucet
                </a>
              </p>
            </div>
          </CardContent>
        </Card>

        {setupComplete && (
          <div className="mt-6 text-center">
            <Button asChild size="lg">
              <a href="/">Go to Homepage</a>
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
