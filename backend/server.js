const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const morgan = require('morgan');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const errorHandler = require('./middleware/errorHandler');
const cors = require('cors'); // Add this
const path = require('path')
dotenv.config();

const app = express();

// Middleware

// app.use(cors({
//   origin: ['http://localhost:5173','https://school-1-ubkg.onrender.com' ],// Allow requests from Vite frontend
//   credentials: true, // If you plan to use cookies (not needed here)
// }));

app.use(cors({
  origin: ['http://localhost:5173', 'https://school-front-3w42.onrender.com'],
  methods: ['GET','POST','PUT','DELETE'],
  credentials: true
}));

app.use(express.json());
app.use(morgan('dev'));  // Logging
app.use(helmet());  // Security headers
const limiter = rateLimit({ windowMs: 5 * 60 * 1000, max: 1000 ,message: { message: 'Too many login attempts, please try again later.' }});  // Rate limiting: 100 requests/15min
app.use(limiter);


app.use('/receipts', express.static(path.join(__dirname, 'receipts')));
app.use('/uploads', express.static('uploads'));

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/students', require('./routes/studentRoutes'));
app.use('/api/batches', require('./routes/batchRoutes'));
app.use('/api/fees', require('./routes/feeRoutes'));
app.use('/api/documents', require('./routes/documentRoutes'));
app.use('/api/reports', require('./routes/reportRoutes'));
app.use('/api/finance', require('./routes/financeRoutes')); 
// Error Handler
app.use(errorHandler);

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

  
// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));