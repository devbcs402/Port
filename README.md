# Studio Rivera — Graphic Design Portfolio & Admin CMS

A modern, production-ready **Graphic Design Portfolio Website** with a completely separate **Admin CMS Dashboard**, built with the **MERN Stack** (MongoDB, Express, React, Node.js), Tailwind CSS, Framer Motion, and Cloudinary.

> 🚀 **Looking to deploy for free?** Follow the step-by-step [**Complete 100% Free Deployment Guide**](./DEPLOYMENT_GUIDE.md) to launch the backend on Render and both frontends on Vercel for \$0/month.

---

## 🌟 Key Features

### 🎨 Application 1: Public Portfolio Website (`http://localhost:5173`)
- **Aesthetic**: Minimalist, high-end light theme inspired by Behance, Dribbble, and Awwwards creative agency websites.
- **Home Page**:
  - Dynamic Hero with availability badge, large editorial typography, and interactive graphic design showcase collage.
  - Live statistics counter banner (180+ Completed Projects, 75+ Clients, 8+ Years Experience, 14 Awards).
  - Selected featured projects with hover zoom animations and category pills.
  - Designer profile overview, philosophy, and core competencies.
  - Full services grid with key deliverables checklists.
  - Client testimonial review cards with star ratings and client avatars.
  - High-impact Contact CTA banner.
- **Portfolio Gallery (`/portfolio`)**:
  - Dynamic category tabs fetched directly from MongoDB (Brand Identity, Packaging, Posters, Social Media, etc.).
  - Real-time instant search by project title, client, or software tools.
  - Responsive layout with Framer Motion layout animations.
  - Empty states and pagination controls.
- **Project Detail Case Studies (`/portfolio/:slug`)**:
  - Dedicated SEO-friendly slug URLs.
  - Full-width hero cover image.
  - Project metadata bar (Client, Timeline, Tools Used, Live URL).
  - Design Objective and Creative Process narrative sections.
  - Full-width visual gallery with **Fullscreen Image Lightbox** (keyboard navigation, index counter, and zoom).
  - Previous and Next project navigation bar.
  - Related projects from the same design category.
- **About Page (`/about`)**:
  - Designer portrait, biography, and design manifesto.
  - Animated proficiency percentage bars for design disciplines.
  - Software knowledge grid (Photoshop, Illustrator, InDesign, Figma, Blender, After Effects).
  - 4-phase creative workflow timeline.
- **Services Page (`/services`)**:
  - Detailed breakdown of all design services and deliverables.
  - Direct inquiry action buttons pre-filling the contact form.
- **Contact Page (`/contact`)**:
  - Fully dynamic form submission storing inquiries in MongoDB.
  - Anti-spam honeypot trap and backend rate limiting.
  - One-click direct links to WhatsApp, email, and social profiles (Behance, Dribbble, Instagram, LinkedIn).

---

### ⚡ Application 2: Admin CMS Dashboard (`http://localhost:5174`)
- **Secure Authentication**:
  - JWT token authentication with bcrypt password hashing.
  - Automatic Bearer token injection and 401 session expiration handling.
  - Seeded initial administrator (`admin@portfolio.com` / `Admin@123456`).
- **Dashboard Overview (`/`)**:
  - Live counters: Total Projects, Published, Drafts, Categories, Media Assets, and Client Inquiries.
  - Interactive Project Distribution by Category bar chart (powered by Recharts).
  - Quick Project publish/draft toggles.
  - Recent Contact Inquiries inbox widget.
- **Project Management (`/projects`)**:
  - Full CRUD: Add, edit, delete, publish/unpublish, and feature projects.
  - Two-column editor: Title, auto-generating URL slug with manual unlock, category selector, summary, design objective, creative process, and full case study text.
  - Image Management: Cover image uploader/replacer and multiple gallery image uploads with preview and delete.
  - SEO fields (SEO Meta Title and Description).
- **Category Management (`/categories`)**:
  - Add, edit, and delete categories with custom thumbnails, descriptions, and display orders.
  - Live project counter per category.
  - Safe delete check preventing accidental deletion of categories linked to active projects.
- **Media Library (`/media`)**:
  - Central visual gallery of all uploaded design assets.
  - Drag-and-drop / multi-file upload zone.
  - Search by filename and filter by image format.
  - One-click "Copy Image URL" to clipboard.
  - Media inspector modal displaying dimensions, file size, storage provider, and projects referencing the asset.
  - Safe delete reference checking.
- **About Management (`/about`)**:
  - Manage designer name, tagline, portrait image, bio, experience years.
  - Interactive skill percentage editor.
  - Software knowledge tools and proficiency level editor.
  - 4-step creative workflow editor.
  - Numerical statistics manager.
