import express from 'express';
import Hotel from './hotel.js';

const router = express.Router();

// Route to get all hotel
router.get('/get', async (req, res) => {
    try {
        const hotelData = await Hotel.find();
        res.json(hotelData);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving hotels', error });
    }
});

export default router;