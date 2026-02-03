# Onboarding Guides & Product Tours Implementation Guide

## Overview

This document outlines a comprehensive approach to implementing onboarding guides and product tours for the Event Hub application. The solution will be role-aware (client/vendor), context-driven, and seamlessly integrated with the existing architecture.

---

## 1. Library Selection

### Recommended: **React Joyride** (`@react-joyride/react`)

**Rationale:**
- ✅ Most popular and well-maintained React tour library
- ✅ Excellent TypeScript support
- ✅ Highly customizable (steps, tooltips, beacons, spotlight)
- ✅ Built-in accessibility features (ARIA labels, keyboard navigation)
- ✅ Works seamlessly with Next.js App Router
- ✅ Supports continuous tours, conditional steps, and callbacks
- ✅ Lightweight (~15KB gzipped)
- ✅ Active community and extensive documentation

**Alternative Options:**
- **Shepherd.js** (via `react-shepherd`): More feature-rich but heavier
- **Intro.js** (via `react-introjs`): Simpler but less flexible
- **Driver.js**: Lightweight but requires more manual setup

**Installation:**
```bash
npm install @react-joyride/react
```

---

## 2. Architecture Approach

### 2.1 Tour Context Provider

Create a centralized `TourContext` that manages:
- Tour state (active tour, current step, completion status)
- Role-based tour definitions
- Persistence (localStorage/API)
- Tour triggers (first visit, manual, feature-specific)

**File Structure:**
```
contexts/
  └── TourContext.tsx
hooks/
  └── useTour.ts
components/
  └── tours/
      ├── TourProvider.tsx
      ├── TourBeacon.tsx
      └── TourControls.tsx
config/
  └── tours/
      ├── clientTours.ts
      ├── vendorTours.ts
      └── sharedTours.ts
```

### 2.2 Integration Points

1. **Root Layout** (`app/layout.tsx`): Wrap with `TourProvider`
2. **Role-Specific Layouts**: 
   - `app/client/layout.tsx` - Trigger client tours on first dashboard visit
   - `app/vendor/layout.tsx` - Trigger vendor tours on first dashboard visit
3. **Key Pages**: Add tour beacons/triggers for feature-specific tours
4. **Auth Flow**: Trigger welcome tour after successful login

---

## 3. Implementation Strategy

### 3.1 Step 1: Create Tour Context

