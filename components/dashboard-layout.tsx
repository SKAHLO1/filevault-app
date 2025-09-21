"use client"

import { useState } from "react"
import {
  SidebarProvider,
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarInset,
  SidebarTrigger,
  SidebarFooter,
} from "@/components/ui/sidebar"
import { DashboardOverview } from "@/components/dashboard-overview"
import { FileManager } from "@/components/file-manager"
import { StorageAnalytics } from "@/components/storage-analytics"
import { AccountSettings } from "@/components/account-settings"
import { EncryptionSettings } from "@/components/encryption-settings"
import { KeyRecovery } from "@/components/key-recovery"
import { LayoutDashboard, Files, BarChart3, Settings, Shield, Key, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

const menuItems = [
  { id: "overview", label: "Overview", icon: LayoutDashboard },
  { id: "files", label: "File Manager", icon: Files },
  { id: "analytics", label: "Storage Analytics", icon: BarChart3 },
  { id: "encryption", label: "Encryption", icon: Shield },
  { id: "recovery", label: "Key Recovery", icon: Key },
  { id: "settings", label: "Account Settings", icon: Settings },
]

export function DashboardLayout() {
  const [activeView, setActiveView] = useState("overview")

  const renderContent = () => {
    switch (activeView) {
      case "overview":
        return <DashboardOverview />
      case "files":
        return <FileManager />
      case "analytics":
        return <StorageAnalytics />
      case "encryption":
        return <EncryptionSettings />
      case "recovery":
        return <KeyRecovery />
      case "settings":
        return <AccountSettings />
      default:
        return <DashboardOverview />
    }
  }

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <Sidebar>
          <SidebarHeader className="border-b border-sidebar-border">
            <div className="flex items-center gap-2 px-2 py-2">
              <Shield className="h-6 w-6 text-accent" />
              <span className="font-bold text-sidebar-foreground">FilecoinVault</span>
            </div>
          </SidebarHeader>

          <SidebarContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.id}>
                  <SidebarMenuButton
                    isActive={activeView === item.id}
                    onClick={() => setActiveView(item.id)}
                    className="w-full justify-start"
                  >
                    <item.icon className="h-4 w-4" />
                    <span>{item.label}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarContent>

          <SidebarFooter className="border-t border-sidebar-border">
            <div className="flex items-center gap-3 px-2 py-3">
              <Avatar className="h-8 w-8">
                <AvatarImage src="/diverse-user-avatars.png" />
                <AvatarFallback>JD</AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-sidebar-foreground truncate">John Doe</p>
                <p className="text-xs text-sidebar-foreground/70 truncate">john@example.com</p>
              </div>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </SidebarFooter>
        </Sidebar>

        <SidebarInset>
          <header className="flex h-16 shrink-0 items-center gap-2 border-b border-border px-4">
            <SidebarTrigger />
            <div className="flex-1">
              <h1 className="text-lg font-semibold">
                {menuItems.find((item) => item.id === activeView)?.label || "Dashboard"}
              </h1>
            </div>
          </header>

          <main className="flex-1 overflow-auto p-6">{renderContent()}</main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  )
}
