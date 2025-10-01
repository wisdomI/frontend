# 🔌 API Endpoints Implementation Guide

## 📋 Overview

This document provides a comprehensive overview of all API endpoints implemented in the Event Hub frontend application. The implementation follows the backend API specification and includes authentication, profile management, and business logic endpoints.

## 🏗️ Base Configuration

```typescript
// Base API URL
const API_BASE_URL = 'https://backend-a3nd.onrender.com/api/v1'

// Axios Configuration
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})
```

## 🔐 Authentication & User Management

### 1. User Registration
```typescript
POST /auth/register
```
**Request Body:**
```typescript
{
  email: string
  password: string
  confirmPassword: string
  firstName: string
  lastName: string
  phoneNumber: string
  accountType: 'individual' | 'business' | 'vendor' | 'admin'
}
```
**Response:**
```typescript
{
  success: boolean
  data: {
    accessToken: string
    refreshToken: string
    user: User
  }
}
```

### 2. User Login
```typescript
POST /auth/login
```
**Request Body:**
```typescript
{
  email: string
  password: string
}
```
**Password Requirements:**
- Must contain at least one lowercase letter (a-z)
- Must contain at least one uppercase letter (A-Z)
- Must contain at least one digit (0-9)
- Must contain at least one special character (@$!%*?&)

**Response:**
```typescript
{
  success: boolean
  data: {
    accessToken: string
    refreshToken: string
    user: User
  }
}
```

### 3. Token Refresh
```typescript
POST /auth/refresh-token
```
**Headers:**
```
Authorization: Bearer <refresh_token>
```
**Response:**
```typescript
{
  success: boolean
  data: {
    accessToken: string
  }
}
```

### 4. User Logout
```typescript
POST /auth/logout
```
**Headers:**
```
Authorization: Bearer <access_token>
```

### 5. Get Current User
```typescript
GET /auth/me
```
**Headers:**
```
Authorization: Bearer <access_token>
```
**Response:**
```typescript
{
  success: boolean
  data: User
}
```

### 6. Email Verification
```typescript
POST /auth/verify-email
```
**Request Body:**
```typescript
{
  email: string
  verificationCode: string
}
```

### 7. Resend Verification Code
```typescript
POST /auth/resend-verification
```
**Request Body:**
```typescript
{
  email: string
}
```

### 8. Password Reset
```typescript
POST /password/reset
POST /password/validate-code
POST /password/reset-password
```

## 👤 Profile Management

### 1. Create Profile
```typescript
POST /profile/
```
**Content-Type:** `multipart/form-data`
**Request Body:** FormData with profile information and files

### 2. Get My Profile
```typescript
GET /profile/me
```
**Headers:**
```
Authorization: Bearer <access_token>
```

### 3. Get All Profiles
```typescript
GET /profile/all
```
**Query Parameters:**
- `page?: number`
- `limit?: number`
- `cursor?: string`

### 4. Get Profile by ID
```typescript
GET /profile/{id}
```

### 5. Update Profile
```typescript
PATCH /profile/{id}
```
**Content-Type:** `multipart/form-data`

### 6. Update Display Picture
```typescript
PATCH /profile/{userId}/display-picture
```
**Content-Type:** `multipart/form-data`
**Request Body:** FormData with `displayPicture` file

### 7. Remove Display Picture
```typescript
DELETE /profile/{userId}/display-picture
```

### 8. Delete Profile
```typescript
DELETE /profile/{userId}
```

## 🎨 Portfolio Management

### 1. Create Portfolio
```typescript
POST /portfolio/
```
**Content-Type:** `multipart/form-data`

### 2. Get My Portfolios
```typescript
GET /portfolio/my
```

### 3. Get Portfolio by ID
```typescript
GET /portfolio/{id}
```

### 4. Update Portfolio
```typescript
PATCH /portfolio/{id}
```
**Content-Type:** `multipart/form-data`

### 5. Delete Portfolio
```typescript
DELETE /portfolio/{id}
```

### 6. Get All Portfolios
```typescript
GET /portfolio/all
```
**Query Parameters:**
- `page?: number`
- `limit?: number`
- `cursor?: string`

## 🛠️ Service Offerings

### 1. Create Service
```typescript
POST /service/
```
**Content-Type:** `multipart/form-data`

### 2. Get My Services
```typescript
GET /service/my
```

### 3. Get Service by ID
```typescript
GET /service/{id}
```

### 4. Update Service
```typescript
PATCH /service/{id}
```
**Content-Type:** `multipart/form-data`

### 5. Delete Service
```typescript
DELETE /service/{id}
```

### 6. Get All Services
```typescript
GET /service/all
```
**Query Parameters:**
- `page?: number`
- `limit?: number`
- `cursor?: string`

## 📋 Service Requests

### 1. Create Service Request
```typescript
POST /service-request/
```
**Content-Type:** `multipart/form-data`

### 2. Get My Service Requests
```typescript
GET /service-request/my
```

