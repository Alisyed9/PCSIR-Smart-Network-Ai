// Network device hierarchy and configuration data
export interface NetworkDevice {
  id: string
  name: string
  ip: string
  type: "core" | "access-controller" | "access-point" | "distribution"
  location?: string
  status: "online" | "offline" | "warning"
  department?: string
}

export interface VLANConfig {
  id: number
  network: string
  description: string
}

// Core Devices (10.19.10.1 - 50)
export const coreDevices: NetworkDevice[] = [
  { id: "fw-01", name: "Firewall", ip: "10.19.10.1", type: "core", status: "online" },
  { id: "cs-01", name: "Core Switch", ip: "10.19.10.2", type: "core", status: "online" },
  { id: "r-01", name: "Router-1", ip: "10.19.10.3", type: "core", status: "online" },
  { id: "r-02", name: "Router-2", ip: "10.19.10.4", type: "core", status: "offline" },
  { id: "r-03", name: "Router-3", ip: "10.19.10.5", type: "core", status: "offline" },
  // Additional routers (4-48) marked as offline for future use
  ...Array.from({ length: 45 }, (_, i) => ({
    id: `r-${String(i + 4).padStart(2, "0")}`,
    name: `Router-${i + 4}`,
    ip: `10.19.10.${i + 6}`,
    type: "core" as const,
    status: "offline" as const,
  })),
]

// Access Points (10.19.10.51 - 150)
export const accessPoints: NetworkDevice[] = [
  {
    id: "ap-01",
    name: "AP-01 (Controller)",
    ip: "10.19.10.51",
    type: "access-controller",
    location: "MIS FF",
    status: "online",
  },
  { id: "ap-02", name: "AP-02", ip: "10.19.10.52", type: "access-point", location: "MIS GF", status: "online" },
  { id: "ap-03", name: "AP-03", ip: "10.19.10.53", type: "access-point", location: "ACRC GF-1", status: "online" },
  { id: "ap-04", name: "AP-04", ip: "10.19.10.54", type: "access-point", location: "ACRC GF-2", status: "warning" },
  { id: "ap-05", name: "AP-05", ip: "10.19.10.55", type: "access-point", location: "ACRC FF-1", status: "online" },
  { id: "ap-06", name: "AP-06", ip: "10.19.10.56", type: "access-point", location: "ACRC FF-2", status: "online" },
  { id: "ap-07", name: "AP-07", ip: "10.19.10.57", type: "access-point", location: "Admin GF", status: "online" },
  { id: "ap-08", name: "AP-08", ip: "10.19.10.58", type: "access-point", location: "New Accounts", status: "online" },
  { id: "ap-09", name: "AP-09", ip: "10.19.10.59", type: "access-point", location: "APC&IC", status: "online" },
  { id: "ap-10", name: "AP-10", ip: "10.19.10.60", type: "access-point", location: "CDLE", status: "online" },
  { id: "ap-11", name: "AP-11", ip: "10.19.10.61", type: "access-point", location: "EMTL", status: "online" },
  { id: "ap-12", name: "AP-12", ip: "10.19.10.62", type: "access-point", location: "FBRC GF-1", status: "online" },
  { id: "ap-13", name: "AP-13", ip: "10.19.10.63", type: "access-point", location: "FBRC GF-2", status: "online" },
  { id: "ap-14", name: "AP-14", ip: "10.19.10.64", type: "access-point", location: "FBRC FF-1", status: "online" },
  { id: "ap-15", name: "AP-15", ip: "10.19.10.65", type: "access-point", location: "FBRC FF-2", status: "online" },
  { id: "ap-16", name: "AP-16", ip: "10.19.10.66", type: "access-point", location: "GCRC", status: "online" },
  {
    id: "ap-17",
    name: "AP-17",
    ip: "10.19.10.67",
    type: "access-point",
    location: "Old Guest House",
    status: "online",
  },
  {
    id: "ap-18",
    name: "AP-18",
    ip: "10.19.10.68",
    type: "access-point",
    location: "New Guest House",
    status: "online",
  },
  { id: "ap-19", name: "AP-19", ip: "10.19.10.69", type: "access-point", location: "ILO", status: "online" },
  { id: "ap-20", name: "AP-20", ip: "10.19.10.70", type: "access-point", location: "Old DG Office", status: "online" },
  { id: "ap-21", name: "AP-21", ip: "10.19.10.71", type: "access-point", location: "Library", status: "online" },
  { id: "ap-22", name: "AP-22", ip: "10.19.10.72", type: "access-point", location: "MPRC", status: "online" },
  { id: "ap-23", name: "AP-23", ip: "10.19.10.73", type: "access-point", location: "Old Accounts", status: "online" },
  {
    id: "ap-24",
    name: "AP-24",
    ip: "10.19.10.74",
    type: "access-point",
    location: "New DG Office GF",
    status: "online",
  },
  {
    id: "ap-25",
    name: "AP-25",
    ip: "10.19.10.75",
    type: "access-point",
    location: "New DG Office FF",
    status: "online",
  },
  { id: "ap-26", name: "AP-26", ip: "10.19.10.76", type: "access-point", location: "P&D", status: "online" },
  { id: "ap-27", name: "AP-27", ip: "10.19.10.77", type: "access-point", location: "Pitmaen GF", status: "online" },
  { id: "ap-28", name: "AP-28", ip: "10.19.10.78", type: "access-point", location: "Pitmaen FF", status: "online" },
  { id: "ap-29", name: "AP-29", ip: "10.19.10.79", type: "access-point", location: "ESC", status: "online" },
  { id: "ap-30", name: "AP-30", ip: "10.19.10.80", type: "access-point", location: "UMW", status: "online" },
]

