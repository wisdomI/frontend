interface BookingDetailsProps {
  params: {
    bookingId: string
  }
}

export default function BookingDetails({ params }: BookingDetailsProps) {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Booking Details</h1>
        <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Booking ID: {params.bookingId}</h2>
        <p className="text-gray-600">Booking details will be displayed here.</p>
      </div>
    </div>
  )
}