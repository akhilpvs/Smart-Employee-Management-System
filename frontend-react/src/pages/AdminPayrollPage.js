// Admin Payroll Page Component
import React, { useState, useEffect, useCallback } from 'react';
import { payrollService, employeeService } from '../services/api';
import './PayrollPage.css';

const AdminPayrollPage = ({ user }) => {
    const [payrolls, setPayrolls] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [month, setMonth] = useState(new Date().getMonth() + 1);
    const [year, setYear] = useState(new Date().getFullYear());
    const [employees, setEmployees] = useState([]);
    const [selectedSlip, setSelectedSlip] = useState(null);
    const [generating, setGenerating] = useState(false);

    const fetchPayrolls = useCallback(async () => {
        setLoading(true);
        setError('');
        try {
            const response = await payrollService.getRecords(null, month, year);
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
        fetchEmployees();
    }, []);

    useEffect(() => {
        fetchPayrolls();
    }, [fetchPayrolls]);

    const fetchEmployees = async () => {
        try {
            const response = await employeeService.getAll();
            if (response.data.success) {
                setEmployees(response.data.data);
            }
        } catch (err) {
            console.error('Failed to fetch employees');
        }
    };

    const handleGeneratePayslips = async () => {
        setGenerating(true);
        setError('');
        try {
            let successCount = 0;
            for (const emp of employees) {
                try {
                    await payrollService.generatePayslip(emp.id, month, year);
                    successCount++;
                } catch (err) {
                    console.warn(`Failed to generate for employee ${emp.id}`);
                }
            }
            // Refresh payroll records
            await new Promise(resolve => setTimeout(resolve, 500));
            fetchPayrolls();
            setError('');
            alert(`✅ Payslips generated for ${successCount}/${employees.length} employees`);
        } catch (err) {
            setError('Failed to generate payslips: ' + err.message);
        } finally {
            setGenerating(false);
        }
    };

    const handleViewSlip = async (payroll) => {
        try {
            const response = await payrollService.generatePayslip(payroll.employee_id, payroll.month, payroll.year);
            if (response.data.success) {
                setSelectedSlip(response.data.data);
            }
        } catch (err) {
            setError('Failed to load payslip details');
        }
    };

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

    // If viewing a specific slip
    if (selectedSlip) {
        return (
            <div className="payroll-page">
                <div className="container">
                    <button 
                        className="btn btn-secondary" 
                        onClick={() => setSelectedSlip(null)}
                        style={{ marginBottom: '20px' }}
                    >
                        ← Back to List
                    </button>
                    
                    <div className="payslip-box">
                        <div className="payslip-header">
                            <h3>Payslip</h3>
                            <p>{new Date(selectedSlip.generated_at).toLocaleDateString()}</p>
                        </div>
                        
                        <div className="payslip-employee-info">
                            <p><strong>Employee Name:</strong> {selectedSlip.employee.name}</p>
                            <p><strong>Email:</strong> {selectedSlip.employee.email}</p>
                            <p><strong>Month:</strong> {selectedSlip.month}/{selectedSlip.year}</p>
                        </div>
                        
                        <table className="payslip-table">
                            <thead>
                                <tr>
                                    <th>Description</th>
                                    <th>Amount</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>Basic Salary</td>
                                    <td>₹{selectedSlip.salary.toLocaleString()}</td>
                                </tr>
                                <tr>
                                    <td>Bonus</td>
                                    <td>₹{selectedSlip.bonus.toLocaleString()}</td>
                                </tr>
                                <tr>
                                    <td>Deductions</td>
                                    <td>-₹{selectedSlip.deductions.toLocaleString()}</td>
                                </tr>
                                <tr>
                                    <td>Tax</td>
                                    <td>-₹{selectedSlip.tax.toLocaleString()}</td>
                                </tr>
                                <tr className="payslip-total">
                                    <td><strong>Net Salary</strong></td>
                                    <td><strong>₹{selectedSlip.net_salary.toLocaleString()}</strong></td>
                                </tr>
                            </tbody>
                        </table>
                        
                        <div className="payslip-footer">
                            <p>Attendance Days: {selectedSlip.attendance_days}</p>
                        </div>
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
                        <label>Select Month:</label>
                        <select 
                            value={month} 
                            onChange={(e) => setMonth(parseInt(e.target.value))}
                        >
                            {[...Array(12)].map((_, i) => (
                                <option key={i + 1} value={i + 1}>
                                    {new Date(2000, i).toLocaleString('default', { month: 'long' })}
                                </option>
                            ))}
                        </select>
                    </div>
                    
                    <div className="form-group">
                        <label>Select Year:</label>
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

                    <button 
                        className="btn btn-primary"
                        onClick={handleGeneratePayslips}
                        disabled={generating || employees.length === 0}
                    >
                        {generating ? 'Generating...' : '🔄 Generate Payslips for All'}
                    </button>
                </div>
                
                <h3>Payroll Records for {new Date(2000, month - 1).toLocaleString('default', { month: 'long' })} {year}</h3>
                {loading ? (
                    <p>Loading...</p>
                ) : payrolls.length > 0 ? (
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Employee Name</th>
                                <th>Designation</th>
                                <th>Salary</th>
                                <th>Bonus</th>
                                <th>Deductions</th>
                                <th>Tax</th>
                                <th>Net Salary</th>
                                <th>Attendance Days</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {payrolls.map((payroll) => (
                                <tr key={`${payroll.employee_id}-${payroll.month}-${payroll.year}`}>
                                    <td>{payroll.first_name} {payroll.last_name}</td>
                                    <td>{payroll.designation || '-'}</td>
                                    <td>₹{payroll.salary.toLocaleString()}</td>
                                    <td>₹{payroll.bonus.toLocaleString()}</td>
                                    <td>₹{payroll.deductions.toLocaleString()}</td>
                                    <td>₹{payroll.tax.toLocaleString()}</td>
                                    <td><strong>₹{payroll.net_salary.toLocaleString()}</strong></td>
                                    <td>{payroll.attendance_days || '-'}</td>
                                    <td>
                                        <button 
                                            className="btn btn-sm btn-primary"
                                            onClick={() => handleViewSlip(payroll)}
                                        >
                                            View Slip
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <div className="alert alert-info">
                        No payroll records found for {new Date(2000, month - 1).toLocaleString('default', { month: 'long' })} {year}.
                        <br />
                        <strong>Tip:</strong> Click "Generate Payslips for All" button to create payslips for all employees.
                    </div>
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
