# 🌟 Reflex: Your Mental Wellness Companion

<div align="center">

![Reflex Logo](./public/logo.json)

A comprehensive mental wellness and psychiatric consultation platform designed to provide accessible, professional mental health support through multiple therapeutic modalities.

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](./LICENSE)
[![Node.js](https://img.shields.io/badge/Node.js-14%2B-green.svg)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-18.3+-blue.svg)](https://reactjs.org/)
[![Next.js](https://img.shields.io/badge/Next.js-14.2+-black.svg)](https://nextjs.org/)

[🔗 Live Demo](#-demo) • [📚 Documentation](#-documentation) • [🚀 Getting Started](#-quick-start) • [📋 API Docs](./app/api/README.md) • [🤝 Contributing](#-contributing)

</div>

---

## 📖 Table of Contents

1. [Overview](#-overview)
2. [Features](#-features)
3. [Tech Stack](#-tech-stack)
4. [Project Structure](#-project-structure)
5. [Quick Start](#-quick-start)
6. [Environment Setup](#-environment-setup)
7. [Running the Application](#-running-the-application)
8. [API Documentation](#-api-documentation)
9. [Database Models](#-database-models)
10. [Authentication](#-authentication)
11. [Contributing](#-contributing)
12. [License](#-license)

---

## 🎯 Overview

Reflex is an end-to-end mental wellness platform combining Next.js frontend capabilities with a robust Node.js backend. It leverages multiple therapeutic approaches including yoga therapy, mindfulness, cognitive behavioral therapy, and direct psychiatrist consultations to provide holistic mental health support.

**Key Objectives:**
- Provide accessible mental health services to a global audience
- Connect users with licensed psychiatrists and mental health professionals
- Offer evidence-based therapeutic interventions
- Track wellness progress and therapeutic outcomes
- Create a supportive community for mental health advocacy

---

## 🚀 Features

### Core Therapeutic Services

- **🧘‍♀️ Yoga Therapy**
  - Guided yoga sessions for mental and emotional well-being
  - Video demonstrations and progress tracking
  - Customizable difficulty levels

- **😂 Laughing Therapy**
  - Therapeutic laughter exercises
  - Mood elevation techniques
  - Group and individual sessions

- **🗣️ Talking Therapy (Chat & Consultations)**
  - Real-time chat support
  - Licensed psychiatrist consultations
  - Professional mental health counseling
  - Session scheduling and history

- **📚 Reading Therapy**
  - Curated therapeutic literature
  - Mindfulness stories and exercises
  - Wellness content library
  - Article recommendations

- **🎧 Audio Therapy**
  - Calming audio tracks and meditations
  - Sleep and relaxation guides
  - Ambient soundscapes
  - Breathing exercises

- **👩‍⚕️ Professional Psychiatrist Consultations**
  - Connect with verified mental health professionals
  - Book appointments seamlessly
  - Video consultations
  - Prescription and treatment recommendations
  - Medical history management

### Additional Features

- **User Dashboard**
  - Personal wellness profile
  - Progress tracking and analytics
  - Appointment history
  - Wellness metrics visualization

- **Doctor Application System**
  - Application portal for mental health professionals
  - Verification and credentialing workflow
  - Professional profile management

- **Wellness Tracking**
  - Mental health metrics logging
  - Mood tracking over time
  - Progress analytics
  - Personalized insights

- **Appointment Management**
  - Easy booking system
  - Reminder notifications
  - Appointment history
  - Cancellation and rescheduling

- **AI Chat Support**
  - 24/7 AI chatbot assistance
  - Mental health information
  - Crisis support resources
  - Symptom assessment

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 14.2.3 (React 18.3+)
- **Styling**: Tailwind CSS 3.4 + Typography plugin
- **UI Components**: React Icons, Lottie React
- **Animations**: Framer Motion, AOS (Animate On Scroll)
- **Notifications**: React Hot Toast, SweetAlert2
- **Text Effects**: Typewriter Effect
- **Charts**: Recharts
- **Media**: React Player
- **Markdown**: React Markdown

### Backend & Database
- **Runtime**: Node.js 14+
- **Framework**: Next.js API Routes
- **Database**: MongoDB 4.4+
- **ODM**: Mongoose 8.13+
- **Authentication**: Firebase, JWT (jsonwebtoken)
- **Password Security**: bcryptjs
- **CORS**: Cross-Origin Resource Sharing

### Development Tools
- **Linting**: ESLint
- **Image Processing**: Sharp
- **Environment**: dotenv
- **Build Tool**: Next.js built-in

### Deployment
- **Hosting**: Vercel (configured via vercel.json)
- **CDN**: Image optimization via Vercel + ImgBB

---

## 📁 Project Structure

```
reflex/
├── app/
│   ├── api/                          # Backend API Routes
│   │   ├── appointments/             # Appointment booking & management
│   │   ├── auth/                     # Authentication (login, signup, Google OAuth)
│   │   ├── chat/                     # Real-time messaging
│   │   ├── contact/                  # Contact form submissions
│   │   ├── content/                  # Therapeutic content management
│   │   ├── dashboard-stats/          # Analytics & statistics
│   │   ├── doctor-apply/             # Doctor application submissions
│   │   ├── doctors/                  # Doctor profiles & listings
│   │   ├── issues/                   # Issue reporting & tracking
│   │   ├── tracking/                 # Wellness metrics tracking
│   │   ├── users/                    # User management
│   │   ├── youtube-meta/             # YouTube content metadata
│   │   └── README.md                 # API documentation
│   ├── auth/                         # Auth pages
│   ├── booking/                      # Appointment booking UI
│   ├── dashboard/                    # User & doctor dashboards
│   ├── services/                     # Service pages (yoga, audio, reading, laughing)
│   ├── psychiatrists/                # Psychiatrist profiles & search
│   ├── apply-doctor/                 # Doctor application form
│   ├── tracking/                     # Wellness tracking UI
│   ├── login/                        # Login page
│   ├── signup/                       # Registration page
│   ├── layout.js                     # Root layout
│   ├── page.js                       # Home page
│   ├── not-found.js                  # 404 page
│   └── globals.css                   # Global styles
├── components/                       # Reusable React components
│   ├── About.js                      # About section
│   ├── AIChat.js                     # AI chatbot component
│   ├── AOSInit.js                    # Scroll animation initialization
│   ├── Contact.js                    # Contact form
│   ├── DashboardLayout.js            # Dashboard wrapper
│   ├── FAQ.js                        # FAQ section
│   ├── Footer.js                     # Footer component
│   ├── Hero.js                       # Hero/banner section
│   ├── Logo.js                       # Logo component
│   ├── Navbar.js                     # Navigation bar
│   ├── Psychiatrists.js              # Psychiatrist listing
│   ├── Quotes.js                     # Motivational quotes
│   ├── Services.js                   # Services showcase
│   └── Testimonials.js               # User testimonials
├── context/
│   └── AuthContext.js                # Global authentication context
├── lib/
│   ├── auth.js                       # Authentication utilities
│   ├── connectDB.js                  # MongoDB connection handler
│   └── firebase.js                   # Firebase configuration
├── models/                           # Mongoose data models
│   ├── User.js                       # User schema
│   ├── Appointment.js                # Appointment schema
│   ├── Issue.js                      # Issue/problem schema
│   └── Content.js                    # Content schema
├── data/
│   ├── psychiatrists.json            # Psychiatrist listings data
│   └── wellness_tracking.json        # Wellness metrics template
├── public/                           # Static assets
│   ├── images/                       # Image files
│   └── *.json                        # Lottie animation JSON files
├── scripts/
│   └── remove-bg.js                  # Background removal utility
├── package.json                      # Project dependencies
├── next.config.js                    # Next.js configuration
├── tailwind.config.js                # Tailwind CSS configuration
├── postcss.config.js                 # PostCSS configuration
├── jsconfig.json                     # JavaScript configuration
├── vercel.json                       # Vercel deployment config
├── .env.local                        # Environment variables (local)
└── .gitignore                        # Git ignore rules
```

---

## 🚀 Quick Start

### Prerequisites
- **Node.js** 14.0 or higher
- **npm** 6.0 or higher (or yarn/pnpm)
- **MongoDB** 4.4+ (local or cloud via MongoDB Atlas)
- **Firebase Project** (for authentication)
- **Git** for version control

### Installation Steps

1. **Clone the Repository**
   ```bash
   git clone https://github.com/yourusername/reflex.git
   cd reflex
   ```

2. **Install Dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Configure Environment Variables**
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your credentials
   ```

4. **Start Development Server**
   ```bash
   npm run dev
   # Server runs at http://localhost:3000
   ```

5. **Open in Browser**
   ```
   http://localhost:3000
   ```

---

## ⚙️ Environment Setup

Create a `.env.local` file in the project root with the following variables:

```env
# Database
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/reflex?retryWrites=true&w=majority

# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your_measurement_id

# JWT Secret
JWT_SECRET=your_secret_key_here

# API Base URL
NEXT_PUBLIC_API_BASE_URL=http://localhost:3000/api

# Google OAuth (optional)
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# Image Hosting (ImgBB)
IMGBB_API_KEY=your_imgbb_api_key

# Email Service (optional)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password

# Payment Gateway (if applicable)
STRIPE_SECRET_KEY=your_stripe_secret
STRIPE_PUBLISHABLE_KEY=your_stripe_publishable
```

---

## 🏃 Running the Application

### Development Mode
```bash
npm run dev
```
Starts the development server with hot-reload at `http://localhost:3000`

### Production Build
```bash
npm run build
npm start
```
Builds optimized production bundle and runs the server

### Linting
```bash
npm run lint
```
Runs ESLint to check code quality

### Format Code (if configured)
```bash
npm run format
```

---

## 📚 API Documentation

For detailed API endpoint documentation, authentication methods, request/response schemas, and examples, see [API Documentation](./app/api/README.md).

**Key API Routes:**
- `/api/appointments` - Appointment management
- `/api/auth` - Authentication endpoints
- `/api/chat` - Messaging system
- `/api/doctors` - Doctor profiles
- `/api/users` - User management
- `/api/content` - Therapeutic content
- `/api/tracking` - Wellness metrics
- `/api/contact` - Contact submissions

---

## 💾 Database Models

### User Model
Stores user account information, preferences, and authentication details.

### Appointment Model
Manages booking records between users and psychiatrists with timestamps and status.

### Content Model
Stores therapeutic content (articles, videos, audio files, exercises).

### Issue Model
Tracks reported problems and support tickets.

Detailed schema information available in [models/](./models/) directory.

---

## 🔐 Authentication

The application supports multiple authentication methods:

1. **Email/Password** - Traditional registration and login
2. **Google OAuth** - Sign in with Google account
3. **JWT Tokens** - Session management and API authentication
4. **Firebase Authentication** - Additional security layer

Authentication flow:
```
User Registration/Login → Firebase/Email Verification → JWT Token Generation → 
Session Management → Protected Route Access
```

---

## 🤝 Contributing

We welcome contributions! Please follow these guidelines:

### How to Contribute
1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** changes (`git commit -m 'Add amazing feature'`)
4. **Push** to branch (`git push origin feature/amazing-feature`)
5. **Open** a Pull Request

### Contribution Guidelines
- Follow the existing code style and naming conventions
- Write clear commit messages
- Add/update documentation as needed
- Test thoroughly before submitting
- Ensure no console errors or warnings
- Update relevant API documentation

### Code Standards
- Use ES6+ syntax
- Follow Next.js best practices
- Maintain responsive design
- Add error handling
- Include JSDoc comments for complex functions

### Reporting Issues
- Describe the issue clearly
- Include reproduction steps
- Provide screenshots/videos if applicable
- Mention your environment (OS, Node version, etc.)

---

## 📝 License

This project is licensed under the MIT License - see [LICENSE](./LICENSE) file for details.

---

## 🔗 Demo

**Live Preview:**  
[Reflex Mental Wellness Platform](https://reflex-wellness.vercel.app/)

---

## 📞 Support & Contact

For support, questions, or feedback:
- **Email**: support@reflexwellness.com
- **Issue Tracker**: [GitHub Issues](https://github.com/yourusername/reflex/issues)
- **Contact Form**: Available on the [Contact Page](https://reflex-wellness.vercel.app/contact)

---

## 🙏 Acknowledgments

- Mental health professionals who provided domain expertise
- Open-source community for excellent libraries
- Contributors and community members
- All users supporting mental wellness initiatives

---

## ⚡ Performance & Optimization

- **Image Optimization**: Next.js Image component with Vercel CDN
- **Code Splitting**: Automatic route-based code splitting
- **Lazy Loading**: Component and route lazy loading
- **Caching**: Browser and server-side caching strategies
- **Database Indexing**: Optimized MongoDB indexes for queries

---

## 🚨 Security Considerations

- HTTPS enforced in production
- Environment variables for sensitive data
- Password hashing with bcryptjs
- CORS configuration for API protection
- JWT token validation on protected routes
- MongoDB injection prevention via Mongoose
- XSS and CSRF protection via Next.js

---

<div align="center">

**Built with ❤️ for mental wellness**

[⬆ back to top](#-reflex-your-mental-wellness-companion)

</div>
