'use strict';

// ── Nav scroll shadow ──────────────────────────────
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 10);

// ── LIVE ANALYSIS ANIMATION ──────────────────────────────
const analysisMessages = [
  { type: 'info', text: '🔍 Initializing Bob AI Analysis Engine...', delay: 500 },
  { type: 'success', text: '✓ Connected to codebase', delay: 800 },
  { type: 'info', text: '📂 Scanning project structure...', delay: 1200 },
  { type: 'output', text: '   Found: 27 Java files, 9 test files, 1 pom.xml', delay: 1600 },
  { type: 'info', text: '🔎 Analyzing dependencies...', delay: 2000 },
  { type: 'warning', text: '⚠️  Detected: Spring Boot 1.5.4 (EOL 2019)', delay: 2400 },
  { type: 'warning', text: '⚠️  Detected: Java 8 (deprecated)', delay: 2600 },
  { type: 'info', text: '🧬 Scanning for javax.* imports...', delay: 3000 },
  { type: 'error', text: '❌ Found 23 deprecated javax.* imports', delay: 3400 },
  { type: 'info', text: '📅 Analyzing Date API usage...', delay: 3800 },
  { type: 'error', text: '❌ Found 8 java.util.Date instances', delay: 4200 },
  { type: 'info', text: '🔧 Calculating migration complexity...', delay: 4600 },
  { type: 'output', text: '   Estimated manual effort: 45 hours', delay: 5000 },
  { type: 'output', text: '   Estimated cost: $4,500', delay: 5200 },
  { type: 'info', text: '🤖 Generating automated migration plan...', delay: 5600 },
  { type: 'success', text: '✓ Migration plan ready!', delay: 6000 },
  { type: 'success', text: '✓ 95% automation possible', delay: 6300 },
  { type: 'success', text: '✓ Zero data loss guaranteed', delay: 6500 },
  { type: 'info', text: '⚡ Bob can complete this in 3 minutes', delay: 6900 },
  { type: 'success', text: '🎉 Analysis complete! Ready to modernize.', delay: 7300 }
];

let analysisRunning = false;

function startAnalysis() {
  if (analysisRunning) return;
  analysisRunning = true;
  
  const terminalOutput = document.getElementById('terminal-output');
  const filesScanned = document.getElementById('files-scanned');
  const issuesFound = document.getElementById('issues-found');
  const autoFixes = document.getElementById('auto-fixes');
  const startBtn = document.getElementById('start-analysis');
  const btnText = document.getElementById('analysis-btn-text');
  
  // Reset
  terminalOutput.innerHTML = `
    <div class="terminal-line">
      <span class="terminal-prompt">bob@ai-engine:~$</span>
      <span class="terminal-cmd">analyze-codebase --project=petclinic</span>
    </div>
  `;
  filesScanned.textContent = '0';
  issuesFound.textContent = '0';
  autoFixes.textContent = '0';
  
  btnText.textContent = '⏳ Analyzing...';
  startBtn.disabled = true;
  
  let messageIndex = 0;
  let fileCount = 0;
  let issueCount = 0;
  let fixCount = 0;
  
  function showNextMessage() {
    if (messageIndex >= analysisMessages.length) {
      btnText.textContent = '✓ Analysis Complete';
      startBtn.disabled = false;
      setTimeout(() => {
        btnText.textContent = '🔄 Run Again';
        analysisRunning = false;
      }, 2000);
      return;
    }
    
    const msg = analysisMessages[messageIndex];
    const line = document.createElement('div');
    line.className = `terminal-line terminal-${msg.type}`;
    line.textContent = msg.text;
    terminalOutput.appendChild(line);
    terminalOutput.scrollTop = terminalOutput.scrollHeight;
    
    // Update stats
    if (messageIndex < 10) fileCount = Math.min(fileCount + 3, 33);
    if (messageIndex >= 7 && messageIndex < 12) issueCount = Math.min(issueCount + 3, 23);
    if (messageIndex >= 14) fixCount = Math.min(fixCount + 3, 31);
    
    filesScanned.textContent = fileCount;
    issuesFound.textContent = issueCount;
    autoFixes.textContent = fixCount;
    
    messageIndex++;
    setTimeout(showNextMessage, msg.delay);
  }
  
  setTimeout(showNextMessage, 300);
}

