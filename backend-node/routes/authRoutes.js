// Routes for Authentication
const express = require('express');
const { body } = require('express-validator');
const authController = require('../controllers/authController');
const { authenticateToken } = require('../middleware/authMiddleware');

const router = express.Router();

// Register route
router.post('/register', [
    body('email').isEmail().normalizeEmail(),
    body('password').isLength({ min: 6 }),
    body('role').optional().isIn(['Admin', 'Employee'])
], authController.register);

// Login route
router.post('/login', [
    body('email').isEmail().normalizeEmail(),
    body('password').notEmpty()
], authController.login);

// Get current user profile
router.get('/me', authenticateToken, authController.getProfile);

module.exports = router;
