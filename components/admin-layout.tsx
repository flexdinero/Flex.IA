"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter, usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ThemeToggle } from "@/components/theme-toggle"
import { 
  LayoutDashboard, 
  MessageSquare, 
  Users, 
  BarChart3, 
  Settings, 
  Menu, 
  X,
  Bell,
  Search,
  LogOut,
  Shield,
  FileText,
  CreditCard,
  Database,
  Activity
} from "lucide-react"

interface AdminLayoutProps {
  children: React.ReactNode
}

export function AdminLayout({ children }: AdminLayoutProps) {
  const [sidebarExpanded, setSidebarExpanded] = useState(true)
  const pathname = usePathname()
  const router = useRouter()

  const navigation = [
    {
      name: "Dashboard",
      href: "/admin",
      icon: LayoutDashboard,
      current: pathname === "/admin"
    },
    {
      name: "Feedback",
      href: "/admin/feedback",
      icon: MessageSquare,
      current: pathname === "/admin/feedback",
      badge: "3" // New feedback count
    },
    {
      name: "Users",
      href: "/admin/users",
      icon: Users,
      current: pathname === "/admin/users"
    },
    {
      name: "Analytics",
      href: "/admin/analytics",
      icon: BarChart3,
      current: pathname === "/admin/analytics"
    },
    {
      name: "Payments",
      href: "/admin/payments",
      icon: CreditCard,
      current: pathname === "/admin/payments"
    },
    {
      name: "System",
      href: "/admin/system",
      icon: Database,
      current: pathname === "/admin/system"
    },
    {
      name: "Activity Logs",
      href: "/admin/logs",
      icon: Activity,
      current: pathname === "/admin/logs"
    },
    {
      name: "Settings",
      href: "/admin/settings",
      icon: Settings,
      current: pathname === "/admin/settings"
    }
  ]

  const handleLogout = () => {
    // Handle admin logout
    router.push("/auth/login")
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 bg-card border-r transition-all duration-300 ${
        sidebarExpanded ? 'w-64' : 'w-16'
      }`}>
        <div className="flex h-full flex-col">
          {/* Header */}
          <div className="flex h-16 items-center justify-between px-4 border-b">
            {sidebarExpanded && (
              <div className="flex items-center gap-2">
                <Shield className="h-8 w-8 text-primary" />
                <div>
                  <h1 className="text-lg font-bold">Admin Panel</h1>
                  <p className="text-xs text-muted-foreground">Flex.IA</p>
                </div>
              </div>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarExpanded(!sidebarExpanded)}
              className="h-8 w-8 p-0"
            >
              {sidebarExpanded ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </Button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-1 p-2">
            {navigation.map((item) => {
              const Icon = item.icon
              return (
                <Link key={item.name} href={item.href}>
                  <div className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors hover:bg-accent hover:text-accent-foreground ${
                    item.current ? 'bg-accent text-accent-foreground' : 'text-muted-foreground'
                  }`}>
                    <Icon className="h-4 w-4 flex-shrink-0" />
                    {sidebarExpanded && (
                      <>
                        <span className="flex-1">{item.name}</span>
                        {item.badge && (
                          <Badge variant="secondary" className="text-xs">
                            {item.badge}
                          </Badge>
                        )}
                      </>
                    )}
                  </div>
                </Link>
              )
            })}
          </nav>

          {/* Footer */}
          <div className="border-t p-2">
            <Button
              variant="ghost"
              onClick={handleLogout}
              className={`w-full justify-start gap-3 text-muted-foreground hover:text-foreground ${
                !sidebarExpanded ? 'px-3' : ''
              }`}
            >
              <LogOut className="h-4 w-4 flex-shrink-0" />
              {sidebarExpanded && <span>Logout</span>}
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className={`transition-all duration-300 ${
        sidebarExpanded ? 'ml-64' : 'ml-16'
      }`}>
        {/* Top Header */}
        <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="flex h-16 items-center justify-between px-6">
            <div className="flex items-center gap-4">
              <h2 className="text-lg font-semibold">
                {navigation.find(item => item.current)?.name || 'Admin Panel'}
              </h2>
            </div>

            <div className="flex items-center gap-3">
              {/* Search */}
              <Button variant="ghost" size="sm" className="gap-2">
                <Search className="h-4 w-4" />
                <span className="hidden md:inline">Search</span>
                <kbd className="pointer-events-none hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100 md:inline-flex">
                  <span className="text-xs">⌘</span>K
                </kbd>
              </Button>

              {/* Notifications */}
              <Button variant="ghost" size="sm" className="relative">
                <Bell className="h-4 w-4" />
                <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full text-[10px] text-white flex items-center justify-center">
                  2
                </span>
              </Button>

              {/* Theme Toggle */}
              <ThemeToggle />

              {/* Admin Profile */}
              <div className="flex items-center gap-2 pl-2 border-l">
                <div className="h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-medium">
                  A
                </div>
                <div className="hidden md:block">
                  <p className="text-sm font-medium">Admin User</p>
                  <p className="text-xs text-muted-foreground">admin@flex.ia</p>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-6">{children}</main>
      </div>
    </div>
  )
}
