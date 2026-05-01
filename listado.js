/* === LISTADO.JS — Property listing page logic === */

let allProperties = [];
let filteredProperties = [];
let currentView = 'grid'; // 'grid' | 'list' | 'map'
let currentPage = 1;
const ITEMS_PER_PAGE = 9;
let map = null;
let mapMarkers = [];
let drawEnabled = false;
let drawnArea = null;

// Price range state
let priceMin = 0;
let priceMax = 3000000;

// ============================================================
// INIT
// ============================================================
function initListing() {
  if (typeof properties !== 'undefined') {
    allProperties = properties;
  }
  parseURLParams();
  renderSidebarFilters();
  applyFilters();
  initViewToggle();
  initSortSelect();
  initSavedSearches();
  renderComparatorBar();
  renderViewedHistory();
}

// ============================================================
// URL PARAMS
// ============================================================
function parseURLParams() {
  const params = new URLSearchParams(window.location.search);
  if (params.get('q')) document.getElementById('search-text').value = params.get('q');
  if (params.get('ciudad')) document.getElementById('filter-city').value = params.get('ciudad');
  if (params.get('tipo')) document.getElementById('filter-type').value = params.get('tipo');
  if (params.get('operacion')) document.getElementById('filter-operation').value = params.get('operacion');
}

// ============================================================
// FILTERS
// ============================================================
function applyFilters() {
  const text       = (document.getElementById('search-text')?.value || '').toLowerCase();
  const city       = document.getElementById('filter-city')?.value || '';
  const type       = document.getElementById('filter-type')?.value || '';
  const operation  = document.getElementById('filter-operation')?.value || '';
  const bedsVal    = document.getElementById('filter-beds')?.value || '';
  const bathsVal   = document.getElementById('filter-baths')?.value || '';
  const m2Min      = parseInt(document.getElementById('filter-m2-min')?.value || '0');
  const m2Max      = parseInt(document.getElementById('filter-m2-max')?.value || '99999');
  const elevator   = document.getElementById('filter-elevator')?.checked;
  const garage     = document.getElementById('filter-garage')?.checked;
  const certVal    = document.getElementById('filter-cert')?.value || '';
  const featured   = new URLSearchParams(window.location.search).get('destacados') === 'true';

  filteredProperties = allProperties.filter(p => {
    if (featured && !p.featured) return false;
    if (text) {
      const searchIn = [
        localText(p.title), localText(p.address), p.city, p.neighbourhood, String(p.id)
      ].join(' ').toLowerCase();
      if (!searchIn.includes(text)) return false;
    }
    if (city && p.city !== city) return false;
    if (operation && p.type !== operation) return false;
    if (type && p.category !== type) return false;
    if (p.price < priceMin || p.price > priceMax) return false;
    if (bedsVal && p.bedrooms < parseInt(bedsVal)) return false;
    if (bathsVal && p.bathrooms < parseInt(bathsVal)) return false;
    if (p.m2 < m2Min || p.m2 > m2Max) return false;
    if (elevator && !p.elevator) return false;
    if (garage && !p.garage) return false;
    if (certVal && p.energyCert !== certVal) return false;
    return true;
  });

  currentPage = 1;
  renderResults();
  renderResultsHeader();
}

function clearFilters() {
  document.getElementById('search-text').value = '';
  document.getElementById('filter-city').value = '';
  document.getElementById('filter-type').value = '';
  document.getElementById('filter-operation').value = '';
  document.getElementById('filter-beds').value = '';
  document.getElementById('filter-baths').value = '';
  document.getElementById('filter-m2-min').value = '';
  document.getElementById('filter-m2-max').value = '';
  if (document.getElementById('filter-elevator')) document.getElementById('filter-elevator').checked = false;
  if (document.getElementById('filter-garage'))   document.getElementById('filter-garage').checked = false;
  document.getElementById('filter-cert').value = '';
  priceMin = 0; priceMax = 3000000;
  updatePriceSliders();
  applyFilters();
}

