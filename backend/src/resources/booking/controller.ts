import { Request, Response } from 'express';
import BookingModel from './model';
import Movie from '../movie/model';
import User from '../user/model';
import SeatModel from '../seat/model';
import { Op } from 'sequelize';

export const createBooking = async (req: Request, res: Response) => {
    try {
        console.log('Creating booking with data:', req.body);
        const { movieId, showTime, adultCount, childCount, totalPrice, seats } = req.body;
        const userId = req.user?.id;

        // Debug logs
        console.log('User ID:', userId);
        console.log('Movie ID:', movieId);
        console.log('Show Time:', showTime);
        console.log('Seats:', seats);

        if (!userId) {
            return res.status(401).json({ message: 'User not authenticated' });
        }

        if (!seats || !Array.isArray(seats) || seats.length === 0) {
            return res.status(400).json({ 
                message: 'Invalid seats data',
                received: seats
            });
        }

        // Validate movie exists
        const movie = await Movie.findByPk(movieId);
        if (!movie) {
            return res.status(404).json({ message: 'Movie not found' });
        }

        // Validate showtime is available
        if (!movie.showTimes.includes(showTime)) {
            return res.status(400).json({ 
                message: 'Invalid showtime',
                available: movie.showTimes,
                received: showTime
            });
        }

        // Validate seats are available
        const occupiedSeats = await SeatModel.findAll({
            where: {
                movieId,
                showTime,
                isOccupied: true,
                [Op.or]: seats.map((s: any) => ({
                    seatRow: s.seatRow,
                    seatColumn: s.seatColumn
                }))
            }
        });

        if (occupiedSeats.length > 0) {
            return res.status(409).json({ 
                message: 'Some seats are already occupied',
                occupiedSeats
            });
        }

        console.log('Creating booking record...');
        // Create booking
        const booking = await BookingModel.create({
            userId,
            movieId,
            showTime,
            adultCount,
            childCount,
            totalPrice
        });
        console.log('Booking created:', booking.id);

        // Create seats
        try {
            console.log('Creating seat records...');
            const createdSeats = await Promise.all(
                seats.map((seat: any) => 
                    SeatModel.create({
                        bookingId: booking.id,
                        movieId,
                        showTime,
                        seatRow: seat.seatRow,
                        seatColumn: seat.seatColumn,
                        isOccupied: true
                    })
                )
            );
            console.log('Seats created:', createdSeats.length);

            // Return booking with seats
            const bookingWithSeats = {
                ...booking.toJSON(),
                seats: createdSeats
            };

            return res.status(201).json(bookingWithSeats);
        } catch (error) {
            // If seat creation fails, delete the booking
            console.error('Seat creation error:', error);
            await booking.destroy();
            return res.status(409).json({ 
                message: 'Failed to create seats. The seats might have been taken.',
                error: error instanceof Error ? error.message : 'Unknown error'
            });
        }
    } catch (e) {
        console.error('Create booking error:', e);
        return res.status(500).json({ 
            message: 'Error creating booking',
            error: e instanceof Error ? e.message : 'Unknown error'
        });
    }
};

export const getUserBookings = async (req: Request, res: Response) => {
    try {
        const userId = req.user?.id;
        console.log('User ID from request:', userId);
        console.log('Full user object:', req.user);

        if (!userId) {
            return res.status(401).json({ message: 'User not authenticated' });
        }

        console.log('Attempting to fetch bookings for user:', userId);
        const bookings = await BookingModel.findAll({
            where: { userId },
            include: [
                {
                    model: Movie,
                    attributes: ['name', 'imageSrc', 'duration']
                },
                {
                    model: SeatModel,
                    as: 'seats',
                    attributes: ['seatRow', 'seatColumn']
                }
            ],
            order: [['createdAt', 'DESC']]
        });
        console.log('Found bookings:', bookings);

        return res.json(bookings);
    } catch (e) {
        console.error('Get user bookings error - Full error:', e);
        console.error('Error message:', e.message);
        console.error('Error stack:', e.stack);
        return res.status(500).json({ 
            message: 'Error fetching bookings',
            error: e.message 
        });
    }
};

export const cancelBooking = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const userId = req.user?.id;
        const isAdmin = req.user?.isAdmin;

        console.log('Cancel booking request:', {
            bookingId: id,
            userId: userId,
            isAdmin: isAdmin
        });

        if (!userId) {
            return res.status(401).json({ message: 'User not authenticated' });
        }

        // Find the booking
        const booking = await BookingModel.findByPk(id);

        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }

        // Check if user has permission to cancel this booking
        if (!isAdmin && booking.userId !== userId) {
            return res.status(403).json({ 
                message: 'You do not have permission to cancel this booking'
            });
        }

        // Delete associated seats first
        await SeatModel.destroy({
            where: { bookingId: id }
        });

        // Then delete the booking
        await booking.destroy();
        
        console.log('Booking cancelled successfully:', {
            bookingId: id,
            cancelledBy: isAdmin ? 'admin' : 'user'
        });

        return res.json({ 
            message: 'Booking cancelled successfully',
            bookingId: id
        });
    } catch (e) {
        console.error('Cancel booking error:', e);
        return res.status(500).json({ 
            message: 'Error cancelling booking',
            error: e instanceof Error ? e.message : 'Unknown error'
        });
    }
};

export const getAllBookings = async (req: Request, res: Response) => {
    try {
        console.log('Getting all bookings...');
        console.log('User:', req.user?.email);
        console.log('Is Admin:', req.user?.isAdmin);
        
        // First, check if there are any bookings at all
        const totalBookings = await BookingModel.count();
        console.log('Total bookings in database:', totalBookings);

        const bookings = await BookingModel.findAll({
            include: [
                {
                    model: Movie,
                    attributes: ['name', 'imageSrc', 'duration']
                },
                {
                    model: User,
                    attributes: ['email', 'firstName', 'lastName']
                },
                {
                    model: SeatModel,
                    as: 'seats',
                    attributes: ['seatRow', 'seatColumn']
                }
            ],
            order: [['createdAt', 'DESC']]
        });

        console.log('Found bookings:', bookings.length);
        
        // Convert to plain objects for response
        const bookingsData = bookings.map(booking => booking.get({ plain: true }));
        
        if (bookingsData.length > 0) {
            console.log('Sample booking (first one):', JSON.stringify(bookingsData[0], null, 2));
        }

        return res.json(bookingsData);
    } catch (e) {
        console.error('Get all bookings error:', e);
        return res.status(500).json({ message: 'Error fetching bookings' });
    }
}; 