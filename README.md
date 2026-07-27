# Cornerman — Fighter Database (MVP)

Cornerman is a universal boxing hub, and this is its first shipped feature: a searchable, filterable Fighter Database. It's a static, JSON-driven site with zero backend — a seeded `data/fighters.json` of 70 fighters across 10 weight classes powers a client-side-filtered homepage table (search by name, weight class, or nationality, plus sortable columns and a status/weight/nationality filter sidebar) and individual fighter profile pages with stat cards, sanctioning-body badges, and fight history. The brand system (white base, glove-red accent, navy ink, gold reserved strictly for sanctioning-body/championship content) is implemented as CSS custom properties in `css/styles.css` so Rankings and News can reuse the same tokens when they're built next. Rankings and News are intentionally out of scope for this MVP per the Build Lab Rule — ship one core feature, well.

## Run locally
```
cd cornerman
python3 -m http.server 8000
# visit http://localhost:8000
```

## Deploy to Cloudflare Pages
No build step required — this is a static site.
1. `git init && git add . && git commit -m "Cornerman Fighter Database MVP"`
2. Push to GitHub.
3. In Cloudflare Pages: **Create a project → Connect to Git**, select the repo.
4. Build settings: **Framework preset: None**, **Build command: (leave blank)**, **Build output directory: /**
5. Deploy.

## Data
`data/fighters.json` is a seeded demo dataset (70 fictional-but-realistic records) for UI development — not live fight data. Swap in a real feed (BoxRec scrape / official API) by keeping the same schema:

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
├── index.html          # homepage: search + filterable/sortable table
├── fighter.html         # fighter profile shell (rendered client-side)
├── css/styles.css       # brand tokens + all component styles
├── js/app.js            # homepage search/filter/sort logic
├── js/profile.js        # profile page render logic
└── data/fighters.json   # seeded dataset (70 fighters)
```

## Build status
- [x] Idea logged
- [x] Brand defined
- [x] MVP scoped
- [x] Core feature built
- [x] README written
- [ ] GitHub pushed *(do this locally — see above)*
- [ ] Deployed to Cloudflare *(do this locally — see above)*