// ============================================================
// SORTING
// ============================================================
function sortProperties(arr) {
  const sortVal = document.getElementById('sort-select')?.value || 'relevance';
  const sorted = [...arr];
  switch (sortVal) {
    case 'price-asc':  sorted.sort((a,b) => a.price - b.price); break;
    case 'price-desc': sorted.sort((a,b) => b.price - a.price); break;
    case 'm2-asc':     sorted.sort((a,b) => a.m2 - b.m2); break;
    case 'm2-desc':    sorted.sort((a,b) => b.m2 - a.m2); break;
    case 'newest':     sorted.sort((a,b) => b.id - a.id); break;
    default: sorted.sort((a,b) => (b.featured?1:0) - (a.featured?1:0)); break;
  }
  return sorted;
}

function initSortSelect() {
  const sel = document.getElementById('sort-select');
  if (sel) sel.addEventListener('change', () => { currentPage = 1; renderResults(); });
}

// ============================================================
// RENDER
// ============================================================
function renderResultsHeader() {
  const count = document.getElementById('results-count');
  const total = document.getElementById('results-total');
  if (count) count.textContent = filteredProperties.length;
  if (total) total.textContent = allProperties.length;
}

function renderResults() {
  if (currentView === 'map') { renderMapView(); return; }
  const sorted = sortProperties(filteredProperties);
  const start = (currentPage - 1) * ITEMS_PER_PAGE;
  const pageItems = sorted.slice(start, start + ITEMS_PER_PAGE);
  const container = document.getElementById('results-container');
  if (!container) return;

  if (pageItems.length === 0) {
    container.innerHTML = `<div class="col-span-full text-center py-20">
      <p class="font-display text-3xl text-muted mb-3">${t('noResults')}</p>
      <button onclick="clearFilters()" class="btn btn-outline mt-4">${t('clearAndSearch')}</button>
    </div>`;
    document.getElementById('pagination')?.replaceChildren();
    return;
  }

  if (currentView === 'grid') {
    container.className = 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6';
    container.innerHTML = pageItems.map(p => renderPropertyCard(p)).join('');
  } else {
    container.className = 'flex flex-col gap-4';
    container.innerHTML = pageItems.map(p => renderPropertyListItem(p)).join('');
  }

  renderPagination(sorted.length);
}

function renderPropertyCard(p) {
  const isFav = isFavorite(p.id);
  const inCompare = compareList.includes(p.id);
  return `
    <article class="prop-card cursor-pointer" onclick="location.href='propiedad.html?id=${p.id}';addToHistory(${p.id})">
      <div class="prop-card-img">
        <img src="${p.photos[0]}" alt="${localText(p.title)}" loading="lazy" width="400" height="300">
        <div class="overlay"></div>
        <div class="absolute top-3 left-3 flex gap-2 flex-wrap">
          <span class="badge badge-${p.type}">${t(p.type)}</span>
          ${p.featured ? `<span class="badge badge-featured">${t('featured')}</span>` : ''}
        </div>
        <button class="fav-btn absolute top-3 right-3 ${isFav?'active':''}"
          data-fav-id="${p.id}"
          onclick="event.stopPropagation();toggleFavorite(${p.id})">${isFav?'♥':'♡'}</button>
        <div class="absolute bottom-3 left-3">
          <p class="text-white font-display text-xl font-medium" data-price-eur="${p.price}" data-price-rent="${p.type==='alquiler'}">${p.type==='alquiler' ? formatPriceRent(p.price) : formatPrice(p.price)}</p>
        </div>
      </div>
      <div class="p-5">
        <h3 class="font-display text-lg font-medium leading-snug mb-1 line-clamp-1">${localText(p.title)}</h3>
        <p class="text-muted text-sm mb-3 flex items-center gap-1 line-clamp-1">
          <svg class="w-3.5 h-3.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/></svg>
          ${localText(p.address)}
        </p>
        <div class="flex items-center gap-3 text-sm text-muted border-t border-border pt-3">
          ${p.bedrooms>0?`<span class="flex items-center gap-1">🛏 ${p.bedrooms}</span>`:''}
          ${p.bathrooms>0?`<span class="flex items-center gap-1">🚿 ${p.bathrooms}</span>`:''}
          <span class="flex items-center gap-1">📐 ${p.m2}m²</span>
          <button class="ml-auto text-xs px-2 py-1 rounded border ${inCompare?'bg-brand text-white border-brand':'border-border text-muted hover:border-brand hover:text-brand'} transition-colors"
            data-compare-id="${p.id}"
            onclick="event.stopPropagation();toggleCompare(${p.id})">${t('addToCompare')}</button>
        </div>
      </div>
    </article>`;
}

