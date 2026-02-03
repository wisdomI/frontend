import Image from 'next/image'

export default function PortfolioGallery() {
  const portfolioImages = [
    'portfolio1.jpg',
    'portfolio2.jpg',
    'portfolio3.jpg',
    'portfolio4.jpg',
    'portfolio5.jpg',
    'portfolio6.jpg'
  ]

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-6">Portfolio</h2>
      
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {portfolioImages.map((image, index) => (
          <div key={index} className="aspect-square bg-gray-200 rounded-lg overflow-hidden relative">
            <Image
              src={`/images/${image}`}
              alt={`Portfolio ${index + 1}`}
              fill
              className="object-cover hover:scale-105 transition-transform cursor-pointer"
              onError={(e: any) => {
                e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZGRkIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxMiIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkltYWdlPC90ZXh0Pjwvc3ZnPg=='
              }}
            />
          </div>
        ))}
      </div>
      
      <div className="mt-6 text-center">
        <button className="text-event-blue hover:opacity-80 font-medium transition-all">
          View All Photos
        </button>
      </div>
    </div>
  )
}