require('dotenv').config();
const mongoose = require('mongoose');

async function clearDB() {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/job_portal';
    console.log('Connecting to:', mongoUri);
    await mongoose.connect(mongoUri);
    console.log('Successfully connected to MongoDB.');
    await mongoose.connection.db.dropDatabase();
    console.log('Database cleared completely! All old users and jobs have been removed.');
    process.exit(0);
  } catch (err) {
    console.error('Error clearing database:', err);
    process.exit(1);
  }
}

clearDB();
