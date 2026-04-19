// Dashboard Page Component
import React, { useState, useEffect } from 'react';
import { payrollService } from '../services/api';
import './DashboardPage.css';

const DashboardPage = ({ user }) => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            const response = await payrollService.getDashboardStats();
            if (response.data.success) {
                setStats(response.data.data);
            }
        } catch (err) {
            setError('Failed to fetch dashboard statistics');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="dashboard-page">
            <div className="container">
                <h2>Dashboard</h2>
                
                {error && <div className="alert alert-error">{error}</div>}
                
                {loading ? (
                    <p>Loading statistics...</p>
                ) : stats ? (
                    <div className="stats-grid">
                        <div className="stat-card">
                            <div className="stat-icon">👥</div>
                            <div className="stat-content">
                                <h3>{stats.total_employees}</h3>
                                <p>Total Employees</p>
                            </div>
                        </div>
                        
                        <div className="stat-card">
                            <div className="stat-icon">✅</div>
                            <div className="stat-content">
                                <h3>{stats.present_today}</h3>
                                <p>Present Today</p>
                            </div>
                        </div>
                        
                        <div className="stat-card">
                            <div className="stat-icon">❌</div>
                            <div className="stat-content">
                                <h3>{stats.absent_today}</h3>
                                <p>Absent Today</p>
                            </div>
                        </div>
                        
                        <div className="stat-card">
                            <div className="stat-icon">💰</div>
                            <div className="stat-content">
                                <h3>₹{stats.total_monthly_salary.toLocaleString()}</h3>
                                <p>Monthly Salary Expense</p>
                            </div>
                        </div>
                    </div>
                ) : (
                    <p>No statistics available</p>
                )}
                
                <div className="dashboard-info">
                    <h3>Welcome, {user?.email}!</h3>
                    <p>You are logged in as <strong>{user?.role}</strong></p>
                </div>
            </div>
        </div>
    );
};

export default DashboardPage;
