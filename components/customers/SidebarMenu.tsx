"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  User,
  FileText,
  Calendar,
  CreditCard,
  Wallet,
  Star,
  HelpCircle,
  Settings,
  MessageSquare,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

const sidebarItems = [
  { label: "Profile Settings", href: "/dashboard/profile", icon: User },
  { label: "Manage all Posts", href: "/dashboard/service-requests", icon: FileText },
  { label: "Manage Bookings", href: "/dashboard/bookings", icon: Calendar },
  { label: "Messages", href: "/dashboard/messages", icon: MessageSquare, badge: 2 },
  { label: "Schedule Meetings", href: "/dashboard/meetings", icon: Calendar },
  { label: "Payment & Billings", href: "/dashboard/billings", icon: CreditCard },
  { label: "My Earnings", href: "/dashboard/earnings", icon: Wallet, badge: 9 },
  { label: "Reviews & Ratings", href: "/dashboard/reviews", icon: Star, badge: 3 },
  { label: "Help & Support", href: "/dashboard/support", icon: HelpCircle },
  { label: "General Settings", href: "/dashboard/settings", icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 h-full font-sans bg-[#fff] p-4 rounded-xl shadow-md border border-gray-200 pt-2 mt-2">
      <nav className="space-y-1">
        {sidebarItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center justify-between rounded-lg px-4 py-3 text-sm font-medium transition-colors",
                isActive
                  ? "bg-event-blue text-white"
                  : "text-gray-900 hover:bg-event-blue hover:text-white"
              )}
            >
              <div className="flex items-center space-x-3">
                <Icon className="h-5 w-5" />
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <Badge
                  variant="destructive"
                  className="ml-auto rounded-full h-6 w-6 flex items-center justify-center"
                >
                  {item.badge}
                </Badge>
              )}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}