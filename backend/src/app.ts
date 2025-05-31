import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import { json } from 'body-parser';
import { userRoutes, movieRoutes, bookingRoutes, seatRoutes } from './routes';

const app = express();

// Middleware
app.use(cors());
app.use(morgan('dev'));
app.use(json());

// Routes
app.use('/api/users', userRoutes);
app.use('/api/movies', movieRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/seats', seatRoutes);

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error('Error:', err);
    res.status(err.status || 500).json({
        message: err.message || 'Internal server error',
        error: process.env.NODE_ENV === 'development' ? err : {}
    });
});

// 404 handler
app.use((req: express.Request, res: express.Response) => {
    res.status(404).json({
        message: `Cannot ${req.method} ${req.url}`
    });
});

export default app; 