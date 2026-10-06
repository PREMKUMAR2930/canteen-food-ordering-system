# 🚀 Complete Deployment Guide: College Canteen Food Ordering System

This guide covers 2 popular deployment methods:
1. **Method A: Free Cloud Deployment (Vercel + Render + Free MySQL Database)** — *Best for live demos & portfolio links*
2. **Method B: 1-Command Docker Deployment (VPS / Local Server / AWS / DigitalOcean)** — *Best for self-hosting*

---

## 🌐 Method A: Free Cloud Deployment

### 📋 Prerequisites
- A **GitHub** account
- Your repository pushed to GitHub
- Free accounts on:
  - [Aiven](https://aiven.io/) or [Railway](https://railway.app/) or [Clever Cloud](https://www.clever-cloud.com/) (For Free MySQL Database)
  - [Render](https://render.com/) (For Spring Boot Backend)
  - [Vercel](https://vercel.com/) (For React Frontend)

---

### Step 1: Create a Free MySQL Database (e.g. on Aiven / Railway / Clever Cloud)
1. Go to [Aiven Console](https://console.aiven.io/) or [Clever Cloud](https://www.clever-cloud.com/).
2. Create a new **MySQL** service (Free tier).
3. Note down the connection parameters:
   - **Host / Service URI** (e.g., `mysql-xxxx.aivencloud.com`)
   - **Port** (e.g., `12345`)
   - **Database Name** (e.g., `canteen_db` or `defaultdb`)
   - **Username** (e.g., `avnadmin` or `root`)
   - **Password**
4. Construct your JDBC URL:
   ```
   jdbc:mysql://<HOST>:<PORT>/<DATABASE_NAME>?useSSL=true&requireSSL=false&serverTimezone=UTC
   ```

---

### Step 2: Deploy Spring Boot Backend to Render
1. Go to [Render Dashboard](https://dashboard.render.com/) and click **New +** &rarr; **Web Service**.
2. Connect your GitHub repository.
3. Configure the service settings:
   - **Name**: `canteen-backend`
   - **Root Directory**: `backend`
   - **Runtime / Environment**: **Docker** (Render will automatically detect `backend/Dockerfile`)
   - **Plan Type**: **Free**
4. Under **Environment Variables**, add:
   | Key | Value |
   |---|---|
   | `PORT` | `8080` |
   | `SPRING_DATASOURCE_URL` | `jdbc:mysql://<HOST>:<PORT>/<DB_NAME>?useSSL=true&requireSSL=false&serverTimezone=UTC` |
   | `SPRING_DATASOURCE_USERNAME` | `<YOUR_DB_USERNAME>` |
   | `SPRING_DATASOURCE_PASSWORD` | `<YOUR_DB_PASSWORD>` |
   | `APP_JWT_SECRET` | `canteenSecretKeyForCollegeFoodOrderingSystem2026SecureKeyWith256BitsMinimumLength` |
   | `APP_CORS_ALLOWED_ORIGINS` | `*` *(or your Vercel frontend URL once generated)* |
5. Click **Deploy Web Service**.
6. Once deployed, copy your backend URL (e.g., `https://canteen-backend-xyz.onrender.com`).
   *Test it by opening `https://canteen-backend-xyz.onrender.com/api/foods` in browser or curl.*

---

### Step 3: Deploy React Frontend to Vercel
1. Go to [Vercel Dashboard](https://vercel.com/dashboard) and click **Add New...** &rarr; **Project**.
2. Import your GitHub repository.
3. In **Project Settings**:
   - **Framework Preset**: `Vite`
   - **Root Directory**: Click *Edit* and select **`frontend`**
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
4. Expand **Environment Variables** and add:
   | Key | Value |
   |---|---|
   | `VITE_API_URL` | `https://canteen-backend-xyz.onrender.com/api` |
   *(⚠️ Note the `/api` at the end!)*
5. Click **Deploy**.
6. Vercel will build and give you a live production URL (e.g. `https://canteen-system.vercel.app`).
7. Update `APP_CORS_ALLOWED_ORIGINS` in Render with your new Vercel domain if desired.

---

## 🐳 Method B: Docker Compose Deployment (Single Server / VPS / Ubuntu / Local)

If deploying to a VPS (Ubuntu / Debian / AWS EC2 / DigitalOcean Droplet):

1. **Install Docker & Docker Compose** on your server:
   ```bash
   curl -fsSL https://get.docker.com -o get-docker.sh
   sudo sh get-docker.sh
   ```

2. **Clone your repository**:
   ```bash
   git clone <your-repo-url>
   cd "Canteen Food Ordering System"
   ```

3. **Start all services**:
   ```bash
   docker compose up -d --build
   ```

4. **Verify running containers**:
   ```bash
   docker compose ps
   ```
   - Frontend is live at: `http://<SERVER_IP>:80`
   - Backend API is live at: `http://<SERVER_IP>:8080/api`
   - MySQL is isolated on port `3306`

5. **Stop services**:
   ```bash
   docker compose down
   ```

---

## 🛡️ Production Checklist
- [x] Initial demo accounts pre-seeded automatically by `DataInitializer.java`:
  - **Admin**: `admin@canteen.com` / `admin123`
  - **Student**: `student@canteen.com` / `student123`
- [x] SPA Routing rewrite rule configured in `frontend/vercel.json` and `frontend/nginx.conf`.
- [x] CORS configured to accept frontend calls with JWT authorization headers.
- [x] Database auto-generates tables on first boot (`spring.jpa.hibernate.ddl-auto=update`).
