import DashboardHeader from '@/components/vendors/DashboardHeader'
import Sidebar from '@/components/vendors/VendorSidebar'
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="ml-72 flex-1 bg-[#F8F8F8]">
        <DashboardHeader />
        <main className="w-full flex-1">{children}</main>
      </div>
    </div>
  )
}
