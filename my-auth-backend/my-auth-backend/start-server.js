const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');

console.log('🚀 Starting MealVista Backend Server...\n');

// Load environment variables FIRST
const envResult = dotenv.config({ path: path.resolve(__dirname, '.env') });

if (envResult.error) {
  console.error('❌ Error loading .env file:', envResult.error.message);
  process.exit(1);
}

// Display loaded environment variables (hide sensitive data)
console.log('📋 Environment Variables:');
console.log('   MONGO_URI:', process.env.MONGO_URI ? '✅ Set' : '❌ Missing');
console.log('   JWT_SECRET:', process.env.JWT_SECRET ? '✅ Set' : '❌ Missing');
console.log('   PORT:', process.env.PORT || '5000 (default)');
console.log('');

// Verify critical environment variables
if (!process.env.MONGO_URI) {
  console.error('❌ ERROR: MONGO_URI is not set in .env file');
  console.error('Please add to .env file:');
  console.error('MONGO_URI=mongodb://localhost:27017/mealvista');
  process.exit(1);
}

const connectDB = require('./config/db');

// Connect to database
connectDB();

const app = express();

// Middleware
app.use(express.json());

const corsOptions = {
  origin: '*',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`📥 ${req.method} ${req.path}`);
  next();
});

// Import routes
const authRoutes = require('./routes/auth');
const googleAuth = require('./routes/google');
const adminRoutes = require('./routes/admin');
const inventoryRoutes = require('./routes/inventory');

// Use routes
app.use('/api/auth', authRoutes);
app.use('/api/auth/google', googleAuth);
app.use('/api/admin', adminRoutes);
app.use('/api/admin/inventory', inventoryRoutes);

// Health check endpoint
app.get('/', (req, res) => {
  res.json({ 
    message: 'MealVista API is running',
    timestamp: new Date().toISOString(),
    mongodb: 'connected'
  });
});

// Test endpoint
app.get('/api/test', (req, res) => {
  res.json({ 
    message: 'Backend is working!',
    timestamp: new Date().toISOString()
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, '0.0.0.0', () => {
  console.log('');
  console.log('✅ Server running successfully!');
  console.log(`🌐 Local:   http://localhost:${PORT}`);
  console.log(`🌐 Network: http://192.168.10.3:${PORT}`);
  console.log(`📡 Test:    http://localhost:${PORT}/api/test`);
  console.log('');
  console.log('📱 Frontend should connect to: http://192.168.10.3:5000');
  console.log('');
});


