"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Bot, Scan, AlertTriangle, CheckCircle, Mic, MicOff, Volume2, Network, Activity } from "lucide-react"
import { allDevices, vlanConfigs } from "@/lib/network-data"

interface AIAlert {
  id: string
  device: string
  severity: "high" | "medium" | "low"
  issue: string
  suggestion: string
  timestamp: Date
  status: "active" | "resolved"
}

interface AIAutomationTabProps {
  isAuthorized: boolean
  onUnauthorizedAction: () => void
}

export function AIAutomationTab({ isAuthorized, onUnauthorizedAction }: AIAutomationTabProps) {
  const [isScanning, setIsScanning] = useState(false)
  const [scanProgress, setScanProgress] = useState(0)
  const [aiAlerts, setAiAlerts] = useState<AIAlert[]>([
    {
      id: "1",
      device: "Router-2 (10.19.10.4)",
      severity: "high",
      issue: "Device offline - Connection timeout",
      suggestion: "Check physical connections and power status. Verify network cables.",
      timestamp: new Date(Date.now() - 300000),
      status: "active",
    },
    {
      id: "2",
      device: "AP-04 (10.19.10.54)",
      severity: "medium",
      issue: "High packet loss detected (15%)",
      suggestion: "Check wireless interference. Consider channel optimization.",
      timestamp: new Date(Date.now() - 600000),
      status: "active",
    },
    {
      id: "3",
      device: "Core Switch (10.19.10.2)",
      severity: "low",
      issue: "CPU utilization above 80%",
      suggestion: "Monitor traffic patterns. Consider load balancing.",
      timestamp: new Date(Date.now() - 900000),
      status: "resolved",
    },
  ])
  const [chatMessages, setChatMessages] = useState<Array<{ role: "user" | "assistant"; content: string }>>([
    {
      role: "assistant",
      content:
        "Hello! I'm your networking AI assistant. I can help you with Cisco commands, troubleshooting, and network analysis. How can I assist you today?",
    },
  ])
  const [userMessage, setUserMessage] = useState("")
  const [isListening, setIsListening] = useState(false)
  const [selectedVlan, setSelectedVlan] = useState<number | null>(null)

  const handleAIScan = async () => {
    if (!isAuthorized) {
      onUnauthorizedAction()
      return
    }

    setIsScanning(true)
    setScanProgress(0)

    const progressInterval = setInterval(() => {
      setScanProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval)
          setIsScanning(false)

          // Add new alert after scan
          const newAlert: AIAlert = {
            id: Date.now().toString(),
            device: "AP-15 (10.19.10.65)",
            severity: "medium",
            issue: "Firmware version outdated",
            suggestion: "Update to latest firmware version for security patches.",
            timestamp: new Date(),
            status: "active",
          }
          setAiAlerts((prev) => [newAlert, ...prev])

          return 100
        }
        return prev + 5
      })
    }, 100)
  }

  const handleResolveAlert = (alertId: string) => {
    if (!isAuthorized) {
      onUnauthorizedAction()
      return
    }

    setAiAlerts((prev) => prev.map((alert) => (alert.id === alertId ? { ...alert, status: "resolved" } : alert)))
  }

  const handleSendMessage = () => {
    if (!isAuthorized) {
      onUnauthorizedAction()
      return
    }

    if (!userMessage.trim()) return

    const newUserMessage = { role: "user" as const, content: userMessage }
    setChatMessages((prev) => [...prev, newUserMessage])

    // Simulate AI response
    setTimeout(() => {
      const responses = [
        "To check interface status on a Cisco CBS350, use 'show interfaces status'. This will display port status, VLAN assignments, and link speeds.",
        "For VLAN troubleshooting, start with 'show vlan' to see VLAN configuration, then 'show interfaces switchport' for port assignments.",
        "The device appears to be experiencing connectivity issues. I recommend checking physical connections first, then verifying IP configuration.",
        "Based on your network topology, I suggest implementing spanning-tree protocol to prevent loops. Use 'show spanning-tree' to check current status.",
      ]
      const randomResponse = responses[Math.floor(Math.random() * responses.length)]
      setChatMessages((prev) => [...prev, { role: "assistant", content: randomResponse }])
    }, 1000)

    setUserMessage("")
  }

  const handleVoiceToggle = () => {
    if (!isAuthorized) {
      onUnauthorizedAction()
      return
    }
    setIsListening(!isListening)
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "high":
        return "bg-red-500"
      case "medium":
        return "bg-yellow-500"
      case "low":
        return "bg-blue-500"
      default:
        return "bg-gray-500"
    }
  }

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case "high":
        return <Badge className="bg-red-600 text-white">High</Badge>
      case "medium":
        return <Badge className="bg-yellow-600 text-white">Medium</Badge>
      case "low":
        return <Badge className="bg-blue-600 text-white">Low</Badge>
      default:
        return <Badge variant="outline">Unknown</Badge>
    }
  }

  const activeAlerts = aiAlerts.filter((alert) => alert.status === "active")
  const resolvedAlerts = aiAlerts.filter((alert) => alert.status === "resolved")

  return (
    <div className="space-y-6">
      {/* AI Scan Controls */}
      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Bot className="h-5 w-5" />
            AI Network Analysis
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-300">AI-powered network scanning and diagnostics for all connected devices</p>
              <div className="flex items-center gap-4 mt-2 text-sm">
                <span className="text-green-400">
                  ● {allDevices.filter((d) => d.status === "online").length} Online
                </span>
                <span className="text-yellow-400">
                  ● {allDevices.filter((d) => d.status === "warning").length} Warning
                </span>
                <span className="text-red-400">
                  ● {allDevices.filter((d) => d.status === "offline").length} Offline
                </span>
              </div>
            </div>
            <Button
              onClick={handleAIScan}
              disabled={!isAuthorized || isScanning}
              className="bg-purple-600 hover:bg-purple-700"
            >
              <Scan className="h-4 w-4 mr-2" />
              {isScanning ? "Scanning..." : "Start AI Scan"}
            </Button>
          </div>

          {isScanning && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-300">Scanning network devices...</span>
                <span className="text-white">{scanProgress}%</span>
              </div>
              <Progress value={scanProgress} className="w-full" />
            </div>
          )}
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* AI Alerts */}
        <div className="space-y-4">
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5" />
                  Active Alerts ({activeAlerts.length})
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-64">
                <div className="space-y-3">
                  {activeAlerts.map((alert) => (
                    <Alert key={alert.id} className="border-slate-600">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            {getSeverityBadge(alert.severity)}
                            <span className="text-white text-sm font-medium">{alert.device}</span>
                          </div>
                          <AlertDescription className="text-slate-300 text-sm mb-2">
                            <strong>Issue:</strong> {alert.issue}
                          </AlertDescription>
                          <AlertDescription className="text-blue-300 text-sm mb-2">
                            <strong>Suggestion:</strong> {alert.suggestion}
                          </AlertDescription>
                          <div className="text-xs text-slate-400">{alert.timestamp.toLocaleString()}</div>
                        </div>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleResolveAlert(alert.id)}
                          disabled={!isAuthorized}
                          className="ml-2 border-green-600 text-green-400 hover:bg-green-600 hover:text-white"
                        >
                          <CheckCircle className="h-4 w-4" />
                        </Button>
                      </div>
                    </Alert>
                  ))}
                  {activeAlerts.length === 0 && (
                    <div className="text-center py-8 text-slate-400">
                      <CheckCircle className="h-8 w-8 mx-auto mb-2 opacity-50" />
                      <p>No active alerts</p>
                    </div>
                  )}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>

          {/* VLAN Monitoring */}
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Network className="h-5 w-5" />
                VLAN Monitoring
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {vlanConfigs.slice(0, 8).map((vlan) => (
                  <div
                    key={vlan.id}
                    className={`p-2 rounded cursor-pointer transition-colors ${
                      selectedVlan === vlan.id ? "bg-blue-900/50" : "bg-slate-700 hover:bg-slate-600"
                    }`}
                    onClick={() => setSelectedVlan(vlan.id)}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-white font-mono text-sm">VLAN {vlan.id}</span>
                        <p className="text-slate-300 text-xs">{vlan.description}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-green-500" />
                        <span className="text-xs text-slate-400">{vlan.network}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* AI Assistant Chat */}
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Bot className="h-5 w-5" />
                AI Assistant
              </div>
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleVoiceToggle}
                  disabled={!isAuthorized}
                  className={`border-slate-600 ${isListening ? "bg-red-600 text-white" : ""}`}
                >
                  {isListening ? <Mic className="h-4 w-4" /> : <MicOff className="h-4 w-4" />}
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  disabled={!isAuthorized}
                  className="border-slate-600 bg-transparent"
                >
                  <Volume2 className="h-4 w-4" />
                </Button>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <ScrollArea className="h-64 p-2 bg-slate-900 rounded">
              <div className="space-y-3">
                {chatMessages.map((message, index) => (
                  <div key={index} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                    <div
                      className={`max-w-[80%] p-3 rounded-lg ${
                        message.role === "user" ? "bg-blue-600 text-white" : "bg-slate-700 text-slate-200"
                      }`}
                    >
                      <p className="text-sm">{message.content}</p>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>

            <div className="flex gap-2">
              <Input
                value={userMessage}
                onChange={(e) => setUserMessage(e.target.value)}
                placeholder="Ask about Cisco commands, troubleshooting, or network analysis..."
                className="bg-slate-700 border-slate-600 text-white"
                readOnly={!isAuthorized}
                onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
              />
              <Button
                onClick={handleSendMessage}
                disabled={!isAuthorized || !userMessage.trim()}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Send
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Network Health Overview */}
      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Network Health Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-400">
                {Math.round((allDevices.filter((d) => d.status === "online").length / allDevices.length) * 100)}%
              </div>
              <p className="text-slate-300 text-sm">Network Uptime</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-400">{activeAlerts.length}</div>
              <p className="text-slate-300 text-sm">Active Issues</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-400">{vlanConfigs.length}</div>
              <p className="text-slate-300 text-sm">VLANs Configured</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-400">{resolvedAlerts.length}</div>
              <p className="text-slate-300 text-sm">Issues Resolved</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
