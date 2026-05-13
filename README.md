# GitScan

Paste a GitHub username. Get back a full picture of who that developer actually is — what they build, how often they ship, and how their profile holds up.

Built for recruiters, professors, collaborators, or anyone who wants a quick read on a developer without spending 20 minutes digging through their GitHub manually.

**Live app → [git-scan-three.vercel.app](https://git-scan-three.vercel.app)**

---

## What it does

You type in any GitHub username and GitScan pulls together everything worth knowing about that developer:

- **Developer type** — figures out if they're an ML engineer, frontend dev, backend engineer, full stack, or web designer based on what languages they actually use
- **Activity summary** — total commits, how many days they were active, their most active month, and when they last pushed code
- **Contribution heatmap** — a full year of contribution data, just like the one on their GitHub profile
- **Tech stack** — which languages they use and in what proportion
- **Top repositories** — their most active repos ranked by commit count, not just stars
- **Profile checklist** — quick pass/fail on whether their profile is complete (photo, bio, location, website, followers, account age)
- **Side-by-side comparison** — compare two developers at once, useful when you're choosing between candidates
- **Shareable URLs** — every scan generates a link you can share, like `git-scan-three.vercel.app?user=mhd-faizzan`

---

## How it's built

The app is split into two parts — a Python backend that talks to GitHub, and a React frontend that displays the data.

### Backend — FastAPI + Python

The backend lives in the `/backend` folder. It's a FastAPI app that makes all the GitHub API calls and sends clean JSON to the frontend.

**APIs used:**

1. **GitHub REST API** — fetches user profile, repositories, and public events
   - `GET /users/{username}` — name, bio, location, followers, etc.
   - `GET /users/{username}/repos` — all public repos with language, stars, forks
   - `GET /users/{username}/events/public` — recent public activity
   - `GET /repos/{username}/{repo}/commits` — commit count per repo (top 10 repos)

2. **GitHub GraphQL API** — used specifically for the contribution heatmap
   - The REST API doesn't give you the full contribution calendar
   - GraphQL's `contributionsCollection` returns the exact same data GitHub shows on your profile page — every day for the past year with a count

Both APIs are free. You just need a GitHub personal access token for the GraphQL call and to get a higher rate limit (5000 requests/hour with token vs 60 without).

**How the data gets processed:**

- Language distribution is calculated from repo count per language, not lines of code
- Developer type is inferred from language percentages (e.g. if Python > 40% → ML/AI Engineer)
- Repos are ranked by commit count first, then stars as a tiebreaker
- The profile checklist checks 6 things: photo, bio, location, blog, 10+ followers, account older than 1 year

### Frontend — React + Vite + Tailwind CSS

The frontend lives in the `/frontend` folder. It's a plain React app with no complicated state management — just `useState` and `useEffect`. Tailwind handles all the styling.

Components are split by responsibility:
- `Search.jsx` — the search bar
- `ProfileHeader.jsx` — avatar, name, dev type badge, stats
- `ActivitySummary.jsx` — the 4 activity stat boxes
- `Heatmap.jsx` — the contribution grid
- `TechStack.jsx` — language bars
- `TopRepos.jsx` — repo cards
- `Checklist.jsx` — profile health items
- `ProfileReport.jsx` — assembles all of the above
- `CompareView.jsx` — the side-by-side comparison tab

---

## Running it locally

You'll need Python 3.11+ and Node 18+ installed.

**1. Clone the repo**

```bash
git clone https://github.com/mhd-faizzan/GitScan.git
cd GitScan
```

**2. Get a GitHub token**

Go to GitHub → Settings → Developer Settings → Personal Access Tokens → Fine-grained tokens → Generate new token.

Set expiration to whatever you want, give it read-only access to public repositories. Copy the token.

**3. Set up the backend**

```bash
cd backend
uv sync
source .venv/bin/activate
```

Create a `.env` file inside the `backend` folder:

```
GITHUB_TOKEN=your_token_here
```

Start the backend:

```bash
uvicorn app.main:app --reload
```

Backend runs on `http://localhost:8000`. You can test it directly:
```
http://localhost:8000/api/profile/your-github-username
```

**4. Set up the frontend**

Open a new terminal:

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on `http://localhost:5173`. Open that in your browser and you're good to go.

---

## Project structure

```
GitScan/
├── backend/
│   ├── app/
│   │   ├── models/
│   │   │   └── profile.py       # Pydantic models for API responses
│   │   ├── routers/
│   │   │   ├── profile.py       # GET /api/profile/{username}
│   │   │   └── compare.py       # GET /api/compare?user1=x&user2=y
│   │   ├── services/
│   │   │   ├── github.py        # all GitHub API calls
│   │   │   └── analyzer.py      # scoring and data processing
│   │   └── main.py              # FastAPI app setup
│   ├── .env                     # your GitHub token (pls do not forget to put it in gitignore!!!)
│   ├── .gitignore
│   ├── pyproject.toml
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── components/          # all UI components
│   │   ├── App.jsx              # main app with tab switching
│   │   ├── index.css            # Tailwind import
│   │   └── main.jsx             # React entry point
│   ├── .env.production          # VITE_API_URL for production
│   ├── vite.config.js
│   └── package.json
├── .gitignore
└── README.md
```

---

## Deployment

The live app is deployed on:
- **Frontend** → [Vercel](https://vercel.com) (free)
- **Backend** → [Railway](https://railway.app) (free tier — $5 credit/month)

> ⚠️ **Important note about the API token:** The GitHub token used in the live demo will expire after 90 days. If you find this project useful, fork it, generate your own token, and plug it in — it takes about 2 minutes and keeps everything working.

If you're self-hosting, set `GITHUB_TOKEN` as an environment variable in wherever you're deploying the backend. On Railway you add it under the Variables tab. On Render it's under Environment. Same idea everywhere.

---

## Tech stack summary

| Layer | Tech |
|---|---|
| Backend | Python, FastAPI, httpx, Pydantic |
| Frontend | React, Vite, Tailwind CSS, Axios |
| Data | GitHub REST API, GitHub GraphQL API |
| Deployment | Vercel (frontend), Railway (backend) |
| Package manager | uv (backend), npm (frontend) |

---

## Contributing

Fork it, open a PR, or just use it however you want. If you build something on top of it, I'd love to see it.

---

Built by [Muhammad Faizan](https://github.com/mhd-faizzan) during MLH Global Hack Week - GenAI 2026.