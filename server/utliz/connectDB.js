const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect('mongodb+srv://hasnainalam1166:Mp4PMkxrCabmF4ak@creativocluster.a6povkv.mongodb.net/?retryWrites=true&w=majority&appName=creativocluster');
    console.log('MongoDB connected...');
  } catch (err) {
    console.error(err.message);
    process.exit(1); // Exit process with failure
  }

  mongoose.connection.on('connected', () => {
    console.log('Mongoose connected to db...');
  });

  mongoose.connection.on('error', (err) => {
    console.log(err.message);
  });

  mongoose.connection.on('disconnected', () => {
    console.log('Mongoose connection is disconnected...');
  });

  process.on('SIGINT', async () => {
    await mongoose.connection.close();
    console.log('Mongoose connection is disconnected due to app termination...');
    process.exit(0);
  });
};

module.exports = connectDB;
