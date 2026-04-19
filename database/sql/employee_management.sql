-- Employee Management System Database Schema
-- Create database
CREATE DATABASE IF NOT EXISTS employee_management;
USE employee_management;

-- Users table (Authentication)
CREATE TABLE IF NOT EXISTS users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('Admin', 'Employee') DEFAULT 'Employee',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Employees table
CREATE TABLE IF NOT EXISTS employees (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    phone VARCHAR(20),
    date_of_birth DATE,
    department VARCHAR(100),
    designation VARCHAR(100),
    salary DECIMAL(10, 2),
    hire_date DATE NOT NULL,
    profile_photo VARCHAR(255),
    status ENUM('Active', 'Inactive', 'On Leave') DEFAULT 'Active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Attendance table
CREATE TABLE IF NOT EXISTS attendance (
    id INT PRIMARY KEY AUTO_INCREMENT,
    employee_id INT NOT NULL,
    check_in_time DATETIME,
    check_out_time DATETIME,
    attendance_date DATE NOT NULL,
    hours_worked DECIMAL(5, 2),
    status ENUM('Present', 'Absent', 'Half Day', 'Leave') DEFAULT 'Present',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (employee_id) REFERENCES employees(id) ON DELETE CASCADE,
    UNIQUE KEY unique_attendance (employee_id, attendance_date)
);

-- Leaves table
CREATE TABLE IF NOT EXISTS leaves (
    id INT PRIMARY KEY AUTO_INCREMENT,
    employee_id INT NOT NULL,
    leave_type ENUM('Sick', 'Casual', 'Annual', 'Personal') DEFAULT 'Casual',
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    no_of_days INT NOT NULL,
    reason VARCHAR(255),
    status ENUM('Pending', 'Approved', 'Rejected') DEFAULT 'Pending',
    approved_by INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (employee_id) REFERENCES employees(id) ON DELETE CASCADE,
    FOREIGN KEY (approved_by) REFERENCES users(id) ON DELETE SET NULL
);

-- Payroll table
CREATE TABLE IF NOT EXISTS payroll (
    id INT PRIMARY KEY AUTO_INCREMENT,
    employee_id INT NOT NULL,
    month INT NOT NULL,
    year INT NOT NULL,
    salary DECIMAL(10, 2) NOT NULL,
    bonus DECIMAL(10, 2) DEFAULT 0,
    deductions DECIMAL(10, 2) DEFAULT 0,
    tax DECIMAL(10, 2) DEFAULT 0,
    net_salary DECIMAL(10, 2) NOT NULL,
    attendance_days INT DEFAULT 0,
    status ENUM('Draft', 'Generated', 'Paid') DEFAULT 'Draft',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (employee_id) REFERENCES employees(id) ON DELETE CASCADE,
    UNIQUE KEY unique_payroll (employee_id, month, year)
);

-- Create indexes for better performance
CREATE INDEX idx_employee_user ON employees(user_id);
CREATE INDEX idx_attendance_employee ON attendance(employee_id);
CREATE INDEX idx_attendance_date ON attendance(attendance_date);
CREATE INDEX idx_leaves_employee ON leaves(employee_id);
CREATE INDEX idx_leaves_status ON leaves(status);
CREATE INDEX idx_payroll_employee ON payroll(employee_id);
CREATE INDEX idx_payroll_month_year ON payroll(month, year);

-- Sample data
-- Admin user (password: admin123)
INSERT INTO users (email, password, role) VALUES 
('admin@company.com', '$2b$10$8tnzPpV.4.7VqTX5y5tZKuVyIRr9Q.5xBjEJyKy4rG.5V7cECQ0s2', 'Admin');

-- Regular user (password: emp123)
INSERT INTO users (email, password, role) VALUES 
('john.doe@company.com', '$2b$10$d9q0.2T4q8n6r5K9Z3X2m2D8L1Y4R7U9W2P5Q8M1O3A0V7S6T9R2N', 'Employee'),
('jane.smith@company.com', '$2b$10$n3K8L2P5Q7R9T2V4W6Y8Z1A3B5C7D9E1F3G5H7J9K1L3M5N7P9R1T', 'Employee');

-- Sample employees
INSERT INTO employees (user_id, first_name, last_name, email, phone, date_of_birth, department, designation, salary, hire_date, status) VALUES 
(2, 'John', 'Doe', 'john.doe@company.com', '9876543210', '1990-05-15', 'IT', 'Senior Developer', 75000, '2022-01-15', 'Active'),
(3, 'Jane', 'Smith', 'jane.smith@company.com', '9876543211', '1992-08-20', 'HR', 'HR Manager', 65000, '2021-06-10', 'Active');

-- Sample attendance records
INSERT INTO attendance (employee_id, check_in_time, check_out_time, attendance_date, hours_worked, status) VALUES 
(1, '2024-04-15 09:00:00', '2024-04-15 17:00:00', '2024-04-15', 8, 'Present'),
(2, '2024-04-15 09:15:00', '2024-04-15 17:15:00', '2024-04-15', 8, 'Present'),
(1, '2026-05-01 09:00:00', '2026-05-01 17:00:00', '2026-05-01', 8, 'Present'),
(1, '2026-05-02 09:00:00', '2026-05-02 17:00:00', '2026-05-02', 8, 'Present'),
(1, '2026-05-03 09:00:00', '2026-05-03 17:00:00', '2026-05-03', 8, 'Present'),
(1, '2026-05-04 09:00:00', '2026-05-04 17:00:00', '2026-05-04', 8, 'Present'),
(1, '2026-05-05 09:00:00', '2026-05-05 17:00:00', '2026-05-05', 8, 'Present'),
(1, '2026-05-08 09:00:00', '2026-05-08 17:00:00', '2026-05-08', 8, 'Present'),
(1, '2026-05-09 09:00:00', '2026-05-09 17:00:00', '2026-05-09', 8, 'Present'),
(1, '2026-05-10 09:00:00', '2026-05-10 17:00:00', '2026-05-10', 8, 'Present'),
(1, '2026-05-11 09:00:00', '2026-05-11 17:00:00', '2026-05-11', 8, 'Present'),
(1, '2026-05-12 09:00:00', '2026-05-12 17:00:00', '2026-05-12', 8, 'Present'),
(1, '2026-05-15 09:00:00', '2026-05-15 17:00:00', '2026-05-15', 8, 'Present'),
(1, '2026-05-16 09:00:00', '2026-05-16 17:00:00', '2026-05-16', 8, 'Present'),
(1, '2026-05-17 09:00:00', '2026-05-17 17:00:00', '2026-05-17', 8, 'Present'),
(1, '2026-05-18 09:00:00', '2026-05-18 17:00:00', '2026-05-18', 8, 'Present'),
(1, '2026-05-19 09:00:00', '2026-05-19 17:00:00', '2026-05-19', 8, 'Present'),
(1, '2026-05-22 09:00:00', '2026-05-22 17:00:00', '2026-05-22', 8, 'Present'),
(2, '2026-05-01 09:00:00', '2026-05-01 17:00:00', '2026-05-01', 8, 'Present'),
(2, '2026-05-02 09:00:00', '2026-05-02 17:00:00', '2026-05-02', 8, 'Present'),
(2, '2026-05-03 09:00:00', '2026-05-03 17:00:00', '2026-05-03', 8, 'Present'),
(2, '2026-05-04 09:00:00', '2026-05-04 17:00:00', '2026-05-04', 8, 'Present'),
(2, '2026-05-05 09:00:00', '2026-05-05 17:00:00', '2026-05-05', 8, 'Present'),
(2, '2026-05-08 09:00:00', '2026-05-08 17:00:00', '2026-05-08', 8, 'Present'),
(2, '2026-05-09 09:00:00', '2026-05-09 17:00:00', '2026-05-09', 8, 'Present'),
(2, '2026-05-10 09:00:00', '2026-05-10 17:00:00', '2026-05-10', 8, 'Present'),
(2, '2026-05-11 09:00:00', '2026-05-11 17:00:00', '2026-05-11', 8, 'Present'),
(2, '2026-05-12 09:00:00', '2026-05-12 17:00:00', '2026-05-12', 8, 'Present'),
(2, '2026-05-15 09:00:00', '2026-05-15 17:00:00', '2026-05-15', 8, 'Present'),
(2, '2026-05-16 09:00:00', '2026-05-16 17:00:00', '2026-05-16', 8, 'Present'),
(2, '2026-05-17 09:00:00', '2026-05-17 17:00:00', '2026-05-17', 8, 'Present'),
(2, '2026-05-18 09:00:00', '2026-05-18 17:00:00', '2026-05-18', 8, 'Present'),
(2, '2026-05-19 09:00:00', '2026-05-19 17:00:00', '2026-05-19', 8, 'Present');

-- Sample leave records
INSERT INTO leaves (employee_id, leave_type, start_date, end_date, no_of_days, reason, status, approved_by) VALUES 
(1, 'Annual', '2024-05-01', '2024-05-05', 5, 'Summer Vacation', 'Approved', 1),
(2, 'Sick', '2024-04-20', '2024-04-20', 1, 'Medical emergency', 'Pending', NULL);

-- Sample payroll records
INSERT INTO payroll (employee_id, month, year, salary, bonus, deductions, tax, net_salary, attendance_days, status) VALUES 
(1, 4, 2024, 75000, 5000, 2000, 12000, 66000, 20, 'Generated'),
(2, 4, 2024, 65000, 0, 1500, 10400, 53100, 20, 'Generated'),
(1, 5, 2026, 78000, 3000, 2500, 9360, 69240, 22, 'Generated'),
(2, 5, 2026, 68000, 1500, 1800, 8160, 59440, 21, 'Generated');

-- Create a view for dashboard statistics
CREATE OR REPLACE VIEW v_dashboard_stats AS
SELECT 
    (SELECT COUNT(*) FROM employees WHERE status = 'Active') as total_employees,
    (SELECT COUNT(*) FROM attendance WHERE attendance_date = CURDATE() AND status = 'Present') as present_today,
    (SELECT COUNT(*) FROM employees WHERE status = 'Active') - (SELECT COUNT(*) FROM attendance WHERE attendance_date = CURDATE() AND status = 'Present') as absent_today,
    (SELECT SUM(salary) FROM employees WHERE status = 'Active') as total_monthly_salary;

-- Create a procedure to generate monthly payroll
DELIMITER //
CREATE PROCEDURE sp_generate_monthly_payroll(IN emp_id INT, IN month INT, IN year INT)
BEGIN
    DECLARE v_salary DECIMAL(10, 2);
    DECLARE v_attendance_days INT;
    DECLARE v_tax DECIMAL(10, 2);
    DECLARE v_net_salary DECIMAL(10, 2);
    
    SELECT salary INTO v_salary FROM employees WHERE id = emp_id;
    SELECT COUNT(*) INTO v_attendance_days FROM attendance WHERE employee_id = emp_id AND MONTH(attendance_date) = month AND YEAR(attendance_date) = year AND status = 'Present';
    
    SET v_tax = (v_salary * 0.12);
    SET v_net_salary = v_salary - v_tax;
    
    INSERT INTO payroll (employee_id, month, year, salary, tax, net_salary, attendance_days, status)
    VALUES (emp_id, month, year, v_salary, v_tax, v_net_salary, v_attendance_days, 'Generated')
    ON DUPLICATE KEY UPDATE 
    salary = v_salary,
    tax = v_tax,
    net_salary = v_net_salary,
    attendance_days = v_attendance_days,
    status = 'Generated';
END //
DELIMITER ;
