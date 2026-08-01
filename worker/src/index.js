import fighters from './fighters.json';

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json', ...CORS_HEADERS },
  });
}

function filterFighters(params) {
  const q = (params.get('q') || '').trim().toLowerCase();
  const weightClass = params.get('weight_class') || '';
  const nationality = params.get('nationality') || '';
  const status = params.get('status') || '';

  return fighters.filter((f) => {
    const matchesQuery = !q ||
      f.name.toLowerCase().includes(q) ||
      f.weight_class.toLowerCase().includes(q) ||
      f.nationality.toLowerCase().includes(q);
    const matchesWeight = !weightClass || f.weight_class === weightClass;
    const matchesNationality = !nationality || f.nationality === nationality;
    const matchesStatus = !status ||
      (status === 'active' ? f.active : !f.active);
    return matchesQuery && matchesWeight && matchesNationality && matchesStatus;
  });
}

export default {
  async fetch(request) {
    const url = new URL(request.url);

    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: CORS_HEADERS });
    }

    if (url.pathname === '/api/fighters' && request.method === 'GET') {
      return json(filterFighters(url.searchParams));
    }

    const profileMatch = url.pathname.match(/^\/api\/fighters\/(\d+)$/);
    if (profileMatch && request.method === 'GET') {
      const fighter = fighters.find((f) => f.id === Number(profileMatch[1]));
      if (!fighter) return json({ error: 'Fighter not found' }, 404);
      return json(fighter);
    }

    return json({ error: 'Not found' }, 404);
  },
};
