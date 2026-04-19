# Deployment Guide - Employee Management System

## 📋 Overview

This guide covers deploying the Employee Management System to various platforms including cloud services, VPS, and Docker.

---

## 🔒 Pre-Deployment Security Checklist

Before deploying to production:

### Backend Configuration
- [ ] Generate strong JWT_SECRET (use `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`)
- [ ] Set NODE_ENV=production
- [ ] Configure database with strong password
- [ ] Enable HTTPS/SSL certificates
- [ ] Set up firewall rules
- [ ] Configure secure CORS origin
- [ ] Update database connection pool settings
- [ ] Enable access logging

### Frontend Configuration
- [ ] Update API_URL to production backend
- [ ] Build optimized version: `npm run build`
- [ ] Minify CSS and JavaScript
- [ ] Remove console.log statements
- [ ] Test all functionality
- [ ] Configure analytics

### Database Configuration
- [ ] Change MySQL root password
- [ ] Create database user with limited privileges
- [ ] Enable binary logging for backups
- [ ] Configure replication if needed
- [ ] Set up automated backups
- [ ] Enable database encryption
- [ ] Configure slow query logging

### Application Security
- [ ] Run security audit: `npm audit`
- [ ] Update all dependencies to latest stable versions
- [ ] Enable helmet for security headers
- [ ] Configure rate limiting
- [ ] Set up request size limits
- [ ] Enable CSRF protection if applicable
- [ ] Configure 2FA authentication
- [ ] Set up audit logging

---

## 🚀 Deployment Options

### Option 1: Heroku (Easiest for Beginners)

#### Prerequisites
- Heroku account (free tier available)
- Heroku CLI installed
- Git installed

#### Steps

**1. Prepare Backend**
```bash
cd backend-node

# Create Procfile
echo "web: npm start" > Procfile

# Create heroku app
heroku create your-app-name

# Add MySQL database addon
heroku addons:create cleardb:ignite

# Set environment variables
heroku config:set JWT_SECRET=your_secret_key
heroku config:set NODE_ENV=production
```

**2. Deploy**
```bash
# Push to Heroku
git push heroku main

# View logs
heroku logs --tail
```

**3. Initialize Database**
```bash
heroku run bash
mysql -u [user] -p[password] -h [host] < database/sql/employee_management.sql
exit
```

#### Frontend on Netlify

**1. Build**
```bash
cd frontend-react
npm run build
```

**2. Deploy to Netlify**
```bash
npm install -g netlify-cli
netlify deploy --prod --dir=build
```

**3. Configure Environment**
- Set `REACT_APP_API_URL` to your Heroku backend URL

---

### Option 2: AWS EC2 (Most Flexible)

#### Prerequisites
- AWS account
- EC2 instance (Ubuntu 20.04)
- Security groups configured

#### Steps

**1. Connect to Instance**
```bash
ssh -i your-key.pem ubuntu@your-instance-ip
```

**2. Install Dependencies**
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Install MySQL
sudo apt install -y mysql-server

# Install Nginx (reverse proxy)
sudo apt install -y nginx

# Install PM2 (process manager)
sudo npm install -g pm2
```

**3. Configure MySQL**
```bash
sudo mysql_secure_installation

# Create database
mysql -u root -p < database/sql/employee_management.sql
```

**4. Deploy Application**
```bash
# Clone repository
git clone your-repo-url
cd Smart\ Employee\ Management\ \&\ Payroll\ System

# Install dependencies
cd backend-node
npm install

# Start with PM2
pm2 start server.js --name "emp-mgmt-api"
pm2 save
pm2 startup
```

**5. Configure Nginx**
```bash
sudo nano /etc/nginx/sites-available/default
```

Add:
```nginx
server {
    listen 80;
    server_name your-domain.com;

    location /api {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_cache_bypass $http_upgrade;
    }

    location / {
        root /path/to/frontend-react/build;
        try_files $uri /index.html;
    }
}
```

**6. Enable HTTPS**
```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com
```

---

### Option 3: Docker (Scalable)

#### Create Dockerfile for Backend

**backend-node/Dockerfile**
```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .

