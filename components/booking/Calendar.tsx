export default function Calendar() {
  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
  const daysInMonth = Array.from({ length: 31 }, (_, i) => i + 1)
  
  return (
    <div className="bg-white rounded-lg border p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium">March 2024</h3>
        <div className="flex space-x-2">
          <button className="p-1 hover:bg-gray-100 rounded">
            ←
          </button>
          <button className="p-1 hover:bg-gray-100 rounded">
            →
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-7 gap-1 mb-2">
        {daysOfWeek.map(day => (
          <div key={day} className="text-center text-sm font-medium text-gray-500 py-2">
            {day}
          </div>
        ))}
      </div>
      
      <div className="grid grid-cols-7 gap-1">
        {daysInMonth.map(day => (
          <button
            key={day}
            className="aspect-square flex items-center justify-center text-sm hover:bg-event-blue-light rounded-md transition-colors"
          >
            {day}
          </button>
        ))}
      </div>
      
      <div className="mt-4 pt-4 border-t">
        <h4 className="font-medium mb-2">Available Time Slots</h4>
        <div className="grid grid-cols-2 gap-2">
          <button className="p-2 text-sm border rounded hover:bg-gray-50">
            9:00 AM
          </button>
          <button className="p-2 text-sm border rounded hover:bg-gray-50">
            11:00 AM
          </button>
          <button className="p-2 text-sm border rounded hover:bg-gray-50">
            2:00 PM
          </button>
          <button className="p-2 text-sm border rounded hover:bg-gray-50">
            4:00 PM
          </button>
        </div>
      </div>
    </div>
  )
}