- **Services Management (`/services`)**:
  - Add, edit, and reorder design services and key deliverables checklist.
- **Testimonials Management (`/testimonials`)**:
  - Add and manage client reviews with 1–5 star ratings, client role, company, and client avatar.
- **Contact Inbox (`/messages`)**:
  - Filter inquiries by status: Unread, Read, Replied.
  - Real-time search by sender, email, or subject.
  - Message reader modal with one-click "Reply via Email" (`mailto:`) and internal admin notes.
- **Website Settings (`/settings`)**:
  - Update website name, designer name, logo, favicon, public email, phone, WhatsApp, and physical address.
  - Social media URLs (Behance, Dribbble, Instagram, LinkedIn, GitHub, Twitter).
  - Homepage Hero headline and CTA text customization.

---

### 🛡️ Application 3: Backend REST API (`http://localhost:5000`)
- **Node.js & Express.js** with modular MVC architecture.
- **MongoDB & Mongoose**: 9 structured models (`Admin`, `Project`, `Category`, `Service`, `Testimonial`, `Contact`, `About`, `WebsiteSettings`, `Media`).
- **Hybrid Storage Engine**:
  - Native **Cloudinary SDK** integration when credentials are provided.
  - **Local Disk Storage Fallback** (`server/uploads/`) when testing offline or before Cloudinary keys are set up.
- **Security & Reliability**:
  - Helmet security headers with Cross-Origin Resource Policy configured.
  - CORS with support for multiple frontend origins and development ports.
  - Express Rate Limiting on contact submissions to prevent spam.
  - Centralized error handling and Mongoose schema validations.

---

## 📁 Project Architecture & Directory Structure

```
Protfolio/
├── client/
│   ├── portfolio/                 # Public Portfolio Website (Port 5173)
│   │   ├── src/
│   │   │   ├── api/axios.js       # Pre-configured Axios instance
│   │   │   ├── components/        # Navbar, Footer, ProjectCard, LightboxModal, SkeletonLoader
│   │   │   ├── context/           # SettingsContext
│   │   │   ├── pages/             # HomePage, PortfolioPage, ProjectDetailPage, AboutPage, ServicesPage, ContactPage
│   │   │   ├── App.jsx            # Router and navigation
│   │   │   ├── main.jsx           # Entry point
│   │   │   └── index.css          # Tailwind CSS styles
│   │   ├── index.html
│   │   ├── tailwind.config.js
│   │   ├── vite.config.js
│   │   └── package.json
│   │
│   └── admin/                     # Admin CMS Dashboard (Port 5174)
│       ├── src/
│       │   ├── api/axios.js       # Axios with JWT bearer interceptor
│       │   ├── components/        # AdminLayout, Sidebar, Topbar, Toast, ConfirmModal
│       │   ├── context/           # AuthContext (JWT management)
│       │   ├── pages/             # LoginPage, DashboardPage, ProjectsPage, ProjectFormPage,
│       │   │                      # CategoriesPage, MediaPage, AboutManagePage, ServicesManagePage,
│       │   │                      # TestimonialsManagePage, MessagesPage, SettingsPage
│       │   ├── App.jsx            # Protected routes
│       │   ├── main.jsx           # Entry point
│       │   └── index.css          # Tailwind CSS styles
│       ├── index.html
│       ├── tailwind.config.js
│       ├── vite.config.js
│       └── package.json
│
├── server/                        # Express REST API (Port 5000)
│   ├── config/
│   │   ├── db.js                  # MongoDB Mongoose connection
│   │   └── cloudinary.js          # Cloudinary configuration
│   ├── controllers/               # Auth, Projects, Categories, Services, Testimonials, Contact, About, Settings, Media, Dashboard
│   ├── middleware/                # JWT protect, Error handling, Multer image upload
│   ├── models/                    # Admin, Project, Category, Service, Testimonial, Contact, About, WebsiteSettings, Media
│   ├── routes/                    # REST API endpoints
│   ├── scripts/
│   │   └── seed.js                # Database seeder (Admin + realistic Graphic Design projects)
│   ├── services/
│   │   └── uploadService.js       # Cloudinary / Local storage handler
│   ├── uploads/                   # Local image storage folder
│   ├── server.js                  # Express application entry
│   ├── .env                       # Environment variables
│   ├── .env.example               # Example environment variables
│   └── package.json
│
├── package.json                   # Root monorepo scripts
└── README.md
```

---

## 🚀 Quick Start Guide

### 1. Prerequisites
- **Node.js**: v18 or higher (tested on Node v20 & v24)
- **MongoDB**: Local MongoDB community server running on port `27017` OR a MongoDB Atlas connection string.

---