EXPOSE 5000

CMD ["npm", "start"]
```

#### Create Dockerfile for Frontend

**frontend-react/Dockerfile**
```dockerfile
FROM node:18-alpine as build

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

#### Docker Compose

**docker-compose.yml**
```yaml
version: '3.8'

services:
  database:
    image: mysql:8.0
    environment:
      MYSQL_ROOT_PASSWORD: your_password
      MYSQL_DATABASE: employee_management
    ports:
      - "3306:3306"
    volumes:
      - ./database/sql:/docker-entrypoint-initdb.d
    networks:
      - app-network

  backend:
    build: ./backend-node
    ports:
      - "5000:5000"
    environment:
      - DB_HOST=database
      - DB_USER=root
      - DB_PASSWORD=your_password
      - JWT_SECRET=your_secret
      - NODE_ENV=production
    depends_on:
      - database
    networks:
      - app-network

  frontend:
    build: ./frontend-react
    ports:
      - "80:80"
    depends_on:
      - backend
    networks:
      - app-network

networks:
  app-network:
    driver: bridge
```

#### Deploy with Docker

```bash
# Build and start containers
docker-compose up -d

# View logs
docker-compose logs -f

# Stop containers
docker-compose down
```

---

### Option 4: DigitalOcean App Platform

#### Steps

**1. Connect Repository**
- Push code to GitHub
- Connect GitHub to DigitalOcean

**2. Create app.yaml**
```yaml
name: employee-management
services:
- name: backend
  github:
    repo: your-username/your-repo
    branch: main
  build_command: npm install
  run_command: npm start
  http_port: 5000
  envs:
  - key: DB_HOST
    value: ${db.HOSTNAME}
  - key: JWT_SECRET
    value: ${jwt_secret}

- name: frontend
  github:
    repo: your-username/your-repo
    branch: main
    source_dir: frontend-react
  build_command: npm install && npm run build
  http_port: 3000

databases:
- name: db
  engine: MYSQL
  version: "8"
```

**3. Deploy**
```bash
doctl apps create --spec app.yaml
```

---

### Option 5: Self-Hosted VPS (Linode, Vultr)

#### Complete Setup Script

```bash
#!/bin/bash

# Update system
apt update && apt upgrade -y

# Install dependencies
apt install -y nodejs npm mysql-server nginx git curl

# Clone repository
git clone your-repo-url /var/www/employee-management
cd /var/www/employee-management

# Backend setup
cd backend-node
npm install
npm run build

# Frontend setup
cd ../frontend-react
npm install
npm run build

# Configure MySQL
mysql -u root < ../database/sql/employee_management.sql

# Create service file
cat > /etc/systemd/system/emp-mgmt.service << EOF
[Unit]
Description=Employee Management System
After=network.target

[Service]
User=www-data
WorkingDirectory=/var/www/employee-management/backend-node
ExecStart=/usr/bin/node server.js
Restart=always

[Install]
WantedBy=multi-user.target
EOF

# Start service
systemctl enable emp-mgmt
systemctl start emp-mgmt

# Configure Nginx
# ... (similar to AWS EC2 setup above)
```

---

## 📊 Performance Optimization for Production

### Database Optimization
```sql
-- Add indexes
CREATE INDEX idx_employee_email ON employees(email);
CREATE INDEX idx_attendance_date ON attendance(attendance_date);
CREATE INDEX idx_payroll_month_year ON payroll(month, year);

-- Analyze tables
ANALYZE TABLE users;
ANALYZE TABLE employees;
ANALYZE TABLE attendance;
ANALYZE TABLE leaves;
ANALYZE TABLE payroll;
```

### Backend Optimization
```javascript
// Enable compression
app.use(compression());

// Set up caching headers
app.use((req, res, next) => {
    res.set('Cache-Control', 'public, max-age=3600');
    next();
});

// Connection pooling (already configured)
```

