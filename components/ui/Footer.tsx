export default function Footer() {
  return (
    <footer className="bg-event-blue text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">Event Hub</h3>
            <p className="text-blue-100">
              Connecting clients with the best event vendors for unforgettable experiences.
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">For Clients</h4>
            <ul className="space-y-2 text-blue-100">
              <li><a href="/customers" className="hover:text-white transition-colors">Find Service Providers</a></li>
              <li><a href="/services" className="hover:text-white transition-colors">Post Service Request</a></li>
              <li><a href="/dashboard/client" className="hover:text-white transition-colors">My Dashboard</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">For Service Providers</h4>
            <ul className="space-y-2 text-blue-100">
              <li><a href="/dashboard/vendor" className="hover:text-white transition-colors">Provider Dashboard</a></li>
              <li><a href="/auth/register" className="hover:text-white transition-colors">Join as Provider</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Support</h4>
            <ul className="space-y-2 text-blue-100">
              <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Contact Us</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-blue-200/20 mt-8 pt-8 text-center text-blue-100">
          <p>&copy; 2024 Event Hub. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}