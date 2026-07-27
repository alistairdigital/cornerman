(function () {
  let fighters = [];
  let sortKey = 'name';
  let sortDir = 1;
  let statusFilter = '';

  const tableBody = document.getElementById('tableBody');
  const emptyState = document.getElementById('emptyState');
  const resultCount = document.getElementById('resultCount');
  const searchInput = document.getElementById('searchInput');
  const weightFilter = document.getElementById('weightFilter');
  const natFilter = document.getElementById('natFilter');
  const statusChips = document.getElementById('statusChips');
  const resetFilters = document.getElementById('resetFilters');

  function initials(name) {
    return name.split(' ').map(p => p[0]).slice(0, 2).join('').toUpperCase();
  }

  function populateFilterOptions() {
    const weights = [...new Set(fighters.map(f => f.weight_class))].sort();
    const nats = [...new Set(fighters.map(f => f.nationality))].sort();
    weights.forEach(w => {
      const opt = document.createElement('option');
      opt.value = w; opt.textContent = w;
      weightFilter.appendChild(opt);
    });
    nats.forEach(n => {
      const opt = document.createElement('option');
      opt.value = n; opt.textContent = n;
      natFilter.appendChild(opt);
    });
  }

  function applyFilters() {
    const q = searchInput.value.trim().toLowerCase();
    const wc = weightFilter.value;
    const nat = natFilter.value;

    let result = fighters.filter(f => {
      const matchesQuery = !q ||
        f.name.toLowerCase().includes(q) ||
        f.weight_class.toLowerCase().includes(q) ||
        f.nationality.toLowerCase().includes(q);
      const matchesWeight = !wc || f.weight_class === wc;
      const matchesNat = !nat || f.nationality === nat;
      const matchesStatus = !statusFilter ||
        (statusFilter === 'active' ? f.active : !f.active);
      return matchesQuery && matchesWeight && matchesNat && matchesStatus;
    });

    result.sort((a, b) => {
      let av = a[sortKey], bv = b[sortKey];
      if (typeof av === 'string') { av = av.toLowerCase(); bv = bv.toLowerCase(); }
      if (av < bv) return -1 * sortDir;
      if (av > bv) return 1 * sortDir;
      return 0;
    });

    render(result);
  }

  function render(list) {
    tableBody.innerHTML = '';
    resultCount.innerHTML = `Showing <strong>${list.length}</strong> of <strong>${fighters.length}</strong> fighters`;

    if (list.length === 0) {
      emptyState.style.display = 'block';
      return;
    }
    emptyState.style.display = 'none';

    const frag = document.createDocumentFragment();
    list.forEach(f => {
      const tr = document.createElement('tr');
      tr.addEventListener('click', () => {
        window.location.href = `fighter.html?id=${f.id}`;
      });
      tr.innerHTML = `
        <td>
          <div class="fighter-cell">
            <div class="avatar">${initials(f.name)}</div>
            <span class="fighter-name">${f.name}</span>
          </div>
        </td>
        <td><div class="nat-cell"><span class="flag">${f.flag}</span>${f.nationality}</div></td>
        <td>${f.weight_class}</td>
        <td>
          <span class="record-badge">
            <span class="w">${f.wins}W</span>–<span class="l">${f.losses}L</span>–<span class="d">${f.draws}D</span>
          </span>
        </td>
        <td class="tnum">${f.kos}</td>
        <td><span class="status-badge ${f.active ? 'active' : 'inactive'}">${f.active ? 'Active' : 'Inactive'}</span></td>
      `;
      frag.appendChild(tr);
    });
    tableBody.appendChild(frag);
  }

  document.querySelectorAll('#fightersTable thead th').forEach(th => {
    th.addEventListener('click', () => {
      const key = th.dataset.sort;
      if (sortKey === key) sortDir *= -1;
      else { sortKey = key; sortDir = 1; }
      applyFilters();
    });
  });

  statusChips.addEventListener('click', (e) => {
    const chip = e.target.closest('.chip');
    if (!chip) return;
    [...statusChips.children].forEach(c => c.classList.remove('active'));
    chip.classList.add('active');
    statusFilter = chip.dataset.status;
    applyFilters();
  });

  resetFilters.addEventListener('click', () => {
    searchInput.value = '';
    weightFilter.value = '';
    natFilter.value = '';
    statusFilter = '';
    [...statusChips.children].forEach(c => c.classList.remove('active'));
    statusChips.children[0].classList.add('active');
    applyFilters();
  });

  searchInput.addEventListener('input', applyFilters);
  weightFilter.addEventListener('change', applyFilters);
  natFilter.addEventListener('change', applyFilters);

  fetch('data/fighters.json')
    .then(r => r.json())
    .then(data => {
      fighters = data;
      populateFilterOptions();
      applyFilters();
    })
    .catch(err => {
      tableBody.innerHTML = '';
      emptyState.style.display = 'block';
      emptyState.querySelector('.em-title').textContent = 'Could not load fighter data';
      console.error(err);
    });
})();
