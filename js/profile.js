(function () {
  function initials(name) {
    return name.split(' ').map(p => p[0]).slice(0, 2).join('').toUpperCase();
  }

  function calcAge(dobStr, asOfStr) {
    const dob = new Date(dobStr);
    const asOf = asOfStr ? new Date(asOfStr) : new Date();
    const diff = asOf.getTime() - dob.getTime();
    return Math.floor(diff / (1000 * 60 * 60 * 24 * 365.25));
  }

  const params = new URLSearchParams(window.location.search);
  const id = parseInt(params.get('id'), 10);

  fetch(`${API_BASE}/api/fighters/${id}`)
    .then(r => {
      if (!r.ok) throw new Error('Fighter not found');
      return r.json();
    })
    .then(renderProfile)
    .catch(err => {
      console.error(err);
      renderNotFound();
    });

  function renderNotFound() {
    document.querySelector('.wrap').insertAdjacentHTML('beforeend',
      `<div class="empty-state"><div class="em-title">Fighter not found</div>
       <div>That record doesn't exist in the database.</div></div>`);
  }

  function renderProfile(f) {
    document.title = `${f.name} — Cornerman`;

    const metaParts = [];
    metaParts.push(`<span>${f.flag ? f.flag + ' ' : ''}${f.nationality || 'Unknown nationality'}</span>`);
    if (f.weight_class) metaParts.push(`<span class="dot-sep">${f.weight_class}</span>`);
    if (f.stance) metaParts.push(`<span class="dot-sep">${f.stance} stance</span>`);
    if (f.dob && f.dod) {
      metaParts.push(`<span class="dot-sep">Died at age ${calcAge(f.dob, f.dod)}</span>`);
    } else if (f.dob && f.active !== false) {
      metaParts.push(`<span class="dot-sep">Age ${calcAge(f.dob)}</span>`);
    }

    const activeLabel = f.active === true ? 'Active' : f.active === false ? 'Inactive' : 'Status unknown';
    const activeClass = f.active === true ? 'active' : f.active === false ? 'inactive' : 'unknown';

    const sourceHtml = f.wikipedia_title
      ? `<p class="source-link">Source: <a href="https://en.wikipedia.org/wiki/${encodeURIComponent(f.wikipedia_title)}" target="_blank" rel="noopener">Wikipedia</a></p>`
      : '';

    const html = `
      <header class="profile-hero">
        <div class="wrap">
          <a href="index.html" class="back-link">← Back to Fighters</a>
          <div class="profile-hero-inner">
            <div class="profile-avatar">${initials(f.name)}</div>
            <div>
              <h1 class="profile-name">${f.name}</h1>
              <div class="profile-meta">
                ${metaParts.join('')}
                <span class="status-badge ${activeClass}" style="margin-left:4px;">
                  ${activeLabel}
                </span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div class="stat-grid">
        <div class="stat-card"><div class="stat-value" style="color:var(--win)">${f.wins ?? '–'}</div><div class="stat-label">Wins</div></div>
        <div class="stat-card"><div class="stat-value" style="color:var(--loss)">${f.losses ?? '–'}</div><div class="stat-label">Losses</div></div>
        <div class="stat-card"><div class="stat-value" style="color:var(--draw)">${f.draws ?? '–'}</div><div class="stat-label">Draws</div></div>
        <div class="stat-card"><div class="stat-value">${f.kos ?? '–'}</div><div class="stat-label">Knockouts</div></div>
      </div>

      ${sourceHtml}
    `;

    document.getElementById('profileRoot').innerHTML = html;
  }
})();
