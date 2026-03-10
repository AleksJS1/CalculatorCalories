const mongoose = require('mongoose');
const { env } = require('./env');

async function connectDatabase() {
  mongoose.set('strictQuery', true);
  await mongoose.connect(env.mongoUri, {
    serverSelectionTimeoutMS: 5000
  });
  return mongoose.connection;
}

function registerConnectionEvents(logger = console) {
  mongoose.connection.on('connected', () => {
    logger.info('MongoDB connected');
  });

  mongoose.connection.on('disconnected', () => {
    logger.warn('MongoDB disconnected');
  });

  mongoose.connection.on('error', (error) => {
    logger.error('MongoDB error', error);
  });
}

async function closeDatabase() {
  await mongoose.connection.close();
}

module.exports = {
  connectDatabase,
  registerConnectionEvents,
  closeDatabase
};
