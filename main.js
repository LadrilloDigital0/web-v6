/* === MAIN.JS — Shared functionality across all pages === */

// ============================================================
// i18n — Translations
// ============================================================
const translations = {
  es: {
    search: "Buscar", price: "Precio", bedrooms: "Habitaciones", bathrooms: "Baños",
    m2: "Superficie", type: "Tipo", venta: "Venta", alquiler: "Alquiler",
    featured: "Destacado", viewDetails: "Ver ficha", viewAll: "Ver todas",
    contact: "Contactar", schedule: "Agendar visita", save: "Guardar",
    cancel: "Cancelar", send: "Enviar", loading: "Cargando...",
    favorites: "Mis favoritos", myAccount: "Mi cuenta",
    login: "Iniciar sesión", logout: "Cerrar sesión", register: "Registrarse",
    email: "Email", password: "Contraseña", name: "Nombre", phone: "Teléfono",
    forgotPassword: "¿Olvidaste tu contraseña?", resetPassword: "Restablecer contraseña",
    noAccount: "¿No tienes cuenta?", hasAccount: "¿Ya tienes cuenta?",
    loginGoogle: "Continuar con Google", loginApple: "Continuar con Apple",
    sortBy: "Ordenar por", sortPrice: "Precio", sortDate: "Más recientes",
    sortSize: "Superficie", sortRelevance: "Relevancia",
    filterAdvanced: "Filtros avanzados", clearFilters: "Limpiar filtros",
    results: "resultados", showing: "Mostrando", of: "de",
    viewGrid: "Ver en cuadrícula", viewList: "Ver en lista", viewMap: "Ver en mapa",
    addToCompare: "Comparar", compare: "Comparar selección",
    saveSearch: "Guardar búsqueda", savedSearches: "Búsquedas guardadas",
    receiveAlerts: "Recibir alertas", alertsEnabled: "Alertas activadas",
    mortgage: "Calculadora hipoteca", monthlyPayment: "Cuota mensual",
    totalInterest: "Total intereses", totalPayment: "Total a pagar",
    downPayment: "Entrada", loanTerm: "Plazo (años)", interestRate: "Tipo de interés",
    energyCert: "Certificado energético", estimatedCons: "Consumo estimado",
    share: "Compartir", shareWhatsApp: "WhatsApp", shareEmail: "Email",
    copyLink: "Copiar enlace", linkCopied: "¡Enlace copiado!",
    downloadPDF: "Descargar PDF", virtualTour: "Tour virtual",
    floorPlan: "Plano del piso", nearbyPOI: "Puntos de interés",
    similarProps: "Propiedades similares",
    addedToFav: "Añadido a favoritos", removedFromFav: "Eliminado de favoritos",
    addedToCompare: "Añadido al comparador", compareMax: "Máximo 3 propiedades",
    chatHello: "¡Hola! Soy tu asistente virtual. ¿En qué puedo ayudarte hoy?",
    chatPlaceholder: "Escribe tu mensaje...", chatSend: "Enviar",
    currency: "Moneda", language: "Idioma",
    elevator: "Ascensor", garage: "Garaje", storage: "Trastero",
    yearBuilt: "Año construcción", floor: "Planta", totalFloors: "Plantas totales",
    priceHistory: "Evolución del precio", aiValuation: "Valoración IA",
    aiValuationDesc: "Estimación automática del precio según zona y características",
    estimate: "Calcular estimación",
    renoSimulator: "Simulador de reforma",
    visitHistory: "Vistos recientemente",
    noFavorites: "Aún no tienes favoritos",
    home: "Inicio", listings: "Propiedades", about: "Sobre nosotros",
    contact2: "Contacto", admin: "Administración",
    cookieNotice: "Usamos cookies para mejorar tu experiencia.",
    accept: "Aceptar", more: "Más información",
    allCities: "Todas las ciudades", allTypes: "Todos los tipos",
    noResults: "No se encontraron propiedades con los filtros seleccionados.",
    clearAndSearch: "Limpiar filtros",
    newsletter: "Suscríbete para recibir las mejores ofertas",
    subscribeBtn: "Suscribirse",
    footerTagline: "Tu hogar ideal, nuestra pasión.",
  },
  en: {
    search: "Search", price: "Price", bedrooms: "Bedrooms", bathrooms: "Bathrooms",
    m2: "Area", type: "Type", venta: "For Sale", alquiler: "For Rent",
    featured: "Featured", viewDetails: "View details", viewAll: "View all",
    contact: "Contact", schedule: "Schedule visit", save: "Save",
    cancel: "Cancel", send: "Send", loading: "Loading...",
    favorites: "My favorites", myAccount: "My account",
    login: "Sign in", logout: "Sign out", register: "Register",
    email: "Email", password: "Password", name: "Name", phone: "Phone",
    forgotPassword: "Forgot your password?", resetPassword: "Reset password",
    noAccount: "Don't have an account?", hasAccount: "Already have an account?",
    loginGoogle: "Continue with Google", loginApple: "Continue with Apple",
    sortBy: "Sort by", sortPrice: "Price", sortDate: "Most recent",
    sortSize: "Area", sortRelevance: "Relevance",
    filterAdvanced: "Advanced filters", clearFilters: "Clear filters",
    results: "results", showing: "Showing", of: "of",
    viewGrid: "Grid view", viewList: "List view", viewMap: "Map view",
    addToCompare: "Compare", compare: "Compare selection",
    saveSearch: "Save search", savedSearches: "Saved searches",
    receiveAlerts: "Receive alerts", alertsEnabled: "Alerts enabled",
    mortgage: "Mortgage calculator", monthlyPayment: "Monthly payment",
    totalInterest: "Total interest", totalPayment: "Total payment",
    downPayment: "Down payment", loanTerm: "Term (years)", interestRate: "Interest rate",
    energyCert: "Energy certificate", estimatedCons: "Estimated consumption",
    share: "Share", shareWhatsApp: "WhatsApp", shareEmail: "Email",
    copyLink: "Copy link", linkCopied: "Link copied!",
    downloadPDF: "Download PDF", virtualTour: "Virtual tour",
    floorPlan: "Floor plan", nearbyPOI: "Points of interest",
    similarProps: "Similar properties",
    addedToFav: "Added to favorites", removedFromFav: "Removed from favorites",
    addedToCompare: "Added to comparator", compareMax: "Maximum 3 properties",
    chatHello: "Hello! I'm your virtual assistant. How can I help you today?",
    chatPlaceholder: "Type your message...", chatSend: "Send",
    currency: "Currency", language: "Language",
    elevator: "Elevator", garage: "Parking", storage: "Storage",
    yearBuilt: "Year built", floor: "Floor", totalFloors: "Total floors",
    priceHistory: "Price history", aiValuation: "AI Valuation",
    aiValuationDesc: "Automatic price estimate based on location and features",
    estimate: "Get estimate",
    renoSimulator: "Renovation simulator",
    visitHistory: "Recently viewed",
    noFavorites: "No favorites yet",
    home: "Home", listings: "Properties", about: "About us",
    contact2: "Contact", admin: "Administration",
    cookieNotice: "We use cookies to improve your experience.",
    accept: "Accept", more: "More information",
    allCities: "All cities", allTypes: "All types",
    noResults: "No properties found with the selected filters.",
    clearAndSearch: "Clear filters",
    newsletter: "Subscribe to receive the best offers",
    subscribeBtn: "Subscribe",
    footerTagline: "Your ideal home, our passion.",
  },
  de: {
    search: "Suchen", price: "Preis", bedrooms: "Schlafzimmer", bathrooms: "Badezimmer",
    m2: "Fläche", type: "Typ", venta: "Zum Verkauf", alquiler: "Zur Miete",
    featured: "Empfohlen", viewDetails: "Details", viewAll: "Alle anzeigen",
    contact: "Kontakt", schedule: "Besichtigung", save: "Speichern",
    cancel: "Abbrechen", send: "Senden", loading: "Laden...",
    favorites: "Meine Favoriten", myAccount: "Mein Konto",
    login: "Anmelden", logout: "Abmelden", register: "Registrieren",
    email: "E-Mail", password: "Passwort", name: "Name", phone: "Telefon",
    forgotPassword: "Passwort vergessen?", resetPassword: "Passwort zurücksetzen",
    noAccount: "Noch kein Konto?", hasAccount: "Schon ein Konto?",
    loginGoogle: "Mit Google fortfahren", loginApple: "Mit Apple fortfahren",
    sortBy: "Sortieren nach", sortPrice: "Preis", sortDate: "Neueste",
    sortSize: "Fläche", sortRelevance: "Relevanz",
    filterAdvanced: "Erweiterte Filter", clearFilters: "Filter löschen",
    results: "Ergebnisse", showing: "Zeige", of: "von",
    viewGrid: "Rasteransicht", viewList: "Listenansicht", viewMap: "Kartenansicht",
    addToCompare: "Vergleichen", compare: "Auswahl vergleichen",
    saveSearch: "Suche speichern", savedSearches: "Gespeicherte Suchen",
    receiveAlerts: "Benachrichtigungen", alertsEnabled: "Benachrichtigungen aktiv",
    mortgage: "Hypothekenrechner", monthlyPayment: "Monatliche Rate",
    totalInterest: "Gesamtzinsen", totalPayment: "Gesamtzahlung",
    downPayment: "Anzahlung", loanTerm: "Laufzeit (Jahre)", interestRate: "Zinssatz",
    energyCert: "Energieausweis", estimatedCons: "Geschätzter Verbrauch",
    share: "Teilen", shareWhatsApp: "WhatsApp", shareEmail: "E-Mail",
    copyLink: "Link kopieren", linkCopied: "Link kopiert!",
    downloadPDF: "PDF herunterladen", virtualTour: "Virtuelle Tour",
    floorPlan: "Grundriss", nearbyPOI: "Points of Interest",
    similarProps: "Ähnliche Immobilien",
    addedToFav: "Zu Favoriten hinzugefügt", removedFromFav: "Aus Favoriten entfernt",
    addedToCompare: "Zum Vergleich hinzugefügt", compareMax: "Maximal 3 Immobilien",
    chatHello: "Hallo! Ich bin Ihr virtueller Assistent. Wie kann ich helfen?",
    chatPlaceholder: "Nachricht eingeben...", chatSend: "Senden",
    currency: "Währung", language: "Sprache",
    elevator: "Aufzug", garage: "Garage", storage: "Abstellraum",
    yearBuilt: "Baujahr", floor: "Etage", totalFloors: "Gesamtetagen",
    priceHistory: "Preisentwicklung", aiValuation: "KI-Bewertung",
    aiValuationDesc: "Automatische Preisschätzung basierend auf Lage und Ausstattung",
    estimate: "Schätzen",
    renoSimulator: "Renovierungssimulator",
    visitHistory: "Zuletzt angesehen",
    noFavorites: "Noch keine Favoriten",
    home: "Startseite", listings: "Immobilien", about: "Über uns",
    contact2: "Kontakt", admin: "Verwaltung",
    cookieNotice: "Wir verwenden Cookies, um Ihre Erfahrung zu verbessern.",
    accept: "Akzeptieren", more: "Mehr Informationen",
    allCities: "Alle Städte", allTypes: "Alle Typen",
    noResults: "Keine Immobilien gefunden.",
    clearAndSearch: "Filter löschen",
    newsletter: "Abonnieren Sie für die besten Angebote",
    subscribeBtn: "Abonnieren",
    footerTagline: "Ihr ideales Zuhause, unsere Leidenschaft.",
  },
  fr: {
    search: "Chercher", price: "Prix", bedrooms: "Chambres", bathrooms: "Salles de bain",
    m2: "Surface", type: "Type", venta: "À vendre", alquiler: "À louer",
    featured: "En vedette", viewDetails: "Voir la fiche", viewAll: "Voir tout",
    contact: "Contacter", schedule: "Planifier visite", save: "Sauvegarder",
    cancel: "Annuler", send: "Envoyer", loading: "Chargement...",
    favorites: "Mes favoris", myAccount: "Mon compte",
    login: "Se connecter", logout: "Se déconnecter", register: "S'inscrire",
    email: "Email", password: "Mot de passe", name: "Nom", phone: "Téléphone",
    forgotPassword: "Mot de passe oublié?", resetPassword: "Réinitialiser",
    noAccount: "Pas encore de compte?", hasAccount: "Déjà un compte?",
    loginGoogle: "Continuer avec Google", loginApple: "Continuer avec Apple",
    sortBy: "Trier par", sortPrice: "Prix", sortDate: "Plus récents",
    sortSize: "Surface", sortRelevance: "Pertinence",
    filterAdvanced: "Filtres avancés", clearFilters: "Effacer filtres",
    results: "résultats", showing: "Affichage", of: "de",
    viewGrid: "Vue grille", viewList: "Vue liste", viewMap: "Vue carte",
    addToCompare: "Comparer", compare: "Comparer sélection",
    saveSearch: "Sauver recherche", savedSearches: "Recherches sauvegardées",
    receiveAlerts: "Recevoir alertes", alertsEnabled: "Alertes activées",
    mortgage: "Calculateur hypothèque", monthlyPayment: "Mensualité",
    totalInterest: "Total intérêts", totalPayment: "Total à payer",
    downPayment: "Apport", loanTerm: "Durée (ans)", interestRate: "Taux d'intérêt",
    energyCert: "Certificat énergétique", estimatedCons: "Consommation estimée",
    share: "Partager", shareWhatsApp: "WhatsApp", shareEmail: "Email",
    copyLink: "Copier lien", linkCopied: "Lien copié!",
    downloadPDF: "Télécharger PDF", virtualTour: "Visite virtuelle",
    floorPlan: "Plan du logement", nearbyPOI: "Points d'intérêt",
    similarProps: "Biens similaires",
    addedToFav: "Ajouté aux favoris", removedFromFav: "Supprimé des favoris",
    addedToCompare: "Ajouté au comparateur", compareMax: "Maximum 3 biens",
    chatHello: "Bonjour! Je suis votre assistant virtuel. Comment puis-je vous aider?",
    chatPlaceholder: "Tapez votre message...", chatSend: "Envoyer",
    currency: "Devise", language: "Langue",
    elevator: "Ascenseur", garage: "Garage", storage: "Débarras",
    yearBuilt: "Année construction", floor: "Étage", totalFloors: "Étages totaux",
    priceHistory: "Évolution du prix", aiValuation: "Estimation IA",
    aiValuationDesc: "Estimation automatique du prix selon zone et caractéristiques",
    estimate: "Calculer",
    renoSimulator: "Simulateur de rénovation",
    visitHistory: "Vus récemment",
    noFavorites: "Pas encore de favoris",
    home: "Accueil", listings: "Biens", about: "À propos",
    contact2: "Contact", admin: "Administration",
    cookieNotice: "Nous utilisons des cookies pour améliorer votre expérience.",
    accept: "Accepter", more: "Plus d'informations",
    allCities: "Toutes les villes", allTypes: "Tous les types",
    noResults: "Aucun bien trouvé avec les filtres sélectionnés.",
    clearAndSearch: "Effacer les filtres",
    newsletter: "Abonnez-vous pour recevoir les meilleures offres",
    subscribeBtn: "S'abonner",
    footerTagline: "Votre maison idéale, notre passion.",
  },
};

