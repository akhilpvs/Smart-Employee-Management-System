# Getting Started Guide

## Quick Start (5 minutes)

### Prerequisites
- ✅ MySQL Server running
- ✅ Node.js v14+ installed
- ✅ Java JDK v17+ (for Spring Boot backend - optional)
- ✅ Maven (for Spring Boot backend - optional)

### 1. Database Setup (1 minute)

```bash
# Open MySQL and run:
mysql -u root -p < database/sql/employee_management.sql
```

Or import the SQL file through MySQL Workbench GUI.

### 2. Install Dependencies (2 minutes)

**Windows:**
```bash
install_dependencies.bat
```

**Linux/Mac:**
```bash
bash install_dependencies.sh
```

### 3. Start Servers (1 minute)

**Windows:**
```bash
start_servers.bat
```

**Linux/Mac:**
```bash
bash start_servers.sh
```

Or start individually:

**Terminal 1 - Backend:**
```bash
cd backend-node
npm start
```

**Terminal 2 - Frontend:**
```bash
cd frontend-react
npm start
```

### 4. Login (1 minute)

Open http://localhost:3000 in your browser

**Demo Credentials:**
- Email: `admin@company.com`
- Password: `admin123`

---

## Detailed Setup Steps

### Database Configuration

1. **Install MySQL**
   - Download from mysql.com
   - Install with default settings
   - Note your root password

2. **Create Database**
   ```bash
   # Navigate to project root
   cd Smart\ Employee\ Management\ \&\ Payroll\ System
   
   # Run SQL script
   mysql -u root -p < database/sql/employee_management.sql
   
   # Or import through MySQL Workbench
   # File → Open SQL Script → Select employee_management.sql
   ```

3. **Verify Database**
   ```bash
   mysql -u root -p
   mysql> USE employee_management;
   mysql> SHOW TABLES;
   ```

### Node.js Backend Setup

1. **Navigate to backend directory**
   ```bash
   cd backend-node
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment** (already configured in .env)
   ```
   PORT=5000
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=
   ```

4. **Start server**
   ```bash
   npm start
   # or for development with auto-reload
   npm run dev
   ```

5. **Test API**
   ```bash
   # In another terminal:
   curl http://localhost:5000/health
   ```

### React Frontend Setup

1. **Navigate to frontend directory**
   ```bash
   cd frontend-react
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm start
   ```

4. **Browser opens automatically** to http://localhost:3000

### Java Spring Boot Setup (Optional)

1. **Navigate to backend directory**
   ```bash
   cd backend-java
   ```

2. **Build project**
   ```bash
   mvn clean install
   ```

3. **Run application**
   ```bash
   mvn spring-boot:run
   ```

4. **Server starts on** http://localhost:8080

---

## Testing the Application

### 1. Login & Dashboard
- Navigate to http://localhost:3000
- Login with demo credentials
- View dashboard statistics

### 2. Employee Management
- Click "Employees" menu
- View employee list
- Search for employees
- (Edit/Delete features available for Admin)

### 3. Attendance
- Click "Attendance" menu
- Click "Check In" button
- Later click "Check Out" button

### 4. Leave Management
- Click "Leave" menu
- View leave balance
- Click "Apply for Leave"
- Fill in form and submit

### 5. Payroll
- Click "Payroll" menu
- Select month and year
- Click "Generate Payslip"
- View salary details

---

## Common Issues & Solutions

### Issue: Database Connection Error

**Error Message:**
```
✗ Database connection failed: connect ECONNREFUSED 127.0.0.1:3306
```

**Solution:**
1. Ensure MySQL is running
   ```bash
   # Windows
   net start MySQL80
   
   # Mac
   brew services start mysql
   
   # Linux
   sudo systemctl start mysql
   ```

2. Check credentials in `.env`
   ```
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=your_password
   ```

3. Verify database exists
   ```bash
   mysql -u root -p -e "SHOW DATABASES LIKE 'employee_management';"
   ```

### Issue: Port Already in Use

**Error Message:**
```
listen EADDRINUSE: address already in use :::5000
```

**Solution:**
```bash
# Windows - Kill process using port 5000
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Linux/Mac - Kill process using port 5000
lsof -i :5000
kill -9 <PID>

# Or change port in .env
PORT=5001
```

### Issue: CORS Error in Console

**Error Message:**
```
Access to XMLHttpRequest blocked by CORS policy
```

**Solution:**
1. Verify backend is running on port 5000
2. Check CORS_ORIGIN in `.env`:
   ```
   CORS_ORIGIN=http://localhost:3000
   ```
3. Restart backend server

### Issue: Cannot Find Module Error

**Error Message:**
```
Cannot find module 'express'
```

**Solution:**
```bash
# Delete node_modules
rm -rf node_modules package-lock.json

# Reinstall dependencies
npm install
```

### Issue: React App Doesn't Load

**Solution:**
1. Clear browser cache (Ctrl+Shift+Delete)
2. Check console for errors (F12)
3. Verify backend is running
4. Restart React dev server:
   ```bash
   npm start
   ```

---

## Performance Tips

### Optimize Database
```sql
-- Create indexes for frequently queried columns
CREATE INDEX idx_employee_email ON employees(email);
CREATE INDEX idx_attendance_date ON attendance(attendance_date);
```

### Frontend Optimization
1. Enable production build for testing:
   ```bash
   npm run build
   npx serve -s build
   ```

2. Use browser dev tools to check performance

### Backend Optimization
1. Enable query logging (development only):
   ```env
   SHOW_SQL=true
   ```

2. Use connection pooling (already configured)

---

## Production Deployment

### Pre-Deployment Checklist

- [ ] Change JWT_SECRET to strong random key
- [ ] Set NODE_ENV=production
- [ ] Update database credentials
- [ ] Configure CORS_ORIGIN for production URL
- [ ] Enable HTTPS/SSL
- [ ] Set up environment-specific .env file
- [ ] Run security audit: `npm audit`
- [ ] Test all functionality
- [ ] Set up monitoring & logging
- [ ] Create database backups

### Deployment Steps

1. **Build React App**
   ```bash
   cd frontend-react
   npm run build
   ```

2. **Deploy Frontend**
   - Use Netlify, Vercel, or your hosting
   - Point to `build` folder

3. **Deploy Backend**
   - Use Heroku, AWS, or your server
   - Set environment variables

4. **Update API URLs**
   - Update CORS_ORIGIN
   - Update REACT_APP_API_URL

---

## Next Steps

1. **Understand the Codebase**
   - Review Node.js controllers in `backend-node/controllers/`
   - Review React components in `frontend-react/src/pages/`
   - Review API routes in `backend-node/routes/`

2. **Customize the Application**
   - Add company branding/logo
   - Customize color scheme
   - Add additional fields to employees
   - Create custom reports

3. **Add Features**
   - Email notifications
   - SMS alerts
   - Advanced analytics
   - Mobile app
   - Real-time notifications

4. **Security Enhancements**
   - Implement 2FA
   - Add audit logging
   - Encrypt sensitive data
   - Rate limiting

---

## Getting Help

### Documentation
- See `README.md` for project overview
- See `API_DOCUMENTATION.md` for API endpoints
- See `SETUP_GUIDE.md` for environment variables

### Common Resources
- [Node.js Documentation](https://nodejs.org/docs/)
- [React Documentation](https://react.dev/)
- [MySQL Documentation](https://dev.mysql.com/doc/)
- [Express.js Guide](https://expressjs.com/)
- [Spring Boot Docs](https://spring.io/projects/spring-boot)

---

**Happy coding! 🚀**

For issues or questions, refer to the troubleshooting section or review the documentation files.
