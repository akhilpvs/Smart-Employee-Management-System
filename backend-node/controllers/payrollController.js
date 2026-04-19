// Payroll Controller
const { pool } = require('../config/database');

// Generate payslip
const generatePayslip = async (req, res) => {
    try {
        const { employee_id, month, year } = req.params;

        if (!employee_id || !month || !year) {
            return res.status(400).json({ success: false, message: 'Missing required parameters' });
        }

        const connection = await pool.getConnection();

        // Get employee salary
        const [employees] = await connection.query(
            'SELECT first_name, last_name, email, salary FROM employees WHERE id=?',
            [employee_id]
        );

        if (employees.length === 0) {
            connection.release();
            return res.status(404).json({ success: false, message: 'Employee not found' });
        }

        const employee = employees[0];

        // Get attendance for the month
        const [attendance] = await connection.query(
            `SELECT COUNT(*) as days FROM attendance 
             WHERE employee_id=? AND MONTH(attendance_date)=? AND YEAR(attendance_date)=? AND status='Present'`,
            [employee_id, month, year]
        );

        // Get payroll record
        const [payroll] = await connection.query(
            'SELECT * FROM payroll WHERE employee_id=? AND month=? AND year=?',
            [employee_id, month, year]
        );

        let payrollRecord = payroll[0];

        if (!payrollRecord) {
            const bonus = 0;
            const deductions = 0;
            const tax = Number((employee.salary * 0.12).toFixed(2));
            const netSalary = Number((employee.salary + bonus - deductions - tax).toFixed(2));

            const [insertResult] = await connection.query(
                `INSERT INTO payroll (employee_id, month, year, salary, bonus, deductions, tax, net_salary, attendance_days, status)
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                [employee_id, month, year, employee.salary, bonus, deductions, tax, netSalary, attendance[0].days, 'Generated']
            );

            payrollRecord = {
                employee_id,
                month,
                year,
                salary: employee.salary,
                bonus,
                deductions,
                tax,
                net_salary: netSalary,
                attendance_days: attendance[0].days,
                status: 'Generated'
            };
        }

        connection.release();

        const payslip = {
            employee: {
                id: employee_id,
                name: `${employee.first_name} ${employee.last_name}`,
                email: employee.email
            },
            month,
            year,
            attendance_days: attendance[0].days,
            salary: payrollRecord.salary,
            bonus: payrollRecord.bonus,
            deductions: payrollRecord.deductions,
            tax: payrollRecord.tax,
            net_salary: payrollRecord.net_salary,
            generated_at: new Date()
        };

        res.json({
            success: true,
            data: payslip
        });
    } catch (error) {
        console.error('Error generating payslip:', error);
        res.status(500).json({ success: false, message: 'Failed to generate payslip' });
    }
};

// Get payroll records
const getPayroll = async (req, res) => {
    try {
        const { employee_id, month, year } = req.query;
        const connection = await pool.getConnection();

        let query = `SELECT p.*, e.first_name, e.last_name 
                    FROM payroll p 
                    JOIN employees e ON p.employee_id = e.id 
                    WHERE 1=1`;
        const params = [];

        if (employee_id) {
            query += ' AND p.employee_id=?';
            params.push(employee_id);
        }

        if (month) {
            query += ' AND p.month=?';
            params.push(month);
        }

        if (year) {
            query += ' AND p.year=?';
            params.push(year);
        }

        query += ' ORDER BY p.year DESC, p.month DESC';

        const [payrolls] = await connection.query(query, params);
        connection.release();

        res.json({
            success: true,
            data: payrolls,
            total: payrolls.length
        });
    } catch (error) {
        console.error('Error fetching payroll:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch payroll' });
    }
};

// Get dashboard statistics
const getDashboardStats = async (req, res) => {
    try {
        const connection = await pool.getConnection();

        // Get total employees
        const [totalEmployees] = await connection.query(
            'SELECT COUNT(*) as count FROM employees WHERE status="Active"'
        );

        // Get present today
        const [presentToday] = await connection.query(
            'SELECT COUNT(*) as count FROM attendance WHERE attendance_date=CURDATE() AND status="Present"'
        );

        // Get absent today
        const [absentToday] = await connection.query(
            `SELECT COUNT(DISTINCT e.id) as count FROM employees e 
             LEFT JOIN attendance a ON e.id=a.employee_id AND a.attendance_date=CURDATE()
             WHERE e.status="Active" AND a.id IS NULL`
        );

        // Get total monthly salary expense
        const [totalSalary] = await connection.query(
            'SELECT SUM(salary) as total FROM employees WHERE status="Active"'
        );

        connection.release();

        res.json({
            success: true,
            data: {
                total_employees: totalEmployees[0].count,
                present_today: presentToday[0].count,
                absent_today: absentToday[0].count,
                total_monthly_salary: totalSalary[0].total || 0
            }
        });
    } catch (error) {
        console.error('Error fetching dashboard stats:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch dashboard statistics' });
    }
};

module.exports = { generatePayslip, getPayroll, getDashboardStats };
