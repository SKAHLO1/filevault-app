"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Key, Shield, Copy, RefreshCw, Download, AlertTriangle, CheckCircle } from "lucide-react"
import { generateEncryptionKey, hashPassword } from "@/lib/encryption"
import { useToast } from "@/hooks/use-toast"

export function EncryptionSettings() {
  const [generatedKey, setGeneratedKey] = useState("")
  const [passwordKey, setPasswordKey] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [keyStrength, setKeyStrength] = useState<"weak" | "medium" | "strong">("medium")
  const { toast } = useToast()

  const generateNewKey = () => {
    const newKey = generateEncryptionKey()
    setGeneratedKey(newKey)
    toast({
      title: "New encryption key generated",
      description: "Make sure to save this key securely - you'll need it to decrypt your files.",
    })
  }

  const deriveKeyFromPassword = () => {
    if (password !== confirmPassword) {
      toast({
        title: "Password mismatch",
        description: "Please ensure both password fields match.",
        variant: "destructive",
      })
      return
    }

    if (password.length < 8) {
      toast({
        title: "Password too short",
        description: "Password must be at least 8 characters long.",
        variant: "destructive",
      })
      return
    }

    const { hash } = hashPassword(password)
    setPasswordKey(hash)

    // Determine password strength
    const hasUpper = /[A-Z]/.test(password)
    const hasLower = /[a-z]/.test(password)
    const hasNumbers = /\d/.test(password)
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password)
    const isLong = password.length >= 12

    if (hasUpper && hasLower && hasNumbers && hasSpecial && isLong) {
      setKeyStrength("strong")
    } else if ((hasUpper || hasLower) && hasNumbers && password.length >= 8) {
      setKeyStrength("medium")
    } else {
      setKeyStrength("weak")
    }

    toast({
      title: "Encryption key derived",
      description: "Your password has been converted to an encryption key.",
    })
  }

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text)
    toast({
      title: `${label} copied`,
      description: "The key has been copied to your clipboard.",
    })
  }

  const downloadKey = (key: string, filename: string) => {
    const blob = new Blob([key], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = filename
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)

    toast({
      title: "Key downloaded",
      description: "Store this file in a secure location.",
    })
  }

  const getStrengthColor = (strength: string) => {
    switch (strength) {
      case "strong":
        return "text-green-600"
      case "medium":
        return "text-yellow-600"
      case "weak":
        return "text-red-600"
      default:
        return "text-muted-foreground"
    }
  }

  const getStrengthBadgeVariant = (strength: string) => {
    switch (strength) {
      case "strong":
        return "default"
      case "medium":
        return "secondary"
      case "weak":
        return "destructive"
      default:
        return "outline"
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Shield className="h-8 w-8 text-accent" />
          <h2 className="text-3xl font-bold">Encryption Settings</h2>
        </div>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Manage your encryption keys and security settings. Choose between generated keys for maximum security or
          password-derived keys for convenience.
        </p>
      </div>

      <Tabs defaultValue="generate" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="generate">Generate Key</TabsTrigger>
          <TabsTrigger value="password">Password-Based</TabsTrigger>
        </TabsList>

        <TabsContent value="generate" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Key className="h-5 w-5" />
                Generated Encryption Key
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert>
                <Shield className="h-4 w-4" />
                <AlertDescription>
                  Generated keys provide the highest level of security. Make sure to store your key securely - if you
                  lose it, your files cannot be recovered.
                </AlertDescription>
              </Alert>

              <div className="flex gap-2">
                <Button onClick={generateNewKey} className="flex items-center gap-2">
                  <RefreshCw className="h-4 w-4" />
                  Generate New Key
                </Button>
              </div>

              {generatedKey && (
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="generated-key">Your Encryption Key</Label>
                    <div className="flex gap-2 mt-2">
                      <Input id="generated-key" value={generatedKey} readOnly className="font-mono text-sm" />
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => copyToClipboard(generatedKey, "Encryption key")}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => downloadKey(generatedKey, "encryption-key.txt")}
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <Alert>
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription>
                      <strong>Important:</strong> Save this key immediately. You'll need it to decrypt your files. We
                      recommend storing it in a password manager or secure location.
                    </AlertDescription>
                  </Alert>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="password" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Key className="h-5 w-5" />
                Password-Based Encryption
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert>
                <Shield className="h-4 w-4" />
                <AlertDescription>
                  Password-based keys are more convenient but potentially less secure. Use a strong, unique password
                  that you can remember.
                </AlertDescription>
              </Alert>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter a strong password"
                  />
                </div>
                <div>
                  <Label htmlFor="confirm-password">Confirm Password</Label>
                  <Input
                    id="confirm-password"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm your password"
                  />
                </div>
              </div>

              <Button onClick={deriveKeyFromPassword} className="flex items-center gap-2">
                <Key className="h-4 w-4" />
                Generate Key from Password
              </Button>

              {passwordKey && (
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span>Encryption key generated successfully</span>
                    <Badge variant={getStrengthBadgeVariant(keyStrength)} className={getStrengthColor(keyStrength)}>
                      {keyStrength.toUpperCase()} Security
                    </Badge>
                  </div>

                  <div>
                    <Label htmlFor="password-key">Derived Encryption Key</Label>
                    <div className="flex gap-2 mt-2">
                      <Input
                        id="password-key"
                        value={passwordKey.substring(0, 32) + "..."}
                        readOnly
                        className="font-mono text-sm"
                      />
                      <Button variant="outline" size="icon" onClick={() => copyToClipboard(passwordKey, "Derived key")}>
                        <Copy className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => downloadKey(passwordKey, "password-derived-key.txt")}
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <Alert>
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription>
                      Remember your password - you'll need it to access your files. The derived key is shown for backup
                      purposes only.
                    </AlertDescription>
                  </Alert>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Card>
        <CardHeader>
          <CardTitle>Security Best Practices</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold mb-2 flex items-center gap-2">
                <Shield className="h-4 w-4 text-green-500" />
                Do
              </h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Store your encryption key in a secure password manager</li>
                <li>• Use strong, unique passwords for password-based keys</li>
                <li>• Keep backup copies of your keys in multiple secure locations</li>
                <li>• Test key recovery before uploading important files</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2 flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-red-500" />
                Don't
              </h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Share your encryption keys with anyone</li>
                <li>• Store keys in plain text files on your computer</li>
                <li>• Use the same password for multiple services</li>
                <li>• Forget to backup your keys before uploading files</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
