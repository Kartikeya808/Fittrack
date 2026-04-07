# FitTrack Deployment

## Vercel

- Import the GitHub repo into Vercel.
- Keep the project root as the repository root.
- Framework preset: `Vite`
- Build command: `npm run build`
- Output directory: `dist`

Environment variables:

```env
VITE_API_URL=https://your-render-service.onrender.com
```

## Render

- Create a new Web Service from the same GitHub repo, or let `render.yaml` create it.
- Service root directory: `backend`
- Build command: `npm install`
- Start command: `npm start`
- Health check path: `/api/health`

Environment variables:

```env
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_long_random_secret
CLIENT_URLS=https://your-vercel-app.vercel.app
NODE_ENV=production
```

If you also want browser testing from local development, use:

```env
CLIENT_URLS=http://localhost:5173,https://your-vercel-app.vercel.app
```
