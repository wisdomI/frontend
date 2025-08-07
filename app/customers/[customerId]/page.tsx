import PortfolioGallery from '@/components/customer/PortfolioGallery'

interface CustomerProfileProps {
  params: {
    customerId: string
  }
}

export default function CustomerProfile({ params }: CustomerProfileProps) {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <h1 className="text-3xl font-bold mb-4">Service Provider Name</h1>
          <p className="text-gray-600 mb-6">Professional event planning services</p>
          
          <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">About</h2>
            <p className="text-gray-700">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. 
              Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
            </p>
          </div>
          
          <PortfolioGallery />
        </div>
        
        <div className="lg:col-span-1">
          <div className="bg-gray-50 p-6 rounded-lg">
            <h3 className="text-xl font-semibold mb-4">Contact Info</h3>
            <p className="mb-2">📧 provider@example.com</p>
            <p className="mb-4">📞 (555) 123-4567</p>
            
            <button className="w-full bg-event-blue text-white py-2 px-4 rounded-lg hover:bg-event-blue-hover transition-colors">
              Book Now
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}