```typescript
// contexts/TourContext.tsx
'use client'

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { useAuthContext } from './AuthContext'
import { usePathname } from 'next/navigation'

interface TourStep {
  target: string // CSS selector or React ref
  content: React.ReactNode | string
  title?: string
  placement?: 'top' | 'bottom' | 'left' | 'right' | 'center' | 'auto'
  disableBeacon?: boolean
  disableOverlayClose?: boolean
  spotlightClicks?: boolean
  hideCloseButton?: boolean
}

interface Tour {
  id: string
  name: string
  steps: TourStep[]
  roles?: ('client' | 'vendor' | 'admin')[]
  trigger?: 'auto' | 'manual' | 'feature'
  requiredFeature?: string // e.g., 'first-service-created'
}

interface TourContextType {
  activeTour: Tour | null
  isRunning: boolean
  currentStepIndex: number
  startTour: (tourId: string) => void
  stopTour: () => void
  completeTour: (tourId: string) => void
  hasCompletedTour: (tourId: string) => boolean
  resetTour: (tourId: string) => void
}

const TourContext = createContext<TourContextType | undefined>(undefined)

export const TourProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuthContext()
  const pathname = usePathname()
  const [activeTour, setActiveTour] = useState<Tour | null>(null)
  const [isRunning, setIsRunning] = useState(false)
  const [currentStepIndex, setCurrentStepIndex] = useState(0)
  const [completedTours, setCompletedTours] = useState<Set<string>>(new Set())

  // Load completed tours from localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('completedTours')
      if (stored) {
        setCompletedTours(new Set(JSON.parse(stored)))
      }
    }
  }, [])

  // Auto-trigger tours based on route and role
  useEffect(() => {
    if (!user || !pathname) return

    const accountType = user.accountType
    const isFirstVisit = !localStorage.getItem('hasVisitedDashboard')

    // Client dashboard first visit
    if (accountType === 'client' && pathname === '/client/dashboard' && isFirstVisit) {
      startTour('client-dashboard-welcome')
      localStorage.setItem('hasVisitedDashboard', 'true')
    }

    // Vendor dashboard first visit
    if (accountType === 'vendor' && pathname === '/vendor' && isFirstVisit) {
      startTour('vendor-dashboard-welcome')
      localStorage.setItem('hasVisitedDashboard', 'true')
    }
  }, [user, pathname])

  const startTour = useCallback((tourId: string) => {
    // Import tour definitions dynamically
    import('@/config/tours/clientTours').then(({ clientTours }) => {
      import('@/config/tours/vendorTours').then(({ vendorTours }) => {
        const allTours = [...clientTours, ...vendorTours]
        const tour = allTours.find(t => t.id === tourId)
        
        if (tour && !completedTours.has(tourId)) {
          setActiveTour(tour)
          setIsRunning(true)
          setCurrentStepIndex(0)
        }
      })
    })
  }, [completedTours])

  const stopTour = useCallback(() => {
    setIsRunning(false)
    setActiveTour(null)
    setCurrentStepIndex(0)
  }, [])

  const completeTour = useCallback((tourId: string) => {
    const updated = new Set(completedTours)
    updated.add(tourId)
    setCompletedTours(updated)
    
    if (typeof window !== 'undefined') {
      localStorage.setItem('completedTours', JSON.stringify(Array.from(updated)))
    }
    
    stopTour()
  }, [completedTours, stopTour])

  const hasCompletedTour = useCallback((tourId: string) => {
    return completedTours.has(tourId)
  }, [completedTours])

  const resetTour = useCallback((tourId: string) => {
    const updated = new Set(completedTours)
    updated.delete(tourId)
    setCompletedTours(updated)
    
    if (typeof window !== 'undefined') {
      localStorage.setItem('completedTours', JSON.stringify(Array.from(updated)))
    }
  }, [completedTours])

  return (
    <TourContext.Provider
      value={{
        activeTour,
        isRunning,
        currentStepIndex,
        startTour,
        stopTour,
        completeTour,
        hasCompletedTour,
        resetTour,
      }}
    >
      {children}
    </TourContext.Provider>
  )
}

export const useTour = () => {
  const context = useContext(TourContext)
  if (!context) {
    throw new Error('useTour must be used within TourProvider')
  }
  return context
}
```

### 3.2 Step 2: Create Tour Definitions

