# README - Server Setup

## Overview
SQLi-Guardian Backend Setup Documentation

## Prerequisites
- Node.js 16+
- MongoDB 5+
- npm or yarn

## Installation
1. Navigate to backend directory: `cd backend`
2. Install dependencies: `npm install`
3. Configure .env file with MongoDB URI
4. Start server: `npm start` or `npm run dev`

## API Endpoints
- POST /api/auth/register - Register user
- POST /api/auth/login - Login user
- POST /api/detect - Analyze SQL query
- GET /api/payloads - Get payload library
- GET /api/profile - Get user profile

## Database
MongoDB collections:
- users
- querylogs

## Server Port
Default: 5000
Configurable via PORT in .env