### Frontend Optimization
```bash
# Production build
npm run build

# Check bundle size
npm install -g webpack-bundle-analyzer
# Analyze in build process

# Enable gzip compression in Nginx
gzip on;
gzip_types text/plain text/css application/json;
```

---

## 🔄 Continuous Integration/Deployment (CI/CD)

### GitHub Actions Example

**.github/workflows/deploy.yml**
```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
      - run: npm ci
      - run: npm run lint
      - run: npm test

  deploy:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Deploy to Heroku
        run: |
          git config user.email "deploy@example.com"
          git config user.name "Deploy Bot"
          git remote add heroku https://git.heroku.com/your-app.git
          git push heroku main
```

---

## 🔒 SSL/HTTPS Setup

### With Let's Encrypt (Free)

```bash
# Install Certbot
sudo apt install -y certbot python3-certbot-nginx

# Get certificate
sudo certbot certonly --standalone -d your-domain.com

# Auto-renewal
sudo certbot renew --dry-run
```

### Configure Nginx with SSL
```nginx
server {
    listen 443 ssl;
    server_name your-domain.com;

    ssl_certificate /etc/letsencrypt/live/your-domain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/your-domain.com/privkey.pem;

    # Rest of config...
}

# Redirect HTTP to HTTPS
server {
    listen 80;
    server_name your-domain.com;
    return 301 https://$server_name$request_uri;
}
```

---

## 📊 Monitoring & Logging

### Setup PM2 Monitoring
```bash
npm install -g pm2
pm2 install pm2-auto-pull

# Monitoring
pm2 monit

# Log viewing
pm2 logs app-name

# Health check
pm2 healthcheck
```

### Database Backups
```bash
# Automated daily backup
0 2 * * * mysqldump -u root -p[password] employee_management > /backups/db_$(date +\%Y\%m\%d).sql

# Restore from backup
mysql -u root -p[password] employee_management < backup.sql
```

### Application Logging
```javascript
const fs = require('fs');
const path = require('path');

const logFile = path.join(__dirname, 'logs', 'app.log');

app.use((req, res, next) => {
    const log = `${new Date().toISOString()} ${req.method} ${req.url}\n`;
    fs.appendFile(logFile, log, (err) => {
        if (err) console.error(err);
    });
    next();
});
```

---

## 📈 Scaling Considerations

### Horizontal Scaling
- Use load balancer (Nginx, HAProxy)
- Deploy multiple backend instances
- Use database replication
- Implement caching (Redis)

### Vertical Scaling
- Upgrade server resources
- Optimize database queries
- Enable caching
- Use CDN for static assets

---

## 🆘 Troubleshooting Deployment

### Common Issues

**Port in Use**
```bash
sudo lsof -i :5000
sudo kill -9 <PID>
```

**Database Connection Failed**
```bash
# Test MySQL
mysql -u root -p -h localhost
show databases;
```

**Nginx Not Forwarding**
```bash
sudo nginx -t
sudo systemctl restart nginx
sudo tail -f /var/log/nginx/error.log
```

**SSL Certificate Issues**
```bash
sudo certbot certonly --force-renewal -d your-domain.com
sudo systemctl restart nginx
```

---

## ✅ Post-Deployment Checklist

- [ ] All APIs responding correctly
- [ ] Frontend loads without errors
- [ ] Database connectivity verified
- [ ] SSL/HTTPS working
- [ ] Backups scheduled
- [ ] Monitoring active
- [ ] Logs being collected
- [ ] Performance acceptable
- [ ] Security audit passed
- [ ] Team notified

---

## 📞 Getting Help

- Check logs: `pm2 logs` or `journalctl -u service-name`
- Test connectivity: `curl http://localhost:5000/health`
- Verify database: `mysql -u root -p employee_management`
- Check Nginx: `sudo nginx -t`

---

**Deployment Ready!** Choose your platform and follow the steps above. 🚀
