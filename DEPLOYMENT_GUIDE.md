# 🚀 Complete 100% FREE Deployment Guide

This guide walks you through deploying the complete **Graphic Design Portfolio & Admin CMS** project to the internet for **\$0 (100% Free)** with custom domains, automatic SSL certificates (HTTPS), and zero server management.

---

## 🏗️ Architecture Overview

The project consists of 3 distinct services deployed on the best free-tier platforms:

```
┌─────────────────────────────────────────────────────────────┐
│                    MongoDB Atlas (Free M0)                  │
│       Cloud Database storing projects, settings, bio        │
└──────────────────────────────▲──────────────────────────────┘
                               │
                               │ Database Connection
┌──────────────────────────────┴──────────────────────────────┐
│                    Backend API on Render                    │
│                 https://your-api.onrender.com               │
└──────────────▲───────────────────────────────▲──────────────┘
               │                               │
               │ REST API Requests             │ REST API Requests
┌──────────────┴──────────────┐ ┌──────────────┴──────────────┐
│  Public Portfolio (Vercel)  │ │   Admin Dashboard (Vercel)  │
│ https://portfolio.vercel.app│ │   https://admin.vercel.app  │
└─────────────────────────────┘ └─────────────────────────────┘
```

| Component | Platform | Free Tier Specifications |
| :--- | :--- | :--- |
| **Database** | [MongoDB Atlas](https://www.mongodb.com/atlas) | 512 MB Storage (M0 Sandbox), Forever Free |
| **Backend API** | [Render](https://render.com) | 750 free compute hours/month, Free HTTPS, Auto-deploy on Git push |
| **Public Portfolio** | [Vercel](https://vercel.com) | Unlimited traffic for personal sites, 100 GB bandwidth, Global Edge CDN |
| **Admin Dashboard** | [Vercel](https://vercel.com) | Free separate project with automatic SPA routing & SSL |
| **Image Storage (Optional)** | [Cloudinary](https://cloudinary.com) | 25 GB free storage and monthly transformations |

---

## 📋 Table of Contents
1. [Step 1: Push Code to GitHub](#step-1-push-code-to-github)
2. [Step 2: Configure MongoDB Atlas Network Access](#step-2-configure-mongodb-atlas-network-access)
3. [Step 3: Deploy Backend API on Render (Free)](#step-3-deploy-backend-api-on-render-free)
4. [Step 4: Deploy Public Portfolio on Vercel (Free)](#step-4-deploy-public-portfolio-on-vercel-free)
5. [Step 5: Deploy Admin Dashboard on Vercel (Free)](#step-5-deploy-admin-dashboard-on-vercel-free)
6. [Step 6: Link Frontend URLs in Render CORS](#step-6-link-frontend-urls-in-render-cors)
7. [Step 7: Verify Live Deployment & Admin Login](#step-7-verify-live-deployment--admin-login)
8. [Troubleshooting & Pro-Tips](#troubleshooting--pro-tips)

---

## Step 1: Push Code to GitHub

Before deploying, push your codebase to a **GitHub repository** (public or private).

1. Open your terminal in the project root (`e:\YASH KACHA\Protfolio`):
```bash
git init
git add .
git commit -m "feat: complete production-ready dynamic portfolio and admin cms"
```

2. Create a new repository on [GitHub](https://github.com/new) (e.g. `graphic-design-portfolio`).

3. Link and push your repository:
```bash
git branch -M main
git remote add origin https://github.com/<YOUR_GITHUB_USERNAME>/<YOUR_REPOSITORY_NAME>.git
git push -u origin main
```

> [!NOTE]
> Sensitive files like `.env` and `node_modules/` are automatically protected by the root `.gitignore` and won't be pushed to GitHub.

---

## Step 2: Configure MongoDB Atlas Network Access

Your database connection string is already configured:
`mongodb+srv://kachayash618_db_user:<password>@cluster0.catmsve.mongodb.net/graphic_portfolio?retryWrites=true&w=majority`

To ensure Render and your cloud deployment can connect to MongoDB Atlas without network timeouts:

1. Log in to your [MongoDB Atlas Dashboard](https://cloud.mongodb.com/).
2. In the left navigation, click **Network Access** (under the *Security* section).
3. Check the IP Access list. If `0.0.0.0/0` is not present:
   - Click **Add IP Address**.
   - Click **Allow Access from Anywhere** (`0.0.0.0/0`).
   - Click **Confirm**.
4. In the left navigation, click **Database Access** and verify that your database user `kachayash618_db_user` has `Read and write to any database` privileges.

---

## Step 3: Deploy Backend API on Render (Free)

1. Sign up or log in to [Render.com](https://render.com) using your GitHub account.
2. From the dashboard, click **New +** and select **Web Service**.
3. Select **Build and deploy from a Git repository** and connect your GitHub repository.
4. Configure the Web Service settings:

| Setting | Value |
| :--- | :--- |
| **Name** | `graphic-portfolio-api` (or your chosen name) |
| **Region** | Choose closest to you (e.g. *Singapore* or *Frankfurt*) |
| **Branch** | `main` |
| **Root Directory** | `server` |
| **Runtime** | `Node` |
| **Build Command** | `npm install` |
| **Start Command** | `npm start` |
| **Instance Type** | `Free` (\$0.00 / month) |

5. Scroll down to **Environment Variables** and add the following keys:

| Key | Value |
| :--- | :--- |
| `NODE_ENV` | `production` |
| `MONGODB_URI` | `mongodb+srv://kachayash618_db_user:kUES25UWUwLvTHhh@cluster0.catmsve.mongodb.net/graphic_portfolio?retryWrites=true&w=majority` |
| `JWT_SECRET` | `graphic_design_jwt_secret_token_secure_key_2026_portfolio` |
| `JWT_EXPIRES_IN` | `7d` |
| `CLIENT_PORTFOLIO_URL` | `http://localhost:5173` *(We will update this in Step 6)* |
| `CLIENT_ADMIN_URL` | `http://localhost:5174` *(We will update this in Step 6)* |

*(Optional Cloudinary keys if using cloud image storage)*:
- `CLOUDINARY_CLOUD_NAME`
- `CLOUDINARY_API_KEY`
- `CLOUDINARY_API_SECRET`

6. Click **Deploy Web Service**.
7. Render will build and launch your backend. Once complete, you will see a green **Live** status and your live backend URL:
   `https://graphic-portfolio-api.onrender.com`

8. Test it in your browser:
   Visit `https://graphic-portfolio-api.onrender.com/api/health`
   You should see:
   ```json
   { "status": "healthy", "service": "Graphic Portfolio API" }
   ```

---

## Step 4: Deploy Public Portfolio on Vercel (Free)

1. Sign up or log in to [Vercel.com](https://vercel.com) using your GitHub account.
2. From your Vercel Dashboard, click **Add New...** > **Project**.
3. Import your GitHub repository (`graphic-design-portfolio`).
4. In the **Configure Project** screen:
   - **Project Name**: `graphic-portfolio`
   - **Framework Preset**: `Vite`
   - **Root Directory**: Click *Edit* and select **`client/portfolio`**
   - **Build and Output Settings**:
     - Build Command: `npm run build`
     - Output Directory: `dist`
5. Open the **Environment Variables** dropdown and add:
   - **Name**: `VITE_API_URL`
   - **Value**: `https://graphic-portfolio-api.onrender.com/api` *(Your Render URL from Step 3 + `/api`)*
6. Click **Deploy**.
7. Vercel will build the frontend in ~30 seconds and give you a live production URL:
   `https://graphic-portfolio.vercel.app`

> [!TIP]
> The repository already includes `client/portfolio/vercel.json` and `client/portfolio/public/_redirects`, ensuring all direct URL page refreshes (such as `/portfolio/brand-identity` or `/services`) work seamlessly without 404 errors.

---

## Step 5: Deploy Admin Dashboard on Vercel (Free)

1. Return to your [Vercel Dashboard](https://vercel.com).
2. Click **Add New...** > **Project**.
3. Select the same GitHub repository again.
4. In the **Configure Project** screen:
   - **Project Name**: `graphic-portfolio-admin`
   - **Framework Preset**: `Vite`
   - **Root Directory**: Click *Edit* and select **`client/admin`**
   - **Build and Output Settings**:
     - Build Command: `npm run build`
     - Output Directory: `dist`
5. Open the **Environment Variables** dropdown and add:
   - **Name**: `VITE_API_URL`
   - **Value**: `https://graphic-portfolio-api.onrender.com/api`
6. Click **Deploy**.
7. You will receive your dedicated Admin Dashboard URL:
   `https://graphic-portfolio-admin.vercel.app`

---

## Step 6: Link Frontend URLs in Render CORS

Now that your two Vercel frontends are live, add their URLs to your Render backend to authorize CORS requests:

1. Go to your [Render Dashboard](https://dashboard.render.com/) and open your `graphic-portfolio-api` service.
2. Click **Environment** in the left sidebar.
3. Update or add the following variables with your actual live Vercel URLs:
   - `CLIENT_PORTFOLIO_URL` = `https://graphic-portfolio.vercel.app`
   - `CLIENT_ADMIN_URL` = `https://graphic-portfolio-admin.vercel.app`
4. Click **Save Changes**. Render will automatically redeploy the backend with the new configuration.

---

## Step 7: Verify Live Deployment & Admin Login

1. **Visit Public Portfolio**:
   - Open `https://graphic-portfolio.vercel.app`
   - Verify that your designer name, hero showcase collage, services, projects, and testimonials load directly from MongoDB Atlas.
   - Click on any project card to open its case study page.
   - Submit a test inquiry on the `/contact` page.

2. **Log into Admin CMS**:
   - Open `https://graphic-portfolio-admin.vercel.app/login`
   - Enter default administrator credentials:
     - **Email**: `admin@portfolio.com`
     - **Password**: `Admin@123456`
   - Check the **Contact Messages** tab to see your test inquiry!
   - Try updating a title or adding a project; changes will instantly reflect on the public website.

---

## 🛠️ Alternative Free Hosting Options

If you prefer different platforms, this codebase is 100% compatible with:

### Option B: Netlify (Alternative to Vercel for Frontends)
1. Go to [Netlify.com](https://www.netlify.com/).
2. Click **Add new site** > **Import an existing project** from GitHub.
3. For Public Portfolio:
   - Base directory: `client/portfolio`
   - Build command: `npm run build`
   - Publish directory: `client/portfolio/dist`
   - Environment variables: `VITE_API_URL=https://graphic-portfolio-api.onrender.com/api`
4. Repeat for `client/admin`. Netlify uses the included `_redirects` file automatically.

### Option C: Railway or Koyeb (Alternative to Render for Backend)
- **Koyeb**: Free micro instance with zero sleep time. Connect GitHub repo, set root to `server`, run `npm start`.
- **Railway**: 30-day trial credits with high-speed builds.

---

## 💡 Troubleshooting & Pro-Tips

### 1. Render Free Tier "Cold Start" Sleep
Render free instances go to sleep after 15 minutes of inactivity. When someone visits the site after a while, the very first API request may take **30 to 45 seconds** to wake up the server.
- **Solution (Free)**: You can use a free uptime monitor like [Cron-Job.org](https://cron-job.org/) or [UptimeRobot](https://uptimerobot.com/) to ping `https://your-api.onrender.com/api/health` every 10 minutes. This keeps your free Render backend awake 24/7!

### 2. "CORS Error" or "Network Error" on Frontend
- Make sure `VITE_API_URL` on Vercel contains `https://` and points to your Render app URL.
- Make sure `CLIENT_PORTFOLIO_URL` and `CLIENT_ADMIN_URL` on Render match your exact Vercel URLs (no trailing slash).

### 3. Page Refresh Shows "404 Not Found"
- Single Page Applications using React Router require rewrite rules.
- We have pre-configured `vercel.json` and `_redirects` in both client directories, so this is automatically resolved!

### 4. Admin Password Reset
If you ever need to reset the admin credentials on MongoDB Atlas, you can run the seed script locally pointing to the Atlas database:
```bash
cd server
npm run seed
```
This will recreate the default admin (`admin@portfolio.com` / `Admin@123456`).

---

🎉 **Congratulations! Your portfolio is now deployed to the world for \$0/month!**
