const Availability = () => {
  const days = [
    { date: '27', day: 'Mon' },
    { date: '28', day: 'Tue' },
    { date: '29', day: 'Wed', active: true },
    { date: '30', day: 'Thu' },
    { date: '31', day: 'Fri', active: true },
    { date: '01', day: 'Sat' },
  ]

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <h3 className="font-bold mb-4">My Availability</h3>
      <div className="flex gap-2 mb-4">
        {days.map(d => (
          <div
            key={d.date}
            className={`flex flex-col items-center px-3 py-2 rounded-lg ${
              d.active ? 'bg-event-blue text-white' : 'bg-gray-100'
            }`}
          >
            <span className="text-xs">{d.day}</span>
            <span className="font-bold">{d.date}</span>
          </div>
        ))}
      </div>
      <button className="bg-event-blue text-white w-full py-2 rounded-lg">
        + Set Availability
      </button>
    </div>
  )
}

export default Availability
