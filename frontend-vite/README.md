# VideoHub - React Vite Frontend

A modern, responsive video streaming platform built with React, Vite, and Tailwind CSS.

## Features

- **Authentication**: User registration and login with JWT tokens
- **Video Management**: Upload, view, and manage videos
- **Social Features**: Like videos, comment, subscribe to channels
- **Playlists**: Create and manage custom playlists
- **Watch History**: Track videos you've watched
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile
- **Dark Theme**: Built-in dark mode for comfortable viewing
- **Real-time Updates**: Uses SWR for efficient data fetching

## Tech Stack

- **React 18** - UI library
- **Vite** - Build tool and dev server
- **React Router** - Client-side routing
- **Tailwind CSS** - Styling
- **Zustand** - State management
- **SWR** - Data fetching and caching
- **Axios** - HTTP client
- **Lucide React** - Icon library

## Installation

1. **Install dependencies**:
```bash
cd frontend-vite
npm install
```

2. **Create environment file** (`.env.local`):
```bash
VITE_API_BASE_URL=http://localhost:8000/api
```

3. **Start development server**:
```bash
npm run dev
```

The app will be available at `http://localhost:3000`

## Project Structure

```
src/
├── pages/              # Page components
│   ├── Home.jsx
│   ├── Login.jsx
│   ├── Register.jsx
│   ├── Video.jsx
│   ├── Upload.jsx
│   ├── Channel.jsx
│   ├── Dashboard.jsx
│   ├── WatchLater.jsx
│   ├── LikedVideos.jsx
│   ├── Trending.jsx
│   ├── Playlists.jsx
│   └── PlaylistDetail.jsx
├── components/         # Reusable components
│   ├── Navbar.jsx
│   ├── Sidebar.jsx
│   ├── VideoCard.jsx
│   ├── Toast.jsx
│   └── ToastContainer.jsx
├── lib/               # Utilities
│   └── api.js         # Axios instance with interceptors
├── store/             # State management
│   └── authStore.js   # Zustand auth store
├── context/           # React context
│   └── ToastContext.jsx
├── App.jsx            # Main app component
├── main.jsx           # Entry point
└── index.css          # Global styles
```

## Available Routes

### Public Routes
- `/` - Home page
- `/login` - Login page
- `/register` - Registration page
- `/video/:videoId` - Video player page
- `/channel/:userId` - Channel page
- `/trending` - Trending videos

### Protected Routes (Login Required)
- `/upload` - Upload video
- `/dashboard` - User dashboard
- `/watch-later` - Watch later list
- `/liked` - Liked videos
- `/playlists` - User playlists
- `/playlist/:playlistId` - Playlist details

## API Integration

The frontend connects to the backend API at `http://localhost:8000/api`. Key endpoints used:

- `POST /users/register` - Register new user
- `POST /users/login` - User login
- `POST /users/refresh-token` - Refresh access token
- `GET /videos` - Get all videos
- `POST /videos` - Upload video
- `GET /videos/:videoId` - Get video details
- `DELETE /videos/:videoId` - Delete video
- `GET /videos/my-videos` - Get user's videos
- `POST /likes/toggle/v/:videoId` - Like/unlike video
- `POST /comments/:videoId` - Add comment
- `GET /comments/:videoId` - Get comments
- `POST /subscriptions/c/:userId` - Subscribe to channel
- `GET /playlists/my-playlists` - Get user playlists
- `POST /playlists` - Create playlist
- `GET /playlists/:playlistId` - Get playlist details
- `DELETE /playlists/:playlistId` - Delete playlist

## Authentication

The app uses JWT tokens for authentication:

1. **Access Token**: Short-lived token used for API requests
2. **Refresh Token**: Long-lived token used to get a new access token
3. **Token Storage**: Tokens are stored in `localStorage`
4. **Automatic Refresh**: API interceptor automatically refreshes expired tokens

## State Management

### Auth Store (Zustand)
- `user` - Current user data
- `isAuthenticated` - Authentication status
- `loading` - Loading state during initialization
- `initialize()` - Initialize auth from localStorage
- `setUser()` - Update user data
- `logout()` - Clear auth data

### Toast Context
- `addToast()` - Show toast notification
- `removeToast()` - Remove toast notification

## Styling

The app uses Tailwind CSS with custom design tokens:

- **Colors**: Dark theme with cyan accent
- **Spacing**: Follows Tailwind spacing scale
- **Typography**: System font stack for optimal performance
- **Responsive**: Mobile-first design approach

## Build for Production

```bash
npm run build
```

This creates an optimized build in the `dist/` directory.

## Preview Production Build

```bash
npm run preview
```

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_API_BASE_URL` | Backend API URL | `http://localhost:8000/api` |

## Development

### Code Style
- ES6+ syntax
- Functional components with hooks
- Proper error handling
- Responsive design patterns

### Best Practices
- Use SWR for data fetching
- Utilize Zustand for global state
- Toast for user feedback
- React Router for navigation
- Tailwind for styling

## Troubleshooting

### Port Already in Use
If port 3000 is already in use, Vite will use the next available port (3001, 3002, etc.)

### CORS Issues
Make sure the backend allows requests from your frontend URL in CORS configuration.

### API Connection Failed
Verify that:
1. Backend server is running at `http://localhost:8000`
2. `VITE_API_BASE_URL` environment variable is correct
3. Network connectivity is working

## Support

For issues or questions, please open an issue in the repository.
