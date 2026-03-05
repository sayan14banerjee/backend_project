# VideoHub - Getting Started Guide

Welcome to VideoHub! This comprehensive guide will help you get the complete video streaming platform up and running.

## What You Have

A **full-stack video streaming platform** with:

### Backend (Node.js + Express)
- User authentication with JWT
- Video upload and management
- Comment system
- Like/unlike functionality
- Playlist management
- Channel subscriptions
- Watch history tracking
- MongoDB database integration
- Cloudinary file storage

### Frontend (Next.js + React)
- Modern, responsive UI
- User authentication pages
- Video feed and discovery
- Video player with controls
- Creator dashboard
- Profile/channel pages
- Playlist management
- Comment sections
- Like and subscribe features

## System Requirements

- **Node.js**: 18.x or higher
- **npm** or **yarn**: Latest version
- **MongoDB**: 5.0+ (local or Atlas)
- **Cloudinary**: Free account (for file storage)
- **Git**: For version control

Check versions:
```bash
node --version
npm --version
mongosh --version  # if MongoDB installed locally
```

## Complete Setup (15 minutes)

### Step 1: Backend Setup (5 minutes)

#### 1.1 Install Backend Dependencies
```bash
cd /path/to/backend_project
npm install
```

#### 1.2 Create Backend Configuration
```bash
# Create .env file in backend root directory
cat > .env << 'EOF'
# Server Configuration
PORT=8000
CORS_ORIGIN=http://localhost:3000

# Database
MONGODB_URI=mongodb://localhost:27017/videohub

# JWT Tokens
ACCESS_TOKEN_SECRET=your_super_secret_access_token_key_minimum_32_characters_long
ACCESS_TOKEN_EXPIRES_IN=15m
REFRESH_TOKEN_SECRET=your_super_secret_refresh_token_key_minimum_32_characters_long
REFRESH_TOKEN_EXPIRES_IN=7d

# File Storage (Optional but recommended)
CLOUDINARY_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
EOF
```

#### 1.3 Start MongoDB
```bash
# Option A: Local MongoDB (if installed)
mongod

# Option B: Use MongoDB Atlas (cloud)
# Visit https://www.mongodb.com/cloud/atlas
# Create free account and cluster
# Get connection string and update MONGODB_URI in .env
```

#### 1.4 Start Backend Server
```bash
npm run dev
# Should see: ✓ DB connection successful
#            Server is listening on port 8000
```

✅ Backend running on `http://localhost:8000`

### Step 2: Frontend Setup (5 minutes)

#### 2.1 Navigate to Frontend
```bash
cd frontend
```

#### 2.2 Install Frontend Dependencies
```bash
npm install
```

#### 2.3 Create Frontend Configuration
```bash
# Create .env.local in frontend directory
cat > .env.local << 'EOF'
NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
EOF
```

#### 2.4 Start Frontend Server
```bash
npm run dev
# Should see: ✓ Ready in 2.5s
```

✅ Frontend running on `http://localhost:3000`

### Step 3: Test the Application (5 minutes)

#### 3.1 Create Account
1. Open `http://localhost:3000` in browser
2. Click **"Sign Up"** button
3. Fill in registration form:
   - Full Name: "John Doe"
   - Username: "johndoe"
   - Email: "john@example.com"
   - Password: "SecurePass123!"
   - Avatar: Select an image file
4. Click **"Create Account"**

✅ You're logged in!

#### 3.2 Upload a Test Video
1. Click **"Upload"** button in navbar
2. Fill in form:
   - Select any video file (MP4, WebM, etc.)
   - Select any image for thumbnail
   - Title: "My First Video"
   - Description: "Testing VideoHub platform"
3. Click **"Publish Video"**

✅ Video uploaded successfully!

#### 3.3 Test Features
- **Watch video**: Click on your uploaded video
- **Like video**: Click heart icon
- **Comment**: Type a comment
- **Subscribe**: Click subscribe (your own channel)
- **View profile**: Click your avatar → "My Channel"
- **Dashboard**: Click avatar → "Dashboard"
- **Create playlist**: Go to Playlists → New Playlist

