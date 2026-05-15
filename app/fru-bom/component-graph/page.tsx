"use client"

import { useState, useRef, useMemo, useEffect, useCallback } from "react"
import { MainLayout } from "@/components/layout/main-layout"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Switch } from "@/components/ui/switch"
import { 
  Search, 
  X, 
  Layers,
  ChevronDown,
  ChevronRight,
  AlertCircle,
  Minus,
  Plus,
  RotateCcw,
  Crown,
  Cpu,
  CircuitBoard,
  Maximize2,
  Target,
  GitCommit,
  Box,
  ArrowRightLeft,
  Download,
  Filter,
  ChevronUp
} from "lucide-react"
import { cn } from "@/lib/utils"

// Node types
type NodeType = "fru" | "fru-substitute" | "lenovo-ppn" | "lenovo-ppn-substitute" | "vendor-ppn" | "ineffective"
type SubstituteStatus = "topmost" | "default" | "ineffective"
type SearchType = "fru" | "lenovo-ppn" | "vendor-ppn"

// Node data
interface GraphNode {
  id: string
  name: string
  type: NodeType
  x: number
  y: number
  status?: SubstituteStatus
  deleteTime?: string
  description?: string
  parentId?: string
  children?: string[]
  substitutes?: string[]
  isExpanded?: boolean
  level?: string  // L1, L2, L3, L4
  vendors?: string[]  // 关联的 Vendor PPN IDs
  showAllSubstitutes?: boolean  // 是否显示所有替换节点
}

interface GraphEdge {
  from: string
  to: string
  type: "hierarchy" | "substitute"
  label?: string
}

// Mock data storage
let allNodes: Map<string, GraphNode> = new Map()
let visibleNodeIds: Set<string> = new Set()
let mockEdges: GraphEdge[] = []

// Generate mock data with Level-based layout
const generateMockData = (searchId: string, searchType: SearchType) => {
  allNodes = new Map()
  
  // 布局配置 - 水平间距100px，替换节点与父节点间距100px
  const CONFIG = {
    nodeWidth: 140,
    nodeHeight: 60,
    substituteWidth: 120,
    substituteHeight: 50,
    vendorWidth: 120,
    vendorHeight: 50,
    gapX: 100,          // 水平间距100px
    gapY: 120,          // 垂直间距120px（确保展开替换节点不覆盖）
    substituteGapX: 100,// 替换节点与父节点水平间距100px
    substituteGapY: 70, // 替换节点垂直间距70px
    vendorGapY: 80,     // Vendor节点垂直间距80px
    startX: 350,        // 起始X位置（给左侧替换节点留足够空间）
    startY: 100,        // 起始Y位置
  }
  
  // ==================== L1 Level - FRU和L1在同一行 ====================
  const l1Y = CONFIG.startY
  
  // FRU 节点（与L1同行）
  const mainFru: GraphNode = { 
    id: "FRU-MAIN", 
    name: "FRU-001", 
    type: "fru", 
    x: CONFIG.startX, 
    y: l1Y,
    isExpanded: true,
    showAllSubstitutes: false,
    substitutes: ["FRU-SUB-1", "FRU-SUB-2", "FRU-SUB-3", "FRU-SUB-4", "FRU-SUB-5"]
  }
  allNodes.set(mainFru.id, mainFru)
  
  // FRU 替换节点（放在左侧，垂直分布，与父节点间距100px）
  const fruSubstitutes: GraphNode[] = [
    { id: "FRU-SUB-1", name: "FRU-002", type: "fru-substitute", x: CONFIG.startX - CONFIG.substituteWidth - CONFIG.substituteGapX, y: l1Y - 70, status: "topmost", parentId: "FRU-MAIN" },
    { id: "FRU-SUB-2", name: "FRU-003", type: "fru-substitute", x: CONFIG.startX - CONFIG.substituteWidth - CONFIG.substituteGapX, y: l1Y, status: "default", parentId: "FRU-MAIN" },
    { id: "FRU-SUB-3", name: "FRU-004", type: "fru-substitute", x: CONFIG.startX - CONFIG.substituteWidth - CONFIG.substituteGapX, y: l1Y + 70, status: "default", parentId: "FRU-MAIN" },
    { id: "FRU-SUB-4", name: "FRU-005", type: "fru-substitute", x: CONFIG.startX - CONFIG.substituteWidth - CONFIG.substituteGapX, y: l1Y + 140, status: "ineffective", parentId: "FRU-MAIN", deleteTime: "2024/11/02" },
    { id: "FRU-SUB-5", name: "FRU-006", type: "fru-substitute", x: CONFIG.startX - CONFIG.substituteWidth - CONFIG.substituteGapX, y: l1Y + 210, status: "default", parentId: "FRU-MAIN" },
  ]
  fruSubstitutes.forEach(n => allNodes.set(n.id, n))
  
  // L1 Lenovo PPN 节点（与FRU同行，在FRU右侧，间距100px）
  const lenovoL1: GraphNode = { 
    id: "LEN-L1-001", 
    name: "LPN-L1-001", 
    type: "lenovo-ppn", 
    x: CONFIG.startX + CONFIG.nodeWidth + CONFIG.gapX, 
    y: l1Y, 
    level: "L1",
    parentId: "FRU-MAIN",
    isExpanded: true,
    showAllSubstitutes: false,
    substitutes: ["LEN-L1-SUB-1", "LEN-L1-SUB-2", "LEN-L1-SUB-3", "LEN-L1-SUB-4"],
    vendors: ["VEN-L1-001", "VEN-L1-002"]
  }
  allNodes.set(lenovoL1.id, lenovoL1)
  
  // L1 替换节点（左侧，垂直分布，与父节点间距100px）
  const l1Substitutes: GraphNode[] = [
    { id: "LEN-L1-SUB-1", name: "LPN-L1-002", type: "lenovo-ppn-substitute", x: lenovoL1.x - CONFIG.substituteWidth - CONFIG.substituteGapX, y: l1Y - 70, status: "default", parentId: "LEN-L1-001", level: "L1" },
    { id: "LEN-L1-SUB-2", name: "LPN-L1-003", type: "lenovo-ppn-substitute", x: lenovoL1.x - CONFIG.substituteWidth - CONFIG.substituteGapX, y: l1Y, status: "topmost", parentId: "LEN-L1-001", level: "L1" },
    { id: "LEN-L1-SUB-3", name: "LPN-L1-004", type: "lenovo-ppn-substitute", x: lenovoL1.x - CONFIG.substituteWidth - CONFIG.substituteGapX, y: l1Y + 70, status: "default", parentId: "LEN-L1-001", level: "L1" },
    { id: "LEN-L1-SUB-4", name: "LPN-L1-005", type: "lenovo-ppn-substitute", x: lenovoL1.x - CONFIG.substituteWidth - CONFIG.substituteGapX, y: l1Y + 140, status: "ineffective", parentId: "LEN-L1-001", level: "L1", deleteTime: "2024/10/15" },
  ]
  l1Substitutes.forEach(n => allNodes.set(n.id, n))
  
  // L1 Vendor 节点（右侧，垂直分布，间距100px）
  const l1Vendors: GraphNode[] = [
    { id: "VEN-L1-001", name: "VPN-L1-001", type: "vendor-ppn", x: lenovoL1.x + CONFIG.nodeWidth + CONFIG.gapX, y: l1Y - 40, parentId: "LEN-L1-001", level: "L1" },
    { id: "VEN-L1-002", name: "VPN-L1-002", type: "vendor-ppn", x: lenovoL1.x + CONFIG.nodeWidth + CONFIG.gapX, y: l1Y + 40, parentId: "LEN-L1-001", level: "L1" },
  ]
  l1Vendors.forEach(n => allNodes.set(n.id, n))
  
  // ==================== L2 Level ====================
  // 计算L2的Y位置：确保展开L1的替换节点时不覆盖L2
  // L1有5个替换节点，展开时高度约 5 * 70 = 350px，加上间距
  const l2Y = l1Y + CONFIG.nodeHeight + CONFIG.gapY + 100
  const lenovoL2: GraphNode = { 
    id: "LEN-L2-001", 
    name: "LPN-L2-001", 
    type: "lenovo-ppn", 
    x: CONFIG.startX + CONFIG.nodeWidth + CONFIG.gapX, 
    y: l2Y, 
    level: "L2",
    parentId: "FRU-MAIN",
    isExpanded: true,
    showAllSubstitutes: false,
    substitutes: ["LEN-L2-SUB-1", "LEN-L2-SUB-2"],
    vendors: ["VEN-L2-001"]
  }
  allNodes.set(lenovoL2.id, lenovoL2)
  
  // L2 替换节点（左侧，与父节点间距100px）
  const l2Substitutes: GraphNode[] = [
    { id: "LEN-L2-SUB-1", name: "LPN-L2-002", type: "lenovo-ppn-substitute", x: lenovoL2.x - CONFIG.substituteWidth - CONFIG.substituteGapX, y: l2Y - 35, status: "default", parentId: "LEN-L2-001", level: "L2" },
    { id: "LEN-L2-SUB-2", name: "LPN-L2-003", type: "lenovo-ppn-substitute", x: lenovoL2.x - CONFIG.substituteWidth - CONFIG.substituteGapX, y: l2Y + 35, status: "default", parentId: "LEN-L2-001", level: "L2" },
  ]
  l2Substitutes.forEach(n => allNodes.set(n.id, n))
  
  // L2 Vendor
  const l2Vendors: GraphNode[] = [
    { id: "VEN-L2-001", name: "VPN-L2-001", type: "vendor-ppn", x: lenovoL2.x + CONFIG.nodeWidth + CONFIG.gapX, y: l2Y, parentId: "LEN-L2-001", level: "L2" },
  ]
  l2Vendors.forEach(n => allNodes.set(n.id, n))
  
  // ==================== L3 Level ====================
  const l3Y = l2Y + CONFIG.nodeHeight + CONFIG.gapY
  const lenovoL3: GraphNode = { 
    id: "LEN-L3-001", 
    name: "LPN-L3-001", 
    type: "lenovo-ppn", 
    x: CONFIG.startX + CONFIG.nodeWidth + CONFIG.gapX, 
    y: l3Y, 
    level: "L3",
    parentId: "FRU-MAIN",
    isExpanded: true,
    showAllSubstitutes: false,
    substitutes: ["LEN-L3-SUB-1", "LEN-L3-SUB-2", "LEN-L3-SUB-3"],
    vendors: ["VEN-L3-001", "VEN-L3-002", "VEN-L3-003"]
  }
  allNodes.set(lenovoL3.id, lenovoL3)
  
  // L3 替换节点（左侧，与父节点间距100px）
  const l3Substitutes: GraphNode[] = [
    { id: "LEN-L3-SUB-1", name: "LPN-L3-002", type: "lenovo-ppn-substitute", x: lenovoL3.x - CONFIG.substituteWidth - CONFIG.substituteGapX, y: l3Y - 70, status: "default", parentId: "LEN-L3-001", level: "L3" },
    { id: "LEN-L3-SUB-2", name: "LPN-L3-003", type: "lenovo-ppn-substitute", x: lenovoL3.x - CONFIG.substituteWidth - CONFIG.substituteGapX, y: l3Y, status: "topmost", parentId: "LEN-L3-001", level: "L3" },
    { id: "LEN-L3-SUB-3", name: "LPN-L3-004", type: "lenovo-ppn-substitute", x: lenovoL3.x - CONFIG.substituteWidth - CONFIG.substituteGapX, y: l3Y + 70, status: "default", parentId: "LEN-L3-001", level: "L3" },
  ]
  l3Substitutes.forEach(n => allNodes.set(n.id, n))
  
  // L3 Vendors
  const l3Vendors: GraphNode[] = [
    { id: "VEN-L3-001", name: "VPN-L3-001", type: "vendor-ppn", x: lenovoL3.x + CONFIG.nodeWidth + CONFIG.gapX, y: l3Y - 80, parentId: "LEN-L3-001", level: "L3" },
    { id: "VEN-L3-002", name: "VPN-L3-002", type: "vendor-ppn", x: lenovoL3.x + CONFIG.nodeWidth + CONFIG.gapX, y: l3Y, parentId: "LEN-L3-001", level: "L3" },
    { id: "VEN-L3-003", name: "VPN-L3-003", type: "vendor-ppn", x: lenovoL3.x + CONFIG.nodeWidth + CONFIG.gapX, y: l3Y + 80, parentId: "LEN-L3-001", level: "L3" },
  ]
  l3Vendors.forEach(n => allNodes.set(n.id, n))
  
  // ==================== L4 Level ====================
  const l4Y = l3Y + CONFIG.nodeHeight + CONFIG.gapY
  const lenovoL4: GraphNode = { 
    id: "LEN-L4-001", 
    name: "LPN-L4-001", 
    type: "lenovo-ppn", 
    x: CONFIG.startX + CONFIG.nodeWidth + CONFIG.gapX, 
    y: l4Y, 
    level: "L4",
    parentId: "FRU-MAIN",
    isExpanded: false,
    showAllSubstitutes: false,
    substitutes: ["LEN-L4-SUB-1"],
    vendors: ["VEN-L4-001"]
  }
  allNodes.set(lenovoL4.id, lenovoL4)
  
  // L4 替换节点（与父节点间距100px）
  const l4Substitutes: GraphNode[] = [
    { id: "LEN-L4-SUB-1", name: "LPN-L4-002", type: "lenovo-ppn-substitute", x: lenovoL4.x - CONFIG.substituteWidth - CONFIG.substituteGapX, y: l4Y, status: "default", parentId: "LEN-L4-001", level: "L4" },
  ]
  l4Substitutes.forEach(n => allNodes.set(n.id, n))
  
  // L4 Vendor
  const l4Vendors: GraphNode[] = [
    { id: "VEN-L4-001", name: "VPN-L4-001", type: "vendor-ppn", x: lenovoL4.x + CONFIG.nodeWidth + CONFIG.gapX, y: l4Y, parentId: "LEN-L4-001", level: "L4" },
  ]
  l4Vendors.forEach(n => allNodes.set(n.id, n))
  
  // ==================== 初始化可见节点 ====================
  visibleNodeIds = new Set(["FRU-MAIN"])
  
  // 添加 FRU 替换节点（默认显示前3个）
  if (mainFru.isExpanded && mainFru.substitutes) {
    const visibleCount = mainFru.showAllSubstitutes ? mainFru.substitutes.length : Math.min(3, mainFru.substitutes.length)
    for (let i = 0; i < visibleCount; i++) {
      visibleNodeIds.add(mainFru.substitutes[i])
    }
  }
  
  // 添加 Lenovo PPN 节点及其替换节点和 Vendors
  const lenovoNodes = [lenovoL1, lenovoL2, lenovoL3, lenovoL4]
  lenovoNodes.forEach(node => {
    visibleNodeIds.add(node.id)
    
    // 添加替换节点（默认显示前3个）
    if (node.isExpanded && node.substitutes) {
      const visibleCount = node.showAllSubstitutes ? node.substitutes.length : Math.min(3, node.substitutes.length)
      for (let i = 0; i < visibleCount; i++) {
        visibleNodeIds.add(node.substitutes[i])
      }
    }
    
    // 添加 Vendor 节点
    if (node.vendors) {
      node.vendors.forEach(vendorId => visibleNodeIds.add(vendorId))
    }
  })
  
  // ==================== 创建连接线 ====================
  mockEdges = []
  
  // FRU 到 Lenovo PPN
  lenovoNodes.forEach(node => {
    mockEdges.push({ from: "FRU-MAIN", to: node.id, type: "hierarchy" })
  })
  
  // FRU 到替换节点
  if (mainFru.isExpanded && mainFru.substitutes) {
    const visibleCount = mainFru.showAllSubstitutes ? mainFru.substitutes.length : Math.min(3, mainFru.substitutes.length)
    for (let i = 0; i < visibleCount; i++) {
      mockEdges.push({ from: "FRU-MAIN", to: mainFru.substitutes[i], type: "substitute", label: "Equivalent" })
    }
  }
  
  // Lenovo PPN 到替换节点和 Vendors
  lenovoNodes.forEach(node => {
    // 替换节点
    if (node.isExpanded && node.substitutes) {
      const visibleCount = node.showAllSubstitutes ? node.substitutes.length : Math.min(3, node.substitutes.length)
      for (let i = 0; i < visibleCount; i++) {
        const subId = node.substitutes[i]
        const subNode = allNodes.get(subId)
        let label = "Equivalent"
        if (subNode?.status === "ineffective") label = "Soft"
        mockEdges.push({ from: node.id, to: subId, type: "substitute", label })
      }
    }
    
    // Vendors
    if (node.vendors) {
      node.vendors.forEach(vendorId => {
        mockEdges.push({ from: node.id, to: vendorId, type: "hierarchy" })
      })
    }
  })
  
  return { nodes: allNodes, visibleIds: visibleNodeIds, edges: mockEdges }
}

