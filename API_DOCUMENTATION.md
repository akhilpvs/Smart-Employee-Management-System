# API Routes and Endpoints Documentation

## Base URL
- **Node.js Backend**: `http://localhost:5000/api`
- **Spring Boot Backend**: `http://localhost:8080/api`

## Authentication Endpoints

### Register User
```
POST /auth/register
Content-Type: application/json

Body:
{
  "email": "user@example.com",
  "password": "password123",
  "role": "Employee"  // Admin or Employee
}

Response:
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "id": 1,
    "email": "user@example.com"
  }
}
```

### Login User
```
POST /auth/login
Content-Type: application/json

Body:
{
  "email": "admin@company.com",
  "password": "admin123"
}

Response:
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": 1,
      "email": "admin@company.com",
      "role": "Admin"
    }
  }
}
```

## Employee Endpoints

### Get All Employees
```
GET /employees
Authorization: Bearer <token>

Response:
{
  "success": true,
  "data": [...],
  "total": 2
}
```

### Get Employee by ID
```
GET /employees/:id
Authorization: Bearer <token>
```

### Search Employees
```
GET /employees/search/name?name=John
Authorization: Bearer <token>
```

### Add Employee
```
POST /employees
Authorization: Bearer <token>
Content-Type: application/json

Body:
{
  "user_id": 2,
  "first_name": "John",
  "last_name": "Doe",
  "email": "john@example.com",
  "phone": "9876543210",
  "date_of_birth": "1990-05-15",
  "department": "IT",
  "designation": "Developer",
  "salary": 75000,
  "hire_date": "2023-01-15"
}
```

### Update Employee
```
PUT /employees/:id
Authorization: Bearer <token>
Content-Type: application/json

Body:
{
  "first_name": "John",
  "last_name": "Doe",
  "phone": "9876543210",
  "department": "IT",
  "designation": "Senior Developer",
  "salary": 80000,
  "status": "Active"
}
```

### Delete Employee
```
DELETE /employees/:id
Authorization: Bearer <token>
```

### Upload Profile Photo
```
POST /employees/:id/photo
Authorization: Bearer <token>
Content-Type: multipart/form-data

Body: file (binary)
```

## Attendance Endpoints

### Check In
```
POST /attendance/checkin
Authorization: Bearer <token>
Content-Type: application/json

Body:
{
  "employee_id": 1
}

Response:
{
  "success": true,
  "message": "Check-in successful",
  "data": { "id": 1 }
}
```

### Check Out
```
POST /attendance/checkout
Authorization: Bearer <token>
Content-Type: application/json

Body:
{
  "employee_id": 1
}

Response:
{
  "success": true,
  "message": "Check-out successful",
  "data": { "hoursWorked": 8.5 }
}
```

### Get Attendance Records
```
GET /attendance?employee_id=1&from_date=2024-04-01&to_date=2024-04-30
Authorization: Bearer <token>
```

### Get Monthly Report
```
GET /attendance/report/monthly?employee_id=1&month=4&year=2024
Authorization: Bearer <token>

Response:
{
  "success": true,
  "data": {
    "present_days": 20,
    "absent_days": 2,
    "half_days": 0,
    "avg_hours": 8.2,
    "total_hours": 164
  }
}
```

## Leave Endpoints

### Apply for Leave
```
POST /leave/apply
Authorization: Bearer <token>
Content-Type: application/json

Body:
{
  "employee_id": 1,
  "leave_type": "Annual",  // Sick, Casual, Annual, Personal
  "start_date": "2024-05-01",
  "end_date": "2024-05-05",
  "reason": "Summer vacation"
}

Response:
{
  "success": true,
  "message": "Leave request submitted successfully",
  "data": { "id": 1, "no_of_days": 5 }
}
```

### Approve/Reject Leave
```
PUT /leave/:id
Authorization: Bearer <token> (Admin only)
Content-Type: application/json

Body:
{
  "status": "Approved",  // or "Rejected"
  "approved_by": 1
}
```

### Get Leave History
```
GET /leave/history/all?employee_id=1&status=Approved
Authorization: Bearer <token>
```

### Get Leave Balance
```
GET /leave/balance/check?employee_id=1&year=2024
Authorization: Bearer <token>

Response:
{
  "success": true,
  "data": {
    "annual_balance": 15,
    "sick_balance": 10,
    "casual_balance": 5,
    "personal_balance": 5
  }
}
```

## Payroll Endpoints

### Generate Payslip
```
GET /payroll/generate/:employeeId/:month/:year
Authorization: Bearer <token>

Example: /payroll/generate/1/4/2024

Response:
{
  "success": true,
  "data": {
    "employee": {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com"
    },
    "month": 4,
    "year": 2024,
    "salary": 75000,
    "bonus": 5000,
    "deductions": 2000,
    "tax": 12000,
    "net_salary": 66000,
    "attendance_days": 20
  }
}
```

### Get Payroll Records
```
GET /payroll?employee_id=1&month=4&year=2024
Authorization: Bearer <token>
```

### Get Dashboard Statistics
```
GET /payroll/dashboard/stats
Authorization: Bearer <token>

Response:
{
  "success": true,
  "data": {
    "total_employees": 2,
    "present_today": 1,
    "absent_today": 1,
    "total_monthly_salary": 140000
  }
}
```

## Error Responses

All endpoints return consistent error responses:

```
{
  "success": false,
  "message": "Error description",
  "errors": [...]  // Validation errors if applicable
}
```

## Status Codes

- `200 OK` - Successful GET request
- `201 Created` - Successful POST request
- `400 Bad Request` - Validation error
- `401 Unauthorized` - Authentication required
- `403 Forbidden` - Insufficient permissions
- `404 Not Found` - Resource not found
- `500 Internal Server Error` - Server error

## Authentication

All protected endpoints require JWT token in the Authorization header:

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## Pagination

Future versions may include pagination. Currently, all list endpoints return all records.

---

For more information, see README.md and SETUP_GUIDE.md