```typescript
// config/tours/clientTours.ts
import { Tour } from '@/contexts/TourContext'

export const clientTours: Tour[] = [
  {
    id: 'client-dashboard-welcome',
    name: 'Welcome to Event Hub',
    roles: ['client', 'individual', 'business'],
    trigger: 'auto',
    steps: [
      {
        target: '[data-tour="client-dashboard"]',
        content: 'Welcome to your dashboard! Here you can manage all your event planning needs.',
        title: 'Welcome! 👋',
        placement: 'center',
      },
      {
        target: '[data-tour="quick-actions"]',
        content: 'Use these quick actions to post service requests, manage bookings, and browse vendors.',
        title: 'Quick Actions',
        placement: 'bottom',
      },
      {
        target: '[data-tour="manage-bids"]',
        content: 'View and manage bids from vendors for your service requests.',
        title: 'Manage Bids',
        placement: 'right',
      },
      {
        target: '[data-tour="schedule-meetings"]',
        content: 'Schedule meetings with vendors to discuss your event details.',
        title: 'Schedule Meetings',
        placement: 'right',
      },
      {
        target: '[data-tour="client-sidebar"]',
        content: 'Navigate to different sections using the sidebar menu.',
        title: 'Navigation',
        placement: 'right',
      },
    ],
  },
  {
    id: 'client-create-request',
    name: 'Creating a Service Request',
    roles: ['client', 'individual', 'business'],
    trigger: 'feature',
    requiredFeature: 'first-request-created',
    steps: [
      {
        target: '[data-tour="post-service-button"]',
        content: 'Click here to post a new service request.',
        title: 'Post Service Request',
        placement: 'bottom',
      },
      {
        target: '[data-tour="service-form"]',
        content: 'Fill in the details: event type, date, location, and budget.',
        title: 'Service Details',
        placement: 'top',
      },
      {
        target: '[data-tour="submit-button"]',
        content: 'Submit your request and vendors will start bidding!',
        title: 'Submit Request',
        placement: 'top',
      },
    ],
  },
  {
    id: 'client-manage-bids',
    name: 'Managing Bids',
    roles: ['client', 'individual', 'business'],
    trigger: 'manual',
    steps: [
      {
        target: '[data-tour="bid-list"]',
        content: 'View all bids received for your service requests.',
        title: 'Bid List',
        placement: 'bottom',
      },
      {
        target: '[data-tour="bid-card"]',
        content: 'Compare bids side-by-side, view vendor profiles, and see pricing details.',
        title: 'Bid Details',
        placement: 'right',
      },
      {
        target: '[data-tour="accept-bid"]',
        content: 'Accept a bid to proceed with booking. You can also negotiate or decline.',
        title: 'Accept Bid',
        placement: 'top',
      },
    ],
  },
]

// config/tours/vendorTours.ts
import { Tour } from '@/contexts/TourContext'

export const vendorTours: Tour[] = [
  {
    id: 'vendor-dashboard-welcome',
    name: 'Welcome to Vendor Dashboard',
    roles: ['vendor'],
    trigger: 'auto',
    steps: [
      {
        target: '[data-tour="vendor-dashboard"]',
        content: 'Welcome to your vendor dashboard! Manage your services, bids, and clients here.',
        title: 'Welcome! 👋',
        placement: 'center',
      },
      {
        target: '[data-tour="vendor-stats"]',
        content: 'Track your performance with real-time statistics.',
        title: 'Statistics',
        placement: 'bottom',
      },
      {
        target: '[data-tour="vendor-services"]',
        content: 'Manage your service offerings and create new ones.',
        title: 'Service Offerings',
        placement: 'right',
      },
      {
        target: '[data-tour="vendor-bids"]',
        content: 'View and respond to service requests from clients.',
        title: 'Manage Bids',
        placement: 'right',
      },
      {
        target: '[data-tour="vendor-sidebar"]',
        content: 'Navigate through all vendor features using the sidebar.',
        title: 'Navigation',
        placement: 'right',
      },
    ],
  },
  {
    id: 'vendor-create-service',
    name: 'Creating a Service Offering',
    roles: ['vendor'],
    trigger: 'feature',
    requiredFeature: 'first-service-created',
    steps: [
      {
        target: '[data-tour="create-service-button"]',
        content: 'Click here to add a new service offering.',
        title: 'Create Service',
        placement: 'bottom',
      },
      {
        target: '[data-tour="service-form"]',
        content: 'Fill in service details, pricing, and upload images.',
        title: 'Service Details',
        placement: 'top',
      },
      {
        target: '[data-tour="categories"]',
        content: 'Select relevant categories to help clients find your service.',
        title: 'Categories',
        placement: 'right',
      },
      {
        target: '[data-tour="publish-button"]',
        content: 'Publish your service to start receiving bids!',
        title: 'Publish',
        placement: 'top',
      },
    ],
  },
  {
    id: 'vendor-place-bid',
    name: 'Placing a Bid',
    roles: ['vendor'],
    trigger: 'manual',
    steps: [
      {
        target: '[data-tour="service-requests"]',
        content: 'Browse available service requests from clients.',
        title: 'Service Requests',
        placement: 'bottom',
      },
      {
        target: '[data-tour="request-card"]',
        content: 'Click on a request to view details and place a bid.',
        title: 'Request Details',
        placement: 'right',
      },
      {
        target: '[data-tour="bid-form"]',
        content: 'Enter your pricing, timeline, and any additional notes.',
        title: 'Place Bid',
        placement: 'top',
      },
      {
        target: '[data-tour="submit-bid"]',
        content: 'Submit your bid and wait for the client\'s response.',
        title: 'Submit',
        placement: 'top',
      },
    ],
  },
]
```

