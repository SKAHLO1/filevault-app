"use client"

import { useState, useCallback } from "react"
import { useDropzone } from "react-dropzone"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Upload, File, X, CheckCircle, AlertCircle, Key } from "lucide-react"
import { cn } from "@/lib/utils"
import { generateEncryptionKey } from "@/lib/encryption"

interface UploadedFile {
  id: string
  file: File
  status: "uploading" | "completed" | "error"
  progress: number
  type: string
  cid?: string
  encryptionKey?: string
}

export function UploadSection() {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([])
  const [userId] = useState("user-" + Math.random().toString(36).substr(2, 9)) // Mock user ID

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      const newFiles = acceptedFiles.map((file) => ({
        id: Math.random().toString(36).substr(2, 9),
        file,
        status: "uploading" as const,
        progress: 0,
        type: getDocumentType(file.name),
        encryptionKey: generateEncryptionKey(),
      }))

      setUploadedFiles((prev) => [...prev, ...newFiles])

      // Upload files to Filecoin API
      for (const uploadFile of newFiles) {
        try {
          const formData = new FormData()
          formData.append("file", uploadFile.file)
          formData.append("userId", userId)
          formData.append("encryptionKey", uploadFile.encryptionKey!)

          // Simulate progress updates
          const progressInterval = setInterval(() => {
            setUploadedFiles((prev) =>
              prev.map((f) => (f.id === uploadFile.id ? { ...f, progress: Math.min(f.progress + 15, 90) } : f)),
            )
          }, 300)

          const response = await fetch("/api/upload", {
            method: "POST",
            body: formData,
          })

          clearInterval(progressInterval)

          if (response.ok) {
            const result = await response.json()
            setUploadedFiles((prev) =>
              prev.map((f) =>
                f.id === uploadFile.id ? { ...f, status: "completed", progress: 100, cid: result.file.cid } : f,
              ),
            )
          } else {
            throw new Error("Upload failed")
          }
        } catch (error) {
          console.error("Upload error:", error)
          setUploadedFiles((prev) =>
            prev.map((f) => (f.id === uploadFile.id ? { ...f, status: "error", progress: 0 } : f)),
          )
        }
      }
    },
    [userId],
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/pdf": [".pdf"],
      "image/*": [".png", ".jpg", ".jpeg"],
      "application/msword": [".doc"],
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [".docx"],
    },
  })

  const removeFile = (id: string) => {
    setUploadedFiles((prev) => prev.filter((f) => f.id !== id))
  }

  const getDocumentType = (filename: string): string => {
    const ext = filename.split(".").pop()?.toLowerCase()
    switch (ext) {
      case "pdf":
        return "Document"
      case "jpg":
      case "jpeg":
      case "png":
        return "Image"
      case "doc":
      case "docx":
        return "Word Document"
      default:
        return "File"
    }
  }

  return (
    <section id="upload" className="py-20 bg-muted/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Upload Your Documents</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Drag and drop your files or click to browse. All files are encrypted before upload to Filecoin.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <Card className="mb-8">
            <CardContent className="p-8">
              <div
                {...getRootProps()}
                className={cn(
                  "border-2 border-dashed rounded-lg p-12 text-center cursor-pointer transition-colors",
                  isDragActive ? "border-accent bg-accent/5" : "border-border hover:border-accent/50",
                )}
              >
                <input {...getInputProps()} />
                <Upload className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                {isDragActive ? (
                  <p className="text-lg font-medium text-accent">Drop your files here...</p>
                ) : (
                  <>
                    <p className="text-lg font-medium mb-2">Drag & drop files here, or click to select</p>
                    <p className="text-sm text-muted-foreground mb-4">
                      Supports PDF, Images, Word documents up to 10MB
                    </p>
                    <Button variant="outline">Choose Files</Button>
                  </>
                )}
              </div>
            </CardContent>
          </Card>

          {uploadedFiles.length > 0 && (
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold mb-4">Uploaded Files</h3>
                <div className="space-y-4">
                  {uploadedFiles.map((uploadFile) => (
                    <div key={uploadFile.id} className="flex items-center gap-4 p-4 border rounded-lg">
                      <File className="h-8 w-8 text-muted-foreground flex-shrink-0" />

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="font-medium truncate">{uploadFile.file.name}</p>
                          <Badge variant="secondary" className="text-xs">
                            {uploadFile.type}
                          </Badge>
                          {uploadFile.cid && (
                            <Badge variant="outline" className="text-xs">
                              CID: {uploadFile.cid.substring(0, 8)}...
                            </Badge>
                          )}
                        </div>

                        <div className="flex items-center gap-2">
                          <div className="flex-1 bg-muted rounded-full h-2">
                            <div
                              className="bg-accent h-2 rounded-full transition-all duration-300"
                              style={{ width: `${uploadFile.progress}%` }}
                            />
                          </div>
                          <span className="text-xs text-muted-foreground">{uploadFile.progress}%</span>
                        </div>

                        {uploadFile.status === "completed" && uploadFile.encryptionKey && (
                          <div className="flex items-center gap-2 mt-2 p-2 bg-muted/50 rounded text-xs">
                            <Key className="h-3 w-3" />
                            <span className="text-muted-foreground">Encryption Key:</span>
                            <code className="bg-background px-1 rounded font-mono">
                              {uploadFile.encryptionKey.substring(0, 16)}...
                            </code>
                          </div>
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        {uploadFile.status === "completed" && <CheckCircle className="h-5 w-5 text-green-500" />}
                        {uploadFile.status === "error" && <AlertCircle className="h-5 w-5 text-destructive" />}
                        <Button variant="ghost" size="sm" onClick={() => removeFile(uploadFile.id)}>
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </section>
  )
}
