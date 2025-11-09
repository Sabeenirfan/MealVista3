console.log('Starting test...');

try {
  console.log('Step 1: Loading express...');
  const express = require('express');
  console.log('✅ Express loaded');

  console.log('Step 2: Loading User model...');
  const User = require('./models/User');
  console.log('✅ User loaded');

  console.log('Step 3: Loading auth routes...');
  const authRoutes = require('./routes/auth');
  console.log('✅ Auth routes loaded');
  console.log('Auth routes value:', authRoutes);

} catch (error) {
  console.log('❌ ERROR:', error.message);
  console.log(error);
}

console.log('Test completed');