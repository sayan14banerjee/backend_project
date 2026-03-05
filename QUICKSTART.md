# VideoHub - Quick Start Guide

Get VideoHub running in 5 minutes!

## 1. Backend Setup (2 minutes)

```bash
# Install dependencies
npm install

# Create .env file
cat > .env << EOF
PORT=8000
CORS_ORIGIN=http://localhost:3000
MONGODB_URI=mongodb://localhost:27017/videohub
ACCESS_TOKEN_SECRET=your_super_secret_access_token_key_min_32_chars
ACCESS_TOKEN_EXPIRES_IN=15m
REFRESH_TOKEN_SECRET=your_super_secret_refresh_token_key_min_32_chars
REFRESH_TOKEN_EXPIRES_IN=7d
CLOUDINARY_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
EOF

# Start backend server
npm run dev
# Backend running at http://localhost:8000
```

## 2. Frontend Setup (2 minutes)

```bash
# Open new terminal and go to frontend
cd frontend

# Install dependencies
npm install

# Create .env.local
cat > .env.local << EOF
NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
EOF

# Start frontend server
npm run dev
# Frontend running at http://localhost:3000
```

## 3. Database Setup (1 minute)

### Option A: Local MongoDB
```bash
# Install MongoDB Community Edition
# macOS with Homebrew:
brew install mongodb-community

# Start MongoDB
brew services start mongodb-community

# Verify connection
mongosh
```

### Option B: MongoDB Atlas (Cloud)
1. Go to https://www.mongodb.com/cloud/atlas
2. Create free account
3. Create a cluster
4. Get connection string
5. Update `MONGODB_URI` in backend `.env`

## 4. Start Using VideoHub!

1. **Open Browser**: Go to `http://localhost:3000`
2. **Create Account**: Click "Sign Up"
3. **Upload Avatar**: Select profile picture
4. **Set Password**: Create secure password
5. **Sign In**: Login with email/password
6. **Upload Video**: Click "Upload" button
7. **Watch**: Browse and watch videos

## Key Files to Customize

### Frontend Theme
Edit `frontend/src/app/globals.css`:
```css
:root {
  --color-background: #0a0e27;
  --color-foreground: #f5f7fb;
  --color-accent: #00d9ff;
  /* ... more colors */
}
```

### Backend Models
Edit `src/models/` directory to add fields to User, Video, etc.

### API Routes
Edit `src/routes/` to add new endpoints

## Essential Commands

```bash
# Backend
npm run dev              # Start development server
npm run build           # Build for production
npm start               # Start production server

# Frontend
cd frontend
npm run dev             # Start development server
npm run build           # Build for production
npm start               # Start production server
```

## Testing

### Create Test User
```bash
# Navigate to http://localhost:3000/auth/register
# Fill form:
# - Full Name: John Doe
# - Username: johndoe
# - Email: john@example.com
# - Password: TestPass123
# - Avatar: Select any image
# Click Sign Up
```

### Upload Test Video
```bash
# Login with test account
# Click Upload
# - Select any video file
# - Select any image for thumbnail
# - Title: "My Test Video"
# - Description: "Testing VideoHub"
# Click Publish
```

### Test Features
- Like the video
- Subscribe to channel
- View profile
- Create playlist
- Add video to playlist

## Troubleshooting Quick Fixes

### Frontend shows "API connection failed"
```bash
# Check backend is running on port 8000
# Check NEXT_PUBLIC_API_URL in frontend/.env.local
# Verify CORS_ORIGIN in backend/.env includes http://localhost:3000
```

### MongoDB connection error
```bash
# Check MongoDB is running
# Local: mongosh should connect
# Atlas: Verify connection string and IP whitelist
```

### Port 8000 or 3000 already in use
```bash
# Use different port
PORT=8001 npm run dev        # Backend on 8001
cd frontend && PORT=3001 npm run dev  # Frontend on 3001

# Update frontend .env.local:
NEXT_PUBLIC_API_URL=http://localhost:8001/api/v1
```

## Next Steps

1. **Add Cloudinary**: Get free account at cloudinary.com
2. **Customize Theme**: Edit `globals.css` colors
3. **Deploy Backend**: Use Vercel, Heroku, or Railway
4. **Deploy Frontend**: Use Vercel (recommended)
5. **Add Features**: Implement search, recommendations, etc.

## Important Environment Variables

### Backend (.env)
- `MONGODB_URI`: Database connection string
- `ACCESS_TOKEN_SECRET`: JWT secret (min 32 chars)
- `CLOUDINARY_API_KEY`: Cloud storage for videos/images
- `CORS_ORIGIN`: Frontend URL (http://localhost:3000)

### Frontend (.env.local)
- `NEXT_PUBLIC_API_URL`: Backend API URL (http://localhost:8000/api/v1)

## File Structure

```
videohub/
├── frontend/              # React frontend
│   ├── src/app/          # Pages and routes
│   ├── src/components/   # React components
│   ├── src/lib/          # API client, utilities
│   ├── src/store/        # Zustand stores
│   └── package.json
└── src/                  # Express backend
    ├── models/           # MongoDB schemas
    ├── controllers/      # Route handlers
    ├── routes/           # API endpoints
    └── package.json
```

## Common API Calls

```javascript
// Login
POST /api/v1/users/login
{ email: "user@example.com", password: "password123" }

// Upload video
POST /api/v1/videos/upload
FormData: { video, thumbnail, title, description }

// Get videos
GET /api/v1/videos

// Like video
POST /api/v1/likes/toggle/v/:videoId

// Subscribe
POST /api/v1/subscriptions/c/:channelId
```

## Useful Links

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000/api/v1
- **MongoDB**: mongosh (local) or MongoDB Atlas (cloud)
- **Docs**: See SETUP.md for detailed guide

---

**You're all set! Enjoy building with VideoHub!**
