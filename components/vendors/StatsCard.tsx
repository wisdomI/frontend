'use client'

interface StatsCardProps {
  label: string
  value: number
  change: number
}

const StatsCard = ({ label, value, change }: StatsCardProps) => {
  const isPositive = change >= 0
  return (
    <div className="bg-white p-3 sm:p-4 rounded-lg shadow text-center">
      <h3 className="text-xs sm:text-sm font-medium">{label}</h3>
      <p className="text-xl sm:text-2xl font-bold mt-1 sm:mt-2">{value}</p>
      <p
        className={`text-xs mt-1 ${isPositive ? 'text-green-600' : 'text-red-600'}`}
      >
        {isPositive ? '▲' : '▼'} {Math.abs(change)}%
      </p>
    </div>
  )
}

export default StatsCard
