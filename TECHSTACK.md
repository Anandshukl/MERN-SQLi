# Technology Stack

## Backend

### Runtime & Framework
- **Node.js** - JavaScript runtime
- **Express.js** `^4.19.2` - Web application framework
- **Nodemon** `^3.1.0` - Development server auto-reload

### Database
- **MongoDB** - NoSQL document database
- **Mongoose** `^8.3.1` - MongoDB object modeling and schema validation

### Authentication & Security
- **JSON Web Tokens (JWT)** `^9.0.2` - Token-based authentication
- **bcryptjs** `^2.4.3` - Password hashing and verification
- **CORS** `^2.8.5` - Cross-Origin Resource Sharing middleware

### Environment & Configuration
- **dotenv** `^16.4.5` - Environment variable management

## Frontend

### Framework & Build Tool
- **React** `^18.2.0` - UI library for building components
- **Vite** `^5.2.0` - Fast module bundler and dev server
- **@vitejs/plugin-react** `^4.2.1` - Vite plugin for React

### UI & Icons
- **lucide-react** `^0.372.0` - Modern icon library for React

### Type Safety (Development)
- **@types/react** `^18.2.66` - TypeScript definitions for React
- **@types/react-dom** `^18.2.22` - TypeScript definitions for React DOM

## Key Features by Stack

### Backend Architecture
- RESTful API design
- Middleware-based request handling
- JWT-based authentication flow
- MongoDB connection pooling via Mongoose

### Frontend Architecture
- Component-based React application
- Vite for optimized production builds
- Environment-based API URL configuration
- localStorage for token persistence

## Database Schema

### User Model
- Username (unique, lowercase)
- Password (hashed with bcrypt)
- Timestamps (created, updated)

### QueryLog Model
- Query text
- Detection result (safe/vulnerable/suspicious)
- ML confidence score
- User reference
- Timestamps

## SQL Injection Detection

### Detection Method
- Rule-based pattern matching
- Regex patterns for common injection techniques
- Severity classification (critical, high, medium, low)
- Confidence scoring algorithm

### Supported Attack Patterns
- Tautology attacks (OR 1=1)
- String tautology attacks
- UNION SELECT injections
- Time-based blind injections (SLEEP, WAITFOR DELAY, BENCHMARK)
- Stacked queries with destructive commands
- Command execution (EXEC, EXECUTE)
- Information schema enumeration
- File operations (LOAD_FILE, INTO OUTFILE)
- Server variable enumeration

## Development Commands

### Backend
```bash
npm install        # Install dependencies
npm start         # Production server
npm run dev       # Development with nodemon
npm run seed      # Seed database
```

### Frontend
```bash
npm install       # Install dependencies
npm run dev       # Development server (Vite)
npm run build     # Production build
npm run preview   # Preview production build
```

## Environment Configuration

### Backend (.env)
- `PORT` - Server listening port
- `MONGO_URI` - MongoDB connection string
- `JWT_SECRET` - JWT signing secret
- `ML_SERVICE_URL` - Optional ML service URL (future use)

### Frontend (.env.production)
- `VITE_API_URL` - Backend API base URL for production

## Production Deployment

### Backend
- Node.js 18+ runtime required
- MongoDB Atlas or local instance
- Environment variables configured
- Serves static frontend build from `/frontend/dist`

### Frontend
- Built with `npm run build` in `/frontend`
- Output to `/frontend/dist`
- Served by backend as static files
- API calls routed to `VITE_API_URL`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Create new account
- `POST /api/auth/login` - Login with credentials
- `GET /api/auth/me` - Get current user (requires token)

### Detection
- `POST /api/detect` - Analyze SQL query for injection
- `GET /api/detect/history` - Fetch user's query history
- `GET /api/detect/stats` - Fetch detection statistics

### Resources
- `GET /api/payloads` - Fetch injection payload library
- `GET /api/profile` - Fetch project profile information

## Version Information
- Node.js: v18+
- npm: v8+
- MongoDB: v4.4+
