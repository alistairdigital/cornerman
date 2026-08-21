<p align="center">
  <img src="assets/brand/readme-banner.svg" alt="Cornerman — Your corner for boxing news, rankings & records." width="700">
</p>

<p align="center">
  <a href="https://cornerman-1bo.pages.dev"><img alt="Live" src="https://img.shields.io/badge/live-cornerman--1bo.pages.dev-B3151D?style=flat-square"></a>
  <img alt="Status" src="https://img.shields.io/badge/status-MVP-0D1B2A?style=flat-square">
  <img alt="Deploy" src="https://img.shields.io/badge/deploy-Cloudflare_Workers_%2B_Pages-B3151D?style=flat-square">
</p>

Cornerman is a universal boxing hub, and this is its first shipped feature: a searchable, filterable **Fighter Database**. The frontend is a static site (Cloudflare Pages) that talks to a thin Cloudflare Worker API for search/filtering — a seeded dataset of 100 fighters across 10 weight classes powers a server-side-filtered homepage table (search by name, weight class, or nationality, plus sortable columns and a status/weight/nationality filter sidebar) and individual fighter profile pages with stat cards, sanctioning-body badges, and fight history.

Rankings and News are intentionally out of scope for this MVP per the Build Lab Rule — ship one core feature, well.

**Live:** https://cornerman-1bo.pages.dev

---

## Brand

Cornerman reads as *prestige rooted in the sport itself* — authoritative, clean, sport-rooted — not generic sports-media red. White base, deep red for everyday interactive weight, navy ink for text, gold reserved strictly for world rankings and championship content so it still means something when it appears.

| Role | Swatch | Token | Usage |
|---|---|---|---|
| Background | `#F5F5F5` | `--bg` | App background |
| Surface | `#FFFFFF` | `--surface` | Cards, table, nav |
| Ink | `#0D1B2A` | `--ink` | Body text, headings, wordmark |
| Ink (soft) | `#4A4A4A` | `--ink-soft` | Secondary text, labels |
| Red (glove red) | `#B3151D` | `--red` | Buttons, active nav, hover states |
| Gold | `#C9A84C` | `--gold` | Rankings #1, title belts — reserved, not everyday UI |
| Win | `#3E7B4F` | `--win` | Win record badges |
| Loss | `#4A4A4A` | `--loss` | Loss record badges |
| Draw | `#9AA0A6` | `--draw` | Draw badges, inactive states |

**Typography:** headings in Playfair Display (serif, bold — gravitas and tradition), body and stats in Inter (tabular numerals so record columns align).

All of the above lives as CSS custom properties in [`css/styles.css`](css/styles.css), including a `:root[data-theme="dark"]` variant (navy background, white text, same red/gold accents unchanged) toggled from the nav and persisted to `localStorage` — so Rankings and News inherit the same tokens when they're built next.

---

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
`worker/src/fighters.json` (bundled into the Worker) is a seeded demo dataset (100 fictional-but-realistic records, 10 per weight class) — not live fight data. Swap in a real feed by implementing `fetchLiveFighterData()` in `worker/src/liveData.js` and wiring it into the routes in `worker/src/index.js`, keeping the same schema:

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
├── index.html              # homepage: search + filterable/sortable table
├── fighter.html             # fighter profile shell (rendered client-side)
├── assets/brand/            # README banner, brand assets
├── css/styles.css           # brand tokens (incl. dark theme) + all component styles
├── js/config.js             # API_BASE — Worker URL the frontend calls
├── js/theme.js              # dark mode toggle + localStorage persistence
├── js/app.js                # homepage search/filter/sort logic (fetches from Worker)
├── js/profile.js            # profile page render logic (fetches from Worker)
└── worker/                  # Cloudflare Worker API
    ├── wrangler.toml
    └── src/
        ├── index.js          # routes: /api/fighters, /api/fighters/:id
        ├── fighters.json     # bundled dataset served by the Worker
        └── liveData.js       # stubbed live-data integration point
```

## Build status
- [x] Idea logged
- [x] Brand defined
- [x] MVP scoped
- [x] Core feature built
- [x] README written
- [x] GitHub pushed
- [x] Deployed to Cloudflare
- [x] Dataset expanded (100 fighters)
- [x] Dark mode toggle
