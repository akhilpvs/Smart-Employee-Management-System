// Employee List Page Component
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { employeeService } from '../services/api';
import './EmployeeListPage.css';

const EmployeeListPage = ({ user }) => {
    const navigate = useNavigate();
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    
    const isAdmin = user?.role === 'Admin';

    useEffect(() => {
        fetchEmployees();
    }, []);

    const fetchEmployees = async () => {
        try {
            const response = await employeeService.getAll();
            if (response.data.success) {
                setEmployees(response.data.data);
            }
        } catch (err) {
            setError('Failed to fetch employees');
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = async (e) => {
        e.preventDefault();
        if (!searchTerm) {
            fetchEmployees();
            return;
        }

        try {
            const response = await employeeService.search(searchTerm);
            if (response.data.success) {
                setEmployees(response.data.data);
            }
        } catch (err) {
            setError('Search failed');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this employee?')) {
            try {
                await employeeService.delete(id);
                fetchEmployees();
            } catch (err) {
                setError('Failed to delete employee');
            }
        }
    };

    return (
        <div className="employee-list-page">
            <div className="container">
                <div className="page-header">
                    <h2>Employee List</h2>
                    {isAdmin && (
                        <button 
                            className="btn btn-success"
                            onClick={() => navigate('/employees/new')}
                        >
                            + Add Employee
                        </button>
                    )}
                </div>
                
                {error && <div className="alert alert-error">{error}</div>}
                
                <div className="search-box">
                    <form onSubmit={handleSearch}>
                        <input
                            type="text"
                            placeholder="Search by name or email..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <button type="submit" className="btn btn-primary">Search</button>
                    </form>
                </div>
                
                {loading ? (
                    <p>Loading employees...</p>
                ) : employees.length > 0 ? (
                    <table className="table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Department</th>
                                <th>Designation</th>
                                <th>Salary</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {employees.map((emp) => (
                                <tr key={emp.id}>
                                    <td>{emp.id}</td>
                                    <td>{emp.first_name} {emp.last_name}</td>
                                    <td>{emp.email}</td>
                                    <td>{emp.department || 'N/A'}</td>
                                    <td>{emp.designation || 'N/A'}</td>
                                    <td>₹{emp.salary?.toLocaleString() || 'N/A'}</td>
                                    <td>
                                        <span className={`status-badge status-${emp.status.toLowerCase()}`}>
                                            {emp.status}
                                        </span>
                                    </td>
                                    <td>
                                        {isAdmin ? (
                                            <>
                                                <button 
                                                    className="btn btn-primary btn-sm"
                                                    onClick={() => navigate(`/employees/${emp.id}/edit`)}
                                                >
                                                    Edit
                                                </button>
                                                <button 
                                                    className="btn btn-danger btn-sm"
                                                    onClick={() => handleDelete(emp.id)}
                                                >
                                                    Delete
                                                </button>
                                            </>
                                        ) : (
                                            <span className="text-muted">—</span>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <p>No employees found</p>
                )}
            </div>
        </div>
    );
};

export default EmployeeListPage;
