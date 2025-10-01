export default function AdminDashboard() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-blue-100 p-6 rounded-lg">
          <h3 className="text-lg font-semibold mb-2">Total Users</h3>
          <p className="text-3xl font-bold text-blue-600">1,234</p>
        </div>
        <div className="bg-green-100 p-6 rounded-lg">
          <h3 className="text-lg font-semibold mb-2">Active Vendors</h3>
          <p className="text-3xl font-bold text-green-600">456</p>
        </div>
        <div className="bg-yellow-100 p-6 rounded-lg">
          <h3 className="text-lg font-semibold mb-2">Total Bookings</h3>
          <p className="text-3xl font-bold text-yellow-600">789</p>
        </div>
        <div className="bg-purple-100 p-6 rounded-lg">
          <h3 className="text-lg font-semibold mb-2">Revenue</h3>
          <p className="text-3xl font-bold text-purple-600">$12,345</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Recent Users</h2>
          <div className="space-y-4">
            <div className="border-b pb-4">
              <h3 className="font-medium">John Doe</h3>
              <p className="text-gray-600">Client</p>
              <p className="text-sm text-gray-500">Joined: March 15, 2024</p>
            </div>
            <div className="border-b pb-4">
              <h3 className="font-medium">Jane Smith</h3>
              <p className="text-gray-600">Vendor</p>
              <p className="text-sm text-gray-500">Joined: March 14, 2024</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">System Status</h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span>Server Status</span>
              <span className="text-green-600 font-semibold">Online</span>
            </div>
            <div className="flex justify-between items-center">
              <span>Database</span>
              <span className="text-green-600 font-semibold">Connected</span>
            </div>
            <div className="flex justify-between items-center">
              <span>API Status</span>
              <span className="text-green-600 font-semibold">Healthy</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