function renderPropertyListItem(p) {
  const isFav = isFavorite(p.id);
  return `
    <article class="prop-card cursor-pointer flex flex-col sm:flex-row" onclick="location.href='propiedad.html?id=${p.id}';addToHistory(${p.id})">
      <div class="relative overflow-hidden w-full sm:w-64 flex-shrink-0" style="min-height:180px;">
        <img src="${p.photos[0]}" alt="${localText(p.title)}" loading="lazy" width="400" height="300" class="w-full h-full object-cover absolute inset-0 transition-transform duration-500 hover:scale-105" style="aspect-ratio:4/3">
        <div class="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
        <div class="absolute top-3 left-3"><span class="badge badge-${p.type}">${t(p.type)}</span></div>
        <button class="fav-btn absolute top-3 right-3 ${isFav?'active':''}" data-fav-id="${p.id}" onclick="event.stopPropagation();toggleFavorite(${p.id})">${isFav?'♥':'♡'}</button>
      </div>
      <div class="flex-1 p-5 flex flex-col justify-between">
        <div>
          <div class="flex justify-between items-start gap-4 mb-2">
            <h3 class="font-display text-xl font-medium leading-snug">${localText(p.title)}</h3>
            <p class="font-display text-xl font-semibold text-brand flex-shrink-0" data-price-eur="${p.price}" data-price-rent="${p.type==='alquiler'}">${p.type==='alquiler' ? formatPriceRent(p.price) : formatPrice(p.price)}</p>
          </div>
          <p class="text-muted text-sm mb-3 flex items-center gap-1">
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/></svg>
            ${localText(p.address)}
          </p>
          <p class="text-muted text-sm line-clamp-2">${localText(p.description)}</p>
        </div>
        <div class="flex flex-wrap items-center gap-3 mt-4 pt-4 border-t border-border text-sm text-muted">
          ${p.bedrooms>0?`<span>🛏 ${p.bedrooms} hab.</span>`:''}
          ${p.bathrooms>0?`<span>🚿 ${p.bathrooms} baños</span>`:''}
          <span>📐 ${p.m2}m²</span>
          ${p.elevator?`<span>🛗 Ascensor</span>`:''}
          ${p.garage?`<span>🚗 Garaje</span>`:''}
          <span class="ml-auto text-xs font-bold text-brand">Cert. ${p.energyCert}</span>
          <button class="btn btn-brand btn-sm" onclick="event.stopPropagation();location.href='propiedad.html?id=${p.id}'">${t('viewDetails')}</button>
        </div>
      </div>
    </article>`;
}

// ============================================================
// PAGINATION
// ============================================================
function renderPagination(total) {
  const pages = Math.ceil(total / ITEMS_PER_PAGE);
  const container = document.getElementById('pagination');
  if (!container || pages <= 1) { if(container) container.innerHTML=''; return; }
  let html = '<div class="flex items-center gap-2 justify-center mt-10">';
  html += `<button onclick="goToPage(${currentPage-1})" ${currentPage===1?'disabled':''} class="btn btn-icon ${currentPage===1?'opacity-40':''}" aria-label="Anterior">←</button>`;
  for (let i=1; i<=pages; i++) {
    if (i===1 || i===pages || (i>=currentPage-2 && i<=currentPage+2)) {
      html += `<button onclick="goToPage(${i})" class="w-10 h-10 rounded flex items-center justify-center text-sm font-medium ${i===currentPage?'bg-brand text-white':'bg-white border border-border text-text hover:border-brand hover:text-brand'} transition-colors">${i}</button>`;
    } else if (i===currentPage-3 || i===currentPage+3) {
      html += `<span class="text-muted px-1">…</span>`;
    }
  }
  html += `<button onclick="goToPage(${currentPage+1})" ${currentPage===pages?'disabled':''} class="btn btn-icon ${currentPage===pages?'opacity-40':''}" aria-label="Siguiente">→</button>`;
  html += '</div>';
  container.innerHTML = html;
}

