/* === PROPIEDAD.JS — Property detail page logic === */

let property = null;
let propMap = null;
let mainSwiper = null;
let thumbSwiper = null;
let priceChart = null;

// ============================================================
// INIT
// ============================================================
function initPropertyPage() {
  const params = new URLSearchParams(window.location.search);
  const id = parseInt(params.get('id')) || 1;
  property = (typeof properties !== 'undefined') ? properties.find(p => p.id === id) : null;
  if (!property) { document.body.innerHTML += '<div class="text-center py-40"><h1 class="font-display text-3xl">Propiedad no encontrada</h1><a href="listado.html" class="btn btn-brand mt-6">Volver al listado</a></div>'; return; }
  addToHistory(property.id);
  renderPropertyDetail();
  injectPropertySchema(property);
  initGallery();
  initPropertyMap();
  initMortgageCalculator();
  initShareButtons();
  initScheduleVisit();
  initRenoSimulator();
  renderPriceChart();
  renderSimilarProperties();
  renderPOIs();
  renderEnergyLabel();
  updateFavBtn();
}

// ============================================================
// RENDER DETAIL
// ============================================================
function renderPropertyDetail() {
  // Title
  const titleEl = document.getElementById('prop-title');
  if (titleEl) titleEl.textContent = localText(property.title);
  // Address
  const addrEl = document.getElementById('prop-address');
  if (addrEl) addrEl.textContent = localText(property.address);
  // Price
  document.querySelectorAll('.prop-price').forEach(el => {
    el.setAttribute('data-price-eur', property.price);
    el.setAttribute('data-price-rent', property.type === 'alquiler');
    el.textContent = property.type === 'alquiler' ? formatPriceRent(property.price) : formatPrice(property.price);
  });
  // Description
  const descEl = document.getElementById('prop-description');
  if (descEl) descEl.textContent = localText(property.description);
  // Badges
  const typeEl = document.getElementById('prop-type-badge');
  if (typeEl) { typeEl.textContent = t(property.type); typeEl.className = `badge badge-${property.type}`; }
  const certEl = document.getElementById('prop-cert-badge');
  if (certEl) certEl.textContent = `Cert. ${property.energyCert}`;
  // Features table
  renderFeaturesTable();
  // Floor plan
  const fpEl = document.getElementById('prop-floor-plan');
  if (fpEl && property.floorPlan) {
    fpEl.src = property.floorPlan;
    fpEl.alt = t('floorPlan');
  }
  // Video
  const videoEl = document.getElementById('virtual-tour-frame');
  if (videoEl && property.videoUrl) {
    videoEl.src = property.videoUrl;
  } else {
    const tourSection = document.getElementById('virtual-tour-section');
    if (tourSection && !property.videoUrl) tourSection.style.display = 'none';
  }
  // Visits badge
  const visitsEl = document.getElementById('prop-visits');
  if (visitsEl && property.visits) visitsEl.textContent = property.visits + ' visitas';
  // Page title + dynamic OG tags
  const propTitle = localText(property.title) + ' — Inmobiliaria Prueba';
  document.title = propTitle;
  const ogTitle = document.querySelector('meta[property="og:title"]');
  const ogDesc  = document.querySelector('meta[property="og:description"]');
  const twTitle = document.querySelector('meta[name="twitter:title"]');
  const twDesc  = document.querySelector('meta[name="twitter:description"]');
  const desc    = localText(property.description).slice(0, 160);
  if (ogTitle) ogTitle.content = propTitle;
  if (ogDesc)  ogDesc.content  = desc;
  if (twTitle) twTitle.content = propTitle;
  if (twDesc)  twDesc.content  = desc;
  if (property.images && property.images[0]) {
    const ogImg = document.querySelector('meta[property="og:image"]');
    const twImg = document.querySelector('meta[name="twitter:image"]');
    if (ogImg) ogImg.content = property.images[0];
    if (twImg) twImg.content = property.images[0];
  }
}

function injectPropertySchema(prop) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'RealEstateListing',
    'name': localText(prop.title),
    'description': localText(prop.description).slice(0, 300),
    'url': window.location.href,
    'price': prop.price,
    'priceCurrency': 'EUR',
    'image': prop.images || [],
    'address': {
      '@type': 'PostalAddress',
      'streetAddress': localText(prop.address),
      'addressCountry': 'ES'
    },
    'numberOfRooms': prop.bedrooms,
    'floorSize': {
      '@type': 'QuantitativeValue',
      'value': prop.m2,
      'unitCode': 'MTK'
    }
  };
  const script = document.createElement('script');
  script.type = 'application/ld+json';
  script.textContent = JSON.stringify(schema);
  document.head.appendChild(script);
}

