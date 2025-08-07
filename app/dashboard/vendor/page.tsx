export default function VendorDashboard() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Vendor Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-blue-100 p-6 rounded-lg">
          <h3 className="text-lg font-semibold mb-2">Total Bookings</h3>
          <p className="text-3xl font-bold text-blue-600">24</p>
        </div>
        <div className="bg-green-100 p-6 rounded-lg">
          <h3 className="text-lg font-semibold mb-2">Revenue</h3>
          <p className="text-3xl font-bold text-green-600">$12,450</p>
        </div>
        <div className="bg-yellow-100 p-6 rounded-lg">
          <h3 className="text-lg font-semibold mb-2">Profile Views</h3>
          <p className="text-3xl font-bold text-yellow-600">156</p>
        </div>
        <div className="bg-purple-100 p-6 rounded-lg">
          <h3 className="text-lg font-semibold mb-2">Rating</h3>
          <p className="text-3xl font-bold text-purple-600">4.8</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Recent Inquiries</h2>
          <div className="space-y-4">
            <div className="border-b pb-4">
              <h3 className="font-medium">Wedding Event</h3>
              <p className="text-gray-600">Sarah Johnson</p>
              <p className="text-sm text-gray-500">2 hours ago</p>
            </div>
            <div className="border-b pb-4">
              <h3 className="font-medium">Corporate Event</h3>
              <p className="text-gray-600">Tech Corp Inc.</p>
              <p className="text-sm text-gray-500">1 day ago</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Portfolio Management</h2>
          <button className="w-full bg-event-blue text-white py-2 px-4 rounded-lg hover:bg-event-blue-hover transition-colors mb-4">
            Upload New Photos
          </button>
          <button className="w-full bg-gray-600 text-white py-2 px-4 rounded-lg hover:opacity-80 transition-all">
            Edit Profile
          </button>
        </div>
      </div>
    </div>
  )
}