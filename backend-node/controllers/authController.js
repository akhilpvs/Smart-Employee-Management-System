// Authentication Controller
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { pool } = require('../config/database');
const { validationResult } = require('express-validator');

// Helper function to create JWT token
const createToken = (user) => {
    return jwt.sign(
        { id: user.id, email: user.email, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRY || '7d' }
    );
};

// User Registration
const register = async (req, res) => {
    try {
        // Check validation errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ success: false, errors: errors.array() });
        }

        const { email, password, role } = req.body;
        const connection = await pool.getConnection();

        // Check if user already exists
        const [existingUser] = await connection.query('SELECT id FROM users WHERE email = ?', [email]);
        if (existingUser.length > 0) {
            connection.release();
            return res.status(409).json({ success: false, message: 'Email already registered' });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert user
        const [result] = await connection.query(
            'INSERT INTO users (email, password, role) VALUES (?, ?, ?)',
            [email, hashedPassword, role || 'Employee']
        );

        let employeeId = null;
        if ((role || 'Employee') === 'Employee') {
            const username = email.split('@')[0] || 'employee';
            const nameParts = username.split('.');
            const firstName = nameParts[0] ? nameParts[0].charAt(0).toUpperCase() + nameParts[0].slice(1) : 'Employee';
            const lastName = nameParts[1]
                ? nameParts[1].charAt(0).toUpperCase() + nameParts[1].slice(1)
                : 'User';

            const [employeeResult] = await connection.query(
                `INSERT INTO employees (user_id, first_name, last_name, email, hire_date, status)
                 VALUES (?, ?, ?, ?, CURDATE(), 'Active')`,
                [result.insertId, firstName, lastName, email]
            );
            employeeId = employeeResult.insertId;
        }

        connection.release();

        res.status(201).json({
            success: true,
            message: 'User registered successfully',
            data: {
                id: result.insertId,
                email,
                role: role || 'Employee',
                employee_id: employeeId,
                employee_name: employeeId ? `${firstName} ${lastName}` : null
            }
        });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ success: false, message: 'Registration failed' });
    }
};

// User Login
const login = async (req, res) => {
    try {
        console.log('Login attempt:', { email: req.body.email });
        
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            console.log('Validation errors:', errors.array());
            return res.status(400).json({ success: false, errors: errors.array() });
        }

        const { email, password } = req.body;
        const connection = await pool.getConnection();

        // Get user from database
        const [users] = await connection.query('SELECT * FROM users WHERE email = ?', [email]);
        if (users.length === 0) {
            connection.release();
            console.log('User not found:', email);
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }

        const user = users[0];

        // Check password
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            connection.release();
            console.log('Password mismatch for user:', email);
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }

        // Find linked employee profile, if any
        const [employeeRows] = await connection.query('SELECT id, first_name, last_name FROM employees WHERE user_id = ?', [user.id]);
        const employee = employeeRows.length ? employeeRows[0] : null;
        connection.release();

        // Create JWT token
        const token = createToken(user);

        console.log('Login successful:', { email, userId: user.id, role: user.role });
        
        res.json({
            success: true,
            message: 'Login successful',
            data: {
                token,
                user: {
                    id: user.id,
                    email: user.email,
                    role: user.role,
                    employee_id: employee ? employee.id : null,
                    employee_name: employee ? `${employee.first_name} ${employee.last_name}` : null
                }
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ success: false, message: 'Login failed' });
    }
};

const getProfile = async (req, res) => {
    try {
        const connection = await pool.getConnection();
        const [users] = await connection.query('SELECT id, email, role FROM users WHERE id = ?', [req.user.id]);
        if (users.length === 0) {
            connection.release();
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        const user = users[0];
        const [employeeRows] = await connection.query(
            'SELECT id, first_name, last_name FROM employees WHERE user_id = ?',
            [user.id]
        );
        connection.release();

        const employee = employeeRows.length ? employeeRows[0] : null;

        res.json({
            success: true,
            data: {
                id: user.id,
                email: user.email,
                role: user.role,
                employee_id: employee ? employee.id : null,
                employee_name: employee ? `${employee.first_name} ${employee.last_name}` : null
            }
        });
    } catch (error) {
        console.error('Profile error:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch user profile' });
    }
};

module.exports = { register, login, getProfile };
