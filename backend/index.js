// Load environment variables immediately
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const logger = require('./utils/logger');

// Import Routes
const authRoutes = require('./routes/authRoutes');
const plantRoutes = require('./routes/plantRoutes');
const shopRoutes = require('./routes/shopRoutes');
const postRoutes = require('./routes/postRoutes');
const rewardRoutes = require('./routes/rewardRoutes');
const { submitContactForm } = require('./controllers/contactController');

// Initialize Schedulers
require('./schedulers/cronJobs');

const app = express();
const PORT = process.env.PORT || 5002;

// --- Database Connection ---
if (connectDB) {
    connectDB();
    logger.info('✅ MongoDB connected successfully');
}

// --- Middleware ---
app.use(cors());
app.use(express.json({ limit: '10mb' }));

// --- API Routes ---
app.use('/api', authRoutes);
app.use('/api/plants', plantRoutes);
app.use('/api/shop', shopRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/rewards', rewardRoutes);

// --- Public Routes ---
app.post('/contact', submitContactForm);

// --- Server Start ---
app.listen(PORT, () => {
    logger.info(`🌿 Growlify backend running on http://localhost:${PORT}`);
});
