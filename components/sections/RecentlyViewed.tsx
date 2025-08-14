// components/sections/RecentlyViewed.tsx
import ServiceCard from '../ui/ServiceCard'
import { services } from '@/data/services'

const RecentlyViewed = () => {
  const recentServices = services.slice(0, 3)

  return (
    <section className="mb-4">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-lg font-semibold">Recently Viewed</h3>
        <button className="text-sm text-blue-600 hover:underline">See more</button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {recentServices.map((service) => (
          <ServiceCard key={service.id} {...service} />
        ))}
      </div>
    </section>
  )
}

export default RecentlyViewed