function renderFeaturesTable() {
  const table = document.getElementById('prop-features');
  if (!table) return;
  const agent = typeof agents !== 'undefined' ? agents.find(a => a.id === property.agent) : null;
  const features = [
    { label: t('m2'), value: property.m2 + ' m²' },
    { label: t('bedrooms'), value: property.bedrooms || '—' },
    { label: t('bathrooms'), value: property.bathrooms || '—' },
    { label: t('floor'), value: property.floor !== undefined ? (property.floor === 0 ? 'Baja' : property.floor + 'ª') : '—' },
    { label: t('totalFloors'), value: property.totalFloors || '—' },
    { label: t('elevator'), value: property.elevator ? '✓ Sí' : '✗ No' },
    { label: t('garage'), value: property.garage ? `✓ ${property.garage === true ? 'Sí' : property.garage + ' plazas'}` : '✗ No' },
    { label: t('storage'), value: property.storage ? '✓ Sí' : '✗ No' },
    { label: t('yearBuilt'), value: property.yearBuilt || '—' },
    { label: t('energyCert'), value: 'Clase ' + property.energyCert },
    ...(property.m2Terrace ? [{ label: 'Terraza', value: property.m2Terrace + ' m²' }] : []),
    ...(property.m2Garden  ? [{ label: 'Jardín',  value: property.m2Garden  + ' m²' }] : []),
  ];
  table.innerHTML = features.map(f => `
    <div class="flex justify-between py-3 border-b border-border text-sm">
      <span class="text-muted">${f.label}</span>
      <span class="font-medium">${f.value}</span>
    </div>`).join('');

  // Render agent
  if (agent) {
    const agentEl = document.getElementById('agent-card');
    if (agentEl) {
      agentEl.innerHTML = `
        <div class="flex items-center gap-4 mb-4">
          <img src="${agent.photo}" alt="${agent.name}" loading="lazy" width="56" height="56" class="w-14 h-14 rounded-full object-cover border-2 border-accent">
          <div>
            <p class="font-semibold text-base">${agent.name}</p>
            <p class="text-muted text-sm">${localText(agent.role)}</p>
          </div>
        </div>
        <p class="text-muted text-sm mb-4">${localText(agent.bio)}</p>
        <a href="tel:${agent.phone}" class="btn btn-outline w-full justify-center mb-2">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/></svg>
          ${agent.phone}
        </a>
        <a href="mailto:${agent.email}" class="text-center block text-sm text-muted hover:text-brand">${agent.email}</a>`;
    }
  }
}

// ============================================================
// GALLERY
// ============================================================
function initGallery() {
  if (!property.photos.length) return;
  // Populate slides
  const mainWrapper = document.getElementById('swiper-wrapper-main');
  const thumbWrapper = document.getElementById('swiper-wrapper-thumb');
  if (mainWrapper) {
    mainWrapper.innerHTML = property.photos.map((url,i) => `
      <div class="swiper-slide">
        <div class="relative" style="height:520px;">
          <img src="${url}" alt="${localText(property.title)} - Foto ${i+1}" loading="${i === 0 ? 'eager' : 'lazy'}" width="1200" height="520" class="w-full h-full object-cover cursor-zoom-in" onclick="openLightbox(${i})">
          <div class="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent pointer-events-none"></div>
        </div>
      </div>`).join('');
  }
  if (thumbWrapper) {
    thumbWrapper.innerHTML = property.photos.map((url,i) => `
      <div class="swiper-slide">
        <img src="${url}" alt="Thumb ${i+1}" loading="lazy" width="160" height="64" class="w-full h-16 object-cover rounded">
      </div>`).join('');
  }
  // Counter
  const counter = document.getElementById('photo-counter');
  if (counter) counter.textContent = `1 / ${property.photos.length}`;

  // Init Swiper (if available)
  if (typeof Swiper !== 'undefined') {
    thumbSwiper = new Swiper('.thumb-strip', {
      spaceBetween: 8,
      slidesPerView: 5,
      freeMode: true,
      watchSlidesProgress: true,
    });
    mainSwiper = new Swiper('.gallery-main', {
      spaceBetween: 0,
      navigation: { nextEl: '.swiper-button-next', prevEl: '.swiper-button-prev' },
      pagination: { el: '.swiper-pagination', clickable: true },
      thumbs: { swiper: thumbSwiper },
      on: {
        slideChange: function() {
          if (counter) counter.textContent = `${this.activeIndex + 1} / ${property.photos.length}`;
        }
      }
    });
  }
}

