const canvas = document.getElementById('celestial-canvas');
const ctx = canvas.getContext('2d');
let stars = [];
let mouse = { x: null, y: null };

// --- SECRET CONSTELLATION VARIABLES ---
let secretCode = ['l','o','v','e'];
let codePos = 0;
let constellationMode = false;
let cx, cy, scale;

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  cx = canvas.width / 2;
  cy = canvas.height / 2.5;
  scale = Math.min(canvas.width, canvas.height) / 32;
  initStars();
}

function initStars() {
  stars = [];
  const starCount = Math.floor((canvas.width * canvas.height) / 12000);
  for (let i = 0; i < starCount; i++) {
    stars.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      radius: Math.random() * 1.5 + 0.5,
      alpha: Math.random(),
      fadeSpeed: (Math.random() * 0.02 + 0.005) * (Math.random() > 0.5 ? 1 : -1)
    });
  }
}

// --- ACTIVATE THE EASTER EGG ---
function triggerConstellation() {
  if (constellationMode) return;
  constellationMode = true;
  
  for(let i=0; i<stars.length; i++) {
    if (i < 90) {
      const t = (i / 90) * Math.PI * 2;
      const x = cx + scale * 16 * Math.pow(Math.sin(t), 3);
      const y = cy - scale * (13 * Math.cos(t) - 5 * Math.cos(2*t) - 2 * Math.cos(3*t) - Math.cos(4*t));
      stars[i].tx = x;
      stars[i].ty = y;
    } else {
      stars[i].tx = stars[i].x;
      stars[i].ty = stars[i].y;
    }
  }
}

window.addEventListener('keydown', (e) => {
  if(e.key.toLowerCase() === secretCode[codePos]) {
    codePos++;
    if(codePos === secretCode.length) { triggerConstellation(); codePos = 0; }
  } else { codePos = 0; }
});

