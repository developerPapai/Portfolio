# 📄 Portfolio Website PRD (Product Requirements Document)

---

## 🧩 1. Project Overview

A modern, animated, dark-theme portfolio website with a full-featured admin panel for dynamic content management.

The system follows a **monorepo architecture**:
- Client (Public Portfolio UI)
- Admin Panel (CMS Dashboard)
- Backend API (Node.js + MongoDB)

---

## 🎯 2. Goals

- Showcase developer portfolio professionally
- Enable dynamic content management via admin panel
- Ensure scalable and maintainable architecture
- Build production-ready system (job-ready project)

---

## 👥 3. User Roles

### 🔹 Public User
- View portfolio
- Browse projects
- Read blogs
- Send messages via contact form

### 🔹 Admin
- Login securely
- Manage all content dynamically

---

## 🏗️ 4. System Architecture


portfolio-root/
├── client/ → Angular Public App
├── admin/ → Angular Admin App
└── backend/ → Node.js API


---

## 🛠️ 5. Tech Stack (Stable)

### Frontend
- Angular (v18 - stable)
- Tailwind CSS (v3)
- RxJS
- Angular Animations / GSAP

### Backend
- Node.js (v20 LTS)
- Express.js (v4)
- **Swagger Docs**: Interactive API documentation available at `/api-docs`.

### Database
- MongoDB
- Mongoose

### Authentication
- JWT (JSON Web Token)
- bcrypt

### Deployment
- Frontend: Vercel
- Backend: Render

---

## 🎨 6. Client Application (Portfolio UI)

### Pages

#### 🏠 Home
- Hero section (name, title, intro)
- Skills section
- Featured projects
- Contact section

#### 📁 Projects
- Project grid
- Filtering system
- Animated cards

#### 📝 Blog (Optional)
- Blog list
- Blog detail

---

### Components

- Navbar
- Hero
- Skills
- Project Card
- Contact Form
- Footer

---

### Features

- Dark theme (default)
- Smooth scrolling
- Responsive design
- SEO ready (SSR possible)
- Animation support

---

## ⚙️ 7. Admin Panel

### Authentication
- Login page
- JWT-based authentication
- AuthGuard protection

---

### Features

#### 📁 Projects
- Add/Edit/Delete
- Toggle visibility
- Reorder projects

#### 🧠 Skills
- Add skills
- Set skill levels
- Categorization

#### 👤 Profile
- Update hero text
- Edit bio
- Upload profile image
- Upload resume

#### 📬 Messages
- View messages
- Mark read/unread

#### 📝 Blog
- Create/edit posts
- Rich text editor

---

## 🔐 8. Security

### Flow


Login → Backend → JWT Token → Stored → API Access


---

### Measures

- JWT authentication
- Password hashing (bcrypt)
- Route protection (AuthGuard)
- HTTP Interceptor for token
- Backend token verification middleware

---

## 🔌 9. Backend API

### Modules

#### Auth
- POST /api/auth/login

#### Projects
- GET /api/projects
- POST /api/projects
- PUT /api/projects/:id
- DELETE /api/projects/:id

#### Skills
- CRUD APIs

#### Profile
- GET /api/profile
- PUT /api/profile

#### Messages
- POST /api/messages
- GET /api/messages

#### Blog
- CRUD APIs

---

## 🗄️ 10. Database Design

### Collections

- users (admin)
- projects
- skills
- profile
- messages
- blogs

---

## 🌐 11. Deployment Strategy

### Monorepo Deployment

| Service | Platform |
|--------|---------|
| Client | Vercel |
| Admin | Vercel |
| Backend | Render / Railway |

---

### Domains


yourname.com → Client
admin.yourname.com → Admin
api.yourname.com → Backend


---

## ⚡ 12. Non-Functional Requirements

- Fast loading (< 2s)
- Mobile responsive
- Secure authentication
- Clean code structure
- Scalable backend
- SEO optimized

---


## 🔧 15. Development Tools

- Git (version control)
- GitHub (repository)

---

## ⚙️ 16. Environment Management

- Backend: .env
- Frontend: environment.ts

---

## 🧠 17. Key Concepts Used

- JWT Authentication
- AuthGuard (route protection)
- HTTP Interceptor
- REST API
- Monorepo architecture

---

## 🧪 18. Success Metrics

- Fast UI rendering
- Smooth animations (60fps)
- Secure admin access
- Easy content updates

---

## ✅ 19. Conclusion

This project is a **complete production-ready portfolio system** with:

- Modern UI
- Full admin control
- Scalable backend
- Clean architecture

It is ideal for:
- Personal branding
- Job portfolio
- Real-world project showcase

## ✅ 20. How to Run

cd backend
npm install
npm run seed  # This creates the demo content
npm run dev


cd client
npm start
# Available at http://localhost:4200


cd admin
npm start -- --port 4300
# Available at http://localhost:4300
