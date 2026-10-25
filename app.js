const canvas = document.querySelector("#perception-canvas");
const ctx = canvas?.getContext("2d");
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function resizeCanvas() {
  if (!canvas || !ctx) return;
  const rect = canvas.getBoundingClientRect();
  const ratio = Math.min(window.devicePixelRatio || 1, 2);
  canvas.width = Math.max(1, Math.round(rect.width * ratio));
  canvas.height = Math.max(1, Math.round(rect.height * ratio));
  ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
}

function drawFrame(time = 0) {
  if (!canvas || !ctx) return;
  const width = canvas.clientWidth;
  const height = canvas.clientHeight;
  const t = reduceMotion ? 0.7 : time / 1000;

  ctx.clearRect(0, 0, width, height);
  ctx.fillStyle = "#0c0d0b";
  ctx.fillRect(0, 0, width, height);

  const horizon = height * 0.5;
  ctx.strokeStyle = "rgba(255,255,255,.08)";
  ctx.lineWidth = 1;
  for (let i = 0; i < 9; i += 1) {
    const y = horizon + i * height * 0.075;
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(width, y);
    ctx.stroke();
  }
  for (let i = -5; i <= 5; i += 1) {
    ctx.beginPath();
    ctx.moveTo(width * 0.5, horizon);
    ctx.lineTo(width * 0.5 + i * width * 0.21, height);
    ctx.stroke();
  }

  const points = [
    [0.18, 0.27, 3], [0.29, 0.41, 2], [0.43, 0.21, 2.5], [0.64, 0.28, 2],
    [0.78, 0.46, 3], [0.21, 0.7, 2], [0.49, 0.74, 3], [0.72, 0.68, 2.5],
    [0.88, 0.2, 2], [0.09, 0.51, 2]
  ];
  points.forEach(([px, py, radius], index) => {
    const drift = Math.sin(t * 0.7 + index) * 5;
    ctx.fillStyle = index % 3 === 0 ? "#c8ff2f" : "rgba(255,255,255,.55)";
    ctx.beginPath();
    ctx.arc(px * width + drift, py * height, radius, 0, Math.PI * 2);
    ctx.fill();
  });

  ctx.strokeStyle = "rgba(39,82,255,.8)";
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  for (let i = 0; i < 80; i += 1) {
    const x = (i / 79) * width;
    const y = height * 0.79 + Math.sin(i * 0.34 + t * 1.4) * 8 + Math.sin(i * 0.08) * 15;
    if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
  }
  ctx.stroke();

  ctx.fillStyle = "rgba(39,82,255,.13)";
  ctx.beginPath();
  ctx.moveTo(0, height);
  for (let i = 0; i < 80; i += 1) {
    const x = (i / 79) * width;
    const y = height * 0.79 + Math.sin(i * 0.34 + t * 1.4) * 8 + Math.sin(i * 0.08) * 15;
    ctx.lineTo(x, y);
  }
  ctx.lineTo(width, height);
  ctx.closePath();
  ctx.fill();

  if (!reduceMotion) requestAnimationFrame(drawFrame);
}

resizeCanvas();
drawFrame();
window.addEventListener("resize", resizeCanvas, { passive: true });

const clock = document.querySelector("[data-clock]");
const started = performance.now();
function updateClock(now) {
  if (!clock) return;
  const elapsed = Math.max(0, now - started);
  const seconds = Math.floor(elapsed / 1000) % 60;
  const frames = Math.floor((elapsed % 1000) / 40);
  clock.textContent = `00:00:${String(seconds).padStart(2, "0")}.${String(frames).padStart(3, "0")}`;
  if (!reduceMotion) requestAnimationFrame(updateClock);
}
requestAnimationFrame(updateClock);

const header = document.querySelector("[data-header]");
function updateHeader() {
  header?.classList.toggle("is-compact", window.scrollY > 24);
}
updateHeader();
window.addEventListener("scroll", updateHeader, { passive: true });

const year = document.querySelector("[data-year]");
if (year) year.textContent = new Date().getFullYear();
