// Leave Controller
const { pool } = require('../config/database');
const { validationResult } = require('express-validator');

// Apply for leave
const applyLeave = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ success: false, errors: errors.array() });
        }

        const { employee_id, leave_type, start_date, end_date, reason } = req.body;

        // Calculate number of days
        const start = new Date(start_date);
        const end = new Date(end_date);
        const no_of_days = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;

        const connection = await pool.getConnection();

        // Insert leave request
        const [result] = await connection.query(
            `INSERT INTO leaves (employee_id, leave_type, start_date, end_date, no_of_days, reason) 
             VALUES (?, ?, ?, ?, ?, ?)`,
            [employee_id, leave_type, start_date, end_date, no_of_days, reason]
        );

        connection.release();

        res.status(201).json({
            success: true,
            message: 'Leave request submitted successfully',
            data: { id: result.insertId, no_of_days }
        });
    } catch (error) {
        console.error('Error applying leave:', error);
        res.status(500).json({ success: false, message: 'Failed to apply leave' });
    }
};

// Approve or reject leave
const updateLeaveStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status, approved_by } = req.body;

        if (!['Approved', 'Rejected'].includes(status)) {
            return res.status(400).json({ success: false, message: 'Invalid status' });
        }

        const connection = await pool.getConnection();

        const [result] = await connection.query(
            `UPDATE leaves SET status=?, approved_by=? WHERE id=?`,
            [status, approved_by, id]
        );

        connection.release();

        if (result.affectedRows === 0) {
            return res.status(404).json({ success: false, message: 'Leave request not found' });
        }

        res.json({
            success: true,
            message: `Leave request ${status.toLowerCase()} successfully`
        });
    } catch (error) {
        console.error('Error updating leave status:', error);
        res.status(500).json({ success: false, message: 'Failed to update leave status' });
    }
};

// Get leave history
const getLeaveHistory = async (req, res) => {
    try {
        const { employee_id, status } = req.query;
        const connection = await pool.getConnection();

        let query = `SELECT l.*, e.first_name, e.last_name, e.email FROM leaves l
                    LEFT JOIN employees e ON l.employee_id = e.id WHERE 1=1`;
        const params = [];

        if (employee_id) {
            query += ' AND l.employee_id=?';
            params.push(employee_id);
        }

        if (status) {
            query += ' AND l.status=?';
            params.push(status);
        }

        query += ' ORDER BY l.created_at DESC';

        const [leaves] = await connection.query(query, params);
        connection.release();

        res.json({
            success: true,
            data: leaves,
            total: leaves.length
        });
    } catch (error) {
        console.error('Error fetching leave history:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch leave history' });
    }
};

// Get all leave requests (Admin only)
const getAllLeaveRequests = async (req, res) => {
    try {
        const connection = await pool.getConnection();

        const [leaves] = await connection.query(
            `SELECT l.*, e.first_name, e.last_name, e.email FROM leaves l
             LEFT JOIN employees e ON l.employee_id = e.id
             ORDER BY l.created_at DESC`
        );

        connection.release();

        res.json({
            success: true,
            data: leaves,
            total: leaves.length
        });
    } catch (error) {
        console.error('Error fetching all leave requests:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch leave requests' });
    }
};

// Get leave balance
const getLeaveBalance = async (req, res) => {
    try {
        const { employee_id, year } = req.query;

        if (!employee_id) {
            return res.status(400).json({ success: false, message: 'employee_id is required' });
        }

        const connection = await pool.getConnection();

        // Get approved leaves count
        const [result] = await connection.query(
            `SELECT 
                COALESCE(SUM(CASE WHEN leave_type='Annual' THEN no_of_days ELSE 0 END), 0) as annual_used,
                COALESCE(SUM(CASE WHEN leave_type='Sick' THEN no_of_days ELSE 0 END), 0) as sick_used,
                COALESCE(SUM(CASE WHEN leave_type='Casual' THEN no_of_days ELSE 0 END), 0) as casual_used,
                COALESCE(SUM(CASE WHEN leave_type='Personal' THEN no_of_days ELSE 0 END), 0) as personal_used
             FROM leaves 
             WHERE employee_id=? AND status='Approved' AND YEAR(start_date)=?`,
            [employee_id, year || new Date().getFullYear()]
        );

        connection.release();

        const balance = {
            annual_balance: 20 - (result[0].annual_used || 0),
            sick_balance: 10 - (result[0].sick_used || 0),
            casual_balance: 8 - (result[0].casual_used || 0),
            personal_balance: 5 - (result[0].personal_used || 0)
        };

        res.json({
            success: true,
            data: balance
        });
    } catch (error) {
        console.error('Error fetching leave balance:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch leave balance' });
    }
};

module.exports = { applyLeave, updateLeaveStatus, getLeaveHistory, getLeaveBalance, getAllLeaveRequests };
