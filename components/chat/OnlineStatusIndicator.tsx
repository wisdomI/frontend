interface OnlineStatusIndicatorProps {
  isOnline: boolean
}

export default function OnlineStatusIndicator({ isOnline }: OnlineStatusIndicatorProps) {
  return (
    <div className="flex items-center">
      <div className={`w-2 h-2 rounded-full mr-1 ${isOnline ? 'bg-green-500' : 'bg-gray-400'}`}></div>
      <span className="text-xs text-gray-500">
        {isOnline ? 'Online' : 'Offline'}
      </span>
    </div>
  )
}