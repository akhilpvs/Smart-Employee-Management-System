// Routes for Employees
const express = require('express');
const { body } = require('express-validator');
const employeeController = require('../controllers/employeeController');
const { authenticateToken } = require('../middleware/authMiddleware');
const multer = require('multer');

const router = express.Router();

// Multer configuration for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({ storage });

// Get all employees
router.get('/', authenticateToken, employeeController.getAllEmployees);

// Get single employee
router.get('/:id', authenticateToken, employeeController.getEmployee);

// Search employees
router.get('/search/name', authenticateToken, employeeController.searchEmployees);

// Add employee
router.post('/', authenticateToken, [
    body('first_name').trim().notEmpty().withMessage('First name is required'),
    body('last_name').trim().notEmpty().withMessage('Last name is required'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('department').notEmpty().withMessage('Department is required'),
    body('designation').notEmpty().withMessage('Designation is required'),
    body('salary').isFloat({ min: 0 }).withMessage('Salary must be a valid number')
], employeeController.addEmployee)

// Update employee
router.put('/:id', authenticateToken, employeeController.updateEmployee);

// Delete employee
router.delete('/:id', authenticateToken, employeeController.deleteEmployee);

// Upload profile photo
router.post('/:id/photo', authenticateToken, upload.single('file'), employeeController.uploadProfilePhoto);

module.exports = router;
