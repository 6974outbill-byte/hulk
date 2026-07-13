const SETTINGS = {
  youtube: "https://www.youtube.com/",
  instagram: "https://www.instagram.com/",
  email: "your@email.com"
};

const bgm = document.getElementById("bgm");
const enterButton = document.getElementById("enterButton");
const introOverlay = document.getElementById("introOverlay");
const landingMusicButton = document.getElementById("landingMusicButton");
const flashLayer = document.getElementById("flashLayer");
const shockLayer = document.getElementById("shockLayer");

const musicToggle = document.getElementById("musicToggle");
const panelPlay = document.getElementById("panelPlay");
const musicIcon = document.getElementById("musicIcon");
const musicText = document.getElementById("musicText");
const musicPanel = document.getElementById("musicPanel");
const musicStatus = document.getElementById("musicStatus");
const volumeSlider = document.getElementById("volumeSlider");
const volumeValue = document.getElementById("volumeValue");

const themeToggle = document.getElementById("themeToggle");
const menuButton = document.getElementById("menuButton");
const mainNav = document.getElementById("mainNav");

document.querySelectorAll(".youtube, .youtube-hotspot").forEach(el => el.href = SETTINGS.youtube);
document.querySelectorAll(".instagram, .instagram-hotspot").forEach(el => el.href = SETTINGS.instagram);
document.querySelector('a[href^="mailto:"]').href = `mailto:${SETTINGS.email}`;

bgm.volume = 0.4;
bgm.loop = true;

function updatePlayerUI() {
  const playing = !bgm.paused;
  const vol = Math.round(bgm.volume * 100);
  musicIcon.textContent = playing ? "❚❚" : "▶";
  musicText.textContent = playing ? `MUSIC ON · ${vol}%` : "MUSIC OFF";
  panelPlay.textContent = playing ? "❚❚" : "▶";
  musicStatus.textContent = playing ? "PLAYING" : "PAUSED";
  landingMusicButton.innerHTML = playing ? `MUSIC ♫ ON <b>${vol}%</b>` : "MUSIC OFF";
  musicPanel.classList.toggle("playing", playing);
}

async function playMusic() {
  try { await bgm.play(); }
  catch (error) { console.warn("브라우저가 자동 재생을 차단했습니다.", error); }
  updatePlayerUI();
}

function toggleMusic() {
  if (bgm.paused) playMusic();
  else { bgm.pause(); updatePlayerUI(); }
}

let entering = false;

async function enterSite() {
  if (entering) return;
  entering = true;

  flashLayer.classList.add("active");
  shockLayer.classList.add("active");

  document.body.animate(
    [
      { transform: "translate(0,0)" },
      { transform: "translate(-10px,6px)" },
      { transform: "translate(9px,-5px)" },
      { transform: "translate(-5px,3px)" },
      { transform: "translate(0,0)" }
    ],
    { duration: 520, easing: "ease-out" }
  );

  setTimeout(() => flashLayer.classList.remove("active"), 430);
  setTimeout(() => shockLayer.classList.remove("active"), 720);

  await playMusic();
  introOverlay.classList.add("hide");

  setTimeout(() => {
    introOverlay.style.display = "none";
    document.getElementById("home").scrollIntoView({ behavior: "smooth" });
  }, 900);
}

enterButton.addEventListener("click", (event) => {
  event.preventDefault();
  event.stopPropagation();
  enterSite();
});

/* Fallback: clicking the background area also enters.
   Social and music controls remain independently clickable. */
introOverlay.addEventListener("click", (event) => {
  if (
    event.target.closest(".youtube-hotspot") ||
    event.target.closest(".instagram-hotspot") ||
    event.target.closest("#landingMusicButton")
  ) return;
  enterSite();
});

document.addEventListener("keydown", (event) => {
  if ((event.key === "Enter" || event.key === " ") && !introOverlay.classList.contains("hide")) {
    event.preventDefault();
    enterSite();
  }
});

landingMusicButton.addEventListener("click", toggleMusic);
musicToggle.addEventListener("click", toggleMusic);
panelPlay.addEventListener("click", toggleMusic);
bgm.addEventListener("play", updatePlayerUI);
bgm.addEventListener("pause", updatePlayerUI);

volumeSlider.addEventListener("input", () => {
  bgm.volume = Number(volumeSlider.value) / 100;
  volumeValue.textContent = `${volumeSlider.value}%`;
  updatePlayerUI();
});

themeToggle.addEventListener("click", () => {
  document.body.classList.toggle("light-theme");
  themeToggle.textContent = document.body.classList.contains("light-theme") ? "☀" : "☾";
});

menuButton.addEventListener("click", () => {
  const open = mainNav.classList.toggle("open");
  menuButton.setAttribute("aria-expanded", open);
});

document.querySelectorAll("nav a").forEach(link => {
  link.addEventListener("click", () => mainNav.classList.remove("open"));
});

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) entry.target.classList.add("show");
  });
}, { threshold: 0.12 });

document.querySelectorAll(".reveal").forEach(el => observer.observe(el));

document.getElementById("topButton").addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});

function updateClock() {
  const now = new Date();
  document.getElementById("liveTime").textContent =
    now.toLocaleTimeString("ko-KR", { hour12: false });
  document.getElementById("liveDate").textContent =
    now.toLocaleDateString("ko-KR", {
      year: "numeric", month: "2-digit", day: "2-digit", weekday: "short"
    });
}
setInterval(updateClock, 1000);
updateClock();
document.getElementById("year").textContent = new Date().getFullYear();

const canvas = document.getElementById("particleCanvas");
const ctx = canvas.getContext("2d");
let particles = [];

function resizeCanvas() {
  const ratio = window.devicePixelRatio || 1;
  canvas.width = innerWidth * ratio;
  canvas.height = innerHeight * ratio;
  canvas.style.width = innerWidth + "px";
  canvas.style.height = innerHeight + "px";
  ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
}

function createParticle() {
  return {
    x: Math.random() * innerWidth,
    y: Math.random() * innerHeight,
    r: Math.random() * 2 + 0.4,
    vx: (Math.random() - 0.5) * 0.24,
    vy: -Math.random() * 0.34 - 0.04,
    a: Math.random() * 0.48 + 0.08
  };
}

function resetParticles() {
  particles = Array.from({ length: innerWidth < 700 ? 50 : 95 }, createParticle);
}

function drawParticles() {
  ctx.clearRect(0, 0, innerWidth, innerHeight);
  particles.forEach(p => {
    p.x += p.vx;
    p.y += p.vy;
    if (p.y < -10) Object.assign(p, createParticle(), { y: innerHeight + 10 });
    ctx.beginPath();
    ctx.fillStyle = `rgba(99,255,71,${p.a})`;
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    ctx.fill();
  });
  requestAnimationFrame(drawParticles);
}

addEventListener("resize", () => {
  resizeCanvas();
  resetParticles();
});

resizeCanvas();
resetParticles();
drawParticles();
updatePlayerUI();