let currentLang = localStorage.getItem('ip_lang') || 'es';

function t(key) {
  return (translations[currentLang] && translations[currentLang][key]) || translations['es'][key] || key;
}

function setLanguage(lang) {
  if (!translations[lang]) return;
  currentLang = lang;
  localStorage.setItem('ip_lang', lang);
  applyTranslations();
  updateLangSelector();
  if (typeof onLanguageChange === 'function') onLanguageChange(lang);
}

function applyTranslations() {
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    el.textContent = t(key);
  });
  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    el.placeholder = t(el.getAttribute('data-i18n-placeholder'));
  });
  document.querySelectorAll('[data-i18n-title]').forEach(el => {
    el.title = t(el.getAttribute('data-i18n-title'));
  });
  document.documentElement.lang = currentLang;
}

function updateLangSelector() {
  document.querySelectorAll('.lang-option').forEach(el => {
    el.classList.toggle('active', el.dataset.lang === currentLang);
  });
}

function localText(obj) {
  if (!obj || typeof obj === 'string') return obj || '';
  return obj[currentLang] || obj['es'] || Object.values(obj)[0] || '';
}

// ============================================================
// Currency Converter
// ============================================================
const exchangeRates = {
  EUR: 1,
  USD: 1.08,
  GBP: 0.86,
  CHF: 0.97,
  RUB: 99.50,
};

