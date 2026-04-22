# Portfolio Website — Full System Build Plan

## Overview

A production-ready, animated dark-theme portfolio system for **Papai** with:
- **Client**: Angular v18 + SSR (Angular Universal), Tailwind CSS v3, GSAP + Angular Animations
- **Admin**: Angular v18 SPA (CMS dashboard)
- **Backend**: Node.js v20 + Express v4 + MongoDB Atlas + Cloudinary
- **Theme**: Dark background + Cyan glow (#06b6d4)
- **Deployment**: Vercel (Client + Admin) + Render (Backend)

---

## Monorepo Structure

```
portfolio/
├── client/                  → Angular v18 SSR App (Public Portfolio)
│   ├── src/
│   │   ├── app/
│   │   │   ├── core/        → Services, interceptors, guards
│   │   │   ├── shared/      → Reusable components
│   │   │   ├── pages/
│   │   │   │   ├── home/    → Hero + Skills + Projects + Contact
│   │   │   │   └── projects/→ Full projects grid
│   │   │   └── app.routes.ts
│   │   ├── environments/
│   │   └── assets/
│   ├── angular.json
│   └── package.json
│
├── admin/                   → Angular v18 SPA (Admin Panel)
│   ├── src/
│   │   ├── app/
│   │   │   ├── core/        → Auth service, HTTP interceptor, guards
│   │   │   ├── pages/
│   │   │   │   ├── login/
│   │   │   │   ├── dashboard/
│   │   │   │   ├── projects/
│   │   │   │   ├── skills/
│   │   │   │   ├── profile/
│   │   │   │   └── messages/
│   │   │   └── app.routes.ts
│   │   └── environments/
│   ├── angular.json
│   └── package.json
│
└── backend/                 → Node.js API
    ├── src/
    │   ├── controllers/
    │   ├── models/
    │   ├── routes/
    │   ├── middleware/
    │   ├── config/
    │   └── utils/
    ├── .env.example
    ├── server.js
    └── package.json
```

---

## Demo Content (Realistic for "Papai")

### Profile
- **Name**: Papai
- **Title**: Full Stack Developer
- **Bio**: "Hi, I'm Papai — a passionate full-stack developer crafting modern web experiences. I specialize in building scalable applications with Angular, Node.js, and MongoDB. Focused on clean architecture and production-ready systems."
- **Location**: India
- **GitHub**: github.com/papai
- **LinkedIn**: linkedin.com/in/papai

### Projects (3 Demo)
1. **Task Flow Pro** — Full-stack task manager with real-time updates, drag-and-drop. Stack: Angular, Node.js, MongoDB, Socket.io
2. **ShopEase API** — RESTful e-commerce backend with Stripe integration and Cloudinary media. Stack: Node.js, Express, MongoDB, Stripe
3. **DevConnect** — Developer networking platform with JWT auth and live chat. Stack: Angular, Node.js, MongoDB, WebSockets

### Skills (Categorized)
- **Frontend**: Angular, TypeScript, HTML5, CSS3, Tailwind CSS, GSAP
- **Backend**: Node.js, Express.js, REST APIs, WebSockets
- **Database**: MongoDB, Mongoose, Redis (basic)
- **Tools**: Git, GitHub, Docker, Postman, Swagger

---

## Build Phases

### Phase 1 — Backend API
> Foundation first; client depends on this.

#### [NEW] `backend/package.json`
Dependencies: express, mongoose, jsonwebtoken, bcryptjs, dotenv, cors, multer, cloudinary, multer-storage-cloudinary, swagger-jsdoc, swagger-ui-express, nodemon

#### [NEW] `backend/.env.example`
```
PORT=5000
MONGODB_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/portfolio
JWT_SECRET=auto_generated_secret_here
JWT_EXPIRES_IN=7d
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
CLIENT_URL=http://localhost:4200
ADMIN_URL=http://localhost:4300
```

#### [NEW] `backend/src/models/`
- `User.model.js` — Admin user (email, password hash, role)
- `Project.model.js` — title, description, techStack[], githubUrl, liveUrl, imageUrl, featured, order, visible
- `Skill.model.js` — name, category, level (1-100), icon
- `Profile.model.js` — name, title, bio, location, email, github, linkedin, profileImageUrl, resumeUrl
- `Message.model.js` — name, email, message, read, createdAt

#### [NEW] `backend/src/routes/`
- `auth.routes.js` — POST /api/auth/login, POST /api/auth/seed (create first admin)
- `projects.routes.js` — Full CRUD, protected
- `skills.routes.js` — Full CRUD, protected
- `profile.routes.js` — GET (public), PUT (protected)
- `messages.routes.js` — POST (public contact form), GET/PATCH (admin protected)
- `upload.routes.js` — POST /api/upload (Cloudinary, admin protected)

#### [NEW] `backend/src/middleware/`
- `auth.middleware.js` — JWT verification
- `error.middleware.js` — Global error handler
- `cors.middleware.js` — CORS config

#### [NEW] `backend/server.js`
- Express app setup, Swagger at `/api-docs`, MongoDB connect, global error handler

---

### Phase 2 — Client (Public Portfolio)

#### Angular v18 + SSR Setup
- `ng new client --ssr --style=css --routing` → Angular Universal baked in
- Install: `gsap`, `@gsap/react` (N/A — use GSAP vanilla), `tailwindcss`, `@angular/animations`

#### Pages & Components

**Home Page (Single-page feel with sections)**

| Section | Details |
|---|---|
| **Navbar** | Fixed, blur backdrop, logo, nav links, scroll-aware active state |
| **Hero** | Full-viewport, "Hi, I'm Papai" with typed-text animation (GSAP), cyan glow CTA buttons, floating particles (GSAP) |
| **Skills** | Skill bars with animated fill on scroll (GSAP ScrollTrigger), categorized tabs |
| **Projects** | 3 featured cards with hover glow + tilt effect, "View All" link |
| **Contact** | Form connected to POST /api/messages, success/error state |
| **Footer** | Social links, copyright |

**Projects Page**
- Full grid of all projects
- Filter by tech stack tags
- Animated card entrance (GSAP ScrollTrigger)

#### [NEW] `client/src/app/core/services/`
- `api.service.ts` — Base HTTP service
- `projects.service.ts`
- `skills.service.ts`
- `profile.service.ts`
- `messages.service.ts`

#### [NEW] `client/src/app/core/`
- `http.interceptor.ts` — Add base URL, handle errors

#### SSR Config
- `provideServerRendering()` in `app.config.server.ts`
- Meta service for SEO per page (title, description, og:tags)

---

### Phase 3 — Admin Panel

#### Angular v18 SPA (no SSR needed)
- Install: `tailwindcss`, `@angular/animations`, `@angular/forms`
- AdminGuard: redirects to login if no JWT in localStorage

#### Pages

| Page | Features |
|---|---|
| **Login** | Email + password, JWT stored in localStorage, redirect to dashboard |
| **Dashboard** | Stats cards (projects count, messages count, skills count), recent messages |
| **Projects** | Table with Add/Edit/Delete, toggle visible, reorder via drag |
| **Skills** | Grid with Add/Edit/Delete, level slider, category dropdown |
| **Profile** | Form to edit all profile fields, upload profile image to Cloudinary, upload resume |
| **Messages** | Table with read/unread, mark read, delete |

#### [NEW] `admin/src/app/core/`
- `auth.service.ts` — Login, logout, token management
- `auth.guard.ts` — Route protection
- `http.interceptor.ts` — Attach Bearer token to all API requests

---

## Security Implementation

| Measure | Implementation |
|---|---|
| JWT Auth | `jsonwebtoken`, 7-day expiry, HS256 |
| Password Hashing | `bcryptjs`, 12 salt rounds |
| Route Protection | `auth.middleware.js` (backend), `AuthGuard` (admin) |
| CORS | Whitelist client + admin URLs only |
| File Upload | Validate mime types, max 5MB, Cloudinary only |
| HTTP Interceptor | Auto-attach token, redirect on 401 |

---

## Design System (Shared Tokens)

```css
/* Dark Theme + Cyan Glow */
--bg-primary: #0a0a0f
--bg-secondary: #111118
--bg-card: #16161f
--accent: #06b6d4         /* Cyan 500 */
--accent-glow: rgba(6, 182, 212, 0.3)
--text-primary: #f0f0f5
--text-muted: #6b7280
--border: rgba(6, 182, 212, 0.15)
--font: 'Inter', sans-serif
```

### Animations Plan
| Element | Tool | Effect |
|---|---|---|
| Hero text | GSAP + SplitText | Character-by-character reveal |
| Hero particles | GSAP | Floating ambient dots |
| Scroll reveals | GSAP ScrollTrigger | Fade up on enter |
| Skill bars | GSAP ScrollTrigger | Width fill animation |
| Project cards | GSAP | 3D tilt on hover |
| Route transitions | Angular Animations | Fade slide |
| Navbar | Angular + CSS | Blur + shadow on scroll |
| Buttons | CSS | Cyan glow pulse on hover |

---

## API Endpoints (Final)

```
Auth
  POST   /api/auth/login
  POST   /api/auth/seed          (first-run admin creation)

Projects
  GET    /api/projects            (public)
  GET    /api/projects/:id        (public)
  POST   /api/projects            (admin)
  PUT    /api/projects/:id        (admin)
  DELETE /api/projects/:id        (admin)

Skills
  GET    /api/skills              (public)
  POST   /api/skills              (admin)
  PUT    /api/skills/:id          (admin)
  DELETE /api/skills/:id          (admin)

Profile
  GET    /api/profile             (public)
  PUT    /api/profile             (admin)

Messages
  POST   /api/messages            (public contact form)
  GET    /api/messages            (admin)
  PATCH  /api/messages/:id/read   (admin)
  DELETE /api/messages/:id        (admin)

Upload
  POST   /api/upload              (admin, Cloudinary)

Docs
  GET    /api-docs                (Swagger UI)
```

---

## Build Order

```
1. backend/           → Full API + models + routes + seed
2. client/            → Angular SSR app, connect to API
3. admin/             → Admin SPA, connect to API
4. Polish             → Animations, SSR meta, responsive
5. Env + Docs         → .env.example, README updates
```

---

## Verification Plan

### Automated
- Backend: `node server.js` → Swagger UI at `/api-docs`
- Client: `ng serve` → check SSR with `ng serve --configuration=development`
- Admin: `ng serve --port 4300`

### Browser Testing
- Navigate all public pages
- Submit contact form → verify message in admin
- Admin: login, CRUD all entities, upload image
- Check SSR: View page source → confirm pre-rendered HTML

### Responsive Check
- Mobile (375px), Tablet (768px), Desktop (1440px)

---

## Open Questions (None — all answered ✅)

| Question | Answer |
|---|---|
| Identity | Papai (real name) |
| Blog | ❌ Excluded |
| SSR | ✅ Angular Universal |
| Admin Panel | ✅ Included |
| Storage | Cloudinary (placeholder .env) |
| Database | MongoDB Atlas (placeholder .env) |
| JWT | Auto-generated |
| Monorepo | Simple folder structure |
| Animations | GSAP + Angular Animations |
| Angular | v18 |
| Data | Demo (realistic) |
| Theme | Dark + Cyan Glow |
