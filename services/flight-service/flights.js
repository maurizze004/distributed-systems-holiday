import express from 'express';
import {
  getAllFlights,
  getFlightById,
  createFlight,
  updateFlight,
  deleteFlight
} from './flightController.js';

const router = express.Router();

// Öffentliche Routen
/**
 * @swagger
 * tags:
 *   name: Flights
 *   description: Flugmanagement und Abfrage
 */

/**
 * @swagger
 * /flights/get:
 *   get:
 *     summary: Alle Flüge abrufen
 *     tags: [Flights]
 *     responses:
 *       200:
 *         description: Erfolgreich abgerufen. Gibt eine Liste aller Flüge zurück.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Flight'
 */
router.get('/get', getAllFlights);

/**
 * @swagger
 * /flights/find:
 *   get:
 *     summary: Flüge nach Zielflughafen suchen
 *     tags: [Flights]
 *     parameters:
 *       - in: query
 *         name: city
 *         schema:
 *           type: string
 *         required: true
 *         description: Zielflughafen (z. B. FRA, BER, LHR)
 *     responses:
 *       200:
 *         description: Erfolgreich abgerufen. Gibt alle Flüge mit passendem Zielflughafen zurück.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Flight'
 *       400:
 *         description: Stadtparameter fehlt
 *       404:
 *         description: Keine passenden Flüge gefunden
 */
router.get('/find', getFlightById);

/**
 * @swagger
 * /flights/create:
 *   post:
 *     summary: Neuen Flug erstellen (Admin)
 *     tags: [Flights]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/NewFlight'
 *     responses:
 *       201:
 *         description: Flug erfolgreich erstellt
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Flight'
 *       400:
 *         description: Fehlerhafte Anfrage
 */
router.post('/create', createFlight);

/**
 * @swagger
 * /flights/update/{id}:
 *   put:
 *     summary: Flug aktualisieren (Admin)
 *     tags: [Flights]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Die ID des Flugs
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/NewFlight'
 *     responses:
 *       200:
 *         description: Flug erfolgreich aktualisiert
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Flight'
 *       400:
 *         description: Fehlerhafte Anfrage
 *       404:
 *         description: Flug nicht gefunden
 */
router.put('/update/:id', updateFlight);

/**
 * @swagger
 * /flights/delete/{id}:
 *   delete:
 *     summary: Flug löschen (Admin)
 *     tags: [Flights]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Die ID des Flugs
 *     responses:
 *       200:
 *         description: Flug erfolgreich gelöscht
 *       404:
 *         description: Flug nicht gefunden
 */
router.delete('/delete/:id', deleteFlight);

export default router;

/**
 * @swagger
 * components:
 *   schemas:
 *     NewFlight:
 *       type: object
 *       required:
 *         - airline
 *         - flight_number
 *         - departure_airport
 *         - arrival_airport
 *         - departure_time
 *         - arrival_time
 *         - price
 *         - seats_available
 *       properties:
 *         airline:
 *           type: string
 *         flight_number:
 *           type: string
 *         departure_airport:
 *           type: string
 *         arrival_airport:
 *           type: string
 *         departure_time:
 *           type: string
 *           format: date-time
 *         arrival_time:
 *           type: string
 *           format: date-time
 *         price:
 *           type: number
 *         seats_available:
 *           type: integer
 *       example:
 *         airline: "Lufthansa"
 *         flight_number: "LH123"
 *         departure_airport: "MUC"
 *         arrival_airport: "BER"
 *         departure_time: "2025-06-01T08:00:00.000Z"
 *         arrival_time: "2025-06-01T09:00:00.000Z"
 *         price: 120.50
 *         seats_available: 85
 * 
 *     Flight:
 *       allOf:
 *         - $ref: '#/components/schemas/NewFlight'
 *         - type: object
 *           properties:
 *             _id:
 *               type: string
 *               description: Automatisch vergebene ID des Flugs
 */