function goToPage(page) {
  const pages = Math.ceil(filteredProperties.length / ITEMS_PER_PAGE);
  if (page < 1 || page > pages) return;
  currentPage = page;
  renderResults();
  document.getElementById('results-container')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// ============================================================
// VIEW TOGGLE
// ============================================================
function initViewToggle() {
  ['grid','list','map'].forEach(v => {
    const btn = document.getElementById(`view-${v}`);
    if (btn) btn.addEventListener('click', () => setView(v));
  });
}

function setView(view) {
  currentView = view;
  ['grid','list','map'].forEach(v => {
    const btn = document.getElementById(`view-${v}`);
    if (btn) btn.classList.toggle('active', v === view);
  });
  const mapContainer = document.getElementById('map-view-container');
  const gridContainer = document.getElementById('results-container');
  if (mapContainer) mapContainer.style.display = view === 'map' ? '' : 'none';
  if (view === 'map') {
    initListingMap();
  }
  renderResults();
}

// ============================================================
// MAP VIEW
// ============================================================
function initListingMap() {
  if (map) { map.invalidateSize(); updateMapMarkers(); return; }
  map = L.map('listing-map').setView([40.4168, -3.7038], 6);
  L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
    attribution: '© OpenStreetMap © CARTO',
    subdomains: 'abcd', maxZoom: 19
  }).addTo(map);
  updateMapMarkers();

  // Draw area search
  const drawBtn = document.getElementById('draw-area-btn');
  if (drawBtn) {
    drawBtn.addEventListener('click', toggleDrawMode);
  }
}

function createPriceMarker(p) {
  const priceText = p.type === 'alquiler'
    ? formatPrice(p.price) + '/m'
    : formatPrice(p.price);
  return L.divIcon({
    className: '',
    html: `<div class="price-pin" onclick="location.href='propiedad.html?id=${p.id}'">${priceText}</div>`,
    iconSize: null,
    iconAnchor: [40, 15],
  });
}

function updateMapMarkers() {
  if (!map) return;
  mapMarkers.forEach(m => map.removeLayer(m));
  mapMarkers = [];
  filteredProperties.forEach(p => {
    if (!p.coords) return;
    const marker = L.marker(p.coords, { icon: createPriceMarker(p) });
    const popupHtml = `
      <div class="map-popup" onclick="location.href='propiedad.html?id=${p.id}'" style="cursor:pointer;">
        <img src="${p.photos[0]}" alt="${localText(p.title)}" loading="lazy" width="200" height="150" class="map-popup-img">
        <div class="map-popup-body">
          <p class="font-semibold text-sm text-text line-clamp-1" style="font-family:'Cormorant Garamond',serif;font-size:1rem;">${localText(p.title)}</p>
          <p class="text-muted text-xs mt-1">${localText(p.address)}</p>
          <p class="font-bold text-brand text-sm mt-2" data-price-eur="${p.price}" data-price-rent="${p.type==='alquiler'}">${p.type==='alquiler' ? formatPriceRent(p.price) : formatPrice(p.price)}</p>
          <div class="flex gap-3 text-xs text-muted mt-1">
            ${p.bedrooms?`<span>🛏 ${p.bedrooms}</span>`:''}
            <span>📐 ${p.m2}m²</span>
          </div>
        </div>
      </div>`;
    marker.bindPopup(popupHtml, { maxWidth: 220, className: 'custom-popup' });
    marker.addTo(map);
    mapMarkers.push(marker);
  });
  if (mapMarkers.length > 0) {
    const group = L.featureGroup(mapMarkers);
    map.fitBounds(group.getBounds().pad(0.1));
  }
}

function renderMapView() { updateMapMarkers(); }

