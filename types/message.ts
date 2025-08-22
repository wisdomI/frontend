export interface Message {
  id: string;
  content: string;
  timestamp: string;
  isOwn: boolean;
  status?: 'sent' | 'delivered' | 'read';
}

export interface Conversation {
  id: string;
  name: string;
  avatar: string;
  lastMessage: string;
  timestamp: string;
  isUnread: boolean;
  hasAttachment?: boolean;
  attachmentType?: 'image' | 'file';
  messages: Message[];
}

export interface SupportTicket {
  category: string;
  issueType: string;
  eventVendor?: string;
  eventPlanner?: string;
  description: string;
  attachments: File[];
}