# HireSense AI - Intelligent Resume Builder & Smart Mock Interview System

A complete full-stack web application designed for analyzing resumes, extracting keywords, and conducting dynamic, proctored mock interviews securely from the browser. 

## Features
- **Resume Builder:** Multi-step form with ATS keyword detection and dynamic scoring. Downloadable as PDF.
- **Smart Mock Interview:** Auto and Manual modes with Web Speech API transcription. Rule-based flow dynamically asks follow-up questions.
- **Proctoring Module:** Native browser Tab Switch detection (Page Visibility API), disabled right-click/copy-paste, and a live web camera feed. 
- **Analytics Dashboard:** Aggregated metrics using Chart.js displaying Technical, Communication, and Integrity scores with a 30-day roadmap.
- **Admin Panel:** Tracking software readiness, connected users, and malpractice logs.

## Tech Stack
- Frontend: React (Vite) + Tailwind CSS + Lucide React + Chart.js
- Backend: Node.js + Express
- Database: MongoDB
- Authentication: JWT + bcrypt

## Project Structure
```
Hiresense
├── backend
│   ├── controllers
│   ├── middleware (authMiddleware)
│   ├── models (User, Resume, Interview)
│   ├── routes (auth, resumes, interviews, admin)
│   ├── services (aiService placeholder)
│   ├── server.js
│   ├── package.json
│   └── .env
└── frontend
    ├── src
    │   ├── components (Layout, Watermark)
    │   ├── pages (Login, Dashboard, ResumeBuilder, Interview, Admin)
    │   ├── services (api via Axios)
    │   ├── App.jsx
    │   └── main.jsx
    ├── tailwind.config.js
    ├── index.html
    └── package.json
```

## Setup Instructions

### 1. Database Setup
Ensure you have MongoDB installed locally or access to a MongoDB Atlas cluster.
The default connection string is `mongodb://localhost:27017/hiresense`.

### 2. Backend Setup
1. Navigate to the backend directory: 
   `cd backend`
2. Install dependencies:
   `npm install`
3. Rename `.env.example` to `.env`. It contains:
   ```env
   PORT=5000
   MONGO_URI=mongodb://localhost:27017/hiresense
   JWT_SECRET=super_secret_hiresense_jwt_token
   OPENAI_API_KEY=your_openai_api_key_here
   ```
4. Start the server:
   `npm run dev` (Runs on http://localhost:5000)

### 3. Frontend Setup
1. Open a new terminal and navigate to the frontend directory:
   `cd frontend`
2. Install dependencies:
   `npm install`
3. Start the Vite React development server:
   `npm run dev` (Runs on http://localhost:5173 - or as specified by Vite in terminal)

### 4. How to use
- Open the frontend URL in your browser.
- **Register** a new account.
- In the DB, you can manually update your role to `"admin"` to access the admin panel, otherwise you are a standard `"user"`.
- Navigate to **Resume Builder** and fill out the details. Download your generated resume PDF.
- Navigate to **Mock Interview**, allow camera and microphone permissions, and speak your answers clearly while avoiding switching tabs (which the Proctoring engine records).
- See your **Dashboard** for data visualization!
