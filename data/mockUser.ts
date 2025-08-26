export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: 'vendor' | 'client' | 'admin';
  isOnline: boolean;
  notifications: {
    unread: number;
    messages: number;
  };
}

export const mockUser: User = {
  id: '1',
  name: 'Daniel',
  email: 'daniel@eventhub.com',
  avatar: '/images/user-avatar.jpg',
  role: 'vendor',
  isOnline: true,
  notifications: {
    unread: 3,
    messages: 2
  }
};

export const mockNotifications = [
  {
    id: '1',
    title: 'New Service Request',
    message: 'You have a new service request for wedding photography',
    time: '2 minutes ago',
    isRead: false,
    type: 'request'
  },
  {
    id: '2',
    title: 'Payment Received',
    message: 'Payment of ₦150,000 has been received for your catering service',
    time: '1 hour ago',
    isRead: false,
    type: 'payment'
  },
  {
    id: '3',
    title: 'Review Posted',
    message: 'A client has posted a 5-star review for your service',
    time: '3 hours ago',
    isRead: false,
    type: 'review'
  }
];