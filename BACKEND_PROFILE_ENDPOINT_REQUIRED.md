# ⚠️ BACKEND: Missing Profile Endpoint - `/profile/me`

## 🚨 **Issue Identified**

The frontend is attempting to fetch the logged-in user's profile using:
```
GET /api/v1/profile/me
```

**Current Status**: ❌ **404 Not Found** - This endpoint is not implemented on the backend.

## 📊 **Error Details**

```
GET https://backend-a3nd.onrender.com/api/v1/profile/me 404 (Not Found)
⚠️ API Error 404: /profile/me Request failed with status code 404
```

**User Details:**
- User ID: `944c3d44-fd77-41ac-a198-d1626a902c6c`
- Account Type: `individual`
- Authentication: ✅ Valid token present

## 🎯 **Required Endpoint**

### **GET `/api/v1/profile/me`**

**Purpose**: Get the profile of the currently logged-in user based on their JWT token.

**Authentication**: Required (Bearer Token)

**Request Headers**:
```
Authorization: Bearer <JWT_TOKEN>
```

**Expected Response** (200 OK):
```json
{
  "success": true,
  "message": "Profile retrieved successfully",
  "data": {
    "id": "944c3d44-fd77-41ac-a198-d1626a902c6c",
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "phoneNumber": "+1234567890",
    "accountType": "individual",
    "displayPicture": "https://backend-a3nd.onrender.com/uploads/profiles/944c3d44-fd77-41ac-a198-d1626a902c6c.jpg",
    "bio": "...",
    "country": "Nigeria",
    "city": "Lagos",
    "address": "123 Main St",
    "createdAt": "2024-01-15T10:00:00Z",
    "updatedAt": "2024-01-20T15:30:00Z"
  }
}
```

**Key Fields**:
- `displayPicture`: **CRITICAL** - Frontend needs this to display user's profile picture
- `firstName`, `lastName`: For displaying user's name
- `email`, `phoneNumber`: For profile information
- `country`, `city`, `address`: For location details
- `bio`: For user description

## 🔧 **Backend Implementation Guide**

### **Node.js/Express Example**:

```javascript
// Route: GET /api/v1/profile/me
router.get('/profile/me', authenticate, async (req, res) => {
  try {
    // The authenticate middleware should attach user info to req.user
    const userId = req.user.id;
    
    // Fetch user profile from database
    const profile = await Profile.findOne({ where: { userId } });
    
    if (!profile) {
      return res.status(404).json({
        success: false,
        message: 'Profile not found'
      });
    }
    
    // Return profile data
    res.status(200).json({
      success: true,
      message: 'Profile retrieved successfully',
      data: profile
    });
    
  } catch (error) {
    console.error('Error fetching profile:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});
```

### **Key Points**:

1. **Extract User ID from JWT Token**
   - Don't require user ID in URL
   - Use `req.user.id` from authentication middleware
   
2. **Return Full Profile Data**
   - Include `displayPicture` field (most important!)
   - Include all user profile fields
   
3. **Handle Missing Profile**
   - Return 404 if profile doesn't exist
   - Or auto-create a profile if user exists

4. **Security**
   - Verify JWT token before processing
   - Only return data for the authenticated user
   - Don't expose sensitive fields (password, etc.)

## 🔄 **Alternative Endpoint (Currently Being Used as Fallback)**

The frontend is currently falling back to:
```
GET /api/v1/profile/:id
```

This works but is **NOT IDEAL** because:
- ❌ Less secure (exposes user IDs in URLs)
- ❌ Requires frontend to know user's ID
- ❌ More complex to implement
- ✅ Better to use `/me` endpoint that reads from JWT

## ⚡ **Current Frontend Workaround**

The frontend now has a fallback mechanism:
1. ✅ Try `GET /profile/me` first
2. ⚠️ If 404, fall back to `GET /profile/:id`
3. ❌ If both fail, show user initials

**This is a temporary solution. Please implement the `/profile/me` endpoint!**

## 📋 **Testing the Endpoint**

### **Using Postman**:

```
GET https://backend-a3nd.onrender.com/api/v1/profile/me

Headers:
  Authorization: Bearer <USER_JWT_TOKEN>
```

### **Expected Behavior**:

✅ **Success Case** (200):
- Returns user's profile data
- Includes `displayPicture` URL
- All fields properly populated

❌ **Error Cases**:
- 401: Invalid or missing token
- 404: Profile not found (shouldn't happen if user is authenticated)
- 500: Server error

## 🎯 **Priority**

**Priority**: 🔴 **HIGH**

**Why**:
- Profile pictures are a core UI feature
- Currently showing user initials instead of actual pictures
- Affects user experience significantly
- Multiple pages depend on this endpoint

**Pages Affected**:
- Main Header (all pages)
- Client Header (client pages)
- My Profile page
- Profile Settings page

## 📝 **Related Endpoints to Verify**

Please also ensure these profile endpoints work correctly:

1. ✅ `GET /profile/:id` - Get profile by user ID
2. ✅ `PATCH /profile/:id` - Update profile
3. ✅ `POST /profile/` - Create profile
4. ⚠️ `PATCH /profile/:id/display-picture` - Update display picture

## 🚀 **Next Steps**

1. **Implement** `GET /profile/me` endpoint on backend
2. **Test** endpoint returns correct data with `displayPicture`
3. **Deploy** to https://backend-a3nd.onrender.com
4. **Notify** frontend team when ready
5. **Verify** frontend displays profile pictures correctly

## 📞 **Questions?**

If you need clarification on:
- Expected response format
- Profile data structure
- Authentication middleware setup
- File upload for display pictures

Please reach out to the frontend team!

---

**Created**: Based on console error logs from client-side application
**User ID**: 944c3d44-fd77-41ac-a198-d1626a902c6c
**Account Type**: individual
**Endpoint**: GET /api/v1/profile/me
**Status**: 404 Not Found ❌

