"use client"

import { useState, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { NetworkTab } from "@/components/network-tab"
import { CommandsTab } from "@/components/commands-tab"
import { OutputTab } from "@/components/output-tab"
import { ExportTab } from "@/components/export-tab"
import { AIAutomationTab } from "@/components/ai-automation-tab"
import { NetworkIcon, Terminal, FileOutput, Download, Bot, Shield, Wifi } from "lucide-react"

// Centralized authorization configuration
const AUTHORIZED_IP_RANGES = ["10.19.10.0", "192.168.10.5/24", "39.46.240.230"]

export default function PCSIRNetworkTool() {
  const [userIP, setUserIP] = useState<string>("")
  const [isAuthorized, setIsAuthorized] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [activeTab, setActiveTab] = useState<string>("network")

  // Check if IP is in authorized ranges
  const checkAuthorization = (ip: string): boolean => {
    // Simple IP matching - in production, use proper CIDR matching
    return AUTHORIZED_IP_RANGES.some((range) => {
      if (range.includes("/")) {
        const baseIP = range.split("/")[0]
        return ip.startsWith(baseIP.substring(0, baseIP.lastIndexOf(".")))
      }
      return ip === range
    })
  }

  // Get user IP address
useEffect(() => {
  const fetchUserIP = async () => {
    try {
      // Fetch the real public IP
      const res = await fetch("https://api.ipify.org?format=json")
      const data = await res.json()
      const realIP = data.ip

      setUserIP(realIP)
      setIsAuthorized(checkAuthorization(realIP))
    } catch (error) {
      console.error("Failed to fetch IP:", error)
      setUserIP("Unknown")
      setIsAuthorized(false)
    } finally {
      setIsLoading(false)
    }
  }

  fetchUserIP()
}, [])

  const showUnauthorizedAlert = () => {
    alert("⚠️ You are not authorized to perform this action.")
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading PCSIR Network Tool...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      {/* Header */}
      <div className="border-b border-slate-700 bg-slate-900/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-600 rounded-lg">
                <Wifi className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">PCSIR Smart Network Management AI</h1>
                <p className="text-slate-300 text-sm">Advanced Network Management & Monitoring System</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="text-right">
                <div className="text-sm text-slate-300">Client IP: {userIP}</div>
                <Badge variant={isAuthorized ? "default" : "destructive"} className="mt-1">
                  <Shield className="h-3 w-3 mr-1" />
                  {isAuthorized ? "Authorized" : "Unauthorized"}
                </Badge>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-6">
        {!isAuthorized && (
          <Alert className="mb-6 border-amber-500 bg-amber-500/10">
            <Shield className="h-4 w-4" />
            <AlertDescription className="text-amber-200">
              You are viewing in read-only mode. All interactive features are disabled for unauthorized access.
            </AlertDescription>
          </Alert>
        )}

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5 bg-slate-800 border-slate-700">
            <TabsTrigger
              value="network"
              className="data-[state=active]:bg-blue-600 data-[state=active]:text-white text-slate-300"
            >
              <NetworkIcon className="h-4 w-4 mr-2" />
              Network
            </TabsTrigger>
            <TabsTrigger
              value="commands"
              className="data-[state=active]:bg-blue-600 data-[state=active]:text-white text-slate-300"
            >
              <Terminal className="h-4 w-4 mr-2" />
              Commands
            </TabsTrigger>
            <TabsTrigger
              value="output"
              className="data-[state=active]:bg-blue-600 data-[state=active]:text-white text-slate-300"
            >
              <FileOutput className="h-4 w-4 mr-2" />
              Output
            </TabsTrigger>
            <TabsTrigger
              value="export"
              className="data-[state=active]:bg-blue-600 data-[state=active]:text-white text-slate-300"
            >
              <Download className="h-4 w-4 mr-2" />
              Export
            </TabsTrigger>
            <TabsTrigger
              value="ai-automation"
              className="data-[state=active]:bg-blue-600 data-[state=active]:text-white text-slate-300"
            >
              <Bot className="h-4 w-4 mr-2" />
              AI Automation
            </TabsTrigger>
          </TabsList>

          <TabsContent value="network">
            <NetworkTab isAuthorized={isAuthorized} onUnauthorizedAction={showUnauthorizedAlert} />
          </TabsContent>

          <TabsContent value="commands">
            <CommandsTab isAuthorized={isAuthorized} onUnauthorizedAction={showUnauthorizedAlert} />
          </TabsContent>

          <TabsContent value="output">
            <OutputTab isAuthorized={isAuthorized} onUnauthorizedAction={showUnauthorizedAlert} />
          </TabsContent>

          <TabsContent value="export">
            <ExportTab isAuthorized={isAuthorized} onUnauthorizedAction={showUnauthorizedAlert} />
          </TabsContent>

          <TabsContent value="ai-automation">
            <AIAutomationTab isAuthorized={isAuthorized} onUnauthorizedAction={showUnauthorizedAlert} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
