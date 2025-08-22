export interface EventRequestProps {
  id?: string;
  title: string;
  eventDate: string; // ✅ should be used instead of date
  eventLocation: string; // ✅ instead of location
  guests: number;
  services: string[]; // <-- keep simple string[] for now
  budget: [number, number];
  additionalInfo?: string;
  totalVisits: number;
  rating: number;
  ratingCount: number;
  plannerAssigned?: string; // ✅ instead of planner
  viewedStatus?: string; // ✅ instead of viewedAgo
  images?: string[];
  organizer?: {
    name: string;
    initials: string;
  }; // ✅ make it an object
  postedTime?: string;
  eventType?: string; // ✅ you referenced it in the card
}
