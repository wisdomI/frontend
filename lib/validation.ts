import { z } from 'zod'

const uuidLike = z
  .string()
  .min(1, 'ID is required')
  .regex(/^[0-9a-fA-F-]{10,}$/, { message: 'Must be a valid identifier' })
  .or(z.string().min(1))

export const ServiceOfferingSchema = z.object({
  serviceName: z.string().min(3, 'Service name must be at least 3 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  categoryIds: z.array(uuidLike).min(1, 'Select at least one category'),
  pricingTitle: z.string().min(2, 'Pricing title is required'),
  price: z.number().positive('Price must be greater than zero'),
})

export const ServiceOfferingPayloadSchema = z.object({
  serviceOfferings: z.array(ServiceOfferingSchema).min(1),
  mediaUrl: z.array(z.any()).optional(),
})

export const MeetingAttendeeSchema = z.object({
  email: z.string().email('Attendee email must be valid'),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
})

export const MeetingPayloadSchema = z.object({
  title: z.string().min(3, 'Title is required'),
  description: z.string().optional(),
  frequency: z.string(),
  meetingDate: z.string().min(1),
  startTime: z.string().min(1),
  endTime: z.string().min(1),
  startDate: z.string().min(1),
  endDate: z.string().min(1),
  isRecurring: z.boolean(),
  location: z.string().optional(),
  meetingLink: z.string().url('Meeting link must be a valid URL').optional(),
  attendees: z.array(MeetingAttendeeSchema),
})

export const CheckConflictsSchema = z.object({
  meetingDate: z.string().min(1),
  startTime: z.string().min(1),
  endTime: z.string().min(1),
  attendees: z.array(z.string().email()),
})

export const PaymentAccountSchema = z.object({
  accountName: z.string().min(3, 'Account name is required'),
  accountNumber: z.string().regex(/^\d{10,}$/, 'Account number must be numeric'),
  bankName: z.string().min(2, 'Bank name is required'),
  paymentMethod: z.string().min(2, 'Payment method is required'),
})

export const CreateBidSchema = z.object({
  serviceRequestId: uuidLike,
  bidAmount: z.number().positive('Bid amount must be positive'),
  startDate: z.string().min(1, 'Start date is required'),
  endDate: z.string().min(1, 'End date is required'),
  proposedDetails: z.string().min(5, 'Provide bid details'),
  additionalServices: z.array(z.string()).optional().default([]),
  images: z.array(z.any()).optional(),
})

export const UpdateBidSchema = CreateBidSchema.partial().extend({
  serviceRequestId: uuidLike.optional(),
})

export type ServiceOfferingPayload = z.infer<typeof ServiceOfferingPayloadSchema>
export type MeetingPayload = z.infer<typeof MeetingPayloadSchema>
export type PaymentAccountPayload = z.infer<typeof PaymentAccountSchema>

