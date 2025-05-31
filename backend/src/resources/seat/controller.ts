import { Request, Response } from 'express';
import Seat from './model';
import Booking from '../booking/model';

export const getOccupiedSeats = async (req: Request, res: Response) => {
    try {
        const { movieId, showTime } = req.params;
        
        // Debug log
        console.log('Getting occupied seats:', {
            movieId,
            showTime,
            decodedShowTime: decodeURIComponent(showTime)
        });

        if (!movieId || !showTime) {
            return res.status(400).json({
                message: 'Missing required parameters',
                params: { movieId, showTime }
            });
        }

        // Decode the showTime parameter
        const decodedShowTime = decodeURIComponent(showTime);

        const seats = await Seat.findAll({
            where: {
                movieId: parseInt(movieId),
                showTime: decodedShowTime,
                isOccupied: true
            },
            attributes: ['id', 'seatRow', 'seatColumn', 'isOccupied']
        });

        // Debug log
        console.log('Found seats:', seats);

        return res.json(seats);
    } catch (error) {
        console.error('Get occupied seats error:', error);
        return res.status(500).json({ 
            message: 'Error fetching occupied seats',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
};

export const createSeats = async (req: Request, res: Response) => {
    try {
        const { bookingId, seats } = req.body;

        if (!bookingId || !seats || !Array.isArray(seats)) {
            return res.status(400).json({
                message: 'Invalid request body',
                received: { bookingId, seats }
            });
        }

        // Validate booking exists
        const booking = await Booking.findByPk(bookingId);
        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }

        // Check if any seats are already occupied
        const existingSeats = await Seat.findAll({
            where: {
                movieId: booking.movieId,
                showTime: booking.showTime,
                isOccupied: true
            }
        });

        // Check for conflicts
        const conflicts = seats.filter(seat => 
            existingSeats.some(existing => 
                existing.seatRow === seat.row && 
                existing.seatColumn === seat.column
            )
        );

        if (conflicts.length > 0) {
            return res.status(409).json({
                message: 'Some seats are already occupied',
                conflicts
            });
        }

        // Create seats
        const createdSeats = await Promise.all(
            seats.map((seat: any) => 
                Seat.create({
                    bookingId,
                    movieId: booking.movieId,
                    showTime: booking.showTime,
                    seatRow: seat.row,
                    seatColumn: seat.column,
                    isOccupied: true
                })
            )
        );

        return res.status(201).json(createdSeats);
    } catch (error) {
        console.error('Create seats error:', error);
        return res.status(500).json({ 
            message: 'Error creating seats',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
};

export const deleteSeats = async (req: Request, res: Response) => {
    try {
        const { bookingId } = req.params;

        if (!bookingId) {
            return res.status(400).json({
                message: 'Missing bookingId parameter'
            });
        }

        const result = await Seat.destroy({
            where: { bookingId }
        });

        if (result === 0) {
            return res.status(404).json({
                message: 'No seats found for this booking'
            });
        }

        return res.json({ 
            message: 'Seats deleted successfully',
            count: result
        });
    } catch (error) {
        console.error('Delete seats error:', error);
        return res.status(500).json({ 
            message: 'Error deleting seats',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
}; 