// Lightbox
let lightboxIndex = 0;
function openLightbox(index) {
  lightboxIndex = index;
  const lb = document.getElementById('lightbox');
  if (!lb) return;
  updateLightboxImg();
  lb.classList.add('open');
}
function updateLightboxImg() {
  const img = document.getElementById('lightbox-img');
  if (img && property.photos[lightboxIndex]) {
    img.src = property.photos[lightboxIndex];
  }
  const cnt = document.getElementById('lightbox-counter');
  if (cnt) cnt.textContent = `${lightboxIndex + 1} / ${property.photos.length}`;
}
function closeLightbox() {
  const lb = document.getElementById('lightbox');
  if (lb) lb.classList.remove('open');
}
function lightboxNav(dir) {
  lightboxIndex = (lightboxIndex + dir + property.photos.length) % property.photos.length;
  updateLightboxImg();
}

// ============================================================
// MAP
// ============================================================
function initPropertyMap() {
  const mapEl = document.getElementById('prop-map');
  if (!mapEl || !property.coords) return;
  propMap = L.map('prop-map').setView(property.coords, 15);
  L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
    attribution: '© OpenStreetMap © CARTO', maxZoom: 19
  }).addTo(propMap);

  const markerIcon = L.divIcon({
    className: '',
    html: `<div style="
      width:40px;height:40px;
      background:var(--brand);
      border:3px solid var(--accent);
      border-radius:50% 50% 50% 0;
      transform:rotate(-45deg);
      box-shadow:0 4px 12px rgba(0,0,0,0.3);
      display:flex;align-items:center;justify-content:center;
    "><div style="transform:rotate(45deg);color:var(--accent);font-size:1.1rem;">🏠</div></div>`,
    iconSize: [40, 40], iconAnchor: [20, 40],
  });
  L.marker(property.coords, { icon: markerIcon }).addTo(propMap)
    .bindPopup(`<strong>${localText(property.title)}</strong><br><span style="color:var(--brand);font-weight:700">${formatPrice(property.price)}</span>`);

  // Add POI markers
  if (property.poi) {
    property.poi.forEach(poi => {
      const poiIcons = { metro: '🚇', school: '🏫', shopping: '🛍', park: '🌳' };
      const poiIcon = L.divIcon({
        className: '',
        html: `<div style="background:#fff;border:2px solid var(--border);border-radius:50%;width:32px;height:32px;display:flex;align-items:center;justify-content:center;font-size:1rem;box-shadow:0 2px 8px rgba(0,0,0,0.15);">${poiIcons[poi.type]||'📍'}</div>`,
        iconSize: [32, 32], iconAnchor: [16, 16],
      });
      L.marker(poi.coords, { icon: poiIcon }).addTo(propMap)
        .bindPopup(`<strong>${localText(poi.name)}</strong><br><span class="text-muted">${poi.distance}</span>`);
    });
  }
}

// ============================================================
// POIs
// ============================================================
function renderPOIs() {
  const container = document.getElementById('poi-list');
  if (!container || !property.poi) return;
  const typeColors = { metro: 'poi-metro', school: 'poi-school', shopping: 'poi-shopping', park: 'poi-park' };
  const typeIcons  = { metro: '🚇', school: '🏫', shopping: '🛍', park: '🌳' };
  container.innerHTML = property.poi.map(poi => `
    <div class="poi-item">
      <div class="poi-icon ${typeColors[poi.type]||'poi-park'}">${typeIcons[poi.type]||'📍'}</div>
      <div class="flex-1">
        <p class="text-sm font-medium">${localText(poi.name)}</p>
        <p class="text-xs text-muted">${poi.distance}</p>
      </div>
    </div>`).join('');
}

// ============================================================
// ENERGY LABEL
// ============================================================
function renderEnergyLabel() {
  const container = document.getElementById('energy-label');
  if (!container) return;
  const grades = ['A','B','C','D','E','F','G'];
  container.innerHTML = `
    <div class="energy-cert-scale">
      ${grades.map(g => `
        <div class="energy-cert-bar ec-${g} ${g===property.energyCert?'active':''}">
          <span>${g}</span>
        </div>`).join('')}
    </div>
    <p class="text-xs text-muted mt-3 text-center">Clase energética <strong>${property.energyCert}</strong></p>`;
}

