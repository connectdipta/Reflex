# 🔌 Reflex API Documentation

<div align="center">

# Backend API Server

Comprehensive REST API documentation for the Reflex Mental Wellness Platform.

[📋 Endpoints](#-api-endpoints) • [🔐 Authentication](#-authentication) • [📊 Models](#-data-models) • [🚀 Best Practices](#-best-practices)

</div>

---

## 📖 Table of Contents

1. [Overview](#-overview)
2. [Getting Started](#-getting-started)
3. [API Endpoints](#-api-endpoints)
4. [Authentication](#-authentication)
5. [Data Models](#-data-models)
6. [Error Handling](#-error-handling)
7. [Rate Limiting](#-rate-limiting)
8. [Best Practices](#-best-practices)
9. [Troubleshooting](#-troubleshooting)

---

## 🎯 Overview

The Reflex API is built on Next.js API Routes, providing a RESTful interface for the frontend application. It handles all backend operations including user management, appointment scheduling, content delivery, authentication, and wellness tracking.

**API Base URL:**
```
Development: http://localhost:3000/api
Production: https://reflex-wellness.vercel.app/api
```

**Response Format:** All endpoints return JSON responses with consistent structure.

---

## 🚀 Getting Started

### Prerequisites
- Node.js 14+ installed
- MongoDB connection string
- Environment variables configured in `.env.local`
- Frontend running at `http://localhost:3000`

### Server Architecture
```
app/api/
├── [endpoint]/
│   └── route.js              # GET, POST, PUT, DELETE handlers
├── [endpoint]/
│   └── [id]/
│       └── route.js          # Dynamic ID routes
└── middleware/               # Shared middleware (if applicable)
```

### Testing API Endpoints

Using **cURL**:
```bash
curl -X GET http://localhost:3000/api/doctors \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

Using **Postman**:
1. Import the API collection
2. Set environment variables
3. Add Authorization header with Bearer token
4. Send requests

Using **Thunder Client** (VS Code):
- Install Thunder Client extension
- Create new collection
- Add endpoints with headers and body

---

## 📚 API Endpoints

### Authentication Endpoints

#### 1. **Signup** - Create New Account
```http
POST /api/auth/signup
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securePassword123",
  "role": "user"
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "message": "User created successfully",
  "user": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user",
    "createdAt": "2026-05-03T10:30:00Z"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Error (400 Bad Request):**
```json
{
  "success": false,
  "message": "User already exists with this email"
}
```

---

#### 2. **Login** - Authenticate User
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "securePassword123"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Login successful",
  "user": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

---

#### 3. **Google OAuth** - Sign in with Google
```http
POST /api/auth/google
Content-Type: application/json

{
  "idToken": "google_id_token_here"
}
```

**Response (200 OK / 201 Created):**
```json
{
  "success": true,
  "message": "Google authentication successful",
  "user": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "photoURL": "https://example.com/photo.jpg"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

---

### User Management Endpoints

#### 4. **Get All Users** (Admin)
```http
GET /api/users
Authorization: Bearer YOUR_JWT_TOKEN
```

**Response (200 OK):**
```json
{
  "success": true,
  "users": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "user",
      "createdAt": "2026-05-03T10:30:00Z",
      "lastLogin": "2026-05-03T11:00:00Z"
    },
    {
      "_id": "507f1f77bcf86cd799439012",
      "name": "Jane Smith",
      "email": "jane@example.com",
      "role": "psychiatrist",
      "createdAt": "2026-05-02T08:15:00Z"
    }
  ],
  "total": 2
}
```

---

#### 5. **Get User by ID**
```http
GET /api/users/507f1f77bcf86cd799439011
Authorization: Bearer YOUR_JWT_TOKEN
```

**Response (200 OK):**
```json
{
  "success": true,
  "user": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user",
    "phone": "+1-555-0123",
    "profileImage": "https://example.com/profile.jpg",
    "bio": "Mental health advocate",
    "preferences": {
      "newsletter": true,
      "notifications": true,
      "language": "en"
    },
    "createdAt": "2026-05-03T10:30:00Z"
  }
}
```

---

#### 6. **Update User Profile**
```http
PUT /api/users/507f1f77bcf86cd799439011
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json

{
  "name": "John Doe Updated",
  "phone": "+1-555-0123",
  "profileImage": "https://example.com/new-photo.jpg",
  "bio": "Updated bio",
  "preferences": {
    "newsletter": false,
    "notifications": true
  }
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "User updated successfully",
  "user": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "John Doe Updated",
    "email": "john@example.com",
    "phone": "+1-555-0123",
    "updatedAt": "2026-05-03T12:00:00Z"
  }
}
```

---

### Appointment Endpoints

#### 7. **Create Appointment**
```http
POST /api/appointments
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json

{
  "userId": "507f1f77bcf86cd799439011",
  "doctorId": "507f1f77bcf86cd799439012",
  "dateTime": "2026-05-10T14:30:00Z",
  "serviceType": "psychiatrist",
  "reason": "Depression consultation",
  "notes": "First time consultation"
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "message": "Appointment created successfully",
  "appointment": {
    "_id": "507f1f77bcf86cd799439020",
    "userId": "507f1f77bcf86cd799439011",
    "doctorId": "507f1f77bcf86cd799439012",
    "dateTime": "2026-05-10T14:30:00Z",
    "serviceType": "psychiatrist",
    "reason": "Depression consultation",
    "status": "pending",
    "createdAt": "2026-05-03T10:30:00Z"
  }
}
```

---

#### 8. **Get User Appointments**
```http
GET /api/appointments?userId=507f1f77bcf86cd799439011&status=pending
Authorization: Bearer YOUR_JWT_TOKEN
```

**Response (200 OK):**
```json
{
  "success": true,
  "appointments": [
    {
      "_id": "507f1f77bcf86cd799439020",
      "userId": "507f1f77bcf86cd799439011",
      "doctorId": "507f1f77bcf86cd799439012",
      "doctorName": "Dr. Jane Smith",
      "dateTime": "2026-05-10T14:30:00Z",
      "serviceType": "psychiatrist",
      "reason": "Depression consultation",
      "status": "confirmed",
      "meetingLink": "https://zoom.us/j/12345",
      "createdAt": "2026-05-03T10:30:00Z"
    }
  ],
  "total": 1
}
```

---

#### 9. **Update Appointment**
```http
PUT /api/appointments/507f1f77bcf86cd799439020
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json

{
  "status": "confirmed",
  "dateTime": "2026-05-10T15:00:00Z",
  "meetingLink": "https://zoom.us/j/12345"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Appointment updated successfully",
  "appointment": {
    "_id": "507f1f77bcf86cd799439020",
    "status": "confirmed",
    "dateTime": "2026-05-10T15:00:00Z",
    "updatedAt": "2026-05-03T11:00:00Z"
  }
}
```

---

#### 10. **Cancel Appointment**
```http
DELETE /api/appointments/507f1f77bcf86cd799439020
Authorization: Bearer YOUR_JWT_TOKEN
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Appointment cancelled successfully",
  "appointment": {
    "_id": "507f1f77bcf86cd799439020",
    "status": "cancelled"
  }
}
```

---

### Doctor Management Endpoints

#### 11. **Get All Doctors**
```http
GET /api/doctors?specialty=psychiatry&verified=true&limit=10&page=1
```

**Query Parameters:**
- `specialty` - Filter by specialty (psychiatry, psychology, counseling)
- `verified` - Filter by verification status (true/false)
- `limit` - Results per page (default: 10)
- `page` - Page number (default: 1)

**Response (200 OK):**
```json
{
  "success": true,
  "doctors": [
    {
      "_id": "507f1f77bcf86cd799439012",
      "name": "Dr. Jane Smith",
      "email": "jane@example.com",
      "specialty": "psychiatry",
      "qualifications": ["MD", "Board Certified Psychiatry"],
      "experience": 10,
      "bio": "Specializing in depression and anxiety disorders",
      "profileImage": "https://example.com/doctor1.jpg",
      "rating": 4.8,
      "reviews": 45,
      "verified": true,
      "availableSlots": [
        "2026-05-10T14:30:00Z",
        "2026-05-10T15:00:00Z"
      ]
    }
  ],
  "total": 1,
  "pages": 1
}
```

---

#### 12. **Get Doctor by ID**
```http
GET /api/doctors/507f1f77bcf86cd799439012
```

**Response (200 OK):**
```json
{
  "success": true,
  "doctor": {
    "_id": "507f1f77bcf86cd799439012",
    "name": "Dr. Jane Smith",
    "specialty": "psychiatry",
    "experience": 10,
    "qualifications": ["MD", "Board Certified Psychiatry"],
    "bio": "Specializing in depression and anxiety disorders",
    "languages": ["English", "Spanish"],
    "consultationFee": 50,
    "profileImage": "https://example.com/doctor1.jpg",
    "rating": 4.8,
    "reviews": 45,
    "verified": true,
    "licenseNumber": "LIC123456",
    "socialLinks": {
      "linkedin": "https://linkedin.com/in/janesmith"
    }
  }
}
```

---

#### 13. **Doctor Application Submission**
```http
POST /api/doctor-apply
Content-Type: multipart/form-data

{
  "name": "Dr. John Anderson",
  "email": "john@example.com",
  "phone": "+1-555-0124",
  "specialty": "psychiatry",
  "licenseNumber": "LIC789456",
  "qualifications": ["MD", "Board Certified"],
  "yearsOfExperience": 12,
  "bio": "Experienced psychiatrist",
  "profileImage": [File],
  "licenseDocument": [File],
  "certificateDocument": [File]
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "message": "Doctor application submitted successfully",
  "application": {
    "_id": "507f1f77bcf86cd799439030",
    "status": "pending",
    "submittedAt": "2026-05-03T10:30:00Z"
  }
}
```

---

### Content Management Endpoints

#### 14. **Get Content by Category**
```http
GET /api/content?category=yoga&featured=true&limit=10
```

**Query Parameters:**
- `category` - yoga, audio, reading, laughing
- `featured` - Filter featured content (true/false)
- `limit` - Results limit (default: 20)

**Response (200 OK):**
```json
{
  "success": true,
  "content": [
    {
      "_id": "507f1f77bcf86cd799439040",
      "title": "Beginner Yoga for Anxiety",
      "category": "yoga",
      "description": "10-minute yoga session designed for anxiety relief",
      "duration": "10 minutes",
      "level": "beginner",
      "instructor": "Sarah Johnson",
      "thumbnailURL": "https://example.com/thumb.jpg",
      "videoURL": "https://example.com/video.mp4",
      "featured": true,
      "rating": 4.7,
      "views": 5234,
      "createdAt": "2026-04-15T08:00:00Z"
    }
  ],
  "total": 1
}
```

---

#### 15. **Create Content** (Admin)
```http
POST /api/content
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json

{
  "title": "Morning Meditation Guide",
  "category": "audio",
  "description": "20-minute guided meditation for mindfulness",
  "duration": "20 minutes",
  "level": "beginner",
  "instructor": "Meditation Master",
  "videoURL": "https://example.com/meditation.mp4",
  "thumbnailURL": "https://example.com/thumb.jpg",
  "featured": false,
  "tags": ["meditation", "mindfulness", "morning"]
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "message": "Content created successfully",
  "content": {
    "_id": "507f1f77bcf86cd799439041",
    "title": "Morning Meditation Guide",
    "category": "audio",
    "createdAt": "2026-05-03T10:30:00Z"
  }
}
```

---

### Wellness Tracking Endpoints

#### 16. **Log Wellness Metric**
```http
POST /api/tracking
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json

{
  "userId": "507f1f77bcf86cd799439011",
  "moodScore": 7,
  "sleepHours": 8,
  "exerciseMinutes": 30,
  "stressLevel": 4,
  "notes": "Feeling better after yoga session"
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "message": "Wellness metric logged successfully",
  "metric": {
    "_id": "507f1f77bcf86cd799439050",
    "userId": "507f1f77bcf86cd799439011",
    "moodScore": 7,
    "sleepHours": 8,
    "exerciseMinutes": 30,
    "date": "2026-05-03",
    "createdAt": "2026-05-03T10:30:00Z"
  }
}
```

---

#### 17. **Get User Wellness Metrics**
```http
GET /api/tracking?userId=507f1f77bcf86cd799439011&days=30
Authorization: Bearer YOUR_JWT_TOKEN
```

**Query Parameters:**
- `userId` - User ID (required)
- `days` - Number of days to fetch (default: 30)

**Response (200 OK):**
```json
{
  "success": true,
  "metrics": [
    {
      "_id": "507f1f77bcf86cd799439050",
      "date": "2026-05-03",
      "moodScore": 7,
      "sleepHours": 8,
      "exerciseMinutes": 30,
      "stressLevel": 4
    }
  ],
  "average": {
    "moodScore": 6.8,
    "sleepHours": 7.5,
    "exerciseMinutes": 25,
    "stressLevel": 4.2
  },
  "total": 30
}
```

---

### Chat Endpoints

#### 18. **Send Message**
```http
POST /api/chat
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json

{
  "senderId": "507f1f77bcf86cd799439011",
  "receiverId": "507f1f77bcf86cd799439012",
  "message": "Hi, I need help with anxiety",
  "type": "text"
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "message": "Message sent successfully",
  "chat": {
    "_id": "507f1f77bcf86cd799439060",
    "senderId": "507f1f77bcf86cd799439011",
    "receiverId": "507f1f77bcf86cd799439012",
    "message": "Hi, I need help with anxiety",
    "timestamp": "2026-05-03T10:30:00Z",
    "read": false
  }
}
```

---

#### 19. **Get Chat History**
```http
GET /api/chat?userId=507f1f77bcf86cd799439011&partnerId=507f1f77bcf86cd799439012
Authorization: Bearer YOUR_JWT_TOKEN
```

**Response (200 OK):**
```json
{
  "success": true,
  "messages": [
    {
      "_id": "507f1f77bcf86cd799439060",
      "senderId": "507f1f77bcf86cd799439011",
      "senderName": "John Doe",
      "receiverId": "507f1f77bcf86cd799439012",
      "message": "Hi, I need help with anxiety",
      "timestamp": "2026-05-03T10:30:00Z",
      "read": true
    }
  ],
  "total": 1
}
```

---

### Contact & Issues Endpoints

#### 20. **Submit Contact Form**
```http
POST /api/contact
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "subject": "Feature Request",
  "message": "I would like to see a feature for group therapy sessions"
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "message": "Contact message received. We will get back to you soon.",
  "contact": {
    "_id": "507f1f77bcf86cd799439070",
    "createdAt": "2026-05-03T10:30:00Z"
  }
}
```

---

#### 21. **Report Issue**
```http
POST /api/issues
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json

{
  "userId": "507f1f77bcf86cd799439011",
  "title": "Video not loading",
  "description": "Yoga video is not loading on the audio therapy page",
  "category": "bug",
  "severity": "medium",
  "attachments": ["screenshot_url"]
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "message": "Issue reported successfully",
  "issue": {
    "_id": "507f1f77bcf86cd799439071",
    "status": "open",
    "createdAt": "2026-05-03T10:30:00Z"
  }
}
```

---

### Dashboard Statistics Endpoints

#### 22. **Get Dashboard Statistics**
```http
GET /api/dashboard-stats
Authorization: Bearer YOUR_JWT_TOKEN
```

**Response (200 OK):**
```json
{
  "success": true,
  "stats": {
    "totalUsers": 1250,
    "totalDoctors": 45,
    "activeAppointments": 89,
    "completedAppointments": 456,
    "totalContent": 234,
    "avgUserRating": 4.6,
    "userGrowth": {
      "thisMonth": 125,
      "lastMonth": 110,
      "percentChange": 13.6
    },
    "appointmentTrend": [
      { "date": "2026-04-01", "count": 12 },
      { "date": "2026-04-02", "count": 15 }
    ]
  }
}
```

---

## 🔐 Authentication

### JWT Token Structure

**Header:**
```json
{
  "alg": "HS256",
  "typ": "JWT"
}
```

**Payload:**
```json
{
  "userId": "507f1f77bcf86cd799439011",
  "email": "john@example.com",
  "role": "user",
  "iat": 1609459200,
  "exp": 1609545600
}
```

### Using Authorization Header

All protected endpoints require the Authorization header:

```bash
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Token Refresh (if implemented)

```http
POST /api/auth/refresh
Content-Type: application/json

{
  "refreshToken": "refresh_token_here"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "token": "new_jwt_token",
  "expiresIn": 3600
}
```

---

## 📊 Data Models

### User Model

```javascript
{
  _id: ObjectId,
  name: String (required),
  email: String (required, unique),
  password: String (hashed, required for email auth),
  phone: String,
  profileImage: String (URL),
  bio: String,
  role: String (user, doctor, admin),
  
  // Doctor-specific fields
  specialty: String,
  qualifications: [String],
  experience: Number,
  licenseNumber: String,
  verified: Boolean,
  rating: Number,
  
  // User preferences
  preferences: {
    newsletter: Boolean,
    notifications: Boolean,
    language: String
  },
  
  // Timestamps
  createdAt: Date,
  updatedAt: Date,
  lastLogin: Date
}
```

---

### Appointment Model

```javascript
{
  _id: ObjectId,
  userId: ObjectId (ref: User),
  doctorId: ObjectId (ref: User),
  dateTime: Date,
  serviceType: String (psychiatrist, counseling),
  reason: String,
  notes: String,
  status: String (pending, confirmed, completed, cancelled),
  meetingLink: String (Zoom/Google Meet URL),
  duration: Number (minutes),
  prescription: String,
  feedback: {
    rating: Number,
    review: String
  },
  createdAt: Date,
  updatedAt: Date
}
```

---

### Content Model

```javascript
{
  _id: ObjectId,
  title: String (required),
  description: String,
  category: String (yoga, audio, reading, laughing),
  level: String (beginner, intermediate, advanced),
  instructor: String,
  duration: String,
  videoURL: String,
  audioURL: String,
  thumbnailURL: String,
  tags: [String],
  featured: Boolean,
  rating: Number,
  views: Number,
  likes: Number,
  createdBy: ObjectId (ref: User),
  createdAt: Date,
  updatedAt: Date
}
```

---

### Wellness Tracking Model

```javascript
{
  _id: ObjectId,
  userId: ObjectId (ref: User, required),
  date: Date,
  moodScore: Number (1-10),
  sleepHours: Number,
  exerciseMinutes: Number,
  stressLevel: Number (1-10),
  notes: String,
  activities: [String],
  createdAt: Date
}
```

---

### Issue Model

```javascript
{
  _id: ObjectId,
  userId: ObjectId (ref: User),
  title: String,
  description: String,
  category: String (bug, feature, feedback),
  severity: String (low, medium, high, critical),
  status: String (open, in-progress, resolved, closed),
  attachments: [String],
  resolution: String,
  resolvedAt: Date,
  createdAt: Date,
  updatedAt: Date
}
```

---

## 🚨 Error Handling

### Standard Error Response Format

All errors follow this consistent structure:

```json
{
  "success": false,
  "message": "Error description",
  "error": "error_code",
  "details": "Additional error information (optional)"
}
```

### Common HTTP Status Codes

| Status | Meaning | Example |
|--------|---------|---------|
| 200 | OK | Request successful |
| 201 | Created | Resource created successfully |
| 400 | Bad Request | Invalid request parameters |
| 401 | Unauthorized | Missing/invalid authentication |
| 403 | Forbidden | Insufficient permissions |
| 404 | Not Found | Resource doesn't exist |
| 409 | Conflict | Resource already exists |
| 422 | Unprocessable | Validation failed |
| 500 | Server Error | Internal server error |

---

### Common Error Codes

```json
{
  "INVALID_CREDENTIALS": "Email or password is incorrect",
  "USER_ALREADY_EXISTS": "User with this email already exists",
  "USER_NOT_FOUND": "User not found",
  "UNAUTHORIZED": "Authentication required",
  "FORBIDDEN": "You don't have permission to access this resource",
  "VALIDATION_FAILED": "Request validation failed",
  "APPOINTMENT_CONFLICT": "Time slot not available",
  "INVALID_TOKEN": "Token is invalid or expired",
  "DOCTOR_NOT_VERIFIED": "Doctor account is not verified",
  "APPOINTMENT_NOT_FOUND": "Appointment does not exist"
}
```

---

## ⏱️ Rate Limiting

To prevent abuse, the API implements rate limiting:

| Endpoint Type | Limit | Window |
|---------------|-------|--------|
| Authentication | 5 requests | 15 minutes |
| User endpoints | 100 requests | 1 hour |
| Appointment endpoints | 50 requests | 1 hour |
| Content endpoints | 200 requests | 1 hour |
| General endpoints | 1000 requests | 1 hour |

**Rate Limit Headers:**
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1609545600
```

**When limit exceeded (429):**
```json
{
  "success": false,
  "message": "Rate limit exceeded. Please try again later.",
  "retryAfter": 300
}
```

---

## 🎯 Best Practices

### Request Guidelines

1. **Always include Content-Type header:**
   ```
   Content-Type: application/json
   ```

2. **Use proper HTTP methods:**
   - `GET` - Retrieve data
   - `POST` - Create new resource
   - `PUT/PATCH` - Update resource
   - `DELETE` - Remove resource

3. **Include pagination parameters for list endpoints:**
   ```
   GET /api/appointments?page=1&limit=10&sort=dateTime
   ```

4. **Use query parameters for filtering:**
   ```
   GET /api/doctors?specialty=psychiatry&verified=true
   ```

5. **Always validate input on client-side before sending:**
   ```javascript
   if (!email.includes('@')) {
     console.error('Invalid email');
     return;
   }
   ```

### Response Handling

1. **Check success status:**
   ```javascript
   if (response.data.success) {
     // Handle success
   } else {
     // Handle error from response
   }
   ```

2. **Handle different status codes:**
   ```javascript
   try {
     const response = await axios.get('/api/users');
   } catch (error) {
     if (error.response?.status === 401) {
       // Redirect to login
     }
   }
   ```

3. **Implement retry logic for failed requests:**
   ```javascript
   const retryRequest = async (fn, maxRetries = 3) => {
     for (let i = 0; i < maxRetries; i++) {
       try {
         return await fn();
       } catch (error) {
         if (i === maxRetries - 1) throw error;
       }
     }
   };
   ```

### Security Best Practices

1. **Never hardcode tokens:**
   ```javascript
   // ❌ Bad
   const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...';
   
   // ✅ Good
   const token = localStorage.getItem('authToken');
   ```

2. **Use HTTPS in production:**
   ```javascript
   const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL;
   ```

3. **Validate all user inputs:**
   ```javascript
   const validateEmail = (email) => {
     return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
   };
   ```

4. **Sanitize data before displaying:**
   ```javascript
   // Prevent XSS attacks
   const sanitizeHTML = (html) => {
     const div = document.createElement('div');
     div.textContent = html;
     return div.innerHTML;
   };
   ```

---

## 🔧 Troubleshooting

### Common Issues & Solutions

#### 1. **401 Unauthorized Error**

**Cause:** Missing or invalid authentication token

**Solution:**
```javascript
// Check if token exists
const token = localStorage.getItem('authToken');
if (!token) {
  // Redirect to login
  window.location.href = '/login';
}

// If token exists, verify it's still valid
// Refresh token if close to expiration
```

---

#### 2. **CORS Error**

**Cause:** Frontend and backend not configured for cross-origin requests

**Solution:**
```javascript
// Make sure backend has CORS enabled
// In Next.js API routes
export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Credentials', true)
  res.setHeader('Access-Control-Allow-Origin', process.env.NEXT_PUBLIC_ALLOWED_ORIGIN)
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT')
}
```

---

#### 3. **MongoDB Connection Failed**

**Cause:** Invalid connection string or network issues

**Solution:**
```javascript
// Check MONGODB_URI in .env.local
// Make sure IP is whitelisted in MongoDB Atlas
// Verify credentials are correct
const uri = process.env.MONGODB_URI;
console.log('Connecting to:', uri?.split('@')[0] + '@...');
```

---

#### 4. **Token Expired**

**Cause:** JWT token has expired

**Solution:**
```javascript
// Implement token refresh
const refreshToken = async () => {
  try {
    const response = await axios.post('/api/auth/refresh', {
      refreshToken: localStorage.getItem('refreshToken')
    });
    localStorage.setItem('authToken', response.data.token);
  } catch (error) {
    // Redirect to login
    window.location.href = '/login';
  }
};
```

---

#### 5. **Validation Error (422)**

**Cause:** Request data doesn't meet validation requirements

**Solution:**
```javascript
// Check error details and fix payload
const response = await axios.post('/api/appointments', {
  userId: 'valid_id',
  doctorId: 'valid_id',
  dateTime: new Date().toISOString(),
  serviceType: 'psychiatrist', // Make sure it's a valid type
  reason: 'Consultation'
});
```

---

### Debug Mode

Enable detailed logging for development:

```javascript
// In .env.local
DEBUG=reflex:*

// In code
const debug = process.env.DEBUG?.includes('reflex');

if (debug) {
  console.log('API Request:', endpoint, payload);
  console.log('API Response:', response);
}
```

---

## 📞 Support & Resources

- **Issues:** [Report on GitHub](https://github.com/yourusername/reflex/issues)
- **Email:** support@reflexwellness.com
- **Postman Collection:** [Import API Collection](https://postman.com/collections/reflex-api)

---

## 📝 Changelog

### v1.0.0 (Current)
- Initial API release
- 22 main endpoints
- JWT authentication
- MongoDB integration
- Real-time chat support

---

<div align="center">

**Last Updated:** May 3, 2026

[⬆ Back to Root README](../../README.md)

</div>