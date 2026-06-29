# 🍳 RecipeHub

A full-stack recipe sharing platform — built with **React + Tailwind CSS** on the frontend and **Express + JWT auth** on the backend.

## Stack
- **Frontend:** React 19, Vite, React Router, Tailwind CSS v4
- **Backend:** Node.js, Express, JWT (jsonwebtoken), bcryptjs, CORS

## Features
- Homepage with logo, nav, search bar, hero banner with CTAs, and featured categories
- Browse Recipes page with category + cooking-time filters and live search
- Recipe Detail page — title, ingredients, step-by-step instructions, rating
- Submit Recipe form (title, ingredients, instructions, category, cooking time) — requires login
- JWT-based register/login, passwords hashed with bcrypt
- REST API: `GET/POST/DELETE /api/recipes`, `GET /api/recipes/:id`, `POST /api/auth/register`, `POST /api/auth/login`

## Run it locally

### 1. Backend
```bash
cd backend
npm install
node server.js
```
Runs on `http://localhost:5000`.

### 2. Frontend (development mode, with hot reload)
```bash
cd frontend
npm install
npm run dev
```
Runs on `http://localhost:5173`, proxies `/api` calls to the backend.

### 3. Frontend (production build, served by Express)
```bash
cd frontend
npm install
npm run build
```
This outputs to `frontend/dist`. The Express server (`backend/server.js`) automatically serves this build, so once it's built you can just run the backend and open `http://localhost:5000` — one server for everything.

## Project structure
```
recipe-app/
├── backend/
│   ├── server.js       # Express API + static file serving
│   └── package.json
└── frontend/
    ├── src/
    │   ├── pages/       # Home, Recipes, RecipeDetail, Submit, Login, Register, Profile
    │   ├── components/  # Navbar, Footer, RecipeCard
    │   ├── context/     # AuthContext (JWT-based auth state)
    │   └── api.js        # fetch wrapper with auth header
    └── package.json
```

## Notes
- Data is stored in-memory on the backend (resets on server restart) — swap in MongoDB/Postgres for persistence.
- JWT secret is hardcoded for demo purposes — move to an environment variable for production.