const mockSearchResults = [
  { id: "FRU-MAIN", type: "fru" as SearchType, name: "FRU-001", description: "Main FRU component" },
  { id: "FRU-SUB-1", type: "fru" as SearchType, name: "FRU-002", description: "Alternative FRU" },
  { id: "LEN-L1-001", type: "lenovo-ppn" as SearchType, name: "LPN-L1-001", description: "Lenovo PPN L1" },
  { id: "LEN-L2-001", type: "lenovo-ppn" as SearchType, name: "LPN-L2-001", description: "Lenovo PPN L2" },
  { id: "VEN-L1-001", type: "vendor-ppn" as SearchType, name: "VPN-L1-001", description: "Vendor PPN" },
]

// Node configuration
const nodeConfig: Record<NodeType, { 
  label: string
  bgColor: string
  borderColor: string
  textColor: string
  shadow: string
  width: number
  height: number
  fontSize: string
}> = {
  "fru": { 
    label: "FRU", 
    bgColor: "bg-primary",
    borderColor: "border-primary",
    textColor: "text-primary-foreground",
    shadow: "shadow-lg shadow-primary/30",
    width: 140,
    height: 60,
    fontSize: "text-sm",
  },
  "fru-substitute": { 
    label: "FRU", 
    bgColor: "bg-primary",
    borderColor: "border-primary",
    textColor: "text-primary-foreground",
    shadow: "shadow-md shadow-primary/20",
    width: 120,
    height: 50,
    fontSize: "text-xs",
  },
  "lenovo-ppn": { 
    label: "Lenovo PPN", 
    bgColor: "bg-secondary",
    borderColor: "border-primary",
    textColor: "text-primary",
    shadow: "shadow-md shadow-primary/10",
    width: 140,
    height: 60,
    fontSize: "text-sm",
  },
  "lenovo-ppn-substitute": { 
    label: "Lenovo PPN", 
    bgColor: "bg-secondary",
    borderColor: "border-primary",
    textColor: "text-primary",
    shadow: "shadow-sm",
    width: 120,
    height: 50,
    fontSize: "text-xs",
  },
  "vendor-ppn": { 
    label: "Vendor PPN", 
    bgColor: "bg-card",
    borderColor: "border-primary",
    textColor: "text-primary",
    shadow: "shadow-sm",
    width: 120,
    height: 50,
    fontSize: "text-xs",
  },
  "ineffective": { 
    label: "Ineffective", 
    bgColor: "bg-muted",
    borderColor: "border-border",
    textColor: "text-muted-foreground",
    shadow: "shadow-sm",
    width: 120,
    height: 50,
    fontSize: "text-xs",
  },
}

