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

function toFighterJson(row) {
  if (!row) return row;
  return {
    ...row,
    active: row.active === null || row.active === undefined ? null : Boolean(row.active),
  };
}

function buildFtsQuery(q) {
  return q
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .map((term) => `"${term.replace(/"/g, '""')}"*`)
    .join(' ');
}

async function queryFighters(db, params) {
  const q = params.get('q') || '';
  const weightClass = params.get('weight_class') || '';
  const nationality = params.get('nationality') || '';
  const status = params.get('status') || '';

  const conditions = [];
  const args = [];
  let sql;

  if (q.trim()) {
    sql = `SELECT f.* FROM fighters f
           JOIN fighters_fts ON f.id = fighters_fts.rowid
           WHERE fighters_fts MATCH ?`;
    args.push(buildFtsQuery(q));
  } else {
    sql = 'SELECT * FROM fighters f WHERE 1=1';
  }

  if (weightClass) {
    conditions.push('f.weight_class = ?');
    args.push(weightClass);
  }
  if (nationality) {
    conditions.push('f.nationality = ?');
    args.push(nationality);
  }
  if (status === 'active') {
    conditions.push('f.active = 1');
  } else if (status === 'inactive') {
    conditions.push('f.active = 0');
  }

  if (conditions.length) {
    sql += ' AND ' + conditions.join(' AND ');
  }
  sql += ' ORDER BY f.name';

  const result = await db.prepare(sql).bind(...args).all();
  return result.results.map(toFighterJson);
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: CORS_HEADERS });
    }

    if (url.pathname === '/api/fighters' && request.method === 'GET') {
      const fighters = await queryFighters(env.DB, url.searchParams);
      return json(fighters);
    }

    const profileMatch = url.pathname.match(/^\/api\/fighters\/(\d+)$/);
    if (profileMatch && request.method === 'GET') {
      const row = await env.DB.prepare('SELECT * FROM fighters WHERE id = ?')
        .bind(Number(profileMatch[1]))
        .first();
      if (!row) return json({ error: 'Fighter not found' }, 404);
      return json(toFighterJson(row));
    }

    return json({ error: 'Not found' }, 404);
  },
};
