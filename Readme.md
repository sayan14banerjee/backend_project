# Backend Project

## Frontend (Vite + React)

A complete frontend has been added in `frontend/` for this video platform backend.

### Features
- Authentication: register, login, logout.
- Video tools: upload videos, view your uploaded videos.
- Community actions: fetch a video by ID, like/unlike, subscribe/unsubscribe, comment.
- Playlists: create playlists and add a selected video.
- Tweets: post tweets, list your tweets, like tweet, delete tweet.

### Run frontend
```bash
cd frontend
npm install
npm run dev
```

By default the frontend uses `http://localhost:8000/api/v1`.
You can override with `VITE_API_BASE_URL`.
