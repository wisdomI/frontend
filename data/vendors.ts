export interface Vendor {
  id: string
  slug: string
  verified: boolean
  title: string
  vendorName: string
  rating: number
  reviews: number
  location: string
  category: string
  description: string
  website: string
  locationDetails: string
  availability: string
  totalRequests: number
  profileImage: string
  mainImage: string
  portfolioImages: string[]
  socialMedia: {
    instagram: string
    facebook: string
    twitter: string
  }
  services: Array<{
    id: number
    title: string
    image: string
    description: string
  }>
}

export const vendorsData: Vendor[] = [
  {
    id: 'ruthie-bridal-makeovers',
    slug: 'ruthie-bridal-makeovers',
    verified: true,
    title: 'Bridal Make Up Artists',
    vendorName: 'Ruthie Bridal Makeovers',
    rating: 3,
    reviews: 20,
    location: 'Abuja, Nigeria',
    category: 'Bridal Make Up Artists',
    description: 'Do you need a Black Bridal Makeup Artist who understands your skin? As a professional Wedding Makeup Artist, we create beautifully tailored bridal makeup looks for all skin tones.',
    website: 'www.eventhub.com/ruthiebridalmakeovers',
    locationDetails: '- Northern Nig only',
    availability: 'Busy until Feb 15, 2025',
    totalRequests: 120,
    profileImage: '/images/client-img.png',
    mainImage: '/images/client-img.png',
    portfolioImages: [
      '/images/client-img.png',
      '/images/client-img2.png', 
      '/images/client-img.png'
    ],
    socialMedia: {
      instagram: '#',
      facebook: '#',
      twitter: '#'
    },
    services: [
      {
        id: 1,
        title: 'Wedding Hairstyles',
        image: '/images/client-img.png',
        description: 'Experience the epitome of elegance with our signature soft glam makeup service, where flawless skin is our specialty, leaving you looking and feeling confidently radiant.'
      },
      {
        id: 2,
        title: 'Gele Styling',
        image: '/images/client-img2.png',
        description: 'Experience the epitome of elegance with our signature soft glam makeup service, where flawless skin is our specialty, leaving you looking and feeling confidently radiant.'
      },
      {
        id: 3,
        title: 'Natural Hair Styling',
        image: '/images/client-img.png',
        description: 'Experience the epitome of elegance with our signature soft glam makeup service, where flawless skin is our specialty, leaving you looking and feeling confidently radiant.'
      },
      {
        id: 4,
        title: 'Reception Makeovers',
        image: '/images/client-img2.png',
        description: 'Experience the epitome of elegance with our signature soft glam makeup service, where flawless skin is our specialty, leaving you looking and feeling confidently radiant.'
      }
    ]
  },
  {
    id: 'opes-event-decor',
    slug: 'opes-event-decor',
    verified: true,
    title: 'Wedding Hall Decoration / Backdrops',
    vendorName: "Ope's Event Decor",
    rating: 3,
    reviews: 20,
    location: 'Victoria Island, Lagos',
    category: 'Event Decoration',
    description: 'Transform your special day with our exquisite wedding decorations and backdrops. We specialize in creating magical atmospheres that make your event unforgettable.',
    website: 'www.eventhub.com/opeseventdecor',
    locationDetails: '- Lagos State only',
    availability: 'Available for bookings',
    totalRequests: 85,
    profileImage: '/images/client-img.png',
    mainImage: '/images/client-img.png',
    portfolioImages: [
      '/images/client-img.png',
      '/images/client-img2.png', 
      '/images/client-img.png'
    ],
    socialMedia: {
      instagram: '#',
      facebook: '#',
      twitter: '#'
    },
    services: [
      {
        id: 1,
        title: 'Wedding Backdrops',
        image: '/images/client-img.png',
        description: 'Beautiful custom backdrops for your wedding ceremony and reception photos.'
      },
      {
        id: 2,
        title: 'Hall Decoration',
        image: '/images/client-img2.png',
        description: 'Complete hall transformation with elegant decorations and floral arrangements.'
      },
      {
        id: 3,
        title: 'Table Settings',
        image: '/images/client-img.png',
        description: 'Stylish table arrangements and centerpieces for your guests.'
      },
      {
        id: 4,
        title: 'Lighting Design',
        image: '/images/client-img2.png',
        description: 'Professional lighting to create the perfect ambiance for your event.'
      }
    ]
  },
  {
    id: 'uk-cakes-cream',
    slug: 'uk-cakes-cream',
    verified: true,
    title: 'Book us for all types of Event Cakes',
    vendorName: 'UK Cakes & Cream',
    rating: 4,
    reviews: 20,
    location: 'Victoria Island, Lagos',
    category: 'Catering & Cakes',
    description: 'Indulge in our premium cakes and desserts crafted with love and precision. From wedding cakes to birthday celebrations, we create sweet memories for every occasion.',
    website: 'www.eventhub.com/ukcakescream',
    locationDetails: '- Lagos State only',
    availability: 'Available for bookings',
    totalRequests: 95,
    profileImage: '/images/client-img.png',
    mainImage: '/images/client-img.png',
    portfolioImages: [
      '/images/client-img.png',
      '/images/client-img2.png', 
      '/images/client-img.png'
    ],
    socialMedia: {
      instagram: '#',
      facebook: '#',
      twitter: '#'
    },
    services: [
      {
        id: 1,
        title: 'Wedding Cakes',
        image: '/images/client-img.png',
        description: 'Elegant multi-tier wedding cakes designed to perfection for your special day.'
      },
      {
        id: 2,
        title: 'Birthday Cakes',
        image: '/images/client-img2.png',
        description: 'Custom birthday cakes with unique designs and flavors for all ages.'
      },
      {
        id: 3,
        title: 'Cupcakes & Desserts',
        image: '/images/client-img.png',
        description: 'Delicious cupcakes and dessert platters for any celebration.'
      },
      {
        id: 4,
        title: 'Corporate Events',
        image: '/images/client-img2.png',
        description: 'Professional catering services for corporate events and meetings.'
      }
    ]
  }
]

export const getVendorBySlug = (slug: string): Vendor | undefined => {
  return vendorsData.find(vendor => vendor.slug === slug)
}

export const getVendorById = (id: string): Vendor | undefined => {
  return vendorsData.find(vendor => vendor.id === id)
}
