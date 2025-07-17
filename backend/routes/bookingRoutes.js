import express from 'express';
import {
    getSlots,
    createBooking,
    getAllBookings,
    deleteBooking,
    updateBooking,
} from '../controllers/bookingController.js';

const router = express.Router();

router.get('/slots', getSlots);         // Es: /api/slots?date=2025-07-13
router.post('/slots', createBooking);   // Es: body JSON con date e time
router.get('/bookings', getAllBookings); // Lista tutte le prenotazioni

export default router;

router.delete('/bookings/:id', deleteBooking);
router.put('/bookings/:id', updateBooking);