// ============================================================
// MORTGAGE CALCULATOR
// ============================================================
function updateSliderFill(slider) {
  const min = parseFloat(slider.min);
  const max = parseFloat(slider.max);
  const pct = ((parseFloat(slider.value) - min) / (max - min)) * 100;
  slider.style.background = `linear-gradient(to right, var(--brand) ${pct}%, var(--border) ${pct}%)`;
}

function initMortgageCalculator() {
  const priceInput  = document.getElementById('mort-price');
  const downInput   = document.getElementById('mort-down');
  const yearsInput  = document.getElementById('mort-years');
  const rateInput   = document.getElementById('mort-rate');
  const downDisp    = document.getElementById('mort-down-val');
  const yearsDisp   = document.getElementById('mort-years-val');
  const rateDisp    = document.getElementById('mort-rate-val');
  if (!priceInput) return;
  priceInput.value = property.price;

  function updateCalc() {
    const price = parseFloat(priceInput.value) || property.price;
    const down  = parseFloat(downInput.value)  || 20;
    const years = parseFloat(yearsInput.value) || 25;
    const rate  = parseFloat(rateInput.value)  || 3.5;
    if (downDisp)  downDisp.textContent  = down + '%';
    if (yearsDisp) yearsDisp.textContent = years + ' años';
    if (rateDisp)  rateDisp.textContent  = rate.toFixed(1) + '%';
    if (downInput)  updateSliderFill(downInput);
    if (yearsInput) updateSliderFill(yearsInput);
    if (rateInput)  updateSliderFill(rateInput);
    const result = calculateMortgage(price, down, years, rate);
    const monthly = document.getElementById('mort-monthly');
    const interest= document.getElementById('mort-interest');
    const loanAmt = document.getElementById('mort-loan');
    if (monthly)  monthly.textContent  = formatPrice(result.monthly) + '/mes';
    if (interest) interest.textContent = formatPrice(result.interest);
    if (loanAmt)  loanAmt.textContent  = formatPrice(price * (1 - down/100));
  }

  [priceInput, downInput, yearsInput, rateInput].forEach(el => {
    if (el) el.addEventListener('input', updateCalc);
  });
  updateCalc();
}

// ============================================================
// SHARE
// ============================================================
function initShareButtons() {
  const url = encodeURIComponent(window.location.href);
  const title = encodeURIComponent(localText(property.title));
  const waBtn = document.getElementById('share-wa');
  const emlBtn = document.getElementById('share-email');
  const cpyBtn = document.getElementById('share-copy');
  if (waBtn) waBtn.href = `https://wa.me/?text=${title}%20${url}`;
  if (emlBtn) emlBtn.href = `mailto:?subject=${title}&body=${url}`;
  if (cpyBtn) cpyBtn.addEventListener('click', () => {
    navigator.clipboard.writeText(window.location.href).then(() => {
      showToast(t('linkCopied'));
      cpyBtn.textContent = '✓';
      setTimeout(() => { cpyBtn.textContent = t('copyLink'); }, 2000);
    });
  });
}

// PDF Download
function downloadPDF() {
  window.print();
}

// ============================================================
// SCHEDULE VISIT
// ============================================================
function initScheduleVisit() {
  const btn = document.getElementById('schedule-btn');
  if (btn) btn.addEventListener('click', () => openModal('schedule-modal'));
  const form = document.getElementById('schedule-form');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const date = form.querySelector('[name="date"]').value;
      const time = form.querySelector('[name="time"]').value;
      closeModal('schedule-modal');
      showToast(`Visita agendada para el ${formatDate(date)} a las ${time}`);
    });
  }
}

// ============================================================
// RENOVATION SIMULATOR
// ============================================================
function initRenoSimulator() {
  const container = document.getElementById('reno-container');
  if (!container) return;
  const beforeImg = property.photos[0];
  const afterImg  = property.photos[Math.min(1, property.photos.length-1)];
  container.innerHTML = `
    <div class="reno-slider-container" id="reno-slider" style="height:280px;">
      <div class="reno-after w-full h-full">
        <img src="${afterImg}" alt="Después" class="w-full h-full object-cover">
      </div>
      <div class="reno-before" id="reno-before-el">
        <img src="${beforeImg}" alt="Antes" class="w-full h-full object-cover">
      </div>
      <div class="reno-divider" id="reno-divider" style="left:50%;">
        <div class="reno-divider-handle">◀▶</div>
      </div>
      <div class="absolute top-3 left-3 bg-black/50 text-white text-xs px-2 py-1 rounded">Antes</div>
      <div class="absolute top-3 right-3 bg-brand/80 text-white text-xs px-2 py-1 rounded">Después</div>
    </div>
    <p class="text-xs text-muted text-center mt-2">Arrastra el divisor para comparar</p>`;
  initRenoSliderDrag();
}