// Attach event listener when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  const startBtn = document.getElementById('start-analysis');
  if (startBtn) {
    startBtn.addEventListener('click', startAnalysis);
  }
});
}, { passive: true });

// ── Mobile menu ────────────────────────────────────
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');
hamburger.addEventListener('click', () => {
  const open = mobileMenu.classList.toggle('open');
  hamburger.classList.toggle('open', open);
  hamburger.setAttribute('aria-expanded', String(open));
  mobileMenu.setAttribute('aria-hidden', String(!open));
});
document.querySelectorAll('.mm-link').forEach(link => {
  link.addEventListener('click', () => {
    mobileMenu.classList.remove('open');
    hamburger.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
    mobileMenu.setAttribute('aria-hidden', 'true');
  });
});

// ── Easing ────────────────────────────────────────
const easeOutQuart = t => 1 - Math.pow(1 - t, 4);

// ── Scroll progress bar ────────────────────────────
const progressBar = document.createElement('div');
progressBar.id = 'scroll-progress';
document.body.appendChild(progressBar);
window.addEventListener('scroll', () => {
  const total = document.documentElement.scrollHeight - window.innerHeight;
  progressBar.style.width = total > 0 ? `${(window.scrollY / total) * 100}%` : '0%';
}, { passive: true });

// ── Counter animation ──────────────────────────────
function animateCounter(el, target, duration = 1800) {
  const start = performance.now();
  function tick(now) {
    const p = Math.min((now - start) / duration, 1);
    el.textContent = Math.round(easeOutQuart(p) * target);
    if (p < 1) {
      requestAnimationFrame(tick);
    } else {
      el.textContent = target;
      el.classList.add('stat-pop');
      el.addEventListener('animationend', () => el.classList.remove('stat-pop'), { once: true });
    }
  }
  requestAnimationFrame(tick);
}

// ── Slot-machine counter (stats strip) ────────────
function slotCounter(el, target, duration = 1800) {
  // FIX: guard zero — just animate straight up from 0
  if (target === 0) {
    el.textContent = '0';
    el.classList.add('stat-pop');
    el.addEventListener('animationend', () => el.classList.remove('stat-pop'), { once: true });
    return;
  }
  const chars = '0123456789';
  const start = performance.now();
  function tick(now) {
    const p = Math.min((now - start) / duration, 1);
    if (p < 0.65) {
      el.textContent = chars[Math.floor(Math.random() * 10)];
    } else {
      el.textContent = Math.round(easeOutQuart((p - 0.65) / 0.35) * target);
    }
    if (p < 1) {
      requestAnimationFrame(tick);
    } else {
      el.textContent = target;
      el.classList.add('stat-pop');
      el.addEventListener('animationend', () => el.classList.remove('stat-pop'), { once: true });
    }
  }
  requestAnimationFrame(tick);
}

// ── Scroll reveal ──────────────────────────────────
const revealObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      revealObs.unobserve(e.target);
    }
  });
}, { threshold: 0.08, rootMargin: '0px 0px -32px 0px' });
document.querySelectorAll('.reveal').forEach(el => revealObs.observe(el));

// ── Stats strip slot counters ──────────────────────
const statsStrip = document.getElementById('stats-strip');
const statsObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (!e.isIntersecting) return;
    document.querySelectorAll('#stats-strip .stat-num').forEach(el => {
      slotCounter(el, parseInt(el.dataset.target, 10));
    });
    statsObs.disconnect();
  });
}, { threshold: 0.4 });
if (statsStrip) statsObs.observe(statsStrip);

// ── Results metrics counters + SVG rings ──────────
// Store real target offsets keyed by stroke color so we don't read the
// already-reset attribute. circumference=213.628, offset = C*(1-pct/100)
const ringTargets = { '#0071e3': 213.628 * 0.05,   // 95% → 5% empty
                      '#30d158': 213.628 * 0.20,    // 80%
                      '#bf5af2': 0 };               // 100%

const metricsObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (!e.isIntersecting) return;
    // counters
    document.querySelectorAll('#results-metrics .metric-num').forEach(el => {
      animateCounter(el, parseInt(el.dataset.target, 10));
    });
    // FIX: use pre-computed target offsets, not the attribute value
    document.querySelectorAll('#results-metrics .metric-ring svg circle:last-child').forEach(circle => {
      const color = circle.getAttribute('stroke');
      const finalOffset = ringTargets[color] ?? 0;
      // ensure we start from full-empty
      circle.style.transition = 'none';
      circle.style.strokeDashoffset = '213.628';
      // double rAF so the browser paints the reset before transitioning
      requestAnimationFrame(() => requestAnimationFrame(() => {
        circle.style.transition = 'stroke-dashoffset 1.6s cubic-bezier(0.23,1,0.32,1) 0.2s';
        circle.style.strokeDashoffset = String(finalOffset);
      }));
    });
    metricsObs.disconnect();
  });
}, { threshold: 0.25 });
const resultsMetrics = document.getElementById('results-metrics');
if (resultsMetrics) metricsObs.observe(resultsMetrics);

// ── Code window tabs ───────────────────────────────
// FIX: clear inline styles on outgoing pane so CSS transition fires cleanly
function switchPane(pane) {
  document.querySelectorAll('.cw-pane').forEach(p => {
    p.classList.remove('active');
    p.style.transition = 'opacity 0.35s ease, transform 0.35s ease';
    p.style.opacity    = '0';
    p.style.transform  = 'translateY(8px)';
  });
  document.querySelectorAll('.cw-tab').forEach(t => t.classList.remove('active'));

  const tab  = document.querySelector(`.cw-tab[data-pane="${pane}"]`);
  const paneEl = document.getElementById('pane-' + pane);
  if (tab) tab.classList.add('active');
  if (paneEl) {
    paneEl.classList.add('active');
    // small delay so the fade-out starts first
    setTimeout(() => {
      paneEl.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
      paneEl.style.opacity    = '1';
      paneEl.style.transform  = 'translateY(0)';
    }, 60);
  }
}

document.querySelectorAll('.cw-tab').forEach(tab => {
  tab.addEventListener('click', () => switchPane(tab.dataset.pane));
});

// init first pane
const firstPane = document.getElementById('pane-before');
if (firstPane) { firstPane.style.opacity = '1'; firstPane.style.transform = 'translateY(0)'; }

let codeIdx = 0;
setInterval(() => {
  codeIdx = (codeIdx + 1) % 2;
  switchPane(codeIdx === 0 ? 'before' : 'after');
}, 4200);

// ── Orb parallax (FIX: additive offset, don't overwrite CSS animation) ──
// We store a base translate and add mouse offset on top via CSS variable
const orbs = document.querySelectorAll('.orb');
const orbDepths = [28, 18, 22, 14, 32, 16];
let mouseX = 0, mouseY = 0, smoothX = 0, smoothY = 0;

window.addEventListener('mousemove', e => {
  mouseX = (e.clientX / window.innerWidth  - 0.5) * 2;
  mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
}, { passive: true });

// Use CSS custom properties so the CSS animation still runs via transform
// We apply the parallax offset as a separate wrapper translate
orbs.forEach((orb, i) => {
  orb.style.willChange = 'transform';
  // wrap each orb in a div that handles the parallax translate
  const wrapper = document.createElement('div');
  wrapper.className = 'orb-wrapper';
  wrapper.style.cssText = 'position:absolute;inset:0;pointer-events:none;';
  orb.parentNode.insertBefore(wrapper, orb);
  wrapper.appendChild(orb);
  // reset orb positioning to fill wrapper
  orb.style.position = 'relative';
  orb.style.top = 'auto'; orb.style.left = 'auto';
  orb.style.right = 'auto'; orb.style.bottom = 'auto';
});

