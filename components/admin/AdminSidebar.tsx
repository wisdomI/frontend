'use client'

// 'use client'

// import Link from "next/link"
// import { usePathname } from "next/navigation"
// import {
//   LayoutDashboard,
//   Gavel,
//   CalendarCheck,
//   Calendar,
//   MessageSquare,
//   MessageCircle,
//   Users,
//   Wallet,
//   CalendarClock,
//   Star,
//   HelpCircle,
//   Settings,
// } from "lucide-react"

// interface AdminSidebarProps {
//   onClose?: () => void
// }

// export default function AdminSidebar({ onClose }: AdminSidebarProps) {
//   const pathname = usePathname()

//   const menuItems = [
//     { label: "Dashboard", icon: <LayoutDashboard className="w-5 h-5" />, path: "/admin" },
//     { label: "Manage Bids", icon: <Gavel className="w-5 h-5" />, path: "/admin/manage-bids" },
//     { label: "Manage Bookings", icon: <CalendarCheck className="w-5 h-5" />, path: "/admin/manage-bookings" },
//     { label: "Events", icon: <Calendar className="w-5 h-5" />, path: "/admin/events" },
//     { label: "Messages", icon: <MessageSquare className="w-5 h-5" />, path: "/admin/messages" },
//     { label: "Feedback", icon: <MessageCircle className="w-5 h-5" />, path: "/admin/feedback" },
//     { label: "Team Management", icon: <Users className="w-5 h-5" />, path: "/admin/team-management" },
//     { label: "Finance", icon: <Wallet className="w-5 h-5" />, path: "/admin/finance" },
//     { label: "Schedule Meetings", icon: <CalendarClock className="w-5 h-5" />, path: "/admin/schedule-meetings" },
//     { label: "Reviews & Ratings", icon: <Star className="w-5 h-5" />, path: "/admin/reviews-ratings" },
//     { label: "Help & Support", icon: <HelpCircle className="w-5 h-5" />, path: "/admin/help-support" },
//     { label: "General Settings", icon: <Settings className="w-5 h-5" />, path: "/admin/general-settings" },
//   ]

//   return (
//     <aside className="bg-white border border-gray-200 rounded-2xl shadow-md flex flex-col w-full h-[calc(100vh-160px)]">
//       <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1 custom-scrollbar">
//         {menuItems.map((item) => {
//           const active = pathname === item.path
//           return (
//             <Link
//               key={item.path}
//               href={item.path}
//               onClick={onClose}
//               className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
//                 active
//                   ? "bg-[#0B2E6F] text-white"
//                   : "text-gray-700 hover:bg-gray-100"
//               }`}
//             >
//               <span className={active ? "text-white" : "text-gray-500"}>{item.icon}</span>
//               <span>{item.label}</span>
//             </Link>
//           )
//         })}
//       </nav>
//     </aside>
//   )
// }

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

interface AdminSidebarProps {
  onClose?: () => void
}

export default function AdminSidebar({ onClose }: AdminSidebarProps) {
  const pathname = usePathname()

  const menuItems = [
    { label: "Dashboard", icon: <LayoutDashboard className="w-5 h-5" />, path: "/super-admin" },
    { label: "Verification", icon: <UserCheck className="w-5 h-5" />, path: "/super-admin/verification" },
    { label: "Escrow", icon: <Landmark className="w-5 h-5" />, path: "/super-admin/escrow" },
    { label: "Dispute", icon: <Scale className="w-5 h-5" />, path: "/super-admin/dispute" },
    { label: "Marketplace", icon: <Store className="w-5 h-5" />, path: "/super-admin/marketplace" },
    { label: "Analytics", icon: <BarChart3 className="w-5 h-5" />, path: "/super-admin/analytics" },
    { label: "Communication", icon: <MessageSquare className="w-5 h-5" />, path: "/super-admin/communication" },
    { label: "Settings", icon: <Settings className="w-5 h-5" />, path: "/super-admin/settings" },
  ]

  return (
    <aside className="bg-white border border-gray-200 rounded-2xl shadow-md flex flex-col w-full h-[calc(100vh-160px)]">
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1 custom-scrollbar">
        {menuItems.map((item) => {
          const active = pathname === item.path
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

