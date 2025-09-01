export interface BookingData {
  id: string;
  vendorName: string;
  vendorImage: string;
  vendorLogo: string;
  eventTitle: string;
  eventType: string;
  eventDate: string;
  eventLocation: string;
  numberOfGuests: number;
  servicesNeeded: string[];
  budget: string;
  additionalInfo: string;
  status: 'Pending' | 'In Progress' | 'Completed' | 'Cancelled' | 'Awaiting Payment';
  totalVisit: number;
  acceptedHours: string;
  image: string;
  verified: boolean;
  review?: {
    rating: number;
    comment: string;
    images: string[];
    clientsWaiting: number;
  };
  progressUpdate?: {
    hasUpdate: boolean;
    message: string;
  };
}

export const mockBookings: BookingData[] = [
  {
    id: '1',
    vendorName: 'UK Cakes & Cream',
    vendorImage: '/images/lady1.jpg',
    vendorLogo: '/images/cc.jpg',
    eventTitle: "Baby Linda's Birthday Party",
    eventType: 'Social Event (Wedding, Birthday)',
    eventDate: '12th May, 2025',
    eventLocation: 'Surulere, Lagos State',
    numberOfGuests: 14,
    servicesNeeded: ['Small Shop Vendors', 'Cake Bakers'],
    budget: '₦100,000 - ₦200,000',
    additionalInfo: 'We need milky flavoured cake and some Cherry as toppings',
    status: 'Pending',
    totalVisit: 120,
    acceptedHours: '17 hours ago',
    image: '/images/cake.jpg',
    verified: true
  },
  {
    id: '2',
    vendorName: 'UK Cakes & Cream',
    vendorImage: '/images/lady1.jpg',
    vendorLogo: '/images/cc.jpg',
    eventTitle: "Baby Linda's Birthday Party",
    eventType: 'Social Event (Wedding, Birthday)',
    eventDate: '12th May, 2025',
    eventLocation: 'Surulere, Lagos State',
    numberOfGuests: 14,
    servicesNeeded: ['Small Shop Vendors', 'Cake Bakers'],
    budget: '₦100,000 - ₦200,000',
    additionalInfo: 'We need milky flavoured cake and some Cherry as toppings',
    status: 'In Progress',
    totalVisit: 120,
    acceptedHours: '17 hours ago',
    image: '/images/cake.jpg',
    verified: true,
    progressUpdate: {
      hasUpdate: true,
      message: 'New Update'
    }
  },
  {
    id: '3',
    vendorName: 'UK Cakes & Cream',
    vendorImage: '/images/lady1.jpg',
    vendorLogo: '/images/cc.jpg',
    eventTitle: "Baby Linda's Birthday Party",
    eventType: 'Social Event (Wedding, Birthday)',
    eventDate: '12th May, 2025',
    eventLocation: 'Surulere, Lagos State',
    numberOfGuests: 14,
    servicesNeeded: ['Small Shop Vendors', 'Cake Bakers'],
    budget: '₦100,000 - ₦200,000',
    additionalInfo: 'We need milky flavoured cake and some Cherry as toppings',
    status: 'Completed',
    totalVisit: 120,
    acceptedHours: '17 hours ago',
    image: '/images/cake.jpg',
    verified: true,
    review: {
      rating: 5,
      comment: 'Working with UK Cakes & Cream on their [event type, e.g., wedding or corporate dinner] was a smooth and rewarding experience. Communication was clear, timelines were respected, and expectations were well managed from start to finish. I appreciate the professionalism and prompt feedback, which made it easy to deliver exactly what was needed. Looking forward to working together again in the future!',
      images: ['/images/cake1.jpg', '/images/cake2.jpg', '/images/cake56.jpg', '/images/cake6.jpg'],
      clientsWaiting: 200
    }
  },
  {
    id: '4',
    vendorName: 'UK Cakes & Cream',
    vendorImage: '/images/lady1.jpg',
    vendorLogo: '/images/cc.jpg',
    eventTitle: "Baby Linda's Birthday Party",
    eventType: 'Social Event (Wedding, Birthday)',
    eventDate: '12th May, 2025',
    eventLocation: 'Surulere, Lagos State',
    numberOfGuests: 14,
    servicesNeeded: ['Small Shop Vendors', 'Cake Bakers'],
    budget: '₦100,000 - ₦200,000',
    additionalInfo: 'We need milky flavoured cake and some Cherry as toppings',
    status: 'Cancelled',
    totalVisit: 120,
    acceptedHours: '17 hours ago',
    image: '/images/cake.jpg',
    verified: true
  },
  {
    id: '5',
    vendorName: 'UK Cakes & Cream',
    vendorImage: '/images/lady1.jpg',
    vendorLogo: '/images/cc.jpg',
    eventTitle: "Baby Linda's Birthday Party",
    eventType: 'Social Event (Wedding, Birthday)',
    eventDate: '12th May, 2025',
    eventLocation: 'Surulere, Lagos State',
    numberOfGuests: 14,
    servicesNeeded: ['Small Shop Vendors', 'Cake Bakers'],
    budget: '₦100,000 - ₦200,000',
    additionalInfo: 'We need milky flavoured cake and some Cherry as toppings',
    status: 'Awaiting Payment',
    totalVisit: 120,
    acceptedHours: '17 hours ago',
    image: '/images/cake.jpg',
    verified: true
  }
];