export default function ServicesPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">All Services</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Service cards will be added here */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-2">Bridal Make Up Artists</h3>
          <p className="text-gray-600 mb-4">Professional bridal makeup services</p>
          <button className="w-full bg-event-blue text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors">
            View Details
          </button>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-2">Wedding Hall Decoration</h3>
          <p className="text-gray-600 mb-4">Beautiful wedding decorations and backdrops</p>
          <button className="w-full bg-event-blue text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors">
            View Details
          </button>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-2">Event Cakes</h3>
          <p className="text-gray-600 mb-4">Custom cakes for all types of events</p>
          <button className="w-full bg-event-blue text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors">
            View Details
          </button>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-2">Professional Photography</h3>
          <p className="text-gray-600 mb-4">Wedding and event photography services</p>
          <button className="w-full bg-event-blue text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors">
            View Details
          </button>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-2">Event Catering</h3>
          <p className="text-gray-600 mb-4">Premium catering services for your events</p>
          <button className="w-full bg-event-blue text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors">
            View Details
          </button>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-2">Sound & Lighting</h3>
          <p className="text-gray-600 mb-4">Professional sound and lighting equipment</p>
          <button className="w-full bg-event-blue text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors">
            View Details
          </button>
        </div>
      </div>
    </div>
  )
}