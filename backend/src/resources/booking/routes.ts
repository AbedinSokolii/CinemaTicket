import express from 'express';
import { createBooking, getUserBookings, cancelBooking, getAllBookings } from './controller';
import { authenticateToken, isAdmin } from '../../middleware/auth';

const bookingRouter = express.Router();

// All booking routes require authentication
// bookingRouter.use(authenticateToken);

// Create a new booking
bookingRouter.post('/', createBooking);

// Get user's bookings
bookingRouter.get('/user', getUserBookings);

// Cancel a booking
bookingRouter.delete('/:id', cancelBooking);

// Admin routes
bookingRouter.get('/admin/all', isAdmin, getAllBookings);

export default bookingRouter; 