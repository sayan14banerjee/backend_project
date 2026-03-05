# VideoHub Frontend - Quick Reference

## Get Started in 2 Steps

### Step 1: Install & Run
```bash
cd frontend-vite
npm install
npm run dev
```

### Step 2: Backend Running?
```bash
# In another terminal, from root directory
npm install
npm run dev
```

**Done!** 🎉 Open http://localhost:3000

---

## Routes at a Glance

| URL | Purpose | Protected |
|-----|---------|-----------|
| `/` | Home feed | ✓ Public |
| `/login` | Sign in | ✓ Public |
| `/register` | Create account | ✓ Public |
| `/trending` | Popular videos | ✓ Public |
| `/video/:id` | Watch video | ✓ Public |
| `/channel/:id` | Creator profile | ✓ Public |
| `/upload` | Upload video | 🔒 Protected |
| `/dashboard` | Manage videos | 🔒 Protected |
| `/watch-later` | Saved videos | 🔒 Protected |
| `/liked` | Liked videos | 🔒 Protected |
| `/playlists` | Your playlists | 🔒 Protected |
| `/playlist/:id` | Playlist contents | 🔒 Protected |

---

## File Structure Overview

```
src/
├── pages/          # Page components (12 files)
├── components/     # Reusable UI (5 files)
├── lib/           # Utilities (api.js)
├── store/         # State (authStore.js)
├── context/       # Toast notifications
├── App.jsx        # Router setup
└── index.css      # Styling
```

---

## Common Tasks

### Create New Page
```jsx
// 1. Create: src/pages/MyPage.jsx
const MyPage = () => {
  return <div>My Page</div>;
};
export default MyPage;

// 2. Add Route: src/App.jsx
<Route path="/mypage" element={<MyPage />} />

// 3. Add Link: Navbar.jsx or Sidebar.jsx
<Link to="/mypage">My Page</Link>
```

### Fetch Data from API
```jsx
import useSWR from 'swr';
import api from '../lib/api';

const MyComponent = () => {
  const { data, error, isLoading, mutate } = useSWR(
    '/endpoint',
    (url) => api.get(url).then(r => r.data.data)
  );

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return <div>{JSON.stringify(data)}</div>;
};
```

### Show Notification
```jsx
import { useToast } from '../context/ToastContext';

const MyComponent = () => {
  const { addToast } = useToast();

  const handleClick = () => {
    addToast('Success!', 'success');  // or 'error', 'info'
  };

  return <button onClick={handleClick}>Click Me</button>;
};
```

### Access Auth State
```jsx
import useAuthStore from '../store/authStore';

const MyComponent = () => {
  const { user, isAuthenticated, logout } = useAuthStore();

  return (
    <div>
      {isAuthenticated && <p>Hello {user.username}!</p>}
      <button onClick={logout}>Logout</button>
    </div>
  );
};
```

### Make API Call
```jsx
import api from '../lib/api';
import { useToast } from '../context/ToastContext';

const MyComponent = () => {
  const { addToast } = useToast();

  const handleSubmit = async () => {
    try {
      const response = await api.post('/endpoint', { data });
      addToast('Success!', 'success');
    } catch (error) {
      addToast(error.response?.data?.message || 'Error', 'error');
    }
  };

  return <button onClick={handleSubmit}>Submit</button>;
};
```

---

## Styling Guide

### Responsive Classes
```jsx
<div className="text-sm md:text-base lg:text-lg">
  Mobile: sm, Tablet: md, Desktop: lg
</div>

<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
  1 col mobile → 2 col tablet → 4 col desktop
</div>
```

### Color Classes
```jsx
<div className="bg-background text-foreground">Main</div>
<div className="bg-card text-card-foreground">Card</div>
<div className="bg-accent text-accent-foreground">Accent</div>
<div className="bg-secondary text-foreground">Secondary</div>
<div className="text-muted-foreground">Muted</div>
```

### Common Patterns
```jsx
<button className="px-4 py-2 bg-accent text-accent-foreground rounded-lg hover:bg-accent/90 transition">
  Button
</button>

<input className="w-full bg-secondary text-foreground placeholder-muted-foreground rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-accent" />

<div className="bg-card border border-muted rounded-lg p-6">
  Card Content
</div>
```

---

## Environment Variables

Create `.env.local` in `frontend-vite/`:
```
VITE_API_BASE_URL=http://localhost:8000/api
```

Access in code:
```javascript
const apiUrl = import.meta.env.VITE_API_BASE_URL;
```

---

## Scripts

```bash
# Development
npm run dev      # Start dev server (http://localhost:3000)

# Production
npm run build    # Create optimized build
npm run preview  # Preview production build

# Linting
npm run lint     # Check code style
```

---

## Key Dependencies

| Package | Purpose |
|---------|---------|
| react | UI library |
| react-router-dom | Navigation |
| axios | HTTP client |
| zustand | State management |
| swr | Data fetching |
| tailwindcss | Styling |
| lucide-react | Icons |

---

## Debugging Tips

### Check Console
Open DevTools (F12) → Console tab for errors

### Network Tab
See API calls and responses (DevTools → Network)

### React DevTools
Install Chrome/Firefox extension for component debugging

### SWR DevTools
Add to see cached data:
```javascript
const { data } = useSWR('/url', fetcher, {
  onError: (err) => console.error('SWR Error:', err)
});
```

---

## Common Errors

### Port Already in Use
```
✓ Vite automatically uses next available port (3001, 3002, etc)
```

### API Not Found
```
✓ Check backend is running: npm run dev (in root)
✓ Check .env.local has correct VITE_API_BASE_URL
✓ Check CORS enabled in backend
```

### Auth Token Expired
```
✓ Automatic token refresh enabled
✓ If still failing, login again
```

### Styles Not Applying
```
✓ Clear browser cache (Ctrl+F5)
✓ Restart dev server (npm run dev)
✓ Check class names in HTML (F12 Elements)
```

---

## Performance Tips

1. **Use useSWR** for data fetching (handles caching)
2. **Lazy Load Routes** for large apps
3. **Optimize Images** before uploading
4. **Check Bundle Size**: `npm run build`
5. **Profile Performance**: DevTools → Performance

---

## Deployment

### Build for Production
```bash
npm run build
```

Creates `dist/` folder with optimized files.

### Deploy to Vercel
```bash
npm install -g vercel
vercel
```

### Deploy to Other Platforms
1. Run `npm run build`
2. Upload `dist/` folder
3. Configure server to serve `index.html` for all routes
4. Set `VITE_API_BASE_URL` environment variable

---

## Quick Links

- **React Docs**: https://react.dev
- **Vite Docs**: https://vitejs.dev
- **Tailwind**: https://tailwindcss.com
- **React Router**: https://reactrouter.com
- **SWR**: https://swr.vercel.app
- **Zustand**: https://github.com/pmndrs/zustand

---

## Need Help?

1. Check **README.md** for full documentation
2. Look at existing components for patterns
3. Check browser console (F12) for errors
4. Verify backend is running on port 8000
5. Test API endpoints with Postman

---

**Happy Coding!** 🚀
