import BookingForm from '@/components/booking/BookingForm'
import Calendar from '@/components/booking/Calendar'

export default function BookingPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Book a Service</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <h2 className="text-2xl font-semibold mb-6">Select Date & Time</h2>
          <Calendar />
        </div>
        
        <div>
          <h2 className="text-2xl font-semibold mb-6">Booking Details</h2>
          <BookingForm />
        </div>
      </div>
    </div>
  )
}