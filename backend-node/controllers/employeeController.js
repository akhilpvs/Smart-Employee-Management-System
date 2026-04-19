// Employee Controller
const { pool } = require('../config/database');
const { validationResult } = require('express-validator');
const fs = require('fs');
const path = require('path');

// Get all employees
const getAllEmployees = async (req, res) => {
    try {
        const connection = await pool.getConnection();
        const [employees] = await connection.query(
            `SELECT e.id, e.user_id, e.first_name, e.last_name, e.email, e.phone, e.date_of_birth, 
                    e.department, e.designation, e.salary, e.hire_date, e.profile_photo, e.status, 
                    e.created_at, e.updated_at
             FROM employees e
             ORDER BY e.first_name`
        );
        connection.release();

        res.json({
            success: true,
            data: employees,
            total: employees.length
        });
    } catch (error) {
        console.error('Error fetching employees:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch employees' });
    }
};

// Get single employee
const getEmployee = async (req, res) => {
    try {
        const { id } = req.params;
        const connection = await pool.getConnection();
        const [employees] = await connection.query(
            `SELECT e.id, e.user_id, e.first_name, e.last_name, e.email, e.phone, e.date_of_birth, 
                    e.department, e.designation, e.salary, e.hire_date, e.profile_photo, e.status, 
                    e.created_at, e.updated_at
             FROM employees e
             WHERE e.id = ?`,
            [id]
        );
        connection.release();

        if (employees.length === 0) {
            return res.status(404).json({ success: false, message: 'Employee not found' });
        }

        res.json({
            success: true,
            data: employees[0]
        });
    } catch (error) {
        console.error('Error fetching employee:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch employee' });
    }
};

// Search employees by name
const searchEmployees = async (req, res) => {
    try {
        const { name } = req.query;
        
        if (!name) {
            return res.status(400).json({ success: false, message: 'Search name is required' });
        }

        const connection = await pool.getConnection();
        const searchTerm = `%${name}%`;
        const [employees] = await connection.query(
            `SELECT e.id, e.user_id, e.first_name, e.last_name, e.email, e.phone, e.date_of_birth, 
                    e.department, e.designation, e.salary, e.hire_date, e.profile_photo, e.status, 
                    e.created_at, e.updated_at
             FROM employees e
             WHERE e.first_name LIKE ? OR e.last_name LIKE ? OR e.email LIKE ?
             ORDER BY e.first_name`,
            [searchTerm, searchTerm, searchTerm]
        );
        connection.release();

        res.json({
            success: true,
            data: employees,
            total: employees.length
        });
    } catch (error) {
        console.error('Error searching employees:', error);
        res.status(500).json({ success: false, message: 'Failed to search employees' });
    }
};

// Add employee
const addEmployee = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            console.log('Validation errors:', errors.array());
            return res.status(400).json({ 
                success: false, 
                message: errors.array().map(e => e.msg).join(', '),
                errors: errors.array() 
            });
        }

        const { user_id, first_name, last_name, email, phone, date_of_birth, department, designation, salary, hire_date } = req.body;
        
        const connection = await pool.getConnection();

        // Check if email already exists
        const [existingEmployee] = await connection.query(
            'SELECT id FROM employees WHERE email = ?',
            [email]
        );

        if (existingEmployee.length > 0) {
            connection.release();
            return res.status(409).json({ success: false, message: 'Email already exists' });
        }

        // Insert employee
        const [result] = await connection.query(
            `INSERT INTO employees (user_id, first_name, last_name, email, phone, date_of_birth, department, designation, salary, hire_date) 
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [user_id, first_name, last_name, email, phone, date_of_birth, department, designation, salary, hire_date]
        );

        connection.release();

        res.status(201).json({
            success: true,
            message: 'Employee added successfully',
            data: { id: result.insertId }
        });
    } catch (error) {
        console.error('Error adding employee:', error);
        res.status(500).json({ success: false, message: 'Failed to add employee' });
    }
};

// Update employee
const updateEmployee = async (req, res) => {
    try {
        const { id } = req.params;
        const { first_name, last_name, phone, department, designation, salary, status } = req.body;

        const connection = await pool.getConnection();

        // Update employee
        const [result] = await connection.query(
            `UPDATE employees SET first_name=?, last_name=?, phone=?, department=?, designation=?, salary=?, status=? WHERE id=?`,
            [first_name, last_name, phone, department, designation, salary, status, id]
        );

        connection.release();

        if (result.affectedRows === 0) {
            return res.status(404).json({ success: false, message: 'Employee not found' });
        }

        res.json({
            success: true,
            message: 'Employee updated successfully'
        });
    } catch (error) {
        console.error('Error updating employee:', error);
        res.status(500).json({ success: false, message: 'Failed to update employee' });
    }
};

// Delete employee
const deleteEmployee = async (req, res) => {
    try {
        const { id } = req.params;
        const connection = await pool.getConnection();

        const [result] = await connection.query('DELETE FROM employees WHERE id=?', [id]);
        connection.release();

        if (result.affectedRows === 0) {
            return res.status(404).json({ success: false, message: 'Employee not found' });
        }

        res.json({
            success: true,
            message: 'Employee deleted successfully'
        });
    } catch (error) {
        console.error('Error deleting employee:', error);
        res.status(500).json({ success: false, message: 'Failed to delete employee' });
    }
};

// Upload employee profile photo
const uploadProfilePhoto = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ success: false, message: 'No file uploaded' });
        }

        const { id } = req.params;
        const photoPath = `/uploads/${req.file.filename}`;

        const connection = await pool.getConnection();
        const [result] = await connection.query(
            'UPDATE employees SET profile_photo=? WHERE id=?',
            [photoPath, id]
        );
        connection.release();

        if (result.affectedRows === 0) {
            return res.status(404).json({ success: false, message: 'Employee not found' });
        }

        res.json({
            success: true,
            message: 'Profile photo uploaded successfully',
            data: { photoPath }
        });
    } catch (error) {
        console.error('Error uploading photo:', error);
        res.status(500).json({ success: false, message: 'Failed to upload photo' });
    }
};

module.exports = { getAllEmployees, getEmployee, searchEmployees, addEmployee, updateEmployee, deleteEmployee, uploadProfilePhoto };