const currencySymbols = {
  EUR: '€', USD: '$', GBP: '£', CHF: 'CHF ', RUB: '₽',
};

const currencyLocales = {
  EUR: 'es-ES', USD: 'en-US', GBP: 'en-GB', CHF: 'de-CH', RUB: 'ru-RU',
};

let currentCurrency = localStorage.getItem('ip_currency') || 'EUR';

function convertPrice(priceEUR, currency) {
  currency = currency || currentCurrency;
  return Math.round(priceEUR * exchangeRates[currency]);
}

function formatPrice(priceEUR, currency) {
  currency = currency || currentCurrency;
  const converted = convertPrice(priceEUR, currency);
  const locale = currencyLocales[currency] || 'es-ES';
  try {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(converted);
  } catch {
    return currencySymbols[currency] + converted.toLocaleString();
  }
}

function formatPriceRent(priceEUR) {
  return formatPrice(priceEUR) + '/mes';
}

function setCurrency(currency) {
  if (!exchangeRates[currency]) return;
  currentCurrency = currency;
  localStorage.setItem('ip_currency', currency);
  updateCurrencyPrices();
  updateCurrencySelector();
}

function updateCurrencyPrices() {
  document.querySelectorAll('[data-price-eur]').forEach(el => {
    const eur = parseFloat(el.dataset.priceEur);
    const isRent = el.dataset.priceRent === 'true';
    if (!isNaN(eur)) {
      el.textContent = isRent ? formatPriceRent(eur) : formatPrice(eur);
    }
  });
}

