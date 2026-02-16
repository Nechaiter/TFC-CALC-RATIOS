const MAX_BLOOMERY_ITEMS = 48;
const MB_PER_INGOT = 144;

let bloomeryInputs = [
  { id: 'large', label: 'Large Ore', mbPerUnit: 129, quantity: 0 },
  { id: 'medium', label: 'Medium Ore', mbPerUnit: 31, quantity: 0 },
  { id: 'small', label: 'Small Ore', mbPerUnit: 13, quantity: 0 },
];
let bloomeryIdCounter = 0;

function escHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

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
      ${idx >= 3 ? `<button class="btn-icon-danger" onclick="bloomeryRemove(${idx})"><svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M3 7H11" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg></button>` : ''}
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

document.addEventListener('DOMContentLoaded', bloomeryRender);