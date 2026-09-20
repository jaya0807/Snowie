# 🚀 AWS Free Tier Deployment Guide

This repository has been structurally updated for a **$0/month AWS deployment** using the AWS Free Tier.

## Architecture (Free Tier)
- **Compute:** 1x EC2 `t2.micro` instance (750 hours/month free for 12 months)
- **Containerization:** Docker Compose
- **Database:** SQLite (Persisted using Docker Volumes on the EC2's free 30GB EBS volume)

---

## 1. Launch the EC2 Instance
1. Go to the AWS EC2 Console and click **Launch Instance**.
2. Select **Ubuntu 24.04 LTS**.
3. Instance Type: **t2.micro** (Eligible for free tier).
4. Storage: Up to **30 GB gp3** (Eligible for free tier).
5. **Security Groups (Inbound Rules):**
   - Allow SSH (Port 22)
   - Allow HTTP (Port 80)
   - Allow Custom TCP (Port 3000) for Frontend
   - Allow Custom TCP (Port 8000) for Backend API

## 2. SSH & Install Docker
SSH into your new instance and run:
```bash
sudo apt update -y
sudo apt install docker.io docker-compose -y
sudo systemctl enable docker
sudo usermod -aG docker ubuntu
```
*(Log out and log back in for docker permissions to apply).*

## 3. Clone and Run
```bash
git clone https://github.com/jdeept/sih-2.git
cd sih-2

# IMPORTANT: Export your EC2's Public IP or Domain before building
# Replace X.X.X.X with your EC2 Public IP address
export NEXT_PUBLIC_API_BASE_URL="http://X.X.X.X:8000"

# Build and start in detached mode
docker-compose build --build-arg NEXT_PUBLIC_API_BASE_URL=$NEXT_PUBLIC_API_BASE_URL
docker-compose up -d
```

## 4. Access the App
- Frontend: `http://<EC2-PUBLIC-IP>:3000`
- Backend API: `http://<EC2-PUBLIC-IP>:8000/docs`

The SQLite database will persist even if the containers restart, as it uses a named Docker volume (`db_data`).
