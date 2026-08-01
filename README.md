# Cornerman — Fighter Database (MVP)

Cornerman is a universal boxing hub, and this is its first shipped feature: a searchable, filterable Fighter Database. The frontend is a static site (Cloudflare Pages) that talks to a thin Cloudflare Worker API for search/filtering — a seeded dataset of 70 fighters across 10 weight classes powers a server-side-filtered homepage table (search by name, weight class, or nationality, plus sortable columns and a status/weight/nationality filter sidebar) and individual fighter profile pages with stat cards, sanctioning-body badges, and fight history. The brand system (white base, glove-red accent, navy ink, gold reserved strictly for sanctioning-body/championship content) is implemented as CSS custom properties in `css/styles.css` so Rankings and News can reuse the same tokens when they're built next. Rankings and News are intentionally out of scope for this MVP per the Build Lab Rule — ship one core feature, well.

**Live:** https://cornerman-1bo.pages.dev

## Architecture
- `index.html` / `fighter.html` / `css/` / `js/` — static frontend, deployed to Cloudflare Pages.
- `worker/` — Cloudflare Worker (`cornerman-api`) serving `GET /api/fighters` (query params: `q`, `weight_class`, `nationality`, `status`) and `GET /api/fighters/:id`. The frontend fetches from this Worker instead of filtering a local JSON file client-side.
- `worker/src/liveData.js` — stubbed `fetchLiveFighterData()`, disabled by default (throws `not implemented`). Swap in a real BoxRec scrape or official API here later; no other code depends on it yet.

## Run locally
```
cd cornerman/worker
npx wrangler dev            # starts the API on http://127.0.0.1:8787

# in another terminal, from the repo root:
python3 -m http.server 8000
# visit http://localhost:8000 (point js/config.js API_BASE at 127.0.0.1:8787 for local testing)
```

## Deploy to Cloudflare
```
# API
cd worker && npx wrangler deploy

# Frontend (from repo root, after pointing js/config.js API_BASE at the deployed Worker URL)
npx wrangler pages deploy . --project-name=cornerman
```

## Data
`worker/src/fighters.json` (bundled into the Worker) is a seeded demo dataset (70 fictional-but-realistic records) — not live fight data. Swap in a real feed by implementing `fetchLiveFighterData()` in `worker/src/liveData.js` and wiring it into the routes in `worker/src/index.js`, keeping the same schema:

```json
{
  "id": 1, "name": "", "nationality": "", "flag": "",
  "weight_class": "", "wins": 0, "losses": 0, "draws": 0, "kos": 0,
  "active": true, "sanctioning_bodies": ["WBC"], "stance": "Orthodox",
  "dob": "YYYY-MM-DD", "fight_history": [{"opponent":"","result":"W","method":"KO","date":"YYYY-MM-DD"}]
}
```

## Structure
```
cornerman/
├── index.html            # homepage: search + filterable/sortable table
├── fighter.html           # fighter profile shell (rendered client-side)
├── css/styles.css         # brand tokens + all component styles
├── js/config.js           # API_BASE — Worker URL the frontend calls
├── js/app.js              # homepage search/filter/sort logic (fetches from Worker)
├── js/profile.js          # profile page render logic (fetches from Worker)
├── data/fighters.json     # seeded dataset (kept for reference/local tooling)
└── worker/                # Cloudflare Worker API
    ├── wrangler.toml
    └── src/
        ├── index.js        # routes: /api/fighters, /api/fighters/:id
        ├── fighters.json   # bundled dataset served by the Worker
        └── liveData.js     # stubbed live-data integration point
```

## Build status
- [x] Idea logged
- [x] Brand defined
- [x] MVP scoped
- [x] Core feature built
- [x] README written
- [x] GitHub pushed
- [x] Deployed to Cloudflare
