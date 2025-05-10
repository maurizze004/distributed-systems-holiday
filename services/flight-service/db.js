import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const config = {
    PORT:3000,
    MONGOURL: 'mongodb://127.0.0.1:27017/TM-Flights',
};

const connectDB = async () => {
    try {
        await mongoose.connect(config.MONGOURL);
        console.log('Connected to MongoDB');
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
        process.exit(1);
    }
};

export { connectDB, config };