function drawCosmos() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  for (let i=0; i<stars.length; i++) {
    let s = stars[i];
    s.alpha += s.fadeSpeed;
    if (s.alpha <= 0.1 || s.alpha >= 0.9) s.fadeSpeed = -s.fadeSpeed;
    
    if (constellationMode && s.tx !== undefined) {
      s.x += (s.tx - s.x) * 0.04;
      s.y += (s.ty - s.y) * 0.04;
    }

    ctx.beginPath();
    ctx.arc(s.x, s.y, s.radius, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(230, 246, 255, ${Math.abs(s.alpha)})`;
    ctx.fill();

    if (constellationMode && i > 0 && i < 90) {
      ctx.beginPath();
      ctx.moveTo(stars[i-1].x, stars[i-1].y);
      ctx.lineTo(s.x, s.y);
      ctx.strokeStyle = `rgba(244, 208, 111, 0.3)`;
      ctx.lineWidth = 1;
      ctx.stroke();
    } else if (!constellationMode && mouse.x && mouse.y) {
      if (Math.abs(s.x - mouse.x) < 130 && Math.abs(s.y - mouse.y) < 130) {
        const dist = Math.hypot(s.x - mouse.x, s.y - mouse.y);
        if (dist < 130) {
          ctx.beginPath(); ctx.moveTo(s.x, s.y); ctx.lineTo(mouse.x, mouse.y);
          ctx.strokeStyle = `rgba(138, 226, 214, ${(1 - dist / 130) * 0.4})`;
          ctx.lineWidth = 0.6; ctx.stroke();
        }
      }
    }
  }

  if (constellationMode) {
    ctx.font = "bold 26px 'Cinzel', serif";
    ctx.fillStyle = `rgba(244, 208, 111, ${0.5 + Math.abs(Math.sin(Date.now()/600)) * 0.5})`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("T + K", cx, cy);
  }
  requestAnimationFrame(drawCosmos);
}

window.addEventListener('resize', resizeCanvas);
window.addEventListener('mousemove', (e) => { mouse.x = e.clientX; mouse.y = e.clientY; });
window.addEventListener('mouseleave', () => { mouse.x = null; mouse.y = null; });

// --- INTERACTIVE WAVE & TEAL HEART SYMBOLS ON CLICK ---
document.addEventListener('click', (e) => {
  const ripple = document.createElement('div');
  ripple.classList.add('ripple');
  document.body.appendChild(ripple);
  const size = 60;
  ripple.style.width = ripple.style.height = `${size}px`;
  ripple.style.left = `${e.pageX - size/2}px`;
  ripple.style.top = `${e.pageY - size/2}px`;
  setTimeout(() => ripple.remove(), 750);

  // Spawns 3 random waves and hearts with a teal glowing color
  const clickSymbols = ['🌊', '♥'];
  for(let i=0; i<3; i++) {
    setTimeout(() => {
      const symbol = document.createElement('div');
      symbol.classList.add('floating-heart'); // Keeps the float-up physics
      symbol.innerHTML = clickSymbols[Math.floor(Math.random() * clickSymbols.length)];
      symbol.style.color = '#8ae2d6'; // Oceanic Teal
      symbol.style.textShadow = '0 0 8px #8ae2d6';
      symbol.style.fontWeight = 'bold';
      symbol.style.left = `${e.pageX - 15 + (Math.random() * 30 - 15)}px`;
      symbol.style.top = `${e.pageY - 15}px`;
      document.body.appendChild(symbol);
      setTimeout(() => symbol.remove(), 2000);
    }, i * 150);
  }
});

// --- LOVE CLOCK LOGIC ---
function initLoveClock() {
  const clockEl = document.getElementById('love-clock-timer');
  if (!clockEl) return;
  const startDate = new Date('2022-11-12T00:00:00').getTime();

  setInterval(() => {
    const now = new Date().getTime();
    const diff = now - startDate;
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const secs = Math.floor((diff % (1000 * 60)) / 1000);
    
    const h = hours.toString().padStart(2, '0');
    const m = mins.toString().padStart(2, '0');
    const s = secs.toString().padStart(2, '0');

    clockEl.innerHTML = `${days} Days, ${h} Hrs, ${m} Mins, ${s} Secs`;
  }, 1000);
}

const horoscopes = [
  "🌊 The tides are shifting in your favour; release resistance.",
  "✨ Jupiter's energy brings calm reassurance to your heart today.",
  "🐚 You are protected by both sea and stars—breathe deep and trust.",
  "🌙 What was once hidden is rising gently to the shore in divine timing.",
  "⭐ Your souls remain linked across the ocean of infinity."
];

function consultOracle() {
  const el = document.getElementById('oracle-text');
  if (!el) return;
  el.style.opacity = 0;
  setTimeout(() => {
    el.innerText = horoscopes[Math.floor(Math.random() * horoscopes.length)];
    el.style.transition = 'opacity 0.4s ease';
    el.style.opacity = 1;
  }, 150);
}

// --- LIVE MATHEMATICAL MOON PHASE ---
function setMoonPhase() {
  const moonEl = document.getElementById('moon-info');
  if (!moonEl) return;
  
  const now = new Date();
  let year = now.getFullYear();
  let month = now.getMonth() + 1;
  let day = now.getDate();
  
  if (month < 3) { year--; month += 12; }
  month++;
  const c = 365.25 * year;
  const e = 30.6 * month;
  
  const totalDays = c + e + day - 694039.09;
  const cycle = totalDays / 29.5305882;
  const fractionalPhase = cycle - Math.floor(cycle);
  const phaseIndex = Math.round(fractionalPhase * 8) % 8;
  
  const phases = [
    '🌑 New Moon Tide', '🌒 Waxing Crescent Ocean', '🌓 First Quarter Tide',
    '🌔 Waxing Gibbous Horizon', '🌕 Full Moon Radiance', '🌖 Waning Gibbous Sea',
    '🌗 Last Quarter Tide', '🌘 Waning Crescent Ocean'
  ];
  
  moonEl.innerText = phases[phaseIndex];
  
  const titleContainer = document.querySelector('.cosmic-brand');
  if(titleContainer) titleContainer.addEventListener('dblclick', triggerConstellation);
}

resizeCanvas();
drawCosmos();
window.addEventListener('DOMContentLoaded', () => {
  setMoonPhase();
  initLoveClock();
});
