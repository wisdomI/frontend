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
      <div className="ml-64 flex-1">
        <DashboardHeader />
        <main className='w-full flex-1'>{children}</main>
      </div>
    </div>
  )
}
