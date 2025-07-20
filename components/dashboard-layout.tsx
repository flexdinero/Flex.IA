"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

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

  Activity,
  FileBarChart,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Edit3,
  Menu,
  Plus,
  Save,
} from "lucide-react"
import Link from "next/link"
import { useRouter, usePathname } from "next/navigation"
import { ThemeToggle } from "@/components/theme-toggle"
import { GlobalSearch } from "@/components/global-search"
import SidebarAIChat from "@/components/sidebar-ai-chat"
import AIChatWidget from "@/components/ai-chat-widget"


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

interface DashboardLayoutProps {
  children: React.ReactNode
  dashboardControls?: {
    editMode: boolean
    onEditModeChange: (editMode: boolean) => void
    onAddWidget: () => void
    isAddingWidget: boolean
    widgetsDropdownOpen: boolean
    availableWidgets: Array<{
      id: string
      title: string
      icon: React.ComponentType<{ className?: string }>
    }>
    onWidgetAdd: (widgetId: string) => void
  }
}

export function DashboardLayout({ children, dashboardControls }: DashboardLayoutProps) {
  const [sidebarExpanded, setSidebarExpanded] = useState(true)
  const [notificationsList, setNotificationsList] = useState(notifications)
  const [showNotifications, setShowNotifications] = useState(false)
  const [showGlobalSearch, setShowGlobalSearch] = useState(false)
  const router = useRouter()
  const pathname = usePathname()

  // Load sidebar state from localStorage on mount
  useEffect(() => {
    const savedSidebarState = localStorage.getItem('sidebarExpanded')
    if (savedSidebarState !== null) {
      setSidebarExpanded(JSON.parse(savedSidebarState))
    }
  }, [])

  // Global search keyboard shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setShowGlobalSearch(true)
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [])

  // Save sidebar state to localStorage when it changes
  const toggleSidebar = () => {
    const newState = !sidebarExpanded
    setSidebarExpanded(newState)
    localStorage.setItem('sidebarExpanded', JSON.stringify(newState))
  }

  const unreadCount = notificationsList.filter((n) => n.unread).length



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



  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Skip to main content link for screen readers */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-blue-600 focus:text-white focus:rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        Skip to main content
      </a>

      {/* Mobile Sidebar Overlay */}
      {sidebarExpanded && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={toggleSidebar}
          aria-label="Close sidebar"
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault()
              toggleSidebar()
            }
          }}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 h-full bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transition-all duration-300 z-40
          ${sidebarExpanded
            ? "w-64 translate-x-0"
            : "w-64 -translate-x-full lg:w-16 lg:translate-x-0"
          }`}
        role="navigation"
        aria-label="Main navigation"
        aria-expanded={sidebarExpanded}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">F</span>
            </div>
            {sidebarExpanded && (
              <span className="font-semibold text-gray-900 dark:text-white">Flex.IA</span>
            )}
          </div>
          <Button variant="ghost" size="sm" onClick={toggleSidebar} className="p-1.5 lg:hidden">
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={toggleSidebar} className="p-1.5 hidden lg:block">
            {sidebarExpanded ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
          </Button>
        </div>



        {/* Navigation */}
        <div className="flex-1 overflow-y-auto">
          {sidebarExpanded && (
            <div className="px-4 py-2">
              <span className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Menu
              </span>
            </div>
          )}

          <nav className="px-2 space-y-1" role="navigation" aria-label="Main menu">
            {navigationItems.map((item) => {
              const active = isActive(item.url)
              return (
                <Link key={item.title} href={item.url}>
                  <div
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group relative ${
                      active
                        ? "bg-purple-100 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300"
                        : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white"
                    } ${!sidebarExpanded ? "justify-center" : ""}`}
                    title={!sidebarExpanded ? item.title : undefined}
                    role="menuitem"
                    aria-current={active ? "page" : undefined}
                    aria-label={item.title}
                  >
                    <div className="relative">
                      <item.icon className={`h-5 w-5 ${active ? "text-purple-600 dark:text-purple-400" : ""}`} />
                      {!sidebarExpanded && item.badge && (
                        <Badge className="absolute -top-2 -right-2 h-4 w-4 flex items-center justify-center p-0 text-xs bg-red-500 text-white">
                          {item.badge}
                        </Badge>
                      )}
                    </div>
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

        {/* AI Chat Assistant at bottom of sidebar */}
        <div className="mt-auto">
          <SidebarAIChat sidebarExpanded={sidebarExpanded} />
        </div>
      </aside>

      {/* Main Content */}
      <div className={`flex-1 transition-all duration-300 ${
        sidebarExpanded
          ? "lg:ml-64"
          : "lg:ml-16"
      }`}>
        {/* Top Navigation */}
        <header
          className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4"
          role="banner"
          aria-label="Page header"
        >
          <div className="flex items-center justify-between">
            {/* Left side - Mobile Menu + Search Bar */}
            <div className="flex items-center gap-4 flex-1">
              {/* Mobile Menu Button */}
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleSidebar}
                className="lg:hidden p-2 z-50 relative"
                aria-label="Toggle sidebar menu"
              >
                <Menu className="h-5 w-5" />
              </Button>

              {/* Global Search */}
              <div className="max-w-md w-full">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowGlobalSearch(true)}
                  className="w-full justify-start gap-2 text-muted-foreground hover:text-foreground border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
                  aria-label="Open global search"
                  aria-haspopup="dialog"
                >
                  <Search className="h-4 w-4" aria-hidden="true" />
                  <span className="text-sm hidden sm:inline">Search claims, firms, documents...</span>
                  <span className="text-sm sm:hidden">Search...</span>
                  <kbd className="ml-auto pointer-events-none hidden sm:inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
                    <span className="text-xs">⌘</span>K
                  </kbd>
                </Button>
              </div>
            </div>

            {/* Right side - Dashboard Controls + User Menu */}
            <div className="flex items-center gap-4">
              {/* Dashboard Controls - Only show on dashboard page */}
              {pathname === '/dashboard' && dashboardControls && (
                <div className="flex items-center gap-2">
                  <Button
                    variant={dashboardControls.editMode ? "default" : "outline"}
                    size="icon"
                    onClick={() => dashboardControls.onEditModeChange(!dashboardControls.editMode)}
                    className="h-8 w-8"
                    title={dashboardControls.editMode ? "Done editing" : "Edit dashboard"}
                  >
                    {dashboardControls.editMode ? (
                      <Save className="h-4 w-4" />
                    ) : (
                      <Edit3 className="h-4 w-4" />
                    )}
                  </Button>

                  {/* Add Widget Dropdown */}
                  <div className="relative">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={dashboardControls.onAddWidget}
                      className="h-8 w-8"
                      disabled={dashboardControls.isAddingWidget}
                      title="Add widget"
                    >
                      <Plus className="h-4 w-4" />
                    </Button>

                    {dashboardControls.widgetsDropdownOpen && (
                      <>
                        {/* Backdrop */}
                        <div
                          className="fixed inset-0 z-40"
                          onClick={dashboardControls.onAddWidget}
                        />

                        {/* Dropdown Menu */}
                        <div className="absolute right-0 top-full mt-2 w-80 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto">
                          <div className="p-3 border-b border-gray-200 dark:border-gray-700">
                            <h3 className="font-medium text-gray-900 dark:text-white">Available Widgets</h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Add widgets to your dashboard</p>
                          </div>

                          <div className="p-2">
                            {dashboardControls.availableWidgets.map(widget => {
                              const Icon = widget.icon

                              return (
                                <button
                                  key={widget.id}
                                  className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors text-left"
                                  onClick={() => dashboardControls.onWidgetAdd(widget.id)}
                                >
                                  <Icon className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                                  <div>
                                    <div className="font-medium text-gray-900 dark:text-white">{widget.title}</div>
                                    <div className="text-sm text-gray-600 dark:text-gray-400">
                                      Click to add to dashboard
                                    </div>
                                  </div>
                                </button>
                              )
                            })}

                            {dashboardControls.availableWidgets.length === 0 && (
                              <div className="p-4 text-center text-gray-500 dark:text-gray-400">
                                <div className="text-sm">All widgets are currently active</div>
                                <div className="text-xs mt-1">Remove widgets to add different ones</div>
                              </div>
                            )}
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              )}

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
        <main
          id="main-content"
          className="p-6"
          role="main"
          aria-label="Main content"
          tabIndex={-1}
        >
          {children}
        </main>
      </div>

      {/* Global Search Modal */}
      <GlobalSearch
        isOpen={showGlobalSearch}
        onClose={() => setShowGlobalSearch(false)}
      />

      {/* AI Chat Widget - Floating */}
      <AIChatWidget />

    </div>
  )
}
