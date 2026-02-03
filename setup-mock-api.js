#!/usr/bin/env node

/**
 * Mock API Server Setup Script
 * This script sets up a mock API server for testing the frontend
 */

const fs = require('fs');
const path = require('path');

console.log('🚀 Setting up Mock API Server for Event Hub...\n');

// Create mock database
const mockDb = {
  "categories": [
    {
      "id": "1",
      "name": "Photography",
      "description": "Professional photography services",
      "isActive": true,
      "createdAt": "2024-01-01T00:00:00Z",
      "updatedAt": "2024-01-01T00:00:00Z"
    },
    {
      "id": "2", 
      "name": "Catering",
      "description": "Food and beverage services",
      "isActive": true,
      "createdAt": "2024-01-01T00:00:00Z",
      "updatedAt": "2024-01-01T00:00:00Z"
    },
    {
      "id": "3",
      "name": "Music",
      "description": "Live music and entertainment",
      "isActive": true,
      "createdAt": "2024-01-01T00:00:00Z",
      "updatedAt": "2024-01-01T00:00:00Z"
    },
    {
      "id": "4",
      "name": "Event Planning",
      "description": "Complete event planning services",
      "isActive": true,
      "createdAt": "2024-01-01T00:00:00Z",
      "updatedAt": "2024-01-01T00:00:00Z"
    }
  ],
  "users": [
    {
      "id": "1",
      "firstName": "John",
      "lastName": "Doe",
      "email": "john@example.com",
      "accountType": "individual",
      "isEmailVerified": true,
      "displayName": "John Doe",
      "createdAt": "2024-01-01T00:00:00Z",
      "updatedAt": "2024-01-01T00:00:00Z"
    }
  ],
  "profiles": [],
  "serviceRequests": [
    {
      "id": "1",
      "eventTitle": "Wedding Reception",
      "eventType": "wedding",
      "eventStartDate": "2024-06-15",
      "eventEndDate": "2024-06-15",
      "eventLocation": "Grand Hotel",
      "eventCity": "New York",
      "servicesNeeded": ["catering", "photography"],
      "numberOfGuests": 150,
      "budgetRange": "5000-10000",
      "status": "open",
      "createdAt": "2024-01-01T00:00:00Z",
      "updatedAt": "2024-01-01T00:00:00Z"
    }
  ],
  "meetings": [],
  "messages": [],
  "bids": [],
  "ratings": [],
  "stats": {
    "serviceRequests": {
      "totalRequests": 1,
      "openRequests": 1,
      "inProgressRequests": 0,
      "completedRequests": 0,
      "cancelledRequests": 0
    }
  },
  "health": {
    "status": "ok",
    "timestamp": new Date().toISOString()
  }
};

// Create routes configuration
const routes = {
  "/api/v1/categories/main": "/categories",
  "/api/v1/categories/hierarchy": "/categories",
  "/api/v1/auth/me": "/users/1",
  "/api/v1/service-requests/stats": "/stats/serviceRequests",
  "/api/v1/message/health": "/health",
  "/api/v1/service-requests/": "/serviceRequests",
  "/api/v1/service-requests/my": "/serviceRequests",
  "/api/v1/service-requests/open": "/serviceRequests",
  "/api/v1/meetings/": "/meetings",
  "/api/v1/meetings/my": "/meetings",
  "/api/v1/message/conversations": "/messages"
};

// Create CORS middleware
const corsMiddleware = `
const cors = (req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
};

module.exports = cors;
`;

// Create package.json for mock server
const packageJson = {
  "name": "eventhub-mock-api",
  "version": "1.0.0",
  "description": "Mock API server for Event Hub frontend testing",
  "main": "server.js",
  "scripts": {
    "start": "json-server --watch mock-db.json --port 3001 --routes routes.json --middlewares cors.js",
    "dev": "json-server --watch mock-db.json --port 3001 --routes routes.json --middlewares cors.js"
  },
  "dependencies": {
    "json-server": "^0.17.4"
  }
};

// Create server startup script
const serverScript = `
const jsonServer = require('json-server');
const cors = require('./cors');

const server = jsonServer.create();
const router = jsonServer.router('mock-db.json');
const middlewares = jsonServer.defaults();

server.use(cors);
server.use(middlewares);
server.use('/api/v1', router);

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log('🚀 Mock API Server is running on port', PORT);
  console.log('📡 API Base URL: http://localhost:' + PORT + '/api/v1');
  console.log('🌐 WebSocket URL: ws://localhost:' + PORT + '/ws');
  console.log('\\n📋 Available endpoints:');
  console.log('   GET  /api/v1/categories/main');
  console.log('   GET  /api/v1/auth/me');
  console.log('   GET  /api/v1/service-requests/stats');
  console.log('   GET  /api/v1/message/health');
  console.log('\\n✨ Ready for frontend testing!');
});
`;

try {
  // Create mock server directory
  const mockDir = path.join(__dirname, 'mock-api-server');
  if (!fs.existsSync(mockDir)) {
    fs.mkdirSync(mockDir);
  }

  // Write files
  fs.writeFileSync(path.join(mockDir, 'mock-db.json'), JSON.stringify(mockDb, null, 2));
  fs.writeFileSync(path.join(mockDir, 'routes.json'), JSON.stringify(routes, null, 2));
  fs.writeFileSync(path.join(mockDir, 'cors.js'), corsMiddleware);
  fs.writeFileSync(path.join(mockDir, 'package.json'), JSON.stringify(packageJson, null, 2));
  fs.writeFileSync(path.join(mockDir, 'server.js'), serverScript);

  console.log('✅ Mock API server files created successfully!');
  console.log('📁 Files created in: ./mock-api-server/');
  console.log('\n🔧 Next steps:');
  console.log('1. cd mock-api-server');
  console.log('2. npm install');
  console.log('3. npm start');
  console.log('\n📝 Update your .env.local file:');
  console.log('NEXT_PUBLIC_API_URL=http://localhost:3001');
  console.log('NEXT_PUBLIC_WS_URL=ws://localhost:3001/ws');
  console.log('\n🎯 Then run: node test-api-connection.js');

} catch (error) {
  console.error('❌ Error setting up mock API:', error.message);
}
