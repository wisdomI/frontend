# Test Credentials for EventHub App

## 🔐 **Login Credentials**

Use these credentials to test different parts of the application:

### **Vendor Dashboard Access**
```
Email: vendor@test.com
Password: Vendor123!
Role: Vendor
```

### **Client Dashboard Access**
```
Email: client@test.com
Password: Client123!
Role: Client
```

### **Admin Access**
```
Email: admin@test.com
Password: Admin123!
Role: Admin
```

## 🚀 **How to Use**

1. **Go to Login Page**: Navigate to `/auth/login`
2. **Select Account Type**: Choose "Event Vendor" for vendor access or "Individual/Org" for client access
3. **Enter Credentials**: Use any of the credentials above
4. **Click Login**: You'll be automatically redirected to the appropriate dashboard

### **Automatic Redirects After Login**
- **Vendor users** → `/vendor` (vendor dashboard)
- **Client users** → `/client/dashboard` (client dashboard)
- **Admin users** → `/dashboard/admin` (admin dashboard)
- **With redirect parameter** → Goes to the originally requested page

## 📱 **What You Can Access**

### **With Vendor Credentials (`vendor@test.com`)**
- ✅ Vendor Dashboard (`/vendor`)
- ✅ Profile Setup (`/vendor/profile-setup`)
- ✅ Manage Bookings (`/vendor/manage-bookings`)
- ✅ Service Requests (`/vendor/service-requests`)
- ✅ Earnings & Analytics (`/vendor/my-earnings`)
- ✅ All vendor-specific features

### **With Client Credentials (`client@test.com`)**
- ✅ Client Dashboard (`/client/dashboard`) - Service request posts and bids management
- ✅ Profile Settings (`/client/profile-settings`) - User profile management
- ✅ All client pages organized under `/client/` with persistent sidebar
- ✅ Post Service Requests (Quick Actions)
- ✅ Browse Vendors (`/vendors`)
- ✅ Manage Bookings (`/booking`)
- ✅ Chat functionality

### **With Admin Credentials (`admin@test.com`)**
- ✅ Admin Dashboard (if implemented)
- ✅ All client and vendor features

## 🔄 **Profile Switching**

Once logged in, you can:
- Use the profile dropdown to switch between roles
- Access different dashboards based on your role
- Test the complete user flow

## 📝 **Notes**

- **Session Persistence**: Your login session will persist until you log out
- **Mock Data**: All data is currently mock data for testing purposes
- **Profile Setup**: Vendors will be redirected to profile setup if not completed
- **Role-based Access**: Each role has access to different features

## 🛠 **Development Notes**

- Authentication is currently mocked using localStorage
- No real backend API calls are made
- All user data is stored locally in the browser
- To reset authentication, clear localStorage or use incognito mode

## 🚨 **Troubleshooting**

If you can't access certain features:
1. Make sure you're using the correct credentials
2. Check that you selected the right account type on login
3. Clear localStorage and try again
4. Use incognito/private browsing mode

### **Firebase Error Fix**
If you see "Firebase not configured" error:
- ✅ **FIXED**: The app now uses mock authentication instead of Firebase
- No environment variables needed for testing
- All authentication is handled locally

### **Login Redirect Fix**
If login shows success but doesn't redirect:
- ✅ **FIXED**: Added direct redirect logic in login form
- Automatic redirect after 500ms delay
- All dashboard pages now exist and are accessible
- **Simplified**: Now uses window.location.href directly for more reliable redirect
- **Removed**: Complex router fallback logic that was causing issues
- **CRITICAL FIX**: Added cookie setting for middleware authentication
- **CRITICAL FIX**: Middleware was blocking redirects because it couldn't find auth cookies
- **DEBUGGING**: Added console logs to track profile completion status
- **DEBUGGING**: Added logs to vendor layout and dashboard to track redirect logic
- **TEMPORARY FIX**: Profile setup completion check is now disabled for testing
- **TEMPORARY FIX**: Vendor dashboard works without requiring profile setup completion
- **FIXED**: Login page no longer redirects to dashboard when page loads with existing user
- **FIXED**: Added `justLoggedIn` flag to prevent unwanted redirects on page load
- **NEW**: Vendors can now rate clients in the Rating & Reviews page
- **NEW**: Response button now works and shows responses properly
- **NEW**: Vendors cannot edit reviews once submitted (read-only)
- **NEW**: Added "Vendor Rated" tab to filter reviews by vendor ratings
- **IMPROVED**: Responses now appear immediately in the review after submission
- **NEW**: Header now shows logged-in client interface with notifications, messages, and profile dropdown
- **NEW**: "My Profile" page for clients to manage personal information
- **NEW**: Profile dropdown includes "My Profile" link and improved navigation
- **NEW**: Logout functionality implemented in profile dropdown and profile page
- **NEW**: Logout clears authentication state and redirects to home page
- **DEBUGGING**: Added extensive console logs to track logout process
- **DEBUGGING**: Added logs to signOutUser, notifyAuthStateChange, and logout handlers
- **NEW**: Client dashboard layout with sidebar navigation (matches image reference)
- **NEW**: "Manage Bids" page with service request posts and offers
- **NEW**: Simplified header with profile picture navigation to "My Profile"
- **NEW**: Logout button moved to navbar (not in dropdown)
- **NEW**: Sidebar includes all menu options: Profile Settings, Manage Bids, Manage Bookings, etc.
- **REVAMPED**: `/client` now matches the uploaded image reference
- **REVAMPED**: Global header and footer remain, sidebar navigation added
- **REVAMPED**: Service request posts with tabs, cards, and pagination
- **FIXED**: Removed duplicate sidebars - now only one sidebar in the main content

---

**Happy Testing! 🎉**
