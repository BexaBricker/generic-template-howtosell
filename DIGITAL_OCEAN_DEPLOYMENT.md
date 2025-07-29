# Digital Ocean Deployment Guide for sell.mybexa.com

This guide walks you through deploying your React/Vite application to a Digital Ocean Ubuntu droplet with Nginx, SSL via Let's Encrypt, and automated deployments from GitHub.

## Prerequisites

- Digital Ocean account with an Ubuntu 22.04 LTS droplet created
- Domain name (sell.mybexa.com) pointed to your droplet's IP address
- SSH access to your droplet
- GitHub repository: https://github.com/BexaBricker/generic-template-howtosell

## Step 1: Initial Server Setup

### 1.1 Connect to your droplet
```bash
ssh root@your-droplet-ip
```

### 1.2 Create a non-root user
```bash
adduser deploy
usermod -aG sudo deploy
```

### 1.3 Set up SSH key for the deploy user
```bash
su - deploy
mkdir ~/.ssh
chmod 700 ~/.ssh
nano ~/.ssh/authorized_keys
# Paste your public SSH key
chmod 600 ~/.ssh/authorized_keys
exit
```

### 1.4 Update the system
```bash
sudo apt update && sudo apt upgrade -y
```

## Step 2: Install Required Software

### 2.1 Install Node.js 22.x
```bash
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
sudo apt-get install -y nodejs
```

### 2.2 Install Nginx
```bash
sudo apt install nginx -y
sudo systemctl start nginx
sudo systemctl enable nginx
```

### 2.3 Install Git
```bash
sudo apt install git -y
```

### 2.4 Install Certbot for Let's Encrypt
```bash
sudo apt install certbot python3-certbot-nginx -y
```

## Step 3: Configure Firewall

```bash
sudo ufw allow OpenSSH
sudo ufw allow 'Nginx Full'
sudo ufw enable
```

## Step 4: Set Up Application Directory

### 4.1 Create application directory
```bash
sudo mkdir -p /var/www/sell.mybexa.com
sudo chown -R deploy:deploy /var/www/sell.mybexa.com
```

### 4.2 Clone the repository
```bash
cd /var/www/sell.mybexa.com
git clone https://github.com/BexaBricker/generic-template-howtosell.git .
```

### 4.3 Install dependencies and build
```bash
npm install
npm run build
```

## Step 5: Configure Environment Variables

### 5.1 Create production .env file
```bash
sudo nano /var/www/sell.mybexa.com/.env
```

Add the following content (adjust based on your email service choice):
```env
# Email Service Configuration
# Choose one of the following:

# Option 1: SMTP (Microsoft 365)
SMTP_HOST=smtp.office365.com
SMTP_PORT=587
SMTP_USER=your-email@yourdomain.com
SMTP_PASS=your-password
SMTP_SECURE=false

# Option 2: Resend
# RESEND_API_KEY=your_resend_api_key_here

# Option 3: SendGrid
# SENDGRID_API_KEY=your_sendgrid_api_key_here

# Email Configuration
FROM_EMAIL=noreply@mybexa.com
TO_EMAIL=info@mybexa.com
SEND_CONFIRMATION=true

# Frontend URL (for CORS)
FRONTEND_URL=https://sell.mybexa.com

# Optional: Cloudflare Turnstile
# TURNSTILE_SECRET_KEY=your_turnstile_secret_key_here

# API URL for production
VITE_API_URL=https://sell.mybexa.com/api
```

### 5.2 Secure the .env file
```bash
chmod 600 /var/www/sell.mybexa.com/.env
```

## Step 6: Configure Nginx

### 6.1 Create Nginx configuration
```bash
sudo nano /etc/nginx/sites-available/sell.mybexa.com
```

Add the following configuration:
```nginx
server {
    listen 80;
    listen [::]:80;
    server_name sell.mybexa.com;

    # Redirect HTTP to HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name sell.mybexa.com;

    # SSL configuration will be added by Certbot
    
    root /var/www/sell.mybexa.com/dist;
    index index.html;

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;
    add_header Content-Security-Policy "default-src 'self' https:; script-src 'self' 'unsafe-inline' 'unsafe-eval' https:; style-src 'self' 'unsafe-inline' https:; img-src 'self' data: https:; font-src 'self' https:; connect-src 'self' https:; media-src 'self' https:; object-src 'none'; frame-src 'self' https:; base-uri 'self'; form-action 'self' https:; frame-ancestors 'self';" always;

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 10240;
    gzip_proxied expired no-cache no-store private auth;
    gzip_types text/plain text/css text/xml text/javascript application/x-javascript application/xml application/javascript application/json;
    gzip_disable "MSIE [1-6]\.";

    # API proxy (if using server-side API)
    location /api {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # React Router support
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Cache static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

### 6.2 Enable the site
```bash
sudo ln -s /etc/nginx/sites-available/sell.mybexa.com /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

## Step 7: Set Up SSL with Let's Encrypt

```bash
sudo certbot --nginx -d sell.mybexa.com
```

