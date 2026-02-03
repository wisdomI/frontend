'use client'

interface Meeting {
  time: string
  title: string
  host: string
  color: string
}

const UpcomingMeetings = () => {
  const meetings: Meeting[] = [
    {
      time: '9:00 am - 11:00 am',
      title: 'First alignment Call',
      host: 'Kelvin Martins',
      color: 'bg-blue-100 text-blue-800',
    },
    {
      time: '1:00 pm - 3:00 pm',
      title: 'Event Discussion',
      host: 'Kelvin Martins',
      color: 'bg-yellow-100 text-yellow-800',
    },
  ]

  return (
    <div className="bg-white p-3 sm:p-4 rounded-lg shadow">
      <h3 className="font-bold mb-3 sm:mb-4 text-sm sm:text-base">Upcoming Meetings</h3>
      <div className="space-y-2 sm:space-y-2">
        {meetings.map((m, i) => (
          <div key={i} className={`p-2 sm:p-3 rounded mb-2 ${m.color}`}>
            <p className="text-xs sm:text-sm">{m.time}</p>
            <p className="font-medium text-sm sm:text-base">{m.title}</p>
            <p className="text-xs">By: {m.host}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default UpcomingMeetings
