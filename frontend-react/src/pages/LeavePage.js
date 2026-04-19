// Leave Management Page Component
import React, { useState, useEffect, useCallback } from 'react';
import { leaveService } from '../services/api';
import './LeavePage.css';

const LeavePage = ({ user }) => {
    const [leaves, setLeaves] = useState([]);
    const [balance, setBalance] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        leave_type: 'Casual',
        start_date: '',
        end_date: '',
        reason: ''
    });

    const fetchLeaveData = useCallback(async () => {
        try {
            if (!user.employee_id) {
                setError('No employee profile found for this user');
                return;
            }
            const [leaveRes, balanceRes] = await Promise.all([
                leaveService.getHistory(user.employee_id),
                leaveService.getBalance(user.employee_id, new Date().getFullYear())
            ]);
            
            if (leaveRes.data.success) setLeaves(leaveRes.data.data);
            if (balanceRes.data.success) setBalance(balanceRes.data.data);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to fetch leave data');
        } finally {
            setLoading(false);
        }
    }, [user.employee_id]);

    const fetchAllLeaveRequests = useCallback(async () => {
        try {
            const response = await leaveService.getAllRequests();
            if (response.data.success) {
                setLeaves(response.data.data);
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to fetch leave requests');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        if (user.role === 'Admin') {
            fetchAllLeaveRequests();
        } else {
            fetchLeaveData();
        }
    }, [user.role, fetchLeaveData, fetchAllLeaveRequests]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (!user.employee_id) {
                throw new Error('No employee profile found for this user');
            }
            const response = await leaveService.apply(
                user.employee_id,
                formData.leave_type,
                formData.start_date,
                formData.end_date,
                formData.reason
            );
            if (response.data.success) {
                setFormData({ leave_type: 'Casual', start_date: '', end_date: '', reason: '' });
                setShowForm(false);
                fetchLeaveData();
            }
        } catch (err) {
            setError(err.response?.data?.message || err.message || 'Failed to apply leave');
        }
    };

    const handleApproveReject = async (leaveId, status) => {
        try {
            await leaveService.updateStatus(leaveId, status, user.id);
            if (user.role === 'Admin') {
                fetchAllLeaveRequests();
            } else {
                fetchLeaveData();
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to update leave status');
        }
    };

    return (
        <div className="leave-page">
            <div className="container">
                <h2>{user.role === 'Admin' ? 'Leave Management (Admin)' : 'Leave Management'}</h2>
                
                {error && <div className="alert alert-error">{error}</div>}
                
                {user.role === 'Employee' && !loading && balance && (
                    <div className="balance-grid">
                        <div className="balance-card">
                            <h4>Annual Leave</h4>
                            <p className="balance-number">{balance.annual_balance}</p>
                            <p className="balance-label">Days Available</p>
                        </div>
                        <div className="balance-card">
                            <h4>Sick Leave</h4>
                            <p className="balance-number">{balance.sick_balance}</p>
                            <p className="balance-label">Days Available</p>
                        </div>
                        <div className="balance-card">
                            <h4>Casual Leave</h4>
                            <p className="balance-number">{balance.casual_balance}</p>
                            <p className="balance-label">Days Available</p>
                        </div>
                        <div className="balance-card">
                            <h4>Personal Leave</h4>
                            <p className="balance-number">{balance.personal_balance}</p>
                            <p className="balance-label">Days Available</p>
                        </div>
                    </div>
                )}
                
                {user.role === 'Employee' && !user.employee_id && (
                    <div className="alert alert-error" style={{ marginBottom: '20px' }}>
                        No employee profile found for this user. Leave applications are only available for employees.
                    </div>
                )}
                
                {user.role === 'Employee' && (
                    <button 
                        className="btn btn-primary"
                        onClick={() => setShowForm(!showForm)}
                        disabled={!user.employee_id}
                    >
                        {showForm ? 'Cancel' : '+ Apply for Leave'}
                    </button>
                )}
                
                {user.role === 'Employee' && showForm && (
                    <div className="leave-form-box">
                        <h3>Apply for Leave</h3>
                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label>Leave Type:</label>
                                <select 
                                    value={formData.leave_type}
                                    onChange={(e) => setFormData({...formData, leave_type: e.target.value})}
                                >
                                    <option>Casual</option>
                                    <option>Sick</option>
                                    <option>Annual</option>
                                    <option>Personal</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label>Start Date:</label>
                                <input 
                                    type="date"
                                    value={formData.start_date}
                                    onChange={(e) => setFormData({...formData, start_date: e.target.value})}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>End Date:</label>
                                <input 
                                    type="date"
                                    value={formData.end_date}
                                    onChange={(e) => setFormData({...formData, end_date: e.target.value})}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Reason:</label>
                                <textarea 
                                    value={formData.reason}
                                    onChange={(e) => setFormData({...formData, reason: e.target.value})}
                                    rows="4"
                                ></textarea>
                            </div>
                            <button type="submit" className="btn btn-success">Submit Request</button>
                        </form>
                    </div>
                )}
                
                <h3 style={{marginTop: '30px'}}>
                    {user.role === 'Admin' ? 'All Leave Requests' : 'Leave History'}
                </h3>
                {loading ? (
                    <p>Loading...</p>
                ) : leaves.length > 0 ? (
                    <table className="table">
                        <thead>
                            <tr>
                                {user.role === 'Admin' && <th>Employee</th>}
                                <th>Type</th>
                                <th>Start Date</th>
                                <th>End Date</th>
                                <th>Days</th>
                                <th>Status</th>
                                {user.role === 'Admin' && <th>Actions</th>}
                            </tr>
                        </thead>
                        <tbody>
                            {leaves.map((leave) => (
                                <tr key={leave.id}>
                                    {user.role === 'Admin' && (
                                        <td>{leave.first_name} {leave.last_name}</td>
                                    )}
                                    <td>{leave.leave_type}</td>
                                    <td>{new Date(leave.start_date).toLocaleDateString()}</td>
                                    <td>{new Date(leave.end_date).toLocaleDateString()}</td>
                                    <td>{leave.no_of_days}</td>
                                    <td><span className={`status-badge status-${leave.status.toLowerCase()}`}>{leave.status}</span></td>
                                    {user.role === 'Admin' && leave.status === 'Pending' && (
                                        <td>
                                            <button 
                                                className="btn btn-success btn-small"
                                                onClick={() => handleApproveReject(leave.id, 'Approved')}
                                            >
                                                Approve
                                            </button>
                                            <button 
                                                className="btn btn-danger btn-small"
                                                onClick={() => handleApproveReject(leave.id, 'Rejected')}
                                            >
                                                Reject
                                            </button>
                                        </td>
                                    )}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <p>No leave records</p>
                )}
            </div>
        </div>
    );
};

export default LeavePage;
