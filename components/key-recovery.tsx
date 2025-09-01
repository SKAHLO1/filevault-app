"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Key, Upload, Download, AlertTriangle, CheckCircle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export function KeyRecovery() {
  const [recoveryKey, setRecoveryKey] = useState("")
  const [testFile, setTestFile] = useState<File | null>(null)
  const [isValidKey, setIsValidKey] = useState<boolean | null>(null)
  const [backupPhrase, setBackupPhrase] = useState("")
  const { toast } = useToast()

  const validateKey = async () => {
    if (!recoveryKey.trim()) {
      toast({
        title: "No key provided",
        description: "Please enter your encryption key to validate.",
        variant: "destructive",
      })
      return
    }

    // Simulate key validation
    const isValid = recoveryKey.length >= 32 && /^[a-fA-F0-9]+$/.test(recoveryKey)
    setIsValidKey(isValid)

    if (isValid) {
      toast({
        title: "Key validated",
        description: "Your encryption key appears to be valid.",
      })
    } else {
      toast({
        title: "Invalid key",
        description: "The provided key doesn't match the expected format.",
        variant: "destructive",
      })
    }
  }

  const generateBackupPhrase = () => {
    const words = [
      "secure",
      "vault",
      "crypto",
      "chain",
      "block",
      "hash",
      "key",
      "lock",
      "safe",
      "guard",
      "shield",
      "protect",
      "encrypt",
      "decode",
      "cipher",
      "token",
    ]

    const phrase = Array.from({ length: 12 }, () => words[Math.floor(Math.random() * words.length)]).join(" ")

    setBackupPhrase(phrase)
    toast({
      title: "Backup phrase generated",
      description: "Write down this phrase and store it securely.",
    })
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setTestFile(file)
      toast({
        title: "Test file selected",
        description: `Selected ${file.name} for key testing.`,
      })
    }
  }

  const testKeyWithFile = async () => {
    if (!testFile || !recoveryKey) {
      toast({
        title: "Missing requirements",
        description: "Please provide both a key and a test file.",
        variant: "destructive",
      })
      return
    }

    // Simulate decryption test
    setTimeout(() => {
      const success = Math.random() > 0.3 // 70% success rate for demo

      if (success) {
        toast({
          title: "Key test successful",
          description: "Your key can decrypt the test file.",
        })
        setIsValidKey(true)
      } else {
        toast({
          title: "Key test failed",
          description: "Unable to decrypt the file with this key.",
          variant: "destructive",
        })
        setIsValidKey(false)
      }
    }, 2000)
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Key className="h-8 w-8 text-accent" />
          <h2 className="text-3xl font-bold">Key Recovery</h2>
        </div>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Recover access to your encrypted files or create backup recovery options for your encryption keys.
        </p>
      </div>

      <Tabs defaultValue="validate" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="validate">Validate Key</TabsTrigger>
          <TabsTrigger value="test">Test Key</TabsTrigger>
          <TabsTrigger value="backup">Backup Options</TabsTrigger>
        </TabsList>

        <TabsContent value="validate" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Key Validation</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert>
                <Key className="h-4 w-4" />
                <AlertDescription>
                  Enter your encryption key to verify its format and validity. This doesn't test decryption capability.
                </AlertDescription>
              </Alert>

              <div>
                <Label htmlFor="recovery-key">Encryption Key</Label>
                <Textarea
                  id="recovery-key"
                  value={recoveryKey}
                  onChange={(e) => setRecoveryKey(e.target.value)}
                  placeholder="Enter your encryption key here..."
                  className="font-mono text-sm"
                  rows={3}
                />
              </div>

              <Button onClick={validateKey} className="flex items-center gap-2">
                <Key className="h-4 w-4" />
                Validate Key
              </Button>

              {isValidKey !== null && (
                <Alert className={isValidKey ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"}>
                  {isValidKey ? (
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  ) : (
                    <AlertTriangle className="h-4 w-4 text-red-600" />
                  )}
                  <AlertDescription className={isValidKey ? "text-green-800" : "text-red-800"}>
                    {isValidKey
                      ? "Key format is valid and appears to be a proper encryption key."
                      : "Key format is invalid. Please check your key and try again."}
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="test" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Test Key with File</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert>
                <Upload className="h-4 w-4" />
                <AlertDescription>
                  Upload an encrypted file to test if your key can decrypt it. This helps verify key correctness.
                </AlertDescription>
              </Alert>

              <div>
                <Label htmlFor="test-key">Encryption Key</Label>
                <Input
                  id="test-key"
                  value={recoveryKey}
                  onChange={(e) => setRecoveryKey(e.target.value)}
                  placeholder="Enter your encryption key"
                  className="font-mono text-sm"
                />
              </div>

              <div>
                <Label htmlFor="test-file">Test File</Label>
                <Input id="test-file" type="file" onChange={handleFileUpload} accept=".enc,.encrypted" />
                {testFile && (
                  <p className="text-sm text-muted-foreground mt-1">
                    Selected: {testFile.name} ({(testFile.size / 1024).toFixed(1)} KB)
                  </p>
                )}
              </div>

              <Button
                onClick={testKeyWithFile}
                disabled={!testFile || !recoveryKey}
                className="flex items-center gap-2"
              >
                <Key className="h-4 w-4" />
                Test Decryption
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="backup" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Backup Recovery Options</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  Create additional recovery methods for your encryption keys. Store these securely and separately.
                </AlertDescription>
              </Alert>

              <div className="space-y-4">
                <div>
                  <Label>Recovery Phrase</Label>
                  <div className="flex gap-2 mt-2">
                    <Input
                      value={backupPhrase}
                      readOnly
                      placeholder="Click generate to create a recovery phrase"
                      className="font-mono text-sm"
                    />
                    <Button variant="outline" onClick={generateBackupPhrase}>
                      Generate
                    </Button>
                  </div>
                  {backupPhrase && (
                    <p className="text-xs text-muted-foreground mt-1">
                      Write this phrase down and store it in a secure location separate from your key.
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card className="p-4">
                    <h4 className="font-semibold mb-2 flex items-center gap-2">
                      <Download className="h-4 w-4" />
                      Key Export
                    </h4>
                    <p className="text-sm text-muted-foreground mb-3">
                      Export your key in a secure format for backup storage.
                    </p>
                    <Button variant="outline" size="sm">
                      Export Key
                    </Button>
                  </Card>

                  <Card className="p-4">
                    <h4 className="font-semibold mb-2 flex items-center gap-2">
                      <Key className="h-4 w-4" />
                      Split Key
                    </h4>
                    <p className="text-sm text-muted-foreground mb-3">
                      Split your key into multiple parts for distributed storage.
                    </p>
                    <Button variant="outline" size="sm">
                      Create Shares
                    </Button>
                  </Card>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
