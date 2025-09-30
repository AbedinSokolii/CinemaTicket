import express from 'express';
import { getOccupiedSeats, createSeats, deleteSeats } from './controller';
import { protect } from '../../utils/auth';

const seatsRouter = express.Router();

// Debug middleware
seatsRouter.use((req, res, next) => {
    console.log("working route");
    next();
});

// Public routes
seatsRouter.get('/:movieId/:showTime', getOccupiedSeats);

// Protected routes
seatsRouter.post('/', protect, createSeats);
seatsRouter.delete('/:bookingId', protect, deleteSeats);

export default seatsRouter; 