
🚀 MenteCart Backend
A production-oriented service booking backend built with Node.js, Express, TypeScript, and MongoDB.
This backend powers the MenteCart platform, handling authentication, service management, carts, bookings, and booking lifecycle operations with proper business rule enforcement and scalable architecture.

───

✨ Features
• 🔐 JWT Authentication & Authorization
• 👤 User Registration & Login
• 🛠 Service Catalog Management
• 🛒 Cart System with Slot Selection
• 📅 Booking Management Workflow
• 🚫 Overbooking Prevention
• 📦 RESTful API Architecture
• 🧾 Centralized Error Handling
• 🧪 Validation Layer


───

🧱 Tech Stack

Technology
Usage

Node.js
Runtime

Express.js
Backend Framework

TypeScript
Language

MongoDB
Database

Mongoose
ODM

JWT
Authentication

bcrypt
Password Hashing

Zod / Joi
Validation

Winston / Pino
Logging



───

📁 Project Structure
Overview
MenteCart Backend powers the service-booking platform for managing authentication, services, carts, bookings, and booking lifecycle operations.
Built with:
• Node.js
• Express.js
• TypeScript
• MongoDB + Mongoose
• JWT Authentication
The backend is designed using layered architecture with clear separation between controllers, services, repositories, validation, and middleware.

───

Features
Authentication
• User signup/login
• JWT authentication
• Password hashing using bcrypt
• Protected routes
Services
• Paginated service listing
• Category filtering
• Search by title
• Service detail retrieval
Cart Management
• Add services with time slots
• Prevent duplicate slot booking
• Update/remove cart items
• Cart total calculation
Booking System
• Convert cart into bookings
• Booking lifecycle management
• Cancellation support
• Capacity management
• Overbooking prevention using atomic operations
Error Handling
• Centralized error middleware
• Consistent API responses
• Validation layer using Zod/Joi

───

Tech Stack

Layer
Technology

Runtime
Node.js

Framework
Express.js

Language
TypeScript

Database
MongoDB

ODM
Mongoose

Authentication
JWT

Validation
Zod / Joi

Logging
Winston / Pino



───

Project Structure
bash
backend/
├── src/
│   ├── config/
│   ├── controllers/
│   ├── services/
│   ├── repositories/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   ├── validators/
│   ├── utils/
│   ├── types/
│   └── server.ts
├── .env
├── .env.example
├── package.json
└── tsconfig.json


───

Environment Variables
Create a .env file inside the backend folder.
env
PORT=5000
MONGO_URI=mongodb://localhost:27017/mentecart
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=1d
NODE_ENV=development


───

Installation
bash
cd backend
npm install


───

Running the Project
Development
bash
npm run dev

Production
bash
npm run build
npm start


───

API Endpoints
Authentication

Method
Endpoint
Description

POST
/auth/signup
Register user

POST
/auth/login
Login user

GET
/auth/me
Current user


Services

Method
Endpoint

GET
/services

GET
/services/:id


Cart

Method
Endpoint

GET
/cart

POST
/cart/items

PATCH
/cart/items/:itemId

DELETE
/cart/items/:itemId


Bookings

Method
Endpoint

POST
/bookings/checkout

GET
/bookings

GET
/bookings/:id

POST
/bookings/:id/cancel



───

Business Rules
• Maximum bookings per day per user
• Slot capacity enforcement
• Automatic slot release on cancellation
• Atomic booking operations
• Booking status lifecycle protection

───

Testing
Use Postman or Swagger to test APIs.
Suggested test cases:
• Invalid login
• Duplicate signup
• Overbooking prevention
• Slot conflict handling
• Booking cancellation
• Expired cart handling

───

Docker Support
bash
docker-compose up --build


───

Known Limitations
• Refresh tokens optional
• Payment gateway integration mocked
• No admin dashboard implemented

───

Future Improvements
• Redis for slot locking
• WebSocket notifications
• Payment gateway integration
• Admin analytics dashboard
• Automated testing pipeline

───

