"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Shield, Lock, Key, CheckCircle, AlertCircle } from "lucide-react"

interface EncryptionStatusProps {
  isEncrypted: boolean
  algorithm?: string
  keyStrength?: "weak" | "medium" | "strong"
  encryptionTime?: number
}

export function EncryptionStatus({
  isEncrypted,
  algorithm = "AES-256-GCM",
  keyStrength = "strong",
  encryptionTime,
}: EncryptionStatusProps) {
  const getStatusIcon = () => {
    if (isEncrypted) {
      return <CheckCircle className="h-4 w-4 text-green-500" />
    }
    return <AlertCircle className="h-4 w-4 text-yellow-500" />
  }

  const getStrengthColor = (strength: string) => {
    switch (strength) {
      case "strong":
        return "bg-green-100 text-green-800 border-green-200"
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "weak":
        return "bg-red-100 text-red-800 border-red-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  return (
    <Card className="border-accent/20">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {getStatusIcon()}
            <div>
              <div className="flex items-center gap-2">
                <span className="font-medium">{isEncrypted ? "Encrypted" : "Not Encrypted"}</span>
                {isEncrypted && (
                  <Badge variant="outline" className="text-xs">
                    {algorithm}
                  </Badge>
                )}
              </div>
              {encryptionTime && <p className="text-xs text-muted-foreground">Encrypted in {encryptionTime}ms</p>}
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isEncrypted && (
              <>
                <div className="flex items-center gap-1">
                  <Lock className="h-3 w-3 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">End-to-End</span>
                </div>
                <Badge className={`text-xs ${getStrengthColor(keyStrength)}`}>{keyStrength.toUpperCase()}</Badge>
              </>
            )}
          </div>
        </div>

        {isEncrypted && (
          <div className="mt-3 pt-3 border-t border-border">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <Shield className="h-4 w-4 text-accent mx-auto mb-1" />
                <p className="text-xs text-muted-foreground">Client-Side</p>
              </div>
              <div>
                <Key className="h-4 w-4 text-accent mx-auto mb-1" />
                <p className="text-xs text-muted-foreground">256-bit Key</p>
              </div>
              <div>
                <Lock className="h-4 w-4 text-accent mx-auto mb-1" />
                <p className="text-xs text-muted-foreground">Zero Knowledge</p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
