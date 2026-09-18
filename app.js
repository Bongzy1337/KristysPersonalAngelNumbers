// Interactive Astrological Constellation Canvas
const canvas = document.getElementById('celestial-canvas');
const ctx = canvas.getContext('2d');
let stars = [];
let mouse = { x: null, y: null };

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
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

function drawCosmos() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  // Update and draw stars
  for (let s of stars) {
    s.alpha += s.fadeSpeed;
    if (s.alpha <= 0.1 || s.alpha >= 0.9) s.fadeSpeed = -s.fadeSpeed;
    
    ctx.beginPath();
    ctx.arc(s.x, s.y, s.radius, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(230, 246, 255, ${Math.abs(s.alpha)})`;
    ctx.fill();

    // Connect to mouse like constellation lines
    if (mouse.x && mouse.y) {
      const dist = Math.hypot(s.x - mouse.x, s.y - mouse.y);
      if (dist < 130) {
        ctx.beginPath();
        ctx.moveTo(s.x, s.y);
        ctx.lineTo(mouse.x, mouse.y);
        ctx.strokeStyle = `rgba(138, 226, 214, ${(1 - dist / 130) * 0.4})`;
        ctx.lineWidth = 0.6;
        ctx.stroke();
      }
    }
  }
  requestAnimationFrame(drawCosmos);
}

window.addEventListener('resize', resizeCanvas);
window.addEventListener('mousemove', (e) => {
  mouse.x = e.clientX;
  mouse.y = e.clientY;
});
window.addEventListener('mouseleave', () => {
  mouse.x = null;
  mouse.y = null;
});

// Liquid Water Ripple Effect on Click
document.addEventListener('click', (e) => {
  const ripple = document.createElement('div');
  ripple.classList.add('ripple');
  document.body.appendChild(ripple);
  const size = 60;
  ripple.style.width = ripple.style.height = `${size}px`;
  ripple.style.left = `${e.clientX - size/2}px`;
  ripple.style.top = `${e.clientY - size/2 + window.scrollY}px`;
  setTimeout(() => ripple.remove(), 750);
});

// Interactive Shell/Crystal Consultation
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
    el.style.transition = 'opacity 0.5s ease';
    el.style.opacity = 1;
  }, 200);
}

// Moon Phase Estimator
function setMoonPhase() {
  const moonEl = document.getElementById('moon-info');
  if (!moonEl) return;
  const phases = ['🌑 New Moon Tide', '🌓 Waxing Crescent Ocean', '🌕 Full Moon Radiance', '🌗 Waning Celestial Tide'];
  const day = new Date().getDate();
  moonEl.innerText = phases[day % phases.length];
}

resizeCanvas();
drawCosmos();
window.addEventListener('DOMContentLoaded', setMoonPhase);
