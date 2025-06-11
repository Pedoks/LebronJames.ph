require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const connectDB = require('./config/db');
const userRoutes = require('./routes/userRoutes');
const articleRoutes = require('./routes/articleRoutes');
const frontendPath = path.join(process.cwd(), 'belles_frontend', 'dist');

const app = express();

// Database Connection
connectDB();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// Replace your current CORS middleware with this:
// Replace your CORS middleware with this:
// Use this exact configuration:
const corsOptions = {
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  optionsSuccessStatus: 200 // Some clients choke on 204
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions)); // Enable preflight for all routes
// API Routes
app.use('/api/users', userRoutes);
app.use('/api/articles', articleRoutes);

app.use(express.static(frontendPath));

app.get('*', (req, res) => res.sendFile(path.join(frontendPath, 'index.html')));

// Serve static files in production
if (process.env.NODE_ENV === 'production') {
    // Set static folder
    app.use(express.static(path.join(__dirname, '../belles_frontend/dist')));

    // Handle SPA (serve index.html for all routes)
    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, '../belles_frontend/dist', 'index.html'));
    });
}

// Error Handling
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Server Error' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));