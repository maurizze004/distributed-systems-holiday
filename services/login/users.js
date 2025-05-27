import express from 'express';
import {
    registerUser,
    loginUser,
    authenticateToken,
} from './userController.js';

const router = express.Router();

// Register a new user
/**
 * @swagger
 * /users/register:
 *   post:
 *     summary: Registriert einen neuen User
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *                 example: MaxMustermann
 *               password:
 *                 type: string
 *                 example: geheim123
 *               role:
 *                 type: string
 *                 enum: [admin, user]
 *                 example: user
 *     responses:
 *       201:
 *         description: User erfolgreich registriert
 *       400:
 *         description: Fehler bei der Registrierung
 */
router.post('/register', registerUser);

// Login a user
/**
 * @swagger
 * /users/login:
 *   post:
 *     summary: Loggt einen User ein und gibt ein JWT zurück
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *                 example: user@example.com
 *               password:
 *                 type: string
 *                 example: geheim123
 *     responses:
 *       200:
 *         description: Erfolgreicher Login, gibt JWT und Rolle zurück
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                 role:
 *                   type: string
 *                   enum: [admin, user]
 *       401:
 *         description: Ungültige Zugangsdaten
 */
router.post('/login', loginUser);

// Admin-Authentication
/**
 * @swagger
 * /users/admin:
 *   get:
 *     summary: Zugriff nur für Admins (JWT erforderlich)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Zugriff für Admin gewährt
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Admin access granted
 *                 user:
 *                   type: object
 *                   properties:
 *                     userId:
 *                       type: string
 *                     email:
 *                       type: string
 *                     role:
 *                       type: string
 *       401:
 *         description: Kein Token oder nicht authentifiziert
 *       403:
 *         description: Nicht berechtigt (keine Admin-Rolle)
 */
router.get('/admin', authenticateToken(['admin']), (req, res) => {
    res.json({ message: 'Admin access granted', user: req.user });
});

// User-Authentication
/**
 * @swagger
 * /users/user:
 *   get:
 *     summary: Zugriff nur für normale User (JWT erforderlich)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Zugriff für User gewährt
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User access granted
 *                 user:
 *                   type: object
 *                   properties:
 *                     userId:
 *                       type: string
 *                     email:
 *                       type: string
 *                     role:
 *                       type: string
 *       401:
 *         description: Kein Token oder nicht authentifiziert
 *       403:
 *         description: Nicht berechtigt (keine User-Rolle)
 */
router.get('/user', authenticateToken(['user', 'admin']), (req, res) => {
    res.json({ message: 'User access granted', user: req.user });
});

export default router;

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - username
 *         - password
 *       properties:
 *         username:
 *           type: string
 *           description: E-Mail des Users
 *         password:
 *           type: string
 *           description: Passwort des Users
 *         role:
 *           type: string
 *           description: Rolle des Users (admin oder user)
 *           enum: [admin, user]
 *       example:
 *         username: MaxMustermann
 *         password: geheim123
 *         role: user
 */