# VideoHub - Complete Setup Guide

This guide will help you set up and run the VideoHub video streaming platform with both backend and frontend.

## Project Structure

```
backend_project/
├── frontend/                  # React Next.js Frontend
│   ├── src/
│   │   ├── app/             # Next.js pages
│   │   ├── components/      # Reusable components
│   │   ├── lib/             # Utilities and API client
│   │   └── store/           # Zustand state management
│   ├── package.json
│   └── .env.local
├── src/                      # Node.js Backend
│   ├── routes/              # API routes
│   ├── controllers/         # Route controllers
│   ├── models/              # MongoDB schemas
│   ├── middlewares/         # Auth, file upload, etc.
│   └── utils/               # Utilities
├── package.json
└── .env
```

## Prerequisites

- **Node.js**: v18 or higher
- **npm** or **yarn**: Package managers
- **MongoDB**: Database (local or cloud)
- **Cloudinary**: Image/video storage (optional but recommended)
- **Git**: Version control

## Backend Setup

### 1. Install Dependencies

```bash
cd /path/to/backend_project
npm install
```

### 2. Configure Environment Variables

Create a `.env` file in the root directory:

```env
# Server
PORT=8000
CORS_ORIGIN=http://localhost:3000

# Database
MONGODB_URI=mongodb://localhost:27017/videohub
# OR use MongoDB Atlas
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/videohub

# JWT
ACCESS_TOKEN_SECRET=your_super_secret_access_token_key_min_32_chars
ACCESS_TOKEN_EXPIRES_IN=15m
REFRESH_TOKEN_SECRET=your_super_secret_refresh_token_key_min_32_chars
REFRESH_TOKEN_EXPIRES_IN=7d

# Cloudinary (for video/image uploads)
CLOUDINARY_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

### 3. Start the Backend Server

```bash
npm run dev
```

The backend will run on `http://localhost:8000`

## Frontend Setup

### 1. Navigate to Frontend Directory

```bash
cd frontend
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env.local` file in the frontend directory:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
```

### 4. Start the Frontend Server

```bash
npm run dev
```

The frontend will run on `http://localhost:3000`

## Running Both Services

### Option 1: Two Terminal Windows

**Terminal 1 - Backend:**
```bash
cd /path/to/backend_project
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd /path/to/backend_project/frontend
npm run dev
```

### Option 2: Using concurrently (Backend Root)

```bash
npm install -g concurrently

# In backend_project root
concurrently "npm run dev" "cd frontend && npm run dev"
```

## Features Overview

### Authentication
- User registration with avatar upload
- JWT-based login system
- Refresh token mechanism
- Secure password hashing with bcrypt

### Video Management
- Upload videos with custom thumbnails
- Edit video details (title, description)
- Toggle publish status
- Delete videos
- View watch history

### Social Features
- Like/unlike videos
- Comment on videos
- Subscribe to channels
- Create and manage playlists
- View trending videos

### User Profiles
- Channel profiles with cover images
- View channel statistics
- Creator dashboard with analytics
- Subscriber management

## API Endpoints

### Auth Routes (`/api/v1/users`)
- `POST /register` - Register new user
- `POST /login` - Login user
- `POST /logout` - Logout (requires auth)
- `POST /refresh-token` - Refresh access token
- `GET /current-user` - Get current user (requires auth)
- `GET /channel-profile/:userId` - Get user channel profile
- `PATCH /update-account` - Update account details (requires auth)
- `PATCH /update-avatar` - Update avatar (requires auth)
- `PATCH /update-cover-image` - Update cover image (requires auth)
- `GET /watch-history` - Get watch history (requires auth)

### Video Routes (`/api/v1/videos`)
- `POST /upload` - Upload video (requires auth)
- `GET /my-videos` - Get user's videos (requires auth)
- `GET /get-video/:videoId` - Get video details (requires auth)
- `PATCH /update-video-details/:videoId` - Update video (requires auth)
- `DELETE /:videoId` - Delete video (requires auth)
- `PATCH /toggle-publish/:videoId` - Toggle publish status (requires auth)

### Comment Routes (`/api/v1/comments`)
- `GET /:videoId` - Get video comments (requires auth)
- `POST /:videoId` - Add comment (requires auth)
- `PATCH /c/:commentId` - Update comment (requires auth)
- `DELETE /c/:commentId` - Delete comment (requires auth)

### Like Routes (`/api/v1/likes`)
- `POST /toggle/v/:videoId` - Like/unlike video (requires auth)
- `POST /toggle/c/:commentId` - Like/unlike comment (requires auth)
- `GET /videos` - Get liked videos (requires auth)

