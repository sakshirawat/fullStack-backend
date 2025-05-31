const express = require('express');
const appointController = require('../controllers/appointment');
const validation = require('../middleware/validation');
const isAuth = require('../middleware/isAuth');
const upload = require('../middleware/multer');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Appointments
 *   description: Endpoints related to appointment booking and services
 */

/**
 * @swagger
 * /api/appointment/bookAppointment:
 *   post:
 *     summary: Book a new appointment (upload report file supported)
 *     tags: [Appointments]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               doctorId:
 *                 type: string
 *               date:
 *                 type: string
 *               time:
 *                 type: string
 *               report:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Appointment booked successfully
 */
router.post('/bookAppointment', upload.single('report'), isAuth, appointController.bookAppointment);

/**
 * @swagger
 * /api/appointment/services:
 *   get:
 *     summary: Get all available services
 *     tags: [Appointments]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Services listed
 */
router.get('/services', isAuth, appointController.getAllServices);

/**
 * @swagger
 * /api/appointment/myAppointments:
 *   get:
 *     summary: Get appointments for the logged-in user
 *     tags: [Appointments]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User's appointments listed
 */
router.get('/myAppointments', isAuth, appointController.getUserAppointments);

/**
 * @swagger
 * /api/appointment/addAvailableAppointments:
 *   post:
 *     summary: Add available appointment slots (admin/doctor use)
 *     tags: [Appointments]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               doctorId:
 *                 type: string
 *               date:
 *                 type: string
 *               slots:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       201:
 *         description: Slots added
 */
router.post('/addAvailableAppointments', appointController.addAvailableAppointment);

/**
 * @swagger
 * /api/appointment/getDoctors:
 *   get:
 *     summary: Get all doctors
 *     tags: [Appointments]
 *     responses:
 *       200:
 *         description: List of doctors
 */
router.get('/getDoctors', appointController.getDoctors);

/**
 * @swagger
 * /api/appointment/addDoctor:
 *   post:
 *     summary: Add a new doctor
 *     tags: [Appointments]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               specialization:
 *                 type: string
 *     responses:
 *       201:
 *         description: Doctor added
 */
router.post('/addDoctor', appointController.addDoctor);

/**
 * @swagger
 * /api/appointment/getAvailableAppointment:
 *   post:
 *     summary: Get available slots for a doctor on a given date
 *     tags: [Appointments]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               doctorId:
 *                 type: string
 *               date:
 *                 type: string
 *     responses:
 *       200:
 *         description: Available slots returned
 */
router.post('/getAvailableAppointment', appointController.getAvailableSlots);

/**
 * @swagger
 * /api/appointment/joinAppointment:
 *   post:
 *     summary: Book a slot from the available appointments
 *     tags: [Appointments]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               appointmentId:
 *                 type: string
 *               slot:
 *                 type: string
 *     responses:
 *       200:
 *         description: Slot booked successfully
 */
router.post('/joinAppointment', appointController.joinSlot);

module.exports = router;