const statusConfig: Record<SubstituteStatus, { 
  badgeColor: string
  badgeText: string
  icon: React.ReactNode
}> = {
  "topmost": { 
    badgeColor: "bg-amber-400 text-amber-950", 
    badgeText: "Topmost",
    icon: <Crown className="w-3 h-3" />
  },
  "default": { 
    badgeColor: "bg-blue-100 text-blue-700", 
    badgeText: "Default",
    icon: null
  },
  "ineffective": { 
    badgeColor: "bg-gray-200 text-gray-500", 
    badgeText: "Ineffective",
    icon: <AlertCircle className="w-3 h-3" />
  },
}

// Empty state illustration component
const EmptyStateIllustration = () => (
  <div className="relative w-48 h-48 mx-auto mb-6">
    <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-primary/5 rounded-full opacity-50 animate-pulse" />
    <div className="absolute inset-4 bg-gradient-to-br from-primary/20 to-primary/10 rounded-full opacity-30" />
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="w-20 h-20 bg-gradient-to-br from-primary to-primary/80 rounded-2xl shadow-xl flex items-center justify-center transform hover:scale-105 transition-transform duration-300">
        <GitCommit className="w-10 h-10 text-primary-foreground" />
      </div>
    </div>
    <div className="absolute top-2 right-2 w-8 h-8 bg-card rounded-lg shadow-md border border-primary/20 flex items-center justify-center animate-bounce" style={{ animationDuration: '2s' }}>
      <Box className="w-4 h-4 text-primary" />
    </div>
    <div className="absolute bottom-4 left-2 w-6 h-6 bg-primary/10 rounded-md shadow-sm flex items-center justify-center" style={{ animation: 'pulse 3s infinite' }}>
      <Target className="w-3 h-3 text-primary" />
    </div>
  </div>
)

// 搜索结果为空时的插画组件
const NoResultsIllustration = () => (
  <div className="relative w-40 h-40 mx-auto mb-6">
    <div className="absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-50 rounded-full opacity-50" />
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="w-16 h-16 bg-gradient-to-br from-gray-300 to-gray-400 rounded-2xl shadow-lg flex items-center justify-center">
        <Search className="w-8 h-8 text-white" />
      </div>
    </div>
    <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-24 h-1 bg-gray-200 rounded-full blur-sm" />
  </div>
)

