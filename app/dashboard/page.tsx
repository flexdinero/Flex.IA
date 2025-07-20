"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import DashboardWidgets from "@/components/dashboard-widgets"
import {
  FileText,
  DollarSign,
  Users
} from "lucide-react"





export default function DashboardPage() {
  const [editMode, setEditMode] = useState(false)
  const [isAddingWidget, setIsAddingWidget] = useState(false)
  const [widgetsDropdownOpen, setWidgetsDropdownOpen] = useState(false)
  const [dashboardWidgetsRef, setDashboardWidgetsRef] = useState<any>(null)

  const handleAddWidget = () => {
    setIsAddingWidget(true)
    // Toggle the widgets dropdown
    setWidgetsDropdownOpen(!widgetsDropdownOpen)
    setTimeout(() => setIsAddingWidget(false), 500)
  }

  const handleWidgetAdd = (widgetId: string) => {
    if (dashboardWidgetsRef?.addWidget) {
      dashboardWidgetsRef.addWidget(widgetId)
    }
    setWidgetsDropdownOpen(false)
  }

  const handleEditModeChange = (newEditMode: boolean) => {
    // If exiting edit mode (Done button clicked), ensure layout is saved
    if (!newEditMode && editMode && dashboardWidgetsRef?.saveLayout) {
      dashboardWidgetsRef.saveLayout()
    }
    setEditMode(newEditMode)
  }

  // Get available widgets from the dashboard widgets component
  const availableWidgets = dashboardWidgetsRef?.getAvailableWidgets?.() || []

  const dashboardControls = {
    editMode,
    onEditModeChange: handleEditModeChange,
    onAddWidget: handleAddWidget,
    isAddingWidget,
    widgetsDropdownOpen,
    availableWidgets,
    onWidgetAdd: handleWidgetAdd
  }





  return (
    <DashboardLayout dashboardControls={dashboardControls}>
      <div className="space-y-6">
        {/* Dashboard Widgets */}
        <DashboardWidgets
          editMode={editMode}
          onEditModeChange={setEditMode}
          onWidgetsDropdownToggle={setWidgetsDropdownOpen}
          onRef={setDashboardWidgetsRef}
        />

        {/* Quick Actions */}
        {!editMode && (
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2">
                  <FileText className="h-6 w-6" />
                  <span>Submit New Claim</span>
                </Button>
                <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2">
                  <DollarSign className="h-6 w-6" />
                  <span>View Earnings</span>
                </Button>
                <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2">
                  <Users className="h-6 w-6" />
                  <span>Contact Firms</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  )
}