function updateCurrencySelector() {
  document.querySelectorAll('.currency-option').forEach(el => {
    el.classList.toggle('active', el.dataset.currency === currentCurrency);
  });
}

// ============================================================
// Favorites
// ============================================================
let favorites = JSON.parse(localStorage.getItem('ip_favorites') || '[]');

function toggleFavorite(propertyId) {
  propertyId = parseInt(propertyId);
  const idx = favorites.indexOf(propertyId);
  if (idx > -1) {
    favorites.splice(idx, 1);
    showToast(t('removedFromFav'));
  } else {
    favorites.push(propertyId);
    showToast(t('addedToFav'));
  }
  localStorage.setItem('ip_favorites', JSON.stringify(favorites));
  updateFavoriteButtons();
}

function isFavorite(propertyId) {
  return favorites.includes(parseInt(propertyId));
}

function updateFavoriteButtons() {
  document.querySelectorAll('[data-fav-id]').forEach(btn => {
    const id = parseInt(btn.dataset.favId);
    btn.classList.toggle('active', favorites.includes(id));
    btn.innerHTML = favorites.includes(id) ? '♥' : '♡';
    btn.setAttribute('aria-label', favorites.includes(id) ? t('removedFromFav') : t('addedToFav'));
  });
  const countEl = document.getElementById('fav-header-count');
  if (countEl) countEl.textContent = favorites.length > 0 ? favorites.length : '';
}

