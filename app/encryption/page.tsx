import { EncryptionSettings } from "@/components/encryption-settings"

export default function EncryptionPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <EncryptionSettings />
      </div>
    </div>
  )
}
