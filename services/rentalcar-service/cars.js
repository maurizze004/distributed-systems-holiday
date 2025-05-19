import express from "express";

import {
    getAllCars,
    searchCars,
    createCar,
    updateCar,
    deleteCar, getCarById
} from "./carController.js";
import {getHotelById} from "hotel-service/hotelController.js";

const router = express.Router();

// Öffentliche Routen
/**
 * @swagger
 * tags:
 *   name: Cars
 *   description: Autoverwaltung und Abfrage
 */

/**
 * @swagger
 * /cars/get:
 *   get:
 *     summary: Alle Autos abrufen
 *     tags: [Cars]
 *     responses:
 *       200:
 *         description: Liste aller Autos
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Car'
 */
router.get("/get", getAllCars);

router.get('/get/:id', getCarById);
/**
 * @swagger
 * /cars/find:
 *   get:
 *     summary: Autos nach Marke, Modell oder Klasse suchen
 *     tags: [Cars]
 *     parameters:
 *       - in: query
 *         name: query
 *         schema:
 *           type: string
 *         required: true
 *         description: Suchbegriff für Marke, Modell oder Klasse
 *     responses:
 *       200:
 *         description: Gefundene Autos
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Car'
 *       400:
 *         description: Ungültige Anfrage
 *       404:
 *         description: Keine Autos gefunden
 */
router.get("/find", searchCars);

// ADMIN Routen
/**
 * @swagger
 * /cars/create:
 *   post:
 *     summary: Neues Auto erstellen (Admin)
 *     tags: [Cars]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Car'
 *     responses:
 *       201:
 *         description: Auto erfolgreich erstellt
 *       400:
 *         description: Fehler beim Erstellen
 */
router.post("/create", createCar);
/**
 * @swagger
 * /cars/update/{id}:
 *   put:
 *     summary: Auto aktualisieren (Admin)
 *     tags: [Cars]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID des Autos
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Car'
 *     responses:
 *       200:
 *         description: Auto erfolgreich aktualisiert
 *       400:
 *         description: Fehler beim Aktualisieren
 */
router.put("/update/:id", updateCar);
/**
 * @swagger
 * /cars/delete/{id}:
 *   delete:
 *     summary: Auto löschen (Admin)
 *     tags: [Cars]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID des Autos
 *     responses:
 *       200:
 *         description: Auto erfolgreich gelöscht
 *       404:
 *         description: Auto nicht gefunden
 *       500:
 *         description: Fehler beim Löschen
 */
router.delete("/delete/:id", deleteCar);

export default router;

/**
 * @swagger
 * components:
 *   schemas:
 *     Car:
 *       type: object
 *       required:
 *         - brand
 *         - model
 *         - daily_rate
 *         - year
 *         - power
 *         - fuel_type
 *         - class
 *         - is_available
 *       properties:
 *         _id:
 *           type: string
 *           description: Automatisch generierte ID
 *         brand:
 *           type: string
 *           example: BMW
 *         model:
 *           type: string
 *           example: M3
 *         daily_rate:
 *           type: number
 *           format: float
 *           example: 119.99
 *         year:
 *           type: integer
 *           example: 2020
 *         power:
 *           type: integer
 *           example: 480
 *         fuel_type:
 *           type: string
 *           example: Benzin
 *         class:
 *           type: string
 *           example: Sportwagen
 *         is_available:
 *           type: boolean
 *           example: true
 *         occupied_until:
 *           type: string
 *           format: date
 *           example: 2025-06-01
 *         imageUrl:
 *           type: string
 *           example: https://example.com/images/bmw-m3.jpg
 */