### 3. Get Service Request by ID
```typescript
GET /service-request/{id}
```

### 4. Update Service Request
```typescript
PATCH /service-request/{id}
```
**Content-Type:** `multipart/form-data`

### 5. Delete Service Request
```typescript
DELETE /service-request/{id}
```

### 6. Get All Service Requests
```typescript
GET /service-request/all
```
**Query Parameters:**
- `page?: number`
- `limit?: number`
- `cursor?: string`

### 7. Assign Planner
```typescript
POST /service-request/{id}/assign-planner
```
**Request Body:**
```typescript
{
  plannerId: string
}
```

### 8. Update Status
```typescript
PATCH /service-request/{id}/status
```
**Request Body:**
```typescript
{
  status: string
}
```

## 🏢 Vendor Service Requests

### 1. Create Vendor Service Request
```typescript
POST /vendor-service-request/
```
**Content-Type:** `multipart/form-data`

### 2. Get My Vendor Service Requests
```typescript
GET /vendor-service-request/my
```

### 3. Get Vendor Service Request by ID
```typescript
GET /vendor-service-request/{id}
```

### 4. Update Vendor Service Request
```typescript
PATCH /vendor-service-request/{id}
```
**Content-Type:** `multipart/form-data`

### 5. Delete Vendor Service Request
```typescript
DELETE /vendor-service-request/{id}
```

### 6. Respond to Service Request
```typescript
POST /vendor-service-request/{id}/respond
```
**Request Body:**
```typescript
{
  response: string
  proposedDate?: string
  proposedPrice?: number
}
```

## 💰 Bidding System

### 1. Create Bid
```typescript
POST /bid/
```
**Content-Type:** `multipart/form-data`

### 2. Get My Bids
```typescript
GET /bid/my
```

### 3. Get Bid by ID
```typescript
GET /bid/{id}
```

### 4. Update Bid
```typescript
PATCH /bid/{id}
```
**Content-Type:** `multipart/form-data`

### 5. Delete Bid
```typescript
DELETE /bid/{id}
```

### 6. Accept Bid
```typescript
POST /bid/{id}/accept
```

### 7. Reject Bid
```typescript
POST /bid/{id}/reject
```

## 📝 Vendor Responses

### 1. Create Vendor Response
```typescript
POST /vendor-response/
```
**Content-Type:** `multipart/form-data`

### 2. Get My Vendor Responses
```typescript
GET /vendor-response/my
```

### 3. Get Vendor Response by ID
```typescript
GET /vendor-response/{id}
```

### 4. Update Vendor Response
```typescript
PATCH /vendor-response/{id}
```
**Content-Type:** `multipart/form-data`

### 5. Delete Vendor Response
```typescript
DELETE /vendor-response/{id}
```

## ⭐ Rating & Reviews

### 1. Create Rating
```typescript
POST /rating/
```
**Request Body:**
```typescript
{
  targetUserId: string
  targetUserType: 'client' | 'vendor'
  serviceRequestId?: string
  rating: number // 1-5
  review: string
}
```

### 2. Get My Ratings
```typescript
GET /rating/my
```

### 3. Get Rating by ID
```typescript
GET /rating/{id}
```

### 4. Update Rating
```typescript
PATCH /rating/{id}
```

### 5. Delete Rating
```typescript
DELETE /rating/{id}
```

### 6. Get User Ratings
```typescript
GET /rating/user/{userId}
```

## 💬 Messaging System

### 1. Send Message
```typescript
POST /message/send
```
**Request Body:**
```typescript
{
  recipientId: string
  message: string
  messageType?: 'text' | 'image' | 'file'
}
```

### 2. Get Messages
```typescript
GET /message/conversation/{conversationId}
```

### 3. Get My Conversations
```typescript
GET /message/conversations
```

### 4. Mark Message as Read
```typescript
PATCH /message/{messageId}/read
```

### 5. Get Message Stats
```typescript
GET /message/stats
```

### 6. Search Messages
```typescript
GET /message/search
```
**Query Parameters:**
- `query: string`
- `conversationId?: string`

### 7. Edit Message
```typescript
PATCH /message/{messageId}
```

### 8. Delete Message
```typescript
DELETE /message/{messageId}
```

## 📅 Meeting Management

### 1. Create Meeting
```typescript
POST /meeting/
```
**Request Body:**
```typescript
{
  title: string
  description?: string
  startTime: string // ISO datetime
  endTime: string // ISO datetime
  location?: string
  meetingType: 'in-person' | 'virtual'
  attendees: string[] // User IDs
  serviceRequestId?: string
}
```

### 2. Get My Meetings
```typescript
GET /meeting/my
```

### 3. Get Meeting by ID
```typescript
GET /meeting/{id}
```

### 4. Update Meeting
```typescript
PATCH /meeting/{id}
```

### 5. Delete Meeting
```typescript
DELETE /meeting/{id}
```

