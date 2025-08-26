export interface MediaFile {
  id: string;
  type: 'photo' | 'video' | 'link' | 'document';
  name: string;
  url: string;
  thumbnail?: string;
  size?: string;
  pages?: number;
  timestamp: string;
  month: string;
  year: string;
}

export const mockMediaFiles: MediaFile[] = [
  // August 2025 - Photos and Videos
  {
    id: '1',
    type: 'photo',
    name: 'Event Setup Photo 1',
    url: '/images/event-setup-1.jpg',
    thumbnail: '/images/event-setup-1.jpg',
    timestamp: '3/8/24, 4:05pm',
    month: 'August',
    year: '2025'
  },
  {
    id: '2',
    type: 'video',
    name: 'Event Highlights Video',
    url: '/videos/event-highlights.mp4',
    thumbnail: '/images/video-thumb-1.jpg',
    timestamp: '3/8/24, 4:05pm',
    month: 'August',
    year: '2025'
  },
  {
    id: '3',
    type: 'photo',
    name: 'Team Meeting Photo',
    url: '/images/team-meeting.jpg',
    thumbnail: '/images/team-meeting.jpg',
    timestamp: '3/8/24, 4:05pm',
    month: 'August',
    year: '2025'
  },
  {
    id: '4',
    type: 'video',
    name: 'Client Presentation',
    url: '/videos/client-presentation.mp4',
    thumbnail: '/images/video-thumb-2.jpg',
    timestamp: '3/8/24, 4:05pm',
    month: 'August',
    year: '2025'
  },
  {
    id: '5',
    type: 'photo',
    name: 'Venue Setup',
    url: '/images/venue-setup.jpg',
    thumbnail: '/images/venue-setup.jpg',
    timestamp: '3/8/24, 4:05pm',
    month: 'August',
    year: '2025'
  },

  // July 2025
  {
    id: '6',
    type: 'photo',
    name: 'Wedding Decoration',
    url: '/images/wedding-decoration.jpg',
    thumbnail: '/images/wedding-decoration.jpg',
    timestamp: '15/7/24, 2:30pm',
    month: 'July',
    year: '2025'
  },
  {
    id: '7',
    type: 'video',
    name: 'Birthday Party Highlights',
    url: '/videos/birthday-party.mp4',
    thumbnail: '/images/video-thumb-3.jpg',
    timestamp: '15/7/24, 2:30pm',
    month: 'July',
    year: '2025'
  },

  // June 2025
  {
    id: '8',
    type: 'photo',
    name: 'Corporate Event',
    url: '/images/corporate-event.jpg',
    thumbnail: '/images/corporate-event.jpg',
    timestamp: '20/6/24, 10:15am',
    month: 'June',
    year: '2025'
  }
];

export const mockLinks: MediaFile[] = [
  {
    id: 'l1',
    type: 'link',
    name: 'Event Halls',
    url: 'google.com/eventhalls',
    thumbnail: '/images/link-thumb-1.jpg',
    timestamp: '3/8/24, 4:05pm',
    month: 'August',
    year: '2025'
  },
  {
    id: 'l2',
    type: 'link',
    name: 'Event Halls',
    url: 'google.com/eventhalls',
    thumbnail: '/images/link-thumb-1.jpg',
    timestamp: '3/8/24, 4:05pm',
    month: 'August',
    year: '2025'
  },
  {
    id: 'l3',
    type: 'link',
    name: 'Event Halls',
    url: 'google.com/eventhalls',
    thumbnail: '/images/link-thumb-1.jpg',
    timestamp: '3/8/24, 4:05pm',
    month: 'July',
    year: '2025'
  },
  {
    id: 'l4',
    type: 'link',
    name: 'Event Halls',
    url: 'google.com/eventhalls',
    thumbnail: '/images/link-thumb-1.jpg',
    timestamp: '3/8/24, 4:05pm',
    month: 'July',
    year: '2025'
  },
  {
    id: 'l5',
    type: 'link',
    name: 'Event Halls',
    url: 'google.com/eventhalls',
    thumbnail: '/images/link-thumb-1.jpg',
    timestamp: '3/8/24, 4:05pm',
    month: 'June',
    year: '2025'
  }
];

export const mockDocuments: MediaFile[] = [
  {
    id: 'd1',
    type: 'document',
    name: 'Cookery Book.pdf',
    url: '/documents/cookery-book.pdf',
    size: '125KB',
    pages: 2,
    timestamp: '3/8/24, 4:05pm',
    month: 'August',
    year: '2025'
  },
  {
    id: 'd2',
    type: 'document',
    name: 'Cookery Book.doc',
    url: '/documents/cookery-book.doc',
    size: '125KB',
    pages: 2,
    timestamp: '3/8/24, 4:05pm',
    month: 'August',
    year: '2025'
  },
  {
    id: 'd3',
    type: 'document',
    name: 'Cookery Book.xlsx',
    url: '/documents/cookery-book.xlsx',
    size: '126KB',
    pages: 2,
    timestamp: '3/8/24, 4:05pm',
    month: 'August',
    year: '2025'
  },
  {
    id: 'd4',
    type: 'document',
    name: "Daniel's CV.pdf",
    url: '/documents/daniels-cv.pdf',
    size: '125KB',
    pages: 2,
    timestamp: '3/8/24, 4:05pm',
    month: 'July',
    year: '2025'
  },
  {
    id: 'd5',
    type: 'document',
    name: 'Get Started Manual.doc',
    url: '/documents/get-started-manual.doc',
    size: '125KB',
    pages: 2,
    timestamp: '3/8/24, 4:05pm',
    month: 'July',
    year: '2025'
  },
  {
    id: 'd6',
    type: 'document',
    name: 'Product Brief.xlsx',
    url: '/documents/product-brief.xlsx',
    size: '126KB',
    pages: 2,
    timestamp: '3/8/24, 4:05pm',
    month: 'July',
    year: '2025'
  },
  {
    id: 'd7',
    type: 'document',
    name: "Daniel's CV.pdf",
    url: '/documents/daniels-cv-2.pdf',
    size: '125KB',
    pages: 2,
    timestamp: '3/8/24, 4:05pm',
    month: 'June',
    year: '2025'
  },
  {
    id: 'd8',
    type: 'document',
    name: 'Get Started Manual.doc',
    url: '/documents/get-started-manual-2.doc',
    size: '126KB',
    pages: 2,
    timestamp: '3/8/24, 4:05pm',
    month: 'June',
    year: '2025'
  }
];

export const getFileIcon = (fileName: string) => {
  const extension = fileName.split('.').pop()?.toLowerCase();
  
  switch (extension) {
    case 'pdf':
      return '📄'; // PDF icon
    case 'doc':
    case 'docx':
      return '📝'; // Word icon
    case 'xlsx':
    case 'xls':
      return '📊'; // Excel icon
    case 'ppt':
    case 'pptx':
      return '📊'; // PowerPoint icon
    default:
      return '📄'; // Default document icon
  }
};

export const getFileIconColor = (fileName: string) => {
  const extension = fileName.split('.').pop()?.toLowerCase();
  
  switch (extension) {
    case 'pdf':
      return 'bg-red-500';
    case 'doc':
    case 'docx':
      return 'bg-blue-500';
    case 'xlsx':
    case 'xls':
      return 'bg-green-500';
    case 'ppt':
    case 'pptx':
      return 'bg-orange-500';
    default:
      return 'bg-gray-500';
  }
};