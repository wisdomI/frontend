"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BsBootstrap, BsCalendar2Week, BsBookmarkStarFill } from "react-icons/bs";
import { MdSupportAgent } from "react-icons/md";
import { FileText, CreditCard } from "lucide-react";
import { RiUserFill, RiWechat2Line, RiSettings3Fill } from "react-icons/ri";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

const sidebarItems = [
  { label: "Profile Settings", href: "/dashboard/profile", icon: RiUserFill },
  { label: "Manage all Posts", href: "/dashboard/service-requests", icon: FileText },
  { label: "Manage Bookings", href: "/dashboard/bookings", icon: BsBootstrap },
  { label: "Messages", href: "/dashboard/messages", icon: RiWechat2Line, badge: 3 },
  { label: "Schedule Meetings", href: "/dashboard/meetings", icon: BsCalendar2Week },
  { label: "Payment & Billings", href: "/dashboard/billings", icon: CreditCard, badge: 3 },
  { label: "Reviews & Ratings", href: "/dashboard/reviews", icon: BsBookmarkStarFill, badge: 3 },
  { label: "Help & Support", href: "/dashboard/support", icon: MdSupportAgent },
  { label: "General Settings", href: "/dashboard/settings", icon: RiSettings3Fill },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 h-full font-sans bg-[#fff] p-4 rounded-xl shadow-md border border-gray-200 pt-2 mt-2">
      <nav className="space-y-4">
        {sidebarItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center rounded-lg px-4 py-3 text-sm font-medium transition-colors",
                isActive
                  ? "bg-event-blue text-white"
                  : "text-gray-900 hover:bg-event-blue hover:text-white"
              )}
            >
              <div className="flex items-center space-x-3 w-full">
                <div className="relative">
                  <Icon className="h-5 w-5" />
                  {item.badge && (
                    <Badge
                      variant="destructive"
                      className="absolute -top-2 -right-2 h-4 w-4 rounded-full flex items-center justify-center text-xs p-0 min-w-0"
                    >
                      {item.badge}
                    </Badge>
                  )}
                </div>
                <span>{item.label}</span>
              </div>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}