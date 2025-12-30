import mongoose from 'mongoose';
import { config } from './env';

export const connectDB = async (): Promise<void> => {
    try {
        const conn = await mongoose.connect(config.MONGO_URI);
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        if (error instanceof Error) {
            console.error(`Error: ${error.message}`);
        } else {
            console.error('Unknown database connection error');
        }
        process.exit(1);
    }
};
