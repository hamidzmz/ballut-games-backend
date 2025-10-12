# Ballut Games Authentication Service

Backend authentication service with JWT, refresh tokens, and token blacklisting for Ballut Games.

## Tech Stack

- Node.js & Express.js
- MongoDB & Mongoose
- JWT (JSON Web Tokens)
- Refresh Token mechanism
- Token Blacklisting for logout
- bcrypt for password hashing
- Swagger/OpenAPI documentation
- Docker & Docker Compose for containerization

## Quick Start with Docker (Recommended)

The easiest way to run the application is using Docker Compose, which sets up both the Node.js application and MongoDB automatically.

### Prerequisites
- Docker
- Docker Compose

### Production Mode

```bash
docker-compose up -d
```

This will:
- Build the Node.js application image
- Pull MongoDB image
- Start both services
- Application available at: http://localhost:3000
- API docs at: http://localhost:3000/api-docs

### Development Mode (with hot reload)

```bash
docker-compose -f docker-compose.dev.yml up
```

### Useful Docker Commands

```bash
# View logs
docker-compose logs -f app

# Stop services
docker-compose down

# Stop and remove volumes (deletes database data)
docker-compose down -v

# Rebuild after code changes
docker-compose up -d --build

# Access MongoDB shell
docker exec -it ballut-mongodb mongosh ballut_games
```

## Manual Installation (Without Docker)

```bash
npm install
```

### Configuration

Create a `.env` file in the root directory (only needed for manual installation):

```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/ballut_games
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
ACCESS_TOKEN_EXPIRES_IN=15m
REFRESH_TOKEN_EXPIRES_IN=7d
```

**Note:** 
- Access tokens are short-lived (15 minutes) for security, while refresh tokens last 7 days.
- When using Docker, environment variables are set in `docker-compose.yml`
- Make sure MongoDB is installed and running locally

### Running the Application

Development mode:
```bash
npm run dev
```

Production mode:
```bash
npm start
```

## API Documentation

Interactive API documentation is available at: **http://localhost:3000/api-docs**

You can test all endpoints directly from the Swagger UI.

## API Endpoints

### 1. Signup
**POST** `/api/auth/signup`

Request body:
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

Response:
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "userId": "65f1a2b3c4d5e6f7g8h9i0j1",
    "email": "user@example.com"
  }
}
```

### 2. Login
**POST** `/api/auth/login`

Request body:
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

Response:
```json
{
  "success": true,
  "message": "Login successful",
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "a1b2c3d4e5f6g7h8i9j0...",
  "data": {
    "userId": "65f1a2b3c4d5e6f7g8h9i0j1",
    "email": "user@example.com"
  }
}
```

### 3. Refresh Access Token
**POST** `/api/auth/refresh`

Request body:
```json
{
  "refreshToken": "a1b2c3d4e5f6g7h8i9j0..."
}
```

Response:
```json
{
  "success": true,
  "message": "Access token refreshed successfully",
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### 4. Logout
**POST** `/api/auth/logout`

Headers:
```
Authorization: Bearer <your_access_token>
```

Request body (optional):
```json
{
  "refreshToken": "a1b2c3d4e5f6g7h8i9j0..."
}
```

Response:
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

### 5. Test JWT
**GET** `/api/auth/test`

Headers:
```
Authorization: Bearer <your_jwt_token>
```

Response:
```json
{
  "success": true,
  "message": "Token is valid",
  "user": {
    "userId": "65f1a2b3c4d5e6f7g8h9i0j1",
    "email": "user@example.com"
  }
}
```

## Project Structure

```
ballut-games-backend/
├── src/
│   ├── config/
│   │   ├── database.js
│   │   └── swagger.js
│   ├── controllers/
│   │   └── authController.js
│   ├── middleware/
│   │   └── authMiddleware.js
│   ├── models/
│   │   ├── User.js
│   │   ├── RefreshToken.js
│   │   └── TokenBlacklist.js
│   ├── routes/
│   │   └── authRoutes.js
│   └── app.js
├── .env
├── .env.example
├── .gitignore
├── package.json
└── README.md
```

## Features

- **JWT Authentication** with short-lived access tokens (15 minutes)
- **Refresh Token** mechanism for obtaining new access tokens (7 days validity)
- **Token Blacklisting** for secure logout functionality
- **Database Indexes** on critical fields for optimal query performance
- **Automatic Token Cleanup** using MongoDB TTL indexes
- **Password Hashing** with bcrypt
- **Input Validation** with express-validator
- **Swagger Documentation** with interactive API testing

## Testing with cURL

**1. Signup:**
```bash
curl -X POST http://localhost:3000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

**2. Login:**
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```
Save the `accessToken` and `refreshToken` from the response.

**3. Test JWT:**
```bash
curl -X GET http://localhost:3000/api/auth/test \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

**4. Refresh Access Token:**
```bash
curl -X POST http://localhost:3000/api/auth/refresh \
  -H "Content-Type: application/json" \
  -d '{"refreshToken":"YOUR_REFRESH_TOKEN"}'
```

**5. Logout:**
```bash
curl -X POST http://localhost:3000/api/auth/logout \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"refreshToken":"YOUR_REFRESH_TOKEN"}'
```

## How It Works

### Authentication Flow:
1. User signs up with email/password → Account created
2. User logs in → Receives short-lived access token (15 min) + long-lived refresh token (7 days)
3. User makes authenticated requests using access token in Authorization header
4. When access token expires → Use refresh token to get new access token
5. User logs out → Access token blacklisted, refresh token deleted from database

### Security Features:
- Access tokens expire quickly (15 minutes) to minimize damage if compromised
- Refresh tokens are stored in database and can be revoked
- Logout blacklists the current access token until it naturally expires
- MongoDB TTL indexes automatically delete expired tokens from database
- Passwords are hashed with bcrypt before storage
- Email addresses are normalized and validated