function toggleDrawMode() {
  drawEnabled = !drawEnabled;
  const btn = document.getElementById('draw-area-btn');
  if (btn) {
    btn.textContent = drawEnabled ? '✕ Cancelar dibujo' : '🗺 Dibujar zona';
    btn.classList.toggle('active', drawEnabled);
  }
  if (!drawEnabled && drawnArea) { map.removeLayer(drawnArea); drawnArea = null; }
  map.getContainer().style.cursor = drawEnabled ? 'crosshair' : '';
}

// ============================================================
// SIDEBAR FILTERS
// ============================================================
function renderSidebarFilters() {
  // Price sliders
  updatePriceSliders();
  const priceMinEl = document.getElementById('price-range-min');
  const priceMaxEl = document.getElementById('price-range-max');
  if (priceMinEl && priceMaxEl) {
    priceMinEl.addEventListener('input', () => {
      priceMin = parseInt(priceMinEl.value);
      if (priceMin > priceMax) { priceMax = priceMin; priceMaxEl.value = priceMax; }
      updatePriceDisplay();
      applyFilters();
    });
    priceMaxEl.addEventListener('input', () => {
      priceMax = parseInt(priceMaxEl.value);
      if (priceMax < priceMin) { priceMin = priceMax; priceMinEl.value = priceMin; }
      updatePriceDisplay();
      applyFilters();
    });
  }

  // All other filters
  ['search-text','filter-city','filter-type','filter-operation','filter-beds','filter-baths','filter-m2-min','filter-m2-max','filter-cert'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.addEventListener('change', applyFilters);
    if (el && el.tagName === 'INPUT') el.addEventListener('input', applyFilters);
  });
  ['filter-elevator','filter-garage'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.addEventListener('change', applyFilters);
  });
}

function updatePriceSliders() {
  const minEl = document.getElementById('price-range-min');
  const maxEl = document.getElementById('price-range-max');
  if (minEl) minEl.value = priceMin;
  if (maxEl) maxEl.value = priceMax;
  updatePriceDisplay();
}

function updatePriceDisplay() {
  const minDisp = document.getElementById('price-min-display');
  const maxDisp = document.getElementById('price-max-display');
  if (minDisp) minDisp.textContent = formatPrice(priceMin);
  if (maxDisp) maxDisp.textContent = priceMax >= 3000000 ? '3M+' : formatPrice(priceMax);
}

// ============================================================
// SAVED SEARCHES
// ============================================================
function initSavedSearches() {
  const saveBtn = document.getElementById('save-search-btn');
  if (saveBtn) {
    saveBtn.addEventListener('click', () => {
      const name = prompt('Nombre para esta búsqueda:') || 'Búsqueda ' + (getSavedSearches().length + 1);
      const filters = {
        text: document.getElementById('search-text')?.value,
        city: document.getElementById('filter-city')?.value,
        priceMin, priceMax,
      };
      saveSearch(filters, name);
      renderSavedSearchList();
    });
  }
  renderSavedSearchList();
}

function renderSavedSearchList() {
  const list = document.getElementById('saved-searches-list');
  if (!list) return;
  const searches = getSavedSearches();
  if (!searches.length) { list.innerHTML = '<p class="text-muted text-xs">No hay búsquedas guardadas.</p>'; return; }
  list.innerHTML = searches.map(s => `
    <div class="flex items-center justify-between p-2 bg-bg rounded border border-border text-sm">
      <span class="truncate flex-1">${s.name}</span>
      <label class="ml-2 flex items-center gap-1 cursor-pointer">
        <input type="checkbox" ${s.alertsEnabled?'checked':''} onchange="toggleSearchAlert(${s.id})">
        <span class="text-xs text-muted">Alertas</span>
      </label>
    </div>`).join('');
}

function toggleSearchAlert(id) {
  const searches = JSON.parse(localStorage.getItem('ip_searches') || '[]');
  const idx = searches.findIndex(s => s.id === id);
  if (idx > -1) {
    searches[idx].alertsEnabled = !searches[idx].alertsEnabled;
    localStorage.setItem('ip_searches', JSON.stringify(searches));
    savedSearches = searches;
    showToast(searches[idx].alertsEnabled ? t('alertsEnabled') : 'Alertas desactivadas');
  }
}