### Playlist Routes (`/api/v1/playlists`)
- `POST /` - Create playlist (requires auth)
- `GET /:playlistId` - Get playlist (requires auth)
- `PATCH /:playlistId` - Update playlist (requires auth)
- `DELETE /:playlistId` - Delete playlist (requires auth)
- `PATCH /add/:videoId/:playlistId` - Add to playlist (requires auth)
- `PATCH /remove/:videoId/:playlistId` - Remove from playlist (requires auth)
- `GET /user/:userId` - Get user playlists (requires auth)

### Subscription Routes (`/api/v1/subscriptions`)
- `POST /c/:channelId` - Subscribe/unsubscribe (requires auth)
- `GET /c/:channelId` - Get channel subscriptions (requires auth)
- `GET /u/:subscriberId` - Get subscriber list (requires auth)

## Testing the Application

### 1. Create an Account
- Navigate to `http://localhost:3000`
- Click "Sign Up"
- Fill in the registration form
- Upload profile picture and optional cover image
- Submit to create account

### 2. Upload a Video
- Login to your account
- Click "Upload" button
- Select video file and thumbnail
- Enter title and description
- Publish the video

### 3. Browse Videos
- Visit home page to see all videos
- Click trending for most viewed
- Search through video cards
- Click video to watch

### 4. Social Interactions
- Like videos
- Comment on videos
- Subscribe to channels
- Create playlists
- Add videos to playlists

## Troubleshooting

### MongoDB Connection Issues
```
Error: connect ECONNREFUSED
```
**Solution**: Ensure MongoDB is running. For local MongoDB:
```bash
mongod
```

### CORS Issues
```
Access to XMLHttpRequest has been blocked by CORS policy
```
**Solution**: Check `CORS_ORIGIN` in backend `.env` matches frontend URL

### Cloudinary Upload Errors
**Solution**: Verify Cloudinary credentials in `.env`

### Port Already in Use
```bash
# Find process using port 8000
lsof -i :8000
# Kill the process
kill -9 <PID>

# Or use different port
PORT=8001 npm run dev
```

### Frontend Can't Reach Backend
**Solution**: Check `NEXT_PUBLIC_API_URL` in frontend `.env.local` matches backend URL

## Development Tips

### Hot Reload
- Backend: Uses nodemon (auto-restarts on file changes)
- Frontend: Uses Next.js HMR (auto-refreshes)

### Debugging
- Backend: Use `console.log()` or debugger
- Frontend: Use browser DevTools (F12)

### Database Testing
```bash
# Connect to MongoDB
mongosh

# List databases
show dbs

# Use videohub database
use videohub

# View collections
show collections

# Query users
db.users.find()
```

## Building for Production

### Backend
```bash
# Build (if needed)
npm run build

# Start production server
NODE_ENV=production npm start
```

### Frontend
```bash
cd frontend

# Build
npm run build

# Start
npm start
```

## Deployment Options

### Backend
- **Heroku**: Deploy Node.js apps directly
- **AWS EC2**: Launch custom instance
- **Railway**: Modern hosting platform
- **Render**: Free tier available
- **Vercel**: Supports Node.js functions

### Frontend
- **Vercel**: Optimized for Next.js (recommended)
- **Netlify**: Zero-config deployment
- **AWS Amplify**: Full-stack hosting
- **GitHub Pages**: Static builds only

### Database
- **MongoDB Atlas**: Cloud MongoDB (recommended)
- **AWS RDS**: Managed database service
- **Self-hosted**: Docker + VPS

## Performance Optimization

### Frontend
- Images optimized through Next.js Image component
- Code splitting automatic with Next.js
- SWR for efficient data fetching with caching
- Lazy loading for video lists

### Backend
- MongoDB indexing on frequently queried fields
- JWT token caching
- Cloudinary CDN for media delivery
- Pagination for large datasets

## Security Considerations

- **Passwords**: Hashed with bcrypt (cost: 10)
- **Tokens**: JWT with secure expiry
- **CORS**: Configured to specific origins
- **File Uploads**: Validated and stored on Cloudinary
- **SQL Injection**: Protected by MongoDB + Mongoose
- **XSS**: React escapes by default

## Next Steps

1. Review and test all API endpoints
2. Customize styling in `frontend/src/app/globals.css`
3. Add more features (search, recommendations, etc.)
4. Set up CI/CD pipeline
5. Deploy to production

## Support & Resources

- Backend: Express.js documentation
- Frontend: Next.js documentation
- Database: MongoDB documentation
- Storage: Cloudinary API documentation
- State: Zustand documentation
- Styling: Tailwind CSS documentation

## License

ISC

---

For any questions or issues, refer to the individual README files in `/frontend` and backend root directory.
