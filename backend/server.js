const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const mongoose = require('mongoose');
const authRoutes = require('./routes/authRoutes');
const resumeRoutes = require('./routes/resumeRoutes');
const mockInterviewRoutes = require('./routes/mockInterviewRoutes');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// Request logging middleware
app.use((req, res, next) => {
    console.log(`${req.method} ${req.originalUrl}`);
    next();
});

app.use('/api/auth', authRoutes);
app.use('/api/resume', resumeRoutes);
app.use('/api/mock-interview', mockInterviewRoutes);

app.get('/', (req, res) => {
    res.send('HireSense API Foundation is running');
});

app.use(notFound);
app.use(errorHandler);

// Export for Vercel
module.exports = app;

if (process.env.NODE_ENV !== 'production') {
    const PORT = process.env.PORT || 5000;
    mongoose
        .connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/hiresense-v2')
        .then(() => {
            console.log('MongoDB Connected');
            app.listen(PORT, () => {
                console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
                console.log(`AI Intelligence: ${process.env.GEMINI_API_KEY ? 'ENABLED (Key Detected)' : 'DISABLED (Key Missing)'}`);
            });
        })
        .catch((error) => {
            console.log(`Error: ${error.message}`);
            process.exit(1);
        });
} else {
    // In production (Vercel), connect to MongoDB without app.listen
    mongoose.connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    }).then(() => console.log('MongoDB Connected (Production)'))
        .catch(err => console.error('MongoDB Connection Error:', err));
}