// ============================================================
// COMPARATOR BAR
// ============================================================
function renderComparatorBar() {
  const bar = document.getElementById('comparator-bar');
  if (!bar) return;
  const items = document.getElementById('compare-items');
  if (!items) return;
  const compared = allProperties.filter(p => compareList.includes(p.id));
  items.innerHTML = compared.map(p => `
    <div class="flex items-center gap-2 bg-white/10 rounded px-3 py-1.5">
      <img src="${p.photos[0]}" alt="" width="32" height="32" class="w-8 h-8 rounded object-cover flex-shrink-0">
      <span class="text-white text-sm truncate max-w-[120px]">${localText(p.title)}</span>
      <button onclick="toggleCompare(${p.id})" class="text-white/60 hover:text-white text-lg ml-1">×</button>
    </div>`).join('');
  const compareBtn = document.getElementById('do-compare-btn');
  if (compareBtn) compareBtn.onclick = openComparator;
}

function openComparator() {
  if (compareList.length < 2) { showToast('Selecciona al menos 2 propiedades'); return; }
  const modal = document.getElementById('comparator-modal');
  if (!modal) return;
  const compared = allProperties.filter(p => compareList.includes(p.id));
  const rows = ['price','m2','bedrooms','bathrooms','floor','elevator','garage','energyCert','yearBuilt'];
  const labels = {
    price: t('price'), m2: 'Superficie (m²)', bedrooms: t('bedrooms'), bathrooms: t('bathrooms'),
    floor: t('floor'), elevator: t('elevator'), garage: t('garage'),
    energyCert: t('energyCert'), yearBuilt: t('yearBuilt')
  };
  const formatVal = (p,row) => {
    if (row === 'price') return formatPrice(p.price);
    if (row === 'elevator' || row === 'garage') return p[row] ? '✓' : '—';
    return p[row] || '—';
  };
  const tableHTML = `
    <div class="overflow-x-auto">
      <table class="w-full text-sm">
        <thead>
          <tr class="bg-bg">
            <th class="text-left p-4 font-medium text-muted w-36">Característica</th>
            ${compared.map(p => `<th class="p-4 text-center">
              <div><img src="${p.photos[0]}" alt="${localText(p.title)}" loading="lazy" width="400" height="112" class="w-full h-28 object-cover rounded mb-2"></div>
              <div class="font-display text-base">${localText(p.title)}</div>
              <div class="text-xs text-muted">${localText(p.address)}</div>
            </th>`).join('')}
          </tr>
        </thead>
        <tbody>
          ${rows.map((row,i) => `
            <tr class="${i%2===0?'bg-white':'bg-bg'}">
              <td class="p-4 font-medium text-muted">${labels[row]}</td>
              ${compared.map(p => `<td class="p-4 text-center font-medium">${formatVal(p,row)}</td>`).join('')}
            </tr>`).join('')}
        </tbody>
      </table>
    </div>`;
  document.getElementById('comparator-table').innerHTML = tableHTML;
  openModal('comparator-modal');
}

// ============================================================
// RECENTLY VIEWED
// ============================================================
function renderViewedHistory() {
  const container = document.getElementById('history-container');
  if (!container) return;
  if (!viewHistory.length) { container.style.display = 'none'; return; }
  const recent = allProperties.filter(p => viewHistory.includes(p.id)).slice(0,4);
  container.style.display = '';
  document.getElementById('history-list').innerHTML = recent.map(p => `
    <a href="propiedad.html?id=${p.id}" class="flex items-center gap-3 p-2 rounded hover:bg-bg border border-transparent hover:border-border transition-colors">
      <img src="${p.photos[0]}" alt="" width="48" height="48" class="w-12 h-12 rounded object-cover flex-shrink-0">
      <div class="min-w-0">
        <p class="text-sm font-medium text-text truncate">${localText(p.title)}</p>
        <p class="text-xs text-muted" data-price-eur="${p.price}" data-price-rent="${p.type==='alquiler'}">${p.type==='alquiler'?formatPriceRent(p.price):formatPrice(p.price)}</p>
      </div>
    </a>`).join('');
}

// Re-run filters if language changes
function onLanguageChange() {
  renderResults();
  updateCurrencyPrices();
}

document.addEventListener('DOMContentLoaded', initListing);
