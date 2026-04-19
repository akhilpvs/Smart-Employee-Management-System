-- Create the employee_management database
CREATE DATABASE IF NOT EXISTS employee_management;

-- Use the database
USE employee_management;

-- Create users table
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('admin', 'employee') NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create employees table
CREATE TABLE employees (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    phone VARCHAR(20),
    department VARCHAR(50),
    position VARCHAR(50),
    salary DECIMAL(10,2),
    profile_photo VARCHAR(255),
    hire_date DATE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Create attendance table
CREATE TABLE attendance (
    id INT AUTO_INCREMENT PRIMARY KEY,
    employee_id INT NOT NULL,
    check_in TIME,
    check_out TIME,
    date DATE NOT NULL,
    status ENUM('present', 'absent', 'late') DEFAULT 'present',
    FOREIGN KEY (employee_id) REFERENCES employees(id) ON DELETE CASCADE
);

-- Create leaves table
CREATE TABLE leaves (
    id INT AUTO_INCREMENT PRIMARY KEY,
    employee_id INT NOT NULL,
    leave_type ENUM('sick', 'vacation', 'personal') NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    reason TEXT,
    status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
    applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (employee_id) REFERENCES employees(id) ON DELETE CASCADE
);

-- Create payroll table
CREATE TABLE payroll (
    id INT AUTO_INCREMENT PRIMARY KEY,
    employee_id INT NOT NULL,
    month INT NOT NULL,
    year INT NOT NULL,
    basic_salary DECIMAL(10,2) NOT NULL,
    bonus DECIMAL(10,2) DEFAULT 0,
    tax DECIMAL(10,2) DEFAULT 0,
    net_salary DECIMAL(10,2) NOT NULL,
    generated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (employee_id) REFERENCES employees(id) ON DELETE CASCADE
);

-- Insert sample data into users
INSERT INTO users (username, password, role) VALUES
('admin', 'admin123', 'admin'),
('john_doe', 'password123', 'employee'),
('jane_smith', 'password456', 'employee');

-- Insert sample data into employees
INSERT INTO employees (user_id, name, email, phone, department, position, salary, hire_date) VALUES
(2, 'John Doe', 'john@example.com', '1234567890', 'IT', 'Developer', 50000.00, '2023-01-01'),
(3, 'Jane Smith', 'jane@example.com', '0987654321', 'HR', 'Manager', 60000.00, '2023-02-01');

-- Insert sample data into attendance
INSERT INTO attendance (employee_id, check_in, check_out, date, status) VALUES
(1, '09:00:00', '17:00:00', '2023-10-01', 'present'),
(1, '09:30:00', '17:30:00', '2023-10-02', 'late'),
(2, '08:45:00', '17:15:00', '2023-10-01', 'present'),
(1, '09:00:00', '17:00:00', '2026-05-01', 'present'),
(1, '09:00:00', '17:00:00', '2026-05-02', 'present'),
(1, '09:00:00', '17:00:00', '2026-05-03', 'present'),
(1, '09:00:00', '17:00:00', '2026-05-04', 'present'),
(1, '09:00:00', '17:00:00', '2026-05-05', 'present'),
(1, '09:00:00', '17:00:00', '2026-05-08', 'present'),
(1, '09:00:00', '17:00:00', '2026-05-09', 'present'),
(1, '09:00:00', '17:00:00', '2026-05-10', 'present'),
(1, '09:00:00', '17:00:00', '2026-05-11', 'present'),
(1, '09:00:00', '17:00:00', '2026-05-12', 'present'),
(1, '09:00:00', '17:00:00', '2026-05-15', 'present'),
(1, '09:00:00', '17:00:00', '2026-05-16', 'present'),
(1, '09:00:00', '17:00:00', '2026-05-17', 'present'),
(1, '09:00:00', '17:00:00', '2026-05-18', 'present'),
(1, '09:00:00', '17:00:00', '2026-05-19', 'present'),
(1, '09:00:00', '17:00:00', '2026-05-22', 'present'),
(2, '09:00:00', '17:00:00', '2026-05-01', 'present'),
(2, '09:00:00', '17:00:00', '2026-05-02', 'present'),
(2, '09:00:00', '17:00:00', '2026-05-03', 'present'),
(2, '09:00:00', '17:00:00', '2026-05-04', 'present'),
(2, '09:00:00', '17:00:00', '2026-05-05', 'present'),
(2, '09:00:00', '17:00:00', '2026-05-08', 'present'),
(2, '09:00:00', '17:00:00', '2026-05-09', 'present'),
(2, '09:00:00', '17:00:00', '2026-05-10', 'present'),
(2, '09:00:00', '17:00:00', '2026-05-11', 'present'),
(2, '09:00:00', '17:00:00', '2026-05-12', 'present'),
(2, '09:00:00', '17:00:00', '2026-05-15', 'present'),
(2, '09:00:00', '17:00:00', '2026-05-16', 'present'),
(2, '09:00:00', '17:00:00', '2026-05-17', 'present'),
(2, '09:00:00', '17:00:00', '2026-05-18', 'present'),
(2, '09:00:00', '17:00:00', '2026-05-19', 'present'),
(2, '09:00:00', '17:00:00', '2026-05-21', 'present');

-- Insert sample data into leaves
INSERT INTO leaves (employee_id, leave_type, start_date, end_date, reason, status) VALUES
(1, 'vacation', '2023-10-05', '2023-10-07', 'Family trip', 'approved'),
(2, 'sick', '2023-10-10', '2023-10-10', 'Fever', 'pending'),
(1, 'personal', '2023-10-15', '2023-10-16', 'Personal matters', 'approved');

-- Insert sample data into payroll
INSERT INTO payroll (employee_id, month, year, basic_salary, bonus, tax, net_salary) VALUES
(1, 10, 2023, 50000.00, 5000.00, 5000.00, 50000.00),
(2, 10, 2023, 60000.00, 6000.00, 6000.00, 60000.00),
(1, 9, 2023, 50000.00, 0.00, 5000.00, 45000.00),
(1, 5, 2026, 75000.00, 3000.00, 9360.00, 68640.00),
(2, 5, 2026, 65000.00, 1500.00, 7980.00, 58520.00);