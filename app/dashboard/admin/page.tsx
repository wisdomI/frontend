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
          <p className="text-3xl font-bold text-green-600">89</p>
        </div>
        <div className="bg-yellow-100 p-6 rounded-lg">
          <h3 className="text-lg font-semibold mb-2">Pending Disputes</h3>
          <p className="text-3xl font-bold text-yellow-600">3</p>
        </div>
        <div className="bg-red-100 p-6 rounded-lg">
          <h3 className="text-lg font-semibold mb-2">Revenue</h3>
          <p className="text-3xl font-bold text-red-600">$45,678</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
          <div className="space-y-4">
            <div className="border-b pb-4">
              <p className="font-medium">New vendor registration</p>
              <p className="text-sm text-gray-500">5 minutes ago</p>
            </div>
            <div className="border-b pb-4">
              <p className="font-medium">Dispute resolved</p>
              <p className="text-sm text-gray-500">1 hour ago</p>
            </div>
            <div className="border-b pb-4">
              <p className="font-medium">Payment processed</p>
              <p className="text-sm text-gray-500">2 hours ago</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
          <div className="space-y-3">
            <button className="w-full bg-event-blue text-white py-2 px-4 rounded-lg hover:bg-event-blue-hover transition-colors">
              Manage Users
            </button>
            <button className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:opacity-80 transition-all">
              Review Vendors
            </button>
            <button className="w-full bg-yellow-600 text-white py-2 px-4 rounded-lg hover:opacity-80 transition-all">
              Handle Disputes
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}