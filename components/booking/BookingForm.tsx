export default function BookingForm() {
  return (
    <form className="space-y-6">
      <div>
        <label htmlFor="eventType" className="block text-sm font-medium text-gray-700 mb-2">
          Event Type
        </label>
        <select
          id="eventType"
          name="eventType"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Select event type</option>
          <option value="wedding">Wedding</option>
          <option value="corporate">Corporate Event</option>
          <option value="birthday">Birthday Party</option>
          <option value="anniversary">Anniversary</option>
        </select>
      </div>
      
      <div>
        <label htmlFor="guests" className="block text-sm font-medium text-gray-700 mb-2">
          Number of Guests
        </label>
        <input
          type="number"
          id="guests"
          name="guests"
          placeholder="e.g., 100"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      
      <div>
        <label htmlFor="duration" className="block text-sm font-medium text-gray-700 mb-2">
          Event Duration
        </label>
        <select
          id="duration"
          name="duration"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Select duration</option>
          <option value="2-4">2-4 hours</option>
          <option value="4-6">4-6 hours</option>
          <option value="6-8">6-8 hours</option>
          <option value="full-day">Full day</option>
        </select>
      </div>
      
      <div>
        <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
          Event Location
        </label>
        <input
          type="text"
          id="location"
          name="location"
          placeholder="Enter venue address"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      
      <div>
        <label htmlFor="specialRequests" className="block text-sm font-medium text-gray-700 mb-2">
          Special Requests
        </label>
        <textarea
          id="specialRequests"
          name="specialRequests"
          rows={3}
          placeholder="Any special requirements or requests..."
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      
      <div className="bg-gray-50 p-4 rounded-lg">
        <h3 className="font-medium mb-2">Booking Summary</h3>
        <div className="space-y-1 text-sm">
          <div className="flex justify-between">
            <span>Service Fee:</span>
            <span>$500</span>
          </div>
          <div className="flex justify-between">
            <span>Platform Fee:</span>
            <span>$25</span>
          </div>
          <div className="flex justify-between font-medium border-t pt-2">
            <span>Total:</span>
            <span>$525</span>
          </div>
        </div>
      </div>
      
      <button
        type="submit"
        className="w-full bg-event-blue text-white py-3 px-4 rounded-lg hover:bg-event-blue-hover font-medium transition-colors"
      >
        Book Now
      </button>
    </form>
  )
}