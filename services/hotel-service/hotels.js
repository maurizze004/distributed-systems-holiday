import express from 'express';
import {
  getAllHotels,
  getHotelById,
  createHotel,
  updateHotel,
  deleteHotel
} from './hotelController.js';

const router = express.Router();

/**
 * @swagger
 * /hotels/get:
 *   get:
 *     summary: Gibt eine Liste aller Hotels zurück (optional mit Filter).
 *     tags: [Hotels]
 *     parameters:
 *       - in: query
 *         name: name
 *         schema:
 *           type: string
 *         description: Filtere Hotels nach Name
 *       - in: query
 *         name: location
 *         schema:
 *           type: string
 *         description: Filtere Hotels nach Ort
 *     responses:
 *       200:
 *         description: Liste der Hotels
*/
router.get('/get', getAllHotels);
/**
 * @swagger
 * /hotels/find:
 *   get:
 *     summary: Suche Hotels nach ID oder Suchbegriff (Name oder Ort).
 *     tags: [Hotels]
 *     parameters:
 *       - in: query
 *         name: query
 *         schema:
 *           type: string
 *         description: Suchbegriff (Name oder Ort)
 *     responses:
 *       200:
 *         description: Gefundene Hotels oder Hotel
 *       404:
 *         description: Kein Hotel gefunden
 */
router.get('/find', getHotelById);
/**
 * @swagger
 * /hotels/create:
 *   post:
 *     summary: Erstelle ein neues Hotel
 *     tags: [Hotels]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               location:
 *                 type: string
 *               stars:
 *                 type: integer
 *               price_per_night:
 *                 type: number
 *               amenities:
 *                 type: array
 *                 items:
 *                   type: string
 *               available_rooms:
 *                 type: integer
 *               description:
 *                 type: string
 *               image_url:
 *                 type: string
 *     responses:
 *       201:
 *         description: Hotel erstellt
 */
router.post('/create', createHotel);
/**
 * @swagger
 * /hotels/update/{id}:
 *   put:
 *     summary: Aktualisiere ein bestehendes Hotel
 *     tags: [Hotels]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Hotel-ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Hotel aktualisiert
 */
router.put('/update/:id', updateHotel);
/**
 * @swagger
 * /hotels/delete/{id}:
 *   delete:
 *     summary: Lösche ein Hotel
 *     tags: [Hotels]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Hotel-ID
 *     responses:
 *       200:
 *         description: Hotel erfolgreich gelöscht
 *       404:
 *         description: Hotel nicht gefunden
 */
router.delete('/delete/:id', deleteHotel);

export default router;

/**
 * @swagger
 * components:
 *   schemas:
 *     Hotel:
 *       type: object
 *       required:
 *         - name
 *         - location
 *         - price_per_night
 *       properties:
 *         _id:
 *           type: string
 *           description: Die automatisch vergebene ID des Hotels
 *         name:
 *           type: string
 *           description: Name des Hotels
 *         location:
 *           type: string
 *           description: Standort des Hotels
 *         stars:
 *           type: integer
 *           minimum: 1
 *           maximum: 5
 *           description: Sternebewertung
 *         price_per_night:
 *           type: number
 *           description: Preis pro Nacht in Euro
 *         amenities:
 *           type: array
 *           items:
 *             type: string
 *           description: Liste von Ausstattungsmerkmalen
 *         available_rooms:
 *           type: integer
 *           description: Verfügbare Zimmeranzahl
 *         description:
 *           type: string
 *           description: Beschreibung des Hotels
 *         image_url:
 *           type: string
 *           description: Bild-URL des Hotels
 *       example:
 *         name: Hotel Berlin Central
 *         location: Berlin
 *         stars: 4
 *         price_per_night: 89.99
 *         amenities: [WLAN, Frühstück, Fitnessstudio]
 *         available_rooms: 12
 *         description: Zentrales Hotel mit modernen Zimmern
 *         image_url: https://example.com/hotel.jpg
 */