// ============================================================
// View History
// ============================================================
let viewHistory = JSON.parse(localStorage.getItem('ip_history') || '[]');

function addToHistory(propertyId) {
  propertyId = parseInt(propertyId);
  viewHistory = viewHistory.filter(id => id !== propertyId);
  viewHistory.unshift(propertyId);
  if (viewHistory.length > 12) viewHistory = viewHistory.slice(0, 12);
  localStorage.setItem('ip_history', JSON.stringify(viewHistory));
}

// ============================================================
// Saved Searches
// ============================================================
let savedSearches = JSON.parse(localStorage.getItem('ip_searches') || '[]');

function saveSearch(filters, name) {
  const search = {
    id: Date.now(),
    name: name || 'Búsqueda ' + (savedSearches.length + 1),
    filters: filters,
    alertsEnabled: false,
    date: new Date().toISOString(),
  };
  savedSearches.push(search);
  localStorage.setItem('ip_searches', JSON.stringify(savedSearches));
  showToast(t('saveSearch') + ' ✓');
  return search;
}

function getSavedSearches() {
  return savedSearches;
}

// ============================================================
// Auth
// ============================================================
let currentUser = JSON.parse(localStorage.getItem('ip_user') || 'null');

function isLoggedIn() { return !!currentUser; }

