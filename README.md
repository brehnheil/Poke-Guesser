# 🎮 PokeGuesser

A fun web game built with **React + Vite** where players try to identify Pokémon silhouettes in timed rounds. Powered by the [PokéAPI](https://pokeapi.co). This project was created as a personal portfolio piece to showcase modern frontend development, API integration, and deployment with Vercel.

---

## 🚀 Live Demo
👉 [Try it on Vercel](https://poke-guesser-project.vercel.app/)  

---

## ✨ Features
- **User Authentication** – Email magic link login via Supabase Auth.
- **Unique Usernames** – Each profile enforces a unique handle.
- **Profile Page** – Update username, view best score, see recent runs.
- **Score Tracking** – Every completed game inserts a score row with timestamp.
- **Global Leaderboard** – Shows top users all-time and last 7 days; updates in real-time.
- **Responsive UI** – Clean, minimal, mobile-friendly layout.
- **Database Security** – Row Level Security (RLS) policies to ensure users can only modify their own data.

---

## 🛠️ Tech Stack
- **Frontend:** React 18 + Vite, React Router
- **Backend:** Supabase (Postgres, Auth, Storage, Realtime)
- **Hosting:** Vercel
- **Styling:** Custom CSS (modularized per page/component)
- **Build Tools:** npm, GitHub, Vercel CI/CD

---

## 📐 Architecture
```text
React (Vite SPA)
   │
   ├── AuthContext (Supabase client)
   │
   ├── Pages:
   │     ├── Game.jsx       → main guessing game
   │     ├── Profile.jsx    → username, best score, recent runs
   │     └── Leaderboard.jsx→ top scores, realtime updates
   │
   └── Supabase
         ├── auth.users    → sign-in / magic link
         ├── profiles      → unique usernames
         ├── scores        → game scores w/ played_at
         └── leaderboard   → SQL view: per-user best score
```

---

## 📸 Screenshots

- **Game Page:** Guess the Pokémon-style challenge with score counter.  
- **Profile Page:** Change username, see best score and recent runs.  
- **Leaderboard Page:** Global ranking with best score + achieved-at time.  

---

## 🔒 Security & Reliability
- Row Level Security policies restrict updates/inserts to the current user.
- Profile row auto-created on sign-up (via trigger).
- Real-time subscriptions keep leaderboard/profile stats fresh.
- All secrets managed via Vercel environment variables.

---

## 📈 Possible Extensions
- Daily Challenge mode (same Pokémon for everyone per day).
- Achievements / badges.
- Avatars (Supabase Storage).

---

## 📜 License
MIT © 2025 Brehn Heil

---

## 🙋 About
Built as a portfolio project to demonstrate full-stack skills with React + Supabase.  
Showcases authentication, database design, secure RLS policies, real-time data, and deployment to production.

---

## 📚 Data & Copyright Notice

This project uses the [PokéAPI](https://pokeapi.co/) to fetch Pokémon data (names, sprites, etc).  
PokéAPI is a free, community-driven API and is **not affiliated with Nintendo, Game Freak, or The Pokémon Company**.

⚠️ **Disclaimer:**  
All Pokémon names, images, and related assets are trademarks of Nintendo, Game Freak, and The Pokémon Company.  
This project is a **fan-made educational portfolio piece** and is not intended for commercial use.

---