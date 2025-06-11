require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const connectDB = require('./Config/db');
const userRoutes = require('./routes/userRoutes');
const articleRoutes = require('./routes/articleRoutes');

const app = express();

// Database Connection
connectDB();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS - Allow all origins in production
app.use(cors());

// API Routes
app.use('/api/users', userRoutes);
app.use('/api/articles', articleRoutes);

// Serve React app in production
if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../dist')));
    
    app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, '../dist/index.html'));
    });
}

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));