function login(email, password) {
  // Mock login — in production would call API
  if (email && password.length >= 6) {
    currentUser = { email, name: email.split('@')[0], avatar: null };
    localStorage.setItem('ip_user', JSON.stringify(currentUser));
    updateAuthUI();
    closeModal('auth-modal');
    showToast('¡Bienvenido, ' + currentUser.name + '!');
    return true;
  }
  return false;
}

function register(name, email, password) {
  if (name && email && password.length >= 6) {
    currentUser = { email, name, avatar: null };
    localStorage.setItem('ip_user', JSON.stringify(currentUser));
    updateAuthUI();
    closeModal('auth-modal');
    showToast('¡Cuenta creada con éxito!');
    return true;
  }
  return false;
}

function logout() {
  currentUser = null;
  localStorage.removeItem('ip_user');
  updateAuthUI();
}

function updateAuthUI() {
  const loginBtn = document.getElementById('login-btn');
  const userMenu = document.getElementById('user-menu');
  const userNameEl = document.getElementById('user-name');
  if (loginBtn) loginBtn.style.display = currentUser ? 'none' : '';
  if (userMenu) userMenu.style.display = currentUser ? '' : 'none';
  if (userNameEl && currentUser) userNameEl.textContent = currentUser.name;
}

// ============================================================
// Toast Notifications
// ============================================================
function showToast(message, duration) {
  duration = duration || 3000;
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    container.className = 'toast-container';
    document.body.appendChild(container);
  }
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.textContent = message;
  container.appendChild(toast);
  requestAnimationFrame(() => {
    toast.classList.add('show');
  });
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 400);
  }, duration);
}

