"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  coreDevices,
  accessPoints,
  distributionDevices,
  defaultCredentials,
  type NetworkDevice,
} from "@/lib/network-data"
import { Eye, EyeOff, Network, Server, Wifi, Router } from "lucide-react"

interface NetworkTabProps {
  isAuthorized: boolean
  onUnauthorizedAction: () => void
}

export function NetworkTab({ isAuthorized, onUnauthorizedAction }: NetworkTabProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("")
  const [selectedDevice, setSelectedDevice] = useState<NetworkDevice | null>(null)
  const [username, setUsername] = useState(defaultCredentials.username)
  const [password, setPassword] = useState(defaultCredentials.password)
  const [showPassword, setShowPassword] = useState(false)
  const [connectionMethod, setConnectionMethod] = useState<string>("ssh")

  const getDevicesByCategory = (category: string): NetworkDevice[] => {
    switch (category) {
      case "core":
        return coreDevices.filter((d) => d.status === "online")
      case "access-controllers":
        return accessPoints.filter((d) => d.type === "access-controller")
      case "access-points":
        return accessPoints.filter((d) => d.type === "access-point")
      case "distribution":
        return distributionDevices
      default:
        return []
    }
  }

  const handleCategoryChange = (category: string) => {
    if (!isAuthorized) {
      onUnauthorizedAction()
      return
    }
    setSelectedCategory(category)
    setSelectedDevice(null)
  }

  const handleDeviceSelect = (device: NetworkDevice) => {
    if (!isAuthorized) {
      onUnauthorizedAction()
      return
    }
    setSelectedDevice(device)
  }

  const handleConnect = () => {
    if (!isAuthorized) {
      onUnauthorizedAction()
      return
    }
    // Connection logic would go here
    console.log("Connecting to device:", selectedDevice)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "online":
        return "bg-green-500"
      case "warning":
        return "bg-yellow-500"
      case "offline":
        return "bg-red-500"
      default:
        return "bg-gray-500"
    }
  }

  const getDeviceIcon = (type: string) => {
    switch (type) {
      case "core":
        return <Server className="h-4 w-4" />
      case "access-controller":
        return <Network className="h-4 w-4" />
      case "access-point":
        return <Wifi className="h-4 w-4" />
      case "distribution":
        return <Router className="h-4 w-4" />
      default:
        return <Network className="h-4 w-4" />
    }
  }

  return (
    <div className="space-y-6">
      {/* Device Selection */}
      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Network className="h-5 w-5" />
            Network Device Selection
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label className="text-slate-300">Device Category</Label>
            <Select value={selectedCategory} onValueChange={handleCategoryChange} disabled={!isAuthorized}>
              <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                <SelectValue placeholder="Select device category" />
              </SelectTrigger>
              <SelectContent className="bg-slate-700 border-slate-600">
                <SelectItem value="core">Core Devices</SelectItem>
                <SelectItem value="access-controllers">Access Controllers</SelectItem>
                <SelectItem value="access-points">Access Points</SelectItem>
                <SelectItem value="distribution">Distribution & Access Devices</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {selectedCategory && (
            <div className="space-y-4">
              <Label className="text-slate-300">Available Devices</Label>
              <div className="max-h-64 overflow-y-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="border-slate-600">
                      <TableHead className="text-slate-300">Device</TableHead>
                      <TableHead className="text-slate-300">IP Address</TableHead>
                      <TableHead className="text-slate-300">Location</TableHead>
                      <TableHead className="text-slate-300">Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {getDevicesByCategory(selectedCategory).map((device) => (
                      <TableRow
                        key={device.id}
                        className={`border-slate-600 cursor-pointer hover:bg-slate-700 ${
                          selectedDevice?.id === device.id ? "bg-blue-900/50" : ""
                        }`}
                        onClick={() => handleDeviceSelect(device)}
                      >
                        <TableCell className="text-white flex items-center gap-2">
                          {getDeviceIcon(device.type)}
                          {device.name}
                        </TableCell>
                        <TableCell className="text-slate-300">{device.ip}</TableCell>
                        <TableCell className="text-slate-300">{device.location || "N/A"}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div className={`w-2 h-2 rounded-full ${getStatusColor(device.status)}`} />
                            <span className="text-slate-300 capitalize">{device.status}</span>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Connection Configuration */}
      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white">Connection Configuration</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label className="text-slate-300">Connection Method</Label>
              <Select value={connectionMethod} onValueChange={setConnectionMethod} disabled={!isAuthorized}>
                <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-slate-700 border-slate-600">
                  <SelectItem value="ssh">SSH</SelectItem>
                  <SelectItem value="snmp">SNMP</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-slate-300">Selected Device</Label>
              <Input
                value={selectedDevice ? `${selectedDevice.name} (${selectedDevice.ip})` : ""}
                placeholder="No device selected"
                className="bg-slate-700 border-slate-600 text-white"
                readOnly
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label className="text-slate-300">Username</Label>
              <Input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="bg-slate-700 border-slate-600 text-white"
                readOnly={!isAuthorized}
              />
            </div>

            <div>
              <Label className="text-slate-300">Password</Label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-slate-700 border-slate-600 text-white pr-10"
                  readOnly={!isAuthorized}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 text-slate-400 hover:text-white"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={!isAuthorized}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <Button
              onClick={handleConnect}
              disabled={!isAuthorized || !selectedDevice}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Connect to Device
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Device Information */}
      {selectedDevice && (
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">Device Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label className="text-slate-300">Device Name</Label>
                <p className="text-white font-medium">{selectedDevice.name}</p>
              </div>
              <div>
                <Label className="text-slate-300">IP Address</Label>
                <p className="text-white font-medium">{selectedDevice.ip}</p>
              </div>
              <div>
                <Label className="text-slate-300">Type</Label>
                <Badge variant="outline" className="text-blue-400 border-blue-400">
                  {selectedDevice.type.replace("-", " ").toUpperCase()}
                </Badge>
              </div>
              {selectedDevice.location && (
                <div>
                  <Label className="text-slate-300">Location</Label>
                  <p className="text-white font-medium">{selectedDevice.location}</p>
                </div>
              )}
              <div>
                <Label className="text-slate-300">Status</Label>
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${getStatusColor(selectedDevice.status)}`} />
                  <span className="text-white capitalize">{selectedDevice.status}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
