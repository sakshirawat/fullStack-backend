const express = require('express');
const authController = require('../controllers/auth');
const validation = require('../middleware/validation');
const isAuth = require('../middleware/isAuth');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Authentication
 *   description: User signup, signin, and profile management
 */

/**
 * @swagger
 * /api/auth/signup:
 *   post:
 *     summary: Register a new user
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *               - confirmPassword
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               confirmPassword:
 *                 type: string
 *     responses:
 *       201:
 *         description: User created
 *       400:
 *         description: Validation error
 */
router.post('/signup', (req, res, next) => {
  console.log('🔔 signup route hit');
  next();
}, validation.validateUser, authController.signUp);

/**
 * @swagger
 * /api/auth/signin:
 *   post:
 *     summary: Sign in a registered user
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful, JWT token returned
 *       401:
 *         description: Invalid credentials
 */
router.post('/signin', validation.validateLogin, authController.login);

/**
 * @swagger
 * /api/auth/postProfile:
 *   post:
 *     summary: Add patient profile details
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               fullName:
 *                 type: string
 *               age:
 *                 type: number
 *               gender:
 *                 type: string
 *               phone:
 *                 type: string
 *     responses:
 *       200:
 *         description: Profile data saved
 *       401:
 *         description: Unauthorized
 */
router.post('/postProfile', isAuth, authController.addPatientDetails);

/**
 * @swagger
 * /api/auth/getProfile:
 *   get:
 *     summary: Get logged-in user's profile
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User profile returned
 *       401:
 *         description: Unauthorized
 */
router.get('/getProfile', isAuth, authController.getPatientDetails);

// Optional route logger
router.use((req, res, next) => {
  console.log(`➡️ /auth route accessed: ${req.method} ${req.originalUrl}`);
  next();
});

module.exports = router;
