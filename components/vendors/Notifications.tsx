'use client'

interface Notification {
  title: string
  time: string
}

const NotificationsPanel = () => {
  const notifications: Notification[] = [
    { title: 'Payment Alert', time: '03/17/2025, 08:34 pm' },
  ]

  return (
    <div className="bg-white p-3 sm:p-4 rounded-lg shadow">
      <h3 className="font-bold mb-3 sm:mb-4 text-sm sm:text-base">Notifications</h3>
      <div className="space-y-2 sm:space-y-2">
        {notifications.map((n, i) => (
          <div key={i} className="border-b pb-2 mb-2 last:border-b-0 last:mb-0">
            <p className="font-medium text-sm sm:text-base">{n.title}</p>
            <p className="text-xs text-gray-500">{n.time}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default NotificationsPanel
