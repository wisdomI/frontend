export default function ServicesPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Post a Service Request</h1>
      
      <div className="max-w-2xl mx-auto">
        <form className="space-y-6">
          <div>
            <label htmlFor="eventType" className="block text-sm font-medium text-gray-700">
              Event Type
            </label>
            <select
              id="eventType"
              name="eventType"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Select event type</option>
              <option value="wedding">Wedding</option>
              <option value="corporate">Corporate Event</option>
              <option value="birthday">Birthday Party</option>
              <option value="anniversary">Anniversary</option>
              <option value="other">Other</option>
            </select>
          </div>
          
          <div>
            <label htmlFor="serviceType" className="block text-sm font-medium text-gray-700">
              Service Needed
            </label>
            <select
              id="serviceType"
              name="serviceType"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Select service</option>
              <option value="photography">Photography</option>
              <option value="catering">Catering</option>
              <option value="decoration">Decoration</option>
              <option value="music">Music/DJ</option>
              <option value="venue">Venue</option>
              <option value="other">Other</option>
            </select>
          </div>
          
          <div>
            <label htmlFor="eventDate" className="block text-sm font-medium text-gray-700">
              Event Date
            </label>
            <input
              type="date"
              id="eventDate"
              name="eventDate"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          <div>
            <label htmlFor="budget" className="block text-sm font-medium text-gray-700">
              Budget Range
            </label>
            <select
              id="budget"
              name="budget"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Select budget range</option>
              <option value="under-500">Under $500</option>
              <option value="500-1000">$500 - $1,000</option>
              <option value="1000-2500">$1,000 - $2,500</option>
              <option value="2500-5000">$2,500 - $5,000</option>
              <option value="over-5000">Over $5,000</option>
            </select>
          </div>
          
          <div>
            <label htmlFor="guests" className="block text-sm font-medium text-gray-700">
              Number of Guests
            </label>
            <input
              type="number"
              id="guests"
              name="guests"
              placeholder="e.g., 50"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          <div>
            <label htmlFor="location" className="block text-sm font-medium text-gray-700">
              Event Location
            </label>
            <input
              type="text"
              id="location"
              name="location"
              placeholder="City, State"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              rows={4}
              placeholder="Describe your event and specific requirements..."
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          <div>
            <button
              type="submit"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-event-blue hover:bg-event-blue-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-event-blue transition-colors"
            >
              Post Service Request
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}