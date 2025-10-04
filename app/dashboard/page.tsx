"use client"

import dynamic from 'next/dynamic'
import { useState } from 'react';

const DashboardLayout = dynamic(
  () => import('@/components/dashboard-layout').then(mod => ({ default: mod.DashboardLayout })),
  { ssr: false, loading: () => <div className="flex items-center justify-center min-h-screen">Loading...</div> }
)

export default function DashboardPage() {
  return <DashboardLayout />
}
