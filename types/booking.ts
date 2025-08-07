export interface Booking {
  id: string
  clientId: string
  vendorId: string
  eventDetails: EventDetails
  status: BookingStatus
  payment: PaymentDetails
  communication: Message[]
  createdAt: Date
  updatedAt: Date
}

export interface EventDetails {
  type: string
  date: Date
  startTime: string
  endTime: string
  location: {
    venue: string
    address: string
    city: string
    state: string
    zipCode: string
  }
  guestCount: number
  specialRequests?: string
  budget: number
}

export type BookingStatus = 
  | 'pending'
  | 'confirmed'
  | 'in_progress'
  | 'completed'
  | 'cancelled'
  | 'disputed'

export interface PaymentDetails {
  totalAmount: number
  paidAmount: number
  remainingAmount: number
  paymentMethod: string
  transactions: Transaction[]
  dueDate?: Date
}

export interface Transaction {
  id: string
  amount: number
  type: 'payment' | 'refund'
  status: 'pending' | 'completed' | 'failed'
  paymentMethod: string
  transactionDate: Date
  description?: string
}

export interface Message {
  id: string
  senderId: string
  receiverId: string
  content: string
  timestamp: Date
  read: boolean
  attachments?: Attachment[]
}

export interface Attachment {
  id: string
  filename: string
  url: string
  type: string
  size: number
}