export default function ComponentGraphPage() {
  const [fruQuery, setFruQuery] = useState("")
  const [lenovoPpnQuery, setLenovoPpnQuery] = useState("")
  const [vendorPpnQuery, setVendorPpnQuery] = useState("")
  const [searchResults, setSearchResults] = useState<typeof mockSearchResults>([])
  const [showResults, setShowResults] = useState(false)
  const [hasSearched, setHasSearched] = useState(false)
  const [searchExecuted, setSearchExecuted] = useState(false)
  const [selectedNode, setSelectedNode] = useState<GraphNode | null>(null)
  const [hoveredNode, setHoveredNode] = useState<GraphNode | null>(null)
  const [showAvailableOnly, setShowAvailableOnly] = useState(true)
  const [scale, setScale] = useState(1)
  const [isDragging, setIsDragging] = useState(false)
  const [pan, setPan] = useState({ x: 50, y: 50 })
  const [isAnimating, setIsAnimating] = useState(false)
  const [expandedFruSubs, setExpandedFruSubs] = useState(true)
  const [expandedLenovoSubs, setExpandedLenovoSubs] = useState<Set<string>>(new Set())
  const [visibleNodes, setVisibleNodes] = useState<GraphNode[]>([])
  const [visibleEdges, setVisibleEdges] = useState<GraphEdge[]>([])
  
  const containerRef = useRef<HTMLDivElement>(null)
  const svgRef = useRef<SVGSVGElement>(null)
  const dragStart = useRef({ x: 0, y: 0 })

  // Update visible nodes and edges based on expansion state
  const updateVisibleElements = useCallback(() => {
    const newVisibleIds = new Set<string>(["FRU-MAIN"])
    const newEdges: GraphEdge[] = []
    
    const mainFru = allNodes.get("FRU-MAIN")
    if (!mainFru) return
    
    // Add FRU substitutes if expanded (默认显示前3个)
    if (expandedFruSubs && mainFru.substitutes) {
      const visibleCount = mainFru.showAllSubstitutes 
        ? mainFru.substitutes.length 
        : Math.min(3, mainFru.substitutes.length)
      
      for (let i = 0; i < visibleCount; i++) {
        const subId = mainFru.substitutes[i]
        const subNode = allNodes.get(subId)
        // 如果开启 Available Node 过滤，隐藏 Ineffective 节点
        if (showAvailableOnly && subNode?.status === "ineffective") continue
        
        newVisibleIds.add(subId)
        let label = "Equivalent"
        if (subNode?.status === "ineffective") label = "Soft"
        newEdges.push({ from: "FRU-MAIN", to: subId, type: "substitute", label })
      }
    }
    
    // Add Lenovo PPN nodes and their vendors/substitutes
    const lenovoLevels = ["L1", "L2", "L3", "L4"]
    lenovoLevels.forEach(level => {
      const lenovoNode = Array.from(allNodes.values()).find(n => n.level === level && n.type === "lenovo-ppn")
      if (!lenovoNode) return
      
      newVisibleIds.add(lenovoNode.id)
      newEdges.push({ from: "FRU-MAIN", to: lenovoNode.id, type: "hierarchy" })
      
      // Add Vendor PPN nodes
      if (lenovoNode.vendors) {
        lenovoNode.vendors.forEach(vendorId => {
          const vendorNode = allNodes.get(vendorId)
          // 如果开启 Available Node 过滤，隐藏 Ineffective 节点
          if (showAvailableOnly && vendorNode?.status === "ineffective") return
          
          newVisibleIds.add(vendorId)
          newEdges.push({ from: lenovoNode.id, to: vendorId, type: "hierarchy" })
        })
      }
      
      // Add Lenovo PPN substitutes if expanded (默认显示前3个)
      if (lenovoNode.isExpanded && lenovoNode.substitutes) {
        const visibleCount = lenovoNode.showAllSubstitutes 
          ? lenovoNode.substitutes.length 
          : Math.min(3, lenovoNode.substitutes.length)
        
        for (let i = 0; i < visibleCount; i++) {
          const subId = lenovoNode.substitutes[i]
          const subNode = allNodes.get(subId)
          // 如果开启 Available Node 过滤，隐藏 Ineffective 节点
          if (showAvailableOnly && subNode?.status === "ineffective") continue
          
          newVisibleIds.add(subId)
          let label = "Equivalent"
          if (subNode?.status === "ineffective") label = "Soft"
          newEdges.push({ from: lenovoNode.id, to: subId, type: "substitute", label })
        }
      }
    })
    
    const nodes = Array.from(newVisibleIds).map(id => allNodes.get(id)).filter(Boolean) as GraphNode[]
    setVisibleNodes(nodes)
    setVisibleEdges(newEdges)
  }, [expandedFruSubs, showAvailableOnly])

  // Toggle FRU substitutes expansion
  const toggleFruSubstitutes = () => {
    const mainFru = allNodes.get("FRU-MAIN")
    if (mainFru) {
      mainFru.isExpanded = !mainFru.isExpanded
      setExpandedFruSubs(mainFru.isExpanded)
    }
  }

  // Toggle "View All" for FRU substitutes
  const toggleFruViewAll = () => {
    const mainFru = allNodes.get("FRU-MAIN")
    if (mainFru) {
      mainFru.showAllSubstitutes = !mainFru.showAllSubstitutes
      updateVisibleElements()
    }
  }

  // Toggle Lenovo PPN substitutes expansion
  const toggleLenovoSubstitutes = (nodeId: string) => {
    const node = allNodes.get(nodeId)
    if (node && node.type === "lenovo-ppn") {
      node.isExpanded = !node.isExpanded
      setExpandedLenovoSubs(prev => {
        const newSet = new Set(prev)
        if (newSet.has(nodeId)) {
          newSet.delete(nodeId)
        } else {
          newSet.add(nodeId)
        }
        return newSet
      })
    }
  }

  // Toggle "View All" for Lenovo PPN substitutes
  const toggleLenovoViewAll = (nodeId: string) => {
    const node = allNodes.get(nodeId)
    if (node && node.type === "lenovo-ppn") {
      node.showAllSubstitutes = !node.showAllSubstitutes
      updateVisibleElements()
    }
  }

  // Get directly connected node IDs for highlighting (only immediate neighbors)
  const getConnectedNodeIds = useCallback((nodeId: string): Set<string> => {
    const connected = new Set<string>([nodeId])
    
    visibleEdges.forEach(edge => {
      if (edge.from === nodeId) {
        connected.add(edge.to)
      }
      if (edge.to === nodeId) {
        connected.add(edge.from)
      }
    })
    
    return connected
  }, [visibleEdges])

  const connectedNodeIds = useMemo(() => {
    if (!selectedNode) return new Set<string>()
    return getConnectedNodeIds(selectedNode.id)
  }, [selectedNode, getConnectedNodeIds])

  // Close details panel
  const closeNodeDetails = useCallback(() => {
    setSelectedNode(null)
  }, [])

  // Handle node click
  const handleNodeClick = useCallback((node: GraphNode, e: React.MouseEvent) => {
    e.stopPropagation()
    setSelectedNode(prev => prev?.id === node.id ? null : node)
  }, [])

  // Handle canvas background click
  const handleCanvasClick = useCallback((e: React.MouseEvent) => {
    if (e.target === containerRef.current || e.target === svgRef.current) {
      closeNodeDetails()
    }
  }, [closeNodeDetails])

  // ESC key handler
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeNodeDetails()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [closeNodeDetails])

  // Mouse drag for panning (canvas only)
  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.target === containerRef.current || e.target === svgRef.current) {
      setIsDragging(true)
      dragStart.current = { x: e.clientX - pan.x, y: e.clientY - pan.y }
    }
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      setPan({
        x: e.clientX - dragStart.current.x,
        y: e.clientY - dragStart.current.y
      })
    }
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  // Auto fit to screen
  const autoFit = useCallback(() => {
    if (visibleNodes.length === 0 || !containerRef.current) return
    
    const container = containerRef.current.getBoundingClientRect()
    const padding = 100
    
    const nodeWidth = 180
    const nodeHeight = 64
    
    const minX = Math.min(...visibleNodes.map(n => n.x)) - padding
    const maxX = Math.max(...visibleNodes.map(n => n.x + nodeWidth)) + padding
    const minY = Math.min(...visibleNodes.map(n => n.y)) - padding
    const maxY = Math.max(...visibleNodes.map(n => n.y + nodeHeight)) + padding
    
    const contentWidth = maxX - minX
    const contentHeight = maxY - minY
    
    const scaleX = container.width / contentWidth
    const scaleY = container.height / contentHeight
    const newScale = Math.min(scaleX, scaleY, 1)
    
    setScale(newScale)
    setPan({
      x: (container.width - contentWidth * newScale) / 2 - minX * newScale,
      y: (container.height - contentHeight * newScale) / 2 - minY * newScale
    })
  }, [visibleNodes])

  // Search handlers
  const handleQuery = () => {
    const query = fruQuery || lenovoPpnQuery || vendorPpnQuery
    if (!query.trim()) return
    
    let searchType: SearchType = "fru"
    let searchValue = fruQuery
    if (lenovoPpnQuery) {
      searchType = "lenovo-ppn"
      searchValue = lenovoPpnQuery
    } else if (vendorPpnQuery) {
      searchType = "vendor-ppn"
      searchValue = vendorPpnQuery
    }
    
    const results = mockSearchResults.filter(item =>
      item.id.toLowerCase().includes(searchValue.toLowerCase()) ||
      item.name.toLowerCase().includes(searchValue.toLowerCase())
    )
    setSearchResults(results)
    setShowResults(true)
    setSearchExecuted(true)

    if (results.length > 0) {
      handleSelectResult(results[0])
    }
  }

  const handleSelectResult = (item: typeof mockSearchResults[0]) => {
    setShowResults(false)
    setFruQuery(item.type === "fru" ? item.name : "")
    setLenovoPpnQuery(item.type === "lenovo-ppn" ? item.name : "")
    setVendorPpnQuery(item.type === "vendor-ppn" ? item.name : "")
    setIsAnimating(true)
    generateMockData(item.id, item.type)
    setHasSearched(true)
    setExpandedFruSubs(true)
    setExpandedLenovoSubs(new Set(["LEN-L1-001", "LEN-L2-001", "LEN-L3-001"]))
    
    setTimeout(() => {
      const rootNode = allNodes.get("FRU-MAIN")
      if (rootNode) setSelectedNode(rootNode)
      updateVisibleElements()
      setIsAnimating(false)
    }, 300)
  }

  const handleClear = () => {
    setFruQuery("")
    setLenovoPpnQuery("")
    setVendorPpnQuery("")
    setSearchResults([])
    setShowResults(false)
    setHasSearched(false)
    setSearchExecuted(false)
    setSelectedNode(null)
    allNodes = new Map()
    visibleNodeIds = new Set()
    mockEdges = []
    setVisibleNodes([])
    setVisibleEdges([])
  }

  const handleZoomIn = () => setScale(prev => Math.min(prev + 0.1, 2))
  const handleZoomOut = () => setScale(prev => Math.max(prev - 0.1, 0.3))
  const handleResetView = () => {
    setScale(1)
    setPan({ x: 50, y: 50 })
  }
  const handleRefreshLayout = () => {
    setIsAnimating(true)
    setTimeout(() => {
      autoFit()
      setIsAnimating(false)
    }, 300)
  }

  // Update visible elements when expansion state changes
  useEffect(() => {
    if (hasSearched) {
      updateVisibleElements()
    }
  }, [hasSearched, expandedFruSubs, expandedLenovoSubs, updateVisibleElements])

  // Calculate path for edges - 语义化连接线设计
  const calculatePath = (from: GraphNode, to: GraphNode, edgeType: string, isIneffective: boolean = false): string => {
    const fromConfig = nodeConfig[from.type]
    const toConfig = nodeConfig[to.type]
    const cornerRadius = 6 // 小圆角半径
    
    // 判断是否是垂直连接（Substitute节点在主节点下方）
    const isVerticalConnection = edgeType === "substitute" || 
      (Math.abs(from.x - to.x) < 50 && to.y > from.y + fromConfig.height)
    
    if (isVerticalConnection) {
      // 垂直连接：从父节点底部垂直向下，然后水平向右连接到子节点左侧
      const fromX = from.x + fromConfig.width / 2
      const fromY = from.y + fromConfig.height
      const toX = to.x
      const toY = to.y + toConfig.height / 2
      
      // 垂直向下到子节点同一水平线附近，然后水平连接
      const turnY = toY
      
      // 使用小圆角的折线：从父节点底部 -> 垂直向下 -> 水平向右到子节点左侧
      if (Math.abs(turnY - fromY) > cornerRadius * 2) {
        return `M ${fromX} ${fromY} L ${fromX} ${turnY - cornerRadius} Q ${fromX} ${turnY} ${fromX < toX ? fromX + cornerRadius : fromX - cornerRadius} ${turnY} L ${toX} ${toY}`
      } else {
        return `M ${fromX} ${fromY} L ${toX} ${toY}`
      }
    } else {
      // 水平连接：从节点右侧到下一个节点左侧，带小圆角
      const fromX = from.x + fromConfig.width
      const fromY = from.y + fromConfig.height / 2
      const toX = to.x
      const toY = to.y + toConfig.height / 2
      
      // 水平折线带小圆角 - 使用简单的L形或直线
      if (Math.abs(toY - fromY) < 10) {
        // 几乎在同一水平线，直接连接
        return `M ${fromX} ${fromY} L ${toX} ${toY}`
      } else {
        // L形连接带小圆角
        const midX = fromX + 40
        return `M ${fromX} ${fromY} L ${midX - cornerRadius} ${fromY} Q ${midX} ${fromY} ${midX} ${fromY < toY ? fromY + cornerRadius : fromY - cornerRadius} L ${midX} ${toY < fromY ? toY + cornerRadius : toY - cornerRadius} Q ${midX} ${toY} ${midX + cornerRadius} ${toY} L ${toX} ${toY}`
      }
    }
  }
  
  // 获取边的样式属性
  const getEdgeStyle = (edge: GraphEdge, toNode?: GraphNode) => {
    const isIneffective = toNode?.status === "ineffective" || toNode?.type === "ineffective"
    
    if (isIneffective) {
      // 失效连接：灰色虚线
      return {
        stroke: "#94A3B8",
        strokeWidth: 1.5,
        strokeDasharray: "4,4",
        opacity: 0.6,
      }
    }
    
    if (edge.type === "substitute") {
      // 替代关系：蓝色虚线（与箭头颜色一致）
      return {
        stroke: "#3B82F6",
        strokeWidth: 1.5,
        strokeDasharray: "5,3",
        opacity: 0.8,
      }
    }
    
    // 标准层级关系：蓝色实线（与箭头颜色一致）
    return {
      stroke: "#3B82F6",
      strokeWidth: 2,
      strokeDasharray: undefined,
      opacity: 1,
    }
  }

  // 获取节点层级标签
  const getNodeLevel = (node: GraphNode): string | null => {
    // 优先使用节点的 level 属性
    if (node.level) return node.level
    // 兼容旧逻辑
    if (node.type === "lenovo-ppn") {
      if (node.id === "LEN-001") return "L1"
      if (node.id === "LEN-002") return "L2"
      if (node.id === "LEN-003") return "L3"
    }
    return null
  }

  // Render node component - 新设计系统
  const renderNode = (node: GraphNode) => {
    const config = nodeConfig[node.type]
    const isSelected = selectedNode?.id === node.id
    const isHovered = hoveredNode?.id === node.id
    
    // 计算悬停或选中时的关联节点
    const activeNode = selectedNode || hoveredNode
    const isConnected = activeNode ? getConnectedNodeIds(activeNode.id).has(node.id) : true
    const isDimmed = activeNode && !isConnected
    
    const isFru = node.type === "fru"
    const isFruSub = node.type === "fru-substitute"
    const isLenovoPpn = node.type === "lenovo-ppn"
    const isLenovoSub = node.type === "lenovo-ppn-substitute"
    
    const isIneffective = node.status === "ineffective"
    const isTopmost = node.status === "topmost"
    const level = getNodeLevel(node)
    
    // 判断是否是主节点（FRU或Lenovo PPN）
    const isMainNode = isFru || isLenovoPpn
    // Substitute节点使用与父节点相同的颜色样式
    const isFruFamily = isFru || isFruSub
    const isLenovoFamily = isLenovoPpn || isLenovoSub
    
    return (
      <div
        key={node.id}
        onClick={(e) => handleNodeClick(node, e)}
        onMouseEnter={() => setHoveredNode(node)}
        onMouseLeave={() => setHoveredNode(null)}
        className={cn(
          "absolute rounded-xl cursor-pointer transition-all duration-300 overflow-visible",
          "flex flex-col",
          isMainNode ? "px-3 py-2.5" : "px-2.5 py-2",
          // 基础样式 - FRU家族（FRU和FRU Substitute）使用相同样式，Topmost也使用FRU样式
          isIneffective 
            ? "bg-muted border border-border"
            : isFruFamily
              ? "bg-gradient-to-br from-primary to-primary/80 border border-primary shadow-lg shadow-primary/20"
              : isLenovoFamily
                ? "bg-gradient-to-br from-secondary to-secondary/80 border border-primary/50 shadow-lg shadow-primary/10"
                : "bg-card border border-border shadow-md",
          // 选中状态
          isSelected && "ring-2 ring-offset-2 ring-primary",
          // 悬停或选中状态 - 点扩张效果
          (isHovered || isSelected) && "scale-[1.02] shadow-2xl z-30",
          // 高亮/变暗效果
          isDimmed ? "opacity-20" : "opacity-100",
          // 关联节点高亮
          isConnected && activeNode && !isDimmed && "brightness-110"
        )}
        style={{
          left: 0,
          top: 0,
          width: config.width,
          height: config.height,
          transform: `translate(${(node.x + pan.x) * scale}px, ${(node.y + pan.y) * scale}px) scale(${isHovered ? 1.02 : 1})`,
          transformOrigin: "0 0",
          zIndex: isSelected ? 25 : isHovered ? 30 : (isTopmost ? 15 : 10),
          filter: isDimmed ? "grayscale(0.5)" : undefined,
        }}
      >
        {/* 状态角标 - Topmost状态 */}
        {isTopmost && (
          <div className="absolute -top-3 left-4 px-3 py-1 bg-emerald-100 text-emerald-700 text-[10px] font-semibold rounded-full shadow-sm border border-emerald-200">
            Topmost
          </div>
        )}
        
        {/* 失效状态角标 - 与Topmost位置一致 */}
        {isIneffective && (
          <div className="absolute -top-3 left-4 px-3 py-1 bg-slate-400 text-white text-[10px] font-semibold rounded-full shadow-sm border border-slate-500">
            Ineffective
          </div>
        )}
        
        {/* Header层：类型标签 + Level标签 */}
        <div className="flex items-center justify-between mb-1">
          {/* 类型标签 */}
          <span className={cn(
            "text-[10px] font-medium",
            isIneffective 
              ? "text-slate-400"
              : isFruFamily || isLenovoFamily
                ? "text-blue-100/80" 
                : "text-slate-400"
          )}>
            {isFru || isFruSub ? "FRU" : isLenovoPpn || isLenovoSub ? "Lenovo PPN" : "Vendor PPN"}
          </span>
          
          {/* Level标签 - 药丸型 */}
          {level && (
            <span className={cn(
              "text-[9px] px-1.5 py-0.5 rounded-full border font-medium",
              isIneffective
                ? "border-slate-300 text-slate-400"
                : "border-blue-300/50 text-blue-100 bg-blue-800/30"
            )}>
              {level}
            </span>
          )}
        </div>
        
        {/* 核心ID - 粗体大字号 */}
        <div className="flex-1 flex items-end">
          <span className={cn(
            "font-bold truncate leading-tight",
            isIneffective
              ? "text-slate-400 text-sm"
              : isFruFamily || isLenovoFamily
                ? "text-white text-base"
                : "text-slate-700 text-sm"
          )}>
            {node.name}
          </span>
        </div>
        
        {/* 删除时间（仅失效状态） */}
        {node.deleteTime && (
          <div className="mt-1 text-[9px] text-slate-400">
            {node.deleteTime}
          </div>
        )}
      </div>
    )
  }
  
  // Render expand/collapse hotspot button - 放在节点左侧
  const renderExpandButton = (node: GraphNode) => {
    const isFru = node.type === "fru"
    const isLenovoPpn = node.type === "lenovo-ppn"
    const hasSubstitutes = (node.substitutes && node.substitutes.length > 0)
    
    if (!isFru && !(isLenovoPpn && hasSubstitutes)) return null
    
    const isExpanded = isFru ? expandedFruSubs : expandedLenovoSubs.has(node.id)
    const config = nodeConfig[node.type]
    
    return (
      <div
        key={`${node.id}-expand-btn`}
        onClick={(e) => {
          e.stopPropagation()
          if (isFru) {
            toggleFruSubstitutes()
          } else {
            toggleLenovoSubstitutes(node.id)
          }
        }}
        className={cn(
          "absolute w-6 h-6 rounded-full border-2 flex items-center justify-center cursor-pointer transition-all duration-200 hover:scale-105 z-20",
          isExpanded 
            ? "bg-white border-gray-400 text-gray-600 hover:bg-gray-50" 
            : "bg-blue-500 border-blue-500 text-white hover:bg-blue-600"
        )}
        style={{
          left: node.x - 32,
          top: node.y + config.height / 2 - 12,
          transform: `translate(${pan.x}px, ${pan.y}px) scale(${scale})`,
          transformOrigin: "0 0",
        }}
      >
        {isExpanded ? (
          <Minus className="w-3 h-3" />
        ) : (
          <Plus className="w-3 h-3" />
        )}
      </div>
    )
  }

  // Render "View All" button for substitutes
  const renderViewAllButton = (node: GraphNode) => {
    const isFru = node.type === "fru"
    const isLenovoPpn = node.type === "lenovo-ppn"
    const hasSubstitutes = (node.substitutes && node.substitutes.length > 0)
    const substituteCount = node.substitutes?.length || 0
    
    if (!isFru && !isLenovoPpn) return null
    if (!hasSubstitutes || substituteCount <= 3) return null
    
    const isNodeExpanded = isFru ? expandedFruSubs : expandedLenovoSubs.has(node.id)
    if (!isNodeExpanded) return null
    
    const showAll = node.showAllSubstitutes || false
    
    // 计算按钮位置（在替换节点列表下方）
    const visibleCount = showAll ? substituteCount : Math.min(3, substituteCount)
    const lastSubId = node.substitutes?.[visibleCount - 1]
    const lastSubNode = lastSubId ? allNodes.get(lastSubId) : null
    
    if (!lastSubNode) return null
    
    return (
      <div
        key={`${node.id}-view-all-btn`}
        onClick={(e) => {
          e.stopPropagation()
          if (isFru) {
            toggleFruViewAll()
          } else {
            toggleLenovoViewAll(node.id)
          }
        }}
        className="absolute px-3 py-1.5 bg-white border border-blue-300 rounded-lg text-xs font-medium text-blue-600 cursor-pointer transition-all duration-200 hover:bg-blue-50 hover:border-blue-400 z-20 shadow-sm"
        style={{
          left: lastSubNode.x,
          top: lastSubNode.y + 60,
          transform: `translate(${pan.x}px, ${pan.y}px) scale(${scale})`,
          transformOrigin: "0 0",
        }}
      >
        {showAll ? "Show Less" : `View All (${substituteCount})`}
      </div>
    )
  }

  return (
    <TooltipProvider>
      <MainLayout className="p-0 lg:p-6">
        <div className="h-full flex flex-col bg-background">
          {/* Header Section */}
          <div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <h1 className="text-xl font-semibold text-foreground">Component Graph</h1>
              </div>
              
              <div className="flex items-center gap-4">
                {hasSearched && (
                  <Button variant="outline" size="sm" className="gap-2 hover:bg-gray-50">
                    <Download className="h-4 w-4" />
                    Export
                  </Button>
                )}
              </div>
            </div>
          </div>

          {/* Search Panel */}
          <div className="py-6">
            <div className="flex gap-3 items-center">
              <div className="relative flex-1 min-w-0">
                <Input
                  placeholder="FRU"
                  value={fruQuery}
                  onChange={(e) => {
                    setFruQuery(e.target.value)
                    if (e.target.value) {
                      setLenovoPpnQuery("")
                      setVendorPpnQuery("")
                    }
                  }}
                  onKeyDown={(e) => e.key === "Enter" && handleQuery()}
                  className="pr-8 h-10 rounded-lg focus-visible:ring-primary focus-visible:border-primary w-full"
                />
                {fruQuery && (
                  <button
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 rounded hover:bg-muted transition-colors"
                    onClick={() => setFruQuery("")}
                  >
                    <X className="h-3 w-3 text-muted-foreground" />
                  </button>
                )}
              </div>

              <div className="relative flex-1 min-w-0">
                <Input
                  placeholder="Lenovo PPN"
                  value={lenovoPpnQuery}
                  onChange={(e) => {
                    setLenovoPpnQuery(e.target.value)
                    if (e.target.value) {
                      setFruQuery("")
                      setVendorPpnQuery("")
                    }
                  }}
                  onKeyDown={(e) => e.key === "Enter" && handleQuery()}
                  className="pr-8 h-10 rounded-lg focus-visible:ring-primary focus-visible:border-primary w-full"
                />
                {lenovoPpnQuery && (
                  <button
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 rounded hover:bg-muted transition-colors"
                    onClick={() => setLenovoPpnQuery("")}
                  >
                    <X className="h-3 w-3 text-muted-foreground" />
                  </button>
                )}
              </div>

              <div className="relative flex-1 min-w-0">
                <Input
                  placeholder="Vendor PPN"
                  value={vendorPpnQuery}
                  onChange={(e) => {
                    setVendorPpnQuery(e.target.value)
                    if (e.target.value) {
                      setFruQuery("")
                      setLenovoPpnQuery("")
                    }
                  }}
                  onKeyDown={(e) => e.key === "Enter" && handleQuery()}
                  className="pr-8 h-10 rounded-lg focus-visible:ring-primary focus-visible:border-primary w-full"
                />
                {vendorPpnQuery && (
                  <button
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 rounded hover:bg-muted transition-colors"
                    onClick={() => setVendorPpnQuery("")}
                  >
                    <X className="h-3 w-3 text-muted-foreground" />
                  </button>
                )}
              </div>

              <Button 
                onClick={handleQuery}
                className="gap-2 bg-primary hover:bg-primary/90 transition-all duration-200 h-10 px-4 flex-shrink-0"
              >
                <Search className="h-4 w-4" />
                Query
              </Button>

              {(fruQuery || lenovoPpnQuery || vendorPpnQuery) && (
                <Button 
                  variant="ghost"
                  onClick={handleClear}
                  className="gap-2 text-muted-foreground hover:text-foreground h-10 px-4 flex-shrink-0"
                >
                  <X className="h-4 w-4" />
                  Clear
                </Button>
              )}
            </div>
          </div>

          {/* Main Content - Outer container with border and rounded corners */}
          <div className="flex-1 flex overflow-hidden border border-border rounded-2xl">
            {/* Graph Canvas - Inner container without border and rounded corners */}
            <div className="flex-1 relative overflow-hidden bg-gradient-to-br from-gray-50 to-blue-50/30">
              {!searchExecuted ? (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center animate-in fade-in zoom-in duration-500">
                    <EmptyStateIllustration />
                    <h3 className="text-xl font-semibold text-foreground mb-2">No Component Selected</h3>
                    <p className="text-sm text-muted-foreground max-w-sm mx-auto">
                      Use the search above to find a FRU, Lenovo PPN, or Vendor PPN to view its component graph.
                    </p>
                  </div>
                </div>
              ) : searchExecuted && searchResults.length === 0 ? (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center animate-in fade-in zoom-in duration-500">
                    <NoResultsIllustration />
                    <p className="text-sm text-muted-foreground max-w-sm mx-auto">
                      No results found. Please modify your search criteria.
                    </p>
                  </div>
                </div>
              ) : (
                <>
                  {/* Canvas with pan/zoom */}
                  <div
                    ref={containerRef}
                    onClick={handleCanvasClick}
                    onMouseDown={handleMouseDown}
                    onMouseMove={handleMouseMove}
                    onMouseUp={handleMouseUp}
                    onMouseLeave={handleMouseUp}
                    className={cn(
                      "absolute inset-0 overflow-hidden",
                      isDragging ? "cursor-grabbing" : "cursor-grab"
                    )}
                  >
                    {/* Grid Background */}
                    <div 
                      className="absolute inset-0 opacity-[0.03] pointer-events-none"
                      style={{
                        backgroundImage: `
                          linear-gradient(to right, #1D4ED8 1px, transparent 1px),
                          linear-gradient(to bottom, #1D4ED8 1px, transparent 1px)
                        `,
                        backgroundSize: '40px 40px',
                        transform: `translate(${pan.x}px, ${pan.y}px)`,
                      }}
                    />

                    {/* SVG Edges */}
                    <svg 
                      ref={svgRef}
                      className="absolute inset-0 w-full h-full pointer-events-none"
                      style={{
                        transform: `translate(${pan.x}px, ${pan.y}px) scale(${scale})`,
                        transformOrigin: "0 0",
                      }}
                    >
                      <defs>
                        <marker id="arrowhead" markerWidth="6" markerHeight="6" refX="5" refY="2" orient="auto" markerUnits="strokeWidth">
                          <path d="M0,0 L0,4 L6,2 z" fill="#3B82F6" />
                        </marker>
                        <marker id="arrowhead-highlighted" markerWidth="6" markerHeight="6" refX="5" refY="2" orient="auto" markerUnits="strokeWidth">
                          <path d="M0,0 L0,4 L6,2 z" fill="#1D4ED8" />
                        </marker>
                        {/* 光流动画渐变 */}
                        <linearGradient id="flowGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                          <stop offset="0%" stopColor="transparent" />
                          <stop offset="50%" stopColor="#60A5FA" />
                          <stop offset="100%" stopColor="transparent" />
                        </linearGradient>
                        {/* 动画定义 */}
                        <style>{`
                          @keyframes flowAnimation {
                            0% { stroke-dashoffset: 100; }
                            100% { stroke-dashoffset: 0; }
                          }
                          .flow-line {
                            animation: flowAnimation 2s linear infinite;
                          }
                        `}</style>
                      </defs>
                      
                      {visibleEdges.map((edge, index) => {
                        const fromNode = allNodes.get(edge.from)
                        const toNode = allNodes.get(edge.to)
                        if (!fromNode || !toNode) return null

                        // 计算悬停或选中时的关联状态 - 只高亮与当前节点直接相连的边
                        const activeNode = selectedNode || hoveredNode
                        const isEdgeConnected = activeNode ? (
                          edge.from === activeNode.id || edge.to === activeNode.id
                        ) : false
                        const isDimmed = activeNode && !isEdgeConnected
                        
                        // 获取边的样式
                        const edgeStyle = getEdgeStyle(edge, toNode)
                        
                        // 计算标签位置（连线中点）
                        const fromConfig = nodeConfig[fromNode.type]
                        const toConfig = nodeConfig[toNode.type]
                        let labelX, labelY
                        
                        if (edge.type === "substitute") {
                          // 垂直连接的标签位置 - 放在整个连线的中间点
                          const fromX = fromNode.x + fromConfig.width / 2
                          const fromY = fromNode.y + fromConfig.height
                          const toX = toNode.x
                          const toY = toNode.y + toConfig.height / 2
                          labelX = (fromX + toX) / 2
                          labelY = (fromY + toY) / 2
                        } else {
                          // 水平连接的标签位置 - 放在连线上方
                          labelX = (fromNode.x + fromConfig.width + toNode.x) / 2
                          labelY = fromNode.y + fromConfig.height / 2 - 15
                        }
                        
                        const pathD = calculatePath(fromNode, toNode, edge.type, toNode.status === "ineffective")

                        return (
                          <g key={index}>
                            {/* 基础连接线 */}
                            <path
                              d={pathD}
                              fill="none"
                              stroke={isEdgeConnected ? "#1D4ED8" : edgeStyle.stroke}
                              strokeWidth={isEdgeConnected ? 3 : edgeStyle.strokeWidth}
                              strokeDasharray={edgeStyle.strokeDasharray}
                              markerEnd={isEdgeConnected ? "url(#arrowhead-highlighted)" : "url(#arrowhead)"}
                              style={{ opacity: isDimmed ? 0.1 : edgeStyle.opacity }}
                            />
                            {/* 光流效果 - 仅在关联路径上显示 */}
                            {isEdgeConnected && !isDimmed && (
                              <path
                                d={pathD}
                                fill="none"
                                stroke="url(#flowGradient)"
                                strokeWidth={4}
                                strokeDasharray="20, 80"
                                className="flow-line"
                                style={{ 
                                  filter: "drop-shadow(0 0 4px #60A5FA)",
                                  opacity: 0.8,
                                }}
                              />
                            )}
                            {/* 连接线标签 */}
                            {edge.label && (
                              <g>
                                <rect
                                  x={labelX - 32}
                                  y={labelY - 10}
                                  width={64}
                                  height={20}
                                  rx={4}
                                  fill="white"
                                  stroke={toNode.status === "ineffective" ? "#CBD5E1" : "#BFDBFE"}
                                  strokeWidth={1}
                                  style={{ opacity: isDimmed ? 0.2 : 1 }}
                                />
                                <text
                                  x={labelX}
                                  y={labelY + 4}
                                  textAnchor="middle"
                                  fontSize="10"
                                  fill={toNode.status === "ineffective" ? "#94A3B8" : "#1D4ED8"}
                                  style={{ opacity: isDimmed ? 0.2 : 1 }}
                                >
                                  {edge.label}
                                </text>
                              </g>
                            )}
                          </g>
                        )
                      })}
                    </svg>

                    {/* Nodes */}
                    {visibleNodes.map(renderNode)}
                    
                    {/* Expand/Collapse Buttons */}
                    {visibleNodes.filter(n => n.type === "fru" || (n.type === "lenovo-ppn" && n.substitutes && n.substitutes.length > 0)).map(renderExpandButton)}
                    
                    {/* View All Buttons */}
                    {visibleNodes.filter(n => (n.type === "fru" || n.type === "lenovo-ppn") && n.substitutes && n.substitutes.length > 3).map(renderViewAllButton)}
                  </div>

                  {/* Available Node Switch - 画布区域右上角 */}
                    {hasSearched && (
                      <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-lg border border-border p-2 shadow-lg flex items-center gap-2">
                        <Filter className="h-4 w-4 text-gray-500" />
                        <span className="text-sm text-gray-600">Available Node</span>
                        <Switch 
                          checked={showAvailableOnly}
                          onCheckedChange={setShowAvailableOnly}
                          className="data-[state=checked]:bg-primary"
                        />
                      </div>
                    )}

                    {/* Legend */}
                  <div className="absolute bottom-4 left-4 bg-card/90 backdrop-blur-sm rounded-lg border border-border p-3 shadow-lg">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded bg-gradient-to-br from-primary to-primary/80" />
                        <span className="text-xs text-muted-foreground">FRU</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded bg-gradient-to-br from-secondary to-secondary/80" />
                        <span className="text-xs text-muted-foreground">Lenovo PPN</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded bg-card border border-border" />
                        <span className="text-xs text-muted-foreground">Vendor PPN</span>
                      </div>
                    </div>
                  </div>

                  {/* Zoom Controls */}
                  <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm rounded-lg border border-border p-2 shadow-lg flex flex-col gap-1">
                    <Tooltip>
                      <TooltipTrigger>
                        <Button variant="ghost" size="icon" onClick={handleZoomIn} className="h-9 w-9 hover:bg-gray-100">
                          <Plus className="h-4 w-4 text-gray-600" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Zoom In</TooltipContent>
                    </Tooltip>
                    
                    <Tooltip>
                      <TooltipTrigger>
                        <Button variant="ghost" size="icon" onClick={handleZoomOut} className="h-9 w-9 hover:bg-gray-100">
                          <Minus className="h-4 w-4 text-gray-600" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Zoom Out</TooltipContent>
                    </Tooltip>
                    
                    <Separator className="my-1" />
                    
                    <Tooltip>
                      <TooltipTrigger>
                        <Button variant="ghost" size="icon" onClick={handleResetView} className="h-9 w-9 hover:bg-gray-100">
                          <Target className="h-4 w-4 text-gray-600" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Reset View</TooltipContent>
                    </Tooltip>
                    
                    <Tooltip>
                      <TooltipTrigger>
                        <Button variant="ghost" size="icon" onClick={autoFit} className="h-9 w-9 hover:bg-gray-100">
                          <Maximize2 className="h-4 w-4 text-gray-600" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Fit to Screen</TooltipContent>
                    </Tooltip>
                  </div>
                </>
              )}
            </div>

            {/* Right Side Panel - Node Details */}
            <div className={cn(
              "bg-white border-l border-border transition-all duration-300 ease-out flex flex-col shadow-xl",
              selectedNode ? "w-[420px] opacity-100" : "w-0 opacity-0 overflow-hidden"
            )}>
              {selectedNode && (
                <>
                  {/* Header - 参考设计图 */}
                  <div className="p-5 border-b border-border">
                    <div className="flex items-start justify-between mb-4">
                      <h3 className="text-xl font-bold text-foreground">{selectedNode.name}</h3>
                      <Button variant="ghost" size="icon" onClick={closeNodeDetails} className="shrink-0 -mr-2 -mt-2">
                        <X className="h-5 w-5" />
                      </Button>
                    </div>
                    
                    {/* 标签行 - FRU / L1 / Effective */}
                    <div className="flex items-center gap-2">
                      {selectedNode.type === "vendor-ppn" ? (
                        <>
                          <span className="px-3 py-1 bg-white text-slate-700 text-xs font-medium rounded-full border border-slate-300">
                            Vendor PPN
                          </span>
                          <span className="px-3 py-1 bg-white text-slate-600 text-xs font-medium rounded-full border border-slate-300">
                            L2
                          </span>
                          <span className={cn(
                            "px-3 py-1 text-xs font-medium rounded-full",
                            selectedNode.status === "ineffective"
                              ? "bg-slate-100 text-slate-500"
                              : "bg-blue-50 text-blue-600"
                          )}>
                            {selectedNode.status === "ineffective" ? "Ineffective" : "Effective"}
                          </span>
                        </>
                      ) : (
                        <>
                          <span className={cn(
                            "px-3 py-1 text-primary-foreground text-xs font-medium rounded-full",
                            selectedNode.type === "fru" ? "bg-primary" : "bg-secondary text-primary"
                          )}>
                            {selectedNode.type === "fru" ? "FRU" : "Lenovo PPN"}
                          </span>
                          {selectedNode.type === "lenovo-ppn" && getNodeLevel(selectedNode) && (
                            <span className="px-3 py-1 bg-card text-muted-foreground text-xs font-medium rounded-full border border-border">
                              {getNodeLevel(selectedNode)}
                            </span>
                          )}
                          <span className={cn(
                            "px-3 py-1 text-xs font-medium rounded-full",
                            selectedNode.status === "ineffective"
                              ? "bg-muted text-muted-foreground"
                              : "bg-secondary text-primary"
                          )}>
                            {selectedNode.status === "ineffective" ? "Ineffective" : "Effective"}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                  
                  <ScrollArea className="flex-1 h-[calc(100vh-200px)]">
                    <div className="p-5 space-y-6 pb-10">
                      {/* Basic Info Section */}
                      <div>
                        <h4 className="text-sm font-semibold text-foreground mb-4">Basic Info</h4>
                        <div className="space-y-3">
                          {selectedNode.type === "lenovo-ppn" ? (
                            <>
                              {/* Lenovo PPN Basic Info */}
                              <div className="flex justify-between items-center">
                                <span className="text-sm text-slate-500">Peer level FRU:</span>
                                <span className="text-sm font-medium text-slate-900">5B21U02708</span>
                              </div>
                              <div className="flex justify-between items-center">
                                <span className="text-sm text-slate-500">ppn_basic_name:</span>
                                <span className="text-sm font-medium text-slate-900">00XL087</span>
                              </div>
                              <div className="flex justify-between items-center">
                                <span className="text-sm text-slate-500">ppn_name:</span>
                                <span className="text-sm font-medium text-slate-900">Novelda X4C007</span>
                              </div>
                              <div className="flex justify-between items-center">
                                <span className="text-sm text-slate-500">ppn_qty:</span>
                                <span className="text-sm font-medium text-slate-900">1</span>
                              </div>
                              <div className="flex justify-between items-center">
                                <span className="text-sm text-slate-500">data_source:</span>
                                <span className="text-sm font-medium text-slate-900">1 FRU FAP BOM TPG</span>
                              </div>
                              <div className="flex justify-between items-center">
                                <span className="text-sm text-slate-500">update date:</span>
                                <span className="text-sm font-medium text-slate-900">2024/11/21</span>
                              </div>
                            </>
                          ) : selectedNode.type === "vendor-ppn" ? (
                            <>
                              {/* Vendor PPN Basic Info */}
                              <div className="flex justify-between items-center">
                                <span className="text-sm text-slate-500">lenovo_fru_pn:</span>
                                <span className="text-sm font-medium text-slate-900">21SX005681</span>
                              </div>
                              <div className="flex justify-between items-center">
                                <span className="text-sm text-slate-500">vendor_code:</span>
                                <span className="text-sm font-medium text-slate-900">1000340</span>
                              </div>
                              <div className="flex justify-between items-center">
                                <span className="text-sm text-slate-500">fru_source:</span>
                                <span className="text-sm font-medium text-slate-900">CFC</span>
                              </div>
                              <div className="flex justify-between items-center">
                                <span className="text-sm text-slate-500">Lenovo PPN:</span>
                                <span className="text-sm font-medium text-slate-900">001</span>
                              </div>
                              <div className="flex justify-between items-center">
                                <span className="text-sm text-slate-500">ppn_data_source:</span>
                                <span className="text-sm font-medium text-slate-900">719ANJ12035</span>
                              </div>
                              <div className="flex justify-between items-center">
                                <span className="text-sm text-slate-500">odm_pn_data_source:</span>
                                <span className="text-sm font-medium text-slate-900">--</span>
                              </div>
                              <div className="flex justify-between items-center">
                                <span className="text-sm text-slate-500">source_type:</span>
                                <span className="text-sm font-medium text-slate-900">AVAP/DB</span>
                              </div>
                              <div className="flex justify-between items-center">
                                <span className="text-sm text-slate-500">t2_source:</span>
                                <span className="text-sm font-medium text-slate-900">KM</span>
                              </div>
                              <div className="flex justify-between items-center">
                                <span className="text-sm text-slate-500">t2_vendor_data_source:</span>
                                <span className="text-sm font-medium text-slate-900">Mech</span>
                              </div>
                              <div className="flex justify-between items-center">
                                <span className="text-sm text-slate-500">commodity:</span>
                                <span className="text-sm font-medium text-slate-900">KB</span>
                              </div>
                              <div className="flex justify-between items-center">
                                <span className="text-sm text-slate-500">scc_lenovo_ppn:</span>
                                <span className="text-sm font-medium text-slate-900">1900/1/1 0:00</span>
                              </div>
                              <div className="flex justify-between items-center">
                                <span className="text-sm text-slate-500">create_time:</span>
                                <span className="text-sm font-medium text-slate-900">2026/1/23 16:33</span>
                              </div>
                              <div className="flex justify-between items-center">
                                <span className="text-sm text-slate-500">update_time:</span>
                                <span className="text-sm font-medium text-slate-900">1900/1/1 0:00</span>
                              </div>
                              <div className="flex justify-between items-center">
                                <span className="text-sm text-slate-500">ODM supplier Name:</span>
                                <span className="text-sm font-medium text-slate-900">--</span>
                              </div>
                              <div className="flex justify-between items-center">
                                <span className="text-sm text-slate-500">odm:</span>
                                <span className="text-sm font-medium text-slate-900">HUAQIN</span>
                              </div>
                              <div className="flex justify-between items-center">
                                <span className="text-sm text-slate-500">description:</span>
                                <span className="text-sm font-medium text-slate-900 text-right">54S52 LOG UP ASSY LA L81WA FPAREDIS</span>
                              </div>
                            </>
                          ) : (
                            <>
                              {/* FRU Basic Info */}
                              <div className="flex justify-between items-center">
                                <span className="text-sm text-slate-500">PN Category:</span>
                                <span className="text-sm font-medium text-slate-900">{selectedNode.name}</span>
                              </div>
                              <div className="flex justify-between items-center">
                                <span className="text-sm text-slate-500">commodity_code:</span>
                                <span className="text-sm font-medium text-slate-900">CC</span>
                              </div>
                              <div className="flex justify-between items-center">
                                <span className="text-sm text-slate-500">state:</span>
                                <span className="text-sm font-medium text-slate-900">PL</span>
                              </div>
                              <div className="flex justify-between items-center">
                                <span className="text-sm text-slate-500">name:</span>
                                <span className="text-sm font-medium text-slate-900">PRODUCTION</span>
                              </div>
                              <div className="flex justify-between items-center">
                                <span className="text-sm text-slate-500">fac_code:</span>
                                <span className="text-sm font-medium text-slate-900">WIN,15-11-FRU</span>
                              </div>
                              <div className="flex justify-between items-center">
                                <span className="text-sm text-slate-500">basic_name:</span>
                                <span className="text-sm font-medium text-slate-900">BDPLANAR</span>
                              </div>
                              <div className="flex justify-between items-center">
                                <span className="text-sm text-slate-500">time_stamp:</span>
                                <span className="text-sm font-medium text-slate-900">2024/11/2</span>
                              </div>
                              <div className="flex justify-between items-center">
                                <span className="text-sm text-slate-500">update date:</span>
                                <span className="text-sm font-medium text-slate-900">2024/11/21</span>
                              </div>
                              <div className="flex justify-between items-center">
                                <span className="text-sm text-slate-500">fru_description:</span>
                                <span className="text-sm font-medium text-slate-900">15-1133G7 32GB AX201WLAN</span>
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                      
                      {/* Spec Section - Vendor PPN 不显示 Spec */}
                      {selectedNode.type !== "vendor-ppn" && (
                        <>
                          <Separator />
                          <div>
                            <h4 className="text-sm font-semibold text-foreground mb-4">Spec</h4>
                            <div className="space-y-3">
                              {selectedNode.type === "lenovo-ppn" ? (
                                <>
                                  <div className="flex justify-between items-center">
                                    <span className="text-sm text-slate-500">specategory:</span>
                                    <span className="text-sm font-medium text-slate-900">Battery</span>
                                  </div>
                                  <div className="flex justify-between items-start">
                                    <span className="text-sm text-slate-500 shrink-0">specdescription:</span>
                                    <span className="text-sm font-medium text-slate-900 text-right">Battery YOGA-C740-15 Scell 60Wh 3367EI</span>
                                  </div>
                                  <div className="flex justify-between items-center">
                                    <span className="text-sm text-slate-500">attributename:</span>
                                    <span className="text-sm font-medium text-slate-900">Cell Name、Color、typ Wh</span>
                                  </div>
                                  <div className="flex justify-between items-center">
                                    <span className="text-sm text-slate-500">attributevalue:</span>
                                    <span className="text-sm font-medium text-slate-900">3367EI</span>
                                  </div>
                                  <div className="flex justify-between items-center">
                                    <span className="text-sm text-slate-500">ppndesc:</span>
                                    <span className="text-sm font-medium text-slate-900">--</span>
                                  </div>
                                </>
                              ) : (
                                <div className="flex justify-between items-center">
                                  <span className="text-sm text-slate-500">dpk:</span>
                                  <span className="text-sm font-medium text-slate-900">NOK</span>
                                </div>
                              )}
                            </div>
                          </div>
                        </>
                      )}
                      
                      {/* Substitute FRU Table - Only for FRU nodes */}
                      {selectedNode.type === "fru" && (
                        <>
                          <Separator />
                          <div>
                            <div className="flex items-center justify-between mb-4">
                              <h4 className="text-sm font-semibold text-foreground">Substitute FRU</h4>
                              <Button variant="outline" size="sm" className="h-7 text-xs gap-1">
                                <Download className="h-3 w-3" />
                                Export
                              </Button>
                            </div>
                            <div className="border rounded-lg overflow-hidden">
                              <div className="overflow-x-auto">
                                <table className="w-full text-xs">
                                  <thead className="bg-slate-50">
                                    <tr>
                                      <th className="px-3 py-2 text-left font-medium text-slate-600">Action</th>
                                      <th className="px-3 py-2 text-left font-medium text-slate-600">FRU</th>
                                      <th className="px-3 py-2 text-left font-medium text-slate-600">Lenovo PPN</th>
                                      <th className="px-3 py-2 text-left font-medium text-slate-600">Lenovo PPN Level</th>
                                      <th className="px-3 py-2 text-left font-medium text-slate-600">Time Stamp</th>
                                    </tr>
                                  </thead>
                                  <tbody className="divide-y">
                                    <tr className="bg-white">
                                      <td className="px-3 py-2">
                                        <span className="px-2 py-0.5 bg-blue-50 text-blue-600 rounded text-[10px]">Add</span>
                                      </td>
                                      <td className="px-3 py-2 text-blue-600">5B21U02708</td>
                                      <td className="px-3 py-2">001</td>
                                      <td className="px-3 py-2">
                                        <span className="px-2 py-0.5 bg-blue-50 text-blue-600 rounded text-[10px]">L1</span>
                                      </td>
                                      <td className="px-3 py-2 text-slate-500">2025-03-30</td>
                                    </tr>
                                    <tr className="bg-white">
                                      <td className="px-3 py-2">
                                        <span className="px-2 py-0.5 bg-blue-50 text-blue-600 rounded text-[10px]">Add</span>
                                      </td>
                                      <td className="px-3 py-2 text-blue-600">5B21U02708</td>
                                      <td className="px-3 py-2">001</td>
                                      <td className="px-3 py-2">
                                        <span className="px-2 py-0.5 bg-blue-50 text-blue-600 rounded text-[10px]">L1</span>
                                      </td>
                                      <td className="px-3 py-2 text-slate-500">2025-03-30</td>
                                    </tr>
                                    <tr className="bg-white">
                                      <td className="px-3 py-2">
                                        <span className="px-2 py-0.5 bg-slate-300 text-white rounded text-[10px]">Ineffective</span>
                                      </td>
                                      <td className="px-3 py-2 text-blue-600">5B21U02708</td>
                                      <td className="px-3 py-2">001</td>
                                      <td className="px-3 py-2">
                                        <span className="px-2 py-0.5 bg-blue-50 text-blue-600 rounded text-[10px]">L2</span>
                                      </td>
                                      <td className="px-3 py-2 text-slate-500">2025-03-30</td>
                                    </tr>
                                    <tr className="bg-white">
                                      <td className="px-3 py-2">
                                        <span className="px-2 py-0.5 bg-slate-300 text-white rounded text-[10px]">Ineffective</span>
                                      </td>
                                      <td className="px-3 py-2 text-blue-600">5B21U02708</td>
                                      <td className="px-3 py-2">001</td>
                                      <td className="px-3 py-2">
                                        <span className="px-2 py-0.5 bg-blue-50 text-blue-600 rounded text-[10px]">L2</span>
                                      </td>
                                      <td className="px-3 py-2 text-slate-500">2025-03-30</td>
                                    </tr>
                                    <tr className="bg-white">
                                      <td className="px-3 py-2">
                                        <span className="px-2 py-0.5 bg-blue-50 text-blue-600 rounded text-[10px]">Add</span>
                                      </td>
                                      <td className="px-3 py-2 text-blue-600">5B21U02708</td>
                                      <td className="px-3 py-2">001</td>
                                      <td className="px-3 py-2">
                                        <span className="px-2 py-0.5 bg-blue-50 text-blue-600 rounded text-[10px]">L2</span>
                                      </td>
                                      <td className="px-3 py-2 text-slate-500">2025-03-30</td>
                                    </tr>
                                  </tbody>
                                </table>
                              </div>
                            </div>
                          </div>
                        </>
                      )}

                      {/* FRU-Lenovo PPN changelog - Only for Lenovo PPN nodes */}
                      {selectedNode.type === "lenovo-ppn" && (
                        <>
                          <Separator />
                          <div>
                            <div className="flex items-center justify-between mb-4">
                              <h4 className="text-sm font-semibold text-foreground">FRU-Lenovo PPN changelog</h4>
                              <Button variant="outline" size="sm" className="h-7 text-xs gap-1">
                                <Download className="h-3 w-3" />
                                Export
                              </Button>
                            </div>
                            <div className="border rounded-lg overflow-hidden">
                              <div className="overflow-x-auto">
                                <table className="w-full text-xs">
                                  <thead className="bg-slate-50">
                                    <tr>
                                      <th className="px-3 py-2 text-left font-medium text-slate-600">Action</th>
                                      <th className="px-3 py-2 text-left font-medium text-slate-600">FRU</th>
                                      <th className="px-3 py-2 text-left font-medium text-slate-600">Lenovo PPN</th>
                                      <th className="px-3 py-2 text-left font-medium text-slate-600">Lenovo PPN Level</th>
                                      <th className="px-3 py-2 text-left font-medium text-slate-600">Time Stamp</th>
                                    </tr>
                                  </thead>
                                  <tbody className="divide-y">
                                    <tr className="bg-white">
                                      <td className="px-3 py-2">
                                        <span className="px-2 py-0.5 bg-blue-50 text-blue-600 rounded text-[10px]">Add</span>
                                      </td>
                                      <td className="px-3 py-2 text-blue-600">5B21U02708</td>
                                      <td className="px-3 py-2">001</td>
                                      <td className="px-3 py-2">
                                        <span className="px-2 py-0.5 bg-blue-50 text-blue-600 rounded text-[10px]">L1</span>
                                      </td>
                                      <td className="px-3 py-2 text-slate-500">2025-03-30</td>
                                    </tr>
                                    <tr className="bg-white">
                                      <td className="px-3 py-2">
                                        <span className="px-2 py-0.5 bg-blue-50 text-blue-600 rounded text-[10px]">Add</span>
                                      </td>
                                      <td className="px-3 py-2 text-blue-600">5B21U02708</td>
                                      <td className="px-3 py-2">001</td>
                                      <td className="px-3 py-2">
                                        <span className="px-2 py-0.5 bg-blue-50 text-blue-600 rounded text-[10px]">L1</span>
                                      </td>
                                      <td className="px-3 py-2 text-slate-500">2025-03-30</td>
                                    </tr>
                                    <tr className="bg-white">
                                      <td className="px-3 py-2">
                                        <span className="px-2 py-0.5 bg-slate-300 text-white rounded text-[10px]">Ineffective</span>
                                      </td>
                                      <td className="px-3 py-2 text-blue-600">5B21U02708</td>
                                      <td className="px-3 py-2">001</td>
                                      <td className="px-3 py-2">
                                        <span className="px-2 py-0.5 bg-blue-50 text-blue-600 rounded text-[10px]">L2</span>
                                      </td>
                                      <td className="px-3 py-2 text-slate-500">2025-03-30</td>
                                    </tr>
                                    <tr className="bg-white">
                                      <td className="px-3 py-2">
                                        <span className="px-2 py-0.5 bg-slate-300 text-white rounded text-[10px]">Ineffective</span>
                                      </td>
                                      <td className="px-3 py-2 text-blue-600">5B21U02708</td>
                                      <td className="px-3 py-2">001</td>
                                      <td className="px-3 py-2">
                                        <span className="px-2 py-0.5 bg-blue-50 text-blue-600 rounded text-[10px]">L2</span>
                                      </td>
                                      <td className="px-3 py-2 text-slate-500">2025-03-30</td>
                                    </tr>
                                    <tr className="bg-white">
                                      <td className="px-3 py-2">
                                        <span className="px-2 py-0.5 bg-blue-50 text-blue-600 rounded text-[10px]">Add</span>
                                      </td>
                                      <td className="px-3 py-2 text-blue-600">5B21U02708</td>
                                      <td className="px-3 py-2">001</td>
                                      <td className="px-3 py-2">
                                        <span className="px-2 py-0.5 bg-blue-50 text-blue-600 rounded text-[10px]">L2</span>
                                      </td>
                                      <td className="px-3 py-2 text-slate-500">2025-03-30</td>
                                    </tr>
                                  </tbody>
                                </table>
                              </div>
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  </ScrollArea>
                </>
              )}
            </div>
          </div>
        </div>
      </MainLayout>
    </TooltipProvider>
  )
}
