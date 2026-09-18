const canvas = document.getElementById('celestial-canvas');
const ctx = canvas.getContext('2d');
let stars = [], shootingStars = [];
let mouse = { x: null, y: null };
let constellationMode = false;
let cx, cy, scale;

function resizeCanvas() {
  canvas.width = window.innerWidth; canvas.height = window.innerHeight;
  cx = canvas.width / 2; cy = canvas.height / 2.5;
  scale = Math.min(canvas.width, canvas.height) / 32;
  initStars();
}

function initStars() {
  stars = [];
  const starCount = Math.floor((canvas.width * canvas.height) / 10000);
  for (let i = 0; i < starCount; i++) {
    stars.push({
      x: Math.random() * canvas.width, y: Math.random() * canvas.height,
      radius: Math.random() * 1.5 + 0.5, alpha: Math.random(),
      fadeSpeed: (Math.random() * 0.02 + 0.005) * (Math.random() > 0.5 ? 1 : -1)
    });
  }
}

// FEATURE: Shooting Stars
function spawnShootingStar() {
  if (Math.random() < 0.02) { // 2% chance per frame
    shootingStars.push({
      x: Math.random() * canvas.width * 1.5, y: 0,
      len: Math.random() * 80 + 30, speed: Math.random() * 10 + 5,
      alpha: 1
    });
  }
}

function triggerConstellation() {
  if (constellationMode) return;
  constellationMode = true;
  for(let i=0; i<stars.length; i++) {
    if (i < 90) {
      const t = (i / 90) * Math.PI * 2;
      stars[i].tx = cx + scale * 16 * Math.pow(Math.sin(t), 3);
      stars[i].ty = cy - scale * (13 * Math.cos(t) - 5 * Math.cos(2*t) - 2 * Math.cos(3*t) - Math.cos(4*t));
    } else {
      stars[i].tx = stars[i].x; stars[i].ty = stars[i].y;
    }
  }
}

