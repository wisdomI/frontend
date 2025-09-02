export interface Offer {
  id: string;
  vendorName: string;
  vendorImage: string;
  description: string;
  location: string;
  rating: number;
  reviewCount: number;
  price: string;
  totalBookings: number;
  isVerified: boolean;
}

export const mockOffers: Offer[] = [
  {
    id: '1',
    vendorName: 'UK Cakes & Cream',
    vendorImage: '/images/cake2.jpg',
    description: 'Offering diverse options including buffet-style, plated meals, food stations, live cooking stations, themed & custom menus, such as vegetarian, vegan, gluten-free, & allergy-friendly choices.',
    location: 'Victoria Island, Lagos',
    rating: 4.5,
    reviewCount: 60,
    price: '₦200,000',
    totalBookings: 125,
    isVerified: true,
  },
  {
    id: '2',
    vendorName: 'UK Cakes & Cream',
    vendorImage: '/images/place1.jpg',
    description: 'Offering diverse options including buffet-style, plated meals, food stations, live cooking stations, themed & custom menus, such as vegetarian, vegan, gluten-free, & allergy-friendly choices.',
    location: 'Victoria Island, Lagos',
    rating: 4.5,
    reviewCount: 60,
    price: '₦200,000',
    totalBookings: 125,
    isVerified: true,
  },
  {
    id: '3',
    vendorName: 'UK Cakes & Cream',
    vendorImage: '/images/image.png',
    description: 'Offering diverse options including buffet-style, plated meals, food stations, live cooking stations, themed & custom menus, such as vegetarian, vegan, gluten-free, & allergy-friendly choices.',
    location: 'Victoria Island, Lagos',
    rating: 4.5,
    reviewCount: 60,
    price: '₦200,000',
    totalBookings: 125,
    isVerified: true,
  },
];