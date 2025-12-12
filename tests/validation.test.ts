import { describe, expect, it } from 'vitest'
import {
  ServiceOfferingPayloadSchema,
  MeetingPayloadSchema,
  CheckConflictsSchema,
  PaymentAccountSchema,
  CreateBidSchema,
  UpdateBidSchema,
} from '@/lib/validation'

describe('ServiceOfferingPayloadSchema', () => {
  const basePayload = {
    serviceOfferings: [
      {
        serviceName: 'Premium Decor',
        description: 'Full service decoration for luxury weddings',
        categoryIds: ['550e8400-e29b-41d4-a716-446655440000'],
        pricingTitle: 'Per Event',
        price: 2500,
      },
    ],
    mediaUrl: [],
  }

  it('accepts a valid payload', () => {
    expect(() => ServiceOfferingPayloadSchema.parse(basePayload)).not.toThrow()
  })

  it('rejects missing category ids', () => {
    expect(() =>
      ServiceOfferingPayloadSchema.parse({
        ...basePayload,
        serviceOfferings: [{ ...basePayload.serviceOfferings[0], categoryIds: [] }],
      })
    ).toThrow()
  })

  it('rejects negative price', () => {
    expect(() =>
      ServiceOfferingPayloadSchema.parse({
        ...basePayload,
        serviceOfferings: [{ ...basePayload.serviceOfferings[0], price: -10 }],
      })
    ).toThrow()
  })
})

describe('MeetingPayloadSchema', () => {
  const basePayload = {
    title: 'Planning call',
    description: 'Weekly planning call',
    frequency: 'once',
    meetingDate: '2026-01-01T10:00:00.000Z',
    startTime: '2026-01-01T10:00:00.000Z',
    endTime: '2026-01-01T11:00:00.000Z',
    startDate: '2026-01-01T10:00:00.000Z',
    endDate: '2026-01-01T11:00:00.000Z',
    isRecurring: false,
    location: 'Zoom',
    meetingLink: 'https://zoom.us/j/123456',
    attendees: [{ email: 'client@example.com' }],
  }

  it('parses a valid meeting', () => {
    expect(() => MeetingPayloadSchema.parse(basePayload)).not.toThrow()
  })

  it('rejects invalid attendee email', () => {
    expect(() =>
      MeetingPayloadSchema.parse({
        ...basePayload,
        attendees: [{ email: 'invalid-email' }],
      })
    ).toThrow()
  })
})

describe('CheckConflictsSchema', () => {
  it('requires attendee emails', () => {
    expect(() =>
      CheckConflictsSchema.parse({
        meetingDate: '2026-01-01',
        startTime: '10:00',
        endTime: '11:00',
        attendees: ['client@example.com'],
      })
    ).not.toThrow()

    expect(() =>
      CheckConflictsSchema.parse({
        meetingDate: '2026-01-01',
        startTime: '10:00',
        endTime: '11:00',
        attendees: ['invalid-email'],
      })
    ).toThrow()
  })
})

describe('PaymentAccountSchema', () => {
  it('accepts valid bank details', () => {
    expect(() =>
      PaymentAccountSchema.parse({
        accountName: 'John Doe',
        accountNumber: '1234567890',
        bankName: 'Access Bank',
        paymentMethod: 'transfer',
      })
    ).not.toThrow()
  })

  it('rejects malformed account numbers', () => {
    expect(() =>
      PaymentAccountSchema.parse({
        accountName: 'John Doe',
        accountNumber: '12ab',
        bankName: 'Access Bank',
        paymentMethod: 'transfer',
      })
    ).toThrow()
  })
})

describe('Bid Schemas', () => {
  const baseBid = {
    serviceRequestId: '550e8400-e29b-41d4-a716-446655440000',
    bidAmount: 5000,
    startDate: '2026-01-01',
    endDate: '2026-01-05',
    proposedDetails: 'Full decor and lighting',
    additionalServices: [],
  }

  it('validates create payloads', () => {
    expect(() => CreateBidSchema.parse(baseBid)).not.toThrow()
  })

  it('validates update payloads with partial fields', () => {
    expect(() =>
      UpdateBidSchema.parse({
        bidAmount: 7000,
        proposedDetails: 'Updated details',
      })
    ).not.toThrow()
  })

  it('rejects negative bid amounts', () => {
    expect(() =>
      CreateBidSchema.parse({
        ...baseBid,
        bidAmount: -1,
      })
    ).toThrow()
  })
})

