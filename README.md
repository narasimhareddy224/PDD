# NextFit AI – AI-Powered Personal Fashion Recommendation Application

NextFit AI is an AI-powered personal fashion assistant and shopping platform designed to analyze user facial complexion, skin undertones, and body silhouettes to deliver personalized outfit recommendations, weather-aware styling suggestions, real-time verified price comparisons across Amazon, Flipkart, Myntra, and Ajio, smart outfit scheduling with FCM push reminders, and an interactive conversational fashion stylist.

---

## 🌟 Key Features

1. **AI Visual Complexion & Silhouette Analysis**:
   - Camera capture or gallery photo upload.
   - Deep detection of Skin Tone (*Very Fair*, *Fair*, *Medium*, *Olive*, *Brown*, *Deep*), Body Type (*Rectangle*, *Triangle*, *Inverted Triangle*, *Oval*, *Hourglass*), Fitness Level (*Lean*, *Average*, *Athletic*, *Muscular*, *Plus-size*), and Style Aesthetics (*Smart Casual*, *Formal*, *Streetwear*, *Traditional*, *Trendy*, etc.).
   - Confidence scoring and interactive manual correction overrides.

2. **Personalized Smart Outfit Recommendations**:
   - Dynamic match scoring (0–100%) calculated based on skin-tone compatibility, body symmetry, user color preferences, and occasion filters.
   - Occasions supported: *Weddings*, *Parties*, *Interviews*, *College*, *Office*, *Festivals*, *Casual outings*, *Dates*, *Travel*, *Smart casual*.
   - Component-level breakdown: Top, Bottom, Footwear, and Accessories.

3. **Multi-Platform Verified Price Comparison**:
   - Live price comparison across **Amazon**, **Flipkart**, **Myntra**, and **Ajio**.
   - **Zero Fabricated Data Rule**: Displays verified prices from official feeds; clearly labels `"Shopping data unavailable for this platform"` if a platform is offline.
   - Computes the lowest verified price with direct product navigation links.

4. **Outfit Calendar & Event Reminders**:
   - Interactive timeline and event scheduler.
   - Firebase Cloud Messaging (FCM) push alerts (1 day before, 12 hours before, 2 hours before, at event time).

5. **AI Conversational Fashion Stylist**:
   - Real-time conversational stylist assistant.
   - Context-aware advice incorporating user measurements, local weather, and occasion dressing.
   - Interactive prompt chips and outfit suggestions.

6. **Live Weather & Fabric Engine**:
   - Live temperature, humidity, wind, and conditions via Open-Meteo integration.
   - Intelligent fabric recommendations (breathable linen in heat, water-resistant layers in rain).

---

## 🏗️ Architecture

```
                    NEXTFIT AI ARCHITECTURE
                              │
                              ▼
            Angular Standalone Frontend (Port 4200)
                              │
                    HTTP / REST (RxJS)
                              │
                              ▼
          Node.js + Express + TypeScript Backend (Port 5000)
                              │
       ┌──────────────────────┼──────────────────────┐
       ▼                      ▼                      ▼
    MongoDB                Firebase              AI Engine
  (Mongoose)         (Auth, Storage, FCM)  (Gemini / Vision)
       │                      │                      │
       ├─ Users               ├─ Auth Verify         ├─ Image Analysis
       ├─ Preferences         ├─ Photo Storage       ├─ Match Scoring
       ├─ Analysis            └─ Push Reminders      └─ Fashion Assistant
       ├─ Outfits
       ├─ Recommendations
       ├─ Favorites & History
       ├─ Schedules
       └─ Shopping Products
                              │
                              ▼
              Multi-Store Shopping Integrations
              ┌───────────┬───────────┬───────────┐
              ▼           ▼           ▼           ▼
            Amazon     Flipkart     Myntra       Ajio
```

---

## 🛠️ Technology Stack

### Frontend
- **Framework**: Angular 18 (Standalone Components)
- **Language**: TypeScript 5.5
- **Styling**: Modern Luxury Glassmorphism CSS Design System
- **State & HTTP**: RxJS, Angular HttpClient with Auth & Error Interceptors
- **Typography**: Google Fonts (*Outfit* & *Plus Jakarta Sans*) + FontAwesome Icons

### Backend
- **Runtime**: Node.js & Express.js with TypeScript
- **Database**: MongoDB & Mongoose
- **Security**: Firebase Admin SDK, Helmet, CORS, Rate Limiting, Zod Request Validation
- **Documentation**: Swagger UI / OpenAPI 3.0 at `/api-docs`
- **Testing**: Jest & Supertest

---

## 🚀 Quick Start Guide

### Prerequisites
- Node.js (v18+) & npm (v9+)
- MongoDB running locally on `mongodb://127.0.0.1:27017` or MongoDB Atlas URI
- Optional: Firebase Project Credentials for cloud auth and FCM notifications

---

### 1. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Configure environment variables
cp .env.example .env

# Run automated tests
npm test

# Start backend dev server (Port 5000)
npm run dev
```

The backend server will start at `http://localhost:5000`.
- **API Documentation**: `http://localhost:5000/api-docs`
- **Health Check**: `http://localhost:5000/health`

---

### 2. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start Angular development server (Port 4200)
npm start
```

Open `http://localhost:4200` in your web browser.

---

## 📡 REST API Reference

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/sync` | Sync & authenticate user session | Yes |
| `GET` | `/api/users/me` | Retrieve profile and style preferences | Yes |
| `PUT` | `/api/users/me` | Update style profile and measurements | Yes |
| `POST` | `/api/images/upload` | Upload fashion photo to storage | Yes |
| `POST` | `/api/analysis` | Analyze uploaded photo using AI Vision | Yes |
| `GET` | `/api/analysis` | Retrieve latest analysis metrics | Yes |
| `PUT` | `/api/analysis` | Save manual corrections to AI results | Yes |
| `GET` | `/api/recommendations` | Get personalized scored outfit looks | Yes |
| `GET` | `/api/outfits` | Browse curated outfits catalog | No |
| `GET` | `/api/outfits/:id` | Get detailed outfit specs & breakdown | No |
| `GET` | `/api/shopping/search` | Search verified products across stores | No |
| `GET` | `/api/shopping/compare` | Multi-store verified price comparison | No |
| `GET` | `/api/schedules` | View outfit calendar events | Yes |
| `POST` | `/api/schedules` | Schedule outfit with push reminders | Yes |
| `GET` | `/api/favorites` | Retrieve bookmarked favorite outfits | Yes |
| `POST` | `/api/favorites/:id` | Add outfit to favorites collection | Yes |
| `POST` | `/api/assistant/chat` | Chat with AI Fashion Stylist | Yes |
| `GET` | `/api/assistant/history` | Retrieve stylist chat history | Yes |
| `GET` | `/api/weather` | Get real-time weather & fabric tips | No |

---

## 🔒 Security & Data Integrity

- **Strict No-Fabrication Rule**: Real catalog data feeds from Amazon, Flipkart, Myntra, and Ajio.
- **Safe Authentication**: Firebase token validation with graceful mock fallbacks for local offline testing.
- **Error Sanitization**: Centralized error middleware ensures no sensitive keys or database traces leak in API responses.

---

## 📄 License

MIT License. Developed for fashion enthusiasts by the NextFit AI Engineering Team.