### 3.3 Step 3: Create Tour Component with React Joyride

```typescript
// components/tours/TourRunner.tsx
'use client'

import React, { useEffect, useState } from 'react'
import Joyride, { CallBackProps, STATUS, Step } from 'react-joyride'
import { useTour } from '@/contexts/TourContext'
import { useAuthContext } from '@/contexts/AuthContext'

export const TourRunner: React.FC = () => {
  const { activeTour, isRunning, stopTour, completeTour, currentStepIndex } = useTour()
  const { user } = useAuthContext()
  const [run, setRun] = useState(false)
  const [steps, setSteps] = useState<Step[]>([])

  useEffect(() => {
    if (activeTour && isRunning) {
      // Convert tour steps to Joyride format
      const joyrideSteps: Step[] = activeTour.steps.map(step => ({
        target: step.target,
        content: typeof step.content === 'string' ? step.content : React.createElement('div', {}, step.content),
        title: step.title,
        placement: step.placement || 'auto',
        disableBeacon: step.disableBeacon,
        disableOverlayClose: step.disableOverlayClose,
        spotlightClicks: step.spotlightClicks,
        hideCloseButton: step.hideCloseButton,
      }))
      
      setSteps(joyrideSteps)
      setRun(true)
    } else {
      setRun(false)
    }
  }, [activeTour, isRunning])

  const handleJoyrideCallback = (data: CallBackProps) => {
    const { status, type } = data

    if (status === STATUS.FINISHED || status === STATUS.SKIPPED) {
      if (activeTour) {
        if (status === STATUS.FINISHED) {
          completeTour(activeTour.id)
        } else {
          stopTour()
        }
      }
      setRun(false)
    }

    // Log tour progress for analytics
    if (type === 'step:after' && activeTour) {
      console.log(`Tour: ${activeTour.id}, Step: ${data.index}`)
    }
  }

  if (!activeTour || !user) return null

  // Check if user role matches tour requirements
  if (activeTour.roles && !activeTour.roles.includes(user.accountType as any)) {
    return null
  }

  return (
    <Joyride
      steps={steps}
      run={run}
      continuous={true}
      showProgress={true}
      showSkipButton={true}
      callback={handleJoyrideCallback}
      styles={{
        options: {
          primaryColor: '#2563eb', // Tailwind blue-600
          zIndex: 10000,
        },
        tooltip: {
          borderRadius: '8px',
          fontSize: '14px',
        },
        buttonNext: {
          backgroundColor: '#2563eb',
          fontSize: '14px',
          padding: '8px 16px',
        },
        buttonBack: {
          color: '#6b7280',
          fontSize: '14px',
        },
        buttonSkip: {
          color: '#6b7280',
          fontSize: '14px',
        },
      }}
      locale={{
        back: 'Back',
        close: 'Close',
        last: 'Finish',
        next: 'Next',
        skip: 'Skip',
      }}
    />
  )
}
```

### 3.4 Step 4: Add Tour Data Attributes to Components

Update key components with `data-tour` attributes:

