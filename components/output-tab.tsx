"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { FileOutput, Download, Trash2, Copy } from "lucide-react"

interface CommandOutput {
  id: string
  command: string
  output: string
  timestamp: Date
  device: string
  status: "success" | "error" | "pending"
}

interface OutputTabProps {
  isAuthorized: boolean
  onUnauthorizedAction: () => void
}

export function OutputTab({ isAuthorized, onUnauthorizedAction }: OutputTabProps) {
  const [outputs, setOutputs] = useState<CommandOutput[]>([
    {
      id: "1",
      command: "show version",
      output: `Cisco IOS Software, CBS350 Software (CBS350-UNIVERSALK9-M), Version 2.5.5.69, RELEASE SOFTWARE (fc1)
Technical Support: http://www.cisco.com/techsupport
Copyright (c) 1986-2021 by Cisco Systems, Inc.
Compiled Wed 21-Apr-21 02:15 by prod_rel_team

System Bootstrap Version: 1.0.3.0

Hardware Version: 1.0
System Serial Number: FCW2303D0GZ
System Description: CBS350-24P-4G

Configuration register is 0x1`,
      timestamp: new Date(Date.now() - 300000),
      device: "Core Switch (10.19.10.2)",
      status: "success",
    },
    {
      id: "2",
      command: "show interfaces status",
      output: `Port      Name               Status       Vlan       Duplex  Speed Type
Gi1/0/1                      connected    1          a-full  a-1000 1000BaseT
Gi1/0/2                      connected    1          a-full  a-1000 1000BaseT
Gi1/0/3                      notconnect   1            auto   auto 1000BaseT
Gi1/0/4                      notconnect   1            auto   auto 1000BaseT
Gi1/0/5                      connected    1          a-full  a-1000 1000BaseT`,
      timestamp: new Date(Date.now() - 600000),
      device: "Core Switch (10.19.10.2)",
      status: "success",
    },
    {
      id: "3",
      command: "show vlan",
      output: "Error: Connection timeout",
      timestamp: new Date(Date.now() - 900000),
      device: "Router-2 (10.19.10.4)",
      status: "error",
    },
  ])

  const [selectedOutput, setSelectedOutput] = useState<CommandOutput | null>(outputs[0])

  const handleClearAll = () => {
    if (!isAuthorized) {
      onUnauthorizedAction()
      return
    }
    setOutputs([])
    setSelectedOutput(null)
  }

  const handleDeleteOutput = (id: string) => {
    if (!isAuthorized) {
      onUnauthorizedAction()
      return
    }
    setOutputs((prev) => prev.filter((output) => output.id !== id))
    if (selectedOutput?.id === id) {
      setSelectedOutput(null)
    }
  }

  const handleCopyOutput = () => {
    if (!isAuthorized) {
      onUnauthorizedAction()
      return
    }
    if (selectedOutput) {
      navigator.clipboard.writeText(selectedOutput.output)
    }
  }

  const handleExportOutput = () => {
    if (!isAuthorized) {
      onUnauthorizedAction()
      return
    }
    if (selectedOutput) {
      const blob = new Blob([selectedOutput.output], { type: "text/plain" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `${selectedOutput.command.replace(/\s+/g, "_")}_${selectedOutput.device.split("(")[0].trim()}_${new Date().toISOString().split("T")[0]}.txt`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "success":
        return "bg-green-500"
      case "error":
        return "bg-red-500"
      case "pending":
        return "bg-yellow-500"
      default:
        return "bg-gray-500"
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "success":
        return <Badge className="bg-green-600 text-white">Success</Badge>
      case "error":
        return <Badge className="bg-red-600 text-white">Error</Badge>
      case "pending":
        return <Badge className="bg-yellow-600 text-white">Pending</Badge>
      default:
        return <Badge variant="outline">Unknown</Badge>
    }
  }

  return (
    <div className="space-y-6">
      {/* Output Controls */}
      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileOutput className="h-5 w-5" />
              Command Output Results
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleClearAll}
                disabled={!isAuthorized || outputs.length === 0}
                className="border-red-600 text-red-400 hover:bg-red-600 hover:text-white bg-transparent"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Clear All
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 text-sm text-slate-300">
            <span>Total Outputs: {outputs.length}</span>
            <span>Success: {outputs.filter((o) => o.status === "success").length}</span>
            <span>Errors: {outputs.filter((o) => o.status === "error").length}</span>
            <span>Pending: {outputs.filter((o) => o.status === "pending").length}</span>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Output List */}
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white text-lg">Output History</CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-96">
              <div className="space-y-2">
                {outputs.map((output) => (
                  <div
                    key={output.id}
                    className={`p-3 rounded-lg cursor-pointer transition-colors ${
                      selectedOutput?.id === output.id
                        ? "bg-blue-900/50 border border-blue-600"
                        : "bg-slate-700 hover:bg-slate-600"
                    }`}
                    onClick={() => setSelectedOutput(output)}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-white font-mono text-sm truncate">{output.command}</span>
                      <div className={`w-2 h-2 rounded-full ${getStatusColor(output.status)}`} />
                    </div>
                    <div className="text-xs text-slate-400">
                      <div>{output.device}</div>
                      <div>{output.timestamp.toLocaleString()}</div>
                    </div>
                  </div>
                ))}
                {outputs.length === 0 && (
                  <p className="text-slate-400 text-center py-8">No command outputs available</p>
                )}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Output Display */}
        <Card className="lg:col-span-2 bg-slate-800 border-slate-700">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-white">
                {selectedOutput ? "Command Output" : "Select an output to view"}
              </CardTitle>
              {selectedOutput && (
                <div className="flex items-center gap-2">
                  {getStatusBadge(selectedOutput.status)}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleCopyOutput}
                    disabled={!isAuthorized}
                    className="border-slate-600 bg-transparent"
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleExportOutput}
                    disabled={!isAuthorized}
                    className="border-slate-600 bg-transparent"
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDeleteOutput(selectedOutput.id)}
                    disabled={!isAuthorized}
                    className="border-red-600 text-red-400 hover:bg-red-600 hover:text-white"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {selectedOutput ? (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-slate-300">Command:</span>
                    <p className="text-white font-mono">{selectedOutput.command}</p>
                  </div>
                  <div>
                    <span className="text-slate-300">Device:</span>
                    <p className="text-white">{selectedOutput.device}</p>
                  </div>
                  <div>
                    <span className="text-slate-300">Timestamp:</span>
                    <p className="text-white">{selectedOutput.timestamp.toLocaleString()}</p>
                  </div>
                  <div>
                    <span className="text-slate-300">Status:</span>
                    <div className="mt-1">{getStatusBadge(selectedOutput.status)}</div>
                  </div>
                </div>
                <div>
                  <span className="text-slate-300">Output:</span>
                  <Textarea
                    value={selectedOutput.output}
                    readOnly
                    className="mt-2 bg-slate-900 border-slate-600 text-green-400 font-mono text-sm min-h-64"
                  />
                </div>
              </div>
            ) : (
              <div className="text-center py-12 text-slate-400">
                <FileOutput className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Select a command output from the list to view details</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
