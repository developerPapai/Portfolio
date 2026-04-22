# 🚀 Full Stack Portfolio Deployment Guide

This guide provides a detailed, step-by-step walkthrough for deploying your Portfolio application to production.

---

## 🏗️ 1. Infrastructure Preparation

### A. MongoDB Atlas (Database)
1.  Log in to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
2.  Create a new Cluster (the free shared tier is fine).
3.  Go to **Database Access** and create a new user with `readWriteAnyDatabase` privileges.
4.  Go to **Network Access** and add IP `0.0.0.0/0` (Allow access from anywhere).
5.  Click **Connect** > **Drivers** and copy your **Connection String**.

### B. Cloudinary (Media Storage)
1.  Log in to [Cloudinary](https://cloudinary.com/).
2.  From your Dashboard, copy the following keys:
    *   `Cloud Name`
    *   `API Key`
    *   `API Secret`

---

## 🛰️ 2. Backend Deployment (Vercel)

Vercel is now the recommended option for your backend as it provides a faster, "always-active" feel without the sleep delays found on other free platforms.

### Step 1: Create a Vercel Project
1.  Log in to [Vercel](https://vercel.com/).
2.  Click **Add New** > **Project**.
3.  Select your repository.
4.  Set the following:
    *   **Project Name**: `portfolio-backend`
    *   **Framework Preset**: `Other` (It will detect the Node.js settings automatically)
    *   **Root Directory**: `backend`

### Step 2: Configure Environment Variables
In the Vercel dashboard, go to **Settings** > **Environment Variables** and add the following:
| Key | Value | Note |
| :--- | :--- | :--- |
| `NODE_ENV` | `production` | Enables production optimizations |
| `MONGODB_URI` | `mongodb+srv://...` | Your MongoDB string from Step 1A |
| `JWT_SECRET` | `your_random_secret_here` | Any long random string |
| `CLOUDINARY_CLOUD_NAME` | `...` | From Step 1B |
| `CLOUDINARY_API_KEY` | `...` | From Step 1B |
| `CLOUDINARY_API_SECRET` | `...` | From Step 1B |
| `CLIENT_URL` | `https://your-portfolio.vercel.app` | **Update after Step 3** |
| `ADMIN_URL` | `https://your-admin.vercel.app` | **Update after Step 3** |

5. Click **Deploy**. Vercel will use the `vercel.json` and the `export default app` I added to handle your Express API.

---

## 🎨 3. Frontend Deployment (Vercel)

We will deploy the `client` and `admin` as two separate projects on Vercel.

### A. Deployment for Client (Portfolio UI)
1.  Log in to [Vercel](https://vercel.com/).
2.  Click **Add New** > **Project**.
3.  Select your repository.
4.  Set the following:
    *   **Project Name**: `portfolio-client`
    *   **Framework Preset**: `Angular`
    *   **Root Directory**: `client`
5.  **Environment Variables**:
    *   Vercel handles Angular builds automatically.
6.  Click **Deploy**.

### B. Deployment for Admin (Management Panel)
1.  Repeat the same steps as above, but:
    *   **Project Name**: `portfolio-admin`
    *   **Root Directory**: `admin`
2.  Click **Deploy**.

---

## 🔧 4. Critical File Changes (Production URLs)

Once your apps are deployed, you MUST update the URLs to allow them to communicate.

### File 1: Backend `cors.middleware.js`
Ensure your backend knows about your new frontend URLs.
*   The backend already uses `process.env.CLIENT_URL`, so just make sure the Render environment variables are updated with your live Vercel links.

### File 2: Client `environment.prod.ts`
Update the API endpoint for the public site.
*   **Path**: `client/src/environments/environment.prod.ts`
```typescript
export const environment = {
  production: true,
  apiUrl: 'https://portfolio-backend.onrender.com/api', // Use your Render URL here
};
```

### File 3: Admin `environment.prod.ts`
Update the API endpoint for the admin panel.
*   **Path**: `admin/src/environments/environment.prod.ts`
```typescript
export const environment = {
  production: true,
  apiUrl: 'https://portfolio-backend.vercel.app/api', // Use your Vercel URL here
};
```

---

## ✅ 5. Post-Deployment Verification

1.  **Health Check**: Visit `https://your-backend.vercel.app/api/health`. You should see `{"success":true,"message":"Papai's Portfolio API is running 🚀"}`.
2.  **CORS Test**: Try to log in to the Admin panel. If you see "CORS error" in the console, check that `ADMIN_URL` on Vercel exactly matches your Admin Vercel URL (including `https://` and no trailing slash).
3.  **Image Test**: Upload a new profile picture in the Admin panel. Verify it shows up on the Client site.

---

### 💡 Pro Tip: Custom Domains
If you have a custom domain, add it to Vercel first, then update the `CLIENT_URL` in your Render backend settings.