```typescript
// Example: app/client/dashboard/page.tsx
<div data-tour="client-dashboard" className="...">
  {/* Dashboard content */}
</div>

<div data-tour="quick-actions" className="...">
  {/* Quick actions */}
</div>

// Example: components/client/ClientSidebar.tsx
<aside data-tour="client-sidebar" className="...">
  {/* Sidebar */}
</aside>
```

### 3.5 Step 5: Integrate Tour Provider

```typescript
// components/providers/Providers.tsx
import { TourProvider } from '@/contexts/TourContext'
import { TourRunner } from '@/components/tours/TourRunner'

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <TourProvider>
      {children}
      <TourRunner />
    </TourProvider>
  )
}
```

### 3.6 Step 6: Add Manual Tour Triggers

```typescript
// components/tours/TourControls.tsx
'use client'

import React from 'react'
import { useTour } from '@/contexts/TourContext'
import { Button } from '@/components/ui/Button'
import { HelpCircle } from 'lucide-react'

export const TourControls: React.FC<{ tourId: string; label?: string }> = ({ 
  tourId, 
  label = 'Take Tour' 
}) => {
  const { startTour, hasCompletedTour } = useTour()
  const hasCompleted = hasCompletedTour(tourId)

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={() => startTour(tourId)}
      className="flex items-center gap-2"
    >
      <HelpCircle className="w-4 h-4" />
      {hasCompleted ? 'Replay Tour' : label}
    </Button>
  )
}

// Usage in pages:
// <TourControls tourId="client-manage-bids" label="Learn how to manage bids" />
```

---

## 4. Advanced Features

### 4.1 Conditional Steps

```typescript
// Example: Skip steps if feature is already used
{
  id: 'vendor-advanced-features',
  steps: [
    {
      target: '[data-tour="analytics"]',
      content: 'View detailed analytics...',
      // Only show if analytics haven't been accessed
      disableBeacon: hasAccessedAnalytics,
    },
  ],
}
```

### 4.2 Feature-Specific Tours

Trigger tours when users first interact with features:

```typescript
// hooks/useFeatureTour.ts
export const useFeatureTour = (featureId: string) => {
  const { startTour, hasCompletedTour } = useTour()
  
  useEffect(() => {
    const hasCompleted = hasCompletedTour(`${featureId}-tour`)
    const hasUsedFeature = localStorage.getItem(`used-${featureId}`)
    
    if (!hasCompleted && !hasUsedFeature) {
      // Wait for element to be rendered
      setTimeout(() => {
        const element = document.querySelector(`[data-tour="${featureId}"]`)
        if (element) {
          startTour(`${featureId}-tour`)
        }
      }, 1000)
    }
  }, [featureId, startTour, hasCompletedTour])
}

// Usage in component:
// useFeatureTour('create-service')
```

### 4.3 Tour Analytics

```typescript
// lib/tourAnalytics.ts
export const trackTourEvent = (event: string, tourId: string, data?: any) => {
  // Integrate with your analytics service (e.g., Google Analytics, Mixpanel)
  console.log('Tour Event:', { event, tourId, data })
  
  // Example: Send to API
  // fetch('/api/analytics/tours', {
  //   method: 'POST',
  //   body: JSON.stringify({ event, tourId, data }),
  // })
}
```

### 4.4 Tour Reset (Admin/Dev)

```typescript
// components/tours/TourReset.tsx (dev only)
'use client'

import { useTour } from '@/contexts/TourContext'
import { Button } from '@/components/ui/Button'

export const TourReset: React.FC = () => {
  const { resetTour } = useTour()
  
  if (process.env.NODE_ENV !== 'development') return null
  
  return (
    <div className="fixed bottom-4 right-4 z-50">
      <Button onClick={() => {
        localStorage.removeItem('completedTours')
        localStorage.removeItem('hasVisitedDashboard')
        window.location.reload()
      }}>
        Reset All Tours (Dev)
      </Button>
    </div>
  )
}
```

---

## 5. User Experience Considerations

