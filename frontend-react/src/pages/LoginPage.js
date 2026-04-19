// Login Page Component
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authService } from '../services/api';
import './LoginPage.css';

const LoginPage = ({ onLogin }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const response = await authService.login(email, password);
            if (response.data.success) {
                const { token, user } = response.data.data;
                localStorage.setItem('token', token);
                localStorage.setItem('user', JSON.stringify(user));
                onLogin(user);
                navigate('/dashboard');
            } else {
                setError(response.data.message || 'Login failed');
            }
        } catch (err) {
            console.error('Login error:', err);
            if (err.code === 'ECONNABORTED') {
                setError('Login request timed out. Please try again.');
            } else if (!err.response) {
                setError('Cannot connect to server. Please check if the backend is running.');
            } else {
                setError(err.response?.data?.message || err.message || 'Login failed');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-page">
            <div className="login-container">
                <div className="login-box">
                    <h2>Employee Management System</h2>
                    <h3>Login</h3>
                    
                    {error && <div className="alert alert-error">{error}</div>}
                    
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label>Email:</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        
                        <div className="form-group">
                            <label>Password:</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                        
                        <button type="submit" className="btn btn-primary" disabled={loading}>
                            {loading ? 'Logging in...' : 'Login'}
                        </button>
                    </form>
                    
                    <p className="login-footer">
                        Don't have an account? <Link to="/register">Register here</Link>
                    </p>
                    
                    <div className="demo-credentials">
                        <p><strong>Demo Credentials:</strong></p>
                        <p>Admin: admin@company.com / admin123</p>
                        <p>Employee: john.doe@company.com / emp123</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