// ============================================================
// Modal System
// ============================================================
function openModal(id) {
  const modal = document.getElementById(id);
  if (modal) {
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
}

function closeModal(id) {
  const modal = document.getElementById(id);
  if (modal) {
    modal.classList.remove('open');
    document.body.style.overflow = '';
  }
}

// Close modals on overlay click
document.addEventListener('click', (e) => {
  if (e.target.classList.contains('modal-overlay')) {
    e.target.classList.remove('open');
    document.body.style.overflow = '';
  }
});

// ============================================================
// Header Scroll Behavior
// ============================================================
function initHeader(mode) {
  // mode: 'transparent' (hero pages) | 'light' (inner pages)
  const header = document.getElementById('main-header');
  if (!header) return;
  if (mode === 'light') {
    header.classList.add('light');
    return;
  }
  header.classList.add('transparent');
  const onScroll = () => {
    if (window.scrollY > 60) {
      header.classList.remove('transparent');
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
      header.classList.add('transparent');
    }
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

// ============================================================
// Mobile Menu
// ============================================================
function initMobileMenu() {
  const toggle = document.getElementById('mobile-menu-toggle');
  const menu = document.getElementById('mobile-menu');
  if (!toggle || !menu) return;
  toggle.addEventListener('click', () => {
    const isHidden = menu.style.display === 'none' || menu.style.display === '';
    if (isHidden) {
      menu.style.display = 'block';
      requestAnimationFrame(() => { menu.style.opacity = '1'; });
      document.body.style.overflow = 'hidden';
      toggle.setAttribute('aria-expanded', 'true');
    } else {
      menu.style.opacity = '0';
      setTimeout(() => { menu.style.display = 'none'; }, 300);
      document.body.style.overflow = '';
      toggle.setAttribute('aria-expanded', 'false');
    }
  });
}

// ============================================================
// Chat Widget
// ============================================================
const chatResponses = {
  es: [
    "¡Claro! Estaré encantado de ayudarte. ¿Qué tipo de propiedad buscas?",
    "Tenemos una excelente selección de propiedades en esa zona. ¿Cuál es tu presupuesto aproximado?",
    "Nuestro equipo de asesores puede preparar una visita para esta semana. ¿Qué días te vienen mejor?",
    "Te puedo enviar más información por email. ¿Cuál es tu dirección?",
    "Puedo conectarte directamente con uno de nuestros asesores especializados.",
  ],
  en: [
    "Of course! I'd be happy to help. What type of property are you looking for?",
    "We have an excellent selection of properties in that area. What's your approximate budget?",
    "Our team of advisors can arrange a visit this week. Which days work best for you?",
    "I can send you more information by email. What's your address?",
    "I can connect you directly with one of our specialist advisors.",
  ],
};

function initChat() {
  const toggle = document.getElementById('chat-toggle');
  const panel = document.getElementById('chat-panel');
  const input = document.getElementById('chat-input-field');
  const sendBtn = document.getElementById('chat-send');
  const messages = document.getElementById('chat-messages');
  if (!toggle || !panel) return;

  toggle.addEventListener('click', () => {
    panel.classList.toggle('open');
  });

  function addMessage(text, type) {
    const msg = document.createElement('div');
    msg.className = `chat-msg ${type}`;
    msg.textContent = text;
    messages.appendChild(msg);
    messages.scrollTop = messages.scrollHeight;
  }

  function sendMessage() {
    const text = input.value.trim();
    if (!text) return;
    addMessage(text, 'user');
    input.value = '';
    setTimeout(() => {
      const responses = chatResponses[currentLang] || chatResponses['es'];
      const reply = responses[Math.floor(Math.random() * responses.length)];
      addMessage(reply, 'bot');
    }, 800 + Math.random() * 600);
  }

  if (sendBtn) sendBtn.addEventListener('click', sendMessage);
  if (input) input.addEventListener('keypress', (e) => { if (e.key === 'Enter') sendMessage(); });
}

// ============================================================
// Scroll Reveal
// ============================================================
function initScrollReveal() {
  const elements = document.querySelectorAll('.reveal');
  if (!elements.length) return;
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px 80px 0px' });
  elements.forEach(el => observer.observe(el));
}

// ============================================================
// PWA — Service Worker Registration
// ============================================================
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch(() => {});
  });
}

// ============================================================
// Cookie Notice
// ============================================================
function initCookieNotice() {
  if (localStorage.getItem('ip_cookies_accepted')) return;
  const notice = document.getElementById('cookie-notice');
  if (!notice) return;
  notice.classList.remove('cookie-hidden');
  const acceptBtn = notice.querySelector('#cookie-accept');
  if (acceptBtn) {
    acceptBtn.addEventListener('click', () => {
      localStorage.setItem('ip_cookies_accepted', '1');
      notice.classList.add('cookie-hidden');
    });
  }
}

// ============================================================
// Language + Currency Selectors
// ============================================================
function initSelectors() {
  // Language
  document.querySelectorAll('.lang-option').forEach(btn => {
    btn.addEventListener('click', () => setLanguage(btn.dataset.lang));
  });
  // Currency
  document.querySelectorAll('.currency-option').forEach(btn => {
    btn.addEventListener('click', () => setCurrency(btn.dataset.currency));
  });
  updateLangSelector();
  updateCurrencySelector();
}

// ============================================================
// Auth Modal
// ============================================================
function initAuthModal() {
  const loginBtn = document.getElementById('login-btn');
  if (loginBtn) loginBtn.addEventListener('click', () => openModal('auth-modal'));

  const loginForm = document.getElementById('login-form');
  if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = loginForm.querySelector('[name="email"]').value;
      const pass  = loginForm.querySelector('[name="password"]').value;
      if (!login(email, pass)) {
        showToast('Email o contraseña incorrectos');
      }
    });
  }

  const registerForm = document.getElementById('register-form');
  if (registerForm) {
    registerForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name  = registerForm.querySelector('[name="name"]').value;
      const email = registerForm.querySelector('[name="email"]').value;
      const pass  = registerForm.querySelector('[name="password"]').value;
      if (!register(name, email, pass)) {
        showToast('Por favor completa todos los campos');
      }
    });
  }

  // Tab switching
  document.querySelectorAll('[data-auth-tab]').forEach(btn => {
    btn.addEventListener('click', () => {
      const tab = btn.dataset.authTab;
      document.querySelectorAll('.auth-tab-content').forEach(el => {
        el.style.display = el.dataset.tab === tab ? '' : 'none';
      });
      document.querySelectorAll('[data-auth-tab]').forEach(b => {
        b.classList.toggle('active', b.dataset.authTab === tab);
      });
    });
  });

  const logoutBtn = document.getElementById('logout-btn');
  if (logoutBtn) logoutBtn.addEventListener('click', () => { logout(); showToast('Sesión cerrada'); });

  updateAuthUI();
}

