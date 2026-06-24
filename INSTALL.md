# 📦 Installation Guide - Money Tree Network

## Requirements

| Tool | Download Link | Required |
|------|--------------|----------|
| Docker Desktop | https://docker.com/products/docker-desktop | ✅ Yes |
| Git | https://git-scm.com/download/win | ✅ Yes |
| Node.js v18+ | https://nodejs.org | For mobile app |
| Expo Go (phone) | App Store / Play Store | For mobile app |

## Quick Install (Windows)

### Step 1 - Download
\\\
git clone https://github.com/Aslammhk/-powerbi-Business.git
cd -powerbi-Business
\\\

### Step 2 - Setup
\\\
Double-click: scripts/setup.bat
\\\

### Step 3 - Open
\\\
http://localhost:3000
\\\

## First Time Admin Setup

1. Go to http://localhost:3000/admin
2. Login with ADMIN_EMAIL and ADMIN_PASSWORD from .env
3. Add your 10 YouTube channels
4. Click Lock All Channels
5. Generate your invite link
6. Share with family!

## Mobile App Setup

\\\powershell
# User Mobile App
cd mobile
npm install
npx expo start

# Admin Mobile App
cd admin-mobile
npm install
npx expo start
\\\

Install Expo Go on your phone, scan QR code.

## Telegram Bot Setup

1. Message @BotFather on Telegram
2. Send: /newbot
3. Choose a name and username
4. Copy the token
5. Paste in .env as TELEGRAM_BOT_TOKEN

## Getting API Keys

### YouTube API
1. Go to console.cloud.google.com
2. Create project
3. Enable YouTube Data API v3
4. Create credentials (API Key)
5. Paste in .env as YOUTUBE_API_KEY

### Firebase (Push Notifications)
1. Go to console.firebase.google.com
2. Create project
3. Project Settings → Service Accounts
4. Generate new private key
5. Copy values to .env

### Twilio (WhatsApp)
1. Go to twilio.com
2. Create account
3. Get Account SID and Auth Token
4. Enable WhatsApp sandbox
5. Paste in .env

## Troubleshooting

Problem: Docker not starting
Solution: Make sure Docker Desktop is running (whale icon in taskbar)

Problem: Port already in use
Solution: 
  netstat -ano | findstr :3000
  taskkill /PID [number] /F

Problem: Database connection error
Solution:
  docker-compose down
  docker-compose up -d db
  Wait 10 seconds
  docker-compose up -d

Problem: Permission denied
Solution: Run PowerShell as Administrator
