import { Conversation } from '@/types/message';

export const mockConversations: Conversation[] = [
  {
    id: '1',
    name: 'UK Cakes and Cream',
    avatar: 'https://images.pexels.com/photos/1126728/pexels-photo-1126728.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop',
    lastMessage: 'I will like us to negotiate and the',
    timestamp: '4:54pm',
    isUnread: false,
    messages: [
      {
        id: '1',
        content: 'Please I will like us to discuss about that Cake request for my daughter',
        timestamp: '4:54pm',
        isOwn: false
      },
      {
        id: '2',
        content: 'Oh that\'s nice. Thanks for choosing UK Cakes & Cream',
        timestamp: '4:54pm',
        isOwn: true
      },
      {
        id: '3',
        content: 'Please I will like us to discuss about that Cake request for my daughter',
        timestamp: '4:54pm',
        isOwn: false
      },
      {
        id: '4',
        content: 'Oh that\'s nice. Thanks for choosing UK Cakes & Cream',
        timestamp: '4:54pm',
        isOwn: true
      },
      {
        id: '5',
        content: 'Please I will like us to discuss about that Cake request for my daughter',
        timestamp: '4:54pm',
        isOwn: false
      }
    ]
  },
  {
    id: '2',
    name: 'Habeeb Event Planner',
    avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop',
    lastMessage: 'Good day Tule. Trust you are...',
    timestamp: '4:54pm',
    isUnread: true,
    messages: [
      {
        id: '1',
        content: 'Good day Tule. Trust you are doing well. I wanted to follow up on the event planning discussion we had earlier.',
        timestamp: '4:54pm',
        isOwn: false
      },
      {
        id: '2',
        content: 'Hello! Yes, I\'m doing well, thank you. I\'m still considering the options you presented.',
        timestamp: '4:55pm',
        isOwn: true
      }
    ]
  },
  {
    id: '3',
    name: 'UK Cakes and Cream',
    avatar: 'https://images.pexels.com/photos/1126728/pexels-photo-1126728.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop',
    lastMessage: 'I will like us to negotiate and the',
    timestamp: '4:54pm',
    isUnread: true,
    messages: [
      {
        id: '1',
        content: 'I will like us to negotiate and the pricing for the wedding cake',
        timestamp: '4:54pm',
        isOwn: false
      }
    ]
  },
  {
    id: '4',
    name: 'UK Cakes and Cream',
    avatar: 'https://images.pexels.com/photos/1126728/pexels-photo-1126728.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop',
    lastMessage: 'Derrial Williams Cv',
    timestamp: '4:54pm',
    isUnread: true,
    hasAttachment: true,
    attachmentType: 'file',
    messages: [
      {
        id: '1',
        content: 'Here is my CV for your review',
        timestamp: '4:54pm',
        isOwn: false
      }
    ]
  },
  {
    id: '5',
    name: 'UK Cakes and Cream',
    avatar: 'https://images.pexels.com/photos/1126728/pexels-photo-1126728.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop',
    lastMessage: 'ImageBG4.jpeg',
    timestamp: '4:54pm',
    isUnread: true,
    hasAttachment: true,
    attachmentType: 'image',
    messages: [
      {
        id: '1',
        content: 'Check out this cake design inspiration',
        timestamp: '4:54pm',
        isOwn: false
      }
    ]
  }
];