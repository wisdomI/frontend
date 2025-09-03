interface Notification {
  title: string
  time: string
}

const NotificationsPanel = () => {
  const notifications: Notification[] = [
    { title: 'Payment Alert', time: '03/17/2025, 08:34 pm' },
  ]

  return (
    <div className="bg-white p-4 rounded-lg shadow h-fit">
      <h3 className="font-bold mb-4">Notifications</h3>
      {notifications.map((n, i) => (
        <div key={i} className="border-b pb-2 mb-2">
          <p className="font-medium">{n.title}</p>
          <p className="text-xs text-gray-500">{n.time}</p>
        </div>
      ))}
    </div>
  )
}

export default NotificationsPanel
