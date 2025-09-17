'use client'
import React, { useState } from 'react'
import { FiSearch, FiCalendar, FiMapPin, FiTag, FiUsers, FiClock } from 'react-icons/fi'
import ServiceRequestModal from '../../../components/ui/modals/ServiceRequestModal'

const MarketplacePage = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedDate, setSelectedDate] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All Categories')
  const [selectedBudget, setSelectedBudget] = useState('All Budget')
  const [selectedLocation, setSelectedLocation] = useState('All Locations')
  const [selectedEventType, setSelectedEventType] = useState('All Event Types')
  const [selectedServiceRequest, setSelectedServiceRequest] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const serviceRequests = [
    {
      id: 1,
      title: "Wedding Catering Service Needed",
      location: "Ajah, Lagos",
      date: "Feb 28, 2025",
      description: "We need premium catering for our dream wedding reception. Expecting 200 guests with traditional Nigerian and international dishes. Service should include setup, service staff, cleanup, and professional presentation. We're looking for a caterer who can handle both traditional Nigerian cuisine and international options to accommodate our diverse guest list.",
      tags: ["Traditional Cuisine", "200 Guests", "Full Service", "Setup Included"],
      budget: "₦80,000 - ₦120,000",
      guestCount: 200,
      requirements: [
        "Full buffet setup with chafing dishes and serving stations",
        "Professional serving staff (minimum 4 servers)",
        "Traditional Nigerian dishes: Jollof rice, pepper soup, grilled chicken, beef stew",
        "International options: Pasta station, salad bar, grilled fish",
        "Vegetarian and dietary restriction accommodations",
        "Elegant presentation and table setup",
        "Complete cleanup after event",
        "Must arrive 3 hours before event for setup",
        "Professional uniforms for all staff",
        "Quality assurance and food safety certifications"
      ],
      clientInfo: {
        name: "Sparrow123",
        rating: 4.5,
        eventsHosted: 12,
        totalSpent: "₦2.1M",
        paymentHistory: "Always pays on time",
        communication: "Responsive and clear",
        reviews: "Professional and organized",
        memberSince: "January 2023",
        avatar: "S"
      },
      samples: ["sample1", "sample2"]
    },
    {
      id: 2,
      title: "Birthday Party DJ and Sound System",
      location: "Ajah, Lagos", 
      date: "18th February, 2025",
      description: "Looking for DJ services for a 30th birthday celebration. Expecting 80-100 guests. Need a mix of Afrobeats, Hip-hop, and party classics. Quality sound system and microphone for speeches required. Outdoor event.",
      tags: ["Afrobeats", "100 Guests", "Outdoor", "Setup Included"],
      budget: "₦150,000 - ₦300,000",
      guestCount: 100,
      requirements: [
        "Professional DJ with Afrobeats, Hip-hop, and party classics playlist",
        "Quality sound system suitable for outdoor event",
        "Wireless microphone for speeches and announcements",
        "Setup and breakdown included",
        "Backup equipment available",
        "Professional lighting effects",
        "Music mixing and transitions",
        "Guest interaction and requests handling"
      ],
      clientInfo: {
        name: "PartyPlanner2025",
        rating: 4.8,
        eventsHosted: 8,
        totalSpent: "₦1.5M",
        paymentHistory: "Always pays on time",
        communication: "Very responsive",
        reviews: "Excellent service",
        memberSince: "March 2023",
        avatar: "P"
      },
      samples: ["sample1", "sample2"]
    },
    {
      id: 3,
      title: "Corporate Event Photography",
      location: "Ajah, Lagos",
      date: "18th February, 2025", 
      description: "Professional photography needed for 2-day annual company conference. Coverage includes keynote speeches, panel discussions, and networking sessions. Both candid and formal group photos required. Final images needed within 48 hours.",
      tags: ["Corporate", "2 Days", "Group Photos", "Fast Turnaround"],
      budget: "₦200,000 - ₦400,000",
      guestCount: 150,
      requirements: [
        "Professional photography for 2-day conference",
        "Coverage of keynote speeches and panel discussions",
        "Candid and formal group photos",
        "High-resolution images delivered within 48 hours",
        "Professional editing and color correction",
        "Multiple photographers for comprehensive coverage",
        "Backup equipment and memory cards",
        "Corporate event experience preferred"
      ],
      clientInfo: {
        name: "CorporateEventsNG",
        rating: 4.7,
        eventsHosted: 25,
        totalSpent: "₦4.2M",
        paymentHistory: "Always pays on time",
        communication: "Professional and clear",
        reviews: "High quality work",
        memberSince: "January 2022",
        avatar: "C"
      },
      samples: ["sample1", "sample2"]
    },
    {
      id: 4,
      title: "Corporate Event Photography",
      location: "Ajah, Lagos",
      date: "18th February, 2025",
      description: "Professional photography needed for corporate event. Coverage includes keynote speeches, panel discussions, and networking sessions.",
      tags: ["Corporate", "Professional", "Event Coverage", "High Quality"],
      budget: "₦180,000 - ₦350,000",
      guestCount: 120,
      requirements: [
        "Professional event photography",
        "Keynote speech coverage",
        "Panel discussion documentation",
        "Networking session photos",
        "High-quality image delivery",
        "Professional editing included",
        "Timely delivery of final images"
      ],
      clientInfo: {
        name: "BusinessEventsLagos",
        rating: 4.6,
        eventsHosted: 18,
        totalSpent: "₦3.1M",
        paymentHistory: "Always pays on time",
        communication: "Clear and professional",
        reviews: "Reliable service",
        memberSince: "June 2022",
        avatar: "B"
      },
      samples: ["sample1", "sample2"]
    }
  ]

  const handleOpenBid = (serviceRequest) =>  {
    setSelectedServiceRequest(serviceRequest)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setSelectedServiceRequest(null)
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Main Content */}
      <div className="flex-1 p-6 overflow-y-auto">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Marketplace</h1>
            <p className="text-gray-600">Discover and bid on service requests</p>
          </div>

          {/* Service Request Cards */}
          <div className="space-y-6">
            {serviceRequests.map((request) => (
              <div key={request.id} className="bg-white rounded-lg shadow-md border border-gray-200 p-6 hover:shadow-lg transition-shadow">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">{request.title}</h3>
                    <div className="flex items-center text-gray-600 mb-2">
                      <FiMapPin className="w-4 h-4 mr-2" />
                      <span className="mr-4">{request.location}</span>
                      <FiCalendar className="w-4 h-4 mr-2" />
                      <span>{request.date}</span>
                    </div>
                    <p className="text-gray-700 mb-4 leading-relaxed">{request.description}</p>
                    
                    {/* Tags */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {request.tags.map((tag, index) => (
                        <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  {/* Action Button */}
                  <div className="text-right ml-6">
                    <button 
                      onClick={() => handleOpenBid(request)}
                      className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
                    >
                      Open for Bids
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Filter Sidebar */}
      <div className="w-80 bg-white border-l border-gray-200 p-6 overflow-y-auto">
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Filter</h2>
          
          {/* Search */}
          <div className="mb-4">
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search services..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Event Date */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Event Date</label>
            <select
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Select Date</option>
              <option value="today">Today</option>
              <option value="tomorrow">Tomorrow</option>
              <option value="this-week">This Week</option>
              <option value="next-week">Next Week</option>
              <option value="this-month">This Month</option>
            </select>
          </div>

          {/* Categories */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Categories</label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="All Categories">All Categories</option>
              <option value="Catering">Catering</option>
              <option value="Photography">Photography</option>
              <option value="DJ Services">DJ Services</option>
              <option value="Decorations">Decorations</option>
              <option value="Venue">Venue</option>
            </select>
          </div>

          {/* Budget */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Budget</label>
            <select
              value={selectedBudget}
              onChange={(e) => setSelectedBudget(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="All Budget">All Budget</option>
              <option value="Under ₦100k">Under ₦100k</option>
              <option value="₦100k - ₦300k">₦100k - ₦300k</option>
              <option value="₦300k - ₦500k">₦300k - ₦500k</option>
              <option value="₦500k - ₦1M">₦500k - ₦1M</option>
              <option value="Above ₦1M">Above ₦1M</option>
            </select>
          </div>

          {/* Location */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
            <select
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="All Locations">All Locations</option>
              <option value="Lagos">Lagos</option>
              <option value="Abuja">Abuja</option>
              <option value="Port Harcourt">Port Harcourt</option>
              <option value="Kano">Kano</option>
              <option value="Ibadan">Ibadan</option>
            </select>
          </div>

          {/* Event Type */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Event Type</label>
            <select
              value={selectedEventType}
              onChange={(e) => setSelectedEventType(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="All Event Types">All Event Types</option>
              <option value="Wedding">Wedding</option>
              <option value="Birthday">Birthday</option>
              <option value="Corporate">Corporate</option>
              <option value="Conference">Conference</option>
              <option value="Party">Party</option>
            </select>
          </div>

          {/* Show Results Button */}
          <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-medium transition-colors">
            Show Result
          </button>
        </div>
      </div>

      {/* Service Request Modal */}
      {selectedServiceRequest && (
        <ServiceRequestModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          serviceRequest={selectedServiceRequest}
        />
      )}
    </div>
  )
}

export default MarketplacePage
