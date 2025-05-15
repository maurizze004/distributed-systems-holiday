import express from 'express';
import {
    getAllFlights,
    getFlightById,
    createFlight,
    updateFlight,
    deleteFlight
} from './flightController.js';

// import { isAdmin } from '../authMiddleware.js'; // [6][8]

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
router.get('/get', getAllFlights); // Alle Flüge abrufen
/**
 * @swagger
 * /flights/find:
 *   get:
 *     summary: Flug nach ID abrufen
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
 *         description: Erfolgreich abgerufen. Gibt den Flug zurück.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Flight'
 *       404:
 *         description: Flug nicht gefunden
 */
router.get('/find', getFlightById); // Flug nach ID abrufen

// Geschützte Routen (nur für Admins)
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
 *             $ref: '#/components/schemas/Flight'
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
router.post('/create', createFlight); // Neuen Flug erstellen
/**
 * @swagger
 * /flights/update/:id:
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
 *             $ref: '#/components/schemas/Flight'
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
router.put('/update/:id', updateFlight); // Flug aktualisieren
/**
 * @swagger
 * /flights/delete/:id:
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
 *       204:
 *         description: Flug erfolgreich gelöscht
 *       404:
 *         description: Flug nicht gefunden
 */
router.delete('/delete/:id', deleteFlight); // Flug löschen

// // Geschützte Routen (nur für Admins)
// router.post('/', isAdmin, createFlight); // Neuen Flug erstellen
// router.put('/:id', isAdmin, updateFlight); // Flug aktualisieren
// router.delete('/:id', isAdmin, deleteFlight); // Flug löschen

// Exportiere den Router
export default router;
/**
 * @swagger
 * components:
 *   schemas:
 *     Flight:
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
 *         _id:
 *           type: string
 *           description: Die automatisch vergebene ID des Flugs
 *         airline:
 *           type: string
 *           description: Name der Fluggesellschaft
 *         flight_number:
 *           type: string
 *           description: Flugnummer
 *         departure_airport:
 *           type: string
 *           description: Abflughafen
 *         arrival_airport:
 *           type: string
 *           description: Zielflughafen
 *         departure_time:
 *           type: string
 *           format: date-time
 *           description: Abflugzeit
 *         arrival_time:
 *           type: string
 *           format: date-time
 *           description: Ankunftszeit
 *         price:
 *           type: number
 *           description: Preis des Flugs
 *         seats_available:
 *           type: integer
 *           description: Verfügbare Sitzplätze
 *       example:
 *         _id: "6644e1f3c8e4a2b1c8f4a2b1"
 *         airline: "KLM"
 *         flight_number: "AI675"
 *         departure_airport: "LHR"
 *         arrival_airport: "FRA"
 *         departure_time: "2025-05-09T19:19:29.306Z"
 *         arrival_time: "2025-05-09T22:19:29.306Z"
 *         price: 155.75
 *         seats_available: 128
 */