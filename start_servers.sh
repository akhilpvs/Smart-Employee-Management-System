#!/bin/bash
# Start All Servers Script (Linux/Mac)

echo ""
echo "========================================"
echo "Employee Management System - Start Servers"
echo "========================================"
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "ERROR: Node.js is not installed"
    exit 1
fi

echo "Starting Node.js Backend on Port 5000..."
cd backend-node && npm start &
BACKEND_PID=$!

sleep 3

echo "Starting React Frontend on Port 3000..."
cd ../frontend-react && npm start &
FRONTEND_PID=$!

echo ""
echo "========================================"
echo "Servers Started!"
echo "========================================"
echo ""
echo "Frontend: http://localhost:3000"
echo "Backend API: http://localhost:5000/api"
echo ""
echo "Demo Credentials:"
echo "- Admin: admin@company.com / admin123"
echo "- Employee: john.doe@company.com / emp123"
echo ""
echo "To start Java Spring Boot backend (optional):"
echo "cd backend-java && mvn spring-boot:run"
echo "Java Backend: http://localhost:8080/api"
echo ""
echo "To stop servers, press Ctrl+C"
echo ""

# Wait for both processes
wait