### 2. Environment Variables Configuration

The backend environment file is located at `server/.env`. A template is provided at `server/.env.example`:

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://127.0.0.1:27017/graphic_portfolio
JWT_SECRET=graphic_design_jwt_secret_token_secure_key_2026_portfolio
JWT_EXPIRES_IN=7d

# Cloudinary Configuration (Optional - Local storage is used if left empty)
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=

# Client URLs for CORS
CLIENT_PORTFOLIO_URL=http://localhost:5173
CLIENT_ADMIN_URL=http://localhost:5174
```

> **Note on Cloudinary**:
> If you have a Cloudinary account, enter your `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, and `CLOUDINARY_API_SECRET`.
> If left blank, the application **automatically uses local disk storage** in `server/uploads/` and serves files statically. Both modes work seamlessly!

---

### 3. Database Seeding & Admin Account Creation

Populate the database with the initial administrator account, realistic graphic design categories, projects, services, testimonials, about profile, and settings:

```powershell
cd server
npm run seed
```

Default Admin Credentials:
- **Email**: `admin@portfolio.com`
- **Password**: `Admin@123456`

---

### 4. Running the Applications

Open 3 terminal windows (or run in separate tabs):

#### Terminal 1 — Backend API Server
```powershell
cd server
npm start
# Runs on http://localhost:5000
```

#### Terminal 2 — Public Portfolio Website
```powershell
cd client/portfolio
npm run dev
# Runs on http://localhost:5173
```

#### Terminal 3 — Admin CMS Dashboard
```powershell
cd client/admin
npm run dev
# Runs on http://localhost:5174
```

---

## 🧪 Testing & Verification Guide

1. **Verify Backend Health**:
   - Open browser or curl: `http://localhost:5000/api/health`
   - Should return `{ status: "healthy", service: "Graphic Portfolio API" }`

2. **Test Public Portfolio**:
   - Open `http://localhost:5173` in your browser.
   - Verify the dynamic hero, statistics banner, featured projects grid, services, and client testimonials.
   - Navigate to `/portfolio` and test filtering by category ("Brand Identity", "Packaging Design", "Poster & Editorial") and typing into the search bar.
   - Click on any project (e.g. "Lumina Botanicals") to view the case study, metadata bar, and full gallery.
   - Click any image in the gallery to verify the **Fullscreen Lightbox** with next/previous keyboard arrows.
   - Go to `/contact`, fill out the inquiry form, and click **Submit**. You will see a success confirmation.

3. **Test Admin CMS Dashboard**:
   - Open `http://localhost:5174` in your browser.
   - Log in using `admin@portfolio.com` / `Admin@123456`.
   - On the **Dashboard**, view the summary cards, the category distribution chart, and the newly submitted contact message under **Recent Messages**.
   - Go to **Projects** -> click **New Project**. Fill in a title, select a category, upload or provide a cover image and gallery images, and click **Save Project**.
   - Switch to the public portfolio (`http://localhost:5173/portfolio`) — the new project appears immediately!
   - In the Admin Dashboard, click the **Published** badge on any project to toggle it to **Draft**. Refresh the public website — draft projects are automatically hidden from visitors.
   - Visit **Contact Inbox** (`/messages`) to inspect messages, mark as replied, or open an email draft.
   - Visit **Site Settings** (`/settings`) to update the designer's name or social media links and verify they update across the public website immediately.

---

## 🌐 Production Deployment Guide

### 1. MongoDB
- Create a free cluster on [MongoDB Atlas](https://www.mongodb.com/atlas).
- Get your connection string (e.g. `mongodb+srv://<user>:<password>@cluster0.mongodb.net/graphic_portfolio?retryWrites=true&w=majority`).
- Update `MONGODB_URI` in production.

### 2. Backend API (Render, Railway, or DigitalOcean)
- Push the repository to GitHub.
- Set Root Directory to `server`.
- Build Command: `npm install`
- Start Command: `npm start`
- Add Environment Variables: `MONGODB_URI`, `JWT_SECRET`, `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`, `CLIENT_PORTFOLIO_URL`, `CLIENT_ADMIN_URL`.

### 3. Frontend Applications (Vercel or Netlify)
- **Public Portfolio**:
  - Root directory: `client/portfolio`
  - Build command: `npm run build`
  - Output directory: `dist`
  - Environment variable: `VITE_API_URL=https://your-backend-api.onrender.com/api`
- **Admin Dashboard**:
  - Root directory: `client/admin`
  - Build command: `npm run build`
  - Output directory: `dist`
  - Environment variable: `VITE_API_URL=https://your-backend-api.onrender.com/api`

---

## 📄 License
This project is open-source and available under the [MIT License](LICENSE).
