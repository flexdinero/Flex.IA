"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import {
  Bell,
  Building2,
  Calendar,
  FileText,
  LogOut,
  Settings,
  User,
  Shield,
  BarChart3,
  DollarSign,
  CheckCircle,
  X,
  Vault,
  Search,
  MessageSquare,
  Menu,
  Activity,
  FileBarChart,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"
import Link from "next/link"
import { useRouter, usePathname } from "next/navigation"
import { ThemeToggle } from "@/components/theme-toggle"

const navigationItems = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: BarChart3,
  },
  {
    title: "Claims",
    url: "/dashboard/claims",
    icon: FileText,
    badge: "36",
  },
  {
    title: "Messages",
    url: "/dashboard/messages",
    icon: MessageSquare,
    badge: "5",
  },
  {
    title: "Earnings",
    url: "/dashboard/earnings",
    icon: DollarSign,
  },
  {
    title: "Firms",
    url: "/dashboard/firms",
    icon: Building2,
  },
  {
    title: "Calendar",
    url: "/dashboard/calendar",
    icon: Calendar,
    badge: "6",
  },
  {
    title: "Analytics",
    url: "/dashboard/analytics",
    icon: Activity,
  },
  {
    title: "Vault",
    url: "/dashboard/vault",
    icon: Vault,
    badge: "3",
  },
  {
    title: "Settings",
    url: "/dashboard/settings",
    icon: Settings,
  },
  {
    title: "Admin Panel",
    url: "/dashboard/admin",
    icon: Shield,
  },
  {
    title: "Reports",
    url: "/dashboard/reports",
    icon: FileBarChart,
  },
]

// Mock search data
const searchData = [
  { type: "claim", id: "CLM-2024-001", title: "Property Damage - Houston", url: "/dashboard/claims" },
  { type: "claim", id: "CLM-2024-002", title: "Auto Collision - Dallas", url: "/dashboard/claims" },
  { type: "firm", id: "crawford", title: "Crawford & Company", url: "/dashboard/firms" },
  { type: "contract", id: "CTR-2024-001", title: "Independent Adjuster Agreement", url: "/dashboard/vault" },
  { type: "document", id: "DOC-001", title: "Texas Adjuster License", url: "/dashboard/vault" },
  { type: "message", id: "MSG-001", title: "Sarah Johnson - Crawford", url: "/dashboard/messages" },
]

