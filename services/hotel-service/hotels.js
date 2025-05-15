import express from 'express';
import Hotel from './hotel.js';

const router = express.Router();


// Route to get all hotels
/**
 * @swagger
 * /hotels/get:
 *   get:
 *     summary: Gibt alle Hotels zurück
 *     responses:
 *       200:
 *         description: Erfolgreich
 */
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

// Route to create a new 
/**
 * @swagger
 * /hotels/create:
 *   post:
 *     summary: Legt ein neues Hotel an
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Hotel'
 *     responses:
 *       201:
 *         description: Hotel erfolgreich angelegt
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Hotel'
 */
router.post('/create', async (req, res) => {
    try {
        const newHotel = new Hotel(req.body);
        const savedHotel = await newHotel.save();
        res.status(201).json(savedHotel);
    } catch (error) {
        res.status(400).json({message: "Fehler beim Anlegene eines neuen Hotels", error})
    }
});

// Route to update a hotel by ID
router.put('/update/:id', async (req, res) => {
    try {
      const updatedHotel = await Hotel.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true, runValidators: true }
      );
      if (!updatedHotel) {
        return res.status(404).json({ message: 'Hotel nicht gefunden' });
      }
      res.json(updatedHotel);
    } catch (error) {
      res.status(400).json({ message: 'Fehler beim bearbeiten des Hotels', error });
    }rror 
});

// Route to delete a hotel by ID
router.delete('/delete/:id', async (req, res) => {
    try {
      const deletedHotel = await Hotel.findByIdAndDelete(req.params.id);
      if (!deletedHotel) {
        return res.status(404).json({ message: 'Hotel nicht gefunden' });
      }
      res.json({ message: 'Hotel erfolgreich gelöscht' });
    } catch (error) {
      res.status(400).json({ message: 'Fehler beim löschen des Hotels', error });
    }
});

export default router;