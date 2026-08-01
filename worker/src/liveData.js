// Stubbed integration point for a future live data source (e.g. BoxRec scrape,
// official sanctioning body API). Disabled by default — not called by any route.
// Swap the throw for a real fetch/parse implementation when a provider is chosen.
export function fetchLiveFighterData() {
  throw new Error('not implemented');
}