function initRenoSliderDrag() {
  const slider = document.getElementById('reno-slider');
  const divider = document.getElementById('reno-divider');
  const before = document.getElementById('reno-before-el');
  if (!slider || !divider || !before) return;
  let dragging = false;
  const onMove = (e) => {
    if (!dragging) return;
    const rect = slider.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const pct = Math.max(0, Math.min(100, (clientX - rect.left) / rect.width * 100));
    divider.style.left = pct + '%';
    before.style.width = pct + '%';
  };
  divider.addEventListener('mousedown', () => { dragging = true; });
  divider.addEventListener('touchstart', () => { dragging = true; }, { passive: true });
  document.addEventListener('mouseup', () => { dragging = false; });
  document.addEventListener('touchend', () => { dragging = false; });
  document.addEventListener('mousemove', onMove);
  document.addEventListener('touchmove', onMove, { passive: true });
}

// ============================================================
// PRICE HISTORY CHART
// ============================================================
function renderPriceChart() {
  const canvas = document.getElementById('price-chart');
  if (!canvas || !property.priceHistory) return;
  const labels = property.priceHistory.map((_, i) => {
    const d = new Date(); d.setMonth(d.getMonth() - (property.priceHistory.length - 1 - i) * 3);
    return d.toLocaleDateString('es-ES', { month: 'short', year: '2-digit' });
  });
  if (priceChart) priceChart.destroy();
  priceChart = new Chart(canvas, {
    type: 'line',
    data: {
      labels,
      datasets: [{
        label: t('priceHistory'),
        data: property.priceHistory,
        borderColor: '#1C3A2F',
        backgroundColor: 'rgba(28,58,47,0.08)',
        borderWidth: 2,
        pointBackgroundColor: '#C9A96E',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        pointRadius: 5,
        fill: true,
        tension: 0.3,
      }]
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: { label: ctx => formatPrice(ctx.raw) }
        }
      },
      scales: {
        y: {
          ticks: { callback: val => formatPrice(val), font: { size: 11 } },
          grid: { color: 'rgba(0,0,0,0.05)' }
        },
        x: { grid: { display: false } }
      }
    }
  });
}

// ============================================================
// SIMILAR PROPERTIES
// ============================================================
function renderSimilarProperties() {
  const container = document.getElementById('similar-props');
  if (!container || typeof properties === 'undefined') return;
  const similar = properties
    .filter(p => p.id !== property.id && p.type === property.type)
    .sort((a,b) => Math.abs(a.price - property.price) - Math.abs(b.price - property.price))
    .slice(0, 3);
  container.innerHTML = similar.map(p => `
    <article class="prop-card cursor-pointer" onclick="location.href='propiedad.html?id=${p.id}';addToHistory(${p.id})">
      <div class="prop-card-img">
        <img src="${p.photos[0]}" alt="${localText(p.title)}" loading="lazy" width="400" height="300">
        <div class="overlay"></div>
        <span class="badge badge-${p.type} absolute top-3 left-3">${t(p.type)}</span>
      </div>
      <div class="p-4">
        <h4 class="font-display text-base font-medium line-clamp-1 mb-1">${localText(p.title)}</h4>
        <p class="text-muted text-xs mb-2 line-clamp-1">${localText(p.address)}</p>
        <p class="font-semibold text-brand" data-price-eur="${p.price}" data-price-rent="${p.type==='alquiler'}">${p.type==='alquiler'?formatPriceRent(p.price):formatPrice(p.price)}</p>
        <div class="flex gap-3 text-xs text-muted mt-2">
          ${p.bedrooms?`<span>🛏 ${p.bedrooms}</span>`:''}
          <span>📐 ${p.m2}m²</span>
        </div>
      </div>
    </article>`).join('');
}

// ============================================================
// FAVORITE BUTTON
// ============================================================
function updateFavBtn() {
  const btn = document.getElementById('prop-fav-btn');
  if (!btn) return;
  const fav = isFavorite(property.id);
  btn.classList.toggle('active', fav);
  btn.innerHTML = fav
    ? `<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg> Favorito`
    : `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/></svg> Guardar`;
}

document.addEventListener('DOMContentLoaded', initPropertyPage);
