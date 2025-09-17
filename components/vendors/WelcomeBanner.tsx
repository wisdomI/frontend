'use client'

interface WelcomeBannerProps {
  businessName: string
  verified: boolean
}

const WelcomeBanner = ({ businessName, verified }: WelcomeBannerProps) => {
  return (
    <div className="flex justify-between items-center mt-4">
      <h1 className="text-xl font-bold">Welcome Back {businessName} 👋</h1>
      {!verified && (
        <span className="text-xs bg-yellow-200 text-yellow-800 px-3 py-1 rounded">
          Unverified
        </span>
      )}
    </div>
  )
}

export default WelcomeBanner
