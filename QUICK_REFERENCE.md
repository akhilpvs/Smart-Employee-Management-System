# Employee Management System - Complete Project
## Quick Reference Guide

### 📁 Project Structure at a Glance

```
Smart Employee Management & Payroll System/
├── backend-node/              ← Node.js REST API
├── backend-java/              ← Spring Boot Service (Optional)
├── frontend-react/            ← React.js UI
├── database/sql/              ← MySQL Schema
├── README.md                  ← Project Overview
├── GETTING_STARTED.md         ← Quick Start (Read First!)
├── SETUP_GUIDE.md             ← Configuration Guide
├── API_DOCUMENTATION.md       ← API Endpoints
├── FEATURES.md                ← Complete Features List
└── Quick Start Scripts         ← Automated Setup
```

---

### 🚀 Quick Start Commands

#### Windows
```bash
# Step 1: Install all dependencies
install_dependencies.bat

# Step 2: Start all servers
start_servers.bat

# Step 3: Open browser
# http://localhost:3000
```

#### Linux/Mac
```bash
# Step 1: Install all dependencies
bash install_dependencies.sh

# Step 2: Start all servers
bash start_servers.sh

# Step 3: Open browser
# http://localhost:3000
```

---

### 🔐 Demo Login Credentials

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@company.com | admin123 |
| Employee | john.doe@company.com | emp123 |
| Employee | jane.smith@company.com | emp123 |

---

### 🌐 Server URLs

| Service | URL | Status |
|---------|-----|--------|
| Frontend (React) | http://localhost:3000 | ✓ Required |
| Backend (Node.js) | http://localhost:5000/api | ✓ Required |
| Backend (Java) | http://localhost:8080/api | ◑ Optional |
| MySQL Database | localhost:3306 | ✓ Required |

---

### 📋 Database Setup (First Time Only)

```sql
-- Open MySQL command line or MySQL Workbench
-- Run this file: database/sql/employee_management.sql

-- Or execute:
mysql -u root -p < database/sql/employee_management.sql

-- Verify tables created:
mysql -u root -p
mysql> USE employee_management;
mysql> SHOW TABLES;
```

---

### 📂 Important Files to Know

#### Backend-Node
| File | Purpose |
|------|---------|
| `server.js` | Main entry point |
| `.env` | Environment variables |
| `package.json` | Dependencies |
| `config/database.js` | DB connection |
| `middleware/authMiddleware.js` | JWT validation |
| `controllers/` | Business logic |
| `routes/` | API endpoints |

#### Frontend-React
| File | Purpose |
|------|---------|
| `src/App.js` | Main component |
| `src/index.js` | React entry point |
| `src/pages/` | Page components |
| `src/components/` | Reusable components |
| `src/services/api.js` | API calls |
| `package.json` | Dependencies |

#### Database
| File | Purpose |
|------|---------|
| `database/sql/employee_management.sql` | Complete schema |

---

### 🔧 Manual Server Startup

#### Terminal 1 - Node.js Backend
```bash
cd backend-node
npm install      # First time only
npm start
# Server runs on http://localhost:5000
```

#### Terminal 2 - React Frontend
```bash
cd frontend-react
npm install      # First time only
npm start
# Opens http://localhost:3000 automatically
```

#### Terminal 3 - Java Backend (Optional)
```bash
cd backend-java
mvn clean install  # First time only
mvn spring-boot:run
# Server runs on http://localhost:8080
```

---

### 🧪 Testing Checklist

- [ ] Login with admin@company.com / admin123
- [ ] View Dashboard (statistics)
- [ ] View Employee List
- [ ] Search for employee
- [ ] Click Check In (Attendance)
- [ ] Click Check Out (Attendance)
- [ ] Apply for Leave
- [ ] Generate Payslip
- [ ] Logout

---

### 🐛 Common Issues

| Issue | Solution |
|-------|----------|
| Can't connect to MySQL | Start MySQL service, check credentials |
| Port 5000 in use | Change PORT in `.env` or kill process |
| Port 3000 in use | React will auto-select alternate port |
| Module not found | Run `npm install` again |
| CORS error | Ensure backend is running, check CORS_ORIGIN |
| Blank page | Check browser console (F12), restart servers |

---

### 📚 Key Concepts

**JWT Authentication**: Token-based login system
- Generated on login
- Sent with every request
- Expires after 7 days
- Used for role verification

**MVC Pattern**: Model-View-Controller architecture
- Models: Database entities
- Views: React components
- Controllers: Business logic

**REST API**: Standard HTTP methods
- GET: Retrieve data
- POST: Create data
- PUT: Update data
- DELETE: Remove data

---

### 🎯 API Endpoint Categories

#### Authentication (2)
- User Registration
- User Login

#### Employees (7)
- List, Get, Search, Add, Update, Delete, Photo

#### Attendance (4)
- Check-in, Check-out, Records, Monthly Report

#### Leave (4)
- Apply, Approve/Reject, History, Balance

#### Payroll (3)
- Generate Payslip, Records, Statistics

**Total: 20+ endpoints**

---

### 💾 Database Tables (5)

| Table | Purpose |
|-------|---------|
| users | Authentication |
| employees | Employee info |
| attendance | Daily attendance |
| leaves | Leave requests |
| payroll | Salary records |

---

### 🎨 Frontend Pages (6)

1. **Login** - User authentication
2. **Dashboard** - Overview & statistics
3. **Employees** - Employee management
4. **Attendance** - Check-in/Check-out
5. **Leave** - Leave applications
6. **Payroll** - Payslips

---

### 📖 Documentation Files

| File | Read For |
|------|----------|
| README.md | Project overview |
| GETTING_STARTED.md | Step-by-step setup |
| SETUP_GUIDE.md | Configuration details |
| API_DOCUMENTATION.md | API endpoints |
| FEATURES.md | Complete features |
| QUICK_REFERENCE.md | This file! |

---

### ✅ Pre-Deployment Checklist

- [ ] Change JWT_SECRET in .env
- [ ] Update database credentials
- [ ] Test all functionality
- [ ] Configure CORS for production
- [ ] Set NODE_ENV=production
- [ ] Run npm audit for vulnerabilities
- [ ] Update API URLs in frontend
- [ ] Set up HTTPS/SSL
- [ ] Create database backups
- [ ] Set up monitoring

---

### 🚀 Next Steps

1. **Immediate**: Follow GETTING_STARTED.md
2. **Short-term**: Test all features thoroughly
3. **Medium-term**: Customize branding & styles
4. **Long-term**: Add new features, deploy

---

### 📞 Support Resources

- **Node.js**: nodejs.org/docs
- **React**: react.dev
- **MySQL**: dev.mysql.com/doc
- **Express**: expressjs.com
- **Spring Boot**: spring.io

---

### 💡 Tips

- Always check browser console (F12) for errors
- Keep terminals visible to see server logs
- Restart services if changes don't appear
- Clear browser cache if stuck on old data
- Check `.env` files for configuration issues
- Use Chrome DevTools for debugging

---

**Version**: 1.0.0  
**Last Updated**: April 2024  
**Status**: Production Ready ✓

Start with **GETTING_STARTED.md** → Success! 🎉
