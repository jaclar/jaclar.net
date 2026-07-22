// Introduction markdown text parsed for typewriter effect
const introParagraphs = [
  "Hi, I am <strong>Lars</strong>!",

  "I am a software engineer and an (aspiring) adventurer. Back, before life’s inherent entropy took over, I also studied theoretical physics. But now I am forced to deal with the harsh realities of the physical world, because last year I started an extended sailing trip. I left Buenos Aires on my 36-foot ketch, <em>Samurai</em>, and I am currently in the Caribbean. Sometimes I have crew, but for half of the way so far, I've been single-handing. Thanks to Starlink, I can keep working as a freelance consultant from my boat, which is mostly how I finance this life. When I’m not sailing my boat (or, let’s be honest, fixing it), I enjoy hiking, climbing, ski mountaineering, kayaking, kite surfing and free diving.",

  "Why this website? Well, as always in life—and probably exaggerated in technology—trends move like a pendulum. After the heyday of the open web in the early 2000s and 2010s, social media took over, and all content creation and distribution got centralized on a few platforms. I’m not pretending I can reverse that trend, but at least for myself, I’d like to reclaim a bit of digital self-sufficiency. Hence, this site. It's basically a place to publish whatever I feel like right now: web apps, blog posts (an actual Log Book?), photos… who knows. And now, with AI and modern hosting infrastructure, doing this is easier than ever before.",

  "Or maybe this is just a spur-of-the-moment thing, and I’ll abandon it like so many other projects and ideas.",

  "<span class=\"meta-date\">July 21, 2026 — Woburn Bay, Grenada, West Indies</span>"
];

// Typewriter Engine
let isTypingFinished = false;
let currentTimeout = null;

function initTypewriter() {
  const container = document.getElementById('typing-container');
  const skipBtn = document.getElementById('skip-typing-btn');
  const cursor = document.getElementById('cursor');
  const terminalBody = document.querySelector('.terminal-body');

  if (!container) return;

  // Fast forward handler
  skipBtn.addEventListener('click', () => {
    if (isTypingFinished) return;
    if (currentTimeout) clearTimeout(currentTimeout);
    
    container.innerHTML = introParagraphs.map(p => `<p>${p}</p>`).join('');
    isTypingFinished = true;
    skipBtn.style.display = 'none';
    if (cursor) cursor.style.display = 'none';
    if (terminalBody) terminalBody.scrollTop = terminalBody.scrollHeight;
  });

  // Convert html paragraphs into printable character tokens (preserving HTML tags)
  let paragraphIndex = 0;
  
  function typeParagraph() {
    if (paragraphIndex >= introParagraphs.length) {
      isTypingFinished = true;
      if (skipBtn) skipBtn.style.display = 'none';
      if (cursor) cursor.style.display = 'none';
      return;
    }

    const pElement = document.createElement('p');
    container.appendChild(pElement);

    const fullHtml = introParagraphs[paragraphIndex];
    let charIndex = 0;
    
    function typeChar() {
      if (isTypingFinished) return;

      if (charIndex < fullHtml.length) {
        // If we hit an HTML tag start, type the entire tag at once so formatting doesn't break mid-type
        if (fullHtml[charIndex] === '<') {
          const tagEndIndex = fullHtml.indexOf('>', charIndex);
          if (tagEndIndex !== -1) {
            charIndex = tagEndIndex + 1;
          } else {
            charIndex++;
          }
        } else {
          charIndex++;
        }

        pElement.innerHTML = fullHtml.substring(0, charIndex);
        if (terminalBody) terminalBody.scrollTop = terminalBody.scrollHeight;
        
        // Fast typing speed (2-6ms per character) for snappy animation
        const speed = Math.floor(Math.random() * 5) + 2;
        currentTimeout = setTimeout(typeChar, speed);
      } else {
        paragraphIndex++;
        currentTimeout = setTimeout(typeParagraph, 150); // Snappy pause between paragraphs
      }
    }

    typeChar();
  }

  // Start typing quickly after initial load
  setTimeout(typeParagraph, 150);
}

// Non-interactive Leaflet Journey Map Initialization
function initMap() {
  const mapElement = document.getElementById('map');
  if (!mapElement || !window.L) return;

  // Initialize Map with all interactive controls disabled
  const map = window.L.map('map', {
    zoomControl: false,
    dragging: false,
    scrollWheelZoom: false,
    doubleClickZoom: false,
    boxZoom: false,
    keyboard: false,
    touchZoom: false,
    attributionControl: true
  }).setView([-20, -50], 4);

  // CartoDB Dark Matter tile layer
  window.L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>',
    subdomains: 'abcd',
    maxZoom: 19
  }).addTo(map);

  // Load and render GPX Route from travellog
  if (window.L.GPX) {
    new window.L.GPX('/samurai.gpx', {
      async: true,
      marker_options: {
        startIconUrl: '',
        endIconUrl: '',
        shadowUrl: ''
      },
      polyline_options: {
        color: '#10b981', // Emerald green
        opacity: 0.9,
        weight: 3.5,
        lineCap: 'round',
        lineJoin: 'round',
        className: 'gpx-route-glow'
      }
    }).on('loaded', function(e) {
      const gpxLayer = e.target;
      map.fitBounds(gpxLayer.getBounds(), { padding: [50, 50] });

      // Add a custom pulsing current location marker at Grenada / end point
      const customMarkerIcon = window.L.divIcon({
        className: 'custom-map-pin',
        html: `
          <div style="
            width: 16px;
            height: 16px;
            background: #10b981;
            border: 3px solid #ffffff;
            border-radius: 50%;
            box-shadow: 0 0 15px #10b981, 0 0 30px #10b981;
          "></div>
        `,
        iconSize: [16, 16],
        iconAnchor: [8, 8]
      });

      window.L.marker([12.01, -61.74], { icon: customMarkerIcon }).addTo(map);

    }).addTo(map);
  }

  // Click on any part of the map panel navigates to the Travel Log
  const mapPanel = document.getElementById('map-click-target');
  if (mapPanel) {
    mapPanel.addEventListener('click', () => {
      window.open('https://travellog.jaclar.net', '_blank');
    });
  }
}

// Hamburger Navigation Menu Controller
function initMenu() {
  const toggleBtn = document.getElementById('menu-toggle-btn');
  const closeBtn = document.getElementById('menu-close-btn');
  const overlay = document.getElementById('nav-overlay');
  const backdrop = document.getElementById('nav-backdrop');

  function openMenu() {
    if (overlay) overlay.classList.add('active');
  }

  function closeMenu() {
    if (overlay) overlay.classList.remove('active');
  }

  if (toggleBtn) toggleBtn.addEventListener('click', openMenu);
  if (closeBtn) closeBtn.addEventListener('click', closeMenu);
  if (backdrop) backdrop.addEventListener('click', closeMenu);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeMenu();
  });
}

// Dom Content Loaded Entry Point
document.addEventListener('DOMContentLoaded', () => {
  initTypewriter();
  initMap();
  initMenu();
});
