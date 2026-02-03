"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Landmark,
  BarChart3,
} from "lucide-react"

interface EscrowAdminNavbarProps {
  basePath?: string
  className?: string
}

export default function EscrowAdminNavbar({ basePath = '/escrow-admin', className = '' }: EscrowAdminNavbarProps) {
  const pathname = usePathname()

  const menuItems = [
    { label: "Escrow", icon: <Landmark className="w-4 h-4" />, path: basePath },
    { label: "Analytics", icon: <BarChart3 className="w-4 h-4" />, path: `${basePath}/analytics` },
  ]

  return (
    <div className={`bg-white border-b border-gray-200 ${className}`}>
      <nav className="flex space-x-8 px-1" aria-label="Tabs">
        {menuItems.map((item) => {
          // Active state logic
          let active = false
          if (item.path === basePath) {
             active = pathname === basePath || (pathname.startsWith(`${basePath}/transaction`))
          } else {
             active = pathname.startsWith(item.path)
          }

          return (
            <Link
              key={item.path}
              href={item.path}
              className={`
                flex items-center gap-2 py-3 border-b-2 text-sm font-medium transition-colors
                ${active
                  ? "border-[#0B2E6F] text-[#0B2E6F]"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }
              `}
            >
              {item.icon}
              {item.label}
            </Link>
          )
        })}
      </nav>
    </div>
  )
}