## Important Configuration

### Backend .env Variables

```env
# Essential for development
PORT=8000                           # Server port
CORS_ORIGIN=http://localhost:3000   # Frontend URL
MONGODB_URI=mongodb://localhost:27017/videohub  # Database

# Security - Change these values!
ACCESS_TOKEN_SECRET=change_this_to_long_random_string_at_least_32_chars
REFRESH_TOKEN_SECRET=change_this_to_another_long_random_string_at_least_32_chars

# Optional but recommended for uploads
CLOUDINARY_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### Frontend .env.local Variables

```env
# API endpoint - update if backend runs on different port
NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
```

## Common Issues & Solutions

### Issue: "Cannot find module" Error

**Solution**: Install dependencies
```bash
npm install
```

### Issue: MongoDB Connection Refused

**Solution A - Local MongoDB**:
```bash
# Install MongoDB
brew install mongodb-community  # macOS
# or download from mongodb.com

# Start MongoDB
mongod
```

**Solution B - MongoDB Atlas (Recommended)**:
1. Visit https://www.mongodb.com/cloud/atlas
2. Create free account
3. Create cluster
4. Get connection string
5. Update `MONGODB_URI` in backend `.env`

### Issue: Port 8000 Already in Use

**Solution**:
```bash
# Use different port
PORT=8001 npm run dev

# Update frontend .env.local
NEXT_PUBLIC_API_URL=http://localhost:8001/api/v1
```

### Issue: CORS Errors

**Solution**: Check backend `.env`
```env
# Make sure this matches frontend URL
CORS_ORIGIN=http://localhost:3000
```

### Issue: Can't Upload Videos

**Solution**: Get Cloudinary account
1. Visit https://cloudinary.com
2. Sign up (free tier available)
3. Get API credentials
4. Add to backend `.env`:
```env
CLOUDINARY_NAME=your_name
CLOUDINARY_API_KEY=your_key
CLOUDINARY_API_SECRET=your_secret
```

## Running Both Services

### Option 1: Two Terminal Windows (Easiest)

**Terminal 1 - Backend**:
```bash
cd backend_project
npm run dev
```

**Terminal 2 - Frontend**:
```bash
cd backend_project/frontend
npm run dev
```

### Option 2: Single Terminal with Concurrently

```bash
# Install concurrently globally
npm install -g concurrently

# In backend_project root
concurrently "npm run dev" "cd frontend && npm run dev"
```

### Option 3: Using Package Manager Scripts

Edit `backend_project/package.json`:
```json
{
  "scripts": {
    "dev": "npm run server & cd frontend && npm run dev",
    "server": "nodemon -r dotenv/config src/index.js"
  }
}
```

Then run:
```bash
npm run dev
```

## Testing the API

### Using curl

```bash
# Register user
curl -X POST http://localhost:8000/api/v1/users/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "TestPass123",
    "fullName": "Test User"
  }'

# Login
curl -X POST http://localhost:8000/api/v1/users/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "TestPass123"
  }'

