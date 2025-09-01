"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { BarChart3, TrendingUp, HardDrive, Globe, DollarSign } from "lucide-react"

export function StorageAnalytics() {
  const storageProviders = [
    { name: "Provider f01234", location: "US-East", storage: "1.2 GB", deals: 8, reliability: 99.9 },
    { name: "Provider f05678", location: "EU-West", storage: "0.8 GB", deals: 6, reliability: 99.7 },
    { name: "Provider f09012", location: "Asia-Pacific", storage: "0.4 GB", deals: 4, reliability: 99.8 },
  ]

  const monthlyUsage = [
    { month: "Oct", storage: 1.8, cost: 12.5 },
    { month: "Nov", storage: 2.1, cost: 14.2 },
    { month: "Dec", storage: 2.4, cost: 16.8 },
    { month: "Jan", storage: 2.4, cost: 16.8 },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-foreground">Storage Analytics</h2>
        <p className="text-muted-foreground">Monitor your Filecoin storage usage, costs, and provider performance</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Storage</p>
                <p className="text-2xl font-bold text-foreground">2.4 GB</p>
                <p className="text-xs text-green-600 mt-1">+0.3 GB this month</p>
              </div>
              <HardDrive className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Monthly Cost</p>
                <p className="text-2xl font-bold text-foreground">$16.80</p>
                <p className="text-xs text-green-600 mt-1">-$2.40 vs last month</p>
              </div>
              <DollarSign className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Active Deals</p>
                <p className="text-2xl font-bold text-foreground">18</p>
                <p className="text-xs text-blue-600 mt-1">Across 3 providers</p>
              </div>
              <BarChart3 className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Avg Reliability</p>
                <p className="text-2xl font-bold text-foreground">99.8%</p>
                <p className="text-xs text-green-600 mt-1">Excellent uptime</p>
              </div>
              <TrendingUp className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Storage Usage Over Time */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Storage Usage Trend
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {monthlyUsage.map((data, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium w-8">{data.month}</span>
                    <div className="flex-1 w-32">
                      <Progress value={(data.storage / 3.5) * 100} className="h-2" />
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">{data.storage} GB</p>
                    <p className="text-xs text-muted-foreground">${data.cost}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Cost Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              Cost Breakdown
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                <span className="text-sm font-medium">Storage Fees</span>
                <span className="text-sm font-bold">$12.60</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                <span className="text-sm font-medium">Retrieval Fees</span>
                <span className="text-sm font-bold">$2.40</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                <span className="text-sm font-medium">Network Fees</span>
                <span className="text-sm font-bold">$1.80</span>
              </div>
              <div className="border-t pt-3">
                <div className="flex justify-between items-center">
                  <span className="font-semibold">Total Monthly</span>
                  <span className="text-lg font-bold text-foreground">$16.80</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Storage Providers */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5" />
            Storage Providers
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {storageProviders.map((provider, index) => (
              <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center">
                    <Globe className="h-5 w-5 text-accent" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{provider.name}</p>
                    <p className="text-sm text-muted-foreground">{provider.location}</p>
                  </div>
                </div>

                <div className="flex items-center gap-6">
                  <div className="text-center">
                    <p className="text-sm font-medium">{provider.storage}</p>
                    <p className="text-xs text-muted-foreground">Storage</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-medium">{provider.deals}</p>
                    <p className="text-xs text-muted-foreground">Deals</p>
                  </div>
                  <div className="text-center">
                    <Badge className="bg-green-100 text-green-800 border-green-200">{provider.reliability}%</Badge>
                    <p className="text-xs text-muted-foreground mt-1">Uptime</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
