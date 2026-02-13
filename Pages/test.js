
/* ================================================================
   VIEW ROUTING
   ================================================================ */
function showView(view) {
  document.getElementById('view-menu').classList.toggle('hidden', view !== 'menu');
  document.getElementById('view-bloomery').classList.toggle('hidden', view !== 'bloomery');
  document.getElementById('view-alloys').classList.toggle('hidden', view !== 'alloys');
  document.getElementById('nav').classList.toggle('hidden', view === 'menu');

  document.getElementById('nav-bloomery').classList.toggle('active', view === 'bloomery');
  document.getElementById('nav-alloys').classList.toggle('active', view === 'alloys');
}

/* ================================================================
   BLOOMERY CALCULATOR
   ================================================================ */
const MAX_BLOOMERY_ITEMS = 48;
const MB_PER_INGOT = 144;

let bloomeryInputs = [
  { id: 'large', label: 'Large Ore', mbPerUnit: 129, quantity: 0 },
  { id: 'medium', label: 'Medium Ore', mbPerUnit: 31, quantity: 0 },
  { id: 'small', label: 'Small Ore', mbPerUnit: 13, quantity: 0 },
];
let bloomeryIdCounter = 0;

function bloomeryRender() {
  const container = document.getElementById('bloomery-inputs');
  container.innerHTML = '';
  bloomeryInputs.forEach((inp, idx) => {
    const row = document.createElement('div');
    row.className = 'input-row';
    row.innerHTML = `
      <div class="input-group grow">
        <label class="form-label">Name</label>
        <input type="text" value="${escHtml(inp.label)}" data-idx="${idx}" data-field="label" oninput="bloomeryUpdate(this)">
      </div>
      <div class="input-group w-24">
        <label class="form-label">mB/unit</label>
        <input type="number" min="0" value="${inp.mbPerUnit}" data-idx="${idx}" data-field="mbPerUnit" oninput="bloomeryUpdate(this)">
      </div>
      <div class="input-group w-20">
        <label class="form-label">Qty</label>
        <input type="number" min="0" value="${inp.quantity}" data-idx="${idx}" data-field="quantity" oninput="bloomeryUpdate(this)">
      </div>
      ${idx >= 3 ? `<button class="btn-icon-danger" onclick="bloomeryRemove(${idx})" aria-label="Remove ${escHtml(inp.label)}"><svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M3 7H11" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg></button>` : ''}
    `;
    container.appendChild(row);
  });
  bloomeryRecalc();
}

function bloomeryUpdate(el) {
  const idx = parseInt(el.dataset.idx);
  const field = el.dataset.field;
  if (field === 'label') {
    bloomeryInputs[idx].label = el.value;
  } else {
    bloomeryInputs[idx][field] = parseInt(el.value) || 0;
  }
  bloomeryRecalc();
}

function bloomeryAddInput() {
  bloomeryIdCounter++;
  bloomeryInputs.push({
    id: 'custom-' + bloomeryIdCounter,
    label: 'Custom Ore ' + bloomeryIdCounter,
    mbPerUnit: 100,
    quantity: 0,
  });
  bloomeryRender();
}

function bloomeryRemove(idx) {
  bloomeryInputs.splice(idx, 1);
  bloomeryRender();
}

function bloomeryRecalc() {
  const charcoal = parseInt(document.getElementById('bloomery-charcoal').value) || 0;
  const totalMb = bloomeryInputs.reduce((s, i) => s + i.mbPerUnit * i.quantity, 0);
  const totalOreItems = bloomeryInputs.reduce((s, i) => s + i.quantity, 0);
  const totalItems = totalOreItems + charcoal;
  const potentialIngots = Math.floor(totalMb / MB_PER_INGOT);
  const actualIngots = Math.min(potentialIngots, charcoal);
  const loss = totalMb - actualIngots * MB_PER_INGOT;
  const overCapacity = totalItems > MAX_BLOOMERY_ITEMS;

  document.getElementById('bloom-total-mb').textContent = totalMb;

  const itemsEl = document.getElementById('bloom-total-items');
  itemsEl.textContent = totalItems + ' / ' + MAX_BLOOMERY_ITEMS;
  itemsEl.className = 'stat-value' + (overCapacity ? ' danger' : '');

  document.getElementById('bloom-ingots').textContent = actualIngots;

  const lossEl = document.getElementById('bloom-loss');
  lossEl.textContent = loss > 0 ? loss : 0;
  lossEl.className = 'stat-value' + (loss > 0 ? ' warn' : '');

  document.getElementById('bloom-warning').classList.toggle('hidden', !overCapacity);
}

/* ================================================================
   ALLOYS CALCULATOR
   ================================================================ */
const VESSEL_CAPACITY = 3024;
const ALLOY_INGOT_MB = 144;
const MAX_VESSEL_ITEMS = 64;
const MINERAL_COLORS = [
  'hsl(25, 85%, 55%)', 'hsl(173, 58%, 39%)', 'hsl(43, 74%, 66%)',
  'hsl(340, 75%, 55%)', 'hsl(197, 50%, 50%)', 'hsl(280, 65%, 60%)',
  'hsl(120, 45%, 45%)', 'hsl(0, 70%, 55%)',
];

let minerals = [
  { id: 'm0', name: 'Copper', minPercent: 70, maxPercent: 80, color: MINERAL_COLORS[0] },
  { id: 'm1', name: 'Zinc', minPercent: 20, maxPercent: 30, color: MINERAL_COLORS[1] },
];
let mineralIdCounter = 2;

function alloysRender() {
  const container = document.getElementById('alloys-minerals');
  container.innerHTML = '';
  minerals.forEach((m, idx) => {
    const card = document.createElement('div');
    card.className = 'mineral-card';
    card.innerHTML = `
      <div class="mineral-head">
        <div class="mineral-name-wrap">
          <div class="mineral-dot" style="background:${m.color}"></div>
          <input type="text" class="mineral-name-input" value="${escHtml(m.name)}" data-idx="${idx}" oninput="alloysUpdateName(this)" aria-label="Mineral name">
        </div>
        ${minerals.length > 2 ? `<button class="btn-icon-danger" onclick="alloysRemoveMineral(${idx})" aria-label="Remove ${escHtml(m.name)}" style="width:28px;height:28px;"><svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M3 3L11 11M11 3L3 11" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg></button>` : ''}
      </div>
      <div class="mineral-range-row">
        <div class="input-group">
          <label class="form-label">Min %</label>
          <input type="number" min="1" max="100" value="${m.minPercent}" data-idx="${idx}" data-field="minPercent" oninput="alloysUpdateField(this)">
        </div>
        <div class="input-group">
          <label class="form-label">Max %</label>
          <input type="number" min="1" max="100" value="${m.maxPercent}" data-idx="${idx}" data-field="maxPercent" oninput="alloysUpdateField(this)">
        </div>
      </div>
      <div class="range-bar">
        <div class="range-bar-fill" style="left:${m.minPercent}%;width:${Math.max(0, m.maxPercent - m.minPercent)}%;background:${m.color};"></div>
      </div>
    `;
    container.appendChild(card);
  });
  alloysRecalc();
}

function alloysUpdateName(el) {
  minerals[parseInt(el.dataset.idx)].name = el.value;
  alloysRecalc();
}

function alloysUpdateField(el) {
  const idx = parseInt(el.dataset.idx);
  const field = el.dataset.field;
  let val = parseInt(el.value) || 1;
  val = Math.max(1, Math.min(100, val));
  minerals[idx][field] = val;
  alloysRender();
}

function alloysAddMineral() {
  const idx = mineralIdCounter++;
  minerals.push({
    id: 'm' + idx,
    name: 'Mineral ' + (minerals.length + 1),
    minPercent: 1,
    maxPercent: 50,
    color: MINERAL_COLORS[minerals.length % MINERAL_COLORS.length],
  });
  alloysRender();
}

function alloysRemoveMineral(idx) {
  minerals.splice(idx, 1);
  alloysRender();
}

function alloysRecalc() {
  const sumMin = minerals.reduce((s, m) => s + m.minPercent, 0);
  const sumMax = minerals.reduce((s, m) => s + m.maxPercent, 0);
  const valid = sumMin <= 100 && sumMax >= 100;

  const minEl = document.getElementById('alloy-sum-min');
  minEl.textContent = sumMin + '%';
  minEl.className = 'stat-value' + (sumMin > 100 ? ' danger' : '');

  const maxEl = document.getElementById('alloy-sum-max');
  maxEl.textContent = sumMax + '%';
  maxEl.className = 'stat-value' + (sumMax < 100 ? ' danger' : '');

  const msgEl = document.getElementById('alloy-valid-msg');
  if (valid) {
    msgEl.textContent = 'Valid: Ranges can produce a 100% total allocation.';
    msgEl.className = 'success-text';
  } else {
    msgEl.textContent = 'Invalid: Adjust ranges so that Min% sum is <=100 and Max% sum is >=100.';
    msgEl.className = 'warning';
  }

  document.getElementById('alloy-calc-btn').disabled = !valid;

  // Update composition bars
  const barsContainer = document.getElementById('alloy-comp-bars');
  barsContainer.innerHTML = '';
  minerals.forEach(m => {
    const row = document.createElement('div');
    row.className = 'comp-bar-row';
    row.innerHTML = `
      <div class="comp-bar-label">
        <div class="comp-bar-label-left">
          <div class="mineral-dot" style="background:${m.color};width:10px;height:10px;"></div>
          <span>${escHtml(m.name)}</span>
        </div>
        <span class="comp-bar-label-right">${m.minPercent}% - ${m.maxPercent}%</span>
      </div>
      <div class="comp-bar">
        <div class="comp-bar-range" style="left:${m.minPercent}%;width:${Math.max(0, m.maxPercent - m.minPercent)}%;background:${m.color};"></div>
      </div>
    `;
    barsContainer.appendChild(row);
  });

  // Stacked bar
  const stackedBar = document.getElementById('alloy-stacked-bar');
  stackedBar.innerHTML = '';
  minerals.forEach(m => {
    const mid = (m.minPercent + m.maxPercent) / 2;
    const seg = document.createElement('div');
    seg.className = 'stacked-segment';
    seg.style.width = mid + '%';
    seg.style.background = m.color;
    if (mid > 8) seg.textContent = mid.toFixed(1) + '%';
    stackedBar.appendChild(seg);
  });
}

function alloysCalculate() {
  if (minerals.length < 2) return;

  const results = findBestCombinations(minerals);
  const section = document.getElementById('alloy-results-section');
  const table = document.getElementById('alloy-results-table');

  if (results.length === 0) {
    section.classList.remove('hidden');
    table.innerHTML = '<tr><td style="padding:20px;text-align:center;color:var(--fg-muted);">No valid combinations found. Adjust your mineral ranges.</td></tr>';
    return;
  }

  let headerHtml = '<thead><tr><th>#</th>';
  minerals.forEach(m => {
    headerHtml += `<th style="color:${m.color};">${escHtml(m.name)} (mB)</th>`;
  });
  headerHtml += '<th>Total</th><th>Ingots</th></tr></thead>';

  let bodyHtml = '<tbody>';
  results.forEach((r, i) => {
    bodyHtml += '<tr>';
    bodyHtml += `<td class="col-muted">${i + 1}</td>`;
    r.minerals.forEach(rm => {
      bodyHtml += `<td>${rm.totalMb} <span class="col-muted">(${rm.percent.toFixed(1)}%)</span></td>`;
    });
    bodyHtml += `<td>${r.totalMb}</td>`;
    bodyHtml += `<td class="col-primary">${r.ingots}</td>`;
    bodyHtml += '</tr>';
  });
  bodyHtml += '</tbody>';

  table.innerHTML = headerHtml + bodyHtml;
  section.classList.remove('hidden');
}

function findBestCombinations(minerals) {
  const results = [];

  if (minerals.length === 2) {
    const m1 = minerals[0];
    const m2 = minerals[1];

    for (let totalMb = ALLOY_INGOT_MB; totalMb <= VESSEL_CAPACITY; totalMb += ALLOY_INGOT_MB) {
      const m1Min = Math.ceil(totalMb * (m1.minPercent / 100));
      const m1Max = Math.floor(totalMb * (m1.maxPercent / 100));

      for (let m1Mb = m1Min; m1Mb <= m1Max; m1Mb++) {
        const m2Mb = totalMb - m1Mb;
        const m2Percent = (m2Mb / totalMb) * 100;

        if (m2Percent >= m2.minPercent && m2Percent <= m2.maxPercent) {
          const m1Percent = (m1Mb / totalMb) * 100;
          results.push({
            minerals: [
              { name: m1.name, totalMb: m1Mb, percent: m1Percent },
              { name: m2.name, totalMb: m2Mb, percent: m2Percent },
            ],
            totalMb,
            ingots: Math.floor(totalMb / ALLOY_INGOT_MB),
          });
          break; // one per totalMb level
        }
      }
    }
  } else {
    // Generic N-mineral: try discretized combinations for totalMb multiples of 144
    for (let totalMb = ALLOY_INGOT_MB; totalMb <= VESSEL_CAPACITY; totalMb += ALLOY_INGOT_MB) {
      const combo = tryAllocate(minerals, totalMb, 0, []);
      if (combo) {
        results.push({
          minerals: combo.map((mb, i) => ({
            name: minerals[i].name,
            totalMb: mb,
            percent: (mb / totalMb) * 100,
          })),
          totalMb,
          ingots: Math.floor(totalMb / ALLOY_INGOT_MB),
        });
      }
    }
  }

  results.sort((a, b) => b.ingots - a.ingots);
  return results.slice(0, 20);
}

function tryAllocate(minerals, totalMb, idx, alloc) {
  if (idx === minerals.length - 1) {
    const remaining = totalMb - alloc.reduce((s, v) => s + v, 0);
    const pct = (remaining / totalMb) * 100;
    if (remaining > 0 && pct >= minerals[idx].minPercent && pct <= minerals[idx].maxPercent) {
      return [...alloc, remaining];
    }
    return null;
  }

  const m = minerals[idx];
  const minMb = Math.ceil(totalMb * (m.minPercent / 100));
  const maxMb = Math.floor(totalMb * (m.maxPercent / 100));
  const midMb = Math.round((minMb + maxMb) / 2);

  // Try mid-point first for best balance
  const result = tryAllocate(minerals, totalMb, idx + 1, [...alloc, midMb]);
  if (result) return result;

  // Try min
  const result2 = tryAllocate(minerals, totalMb, idx + 1, [...alloc, minMb]);
  if (result2) return result2;

  // Try max
  const result3 = tryAllocate(minerals, totalMb, idx + 1, [...alloc, maxMb]);
  if (result3) return result3;

  return null;
}

/* ================================================================
   UTILITIES
   ================================================================ */
function escHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

/* ================================================================
   INIT
   ================================================================ */
document.addEventListener('DOMContentLoaded', () => {
  bloomeryRender();
  alloysRender();
});
