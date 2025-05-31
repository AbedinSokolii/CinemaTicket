import express from 'express';
import { getOccupiedSeats, createSeats, deleteSeats } from '../resources/seat/controller';

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

router.get('/:movieId/:showTime', getOccupiedSeats);
router.post('/', createSeats);
router.delete('/:bookingId', deleteSeats);

export default router; 