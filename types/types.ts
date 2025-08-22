// components/types.ts
export interface User {
  name: string;
  profilePic?: string;
}

export interface Post {
  id: number;
  title: string;
  eventType: string;
  eventDate: string;
  location: string;
  guests: number;
  budget: string;
  servicesNeeded: string[];
}