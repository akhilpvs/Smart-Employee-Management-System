// Attendance Page Component
import React, { useState } from 'react';
import { attendanceService } from '../services/api';
import './AttendancePage.css';

const AttendancePage = ({ user }) => {
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [errorMsg, setErrorMsg] = useState('');

    const handleCheckIn = async () => {
        setLoading(true);
        setMessage('');
        setErrorMsg('');

        try {
            if (!user.employee_id) {
                throw new Error('No employee profile found for this user');
            }
            const response = await attendanceService.checkIn(user.employee_id);
            if (response.data.success) {
                setMessage('✓ Check-in successful!');
            }
        } catch (err) {
            setErrorMsg(err.response?.data?.message || err.message || 'Check-in failed');
        } finally {
            setLoading(false);
        }
    };

    const handleCheckOut = async () => {
        setLoading(true);
        setMessage('');
        setErrorMsg('');

        try {
            if (!user.employee_id) {
                throw new Error('No employee profile found for this user');
            }
            const response = await attendanceService.checkOut(user.employee_id);
            if (response.data.success) {
                setMessage(`✓ Check-out successful! Hours worked: ${response.data.data.hoursWorked}`);
            }
        } catch (err) {
            setErrorMsg(err.response?.data?.message || err.message || 'Check-out failed');
        } finally {
            setLoading(false);
        }
    };

    const hasEmployeeProfile = Boolean(user?.employee_id);

    return (
        <div className="attendance-page">
            <div className="container">
                <h2>Attendance Management</h2>
                
                {!hasEmployeeProfile && (
                    <div className="alert alert-error">
                        No employee profile found for this user. Attendance is only available for employee accounts.
                    </div>
                )}

                {message && <div className="alert alert-success">{message}</div>}
                {errorMsg && <div className="alert alert-error">{errorMsg}</div>}
                
                <div className="attendance-card">
                    <h3>Daily Attendance</h3>
                    <p>Current Time: {new Date().toLocaleString()}</p>
                    
                    <div className="button-group">
                        <button 
                            className="btn btn-success" 
                            onClick={handleCheckIn}
                            disabled={loading || !hasEmployeeProfile}
                        >
                            {loading ? 'Processing...' : '✓ Check In'}
                        </button>
                        
                        <button 
                            className="btn btn-warning" 
                            onClick={handleCheckOut}
                            disabled={loading || !hasEmployeeProfile}
                        >
                            {loading ? 'Processing...' : '✗ Check Out'}
                        </button>
                    </div>
                </div>
                
                <div className="info-box">
                    <h3>Instructions</h3>
                    <ul>
                        <li>Click "Check In" when you arrive at the office</li>
                        <li>Click "Check Out" when you leave the office</li>
                        <li>You can only check in once per day</li>
                        <li>Your attendance will be automatically tracked</li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default AttendancePage;
