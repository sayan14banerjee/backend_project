# VideoHub - Vite React Frontend Setup Guide

## Quick Start (5 minutes)

### 1. Install Dependencies
```bash
cd frontend-vite
npm install
```

### 2. Start Development Server
```bash
npm run dev
```

The frontend will open at `http://localhost:3000`

### 3. Backend Setup (in another terminal)
```bash
npm install
npm run dev
```

The backend runs at `http://localhost:8000`

## Full Setup Instructions

### Prerequisites
- Node.js 16+ and npm (or yarn/pnpm)
- Backend server running on port 8000
- Git (optional, for cloning)

### Step 1: Install Frontend Dependencies
```bash
cd frontend-vite
npm install
```

This installs:
- React 18 - UI library
- React Router - Navigation
- Vite - Build tool
- Tailwind CSS - Styling
- Zustand - State management
- SWR - Data fetching
- Axios - HTTP client
- Lucide React - Icons

### Step 2: Configure Environment
Create `.env.local` file in `frontend-vite/`:
```
VITE_API_BASE_URL=http://localhost:8000/api
```

### Step 3: Start Development Server
```bash
npm run dev
```

The app will:
- Start on `http://localhost:3000` (or next available port)
- Open automatically in your browser
- Enable Hot Module Replacement (HMR) for instant updates
- Proxy API requests to backend

### Step 4: Verify Setup
1. Open `http://localhost:3000` in your browser
2. You should see the VideoHub homepage
3. Try clicking "Sign In" to verify routing works
4. Try registering a new account to verify API connection

## Project Structure

```
frontend-vite/
├── public/                 # Static assets
├── src/
│   ├── pages/             # Page components (12 pages)
│   ├── components/        # Reusable components
│   ├── lib/               # Utilities (api.js)
│   ├── store/             # Zustand stores
│   ├── context/           # React contexts
│   ├── App.jsx            # Main app with routing
│   ├── main.jsx           # Entry point
│   └── index.css          # Global styles
├── vite.config.js         # Vite configuration
├── tailwind.config.js     # Tailwind configuration
├── index.html             # HTML template
├── package.json           # Dependencies
└── README.md              # Documentation
```

## Available Scripts

```bash
# Start development server with HMR
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint
```

## Page Routes

### Public Pages
- `/` - Home with latest videos
- `/login` - Login page
- `/register` - Registration page
- `/video/:videoId` - Video player with comments
- `/channel/:userId` - Creator channel page
- `/trending` - Trending videos

### Protected Pages (requires login)
- `/upload` - Upload new video
- `/dashboard` - Video management dashboard
- `/watch-later` - Saved watch later videos
- `/liked` - Videos you've liked
- `/playlists` - Your playlists
- `/playlist/:playlistId` - Playlist details

## API Connection

The frontend connects to backend at:
```
http://localhost:8000/api
```

### Key Features
- **Automatic Token Refresh**: Tokens are automatically refreshed when expired
- **API Interceptors**: All requests include authentication headers
- **Error Handling**: Global error handling with toast notifications
- **CORS Configured**: Backend must allow requests from frontend origin

### Example API Flow
1. User logs in → JWT tokens stored in localStorage
2. API interceptor adds token to every request
3. If token expires → Automatically refresh and retry
4. If refresh fails → Redirect to login

## Development Features

### Hot Module Replacement (HMR)
Changes to files automatically reflect in the browser without page reload.

### Fast Refresh
React components update instantly without losing component state.

### Instant Server Start
Vite starts in milliseconds, not seconds like Webpack.

### Optimized Builds
Production builds are optimized for performance and size.

## Styling System

### Design Tokens (Custom CSS Variables)
Located in `src/index.css`:
- `--background` - Primary background
- `--foreground` - Primary text color
- `--card` - Card background
- `--accent` - Accent color (cyan)
- `--muted` - Muted colors
- `--destructive` - Error colors

### Tailwind CSS
Uses utility classes for responsive design:
```jsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
  {/* Responsive 1 col on mobile, 2 on tablet, 4 on desktop */}
</div>
```

## State Management

### Global Auth State (Zustand)
```javascript
import useAuthStore from './store/authStore';

const { user, isAuthenticated, logout } = useAuthStore();
```

### Toast Notifications (React Context)
```javascript
import { useToast } from './context/ToastContext';

const { addToast } = useToast();
addToast('Success!', 'success'); // or 'error', 'info'
```

## Data Fetching with SWR

SWR handles caching and revalidation:
```javascript
import useSWR from 'swr';
import api from '../lib/api';

const { data, error, isLoading, mutate } = useSWR(
  '/videos',
  (url) => api.get(url).then(res => res.data.data)
);

// Revalidate data
mutate();
```

## Troubleshooting

### Port 3000 Already in Use
Vite will automatically use the next available port (3001, 3002, etc.)

### Backend Not Responding
Check that backend is running:
```bash
# In backend directory
npm run dev
```

### CORS Error
Ensure backend CORS allows your frontend URL:
```javascript
// Backend cors configuration
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}))
```

### Blank Page Loaded
Check browser console for errors:
1. Open DevTools (F12)
2. Check Console tab
3. Check Network tab for API errors

### Styling Not Applied
If Tailwind styles aren't working:
1. Verify `tailwind.config.js` content paths
2. Check `index.css` imports
3. Rebuild with `npm run dev`

## Building for Production

### Create Optimized Build
```bash
npm run build
```

Creates `dist/` folder with optimized files.

### Preview Production Build
```bash
npm run preview
```

Serves production build locally for testing.

### Deploy to Vercel
```bash
npm install -g vercel
vercel
```

Follow prompts to deploy. Vercel automatically detects Vite project.

## Performance Tips

1. **Lazy Loading**: Use React.lazy for route components
2. **Image Optimization**: Optimize video thumbnails
3. **Bundle Size**: Check with `npm run build`
4. **Caching**: SWR handles response caching
5. **Tree Shaking**: Vite automatically tree-shakes unused code

## Common Tasks

### Add New Page
1. Create file in `src/pages/NewPage.jsx`
2. Add route in `src/App.jsx`
3. Create navigation link in components

### Add New API Endpoint
1. Use `api` utility from `src/lib/api.js`
2. Handle errors with `useToast()`
3. Use `useSWR()` for fetching
4. Call `mutate()` to refresh data

### Update Styling
1. Modify Tailwind classes in components
2. Or update CSS variables in `src/index.css`
3. Changes apply instantly with HMR

## Support & Resources

- **React Docs**: https://react.dev
- **Vite Docs**: https://vitejs.dev
- **React Router**: https://reactrouter.com
- **Tailwind CSS**: https://tailwindcss.com
- **SWR**: https://swr.vercel.app
- **Zustand**: https://github.com/pmndrs/zustand

## Next Steps

1. ✅ Install dependencies
2. ✅ Start development server
3. ✅ Create user account at `/register`
4. ✅ Upload a test video
5. ✅ Explore all features

Happy coding!
