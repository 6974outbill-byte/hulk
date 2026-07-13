const SETTINGS = {
  youtube: "https://www.youtube.com/",
  instagram: "https://www.instagram.com/",
  email: "your@email.com"
};

const bgm = document.getElementById("bgm");
const enterGate = document.getElementById("enterGate");
const startExperience = document.getElementById("startExperience");
const musicButton = document.getElementById("musicButton");
const musicIcon = document.getElementById("musicIcon");
const musicText = document.getElementById("musicText");
const flash = document.getElementById("flash");
const menuButton = document.getElementById("menuButton");
const nav = document.getElementById("nav");

document.querySelector(".youtube").href = SETTINGS.youtube;
document.querySelector(".instagram").href = SETTINGS.instagram;
document.querySelector('a[href^="mailto:"]').href = `mailto:${SETTINGS.email}`;

bgm.volume = 0.4;
bgm.loop = true;

function updateMusicUI() {
  const playing = !bgm.paused;
  musicIcon.textContent = playing ? "❚❚" : "▶";
  musicText.textContent = playing ? "MUSIC ON · 40%" : "MUSIC OFF";
}

async function startMusic() {
  try {
    await bgm.play();
  } catch (error) {
    console.warn("브라우저가 자동 재생을 차단했습니다.", error);
  }
  updateMusicUI();
}

startExperience.addEventListener("click", async () => {
  flash.classList.add("active");
  setTimeout(() => flash.classList.remove("active"), 420);
  enterGate.classList.add("hide");
  await startMusic();
});

musicButton.addEventListener("click", async () => {
  if (bgm.paused) {
    await startMusic();
  } else {
    bgm.pause();
    updateMusicUI();
  }
});

bgm.addEventListener("play", updateMusicUI);
bgm.addEventListener("pause", updateMusicUI);
updateMusicUI();

menuButton.addEventListener("click", () => {
  const isOpen = nav.classList.toggle("open");
  menuButton.setAttribute("aria-expanded", isOpen);
});

document.querySelectorAll("nav a").forEach((link) => {
  link.addEventListener("click", () => nav.classList.remove("open"));
});

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) entry.target.classList.add("show");
  });
}, { threshold: 0.12 });

document.querySelectorAll(".reveal").forEach((element) => observer.observe(element));

document.getElementById("topButton").addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});

function updateClock() {
  const now = new Date();
  document.getElementById("time").textContent =
    now.toLocaleTimeString("ko-KR", { hour12: false });
  document.getElementById("date").textContent =
    now.toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      weekday: "short"
    });
}

setInterval(updateClock, 1000);
updateClock();
document.getElementById("year").textContent = new Date().getFullYear();

const canvas = document.getElementById("particles");
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
    radius: Math.random() * 1.8 + 0.4,
    vx: (Math.random() - 0.5) * 0.22,
    vy: -Math.random() * 0.3 - 0.04,
    alpha: Math.random() * 0.45 + 0.08
  };
}

function resetParticles() {
  particles = Array.from({ length: 82 }, createParticle);
}

function animateParticles() {
  ctx.clearRect(0, 0, innerWidth, innerHeight);

  particles.forEach((particle) => {
    particle.x += particle.vx;
    particle.y += particle.vy;

    if (particle.y < -8) {
      Object.assign(particle, createParticle(), { y: innerHeight + 8 });
    }

    ctx.beginPath();
    ctx.fillStyle = `rgba(100,255,71,${particle.alpha})`;
    ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
    ctx.fill();
  });

  requestAnimationFrame(animateParticles);
}

addEventListener("resize", () => {
  resizeCanvas();
  resetParticles();
});

resizeCanvas();
resetParticles();
animateParticles();

setInterval(() => {
  if (Math.random() > 0.68) {
    flash.classList.add("active");
    setTimeout(() => flash.classList.remove("active"), 400);
  }
}, 5600);
