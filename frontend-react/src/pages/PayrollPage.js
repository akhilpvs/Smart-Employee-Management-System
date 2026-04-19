// Payroll Page Component
import React, { useState } from 'react';
import { payrollService } from '../services/api';
import './PayrollPage.css';

const PayrollPage = ({ user }) => {
    const [payslip, setPayslip] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [month, setMonth] = useState(new Date().getMonth() + 1);
    const [year, setYear] = useState(new Date().getFullYear());

    const handleGeneratePayslip = async () => {
        setLoading(true);
        setError('');
        
        try {
            if (!user.employee_id) {
                throw new Error('No employee profile found for this user');
            }
            const response = await payrollService.generatePayslip(user.employee_id, month, year);
            if (response.data.success) {
                setPayslip(response.data.data);
            }
        } catch (err) {
            setError(err.response?.data?.message || err.message || 'Failed to generate payslip');
        } finally {
            setLoading(false);
        }
    };

    const hasEmployeeProfile = Boolean(user?.employee_id);

    return (
        <div className="payroll-page">
            <div className="container">
                <h2>Payroll & Payslip</h2>
                
                {!hasEmployeeProfile && (
                    <div className="alert alert-error">
                        No employee profile found for this user. Payroll is only available for employees.
                    </div>
                )}
                {error && <div className="alert alert-error">{error}</div>}
                
                <div className="filter-box">
                    <div className="form-group">
                        <label>Select Month:</label>
                        <select value={month} onChange={(e) => setMonth(parseInt(e.target.value))}>
                            {[...Array(12)].map((_, i) => (
                                <option key={i + 1} value={i + 1}>
                                    {new Date(2000, i).toLocaleString('default', { month: 'long' })}
                                </option>
                            ))}
                        </select>
                    </div>
                    
                    <div className="form-group">
                        <label>Select Year:</label>
                        <select value={year} onChange={(e) => setYear(parseInt(e.target.value))}>
                            {[...Array(5)].map((_, i) => {
                                const y = new Date().getFullYear() - 2 + i;
                                return <option key={y} value={y}>{y}</option>;
                            })}
                        </select>
                    </div>
                    
                    <button 
                        className="btn btn-primary"
                        onClick={handleGeneratePayslip}
                        disabled={loading || !hasEmployeeProfile}
                    >
                        {loading ? 'Generating...' : 'Generate Payslip'}
                    </button>
                </div>
                
                {payslip && (
                    <div className="payslip-box">
                        <div className="payslip-header">
                            <h3>Payslip</h3>
                            <p>{new Date(payslip.generated_at).toLocaleDateString()}</p>
                        </div>
                        
                        <div className="payslip-employee-info">
                            <p><strong>Employee Name:</strong> {payslip.employee.name}</p>
                            <p><strong>Email:</strong> {payslip.employee.email}</p>
                            <p><strong>Month:</strong> {payslip.month}/{payslip.year}</p>
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
                                    <td>₹{payslip.salary.toLocaleString()}</td>
                                </tr>
                                <tr>
                                    <td>Bonus</td>
                                    <td>₹{payslip.bonus.toLocaleString()}</td>
                                </tr>
                                <tr>
                                    <td>Deductions</td>
                                    <td>-₹{payslip.deductions.toLocaleString()}</td>
                                </tr>
                                <tr>
                                    <td>Tax</td>
                                    <td>-₹{payslip.tax.toLocaleString()}</td>
                                </tr>
                                <tr className="payslip-total">
                                    <td><strong>Net Salary</strong></td>
                                    <td><strong>₹{payslip.net_salary.toLocaleString()}</strong></td>
                                </tr>
                            </tbody>
                        </table>
                        
                        <div className="payslip-footer">
                            <p>Attendance Days: {payslip.attendance_days}</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PayrollPage;
