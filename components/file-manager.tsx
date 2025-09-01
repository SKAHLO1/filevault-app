"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Files, Search, Filter, Upload, Download, Trash2, MoreHorizontal, Eye, Share, Copy } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export function FileManager() {
  const [searchQuery, setSearchQuery] = useState("")
  const { toast } = useToast()

  const files = [
    {
      id: "1",
      name: "passport-scan.pdf",
      type: "Document",
      size: "2.4 MB",
      uploaded: "2024-01-15 10:30",
      status: "stored",
      cid: "QmYwAPJzv5CZsnA625s3Xf2nemtYgPpHdWEz79ojWnPbdG",
      encrypted: true,
    },
    {
      id: "2",
      name: "medical-records.pdf",
      type: "Document",
      size: "1.8 MB",
      uploaded: "2024-01-14 15:45",
      status: "stored",
      cid: "QmPChd2hVbrJ6bfo3WBcTW4iZnpHm8TEzWkLHmLpXhF32r",
      encrypted: true,
    },
    {
      id: "3",
      name: "tax-documents.zip",
      type: "Archive",
      size: "5.2 MB",
      uploaded: "2024-01-12 09:15",
      status: "pending",
      cid: "QmRf22bZar3WKmojipms22B6WewAqIt8VXriFV8XmeAoaF",
      encrypted: true,
    },
    {
      id: "4",
      name: "id-card-front.jpg",
      type: "Image",
      size: "1.2 MB",
      uploaded: "2024-01-10 14:20",
      status: "stored",
      cid: "QmTkzDwWqPbnAh5YiV5VwcTLnGdwSNsNTn2aDxdXBFca7D",
      encrypted: true,
    },
    {
      id: "5",
      name: "financial-statement.xlsx",
      type: "Spreadsheet",
      size: "890 KB",
      uploaded: "2024-01-08 11:30",
      status: "stored",
      cid: "QmUNLLsPACCz1vLxQVkXqqLX5R1X345qqfHbsf67hvA3Nn",
      encrypted: true,
    },
  ]

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "stored":
        return <Badge className="bg-green-100 text-green-800 border-green-200">Stored</Badge>
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">Pending</Badge>
      case "failed":
        return <Badge className="bg-red-100 text-red-800 border-red-200">Failed</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const handleAction = (action: string, fileName: string) => {
    toast({
      title: `${action} initiated`,
      description: `${action} for ${fileName} has been started.`,
    })
  }

  const filteredFiles = files.filter(
    (file) =>
      file.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      file.type.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">File Manager</h2>
          <p className="text-muted-foreground">Manage your encrypted files stored on Filecoin</p>
        </div>
        <Button className="flex items-center gap-2">
          <Upload className="h-4 w-4" />
          Upload Files
        </Button>
      </div>

      {/* Search and Filter */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search files..."
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
            Your Files ({filteredFiles.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Size</TableHead>
                <TableHead>Uploaded</TableHead>
                <TableHead>Status</TableHead>
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
                      <span className="font-medium">{file.name}</span>
                      {file.encrypted && (
                        <Badge variant="outline" className="text-xs">
                          🔒 Encrypted
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>{file.type}</TableCell>
                  <TableCell>{file.size}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{file.uploaded}</TableCell>
                  <TableCell>{getStatusBadge(file.status)}</TableCell>
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
                        <DropdownMenuItem onClick={() => handleAction("View", file.name)}>
                          <Eye className="h-4 w-4 mr-2" />
                          View
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleAction("Download", file.name)}>
                          <Download className="h-4 w-4 mr-2" />
                          Download
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleAction("Copy CID", file.name)}>
                          <Copy className="h-4 w-4 mr-2" />
                          Copy CID
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleAction("Share", file.name)}>
                          <Share className="h-4 w-4 mr-2" />
                          Share
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleAction("Delete", file.name)}
                          className="text-destructive"
                        >
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