### 6. Respond to Meeting
```typescript
POST /meeting/{id}/respond
```
**Request Body:**
```typescript
{
  response: 'accepted' | 'declined' | 'tentative'
  message?: string
}
```

### 7. Check Meeting Conflicts
```typescript
POST /meeting/check-conflicts
```
**Request Body:**
```typescript
{
  startTime: string
  endTime: string
  attendees: string[]
  excludeMeetingId?: string
}
```

### 8. Get Meeting Stats
```typescript
GET /meeting/stats
```

## 📊 Progress Tracking

### 1. Create Progress Tracker
```typescript
POST /progress-tracker/
```
**Request Body:**
```typescript
{
  serviceRequestId: string
  title: string
  description?: string
  startDate: string
  endDate?: string
  status: 'not-started' | 'in-progress' | 'completed' | 'on-hold'
}
```

### 2. Get Progress Trackers
```typescript
GET /progress-tracker/service-request/{serviceRequestId}
```

### 3. Update Progress Tracker
```typescript
PATCH /progress-tracker/{id}
```

### 4. Delete Progress Tracker
```typescript
DELETE /progress-tracker/{id}
```

### 5. Create Deliverable
```typescript
POST /deliverable/
```
**Content-Type:** `multipart/form-data`

### 6. Get Deliverables
```typescript
GET /deliverable/progress-tracker/{progressTrackerId}
```

### 7. Update Deliverable
```typescript
PATCH /deliverable/{id}
```
**Content-Type:** `multipart/form-data`

### 8. Delete Deliverable
```typescript
DELETE /deliverable/{id}
```

## 🏷️ Category Management

### 1. Create Category
```typescript
POST /category/
```
**Request Body:**
```typescript
{
  name: string
  description?: string
  parentCategoryId?: string
  isActive: boolean
}
```

### 2. Get Categories
```typescript
GET /category/
```

### 3. Get Category by ID
```typescript
GET /category/{id}
```

### 4. Update Category
```typescript
PATCH /category/{id}
```

### 5. Delete Category
```typescript
DELETE /category/{id}
```

### 6. Get Category Hierarchy
```typescript
GET /category/hierarchy
```

### 7. Get Main Categories
```typescript
GET /category/main
```

## 🔧 API Client Usage

### Basic Usage Example
```typescript
import { authAPI, profileAPI, serviceAPI } from '@/lib/api'

// Login
const loginResponse = await authAPI.login({
  email: 'user@example.com',
  password: 'Password123!'
})

// Get profile
const profileResponse = await profileAPI.me()

// Create service
const formData = new FormData()
formData.append('title', 'My Service')
formData.append('description', 'Service description')
formData.append('media', file)

const serviceResponse = await serviceAPI.create(formData)
```

### Error Handling
```typescript
try {
  const response = await authAPI.login(credentials)
  // Handle success
} catch (error: any) {
  if (error.response?.status === 422) {
    // Validation error
    console.error('Validation failed:', error.response.data.message)
  } else if (error.response?.status === 403) {
    // Access denied
    console.error('Access denied:', error.response.data.message)
  } else {
    // Other errors
    console.error('Request failed:', error.message)
  }
}
```

## 🔐 Authentication Flow

1. **Login/Register** → Get `accessToken` and `refreshToken`
2. **Store tokens** in localStorage and cookies
3. **API requests** automatically include `Authorization: Bearer <token>`
4. **Token refresh** happens automatically when access token expires
5. **Logout** clears all stored tokens

## 📱 Frontend Integration

All endpoints are integrated with:
- ✅ **React Components** - Form handling and UI updates
- ✅ **Custom Hooks** - State management and API calls
- ✅ **Error Handling** - User-friendly error messages
- ✅ **Loading States** - UI feedback during API calls
- ✅ **File Uploads** - Multipart form data support
- ✅ **Pagination** - Cursor-based pagination
- ✅ **Real-time Updates** - WebSocket integration

## 🚀 Test Credentials

Use these credentials for testing:

```typescript
// Client Account
{
  email: 'client@test.com',
  password: 'Client123!',
  accountType: 'individual'
}

// Vendor Account  
{
  email: 'vendor@test.com',
  password: 'Vendor123!',
  accountType: 'vendor'
}

// Admin Account
{
  email: 'admin@test.com', 
  password: 'Admin123!',
  accountType: 'admin'
}
```

## 📚 Additional Resources

- [API Configuration Guide](./API_CONFIGURATION.md)
- [Authentication Fixes Summary](./AUTHENTICATION_FIXES_SUMMARY.md)
- [Comprehensive API Integration Summary](./COMPREHENSIVE_API_INTEGRATION_SUMMARY.md)
- [Profile Picture Upload Implementation](./PROFILE_PICTURE_UPLOAD_IMPLEMENTATION.md)

---

**Total Endpoints Implemented: 80+**  
**Categories Covered: 12**  
**Authentication: ✅ Complete**  
**File Uploads: ✅ Complete**  
**Real-time Features: ✅ Complete**
