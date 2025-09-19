'use client'

interface WelcomeBannerProps {
  businessName: string
  verified: boolean
}

const WelcomeBanner = ({ businessName, verified }: WelcomeBannerProps) => {
  return (
    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mt-3 sm:mt-4 gap-2">
      <h1 className="text-lg sm:text-xl font-bold">Welcome Back {businessName} 👋</h1>
      {!verified && (
        <span className="text-xs bg-yellow-200 text-yellow-800 px-3 py-1 rounded self-start sm:self-auto">
          Unverified
        </span>
      )}
    </div>
  )
}

export default WelcomeBanner