// Re-position wrappers to match original orb positions
const orbPositions = [
  { top:'-120px', left:'-100px' },
  { top:'30%',    right:'-80px' },
  { bottom:'20%', left:'10%' },
  { top:'55%',    right:'20%' },
  { top:'15%',    left:'45%' },
  { bottom:'5%',  right:'5%' },
];
document.querySelectorAll('.orb-wrapper').forEach((w, i) => {
  const pos = orbPositions[i];
  w.style.position = 'absolute';
  w.style.width = 'auto'; w.style.height = 'auto';
  Object.assign(w.style, pos);
});

function animateParallax() {
  smoothX += (mouseX - smoothX) * 0.05;
  smoothY += (mouseY - smoothY) * 0.05;
  document.querySelectorAll('.orb-wrapper').forEach((w, i) => {
    const d = orbDepths[i] || 20;
    w.style.transform = `translate(${smoothX * d}px, ${smoothY * d}px)`;
  });
  requestAnimationFrame(animateParallax);
}
animateParallax();

// ── Custom cursor ──────────────────────────────────
const trail    = document.createElement('div');
const trailDot = document.createElement('div');
trail.id    = 'cursor-trail';
trailDot.id = 'cursor-dot';
document.body.appendChild(trail);
document.body.appendChild(trailDot);

let trailX = -100, trailY = -100, dotX = -100, dotY = -100, rawX = -100, rawY = -100;
window.addEventListener('mousemove', e => { rawX = e.clientX; rawY = e.clientY; }, { passive: true });

function animateCursor() {
  trailX += (rawX - trailX) * 0.12;
  trailY += (rawY - trailY) * 0.12;
  dotX   += (rawX - dotX)   * 0.55;
  dotY   += (rawY - dotY)   * 0.55;
  trail.style.transform    = `translate(${trailX}px,${trailY}px) translate(-50%,-50%)`;
  trailDot.style.transform = `translate(${dotX}px,${dotY}px) translate(-50%,-50%)`;
  requestAnimationFrame(animateCursor);
}
animateCursor();

window.addEventListener('touchstart', () => {
  trail.style.display = trailDot.style.display = 'none';
}, { once: true });

document.querySelectorAll('a,button,.card,.feat-card,.flow-step,.metric-card').forEach(el => {
  el.addEventListener('mouseenter', () => trail.classList.add('hovered'));
  el.addEventListener('mouseleave', () => trail.classList.remove('hovered'));
});

