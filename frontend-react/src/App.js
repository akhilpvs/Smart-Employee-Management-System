// Main App Component
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import EmployeeListPage from './pages/EmployeeListPage';
import EditEmployeePage from './pages/EditEmployeePage';
import AddEmployeePage from './pages/AddEmployeePage';
import AttendancePage from './pages/AttendancePage';
import LeavePage from './pages/LeavePage';
import PayrollPage from './pages/PayrollPage';
import AdminPayrollPage from './pages/AdminPayrollPage';
import { authService } from './services/api';
import './styles/global.css';

// Protected Route Component
const ProtectedRoute = ({ children, user }) => {
    if (!user) {
        return <Navigate to="/login" />;
    }
    return children;
};

function App() {
    const [user, setUser] = useState(() => {
        const storedUser = localStorage.getItem('user');
        return storedUser ? JSON.parse(storedUser) : null;
    });

    const handleLogin = (userData) => {
        setUser(userData);
    };

    const handleLogout = () => {
        setUser(null);
    };

    useEffect(() => {
        const refreshProfile = async () => {
            try {
                const response = await authService.getProfile();
                if (response.data.success) {
                    const profile = response.data.data;
                    localStorage.setItem('user', JSON.stringify(profile));
                    setUser(profile);
                }
            } catch (err) {
                console.warn('Unable to refresh user profile:', err.response?.data?.message || err.message);
            }
        };

        if (user && !user.employee_id) {
            refreshProfile();
        }
    }, [user]);

    return (
        <Router>
            {user && <Navbar user={user} onLogout={handleLogout} />}
            
            <main className={user ? '' : 'full-height'}>
                <Routes>
                    <Route 
                        path="/login" 
                        element={<LoginPage onLogin={handleLogin} />}
                    />
                    
                    <Route 
                        path="/register" 
                        element={<RegisterPage />}
                    />
                    
                    <Route 
                        path="/dashboard" 
                        element={
                            <ProtectedRoute user={user}>
                                <DashboardPage user={user} />
                            </ProtectedRoute>
                        }
                    />
                    
                    <Route 
                        path="/employees" 
                        element={
                            <ProtectedRoute user={user}>
                                <EmployeeListPage user={user} />
                            </ProtectedRoute>
                        }
                    />
                    
                    <Route 
                        path="/employees/new" 
                        element={
                            <ProtectedRoute user={user}>
                                <AddEmployeePage />
                            </ProtectedRoute>
                        }
                    />
                    
                    <Route 
                        path="/employees/:id/edit" 
                        element={
                            <ProtectedRoute user={user}>
                                <EditEmployeePage />
                            </ProtectedRoute>
                        }
                    />
                    
                    <Route 
                        path="/attendance" 
                        element={
                            <ProtectedRoute user={user}>
                                <AttendancePage user={user} />
                            </ProtectedRoute>
                        }
                    />
                    
                    <Route 
                        path="/leave" 
                        element={
                            <ProtectedRoute user={user}>
                                <LeavePage user={user} />
                            </ProtectedRoute>
                        }
                    />
                    
                    <Route 
                        path="/payroll" 
                        element={
                            <ProtectedRoute user={user}>
                                <PayrollPage user={user} />
                            </ProtectedRoute>
                        }
                    />
                    
                    <Route 
                        path="/admin/payroll" 
                        element={
                            <ProtectedRoute user={user}>
                                <AdminPayrollPage user={user} />
                            </ProtectedRoute>
                        }
                    />
                    
                    <Route 
                        path="/" 
                        element={user ? <Navigate to="/dashboard" /> : <Navigate to="/login" />}
                    />
                </Routes>
            </main>
        </Router>
    );
}

export default App;
