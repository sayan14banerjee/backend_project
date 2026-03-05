# VideoHub Frontend

A modern video streaming platform frontend built with Next.js, React, and Tailwind CSS.

## Features

- **User Authentication**: Register and login with secure JWT authentication
- **Video Browsing**: Discover and watch videos in a clean grid layout
- **Video Upload**: Upload videos with custom thumbnails
- **User Profiles**: View channel profiles and creator information
- **Video Player**: Full-featured video player with controls
- **Comments**: Comment on videos and engage with creators
- **Likes**: Like videos and view your liked videos collection
- **Playlists**: Create and manage custom playlists
- **Watch History**: Track videos you've watched
- **Dashboard**: Creator dashboard with video analytics
- **Responsive Design**: Fully responsive design for mobile, tablet, and desktop

## Tech Stack

- **Framework**: Next.js 15
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **Data Fetching**: SWR
- **HTTP Client**: Axios
- **Icons**: Lucide React
- **Notifications**: React Hot Toast

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Create `.env.local` file:
```bash
NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
```

3. Start the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

```
frontend/
├── src/
│   ├── app/                 # Next.js app directory
│   │   ├── page.tsx         # Home page
│   │   ├── auth/            # Authentication pages
│   │   ├── video/           # Video player page
│   │   ├── channel/         # Channel/profile pages
│   │   ├── upload/          # Video upload page
│   │   ├── dashboard/       # Creator dashboard
│   │   ├── playlists/       # Playlists page
│   │   ├── watch-later/     # Watch history
│   │   ├── liked/           # Liked videos
│   │   ├── trending/        # Trending videos
│   │   ├── layout.tsx       # Root layout
│   │   └── globals.css      # Global styles
│   ├── components/          # Reusable components
│   │   ├── Navbar.tsx       # Top navigation
│   │   ├── Sidebar.tsx      # Side navigation
│   │   └── VideoCard.tsx    # Video card component
│   ├── lib/
│   │   └── api.ts           # API client with interceptors
│   └── store/
│       └── authStore.ts     # Zustand auth store
├── public/                  # Static assets
├── package.json
├── tailwind.config.js
├── tsconfig.json
└── next.config.js
```

## Environment Variables

Create a `.env.local` file with the following variables:

```
NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
```

## API Integration

The frontend connects to the backend API with the following main endpoints:

### Authentication
- `POST /users/register` - Register new user
- `POST /users/login` - Login user
- `POST /users/logout` - Logout user
- `POST /users/refresh-token` - Refresh access token
- `GET /users/current-user` - Get current user

### Videos
- `GET /videos` - Get all videos
- `GET /videos/get-video/:videoId` - Get video details
- `POST /videos/upload` - Upload new video
- `PATCH /videos/update-video-details/:videoId` - Update video
- `DELETE /videos/:videoId` - Delete video
- `PATCH /videos/toggle-publish/:videoId` - Toggle publish status
- `GET /videos/my-videos` - Get user's videos

### Comments
- `GET /comments/:videoId` - Get video comments
- `POST /comments/:videoId` - Add comment
- `PATCH /comments/c/:commentId` - Update comment
- `DELETE /comments/c/:commentId` - Delete comment

### Likes
- `POST /likes/toggle/v/:videoId` - Like/unlike video
- `GET /likes/videos` - Get liked videos

### Playlists
- `POST /playlists` - Create playlist
- `GET /playlists/:playlistId` - Get playlist
- `PATCH /playlists/:playlistId` - Update playlist
- `DELETE /playlists/:playlistId` - Delete playlist
- `PATCH /playlists/add/:videoId/:playlistId` - Add to playlist
- `PATCH /playlists/remove/:videoId/:playlistId` - Remove from playlist
- `GET /playlists/user/:userId` - Get user playlists

### Subscriptions
- `POST /subscriptions/c/:channelId` - Subscribe/unsubscribe
- `GET /subscriptions/c/:channelId` - Get channel subscriptions
- `GET /subscriptions/u/:subscriberId` - Get subscriber list

### Users
- `GET /users/channel-profile/:userId` - Get user channel profile
- `GET /users/watch-history` - Get watch history
- `PATCH /users/update-account` - Update account details
- `PATCH /users/update-avatar` - Update avatar
- `PATCH /users/update-cover-image` - Update cover image
- `POST /users/change-password` - Change password

## Authentication Flow

1. User registers with email, password, and avatar
2. Backend returns access token and user data
3. Token stored in localStorage
4. Axios interceptor adds token to all requests
5. Token automatically refreshed on expiry
6. On logout, token removed and user redirected to login

## Styling

The app uses a custom dark theme with the following color scheme:

- **Background**: `#0a0e27` (Dark navy)
- **Foreground**: `#f5f7fb` (Light gray)
- **Accent**: `#00d9ff` (Cyan)
- **Muted**: `#1a1f3a` (Dark blue-gray)
- **Border**: `#2a3050` (Subtle gray)

All colors are defined as CSS variables in `globals.css` and can be easily customized.

## Building

To build for production:

```bash
npm run build
npm start
```

## Performance Tips

- Images are optimized through Next.js Image component
- Lazy loading used for video lists
- SWR for efficient data fetching with caching
- Code splitting automatic with Next.js

## Deployment

The frontend can be deployed to:
- Vercel (recommended, zero-config deployment)
- Netlify
- Any Node.js hosting provider

## Future Enhancements

- [ ] Search functionality
- [ ] Advanced filtering and sorting
- [ ] Live notifications
- [ ] Dark/light theme toggle
- [ ] Video recommendations
- [ ] Advanced analytics
- [ ] Social sharing
- [ ] Video editing capabilities

## License

ISC
