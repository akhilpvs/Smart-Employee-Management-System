// API Service Configuration
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

// Create axios instance
const axiosInstance = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json'
    },
    timeout: 10000 // 10 second timeout
});

// Add authorization token to requests
axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Authentication Service
export const authService = {
    register: (email, password, role) => 
        axiosInstance.post('/auth/register', { email, password, role }),
    
    login: (email, password) => 
        axiosInstance.post('/auth/login', { email, password }),
    
    getProfile: () => axiosInstance.get('/auth/me'),
    
    logout: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    }
};

// Employee Service
export const employeeService = {
    getAll: () => axiosInstance.get('/employees'),
    
    getById: (id) => axiosInstance.get(`/employees/${id}`),
    
    search: (name) => axiosInstance.get(`/employees/search/name?name=${name}`),
    
    add: (employee) => axiosInstance.post('/employees', employee),
    
    update: (id, employee) => axiosInstance.put(`/employees/${id}`, employee),
    
    delete: (id) => axiosInstance.delete(`/employees/${id}`),
    
    uploadPhoto: (id, file) => {
        const formData = new FormData();
        formData.append('file', file);
        return axiosInstance.post(`/employees/${id}/photo`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
    }
};

// Attendance Service
export const attendanceService = {
    checkIn: (employee_id) => axiosInstance.post('/attendance/checkin', { employee_id }),
    
    checkOut: (employee_id) => axiosInstance.post('/attendance/checkout', { employee_id }),
    
    getRecords: (employee_id, from_date, to_date) => 
        axiosInstance.get('/attendance', { params: { employee_id, from_date, to_date } }),
    
    getMonthlyReport: (employee_id, month, year) =>
        axiosInstance.get('/attendance/report/monthly', { params: { employee_id, month, year } })
};

// Leave Service
export const leaveService = {
    apply: (employee_id, leave_type, start_date, end_date, reason) =>
        axiosInstance.post('/leave/apply', { employee_id, leave_type, start_date, end_date, reason }),
    
    updateStatus: (id, status, approved_by) =>
        axiosInstance.put(`/leave/${id}`, { status, approved_by }),
    
    getHistory: (employee_id, status) =>
        axiosInstance.get('/leave/history/all', { params: { employee_id, status } }),
    
    getAllRequests: () => axiosInstance.get('/leave/admin/all'),
    
    getBalance: (employee_id, year) =>
        axiosInstance.get('/leave/balance/check', { params: { employee_id, year } })
};

// Payroll Service
export const payrollService = {
    generatePayslip: (employee_id, month, year) =>
        axiosInstance.get(`/payroll/generate/${employee_id}/${month}/${year}`),
    
    getRecords: (employee_id, month, year) =>
        axiosInstance.get('/payroll', { params: { employee_id, month, year } }),
    
    getDashboardStats: () => axiosInstance.get('/payroll/dashboard/stats')
};

export default axiosInstance;