### 5.1 Timing
- **First Visit**: Auto-trigger welcome tour after login
- **Feature Discovery**: Trigger when user first accesses a feature
- **Manual Access**: Provide "Take Tour" buttons in help menus

### 5.2 Persistence
- Store completed tours in `localStorage` (client-side)
- Optionally sync with backend API for cross-device persistence
- Allow users to replay tours via settings

### 5.3 Accessibility
- React Joyride includes ARIA labels by default
- Ensure keyboard navigation works (Tab, Enter, Escape)
- Test with screen readers
- Provide skip option for all tours

### 5.4 Performance
- Lazy load tour definitions
- Only render `TourRunner` when a tour is active
- Use `data-tour` attributes instead of refs for better performance

### 5.5 Mobile Considerations
- Adjust tooltip placement for mobile screens
- Use `placement: 'auto'` to let Joyride choose optimal position
- Test touch interactions on mobile devices

---

## 6. Implementation Checklist

- [ ] Install `@react-joyride/react`
- [ ] Create `TourContext` and `TourProvider`
- [ ] Create tour definition files (`clientTours.ts`, `vendorTours.ts`)
- [ ] Create `TourRunner` component
- [ ] Add `TourProvider` to `Providers.tsx`
- [ ] Add `data-tour` attributes to key components
- [ ] Implement auto-trigger logic in layouts
- [ ] Create `TourControls` component for manual triggers
- [ ] Add tour reset functionality (dev mode)
- [ ] Test tours on client dashboard
- [ ] Test tours on vendor dashboard
- [ ] Test mobile responsiveness
- [ ] Test accessibility (keyboard nav, screen readers)
- [ ] Add analytics tracking
- [ ] Document tour IDs and usage in codebase

---

## 7. Example Tour Flow

### Client First Login Flow:
1. User logs in → Redirected to `/client/dashboard`
2. `TourProvider` detects first visit → Auto-triggers `client-dashboard-welcome`
3. User completes tour → Marked as completed in localStorage
4. User clicks "Post Service Request" → Feature tour triggers (`client-create-request`)
5. User can manually trigger tours via help menu

### Vendor First Login Flow:
1. User logs in → Redirected to `/vendor`
2. `TourProvider` detects first visit → Auto-triggers `vendor-dashboard-welcome`
3. User navigates to Services → Feature tour triggers (`vendor-create-service`)
4. User can access all tours via help menu

---

## 8. Maintenance & Updates

### Adding New Tours:
1. Define tour in appropriate config file (`clientTours.ts` or `vendorTours.ts`)
2. Add `data-tour` attributes to target components
3. Test tour flow
4. Update documentation

### Updating Existing Tours:
1. Modify step content/order in tour definition
2. Test changes
3. Consider resetting tour for existing users (optional)

### Removing Tours:
1. Remove tour definition
2. Remove `data-tour` attributes (optional, doesn't break if left)
3. Update documentation

---

## 9. Best Practices

1. **Keep tours short**: 3-7 steps maximum per tour
2. **Focus on value**: Highlight key features, not every button
3. **Progressive disclosure**: Break complex flows into multiple tours
4. **User control**: Always allow skipping and replaying
5. **Context-aware**: Only show relevant tours based on user role and actions
6. **Test thoroughly**: Ensure tours work across different screen sizes
7. **Monitor analytics**: Track completion rates and identify drop-off points
8. **Iterate**: Update tours based on user feedback and analytics

---

## 10. Future Enhancements

- **Interactive Tours**: Allow users to click through actual UI elements during tour
- **Video Tours**: Embed video walkthroughs for complex features
- **Contextual Help**: Show tooltips on hover for specific features
- **Tour Builder**: Admin interface to create/edit tours without code changes
- **A/B Testing**: Test different tour approaches to optimize completion rates
- **Multi-language Support**: Localize tour content for international users

---

This implementation provides a robust, scalable foundation for onboarding guides and product tours that integrates seamlessly with your existing Event Hub architecture.

