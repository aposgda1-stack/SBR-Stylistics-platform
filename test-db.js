const mongoose = require('mongoose');

const MONGODB_URI = 'mongodb+srv://ruby:1asdfghjkl2zxcvbnm@cluster0.sluq2ca.mongodb.net/?appName=Cluster0';

async function testConnection() {
  try {
    console.log('Attempting to connect to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ SUCCESS: Connected to MongoDB Atlas successfully!');
    
    // Check if we can list collections (to verify permissions)
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log('Collections in database:', collections.map(c => c.name));
    
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB.');
  } catch (err) {
    console.error('❌ ERROR: Could not connect to MongoDB:', err.message);
  }
}

testConnection();
