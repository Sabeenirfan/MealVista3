const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // Check if MONGO_URI is defined
    if (!process.env.MONGO_URI) {
      console.error('❌ MongoDB connection failed: MONGO_URI is not defined in .env file');
      console.error('Please create a .env file in the backend directory with:');
      console.error('MONGO_URI=mongodb://localhost:27017/mealvista');
      console.error('OR for MongoDB Atlas:');
      console.error('MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/mealvista');
      process.exit(1);
    }

    const mongoUri = process.env.MONGO_URI.trim();
    
    if (!mongoUri || mongoUri === '') {
      console.error('❌ MongoDB connection failed: MONGO_URI is empty in .env file');
      process.exit(1);
    }

    console.log('🔄 Connecting to MongoDB...');
    await mongoose.connect(mongoUri);

    console.log('✅ MongoDB Connected successfully');
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error.message);
    console.error('Please check:');
    console.error('1. MongoDB is running (for local) or connection string is correct (for Atlas)');
    console.error('2. MONGO_URI in .env file is correct');
    console.error('3. Network connectivity');
    process.exit(1);
  }
};

module.exports = connectDB;