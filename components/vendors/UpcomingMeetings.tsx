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
    <div className="bg-white p-4 rounded-lg shadow">
      <h3 className="font-bold mb-4">Upcoming Meetings</h3>
      {meetings.map((m, i) => (
        <div key={i} className={`p-3 rounded mb-2 ${m.color}`}>
          <p className="text-sm">{m.time}</p>
          <p className="font-medium">{m.title}</p>
          <p className="text-xs">By: {m.host}</p>
        </div>
      ))}
    </div>
  )
}

export default UpcomingMeetings