# Get all videos
curl http://localhost:8000/api/v1/videos
```

### Using Postman

1. Download [Postman](https://www.postman.com)
2. Import API endpoints
3. Create collections for:
   - Authentication
   - Videos
   - Comments
   - Likes
   - Playlists
   - Subscriptions

## File Locations

### Backend Important Files
```
backend_project/
├── src/
│   ├── routes/           # API endpoints
│   ├── controllers/      # Business logic
│   ├── models/           # Database schemas
│   └── middlewares/      # Auth, validation
├── .env                  # Configuration
└── package.json          # Dependencies
```

### Frontend Important Files
```
frontend/
├── src/
│   ├── app/              # Pages and routes
│   ├── components/       # React components
│   ├── lib/              # Utilities
│   └── store/            # State management
├── .env.local            # Configuration
└── package.json          # Dependencies
```

## Next Steps

### 1. Customize Branding
- Edit frontend colors in `frontend/src/app/globals.css`
- Update logo in `src/components/Navbar.tsx`
- Modify site title in `frontend/src/app/layout.tsx`

### 2. Add More Features
- Search functionality
- Video recommendations
- Advanced user profiles
- Live streaming
- Video editing

### 3. Deploy to Production
- Backend: Deploy to Vercel, Heroku, Railway
- Frontend: Deploy to Vercel (recommended)
- Database: Use MongoDB Atlas
- Storage: Use Cloudinary

### 4. Performance Optimization
- Enable caching
- Optimize images
- Use CDN for videos
- Implement pagination
- Add analytics

### 5. Security Hardening
- Implement rate limiting
- Add input validation
- Setup HTTPS
- Enable CORS properly
- Use environment secrets

## Development Workflow

### Making Changes

1. **Backend Changes**:
   - Edit file in `src/` directory
   - Server auto-restarts (nodemon)
   - Test with API call

2. **Frontend Changes**:
   - Edit file in `frontend/src/` directory
   - Page auto-refreshes (HMR)
   - See changes immediately

### Adding New Features

1. **Backend**:
   - Create route in `src/routes/`
   - Create controller in `src/controllers/`
   - Add model if needed in `src/models/`

2. **Frontend**:
   - Create page in `src/app/`
   - Create components in `src/components/`
   - Call API using `api.ts`

## Useful Commands

### Backend
```bash
npm run dev              # Start development
npm run build           # Build for production
npm start               # Start production

# Database commands
mongosh                 # Connect to MongoDB
show dbs               # List databases
use videohub           # Use videohub database
db.users.find()        # Query users
```

### Frontend
```bash
cd frontend

npm run dev             # Start development
npm run build           # Build for production
npm start               # Start production
npm run lint            # Check code quality
```

## Documentation Files

- **SETUP.md** - Detailed setup instructions
- **QUICKSTART.md** - 5-minute quick start
- **FRONTEND_BUILD_SUMMARY.md** - Frontend features overview
- **FRONTEND_FILES_CREATED.md** - List of all files created
- **README.md** (root) - Backend documentation
- **frontend/README.md** - Frontend documentation

## Support Resources

### Documentation
- [Next.js Docs](https://nextjs.org/docs)
- [React Docs](https://react.dev)
- [Express Docs](https://expressjs.com)
- [MongoDB Docs](https://docs.mongodb.com)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)

### Tools
- [Postman](https://www.postman.com) - API testing
- [MongoDB Compass](https://www.mongodb.com/products/compass) - Database GUI
- [VS Code](https://code.visualstudio.com) - Code editor

### Communities
- Stack Overflow
- GitHub Discussions
- Reddit (r/learnprogramming)
- Discord communities

## Deployment Checklist

Before deploying to production:

- [ ] Update all environment variables
- [ ] Enable HTTPS
- [ ] Set strong JWT secrets
- [ ] Configure MongoDB Atlas
- [ ] Set up Cloudinary
- [ ] Test all features
- [ ] Enable CORS properly
- [ ] Add rate limiting
- [ ] Set up error logging
- [ ] Configure CDN for videos
- [ ] Test on mobile devices
- [ ] Performance optimization
- [ ] Security audit
- [ ] Backup strategy

## Quick Reference

### Start Everything
```bash
# Terminal 1
npm run dev  # Backend

# Terminal 2
cd frontend && npm run dev  # Frontend
```

### Default URLs
- Frontend: http://localhost:3000
- Backend: http://localhost:8000
- API: http://localhost:8000/api/v1

### Default Test Account
- Email: Any email from registration
- Password: Any password you set

### Key API Endpoints
- `POST /users/login` - Login
- `POST /videos/upload` - Upload video
- `GET /videos` - List videos
- `POST /likes/toggle/v/:videoId` - Like video
- `POST /subscriptions/c/:channelId` - Subscribe

---

## You're All Set!

Your VideoHub application is ready to use. Start by:

1. Opening http://localhost:3000
2. Creating an account
3. Uploading a video
4. Testing all features

**Happy coding! 🎉**

For questions or issues, refer to the detailed documentation files or the README.md files in each directory.
