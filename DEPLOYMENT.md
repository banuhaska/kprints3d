# Deployment Guide for kprints3d.com

## Prerequisites
1. Firebase account (free tier works)
2. MongoDB Atlas account (free tier works)
3. Render or Railway account (for backend hosting)

## Step 1: Set up MongoDB Atlas (Database)

1. Go to https://www.mongodb.com/cloud/atlas
2. Create a free cluster
3. Create a database user (save username/password)
4. Whitelist IP: `0.0.0.0/0` (allows all IPs - for production)
5. Get connection string: Click "Connect" → "Connect your application"
6. Copy the connection string (looks like: `mongodb+srv://username:password@cluster.mongodb.net/kprints3d`)

## Step 2: Deploy Backend to Render (or Railway)

### Option A: Render (Recommended)

1. Go to https://render.com and sign up
2. Click "New" → "Web Service"
3. Connect your GitHub repo (or use manual deploy)
4. Settings:
   - **Name**: `kprints3d-backend`
   - **Environment**: `Node`
   - **Build Command**: `cd backend && npm install`
   - **Start Command**: `cd backend && npm start`
   - **Root Directory**: `backend`

5. Environment Variables (add these):
   ```
   PORT=10000
   MONGO_URI=your_mongodb_atlas_connection_string
   JWT_SECRET=your_super_secret_jwt_key_here
   NODE_ENV=production
   ```

6. Click "Create Web Service"
7. Wait for deployment (takes ~5 minutes)
8. Copy your backend URL (e.g., `https://kprints3d-backend.onrender.com`)

### Option B: Railway

1. Go to https://railway.app and sign up
2. Click "New Project" → "Deploy from GitHub"
3. Select your repo
4. Add environment variables (same as Render)
5. Deploy

## Step 3: Set up Firebase Hosting

1. Install Firebase CLI globally (if not already):
   ```bash
   npm install -g firebase-tools
   ```

2. Login to Firebase:
   ```bash
   firebase login
   ```

3. Initialize Firebase project:
   ```bash
   cd /Users/anubalaji/Website/K3_Site
   firebase init hosting
   ```
   - Select "Use an existing project" or "Create a new project"
   - Project ID: `kprints3d`
   - Public directory: `frontend/dist`
   - Single-page app: Yes
   - Overwrite index.html: No

4. Update frontend production environment:
   ```bash
   # Edit frontend/.env.production
   # Set VITE_API_URL to your backend URL (e.g., https://kprints3d-backend.onrender.com/api)
   ```

5. Build frontend:
   ```bash
   cd frontend
   npm run build
   ```

6. Deploy to Firebase:
   ```bash
   cd ..
   firebase deploy --only hosting
   ```

## Step 4: Connect Custom Domain

1. In Firebase Console: https://console.firebase.google.com
2. Go to Hosting → Add custom domain
3. Enter: `kprints3d.com`
4. Follow instructions to add DNS records:
   - Add A record pointing to Firebase IPs
   - Add CNAME for www subdomain
5. Wait for SSL certificate (automatic, takes ~24 hours)

## Step 5: Create Admin User

Once deployed, create your admin user:

1. Sign up normally on the site
2. Go to MongoDB Atlas → Collections
3. Find your `users` collection
4. Find your user document
5. Update `role` field to `"admin"`

## Environment Variables Summary

### Backend (.env on Render/Railway):
```
PORT=10000
MONGO_URI=mongodb+srv://user:pass@cluster.mongodb.net/kprints3d
JWT_SECRET=your_secret_key_here
NODE_ENV=production
```

### Frontend (.env.production):
```
VITE_API_URL=https://your-backend-url.onrender.com/api
```

## Troubleshooting

- **Backend not connecting**: Check MONGO_URI and IP whitelist in Atlas
- **Frontend can't reach backend**: Check CORS settings in backend/server.js
- **Images not loading**: Make sure image URLs are publicly accessible (use Cloudinary/Imgur)
- **Domain not working**: Wait 24-48 hours for DNS propagation

## Quick Deploy Commands

```bash
# Build frontend
cd frontend && npm run build

# Deploy to Firebase
cd .. && firebase deploy --only hosting

# View logs (backend on Render)
# Go to Render dashboard → Your service → Logs
```