// Mock notifications data
const notifications = [
  {
    id: 1,
    title: "New Claim Available",
    description: "Property damage claim in Houston, TX - $15,000 estimated",
    time: "2 minutes ago",
    type: "claim",
    unread: true,
    icon: FileText,
    color: "text-blue-600",
  },
  {
    id: 2,
    title: "Payment Received",
    description: "Crawford & Company payment of $2,625 has been processed",
    time: "1 hour ago",
    type: "payment",
    unread: true,
    icon: CheckCircle,
    color: "text-green-600",
  },
  {
    id: 3,
    title: "New Message",
    description: "Sedgwick sent you a message about claim CLM-2024-001",
    time: "3 hours ago",
    type: "message",
    unread: true,
    icon: MessageSquare,
    color: "text-purple-600",
  },
]

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [sidebarExpanded, setSidebarExpanded] = useState(true)
  const [notificationsList, setNotificationsList] = useState(notifications)
  const [showNotifications, setShowNotifications] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [searchResults, setSearchResults] = useState([])
  const [showSearchResults, setShowSearchResults] = useState(false)
  const router = useRouter()
  const pathname = usePathname()

  const unreadCount = notificationsList.filter((n) => n.unread).length

  // Search functionality
  useEffect(() => {
    if (searchTerm.trim()) {
      const results = searchData.filter(
        (item) =>
          item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.id.toLowerCase().includes(searchTerm.toLowerCase()),
      )
      setSearchResults(results)
      setShowSearchResults(true)
    } else {
      setSearchResults([])
      setShowSearchResults(false)
    }
  }, [searchTerm])

  const handleLogout = () => {
    router.push("/auth/login")
  }

  const markAsRead = (id: number) => {
    setNotificationsList((prev) =>
      prev.map((notification) => (notification.id === id ? { ...notification, unread: false } : notification)),
    )
  }

  const markAllAsRead = () => {
    setNotificationsList((prev) => prev.map((notification) => ({ ...notification, unread: false })))
  }

  const deleteNotification = (id: number) => {
    setNotificationsList((prev) => prev.filter((notification) => notification.id !== id))
  }

  const isActive = (url: string) => {
    if (url === "/dashboard") {
      return pathname === "/dashboard"
    }
    return pathname.startsWith(url)
  }

  const handleSearchSelect = (item: any) => {
    router.push(item.url)
    setSearchTerm("")
    setShowSearchResults(false)
  }

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Sidebar */}
      <div
        className={`fixed left-0 top-0 h-full bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transition-all duration-300 z-50 ${
          sidebarExpanded ? "w-64" : "w-16"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          {sidebarExpanded && (
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">F</span>
              </div>
              <span className="font-semibold text-gray-900 dark:text-white">Flex.IA</span>
            </div>
          )}
          <Button variant="ghost" size="sm" onClick={() => setSidebarExpanded(!sidebarExpanded)} className="p-1.5">
            {sidebarExpanded ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
          </Button>
        </div>

        {/* Search */}
        {sidebarExpanded && (
          <div className="p-4 relative">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600"
              />
            </div>

            {/* Search Results */}
            {showSearchResults && searchResults.length > 0 && (
              <div className="absolute top-full left-4 right-4 mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-50 max-h-64 overflow-y-auto">
                {searchResults.map((item, index) => (
                  <div
                    key={index}
                    className="p-3 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer border-b border-gray-100 dark:border-gray-700 last:border-b-0"
                    onClick={() => handleSearchSelect(item)}
                  >
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs">
                        {item.type}
                      </Badge>
                      <span className="text-sm font-medium">{item.title}</span>
                    </div>
                    <div className="text-xs text-gray-500 mt-1">{item.id}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto">
          {sidebarExpanded && (
            <div className="px-4 py-2">
              <span className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Menu
              </span>
            </div>
          )}

          <nav className="px-2 space-y-1">
            {navigationItems.map((item) => {
              const active = isActive(item.url)
              return (
                <Link key={item.title} href={item.url}>
                  <div
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group ${
                      active
                        ? "bg-purple-100 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300"
                        : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white"
                    }`}
                  >
                    <item.icon className={`h-5 w-5 ${active ? "text-purple-600 dark:text-purple-400" : ""}`} />
                    {sidebarExpanded && (
                      <>
                        <span className="font-medium">{item.title}</span>
                        {item.badge && (
                          <Badge
                            className={`ml-auto text-xs ${
                              active
                                ? "bg-purple-200 text-purple-800 dark:bg-purple-800 dark:text-purple-200"
                                : "bg-red-500 text-white"
                            }`}
                          >
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
        </div>
      </div>

      {/* Main Content */}
      <div className={`flex-1 transition-all duration-300 ${sidebarExpanded ? "ml-64" : "ml-16"}`}>
        {/* Top Navigation */}
        <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {/* Mobile menu button */}
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="sm" className="md:hidden">
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-64 p-0">
                  <SheetHeader className="p-4 border-b">
                    <SheetTitle className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
                        <span className="text-white font-bold text-sm">F</span>
                      </div>
                      Flex.IA
                    </SheetTitle>
                    <SheetDescription>Independent Adjuster Platform</SheetDescription>
                  </SheetHeader>
                  <nav className="p-2 space-y-1">
                    {navigationItems.map((item) => {
                      const active = isActive(item.url)
                      return (
                        <Link key={item.title} href={item.url}>
                          <div
                            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                              active
                                ? "bg-purple-100 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300"
                                : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                            }`}
                          >
                            <item.icon className="h-5 w-5" />
                            <span className="font-medium">{item.title}</span>
                            {item.badge && (
                              <Badge className="ml-auto text-xs bg-red-500 text-white">{item.badge}</Badge>
                            )}
                          </div>
                        </Link>
                      )
                    })}
                  </nav>
                </SheetContent>
              </Sheet>

              <div className="hidden md:block">
                <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
                  {navigationItems.find((item) => isActive(item.url))?.title || "Dashboard"}
                </h1>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* Theme Toggle */}
              <ThemeToggle />

              {/* Notifications */}
              <DropdownMenu open={showNotifications} onOpenChange={setShowNotifications}>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="relative">
                    <Bell className="h-5 w-5" />
                    {unreadCount > 0 && (
                      <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs bg-red-500 text-white">
                        {unreadCount}
                      </Badge>
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-80">
                  <div className="flex items-center justify-between p-3 border-b">
                    <DropdownMenuLabel className="p-0">Notifications</DropdownMenuLabel>
                    {unreadCount > 0 && (
                      <Button variant="ghost" size="sm" onClick={markAllAsRead} className="text-xs h-auto p-1">
                        Mark all read
                      </Button>
                    )}
                  </div>
                  <div className="max-h-64 overflow-y-auto">
                    {notificationsList.length === 0 ? (
                      <div className="p-4 text-center text-sm text-gray-500">No notifications</div>
                    ) : (
                      notificationsList.map((notification) => (
                        <div
                          key={notification.id}
                          className={`p-3 border-b last:border-b-0 hover:bg-gray-50 dark:hover:bg-gray-800 ${
                            notification.unread ? "bg-blue-50 dark:bg-blue-950/20" : ""
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            <div className={`p-1.5 rounded-full bg-gray-100 dark:bg-gray-700 ${notification.color}`}>
                              <notification.icon className="h-3 w-3" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between">
                                <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                                  {notification.title}
                                </p>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => deleteNotification(notification.id)}
                                  className="h-auto p-1 opacity-0 group-hover:opacity-100"
                                >
                                  <X className="h-3 w-3" />
                                </Button>
                              </div>
                              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                {notification.description}
                              </p>
                              <div className="flex items-center justify-between mt-2">
                                <span className="text-xs text-gray-400">{notification.time}</span>
                                {notification.unread && (
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => markAsRead(notification.id)}
                                    className="text-xs h-auto p-1"
                                  >
                                    Mark read
                                  </Button>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* User Menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src="/placeholder.svg?height=32&width=32" alt="User" />
                      <AvatarFallback>JS</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">John Smith</p>
                      <p className="text-xs leading-none text-muted-foreground">john.smith@email.com</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard/settings" className="flex items-center">
                      <User className="mr-2 h-4 w-4" />
                      <span>My Account</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard/settings" className="flex items-center">
                      <User className="mr-2 h-4 w-4" />
                      <span>Profile</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard/settings" className="flex items-center">
                      <Settings className="mr-2 h-4 w-4" />
                      <span>Settings</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-6">{children}</main>
      </div>
    </div>
  )
}
