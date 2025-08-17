"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Download, FileText, Database, Calendar, Settings } from "lucide-react"

interface ExportTabProps {
  isAuthorized: boolean
  onUnauthorizedAction: () => void
}

export function ExportTab({ isAuthorized, onUnauthorizedAction }: ExportTabProps) {
  const [exportType, setExportType] = useState<string>("")
  const [exportFormat, setExportFormat] = useState<string>("csv")
  const [dateRange, setDateRange] = useState<string>("today")
  const [includeDeviceInfo, setIncludeDeviceInfo] = useState(true)
  const [includeCommands, setIncludeCommands] = useState(true)
  const [includeOutputs, setIncludeOutputs] = useState(true)
  const [includeErrors, setIncludeErrors] = useState(false)
  const [customFileName, setCustomFileName] = useState("")
  const [isExporting, setIsExporting] = useState(false)
  const [exportProgress, setExportProgress] = useState(0)

  const exportTypes = [
    { value: "logs", label: "System Logs", icon: FileText },
    { value: "commands", label: "Command History", icon: Database },
    { value: "devices", label: "Device Information", icon: Settings },
    { value: "all", label: "Complete Report", icon: Download },
  ]

  const handleExport = async () => {
    if (!isAuthorized) {
      onUnauthorizedAction()
      return
    }

    if (!exportType) {
      alert("Please select an export type")
      return
    }

    setIsExporting(true)
    setExportProgress(0)

    // Simulate export progress
    const progressInterval = setInterval(() => {
      setExportProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval)
          setIsExporting(false)

          // Generate and download file
          const fileName =
            customFileName ||
            `pcsir_network_export_${exportType}_${new Date().toISOString().split("T")[0]}.${exportFormat}`
          const content = generateExportContent()
          const blob = new Blob([content], { type: getContentType() })
          const url = URL.createObjectURL(blob)
          const a = document.createElement("a")
          a.href = url
          a.download = fileName
          document.body.appendChild(a)
          a.click()
          document.body.removeChild(a)
          URL.revokeObjectURL(url)

          return 100
        }
        return prev + 10
      })
    }, 200)
  }

  const generateExportContent = () => {
    const timestamp = new Date().toISOString()

    if (exportFormat === "csv") {
      let content = "PCSIR Network Management Export\n"
      content += `Export Type: ${exportType}\n`
      content += `Generated: ${timestamp}\n\n`

      if (includeDeviceInfo) {
        content += "Device Name,IP Address,Type,Location,Status\n"
        content += "Core Switch,10.19.10.2,core,Main Server Room,online\n"
        content += "Firewall,10.19.10.1,core,Main Server Room,online\n"
      }

      if (includeCommands) {
        content += "\nCommand,Device,Timestamp,Status\n"
        content += "show version,Core Switch,2024-01-15 10:30:00,success\n"
        content += "show interfaces,Core Switch,2024-01-15 10:31:00,success\n"
      }

      return content
    } else {
      // JSON format
      const data = {
        export_info: {
          type: exportType,
          format: exportFormat,
          generated: timestamp,
          date_range: dateRange,
        },
        devices: includeDeviceInfo
          ? [
              { name: "Core Switch", ip: "10.19.10.2", type: "core", status: "online" },
              { name: "Firewall", ip: "10.19.10.1", type: "core", status: "online" },
            ]
          : [],
        commands: includeCommands
          ? [
              { command: "show version", device: "Core Switch", timestamp: "2024-01-15T10:30:00Z", status: "success" },
              {
                command: "show interfaces",
                device: "Core Switch",
                timestamp: "2024-01-15T10:31:00Z",
                status: "success",
              },
            ]
          : [],
      }
      return JSON.stringify(data, null, 2)
    }
  }

  const getContentType = () => {
    return exportFormat === "csv" ? "text/csv" : "application/json"
  }

  const handleExportTypeChange = (type: string) => {
    if (!isAuthorized) {
      onUnauthorizedAction()
      return
    }
    setExportType(type)
  }

  return (
    <div className="space-y-6">
      {/* Export Configuration */}
      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Download className="h-5 w-5" />
            Export Configuration
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Export Type Selection */}
          <div>
            <Label className="text-slate-300 mb-3 block">Export Type</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {exportTypes.map((type) => {
                const Icon = type.icon
                return (
                  <div
                    key={type.value}
                    className={`p-4 rounded-lg border cursor-pointer transition-colors ${
                      exportType === type.value
                        ? "border-blue-600 bg-blue-900/20"
                        : "border-slate-600 bg-slate-700 hover:bg-slate-600"
                    }`}
                    onClick={() => handleExportTypeChange(type.value)}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className="h-5 w-5 text-blue-400" />
                      <span className="text-white font-medium">{type.label}</span>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Export Settings */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label className="text-slate-300">Export Format</Label>
              <Select value={exportFormat} onValueChange={setExportFormat} disabled={!isAuthorized}>
                <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-slate-700 border-slate-600">
                  <SelectItem value="csv">CSV</SelectItem>
                  <SelectItem value="json">JSON</SelectItem>
                  <SelectItem value="txt">Text</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-slate-300">Date Range</Label>
              <Select value={dateRange} onValueChange={setDateRange} disabled={!isAuthorized}>
                <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-slate-700 border-slate-600">
                  <SelectItem value="today">Today</SelectItem>
                  <SelectItem value="week">Last 7 Days</SelectItem>
                  <SelectItem value="month">Last 30 Days</SelectItem>
                  <SelectItem value="all">All Time</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Include Options */}
          <div>
            <Label className="text-slate-300 mb-3 block">Include in Export</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="device-info"
                  checked={includeDeviceInfo}
                  onCheckedChange={setIncludeDeviceInfo}
                  disabled={!isAuthorized}
                />
                <Label htmlFor="device-info" className="text-slate-300">
                  Device Information
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="commands"
                  checked={includeCommands}
                  onCheckedChange={setIncludeCommands}
                  disabled={!isAuthorized}
                />
                <Label htmlFor="commands" className="text-slate-300">
                  Command History
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="outputs"
                  checked={includeOutputs}
                  onCheckedChange={setIncludeOutputs}
                  disabled={!isAuthorized}
                />
                <Label htmlFor="outputs" className="text-slate-300">
                  Command Outputs
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="errors"
                  checked={includeErrors}
                  onCheckedChange={setIncludeErrors}
                  disabled={!isAuthorized}
                />
                <Label htmlFor="errors" className="text-slate-300">
                  Error Logs
                </Label>
              </div>
            </div>
          </div>

          {/* Custom File Name */}
          <div>
            <Label className="text-slate-300">Custom File Name (Optional)</Label>
            <Input
              value={customFileName}
              onChange={(e) => setCustomFileName(e.target.value)}
              placeholder={`pcsir_network_export_${exportType || "data"}_${new Date().toISOString().split("T")[0]}.${exportFormat}`}
              className="bg-slate-700 border-slate-600 text-white"
              readOnly={!isAuthorized}
            />
          </div>
        </CardContent>
      </Card>

      {/* Export Progress */}
      {isExporting && (
        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="pt-6">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-slate-300">Exporting data...</span>
                <span className="text-white">{exportProgress}%</span>
              </div>
              <Progress value={exportProgress} className="w-full" />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Export Actions */}
      <Card className="bg-slate-800 border-slate-700">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div className="text-slate-300">
              <p className="text-sm">
                Ready to export {exportType ? exportTypes.find((t) => t.value === exportType)?.label : "data"}
                {exportType && ` in ${exportFormat.toUpperCase()} format`}
              </p>
              {exportType && (
                <div className="flex items-center gap-2 mt-2">
                  <Badge variant="outline" className="text-blue-400 border-blue-400">
                    {exportTypes.find((t) => t.value === exportType)?.label}
                  </Badge>
                  <Badge variant="outline" className="text-green-400 border-green-400">
                    {exportFormat.toUpperCase()}
                  </Badge>
                  <Badge variant="outline" className="text-yellow-400 border-yellow-400">
                    {dateRange.replace("_", " ").toUpperCase()}
                  </Badge>
                </div>
              )}
            </div>
            <Button
              onClick={handleExport}
              disabled={!isAuthorized || !exportType || isExporting}
              className="bg-green-600 hover:bg-green-700"
            >
              <Download className="h-4 w-4 mr-2" />
              {isExporting ? "Exporting..." : "Export Data"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Recent Exports */}
      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Recent Exports
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              { name: "pcsir_network_export_all_2024-01-15.csv", size: "2.3 MB", date: "2024-01-15 14:30" },
              { name: "pcsir_network_export_logs_2024-01-14.json", size: "1.8 MB", date: "2024-01-14 09:15" },
              { name: "pcsir_network_export_devices_2024-01-13.csv", size: "0.5 MB", date: "2024-01-13 16:45" },
            ].map((file, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-slate-700 rounded-lg">
                <div className="flex items-center gap-3">
                  <FileText className="h-4 w-4 text-blue-400" />
                  <div>
                    <p className="text-white text-sm font-medium">{file.name}</p>
                    <p className="text-slate-400 text-xs">
                      {file.size} • {file.date}
                    </p>
                  </div>
                </div>
                <Button variant="ghost" size="sm" disabled={!isAuthorized} className="text-slate-400 hover:text-white">
                  <Download className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
