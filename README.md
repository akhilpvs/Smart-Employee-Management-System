# Employee Management System - Complete Project

A comprehensive full-stack Employee Management System built with Node.js/Express, Java Spring Boot, React.js, and MySQL.

## 📋 Project Overview

This Employee Management System includes:

### Modules:
- **Authentication**: User registration, login, JWT authentication
- **Employee Management**: Add, update, delete, search employees
- **Attendance Tracking**: Daily check-in/check-out with attendance reports
- **Leave Management**: Apply, approve/reject leaves with balance tracking
- **Payroll Management**: Salary calculation, bonuses, tax deductions, payslips
- **Dashboard**: Real-time statistics and analytics

### Tech Stack:

**Backend:**
- Node.js with Express.js (REST API, JWT Auth, CORS)
- Java Spring Boot (Business logic service)
- MySQL Database

**Frontend:**
- React.js with Functional Components & Hooks
- Axios for API calls
- Responsive CSS3 styling

## 📁 Project Structure

```
Employee Management System/
├── backend-node/              # Node.js Express backend
│   ├── config/               # Database configuration
│   ├── controllers/          # Request handlers
│   ├── middleware/           # Auth & error middleware
│   ├── models/              # Data models
│   ├── routes/              # API routes
│   ├── utils/               # Utility functions
│   ├── uploads/             # Profile photo uploads
│   ├── .env                 # Environment variables
│   ├── package.json         # Node.js dependencies
│   └── server.js            # Main server file
│
├── backend-java/            # Spring Boot backend
│   ├── src/main/java/
│   │   └── com/example/employeemanagement/
│   │       ├── entity/      # JPA entities
│   │       ├── repository/  # JPA repositories
│   │       ├── service/     # Business logic
│   │       ├── controller/  # REST controllers
│   │       └── EmployeeManagementApplication.java
│   ├── src/main/resources/
│   │   └── application.properties
│   └── pom.xml             # Maven dependencies
│
├── frontend-react/          # React.js frontend
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── pages/          # Page components
│   │   ├── services/       # API service
│   │   ├── styles/         # CSS stylesheets
│   │   ├── App.js
│   │   └── index.js
│   └── package.json
│
└── database/
    └── sql/
        └── employee_management.sql  # Database schema
```

## 🚀 Getting Started

### Prerequisites:
- Node.js (v14+)
- Java JDK (v17+)
- Maven
- MySQL (v5.7+)
- Git

### Step 1: Set Up MySQL Database

1. Open MySQL command line or MySQL Workbench
2. Run the SQL script to create database and tables:

```bash
mysql -u root -p < database/sql/employee_management.sql
```

Or copy-paste the entire `employee_management.sql` file content in MySQL client.

**Demo Credentials:**
- Admin: `admin@company.com` / `admin123`
- Employee: `john.doe@company.com` / `emp123`
- Employee: `jane.smith@company.com` / `emp123`

### Step 2: Set Up Node.js Backend

```bash
cd backend-node

# Install dependencies
npm install

# Create .env file (already provided, verify settings)
# Edit .env if your MySQL credentials are different

# Start the server
npm start
# Server runs on http://localhost:5000
```

### Step 3: Set Up Java Spring Boot Backend (Optional)

```bash
cd backend-java

# Build the project
mvn clean install

# Run the application
mvn spring-boot:run
# Server runs on http://localhost:8080
```

### Step 4: Set Up React Frontend

```bash
cd frontend-react

# Install dependencies
npm install

# Start the development server
npm start
# Application opens on http://localhost:3000
```

## 🔐 API Endpoints

### Authentication
```
POST   /api/auth/register
POST   /api/auth/login
```

### Employees
```
GET    /api/employees              # Get all employees
GET    /api/employees/:id          # Get single employee
GET    /api/employees/search/name  # Search employees
POST   /api/employees              # Add employee
PUT    /api/employees/:id          # Update employee
DELETE /api/employees/:id          # Delete employee
POST   /api/employees/:id/photo    # Upload profile photo
```

### Attendance
```
POST   /api/attendance/checkin     # Check in
POST   /api/attendance/checkout    # Check out
GET    /api/attendance             # Get attendance records
GET    /api/attendance/report/monthly  # Monthly report
```

