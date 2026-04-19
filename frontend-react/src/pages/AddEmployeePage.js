// Add Employee Page Component
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { employeeService } from '../services/api';
import './EmployeeListPage.css';

const AddEmployeePage = () => {
    const navigate = useNavigate();
    
    const [employee, setEmployee] = useState({
        user_id: '',
        first_name: '',
        last_name: '',
        email: '',
        phone: '',
        date_of_birth: '',
        department: '',
        designation: '',
        salary: '',
        hire_date: new Date().toISOString().split('T')[0],
        status: 'Active'
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setEmployee({
            ...employee,
            [name]: name === 'salary' ? parseFloat(value) || '' : value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        // Validate required fields
        if (!employee.first_name || !employee.last_name || !employee.email || !employee.department || !employee.designation || !employee.salary) {
            setError('Please fill in all required fields');
            return;
        }

        try {
            const response = await employeeService.add({
                user_id: employee.user_id || 0,
                first_name: employee.first_name,
                last_name: employee.last_name,
                email: employee.email,
                phone: employee.phone,
                date_of_birth: employee.date_of_birth,
                department: employee.department,
                designation: employee.designation,
                salary: employee.salary,
                hire_date: employee.hire_date
            });

            if (response.data.success) {
                setSuccess('Employee added successfully!');
                setTimeout(() => {
                    navigate('/employees');
                }, 1500);
            }
        } catch (err) {
            console.error('Add employee error:', err);
            // Handle validation errors array
            if (err.response?.data?.errors && Array.isArray(err.response.data.errors)) {
                const errorMessages = err.response.data.errors.map(e => e.msg || e.message).join(', ');
                setError(errorMessages);
            } else {
                setError(err.response?.data?.message || err.message || 'Failed to add employee');
            }
        }
    };

    return (
        <div className="add-employee-page">
            <div className="container">
                <h2>Add New Employee</h2>

                {error && <div className="alert alert-error">{error}</div>}
                {success && <div className="alert alert-success">{success}</div>}

                <form onSubmit={handleSubmit} className="edit-form">
                    <div className="form-row">
                        <div className="form-group">
                            <label>First Name: <span className="required">*</span></label>
                            <input
                                type="text"
                                name="first_name"
                                value={employee.first_name}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Last Name: <span className="required">*</span></label>
                            <input
                                type="text"
                                name="last_name"
                                value={employee.last_name}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label>Email: <span className="required">*</span></label>
                            <input
                                type="email"
                                name="email"
                                value={employee.email}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Phone:</label>
                            <input
                                type="text"
                                name="phone"
                                value={employee.phone}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label>Date of Birth:</label>
                            <input
                                type="date"
                                name="date_of_birth"
                                value={employee.date_of_birth}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="form-group">
                            <label>Hire Date:</label>
                            <input
                                type="date"
                                name="hire_date"
                                value={employee.hire_date}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label>Department: <span className="required">*</span></label>
                            <input
                                type="text"
                                name="department"
                                value={employee.department}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Designation: <span className="required">*</span></label>
                            <input
                                type="text"
                                name="designation"
                                value={employee.designation}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label>Salary: <span className="required">*</span></label>
                            <input
                                type="number"
                                name="salary"
                                value={employee.salary}
                                onChange={handleChange}
                                step="0.01"
                                min="0"
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Status:</label>
                            <select name="status" value={employee.status} onChange={handleChange}>
                                <option value="Active">Active</option>
                                <option value="Inactive">Inactive</option>
                                <option value="On Leave">On Leave</option>
                            </select>
                        </div>
                    </div>

                    <div className="form-actions">
                        <button type="submit" className="btn btn-primary">Add Employee</button>
                        <button 
                            type="button" 
                            className="btn btn-secondary"
                            onClick={() => navigate('/employees')}
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddEmployeePage;
