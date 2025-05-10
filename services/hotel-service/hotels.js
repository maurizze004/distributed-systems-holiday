import express from 'express';
import Hotel from './hotel.js';

const router = express.Router();

// Route to get all hotels
router.get('/get', async (req, res) => {
    try {
        const hotelData = await Hotel.find();
        res.json(hotelData);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving hotels', error });
    }
});

// Route to search hotels by name or location
router.get('/find', async (req, res) => {
    try {
        const { query } = req.query;

        if (!query || query.trim() === '') {
            return res.status(400).json({ message: 'Query parameter is required' });
        }

        // Case-insensitive partial match for name or location
        const hotels = await Hotel.find({
            $or: [
                { name: { $regex: query, $options: 'i' } },
                { location: { $regex: query, $options: 'i' } }
            ]
        });

        // If no hotels are found, return an empty array
        res.json(hotels);
    } catch (error) {
        res.status(500).json({ message: 'Error searching hotels', error });
    }
});

export default router;