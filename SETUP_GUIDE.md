# Environment Variables Configuration Guide

## Backend-Node (.env)

Located in: `backend-node/.env`

```
# Node Environment
NODE_ENV=development

# Server Port
PORT=5000

# Database Configuration
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=employee_management
DB_PORT=3306

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRY=7d

# File Upload
MAX_FILE_SIZE=5000000
UPLOAD_DIR=./uploads

# CORS
CORS_ORIGIN=http://localhost:3000
```

## Frontend-React (.env)

Located in: `frontend-react/` (if needed)

```
REACT_APP_API_URL=http://localhost:5000/api
```

## Backend-Java (application.properties)

Located in: `backend-java/src/main/resources/application.properties`

```
spring.application.name=employee-management
server.port=8080

# MySQL Configuration
spring.datasource.url=jdbc:mysql://localhost:3306/employee_management
spring.datasource.username=root
spring.datasource.password=
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver

# JPA Configuration
spring.jpa.database-platform=org.hibernate.dialect.MySQL8Dialect
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=false
```

## Important Notes

1. **Change JWT_SECRET** in production to a strong random key
2. **Update DB_PASSWORD** with your actual MySQL password
3. **Configure CORS_ORIGIN** based on your frontend URL
4. **Update API URLs** if backend runs on different port/host
5. **Never commit .env files** with sensitive data to version control

---

For more details, see README.md
