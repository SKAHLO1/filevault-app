"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Files, HardDrive, Shield, TrendingUp, Upload, Download, Clock, CheckCircle, AlertCircle } from "lucide-react"

export function DashboardOverview() {
  const stats = [
    {
      title: "Total Files",
      value: "24",
      change: "+3 this week",
      icon: Files,
      color: "text-blue-600",
    },
    {
      title: "Storage Used",
      value: "2.4 GB",
      change: "68% of 3.5 GB",
      icon: HardDrive,
      color: "text-green-600",
    },
    {
      title: "Encrypted Files",
      value: "24",
      change: "100% encrypted",
      icon: Shield,
      color: "text-purple-600",
    },
    {
      title: "Active Deals",
      value: "18",
      change: "6 pending",
      icon: TrendingUp,
      color: "text-orange-600",
    },
  ]

  const recentFiles = [
    {
      name: "passport-scan.pdf",
      size: "2.4 MB",
      uploaded: "2 hours ago",
      status: "stored",
      cid: "QmYwAPJzv5CZsnA625s3Xf2nemtYgPpHdWEz79ojWnPbdG",
    },
    {
      name: "medical-records.pdf",
      size: "1.8 MB",
      uploaded: "1 day ago",
      status: "stored",
      cid: "QmPChd2hVbrJ6bfo3WBcTW4iZnpHm8TEzWkLHmLpXhF32r",
    },
    {
      name: "tax-documents.zip",
      size: "5.2 MB",
      uploaded: "3 days ago",
      status: "pending",
      cid: "QmRf22bZar3WKmojipms22B6WewAqIt8VXriFV8XmeAoaF",
    },
  ]

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "stored":
        return <Badge className="bg-green-100 text-green-800 border-green-200">Stored</Badge>
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">Pending</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Welcome back, John!</h2>
          <p className="text-muted-foreground">Here's what's happening with your encrypted storage on Filecoin.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="flex items-center gap-2 bg-transparent">
            <Download className="h-4 w-4" />
            Export Data
          </Button>
          <Button className="flex items-center gap-2">
            <Upload className="h-4 w-4" />
            Upload Files
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                  <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                  <p className="text-xs text-muted-foreground mt-1">{stat.change}</p>
                </div>
                <div className={`p-3 rounded-lg bg-muted/50 ${stat.color}`}>
                  <stat.icon className="h-6 w-6" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Storage Usage */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <HardDrive className="h-5 w-5" />
              Storage Usage
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Used Storage</span>
                <span>2.4 GB / 3.5 GB</span>
              </div>
              <Progress value={68} className="h-2" />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  Documents
                </span>
                <span>1.2 GB</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  Images
                </span>
                <span>0.8 GB</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                  Archives
                </span>
                <span>0.4 GB</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Security Status */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Security Status
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span className="text-sm font-medium">All Files Encrypted</span>
              </div>
              <Badge className="bg-green-100 text-green-800 border-green-200">Active</Badge>
            </div>

            <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span className="text-sm font-medium">Backup Keys Stored</span>
              </div>
              <Badge className="bg-green-100 text-green-800 border-green-200">Secure</Badge>
            </div>

            <div className="flex items-center justify-between p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-yellow-600" />
                <span className="text-sm font-medium">Key Rotation Due</span>
              </div>
              <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">Pending</Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Files */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Recent Files
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentFiles.map((file, index) => (
              <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-3">
                  <Files className="h-8 w-8 text-muted-foreground" />
                  <div>
                    <p className="font-medium text-foreground">{file.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {file.size} • {file.uploaded}
                    </p>
                    <p className="text-xs text-muted-foreground font-mono">CID: {file.cid.substring(0, 20)}...</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  {getStatusBadge(file.status)}
                  <Button variant="ghost" size="sm">
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 text-center">
            <Button variant="outline">View All Files</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
