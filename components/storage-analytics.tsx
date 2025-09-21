"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { BarChart3, TrendingUp, HardDrive, Globe, DollarSign, Shield } from "lucide-react"

export function StorageAnalytics() {
  const [analytics, setAnalytics] = useState({
    totalStorage: 0,
    totalDatasets: 0,
    monthlyCost: 0,
    avgReliability: 0,
    activeDeals: 0,
    storageProviders: [],
    monthlyUsage: [],
    costBreakdown: {
      storageFees: 0,
      retrievalFees: 0,
      networkFees: 0,
    },
  })

  useEffect(() => {
    fetchAnalytics()
  }, [])

  const fetchAnalytics = async () => {
    try {
      const response = await fetch("/api/analytics")
      if (response.ok) {
        const data = await response.json()
        setAnalytics(data)
      }
    } catch (error) {
      console.error("Failed to fetch analytics:", error)
      setAnalytics({
        totalStorage: 2.4,
        totalDatasets: 18,
        monthlyCost: 16.8,
        avgReliability: 99.8,
        activeDeals: 18,
        storageProviders: [
          {
            address: "f01234",
            name: "Provider f01234",
            location: "US-East",
            storage: "1.2 GB",
            datasets: 8,
            reliability: 99.9,
            reputation: 95,
            pricePerGB: 0.007,
          },
          {
            address: "f05678",
            name: "Provider f05678",
            location: "EU-West",
            storage: "0.8 GB",
            datasets: 6,
            reliability: 99.7,
            reputation: 92,
            pricePerGB: 0.008,
          },
          {
            address: "f09012",
            name: "Provider f09012",
            location: "Asia-Pacific",
            storage: "0.4 GB",
            datasets: 4,
            reliability: 99.8,
            reputation: 94,
            pricePerGB: 0.006,
          },
        ],
        monthlyUsage: [
          { month: "Oct", storage: 1.8, cost: 12.5, datasets: 14 },
          { month: "Nov", storage: 2.1, cost: 14.2, datasets: 16 },
          { month: "Dec", storage: 2.4, cost: 16.8, datasets: 18 },
          { month: "Jan", storage: 2.4, cost: 16.8, datasets: 18 },
        ],
        costBreakdown: {
          storageFees: 12.6,
          retrievalFees: 2.4,
          networkFees: 1.8,
        },
      })
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-foreground">Storage Analytics</h2>
        <p className="text-muted-foreground">Monitor your Filecoin datasets, costs, and provider performance</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Storage</p>
                <p className="text-2xl font-bold text-foreground">{analytics.totalStorage} GB</p>
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
                <p className="text-sm font-medium text-muted-foreground">Active Datasets</p>
                <p className="text-2xl font-bold text-foreground">{analytics.totalDatasets}</p>
                <p className="text-xs text-blue-600 mt-1">Across {analytics.storageProviders.length} providers</p>
              </div>
              <Shield className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Monthly Cost</p>
                <p className="text-2xl font-bold text-foreground">${analytics.monthlyCost}</p>
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
                <p className="text-sm font-medium text-muted-foreground">Avg Reliability</p>
                <p className="text-2xl font-bold text-foreground">{analytics.avgReliability}%</p>
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
              Dataset Growth Trend
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analytics.monthlyUsage.map((data, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium w-8">{data.month}</span>
                    <div className="flex-1 w-32">
                      <Progress value={(data.storage / 3.5) * 100} className="h-2" />
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">{data.storage} GB</p>
                    <p className="text-xs text-muted-foreground">{data.datasets} datasets</p>
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
                <span className="text-sm font-bold">${analytics.costBreakdown.storageFees}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                <span className="text-sm font-medium">Retrieval Fees</span>
                <span className="text-sm font-bold">${analytics.costBreakdown.retrievalFees}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                <span className="text-sm font-medium">Network Fees</span>
                <span className="text-sm font-bold">${analytics.costBreakdown.networkFees}</span>
              </div>
              <div className="border-t pt-3">
                <div className="flex justify-between items-center">
                  <span className="font-semibold">Total Monthly</span>
                  <span className="text-lg font-bold text-foreground">${analytics.monthlyCost}</span>
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
            {analytics.storageProviders.map((provider, index) => (
              <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center">
                    <Globe className="h-5 w-5 text-accent" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{provider.name}</p>
                    <p className="text-sm text-muted-foreground">{provider.location}</p>
                    <p className="text-xs text-muted-foreground">
                      ${provider.pricePerGB}/GB • Reputation: {provider.reputation}%
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-6">
                  <div className="text-center">
                    <p className="text-sm font-medium">{provider.storage}</p>
                    <p className="text-xs text-muted-foreground">Storage</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-medium">{provider.datasets}</p>
                    <p className="text-xs text-muted-foreground">Datasets</p>
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
