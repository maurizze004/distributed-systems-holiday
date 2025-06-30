import express from "express";

import {
    getRevById,
    getAllRevs,
    createReview,
    deleteRev,
    updateRev,
    getAverageRating
} from "./reviewController.js";

const router = express.Router();

// Öffentliche Routen
/**
 * @swagger
 * tags:
 *   name: Reviews
 *   description: Review Verwaltung und Abfrage
 */

/**
 * @swagger
 * /reviews/get:
 *   get:
 *     summary: Alle Reviews abrufen
 *     tags: [Reviews]
 *     responses:
 *       200:
 *         description: Liste aller Reviews
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Review'
 */
router.get("/get", getAllRevs);

router.get('/get/:id', getRevById);

// ADMIN Routen
/**
 * @swagger
 * /reviews/create:
 *   post:
 *     summary: Neues Review erstellen (Admin)
 *     tags: [Reviews]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Review'
 *     responses:
 *       201:
 *         description: Review erfolgreich erstellt
 *       400:
 *         description: Fehler beim Erstellen
 */
router.post("/create", createReview);
/**
 * @swagger
 * /reviews/update/{id}:
 *   put:
 *     summary: Review aktualisieren (Admin)
 *     tags: [Reviews]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID des Reviews
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Review'
 *     responses:
 *       200:
 *         description: Review erfolgreich aktualisiert
 *       400:
 *         description: Fehler beim Aktualisieren
 */
router.put("/update/:id", updateRev);
/**
 * @swagger
 * /reviews/delete/{id}:
 *   delete:
 *     summary: Review löschen (Admin)
 *     tags: [Reviews]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID des Reviews
 *     responses:
 *       200:
 *         description: Review erfolgreich gelöscht
 *       404:
 *         description: Review nicht gefunden
 *       500:
 *         description: Fehler beim Löschen
 */
router.delete("/delete/:id", deleteRev);

/**
 * @swagger
 * /reviews/getaverage/{type}/{id}:
 *   get:
 *     summary: Durchschnittsbewertung eines Objekts (Hotel, Flug oder Mietwagen) abrufen
 *     tags: [Reviews]
 *     parameters:
 *       - in: path
 *         name: type
 *         required: true
 *         schema:
 *           type: string
 *           enum: [hotel, flight, rentalcar]
 *         description: Typ des zu bewertenden Objekts (hotel, flight, rentalcar)
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID des Objekts (z.B. hotel_id, flight_id, rentalcar_id)
 *     responses:
 *       200:
 *         description: Durchschnittsbewertung und Anzahl der Bewertungen
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 average:
 *                   type: number
 *                   nullable: true
 *                   description: Durchschnittliche Bewertung (null, wenn keine Bewertungen)
 *                   example: 4.3
 *                 count:
 *                   type: integer
 *                   description: Anzahl der Bewertungen
 *                   example: 12
 *       400:
 *         description: Ungültiger Review-Typ
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Ungültiger Review-Typ"
 *       500:
 *         description: Serverfehler
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 */
router.get("/getaverage/:type/:id", getAverageRating);

export default router;

/**
 * @swagger
 * components:
 *   schemas:
 *     Review:
 *       type: object
 *       required:
 *         - carId
 *         - userId
 *         - rating
 *         - comment
 *       properties:
 *         _id:
 *           type: string
 *           description: Automatisch generierte ID
 *         carId:
 *           type: string
 *           description: ID des bewerteten Autos
 *           example: "64a82d7d39f12345678901234"
 *         userId:
 *           type: string
 *           description: ID des Bewertenden
 *           example: "64a82d7d39f12345678901235"
 *         rating:
 *           type: number
 *           minimum: 1
 *           maximum: 5
 *           example: 4.5
 *         comment:
 *           type: string
 *           example: "Sehr gutes Auto, hat Spaß gemacht!"
 *         date:
 *           type: string
 *           format: date-time
 *           example: "2024-01-20T14:30:00Z"
 */