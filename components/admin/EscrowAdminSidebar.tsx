"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Landmark,
  BarChart3,
} from "lucide-react"

interface EscrowAdminSidebarProps {
  onClose?: () => void
  basePath?: string
  className?: string
}

export default function EscrowAdminSidebar({ onClose, basePath = '/escrow-admin', className = '' }: EscrowAdminSidebarProps) {
  const pathname = usePathname()

  const menuItems = [
    { label: "Escrow", icon: <Landmark className="w-5 h-5" />, path: basePath },
    { label: "Analytics", icon: <BarChart3 className="w-5 h-5" />, path: `${basePath}/analytics` },
  ]

  return (
    <aside className={`bg-white border border-gray-200 rounded-2xl shadow-md flex flex-col w-full h-[calc(100vh-160px)] ${className}`}>
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1 custom-scrollbar">
        {menuItems.map((item) => {
          // Active state logic:
          // For "Escrow" (dashboard), it's active if path is exactly basePath or starts with basePath/transaction
          // For "Analytics", it's active if path starts with basePath/analytics
          let active = false
          if (item.path === basePath) {
             // Check if it's the dashboard path OR a transaction detail path
             // We need to ensure we don't match /analytics as part of /escrow-admin
             active = pathname === basePath || (pathname.startsWith(`${basePath}/transaction`))
          } else {
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
