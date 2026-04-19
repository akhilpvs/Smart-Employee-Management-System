// Routes for Attendance
const express = require('express');
const attendanceController = require('../controllers/attendanceController');
const { authenticateToken } = require('../middleware/authMiddleware');

const router = express.Router();

// Check-in
router.post('/checkin', authenticateToken, attendanceController.checkIn);

// Check-out
router.post('/checkout', authenticateToken, attendanceController.checkOut);

// Get attendance records
router.get('/', authenticateToken, attendanceController.getAttendance);

// Get monthly report
router.get('/report/monthly', authenticateToken, attendanceController.getMonthlyReport);

module.exports = router;
