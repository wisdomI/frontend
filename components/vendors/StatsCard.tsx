interface StatsCardProps {
  label: string
  value: number
  change: number
}

const StatsCard = ({ label, value, change }: StatsCardProps) => {
  const isPositive = change >= 0
  return (
    <div className="bg-white p-4 rounded-lg shadow text-center flex items-center gap-2">
      <p
        className={`text-xs mt-1 ${isPositive ? 'text-green-600' : 'text-red-600'}`}
      >
        {isPositive ? '▲' : '▼'} {Math.abs(change)}%
      </p>
      <div>
        <h3 className="text-sm font-medium">{label}</h3>
        <p className="text-2xl font-bold mt-2">{value}</p>
      </div>
    </div>
  )
}

export default StatsCard
