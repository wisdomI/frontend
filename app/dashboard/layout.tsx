export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen">
      <aside className="w-64 bg-gray-800 text-white p-6">
        <h2 className="text-xl font-bold mb-6">Dashboard</h2>
        <nav>
          <ul className="space-y-2">
            <li>
              <a href="/dashboard/client" className="block py-2 px-4 rounded hover:bg-gray-700">
                Client Dashboard
              </a>
            </li>
            <li>
              <a href="/dashboard/vendor" className="block py-2 px-4 rounded hover:bg-gray-700">
                Vendor Dashboard
              </a>
            </li>
          </ul>
        </nav>
      </aside>
      <main className="flex-1 p-8">
        {children}
      </main>
    </div>
  )
}