// Distribution & Access Devices (10.19.10.151 - 255)
export const distributionDevices: NetworkDevice[] = [
  {
    id: "sw-01",
    name: "Access Switch-1",
    ip: "10.19.10.151",
    type: "distribution",
    location: "ACRC-SW-GF",
    status: "online",
  },
  {
    id: "sw-02",
    name: "Access Switch-2",
    ip: "10.19.10.152",
    type: "distribution",
    location: "ACRC-SW-FF",
    status: "online",
  },
  {
    id: "sw-03",
    name: "Access Switch-3",
    ip: "10.19.10.153",
    type: "distribution",
    location: "Admin-SW-1",
    status: "online",
  },
  {
    id: "sw-04",
    name: "Access Switch-4",
    ip: "10.19.10.154",
    type: "distribution",
    location: "New Accounts",
    status: "online",
  },
  {
    id: "sw-05",
    name: "Access Switch-5",
    ip: "10.19.10.155",
    type: "distribution",
    location: "APC&IC-SW-1",
    status: "online",
  },
  {
    id: "sw-06",
    name: "Access Switch-6",
    ip: "10.19.10.156",
    type: "distribution",
    location: "APC&IC-SW-2",
    status: "online",
  },
  {
    id: "sw-07",
    name: "Access Switch-7",
    ip: "10.19.10.157",
    type: "distribution",
    location: "CDLE-SW-01",
    status: "online",
  },
  {
    id: "sw-08",
    name: "Access Switch-8",
    ip: "10.19.10.158",
    type: "distribution",
    location: "DEP-SW-01",
    status: "online",
  },
  {
    id: "sw-09",
    name: "Access Switch-9",
    ip: "10.19.10.159",
    type: "distribution",
    location: "EMTL",
    status: "online",
  },
  {
    id: "sw-10",
    name: "Access Switch-10",
    ip: "10.19.10.160",
    type: "distribution",
    location: "FBRC-GF",
    status: "online",
  },
  {
    id: "sw-11",
    name: "Access Switch-11",
    ip: "10.19.10.161",
    type: "distribution",
    location: "FBRC-FF",
    status: "online",
  },
  {
    id: "sw-12",
    name: "Access Switch-12",
    ip: "10.19.10.162",
    type: "distribution",
    location: "GCRC",
    status: "online",
  },
  {
    id: "sw-13",
    name: "Access Switch-13",
    ip: "10.19.10.163",
    type: "distribution",
    location: "Guest House",
    status: "online",
  },
  {
    id: "sw-14",
    name: "Access Switch-14",
    ip: "10.19.10.164",
    type: "distribution",
    location: "ILO",
    status: "online",
  },
  {
    id: "sw-15",
    name: "Access Switch-15",
    ip: "10.19.10.165",
    type: "distribution",
    location: "Library",
    status: "online",
  },
  {
    id: "sw-16",
    name: "Access Switch-16",
    ip: "10.19.10.166",
    type: "distribution",
    location: "DG Office",
    status: "online",
  },
  {
    id: "sw-17",
    name: "Access Switch-17",
    ip: "10.19.10.167",
    type: "distribution",
    location: "MIS-SW-01",
    status: "online",
  },
  {
    id: "sw-18",
    name: "Access Switch-18",
    ip: "10.19.10.168",
    type: "distribution",
    location: "MIS-SW-02",
    status: "online",
  },
  {
    id: "sw-19",
    name: "Access Switch-19",
    ip: "10.19.10.169",
    type: "distribution",
    location: "MPRC",
    status: "online",
  },
  {
    id: "sw-20",
    name: "Access Switch-20",
    ip: "10.19.10.170",
    type: "distribution",
    location: "Old Accounts",
    status: "online",
  },
  {
    id: "sw-21",
    name: "Access Switch-21",
    ip: "10.19.10.171",
    type: "distribution",
    location: "P&D",
    status: "online",
  },
  {
    id: "sw-22",
    name: "Access Switch-22",
    ip: "10.19.10.172",
    type: "distribution",
    location: "Pitmaen",
    status: "online",
  },
  {
    id: "sw-23",
    name: "Access Switch-23",
    ip: "10.19.10.173",
    type: "distribution",
    location: "UMW-SW",
    status: "online",
  },
  {
    id: "sw-29",
    name: "Access Switch-29",
    ip: "10.19.10.181",
    type: "distribution",
    location: "PSTC-L Academic Block SW-1",
    status: "online",
  },
  {
    id: "sw-30",
    name: "Access Switch-30",
    ip: "10.19.10.182",
    type: "distribution",
    location: "PSTC-L Academic Block SW-2",
    status: "online",
  },
  {
    id: "sw-31",
    name: "Access Switch-31",
    ip: "10.19.10.183",
    type: "distribution",
    location: "PSTC-L Workshop",
    status: "online",
  },
]

