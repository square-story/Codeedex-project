import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import { errorHandler, AppError } from './middleware/errorHandler';
// Force model registration
import './models/Role';

const app = express();

// Global Middlewares
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(cookieParser());

import authRoutes from './auth/auth.routes';
import userRoutes from './users/user.routes';
import roleRoutes from './roles/role.routes';
import auditRoutes from './audit/audit.routes';

// Routes
app.use('/auth', authRoutes);
app.use('/users', userRoutes);
app.use('/roles', roleRoutes);
app.use('/audit-logs', auditRoutes);

// Test Route / Health Check
app.get('/health', (req: Request, res: Response) => {
    res.status(200).json({
        success: true,
        message: 'Server is healthy',
        timestamp: new Date().toISOString(),
    });
});

// Root Route
app.get('/', (req: Request, res: Response) => {
    res.status(200).json({
        success: true,
        message: 'Welcome to the Codeedex Project API',
    });
})

// Unhandled Routes
app.use((req: Request, res: Response, next: NextFunction) => {
    next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

// Global Error Handler
app.use(errorHandler);

export default app;
