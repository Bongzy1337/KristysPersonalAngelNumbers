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
  const starCount = Math.floor((canvas.width * canvas.height) / 8000);
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

// --- ACTIVATE THE HEART EASTER EGG ---
function triggerConstellation() {
  if (constellationMode) return;
  constellationMode = true;
  
  // Mathematical heart curve
  for(let i=0; i<stars.length; i++) {
    if (i < 90) { // First 90 stars form the heart
      const t = (i / 90) * Math.PI * 2;
      const x = cx + scale * 16 * Math.pow(Math.sin(t), 3);
      const y = cy - scale * (13 * Math.cos(t) - 5 * Math.cos(2*t) - 2 * Math.cos(3*t) - Math.cos(4*t));
      stars[i].tx = x;
      stars[i].ty = y;
    } else { // Rest scatter
      stars[i].tx = stars[i].x;
      stars[i].ty = stars[i].y;
    }
  }
}

// Type L-O-V-E to trigger
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
    
    // Smoothly fly stars to constellation points
    if (constellationMode && s.tx !== undefined) {
      s.x += (s.tx - s.x) * 0.03;
      s.y += (s.ty - s.y) * 0.03;
    }

    ctx.beginPath();
    ctx.arc(s.x, s.y, s.radius, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(230, 246, 255, ${Math.abs(s.alpha)})`;
    ctx.fill();

    // Draw lines between stars
    if (constellationMode && i > 0 && i < 90) {
      ctx.beginPath();
      ctx.moveTo(stars[i-1].x, stars[i-1].y);
      ctx.lineTo(s.x, s.y);
      ctx.strokeStyle = `rgba(244, 208, 111, 0.3)`;
      ctx.lineWidth = 1;
      ctx.stroke();
    } else if (!constellationMode && mouse.x && mouse.y) {
      const dist = Math.hypot(s.x - mouse.x, s.y - mouse.y);
      if (dist < 130) {
        ctx.beginPath(); ctx.moveTo(s.x, s.y); ctx.lineTo(mouse.x, mouse.y);
        ctx.strokeStyle = `rgba(138, 226, 214, ${(1 - dist / 130) * 0.4})`;
        ctx.lineWidth = 0.6; ctx.stroke();
      }
    }
  }

  // Draw K + B in the center when active
  if (constellationMode) {
    ctx.font = "bold 26px 'Cinzel', serif";
    ctx.fillStyle = `rgba(244, 208, 111, ${0.5 + Math.abs(Math.sin(Date.now()/600)) * 0.5})`; // Glowing text
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("K + B", cx, cy);
  }
  requestAnimationFrame(drawCosmos);
}

window.addEventListener('resize', resizeCanvas);
window.addEventListener('mousemove', (e) => { mouse.x = e.clientX; mouse.y = e.clientY; });
window.addEventListener('mouseleave', () => { mouse.x = null; mouse.y = null; });

// --- INTERACTIVE HEARTS ON CLICK ---
document.addEventListener('click', (e) => {
  // 1. Water Ripple
  const ripple = document.createElement('div');
  ripple.classList.add('ripple');
  document.body.appendChild(ripple);
  const size = 60;
  ripple.style.width = ripple.style.height = `${size}px`;
  ripple.style.left = `${e.pageX - size/2}px`;
  ripple.style.top = `${e.pageY - size/2}px`;
  setTimeout(() => ripple.remove(), 750);

  // 2. Floating Hearts
  for(let i=0; i<3; i++) {
    setTimeout(() => {
      const heart = document.createElement('div');
      heart.classList.add('floating-heart');
      heart.innerHTML = '✨💖';
      heart.style.left = `${e.pageX - 15 + (Math.random() * 30 - 15)}px`;
      heart.style.top = `${e.pageY - 15}px`;
      document.body.appendChild(heart);
      setTimeout(() => heart.remove(), 2000);
    }, i * 150);
  }
});

// --- LOVE CLOCK LOGIC ---
function initLoveClock() {
  const clockEl = document.getElementById('love-clock-timer');
  if (!clockEl) return;
  
  // DEFAULT START DATE (User can change this in app.js later)
  const startDate = new Date('2022-01-01T00:00:00').getTime();

  setInterval(() => {
    const now = new Date().getTime();
    const diff = now - startDate;
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const secs = Math.floor((diff % (1000 * 60)) / 1000);
    
    // Format to always show 2 digits for hrs/mins/secs
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
function setMoonPhase() {
  const moonEl = document.getElementById('moon-info');
  if (!moonEl) return;
  const phases = ['🌑 New Moon Tide', '🌓 Waxing Crescent Ocean', '🌕 Full Moon Radiance', '🌗 Waning Celestial Tide'];
  const day = new Date().getDate();
  moonEl.innerText = phases[day % phases.length];
  
  // Double-Clicking the moon triggers the secret heart constellation!
  const phaseContainer = document.querySelector('.lunar-phase');
  if(phaseContainer) phaseContainer.addEventListener('dblclick', triggerConstellation);
}

resizeCanvas();
drawCosmos();
window.addEventListener('DOMContentLoaded', () => {
  setMoonPhase();
  initLoveClock();
});
