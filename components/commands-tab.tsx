"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ciscoCommands } from "@/lib/network-data"
import { Terminal, Send, History, Code } from "lucide-react"

interface CommandsTabProps {
  isAuthorized: boolean
  onUnauthorizedAction: () => void
}

export function CommandsTab({ isAuthorized, onUnauthorizedAction }: CommandsTabProps) {
  const [selectedCommand, setSelectedCommand] = useState<string>("")
  const [customCommand, setCustomCommand] = useState<string>("")
  const [commandMode, setCommandMode] = useState<"predefined" | "custom">("predefined")
  const [commandHistory, setCommandHistory] = useState<string[]>([
    "show version",
    "show interfaces status",
    "show vlan",
  ])

  const handleCommandSelect = (command: string) => {
    if (!isAuthorized) {
      onUnauthorizedAction()
      return
    }
    setSelectedCommand(command)
    setCommandMode("predefined")
  }

  const handleCustomCommandChange = (command: string) => {
    if (!isAuthorized) {
      onUnauthorizedAction()
      return
    }
    setCustomCommand(command)
    setCommandMode("custom")
  }

  const handleSendCommand = () => {
    if (!isAuthorized) {
      onUnauthorizedAction()
      return
    }

    const commandToSend = commandMode === "custom" ? customCommand : selectedCommand
    if (commandToSend) {
      // Add to history
      setCommandHistory((prev) => [commandToSend, ...prev.slice(0, 9)]) // Keep last 10 commands

      // In a real implementation, this would send the command to the device
      console.log("Sending command:", commandToSend)

      // Clear inputs
      setSelectedCommand("")
      setCustomCommand("")
    }
  }

  const handleHistorySelect = (command: string) => {
    if (!isAuthorized) {
      onUnauthorizedAction()
      return
    }
    setCustomCommand(command)
    setCommandMode("custom")
  }

  return (
    <div className="space-y-6">
      {/* Command Selection */}
      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Terminal className="h-5 w-5" />
            Cisco Command Execution
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label className="text-slate-300">Predefined Commands (CBS350 24P Series)</Label>
            <Select value={selectedCommand} onValueChange={handleCommandSelect} disabled={!isAuthorized}>
              <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                <SelectValue placeholder="Select a Cisco command" />
              </SelectTrigger>
              <SelectContent className="bg-slate-700 border-slate-600">
                {ciscoCommands.map((command) => (
                  <SelectItem key={command} value={command}>
                    {command}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="text-center text-slate-400">
            <span>OR</span>
          </div>

          <div>
            <Label className="text-slate-300">Custom Command</Label>
            <Input
              value={customCommand}
              onChange={(e) => handleCustomCommandChange(e.target.value)}
              placeholder="Enter custom Cisco command"
              className="bg-slate-700 border-slate-600 text-white"
              readOnly={!isAuthorized}
            />
          </div>

          <div className="flex items-center gap-4">
            <Badge variant={commandMode === "predefined" ? "default" : "outline"} className="text-xs">
              Mode: {commandMode === "predefined" ? "Predefined" : "Custom"}
            </Badge>
            <Button
              onClick={handleSendCommand}
              disabled={!isAuthorized || (!selectedCommand && !customCommand)}
              className="bg-green-600 hover:bg-green-700"
            >
              <Send className="h-4 w-4 mr-2" />
              Send Command
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Command History */}
      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <History className="h-5 w-5" />
            Command History
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {commandHistory.length > 0 ? (
              commandHistory.map((command, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-slate-700 rounded-lg cursor-pointer hover:bg-slate-600 transition-colors"
                  onClick={() => handleHistorySelect(command)}
                >
                  <div className="flex items-center gap-2">
                    <Code className="h-4 w-4 text-slate-400" />
                    <span className="text-white font-mono text-sm">{command}</span>
                  </div>
                  <Badge variant="outline" className="text-xs text-slate-400 border-slate-500">
                    #{index + 1}
                  </Badge>
                </div>
              ))
            ) : (
              <p className="text-slate-400 text-center py-4">No commands in history</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Command Information */}
      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white">Supported Device Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label className="text-slate-300">Device Series</Label>
              <p className="text-white font-medium">Cisco CBS350 24P</p>
            </div>
            <div>
              <Label className="text-slate-300">Connection Method</Label>
              <p className="text-white font-medium">SSH / SNMP</p>
            </div>
            <div>
              <Label className="text-slate-300">Default SSH Port</Label>
              <p className="text-white font-medium">22</p>
            </div>
            <div>
              <Label className="text-slate-300">SNMP Version</Label>
              <p className="text-white font-medium">v2c / v3</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
