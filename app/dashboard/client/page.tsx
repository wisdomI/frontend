export default function ClientDashboard() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Client Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <div className="bg-blue-100 p-6 rounded-lg">
          <h3 className="text-lg font-semibold mb-2">Active Bookings</h3>
          <p className="text-3xl font-bold text-blue-600">3</p>
        </div>
        <div className="bg-green-100 p-6 rounded-lg">
          <h3 className="text-lg font-semibold mb-2">Completed Events</h3>
          <p className="text-3xl font-bold text-green-600">12</p>
        </div>
        <div className="bg-yellow-100 p-6 rounded-lg">
          <h3 className="text-lg font-semibold mb-2">Shortlisted Vendors</h3>
          <p className="text-3xl font-bold text-yellow-600">8</p>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Recent Bookings</h2>
        <div className="space-y-4">
          <div className="border-b pb-4">
            <h3 className="font-medium">Wedding Photography</h3>
            <p className="text-gray-600">John's Photography Studio</p>
            <p className="text-sm text-gray-500">Date: March 15, 2024</p>
          </div>
          <div className="border-b pb-4">
            <h3 className="font-medium">Catering Services</h3>
            <p className="text-gray-600">Delicious Catering Co.</p>
            <p className="text-sm text-gray-500">Date: April 2, 2024</p>
          </div>
        </div>
      </div>
    </div>
  )
}