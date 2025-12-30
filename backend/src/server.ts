import http from 'http';
import { config } from './config/env';
import { connectDB } from './config/db';
import app from './app';

const startServer = async () => {
    // Connect to Database
    await connectDB();

    const server = http.createServer(app);

    server.listen(config.PORT, () => {
        console.log(`Server running in ${config.NODE_ENV} mode on port ${config.PORT}`);
    });

    // Handle unhandled promise rejections
    process.on('unhandledRejection', (err: any) => {
        console.log('UNHANDLED REJECTION! 💥 Shutting down...');
        console.log(err.name, err.message);
        server.close(() => {
            process.exit(1);
        });
    });
};

startServer();
