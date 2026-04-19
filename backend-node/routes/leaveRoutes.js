// Routes for Leave Management
const express = require('express');
const { body } = require('express-validator');
const leaveController = require('../controllers/leaveController');
const { authenticateToken, authorizeRole } = require('../middleware/authMiddleware');

const router = express.Router();

// Apply leave
router.post('/apply', authenticateToken, [
    body('employee_id').isInt(),
    body('leave_type').isIn(['Sick', 'Casual', 'Annual', 'Personal']),
    body('start_date').isISO8601(),
    body('end_date').isISO8601()
], leaveController.applyLeave);

// Approve or reject leave
router.put('/:id', authenticateToken, authorizeRole('Admin'), leaveController.updateLeaveStatus);

// Get leave history
router.get('/history/all', authenticateToken, leaveController.getLeaveHistory);

// Get all leave requests (Admin only)
router.get('/admin/all', authenticateToken, authorizeRole('Admin'), leaveController.getAllLeaveRequests);

// Get leave balance
router.get('/balance/check', authenticateToken, leaveController.getLeaveBalance);

module.exports = router;
