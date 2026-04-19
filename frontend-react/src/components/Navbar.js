// Navigation Component
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Navbar.css';

const Navbar = ({ user, onLogout }) => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        onLogout();
        navigate('/login');
    };

    return (
        <nav className="navbar">
            <div className="container">
                <div className="navbar-brand">
                    <h1>Employee Management System</h1>
                </div>
                <ul className="navbar-menu">
                    <li><Link to="/dashboard">Dashboard</Link></li>
                    {/* Admin only: Employee Management */}
                    {user && user.role === 'Admin' && (
                        <li><Link to="/employees">Employees</Link></li>
                    )}
                    {/* Employee only: Attendance & Payroll */}
                    {user && user.role === 'Employee' && (
                        <>
                            <li><Link to="/attendance">Attendance</Link></li>
                            <li><Link to="/payroll">Payroll</Link></li>
                        </>
                    )}
                    {/* Available to all: Leave */}
                    <li><Link to="/leave">Leave</Link></li>
                    {/* Admin only: Admin Payroll Dashboard */}
                    {user && user.role === 'Admin' && (
                        <li><Link to="/admin/payroll">Payroll (Admin)</Link></li>
                    )}
                </ul>
                <div className="navbar-user">
                    {user && (
                        <>
                            <span className="user-info">{user.email} ({user.role})</span>
                            <button className="btn btn-danger" onClick={handleLogout}>Logout</button>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
