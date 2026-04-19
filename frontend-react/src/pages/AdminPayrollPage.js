// Admin Payroll Page Component
import React, { useState, useEffect, useCallback } from 'react';
import { payrollService } from '../services/api';
import './PayrollPage.css';

const AdminPayrollPage = ({ user }) => {
    const [payrolls, setPayrolls] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [month, setMonth] = useState('');
    const [year, setYear] = useState(new Date().getFullYear());

    const fetchPayrolls = useCallback(async () => {
        setLoading(true);
        setError('');
        try {
            const response = await payrollService.getRecords(null, month || undefined, year);
            if (response.data.success) {
                setPayrolls(response.data.data);
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to fetch payroll records');
        } finally {
            setLoading(false);
        }
    }, [month, year]);

    useEffect(() => {
        fetchPayrolls();
    }, [fetchPayrolls]);

    if (user.role !== 'Admin') {
        return (
            <div className="payroll-page">
                <div className="container">
                    <div className="alert alert-error">
                        Access denied. This page is only available for administrators.
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="payroll-page">
            <div className="container">
                <h2>Admin - Payroll Management</h2>
                
                {error && <div className="alert alert-error">{error}</div>}
                
                <div className="filter-box">
                    <div className="form-group">
                        <label>Filter by Month (optional):</label>
                        <select 
                            value={month} 
                            onChange={(e) => setMonth(e.target.value)}
                        >
                            <option value="">All Months</option>
                            {[...Array(12)].map((_, i) => (
                                <option key={i + 1} value={i + 1}>
                                    {new Date(2000, i).toLocaleString('default', { month: 'long' })}
                                </option>
                            ))}
                        </select>
                    </div>
                    
                    <div className="form-group">
                        <label>Filter by Year:</label>
                        <select 
                            value={year} 
                            onChange={(e) => setYear(parseInt(e.target.value))}
                        >
                            {[...Array(5)].map((_, i) => {
                                const y = new Date().getFullYear() - 2 + i;
                                return <option key={y} value={y}>{y}</option>;
                            })}
                        </select>
                    </div>
                </div>
                
                <h3>Payroll Records</h3>
                {loading ? (
                    <p>Loading...</p>
                ) : payrolls.length > 0 ? (
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Employee Name</th>
                                <th>Month</th>
                                <th>Year</th>
                                <th>Salary</th>
                                <th>Bonus</th>
                                <th>Deductions</th>
                                <th>Tax</th>
                                <th>Net Salary</th>
                                <th>Attendance Days</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {payrolls.map((payroll) => (
                                <tr key={`${payroll.employee_id}-${payroll.month}-${payroll.year}`}>
                                    <td>{payroll.first_name} {payroll.last_name}</td>
                                    <td>{payroll.month}</td>
                                    <td>{payroll.year}</td>
                                    <td>₹{payroll.salary.toLocaleString()}</td>
                                    <td>₹{payroll.bonus.toLocaleString()}</td>
                                    <td>₹{payroll.deductions.toLocaleString()}</td>
                                    <td>₹{payroll.tax.toLocaleString()}</td>
                                    <td><strong>₹{payroll.net_salary.toLocaleString()}</strong></td>
                                    <td>{payroll.attendance_days || '-'}</td>
                                    <td>
                                        <span className={`status-badge status-${payroll.status.toLowerCase()}`}>
                                            {payroll.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <p>No payroll records found.</p>
                )}
                
                <div className="info-box" style={{ marginTop: '30px' }}>
                    <h3>Summary</h3>
                    <p>Total Records: {payrolls.length}</p>
                    <p>
                        Total Salary Expense: ₹
                        {payrolls
                            .reduce((sum, p) => sum + p.net_salary, 0)
                            .toLocaleString()}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default AdminPayrollPage;
