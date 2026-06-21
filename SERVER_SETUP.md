# Server Setup Guide

## Backend Setup

### Directory Structure
```
backend/
├── models/          - Mongoose schemas
├── routes/          - API routes
├── middleware/      - Authentication
├── scripts/         - Utility scripts
├── server.js        - Main server file
└── package.json     - Dependencies
```

### Installation Steps
1. `cd backend`
2. `npm install`
3. Create `.env` file with:
   ```
   PORT=5000
   MONGO_URI=mongodb://127.0.0.1:27017/sqli_guardian
   JWT_SECRET=your_secret_key
   ```
4. `npm start`

### Models
- User - User accounts and authentication
- QueryLog - Query analysis history

### Routes
- /api/auth - Authentication endpoints
- /api/detect - SQL injection detection
- /api/payloads - Payload library
- /api/profile - User profile