Follow the prompts to:
- Enter your email address
- Agree to terms of service
- Choose whether to redirect HTTP to HTTPS (recommended: yes)

## Step 8: Set Up API Server (if using server-side features)

### 8.1 Create API server file
```bash
nano /var/www/sell.mybexa.com/server.js
```

Add the following content:
```javascript
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'https://sell.mybexa.com',
  credentials: true
}));
app.use(express.json());

// API routes
app.use('/api/contact', require('./api/contact'));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
```

### 8.2 Install API dependencies
```bash
npm install express cors dotenv
```

## Step 9: Create Systemd Service

### 9.1 Create service file for the API
```bash
sudo nano /etc/systemd/system/mybexa-api.service
```

Add the following content:
```ini
[Unit]
Description=MyBexa API Server
After=network.target

[Service]
Type=simple
User=deploy
WorkingDirectory=/var/www/sell.mybexa.com
ExecStart=/usr/bin/node server.js
Restart=on-failure
RestartSec=10
StandardOutput=syslog
StandardError=syslog
SyslogIdentifier=mybexa-api
Environment=NODE_ENV=production

[Install]
WantedBy=multi-user.target
```

### 9.2 Enable and start the service
```bash
sudo systemctl daemon-reload
sudo systemctl enable mybexa-api
sudo systemctl start mybexa-api
sudo systemctl status mybexa-api
```

## Step 10: Set Up Automated Deployment

### 10.1 Create deployment script
```bash
nano /var/www/sell.mybexa.com/deploy.sh
```

Add the following content:
```bash
#!/bin/bash

# Exit on error
set -e

echo "Starting deployment..."

# Pull latest changes
git pull origin main

# Install/update dependencies
npm install

# Build the application
npm run build

# Restart API service if needed
sudo systemctl restart mybexa-api

echo "Deployment completed successfully!"
```

### 10.2 Make script executable
```bash
chmod +x /var/www/sell.mybexa.com/deploy.sh
```

### 10.3 Set up GitHub webhook (optional)
For automated deployments on push, you can set up a webhook listener or use GitHub Actions.

#### GitHub Actions Deployment (Recommended)

Create `.github/workflows/deploy.yml` in your repository:
```yaml
name: Deploy to Digital Ocean

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
    - name: Deploy to server
      uses: appleboy/ssh-action@v0.1.5
      with:
        host: ${{ secrets.HOST }}
        username: ${{ secrets.USERNAME }}
        key: ${{ secrets.SSH_KEY }}
        script: |
          cd /var/www/sell.mybexa.com
          ./deploy.sh
```

Add the following secrets to your GitHub repository:
- `HOST`: Your droplet's IP address
- `USERNAME`: deploy
- `SSH_KEY`: Your private SSH key

## Step 11: Monitoring and Maintenance

### 11.1 View logs
```bash
# Nginx logs
sudo tail -f /var/log/nginx/error.log
sudo tail -f /var/log/nginx/access.log

# API logs
sudo journalctl -u mybexa-api -f
```

### 11.2 SSL certificate auto-renewal
Certbot automatically sets up a cron job for renewal. Test it with:
```bash
sudo certbot renew --dry-run
```

### 11.3 Regular updates
```bash
# System updates
sudo apt update && sudo apt upgrade -y

# Node.js updates
npm audit fix
```

## Troubleshooting

### Common Issues:

1. **502 Bad Gateway**: Check if the API service is running:
   ```bash
   sudo systemctl status mybexa-api
   ```

2. **Permission errors**: Ensure the deploy user owns the application directory:
   ```bash
   sudo chown -R deploy:deploy /var/www/sell.mybexa.com
   ```

3. **Build failures**: Check Node.js version and npm logs:
   ```bash
   node --version
   npm --version
   ```

4. **SSL issues**: Renew certificate manually:
   ```bash
   sudo certbot renew
   ```

## Security Recommendations

1. **Enable automatic security updates**:
   ```bash
   sudo apt install unattended-upgrades
   sudo dpkg-reconfigure unattended-upgrades
   ```

2. **Configure fail2ban**:
   ```bash
   sudo apt install fail2ban -y
   sudo systemctl enable fail2ban
   ```

3. **Regular backups**: Set up automated backups of your droplet through Digital Ocean's dashboard.

4. **Monitor server resources**: Use tools like `htop` or Digital Ocean's monitoring features.

## Contact Form Email Setup

The application includes a contact form that requires email configuration. Make sure to:

1. Choose an email service (SMTP, SendGrid, or Resend)
2. Configure the appropriate environment variables in `.env`
3. Test the contact form after deployment

For Microsoft 365 SMTP:
- Enable SMTP authentication in your Microsoft 365 admin center
- Use an app password if 2FA is enabled
- Ensure the FROM_EMAIL matches your authenticated email

## Final Steps

1. Test your deployment at https://sell.mybexa.com
2. Verify SSL certificate is working (green padlock)
3. Test the contact form functionality
4. Monitor logs for any errors
5. Set up alerts in Digital Ocean for downtime monitoring

Your React application should now be successfully deployed and accessible at https://sell.mybexa.com!