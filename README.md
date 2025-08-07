# Event Hub

A comprehensive platform connecting clients with event vendors for seamless event planning and booking.

## Features

- **Vendor Discovery**: Browse and search for event vendors by category, location, and price
- **User Authentication**: Secure login/registration with Google OAuth and email/password
- **Role-based Dashboards**: Separate interfaces for clients, vendors, and administrators
- **Booking System**: Complete booking flow with calendar integration and payment tracking
- **Real-time Chat**: In-app messaging between clients and vendors
- **Service Requests**: Clients can post service requirements for vendors to respond to
- **Portfolio Management**: Vendors can showcase their work with image galleries
- **Review System**: Client feedback and rating system for vendors

## Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS
- **Authentication**: Firebase Auth
- **State Management**: React Hooks
- **API Integration**: Axios
- **Development**: ESLint, Prettier

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Firebase project (for authentication)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd event-hub
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
Copy the `.env.example` to `.env.local` and fill in your values:
```bash
cp .env .env.local
```

4. Configure Firebase:
- Create a Firebase project
- Enable Authentication with Google and Email/Password providers
- Add your Firebase config to the environment variables

5. Run the development server:
```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

```
event-hub/
├── app/                    # Next.js App Router pages
│   ├── auth/              # Authentication pages
│   ├── booking/           # Booking-related pages
│   ├── chat/              # Messaging interface
│   ├── dashboard/         # User dashboards
│   ├── services/          # Service request posting
│   └── vendors/           # Vendor directory and profiles
├── components/            # Reusable React components
│   ├── auth/              # Authentication components
│   ├── booking/           # Booking-related components
│   ├── chat/              # Chat components
│   ├── ui/                # General UI components
│   └── vendor/            # Vendor-specific components
├── hooks/                 # Custom React hooks
├── lib/                   # Utility functions and API calls
├── public/                # Static assets
├── styles/                # Global styles and Tailwind config
└── types/                 # TypeScript type definitions
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Environment Variables

Required environment variables:

```
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_FIREBASE_API_KEY=your-firebase-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXTAUTH_SECRET=your-nextauth-secret
NEXTAUTH_URL=http://localhost:3000
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.