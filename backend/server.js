const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const mongoose = require('mongoose');

const authRoutes = require('./routes/authRoutes');
const resumeRoutes = require('./routes/resumeRoutes');
const mockInterviewRoutes = require('./routes/mockInterviewRoutes');
const ollamaRoutes = require('./routes/ollamaRoutes');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');
const { COMPANIES, ROLES } = require('./data/companies');

dotenv.config();

const app = express();

// ── Core middleware ────────────────────────────────────────────────────────
app.use(cors());
app.use(express.json());

// Request logger
app.use((req, res, next) => {
    console.log(`${req.method} ${req.originalUrl}`);
    next();
});

// ── Routes ─────────────────────────────────────────────────────────────────
app.use('/api/auth', authRoutes);
app.use('/api/resume', resumeRoutes);
app.use('/api/mock-interview', mockInterviewRoutes);
app.use('/api/ollama', ollamaRoutes);

// Public companies endpoint — no auth required
app.get('/api/companies', (req, res) => {
    res.status(200).json({
        success: true,
        count: COMPANIES.length,
        companies: COMPANIES,
        roles: ROLES,
    });
});

app.get('/', (req, res) => {
    res.send('HireSense API is running 🚀');
});

// ── Error middleware (must be last) ────────────────────────────────────────
app.use(notFound);
app.use(errorHandler);

// Export for Vercel / serverless
module.exports = app;

// ── Local server startup ───────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/hiresense';

mongoose
    .connect(MONGO_URI)
    .then(() => {
        console.log('✅ MongoDB Connected:', MONGO_URI);
    })
    .catch((err) => {
        console.warn('⚠️  MongoDB connection failed — continuing without DB:', err.message);
    })
    .finally(() => {
        app.listen(PORT, () => {
            console.log(`🚀 Server running on port ${PORT}`);
            console.log(`🤖 Ollama mock interviews: http://localhost:${PORT}/api/ollama/health`);
            console.log(`🏢 Companies API: http://localhost:${PORT}/api/companies`);
            console.log(`🔑 Gemini AI: ${process.env.GEMINI_API_KEY ? 'ENABLED' : 'DISABLED (key missing)'}`);
        });
    });
