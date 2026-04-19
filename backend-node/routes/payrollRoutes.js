// Routes for Payroll
const express = require('express');
const payrollController = require('../controllers/payrollController');
const { authenticateToken, authorizeRole } = require('../middleware/authMiddleware');

const router = express.Router();

// Generate payslip
router.get('/generate/:employee_id/:month/:year', authenticateToken, payrollController.generatePayslip);

// Get payroll records
router.get('/', authenticateToken, payrollController.getPayroll);

// Get dashboard statistics
router.get('/dashboard/stats', authenticateToken, payrollController.getDashboardStats);

module.exports = router;
