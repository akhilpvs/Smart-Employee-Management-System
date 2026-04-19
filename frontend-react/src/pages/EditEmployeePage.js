// Edit Employee Page Component
import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { employeeService } from '../services/api';
import './EmployeeListPage.css';

const EditEmployeePage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    
    const [employee, setEmployee] = useState({
        first_name: '',
        last_name: '',
        phone: '',
        department: '',
        designation: '',
        salary: '',
        status: 'Active'
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const fetchEmployee = useCallback(async () => {
        try {
            const response = await employeeService.getById(id);
            if (response.data.success) {
                setEmployee(response.data.data);
            }
        } catch (err) {
            setError('Failed to load employee details');
        } finally {
            setLoading(false);
        }
    }, [id]);

    useEffect(() => {
        fetchEmployee();
    }, [fetchEmployee]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setEmployee({
            ...employee,
            [name]: name === 'salary' ? parseFloat(value) : value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        try {
            const response = await employeeService.update(id, {
                first_name: employee.first_name,
                last_name: employee.last_name,
                phone: employee.phone,
                department: employee.department,
                designation: employee.designation,
                salary: employee.salary,
                status: employee.status
            });

            if (response.data.success) {
                setSuccess('Employee updated successfully!');
                setTimeout(() => {
                    navigate('/employees');
                }, 1500);
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to update employee');
        }
    };

    if (loading) return <div className="container"><p>Loading employee details...</p></div>;

    return (
        <div className="employee-edit-page">
            <div className="container">
                <h2>Edit Employee</h2>

                {error && <div className="alert alert-error">{error}</div>}
                {success && <div className="alert alert-success">{success}</div>}

                <form onSubmit={handleSubmit} className="edit-form">
                    <div className="form-row">
                        <div className="form-group">
                            <label>First Name:</label>
                            <input
                                type="text"
                                name="first_name"
                                value={employee.first_name}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Last Name:</label>
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
                            <label>Phone:</label>
                            <input
                                type="text"
                                name="phone"
                                value={employee.phone || ''}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="form-group">
                            <label>Department:</label>
                            <input
                                type="text"
                                name="department"
                                value={employee.department || ''}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label>Designation:</label>
                            <input
                                type="text"
                                name="designation"
                                value={employee.designation || ''}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="form-group">
                            <label>Salary:</label>
                            <input
                                type="number"
                                name="salary"
                                value={employee.salary || ''}
                                onChange={handleChange}
                                step="0.01"
                                min="0"
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Status:</label>
                        <select name="status" value={employee.status} onChange={handleChange}>
                            <option value="Active">Active</option>
                            <option value="Inactive">Inactive</option>
                            <option value="On Leave">On Leave</option>
                        </select>
                    </div>

                    <div className="form-actions">
                        <button type="submit" className="btn btn-primary">Save Changes</button>
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

export default EditEmployeePage;
