// Mock data for services - this will be replaced with API calls later
export interface ServiceData {
  id: string;
  title: string;
  vendorName: string;
  image: string;
  images?: string[];
  rating: number;
  reviews: number;
  location: string;
  verified: boolean;
  badge?: string;
  description?: string;
  price?: number;
  category?: string;
}

export const mockRecentlyViewedServices: ServiceData[] = [
  {
    id: "1",
    title: "Professional Wedding Photography",
    vendorName: "Ope's Event Decor",
    image: "/images/image.png",
    images: ["/images/cc.jpg", "/images/cake56.jpg", "/images/entertain.jpg"],
    rating: 4.8,
    reviews: 45,
    location: "Victoria Island, Lagos",
    verified: true,
    badge: "Top Rated",
    description: "Capture your special moments with professional wedding photography",
    price: 150000,
    category: "Photography"
  },
  {
    id: "2",
    title: "Custom Wedding Cakes",
    vendorName: "UK Cakes & Cream",
    image: "/images/cake2.jpg",
    images: ["/images/cake.jpg", "/images/place3.jpg", "/images/cake6.jpg"],
    rating: 4.6,
    reviews: 32,
    location: "Ikeja, Lagos",
    verified: true,
    badge: "Most Booked",
    description: "Delicious custom wedding cakes for your special day",
    price: 75000,
    category: "Catering"
  },
  {
    id: "3",
    title: "Event Hall Decoration",
    vendorName: "Elegant Decor Solutions",
    image: "/images/place1.jpg",
    images: ["/images/place5.jpg", "/images/lady1.jpg", "/images/cake2.jpg"],
    rating: 4.7,
    reviews: 28,
    location: "Lekki, Lagos",
    verified: true,
    badge: "Best Valued",
    description: "Transform your venue with stunning decorations",
    price: 200000,
    category: "Decoration"
  },
  {
    id: "4",
    title: "DJ & Sound Services",
    vendorName: "SoundWave Entertainment",
    image: "/images/place1.jpg",
    images: ["/images/place.jpg", "/images/place1.jpg", "/images/cake2.jpg"],
    rating: 4.5,
    reviews: 38,
    location: "Surulere, Lagos",
    verified: true,
    badge: "Popular",
    description: "Professional DJ services for all events",
    price: 80000,
    category: "Entertainment"
  },
  {
    id: "5",
    title: "Bridal Makeup & Hair",
    vendorName: "Glam Beauty Studio",
    image: "/images/cake2.jpg",
    images: ["/images/cake2.jpg", "/images/image.png", "/images/place1.jpg"],
    rating: 4.9,
    reviews: 52,
    location: "Victoria Island, Lagos",
    verified: true,
    badge: "Top Rated",
    description: "Professional bridal makeup and hairstyling services",
    price: 45000,
    category: "Beauty"
  },
  {
    id: "6",
    title: "Event Planning Services",
    vendorName: "Perfect Events Co.",
    image: "/images/place1.jpg",
    images: ["/images/place1.jpg", "/images/cake2.jpg", "/images/image.png"],
    rating: 4.4,
    reviews: 25,
    location: "Ikoyi, Lagos",
    verified: true,
    badge: "Recommended",
    description: "Complete event planning and coordination services",
    price: 300000,
    category: "Planning"
  }
];

export const mockPopularServices: ServiceData[] = [
  {
    id: "p1",
    title: "Wedding Hall Decoration/Backdrops",
    vendorName: "Ope's Event Decor",
    image: "/images/cake2.jpg",
    images: ["/images/image.png", "/images/cake2.jpg", "/images/place1.jpg"],
    rating: 4.5,
    reviews: 20,
    location: "Victoria Island, Lagos",
    verified: true,
    badge: "Top Rated",
    description: "Professional wedding hall decoration and backdrop services",
    price: 180000,
    category: "Decoration"
  },
  {
    id: "p2",
    title: "Book us for all types of Event Cakes",
    vendorName: "UK Cakes & Cream",
    image: "/images/cake2.jpg",
    images: ["/images/cake2.jpg", "/images/place1.jpg", "/images/image.png"],
    rating: 4.5,
    reviews: 20,
    location: "Victoria Island, Lagos",
    verified: true,
    badge: "Most Booked",
    description: "Custom cakes for weddings, birthdays, and corporate events",
    price: 65000,
    category: "Catering"
  },
  {
    id: "p3",
    title: "Wedding Hall Decoration/Backdrops",
    vendorName: "Ope's Event Decor",
    image: "/images/place1.jpg",
    images: ["/images/place1.jpg", "/images/image.png", "/images/cake2.jpg"],
    rating: 4.5,
    reviews: 20,
    location: "Victoria Island, Lagos",
    verified: true,
    badge: "Most Booked",
    description: "Elegant decoration services for all types of events",
    price: 150000,
    category: "Decoration"
  },
  {
    id: "p4",
    title: "Wedding Hall Decoration/Backdrops",
    vendorName: "Ope's Event Decor",
    image: "/images/lady2.jpg",
    images: ["/images/Lady7.png", "/images/place5.jpg", "/images/lady3.jpg"],
    rating: 4.5,
    reviews: 20,
    location: "Victoria Island, Lagos",
    verified: true,
    badge: "Most Booked",
    description: "Transform your venue with beautiful decorations",
    price: 175000,
    category: "Decoration"
  }
];

// Helper function to format price
export const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    minimumFractionDigits: 0,
  }).format(price);
};

// Helper function to get badge color
export const getBadgeColor = (badge: string): string => {
  switch (badge.toLowerCase()) {
    case 'top rated':
      return 'bg-green-600';
    case 'most booked':
      return 'bg-blue-900';
    case 'best valued':
      return 'bg-purple-600';
    case 'popular':
      return 'bg-orange-600';
    case 'recommended':
      return 'bg-indigo-600';
    default:
      return 'bg-gray-600';
  }
};