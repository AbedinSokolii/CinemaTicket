import express from 'express';
import { getOccupiedSeats, createSeats, deleteSeats } from './controller';
import { protect } from '../../utils/auth';

const router = express.Router();

// Debug middleware
router.use((req, res, next) => {
    console.log('Seats Route:', {
        method: req.method,
        url: req.url,
        params: req.params,
        query: req.query,
        body: req.body
    });
    next();
});

// Public routes
router.get('/:movieId/:showTime', getOccupiedSeats);

// Protected routes
router.post('/', protect, createSeats);
router.delete('/:bookingId', protect, deleteSeats);

export default router; 