// ============================================================
// Utility: Format numbers by locale
// ============================================================
function formatNumber(n, decimals) {
  const locale = { es: 'es-ES', en: 'en-US', de: 'de-DE', fr: 'fr-FR' }[currentLang] || 'es-ES';
  return n.toLocaleString(locale, { maximumFractionDigits: decimals || 0 });
}

function formatDate(dateStr) {
  const locale = { es: 'es-ES', en: 'en-US', de: 'de-DE', fr: 'fr-FR' }[currentLang] || 'es-ES';
  return new Date(dateStr).toLocaleDateString(locale, { year: 'numeric', month: 'long', day: 'numeric' });
}

// ============================================================
// AI Valuation (Mock)
// ============================================================
function calculateAIValuation(m2, bedrooms, city, type) {
  const basePrices = {
    'Madrid': 4200, 'Barcelona': 3900, 'Marbella': 5500,
    'Valencia': 2100, 'Sevilla': 1900, 'Bilbao': 2800,
  };
  const base = basePrices[city] || 2500;
  const pricePerM2 = base + (bedrooms * 150) + (Math.random() * 400 - 200);
  const estimated = Math.round(m2 * pricePerM2);
  const margin = Math.round(estimated * 0.08);
  return {
    estimated,
    min: estimated - margin,
    max: estimated + margin,
    pricePerM2: Math.round(pricePerM2),
  };
}

// ============================================================
// Mortgage Calculator
// ============================================================
function calculateMortgage(principal, downPaymentPct, years, interestRate) {
  const loan = principal * (1 - downPaymentPct / 100);
  const monthlyRate = interestRate / 100 / 12;
  const months = years * 12;
  if (monthlyRate === 0) {
    const monthly = loan / months;
    return { monthly, total: loan, interest: 0 };
  }
  const monthly = loan * (monthlyRate * Math.pow(1 + monthlyRate, months)) / (Math.pow(1 + monthlyRate, months) - 1);
  const total = monthly * months;
  const interest = total - loan;
  return { monthly: Math.round(monthly), total: Math.round(total), interest: Math.round(interest) };
}

// ============================================================
// Comparator (shared state)
// ============================================================
let compareList = JSON.parse(sessionStorage.getItem('ip_compare') || '[]');

function toggleCompare(propertyId) {
  propertyId = parseInt(propertyId);
  const idx = compareList.indexOf(propertyId);
  if (idx > -1) {
    compareList.splice(idx, 1);
  } else {
    if (compareList.length >= 3) { showToast(t('compareMax')); return; }
    compareList.push(propertyId);
    showToast(t('addedToCompare'));
  }
  sessionStorage.setItem('ip_compare', JSON.stringify(compareList));
  updateComparatorUI();
}

function updateComparatorUI() {
  const bar = document.getElementById('comparator-bar');
  const count = document.getElementById('compare-count');
  if (bar) bar.classList.toggle('visible', compareList.length > 0);
  if (count) count.textContent = compareList.length;
  document.querySelectorAll('[data-compare-id]').forEach(btn => {
    const id = parseInt(btn.dataset.compareId);
    btn.classList.toggle('active', compareList.includes(id));
  });
}

// ============================================================
// INIT
// ============================================================
document.addEventListener('DOMContentLoaded', () => {
  applyTranslations();
  updateCurrencyPrices();
  updateFavoriteButtons();
  updateComparatorUI();
  initSelectors();
  initMobileMenu();
  initScrollReveal();
  initChat();
  initCookieNotice();
  initAuthModal();
});
