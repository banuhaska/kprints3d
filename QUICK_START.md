# Quick Start: Deploy kprints3d.com

## 🚀 Fast Track (15 minutes)

### 1. MongoDB Atlas (5 min)
1. Sign up: https://www.mongodb.com/cloud/atlas/register
2. Create free cluster → Wait 3-5 min
3. Database Access → Add user (save password!)
4. Network Access → Add IP: `0.0.0.0/0`
5. Connect → Copy connection string

### 2. Backend on Render (5 min)
1. Sign up: https://render.com
2. New → Web Service
3. Connect GitHub repo (or manual deploy)
4. Settings:
   - **Root Directory**: `backend`
   - **Build**: `npm install`
   - **Start**: `npm start`
5. Environment Variables:
   ```
   MONGO_URI=your_atlas_connection_string
   JWT_SECRET=make_up_a_long_random_string
   NODE_ENV=production
   PORT=10000
   ```
6. Deploy → Copy URL (e.g., `https://kprints3d-backend.onrender.com`)

### 3. Frontend on Firebase (5 min)
1. Install Firebase CLI:
   ```bash
   npm install -g firebase-tools
   ```

2. Login:
   ```bash
   firebase login
   ```

3. Create project:
   ```bash
   cd /Users/anubalaji/Website/K3_Site
   firebase init hosting
   ```
   - Create new project: `kprints3d`
   - Public: `frontend/dist`
   - SPA: Yes

4. Create production env file:
   ```bash
   echo "VITE_API_URL=https://your-backend-url.onrender.com/api" > frontend/.env.production
   ```
   (Replace `your-backend-url` with actual Render URL)

5. Build & Deploy:
   ```bash
   cd frontend
   npm run build
   cd ..
   firebase deploy --only hosting
   ```

### 4. Custom Domain
1. Firebase Console → Hosting → Add domain
2. Enter: `kprints3d.com`
3. Add DNS records (Firebase will show you)
4. Wait 24-48 hours for SSL

## ✅ Verify It Works

1. Visit your Firebase URL (e.g., `https://kprints3d.web.app`)
2. Sign up for an account
3. Go to MongoDB Atlas → Collections → `users`
4. Find your user → Change `role` to `"admin"`
5. Refresh site → You should see "Producer" in nav

## 🔧 Troubleshooting

**Backend 500 errors**: Check Render logs, verify MONGO_URI
**Frontend can't connect**: Check CORS in backend/server.js
**Images broken**: Use Cloudinary/Imgur URLs (not local files)

## 📝 Next Steps

- Set up image uploads (Cloudinary)
- Add PayPal integration
- Configure email notifications