// ── Card 3D tilt ───────────────────────────────────
function addTilt(selector, maxDeg = 7) {
  document.querySelectorAll(selector).forEach(card => {
    card.addEventListener('mousemove', e => {
      const r = card.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width  - 0.5;
      const y = (e.clientY - r.top)  / r.height - 0.5;
      card.style.transform = `perspective(800px) rotateY(${x*maxDeg}deg) rotateX(${-y*maxDeg}deg) translateY(-4px) scale(1.01)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transition = 'transform 0.5s cubic-bezier(0.23,1,0.32,1)';
      card.style.transform  = '';
      setTimeout(() => { card.style.transition = ''; }, 500);
    });
    card.addEventListener('mouseenter', () => { card.style.transition = 'transform 0.1s ease'; });
  });
}
addTilt('.card', 7);
addTilt('.feat-card', 6);
addTilt('.flow-step', 5);
addTilt('.metric-card', 4);

// ── Hero word-by-word entrance ─────────────────────
// FIX: preserve gradient by wrapping words INSIDE the gradient span,
// not replacing it — so -webkit-text-fill-color still applies
function heroWordReveal() {
  const h1 = document.querySelector('.hero-title');
  if (!h1) return;

  // handle plain text nodes (e.g. "Modernize.")
  Array.from(h1.childNodes).forEach((node, ni) => {
    if (node.nodeType !== Node.TEXT_NODE) return;
    const words = node.textContent.trim().split(/\s+/).filter(Boolean);
    if (!words.length) return;
    const frag = document.createDocumentFragment();
    words.forEach((w, wi) => {
      const s = document.createElement('span');
      s.className = 'hw';
      s.textContent = w;
      s.style.animationDelay = `${0.1 + wi * 0.14}s`;
      frag.appendChild(s);
      frag.appendChild(document.createTextNode(' '));
    });
    node.replaceWith(frag);
  });

  // FIX: wrap words inside gradient span — keep the span itself intact
  // so the gradient CSS still applies to the parent
  h1.querySelectorAll('span.hero-gradient').forEach((span, gi) => {
    const text = span.textContent.trim();
    const words = text.split(/\s+/).filter(Boolean);
    span.textContent = '';
    words.forEach((w, wi) => {
      const s = document.createElement('span');
      s.className = 'hw';
      // FIX: inherit the gradient fill from parent
      s.style.cssText = `animation-delay:${0.35 + gi*0.15 + wi*0.14}s; -webkit-text-fill-color:inherit; color:inherit;`;
      s.textContent = w;
      span.appendChild(s);
      if (wi < words.length - 1) span.appendChild(document.createTextNode(' '));
    });
  });
}
heroWordReveal();

// ── Eyebrow shimmer on scroll ──────────────────────
// FIX: lower threshold so small elements actually trigger
const eyebrowObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('shimmer');
      eyebrowObs.unobserve(e.target);
    }
  });
}, { threshold: 0.4 });
document.querySelectorAll('.eyebrow').forEach(el => eyebrowObs.observe(el));

// ── Phase rows slide-in (FIX: use DOM index, not batch index) ─────
const phaseRows = Array.from(document.querySelectorAll('.phase-row'));
const phaseObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (!e.isIntersecting) return;
    // FIX: get stable DOM index for consistent stagger delay
    const idx = phaseRows.indexOf(e.target);
    setTimeout(() => e.target.classList.add('phase-visible'), Math.max(0, idx) * 90);
    phaseObs.unobserve(e.target);
  });
}, { threshold: 0.12 });
phaseRows.forEach(el => phaseObs.observe(el));

// ── Hero floating particles ────────────────────────
function spawnHeroParticles() {
  const hero = document.querySelector('.hero');
  if (!hero) return;
  const colors = ['#a8c8ff','#c4b5fd','#b9f0e8','#fbc8e8','#fde68a','#a7f3d0'];
  for (let i = 0; i < 18; i++) {
    const p = document.createElement('div');
    p.className = 'hero-particle';
    const size = 4 + Math.random() * 8;
    p.style.cssText = [
      `width:${size}px`, `height:${size}px`,
      `left:${Math.random()*100}%`, `top:${Math.random()*100}%`,
      `background:${colors[i % colors.length]}`,
      `animation-duration:${6 + Math.random()*10}s`,
      `animation-delay:${Math.random()*6}s`,
      `opacity:${0.4 + Math.random()*0.4}`,
    ].join(';');
    hero.appendChild(p);
  }
}
spawnHeroParticles();

// ── Live app health check ──────────────────────────
const APP_URL    = 'http://localhost:8080';
const HEALTH_URL = 'http://localhost:8080/manage/health';

const statusDot    = document.getElementById('status-dot');
const statusText   = document.getElementById('status-text');
const statusDetail = document.getElementById('status-detail');
const navDots      = document.querySelectorAll('.nav-status-dot');
const iframe       = document.getElementById('app-iframe');
const offlineMsg   = document.getElementById('app-preview-offline');

function setStatus(online, detail = '') {
  const cls = online ? 'online' : 'offline';
  const txt = online ? 'App is running' : 'App is offline';

  if (statusDot)  { statusDot.className = `status-dot ${cls}`; }
  if (statusText) { statusText.textContent = txt; }
  if (statusDetail && detail) { statusDetail.textContent = detail; }

  navDots.forEach(d => { d.className = `nav-status-dot ${cls}`; });

  // show/hide iframe vs offline message
  if (iframe && offlineMsg) {
    if (online) {
      iframe.style.display = 'block';
      offlineMsg.style.display = 'none';
      // reload iframe if it was previously offline
      if (iframe.dataset.loaded !== 'true') {
        iframe.src = APP_URL;
        iframe.dataset.loaded = 'true';
      }
    } else {
      iframe.style.display = 'none';
      offlineMsg.style.display = 'flex';
    }
  }
}

async function checkHealth() {
  // set checking state on first call
  if (statusDot && !statusDot.classList.contains('online') && !statusDot.classList.contains('offline')) {
    statusDot.className = 'status-dot checking';
    if (statusText) statusText.textContent = 'Checking…';
  }

  try {
    const res = await fetch(HEALTH_URL, { mode: 'cors', cache: 'no-store', signal: AbortSignal.timeout(3000) });
    if (res.ok) {
      const data = await res.json().catch(() => ({}));
      const detail = data.status ? `status: ${data.status} · ${HEALTH_URL}` : HEALTH_URL;
      setStatus(true, detail);
    } else {
      setStatus(false, `HTTP ${res.status} · ${HEALTH_URL}`);
    }
  } catch {
    // CORS or network error — try a no-cors ping to at least detect if port is open
    try {
      await fetch(APP_URL, { mode: 'no-cors', cache: 'no-store', signal: AbortSignal.timeout(2000) });
      // no-cors fetch succeeds (opaque response) = server is up
      setStatus(true, `Running · ${APP_URL}`);
    } catch {
      setStatus(false, `Not reachable · start with ./mvnw spring-boot:run`);
    }
  }
}

// initial check + poll every 15s
checkHealth();
setInterval(checkHealth, 15000);

// iframe load error fallback
if (iframe) {
  iframe.addEventListener('error', () => setStatus(false));
  // if iframe loads successfully, mark online
  iframe.addEventListener('load', () => {
    if (iframe.src && iframe.src !== 'about:blank') {
      navDots.forEach(d => d.classList.add('online'));
    }
  });
}

// ── ROI CALCULATOR ──────────────────────────────
function updateCalculator() {
  const files = parseInt(document.getElementById('files-slider').value);
  const rate = parseInt(document.getElementById('rate-slider').value);
  const complexity = parseInt(document.getElementById('complexity-slider').value);
  
  // Update display values
  document.getElementById('files-value').textContent = files;
  document.getElementById('rate-value').textContent = rate;
  const complexityLabels = ['Simple', 'Medium', 'Complex'];
  document.getElementById('complexity-value').textContent = complexityLabels[complexity - 1];
  
  // Calculate manual effort (base: 1.5 hours per file, adjusted by complexity)
  const complexityMultiplier = [0.8, 1.0, 1.3][complexity - 1];
  const manualHours = Math.round(files * 1.5 * complexityMultiplier);
  const manualCost = manualHours * rate;
  
  // Bob effort (fixed: 3 minutes + $50)
  const bobMinutes = 3;
  const bobCost = 50;
  const bobHours = bobMinutes / 60;
  
  // Calculate savings
  const timeSavings = (manualHours - bobHours).toFixed(2);
  const moneySavings = manualCost - bobCost;
  const roiMultiple = Math.round(moneySavings / bobCost);
  
  // Update UI
  document.getElementById('manual-hours').textContent = manualHours;
  document.getElementById('manual-cost').textContent = `$${manualCost.toLocaleString()}`;
  document.getElementById('bob-hours').textContent = bobMinutes;
  document.getElementById('bob-cost').textContent = `$${bobCost}`;
  document.getElementById('total-savings').textContent = `$${moneySavings.toLocaleString()}`;
  document.getElementById('time-savings').textContent = timeSavings;
  document.getElementById('roi-multiple').textContent = `${roiMultiple}x`;
}

// Attach calculator listeners
document.addEventListener('DOMContentLoaded', () => {
  const sliders = ['files-slider', 'rate-slider', 'complexity-slider'];
  sliders.forEach(id => {
    const slider = document.getElementById(id);
    if (slider) {
      slider.addEventListener('input', updateCalculator);
    }
  });
  
  // Initial calculation
  if (document.getElementById('files-slider')) {
    updateCalculator();
  }
});