function drawCosmos() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  // Draw Background Stars
  for (let i=0; i<stars.length; i++) {
    let s = stars[i];
    s.alpha += s.fadeSpeed;
    if (s.alpha <= 0.1 || s.alpha >= 0.9) s.fadeSpeed = -s.fadeSpeed;
    
    if (constellationMode && s.tx !== undefined) {
      s.x += (s.tx - s.x) * 0.04; s.y += (s.ty - s.y) * 0.04;
    }

    ctx.beginPath(); ctx.arc(s.x, s.y, s.radius, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(230, 246, 255, ${Math.abs(s.alpha)})`; ctx.fill();

    if (constellationMode && i > 0 && i < 90) {
      ctx.beginPath(); ctx.moveTo(stars[i-1].x, stars[i-1].y); ctx.lineTo(s.x, s.y);
      ctx.strokeStyle = `rgba(244, 208, 111, 0.3)`; ctx.lineWidth = 1; ctx.stroke();
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

  // Draw Shooting Stars
  spawnShootingStar();
  for (let i = shootingStars.length - 1; i >= 0; i--) {
    let ss = shootingStars[i];
    ctx.beginPath(); ctx.moveTo(ss.x, ss.y); ctx.lineTo(ss.x - ss.len, ss.y + ss.len);
    ctx.strokeStyle = `rgba(255, 255, 255, ${ss.alpha})`; ctx.lineWidth = 2; ctx.stroke();
    ss.x -= ss.speed; ss.y += ss.speed; ss.alpha -= 0.02;
    if (ss.alpha <= 0) shootingStars.splice(i, 1);
  }

  // Draw T+K
  if (constellationMode) {
    ctx.font = "bold 26px 'Cinzel', serif";
    ctx.fillStyle = `rgba(244, 208, 111, ${0.5 + Math.abs(Math.sin(Date.now()/600)) * 0.5})`;
    ctx.textAlign = "center"; ctx.textBaseline = "middle"; ctx.fillText("T + K", cx, cy);
  }
  requestAnimationFrame(drawCosmos);
}

window.addEventListener('resize', resizeCanvas);
window.addEventListener('mousemove', (e) => { mouse.x = e.clientX; mouse.y = e.clientY; });
window.addEventListener('mouseleave', () => { mouse.x = null; mouse.y = null; });

// Click Ripples
document.addEventListener('click', (e) => {
  // Ignore clicks on buttons/links so we don't block navigation
  if(e.target.closest('a') || e.target.closest('.bottle-btn') || e.target.closest('.close-modal')) return;

  const ripple = document.createElement('div'); ripple.classList.add('ripple'); document.body.appendChild(ripple);
  const size = 60; ripple.style.width = ripple.style.height = `${size}px`;
  ripple.style.left = `${e.pageX - size/2}px`; ripple.style.top = `${e.pageY - size/2}px`;
  setTimeout(() => ripple.remove(), 750);

  const symbols = ['🌊', '♥'];
  for(let i=0; i<3; i++) {
    setTimeout(() => {
      const sym = document.createElement('div'); sym.classList.add('floating-heart');
      sym.innerHTML = symbols[Math.floor(Math.random() * symbols.length)];
      sym.style.color = '#8ae2d6'; sym.style.textShadow = '0 0 8px #8ae2d6';
      sym.style.left = `${e.pageX - 15 + (Math.random() * 30 - 15)}px`; sym.style.top = `${e.pageY - 15}px`;
      document.body.appendChild(sym); setTimeout(() => sym.remove(), 2000);
    }, i * 150);
  }
});

// Love Clock
function initLoveClock() {
  const clockEl = document.getElementById('love-clock-timer');
  if (!clockEl) return;
  const startDate = new Date('2022-12-12T00:00:00').getTime();
  setInterval(() => {
    const diff = new Date().getTime() - startDate;
    const d = Math.floor(diff / 86400000);
    const h = Math.floor((diff % 86400000) / 3600000).toString().padStart(2, '0');
    const m = Math.floor((diff % 3600000) / 60000).toString().padStart(2, '0');
    const s = Math.floor((diff % 60000) / 1000).toString().padStart(2, '0');
    clockEl.innerHTML = `${d} Days, ${h} Hrs, ${m} Mins, ${s} Secs`;
  }, 1000);
}

// Live Moon Math
function setMoonPhase() {
  const moonEl = document.getElementById("moon-info");
  if (!moonEl) return;
  const now = new Date(); let year = now.getFullYear(); let month = now.getMonth() + 1; let day = now.getDate();
  if (month < 3) { year--; month += 12; } month++;
  const totalDays = (365.25 * year) + (30.6 * month) + day - 694039.09;
  const cycle = totalDays / 29.5305882;
  const phaseIndex = Math.round((cycle - Math.floor(cycle)) * 8) % 8;
  const phases = ["🌑 New Moon Tide", "🌒 Waxing Crescent Ocean", "🌓 First Quarter Tide", "🌔 Waxing Gibbous Horizon", "🌕 Full Moon Radiance", "🌖 Waning Gibbous Sea", "🌗 Last Quarter Tide", "🌘 Waning Crescent Ocean"];
  const links = ["new-moon.html", "waxing-crescent.html", "first-quarter.html", "waxing-gibbous.html", "full-moon.html", "waning-gibbous.html", "last-quarter.html", "waning-crescent.html"];
  moonEl.innerText = phases[phaseIndex];
  const moonLink = document.querySelector(".lunar-phase");
  if(moonLink) moonLink.href = links[phaseIndex];
}

// Oracle
const horoscopes = ["🌊 The tides are shifting in your favour; release resistance.", "✨ Jupiter's energy brings calm reassurance to your heart today.", "🐚 You are protected by both sea and stars—breathe deep and trust.", "🌙 What was once hidden is rising gently to the shore in divine timing.", "⭐ Your souls remain linked across the ocean of infinity."];
function consultOracle() {
  const el = document.getElementById('oracle-text'); if (!el) return;
  el.style.opacity = 0;
  setTimeout(() => { el.innerText = horoscopes[Math.floor(Math.random() * horoscopes.length)]; el.style.opacity = 1; el.style.transition = 'opacity 0.4s'; }, 150);
}

// Bottle Modal Logic
const loveNotes = [
  "I was just thinking about that time we laughed so hard we couldn't breathe.",
  "Remembering the way your smile lit up the whole room, every day I was with you.",
  "Thinking of that perfect day we spent together, just the two of us.",
  "Holding onto the feeling of your hand in mine.",
  "I saw something today that reminded me of your beautiful soul.",
  "Every day I wake up my instant thoughts are of you."
];
function initBottle() {
  const bottle = document.getElementById('bottle-btn');
  const modal = document.getElementById('bottle-modal');
  const text = document.getElementById('bottle-text');
  const close = document.getElementById('close-modal');
  if(!bottle || !modal) return;

  bottle.addEventListener('click', () => {
    text.innerText = loveNotes[Math.floor(Math.random() * loveNotes.length)];
    modal.classList.add('active');
  });
  close.addEventListener('click', () => modal.classList.remove('active'));
  modal.addEventListener('click', (e) => { if(e.target === modal) modal.classList.remove('active'); });
}

resizeCanvas(); drawCosmos();
window.addEventListener('DOMContentLoaded', () => {
  setMoonPhase(); initLoveClock(); initBottle();
  const bongzyText = document.querySelector('.footer-line-2');
  if(bongzyText) bongzyText.addEventListener('click', triggerConstellation);
});
