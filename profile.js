(function () {
  function initials(name) {
    return name.split(' ').map(p => p[0]).slice(0, 2).join('').toUpperCase();
  }

  function calcAge(dobStr) {
    const dob = new Date(dobStr);
    const diff = Date.now() - dob.getTime();
    return Math.floor(diff / (1000 * 60 * 60 * 24 * 365.25));
  }

  const params = new URLSearchParams(window.location.search);
  const id = parseInt(params.get('id'), 10);

  fetch('data/fighters.json')
    .then(r => r.json())
    .then(data => {
      const f = data.find(x => x.id === id);
      if (!f) {
        renderNotFound();
        return;
      }
      renderProfile(f);
    })
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

    const bodiesHtml = f.sanctioning_bodies.length
      ? f.sanctioning_bodies.map(b => `<span class="body-badge">${b} Registered</span>`).join('')
      : '';

    const historyHtml = f.fight_history && f.fight_history.length
      ? `<table class="fighters-table"><thead><tr>
           <th>Result</th><th>Opponent</th><th>Method</th><th>Date</th>
         </tr></thead><tbody>
         ${f.fight_history.map(h => `
           <tr>
             <td><span class="result-pill ${h.result}">${h.result}</span></td>
             <td>${h.opponent}</td>
             <td>${h.method}</td>
             <td class="tnum">${h.date}</td>
           </tr>`).join('')}
         </tbody></table>`
      : `<div class="no-history">No individual fight history recorded yet for this fighter.</div>`;

    const html = `
      <header class="profile-hero">
        <div class="wrap">
          <a href="index.html" class="back-link">← Back to Fighters</a>
          <div class="profile-hero-inner">
            <div class="profile-avatar">${initials(f.name)}</div>
            <div>
              <h1 class="profile-name">${f.name}</h1>
              <div class="profile-meta">
                <span>${f.flag} ${f.nationality}</span>
                <span class="dot-sep">${f.weight_class}</span>
                <span class="dot-sep">${f.stance} stance</span>
                <span class="dot-sep">Age ${calcAge(f.dob)}</span>
                <span class="status-badge ${f.active ? 'active' : 'inactive'}" style="margin-left:4px;">
                  ${f.active ? 'Active' : 'Inactive'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div class="stat-grid">
        <div class="stat-card"><div class="stat-value" style="color:var(--win)">${f.wins}</div><div class="stat-label">Wins</div></div>
        <div class="stat-card"><div class="stat-value" style="color:var(--loss)">${f.losses}</div><div class="stat-label">Losses</div></div>
        <div class="stat-card"><div class="stat-value" style="color:var(--draw)">${f.draws}</div><div class="stat-label">Draws</div></div>
        <div class="stat-card"><div class="stat-value">${f.kos}</div><div class="stat-label">Knockouts</div></div>
      </div>

      ${bodiesHtml ? `<div class="body-badges">${bodiesHtml}</div>` : ''}

      <section class="section-block">
        <h2>Fight History</h2>
        ${historyHtml}
      </section>
    `;

    document.getElementById('profileRoot').innerHTML = html;
  }
})();
