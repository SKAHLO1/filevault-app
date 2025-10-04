"use client"

import dynamic from 'next/dynamic'

const DashboardLayout = dynamic(
  () => import('@/components/dashboard-layout').then(mod => ({ default: mod.DashboardLayout })),
  { 
    ssr: false, 
    loading: () => (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    )
  }
)

export default function DashboardPage() {
  return <DashboardLayout />
}
