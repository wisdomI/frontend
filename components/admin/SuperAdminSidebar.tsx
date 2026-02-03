"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  UserCheck,
  Landmark,
  Scale,
  Store,
  BarChart3,
  MessageSquare,
  Settings,
} from "lucide-react"

interface SuperAdminSidebarProps {
  onClose?: () => void
}

export default function SuperAdminSidebar({ onClose }: SuperAdminSidebarProps) {
  const pathname = usePathname()

  const menuItems = [
    { label: "Dashboard", icon: <LayoutDashboard className="w-5 h-5" />, path: "/super-admin" },
    { label: "Escrow", icon: <Landmark className="w-5 h-5" />, path: "/super-admin/escrow" },
    { label: "Dispute", icon: <Scale className="w-5 h-5" />, path: "/super-admin/dispute" },
    { label: "Marketplace", icon: <Store className="w-5 h-5" />, path: "/super-admin/marketplace" },
    { label: "Analytics", icon: <BarChart3 className="w-5 h-5" />, path: "/super-admin/analytics" },
    { label: "Verification", icon: <UserCheck className="w-5 h-5" />, path: "/super-admin/verification" },
    { label: "Communication", icon: <MessageSquare className="w-5 h-5" />, path: "/super-admin/communication" },
    { label: "Settings", icon: <Settings className="w-5 h-5" />, path: "/super-admin/settings" },
  ]

  return (
    <aside className="bg-white border border-gray-200 rounded-2xl shadow-md flex flex-col w-full h-[calc(100vh-160px)]">
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1 custom-scrollbar">
        {menuItems.map((item) => {
          // Check if this item is the dashboard (root path for this section)
          const isDashboard = item.path === "/super-admin"
          
          let active = false
          
          if (isDashboard) {
             // For dashboard, match exactly OR match sub-paths that don't belong to other items
             // The check ensures Dashboard is active for generic pages (like /super-admin/invoices)
             // but NOT active for pages that have their own sidebar item (like /super-admin/verification/...)
             active = pathname === item.path || 
                      (pathname.startsWith(item.path + "/") && 
                       !menuItems.some(other => other.path !== item.path && pathname.startsWith(other.path)))
          } else {
             // For specific sections, simple prefix match works (e.g. /super-admin/verification matches /super-admin/verification/review/1)
             active = pathname.startsWith(item.path)
          }

          return (
            <Link
              key={item.path}
              href={item.path}
              onClick={onClose}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                active
                  ? "bg-[#0B2E6F] text-white"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              <span className={active ? "text-white" : "text-gray-500"}>{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}