### Leave
```
POST   /api/leave/apply            # Apply for leave
PUT    /api/leave/:id              # Approve/reject leave
GET    /api/leave/history/all      # Get leave history
GET    /api/leave/balance/check    # Get leave balance
```

### Payroll
```
GET    /api/payroll/generate/:employeeId/:month/:year  # Generate payslip
GET    /api/payroll                # Get payroll records
GET    /api/payroll/dashboard/stats  # Dashboard statistics
```

## 🔑 Key Features

### 1. User Authentication
- Secure JWT-based authentication
- Password hashing with bcryptjs
- Role-based access control (Admin/Employee)

### 2. Employee Management
- Add/Update/Delete employees
- Search functionality
- Profile photo upload
- Salary management

### 3. Attendance System
- Real-time check-in/check-out
- Automatic hours calculation
- Daily attendance tracking
- Monthly attendance reports

### 4. Leave Management
- Apply for different leave types (Annual, Sick, Casual, Personal)
- Leave approval workflow
- Leave balance calculation
- Leave history tracking

### 5. Payroll Management
- Automatic salary calculation
- Bonus and deduction tracking
- Tax computation
- Payslip generation

### 6. Dashboard
- Real-time statistics
- Present/Absent count
- Total monthly salary expense
- Quick overview

## 📝 Database Schema

### users
- id, email, password, role, created_at, updated_at

### employees
- id, user_id, first_name, last_name, email, phone, date_of_birth, department, designation, salary, hire_date, profile_photo, status

### attendance
- id, employee_id, check_in_time, check_out_time, attendance_date, hours_worked, status

### leaves
- id, employee_id, leave_type, start_date, end_date, no_of_days, reason, status, approved_by

### payroll
- id, employee_id, month, year, salary, bonus, deductions, tax, net_salary, attendance_days, status

## 🎨 Frontend Pages

1. **Login Page**: Secure login with demo credentials displayed
2. **Dashboard**: Statistics and overview
3. **Employee List**: View, search, edit, delete employees
4. **Attendance**: Check-in/Check-out functionality
5. **Leave Management**: Apply and track leaves
6. **Payroll**: View and generate payslips

## ⚙️ Configuration Files

### .env (Backend-Node)
```
NODE_ENV=development
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=employee_management
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
CORS_ORIGIN=http://localhost:3000
```

### application.properties (Backend-Java)
```
spring.datasource.url=jdbc:mysql://localhost:3306/employee_management
spring.datasource.username=root
spring.datasource.password=
```

## 🧪 Testing the Application

1. **Login**: Use admin@company.com / admin123
2. **Dashboard**: View statistics
3. **Employees**: Browse and manage employees
4. **Attendance**: Click check-in to record attendance
5. **Leave**: Apply for leave and check balance
6. **Payroll**: View payslips for different months

## 📊 Sample Data

The database comes pre-loaded with:
- 1 Admin user
- 2 Employee users
- 2 Sample employees
- Sample attendance records
- Sample leave applications
- Sample payroll records

## 🔒 Security Features

- JWT token-based authentication
- Password hashing with bcryptjs
- CORS configuration
- Input validation with express-validator
- Role-based authorization
- SQL injection prevention

## 📱 Responsive Design

The application is fully responsive and works on:
- Desktop (1920px and above)
- Tablet (768px - 1024px)
- Mobile (320px - 767px)

## 🐛 Troubleshooting

### Database Connection Error
- Verify MySQL is running
- Check credentials in .env file
- Ensure database `employee_management` exists

### Port Already in Use
- Change PORT in .env or specify with -p flag
- Node.js: `PORT=5001 npm start`

### CORS Error
- Verify CORS_ORIGIN in .env matches frontend URL
- Check backend server is running

### Module Not Found
- Delete node_modules and package-lock.json
- Run `npm install` again

## 📚 API Documentation

All API endpoints require JWT token in Authorization header:
```
Authorization: Bearer <token>
```

## 🤝 Contributing

This project is complete and ready for production deployment or educational use.

## 📄 License

This project is provided as-is for educational and commercial use.

## 👨‍💻 Author

Created for comprehensive full-stack development learning.

## 🎯 Next Steps

1. Deploy to production servers
2. Add email notifications
3. Implement advanced analytics
4. Add mobile app support
5. Implement 2FA for security
6. Add audit logging
7. Implement real-time notifications

---

**Happy coding! 🚀**
