"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  Files,
  Search,
  Filter,
  Upload,
  Download,
  Trash2,
  MoreHorizontal,
  Eye,
  Share,
  Copy,
  Clock,
  RefreshCw,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface FileRecord {
  id: string
  originalName: string
  type: string
  size: number
  cid: string
  datasetId: string
  uploadedAt: string
  expiresAt: string
  status: "pending" | "active" | "expired" | "failed"
  storageProviders: string[]
  replicationFactor: number
  encrypted: boolean
}

export function FileManager() {
  const [searchQuery, setSearchQuery] = useState("")
  const [files, setFiles] = useState<FileRecord[]>([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    fetchUserFiles()
  }, [])

  const fetchUserFiles = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/files")
      if (response.ok) {
        const data = await response.json()
        setFiles(data.files || [])
      }
    } catch (error) {
      console.error("Failed to fetch files:", error)
      setFiles([
        {
          id: "1",
          originalName: "passport-scan.pdf",
          type: "application/pdf",
          size: 2457600,
          cid: "QmYwAPJzv5CZsnA625s3Xf2nemtYgPpHdWEz79ojWnPbdG",
          datasetId: "0x1234567890abcdef1234567890abcdef12345678",
          uploadedAt: "2024-01-15T10:30:00Z",
          expiresAt: "2025-01-15T10:30:00Z",
          status: "active",
          storageProviders: ["f01234", "f05678", "f09012"],
          replicationFactor: 3,
          encrypted: true,
        },
        {
          id: "2",
          originalName: "medical-records.pdf",
          type: "application/pdf",
          size: 1887436,
          cid: "QmPChd2hVbrJ6bfo3WBcTW4iZnpHm8TEzWkLHmLpXhF32r",
          datasetId: "0xabcdef1234567890abcdef1234567890abcdef12",
          uploadedAt: "2024-01-14T15:45:00Z",
          expiresAt: "2025-01-14T15:45:00Z",
          status: "active",
          storageProviders: ["f01234", "f05678"],
          replicationFactor: 2,
          encrypted: true,
        },
        {
          id: "3",
          originalName: "tax-documents.zip",
          type: "application/zip",
          size: 5452595,
          cid: "QmRf22bZar3WKmojipms22B6WewAqIt8VXriFV8XmeAoaF",
          datasetId: "0x567890abcdef1234567890abcdef1234567890ab",
          uploadedAt: "2024-01-12T09:15:00Z",
          expiresAt: "2025-01-12T09:15:00Z",
          status: "pending",
          storageProviders: ["f01234"],
          replicationFactor: 3,
          encrypted: true,
        },
      ])
    } finally {
      setLoading(false)
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-100 text-green-800 border-green-200">Active</Badge>
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">Pending</Badge>
      case "expired":
        return <Badge className="bg-orange-100 text-orange-800 border-orange-200">Expired</Badge>
      case "failed":
        return <Badge className="bg-red-100 text-red-800 border-red-200">Failed</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const handleAction = async (action: string, file: FileRecord) => {
    switch (action) {
      case "Download":
        try {
          const response = await fetch(`/api/files/${file.cid}`)
          if (response.ok) {
            const blob = await response.blob()
            const url = window.URL.createObjectURL(blob)
            const a = document.createElement("a")
            a.href = url
            a.download = file.originalName
            a.click()
            window.URL.revokeObjectURL(url)
          }
        } catch (error) {
          console.error("Download failed:", error)
        }
        break
      case "Copy CID":
        navigator.clipboard.writeText(file.cid)
        toast({
          title: "CID Copied",
          description: `CID ${file.cid} copied to clipboard.`,
        })
        break
      case "Renew":
        try {
          const response = await fetch("/api/storage/renew", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              datasetId: file.datasetId,
              additionalDuration: 365 * 24 * 3600, // 1 year
              userId: "current-user", // This would come from auth
            }),
          })
          if (response.ok) {
            toast({
              title: "Dataset Renewed",
              description: `Dataset ${file.originalName} has been renewed for 1 year.`,
            })
            fetchUserFiles() // Refresh the list
          }
        } catch (error) {
          console.error("Renewal failed:", error)
        }
        break
      default:
        toast({
          title: `${action} initiated`,
          description: `${action} for ${file.originalName} has been started.`,
        })
    }
  }

  const filteredFiles = files.filter(
    (file) =>
      file.originalName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      file.type.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">File Manager</h2>
          <p className="text-muted-foreground">Manage your encrypted datasets stored on Filecoin</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={fetchUserFiles} disabled={loading}>
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          </Button>
          <Button className="flex items-center gap-2">
            <Upload className="h-4 w-4" />
            Upload Files
          </Button>
        </div>
      </div>

      {/* Search and Filter */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search datasets..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline" className="flex items-center gap-2 bg-transparent">
              <Filter className="h-4 w-4" />
              Filter
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Files Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Files className="h-5 w-5" />
            Your Datasets ({filteredFiles.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Size</TableHead>
                <TableHead>Uploaded</TableHead>
                <TableHead>Expires</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Providers</TableHead>
                <TableHead>CID</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredFiles.map((file) => (
                <TableRow key={file.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Files className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">{file.originalName}</span>
                      {file.encrypted && (
                        <Badge variant="outline" className="text-xs">
                          🔒 Encrypted
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>{formatFileSize(file.size)}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{formatDate(file.uploadedAt)}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{formatDate(file.expiresAt)}</TableCell>
                  <TableCell>{getStatusBadge(file.status)}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <span className="text-sm">{file.storageProviders.length}</span>
                      <Badge variant="outline" className="text-xs">
                        {file.replicationFactor}x
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell>
                    <code className="text-xs bg-muted px-2 py-1 rounded">{file.cid.substring(0, 12)}...</code>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleAction("View", file)}>
                          <Eye className="h-4 w-4 mr-2" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleAction("Download", file)}>
                          <Download className="h-4 w-4 mr-2" />
                          Download
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleAction("Copy CID", file)}>
                          <Copy className="h-4 w-4 mr-2" />
                          Copy CID
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleAction("Renew", file)}>
                          <Clock className="h-4 w-4 mr-2" />
                          Renew Dataset
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleAction("Share", file)}>
                          <Share className="h-4 w-4 mr-2" />
                          Share
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleAction("Delete", file)} className="text-destructive">
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
