#!/bin/bash
# Quick Start Script for Employee Management System (Linux/Mac)

echo ""
echo "========================================"
echo "Employee Management System - Quick Start"
echo "========================================"
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "ERROR: Node.js is not installed. Please install Node.js v14+"
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "ERROR: npm is not installed. Please install Node.js"
    exit 1
fi

echo ""
echo "Step 1: Installing Node.js Backend Dependencies..."
echo "========================================="
cd backend-node
npm install
if [ $? -ne 0 ]; then
    echo "ERROR: Failed to install Node.js dependencies"
    exit 1
fi
cd ..

echo ""
echo "Step 2: Installing React Frontend Dependencies..."
echo "========================================="
cd frontend-react
npm install
if [ $? -ne 0 ]; then
    echo "ERROR: Failed to install React dependencies"
    exit 1
fi
cd ..

echo ""
echo "========================================"
echo "Installation Complete!"
echo "========================================"
echo ""
echo "Next Steps:"
echo "1. Make sure MySQL is running with database created"
echo "2. Run: ./start_servers.sh (to start all servers)"
echo "3. Or run individually:"
echo "   - Backend: cd backend-node && npm start"
echo "   - Frontend: cd frontend-react && npm start"
echo "   - Java Backend: cd backend-java && mvn spring-boot:run"
echo ""
