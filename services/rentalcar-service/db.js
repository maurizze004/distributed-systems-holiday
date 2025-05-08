import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const config = {
    PORT: process.env.PORT || 7000,
    MONGOURL: process.env.MONGO_URL,
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