const mongoose = require('mongoose');
const dns = require('dns');

// Force IPv4 (VERY IMPORTANT)
dns.setDefaultResultOrder('ipv4first');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
      family: 4,
      tls: true,
    });

    console.log(`✅ MongoDB Atlas connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ MongoDB connection error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;