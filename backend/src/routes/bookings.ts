import express from 'express';
import { createBooking, getUserBookings, cancelBooking, getAllBookings } from '../resources/booking/controller';
import { authenticateToken, isAdmin } from '../middleware/auth';

const router = express.Router();

// All booking routes require authentication
router.use(authenticateToken);

// Create a new booking
router.post('/', createBooking);

// Get user's bookings
router.get('/user', getUserBookings);

// Cancel a booking
router.delete('/:id', cancelBooking);

// Admin routes
router.get('/admin', isAdmin, getAllBookings);

export default router; 