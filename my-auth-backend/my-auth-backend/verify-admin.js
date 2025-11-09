const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();

const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/authDB';
    await mongoose.connect(mongoURI);
    console.log('✅ MongoDB Connected\n');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error.message);
    process.exit(1);
  }
};

async function verifyAdmin() {
  try {
    await connectDB();

    const adminEmail = 'admin@gmail.com';
    const admin = await User.findOne({ email: adminEmail });

    if (!admin) {
      console.log('❌ Admin not found with email:', adminEmail);
      process.exit(1);
    }

    console.log('📊 Admin Details in MongoDB:');
    console.log('   Email:', admin.email);
    console.log('   Name:', admin.name);
    console.log('   Role:', admin.role);
    console.log('   isAdmin:', admin.isAdmin);
    console.log('   Password Hash:', admin.password ? '✅ Set' : '❌ Not set');
    console.log('\n✅ Admin exists!');
    console.log('\n🔐 To login, use:');
    console.log('   Email:', adminEmail);
    console.log('   Password: (the password you set in create-admin.js)');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

verifyAdmin();







