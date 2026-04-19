// Attendance Controller
const { pool } = require('../config/database');

// Check-in
const checkIn = async (req, res) => {
    try {
        const { employee_id } = req.body;
        const connection = await pool.getConnection();

        // Check if already checked in today
        const [existing] = await connection.query(
            'SELECT id FROM attendance WHERE employee_id=? AND attendance_date=CURDATE()',
            [employee_id]
        );

        if (existing.length > 0) {
            connection.release();
            return res.status(400).json({ success: false, message: 'Already checked in today' });
        }

        // Create attendance record
        const [result] = await connection.query(
            `INSERT INTO attendance (employee_id, check_in_time, attendance_date, status) 
             VALUES (?, NOW(), CURDATE(), 'Present')`,
            [employee_id]
        );

        connection.release();

        res.status(201).json({
            success: true,
            message: 'Check-in successful',
            data: { id: result.insertId }
        });
    } catch (error) {
        console.error('Check-in error:', error);
        res.status(500).json({ success: false, message: 'Check-in failed' });
    }
};

// Check-out
const checkOut = async (req, res) => {
    try {
        const { employee_id } = req.body;
        const connection = await pool.getConnection();

        // Get today's attendance record
        const [attendance] = await connection.query(
            'SELECT id, check_in_time FROM attendance WHERE employee_id=? AND attendance_date=CURDATE()',
            [employee_id]
        );

        if (attendance.length === 0) {
            connection.release();
            return res.status(404).json({ success: false, message: 'No check-in record found for today' });
        }

        // Calculate hours worked
        const checkInTime = new Date(attendance[0].check_in_time);
        const checkOutTime = new Date();
        const hoursWorked = (checkOutTime - checkInTime) / (1000 * 60 * 60);

        // Update attendance record
        const [result] = await connection.query(
            `UPDATE attendance SET check_out_time=NOW(), hours_worked=? WHERE id=?`,
            [hoursWorked.toFixed(2), attendance[0].id]
        );

        connection.release();

        res.json({
            success: true,
            message: 'Check-out successful',
            data: { hoursWorked: hoursWorked.toFixed(2) }
        });
    } catch (error) {
        console.error('Check-out error:', error);
        res.status(500).json({ success: false, message: 'Check-out failed' });
    }
};

// Get attendance records
const getAttendance = async (req, res) => {
    try {
        const { employee_id, from_date, to_date } = req.query;
        const connection = await pool.getConnection();

        let query = 'SELECT * FROM attendance WHERE 1=1';
        const params = [];

        if (employee_id) {
            query += ' AND employee_id=?';
            params.push(employee_id);
        }

        if (from_date) {
            query += ' AND attendance_date >= ?';
            params.push(from_date);
        }

        if (to_date) {
            query += ' AND attendance_date <= ?';
            params.push(to_date);
        }

        query += ' ORDER BY attendance_date DESC';

        const [records] = await connection.query(query, params);
        connection.release();

        res.json({
            success: true,
            data: records,
            total: records.length
        });
    } catch (error) {
        console.error('Error fetching attendance:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch attendance records' });
    }
};

// Get monthly attendance report
const getMonthlyReport = async (req, res) => {
    try {
        const { employee_id, month, year } = req.query;

        if (!employee_id || !month || !year) {
            return res.status(400).json({ success: false, message: 'employee_id, month, and year are required' });
        }

        const connection = await pool.getConnection();

        const [report] = await connection.query(
            `SELECT 
                SUM(CASE WHEN status='Present' THEN 1 ELSE 0 END) as present_days,
                SUM(CASE WHEN status='Absent' THEN 1 ELSE 0 END) as absent_days,
                SUM(CASE WHEN status='Half Day' THEN 1 ELSE 0 END) as half_days,
                ROUND(AVG(hours_worked), 2) as avg_hours,
                SUM(hours_worked) as total_hours
             FROM attendance 
             WHERE employee_id=? AND MONTH(attendance_date)=? AND YEAR(attendance_date)=?`,
            [employee_id, month, year]
        );

        connection.release();

        res.json({
            success: true,
            data: report[0]
        });
    } catch (error) {
        console.error('Error fetching report:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch attendance report' });
    }
};

module.exports = { checkIn, checkOut, getAttendance, getMonthlyReport };