// VLAN Configuration
export const vlanConfigs: VLANConfig[] = [
  { id: 1910, network: "10.19.10.0/24", description: "Devices Management IP Pool" },
  { id: 1912, network: "172.19.12.0/24", description: "Administration Wing LAN Pool" },
  { id: 1913, network: "172.19.13.0/24", description: "APC & IC LAN Pool" },
  { id: 1914, network: "172.19.14.0/24", description: "Bio-Metric LAN Pool" },
  { id: 1915, network: "172.19.15.0/24", description: "CDLE LAN Pool" },
  { id: 1916, network: "172.19.16.0/24", description: "FBRC LAN Pool" },
  { id: 1917, network: "172.19.17.0/24", description: "DG Office LAN Pool" },
  { id: 1918, network: "172.19.18.0/24", description: "EMTL LAN Pool" },
  { id: 1919, network: "172.19.19.0/24", description: "DAP LAN" },
  { id: 1920, network: "172.19.20.0/24", description: "GCRC LAN Pool" },
  { id: 1921, network: "172.19.21.0/24", description: "MPRC LAN Pool" },
  { id: 1922, network: "172.19.22.0/24", description: "ESC LAN Pool" },
  { id: 1923, network: "172.19.23.0/24", description: "Pitmaen LAN Pool" },
  { id: 1924, network: "172.19.24.0/24", description: "Security LAN Pool" },
  { id: 1925, network: "172.19.25.0/24", description: "Store LAN Pool" },
  { id: 1926, network: "172.19.26.0/24", description: "Old Accounts LAN Pool" },
  { id: 1927, network: "172.19.27.0/24", description: "Guest House LAN Pool" },
  { id: 1928, network: "172.19.28.0/24", description: "New Accounts LAN Pool" },
  { id: 1929, network: "172.19.29.0/24", description: "Purchase LAN Pool" },
  { id: 1930, network: "172.19.30.0/24", description: "P&D LAN Pool" },
  { id: 1931, network: "172.19.31.0/24", description: "ACRC LAN Pool" },
  { id: 1932, network: "172.19.32.0/24", description: "MIS LAN Pool" },
  { id: 1933, network: "172.19.33.0/24", description: "Library LAN Pool" },
  { id: 1934, network: "172.19.34.0/24", description: "UMW LAN Pool" },
  { id: 1935, network: "172.19.35.0/24", description: "PSTC-L Pool" },
  { id: 1936, network: "172.19.36.0/24", description: "ILO" },
  { id: 1937, network: "172.19.37.0/24", description: "Wireless LAN Pool" },
  { id: 1938, network: "172.19.38.0/24", description: "Camera Pool" },
  { id: 1939, network: "172.19.39.0/24", description: "IP Phone" },
  { id: 1940, network: "172.19.40.0/24", description: "DTSA LAN" },
  { id: 1941, network: "172.19.41.0/24", description: "Exchange ROOM" },
  { id: 1942, network: "172.19.42.0/24", description: "CEPS" },
]

// All devices combined
export const allDevices: NetworkDevice[] = [...coreDevices, ...accessPoints, ...distributionDevices]

// Default credentials
export const defaultCredentials = {
  username: "admin",
  password: "C0mt3l@e",
  sshUsername: "commtel",
  sshPassword: "C0mt3l@e",
}

// Cisco commands for CBS350 24P series
export const ciscoCommands = [
  "show version",
  "show running-config",
  "show interfaces status",
  "show vlan",
  "show mac address-table",
  "show ip route",
  "show spanning-tree",
  "show port-security",
  "show system",
  "show users",
  "show log",
  "show environment",
  "ping",
  "traceroute",
]
