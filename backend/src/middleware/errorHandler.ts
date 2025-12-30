import { Request, Response, NextFunction } from 'express';

export class AppError extends Error {
    statusCode: number;
    status: string;
    isOperational: boolean;

    constructor(message: string, statusCode: number) {
        super(message);
        this.statusCode = statusCode;
        this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
        this.isOperational = true;

        Error.captureStackTrace(this, this.constructor);
    }
}

export const errorHandler = (
    err: AppError | Error,
    req: Request,
    res: Response,
    next: NextFunction
): void => {
    const statusCode = (err as AppError).statusCode || 500;
    const status = (err as AppError).status || 'error';
    const message = err.message || 'Something went wrong';

    if (process.env.NODE_ENV === 'development') {
        res.status(statusCode).json({
            success: false,
            status,
            message,
            stack: err.stack,
            error: err,
        });
    } else {
        // Production: don't leak stack traces
        if ((err as AppError).isOperational) {
            res.status(statusCode).json({
                success: false,
                status,
                message,
            });
        } else {
            // Programming or other unknown error: don't leak exception details
            console.error('ERROR 💥', err);
            res.status(500).json({
                success: false,
                status: 'error',
                message: 'Something went really wrong!',
            });
        }
    }
};
