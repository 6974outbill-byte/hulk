const menuBtn = document.getElementById('menuBtn');
const navMenu = document.getElementById('navMenu');

menuBtn.addEventListener('click', () => {
  const isOpen = navMenu.classList.toggle('open');
  menuBtn.setAttribute('aria-expanded', isOpen);
});

document.querySelectorAll('nav a').forEach(link => {
  link.addEventListener('click', () => {
    navMenu.classList.remove('open');
    menuBtn.setAttribute('aria-expanded', 'false');
  });
});

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) entry.target.classList.add('show');
  });
}, { threshold: 0.14 });

document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
document.getElementById('year').textContent = new Date().getFullYear();

window.addEventListener('mousemove', (e) => {
  const x = (e.clientX / window.innerWidth - 0.5) * 10;
  const y = (e.clientY / window.innerHeight - 0.5) * 10;
  document.documentElement.style.setProperty('--mx', `${x}px`);
  document.documentElement.style.setProperty('--my', `${y}px`);
});


// ===== 미치카츠 V2 설정 =====
const SOCIAL_LINKS = {
  youtube: "https://www.youtube.com/",
  instagram: "https://www.instagram.com/"
};

const youtubeLink = document.querySelector(".social-card.youtube");
const instagramLink = document.querySelector(".social-card.instagram");
if (youtubeLink) youtubeLink.href = SOCIAL_LINKS.youtube;
if (instagramLink) instagramLink.href = SOCIAL_LINKS.instagram;

const bgm = document.getElementById("bgm");
const startExperience = document.getElementById("startExperience");
const enterGate = document.getElementById("enterGate");
const musicControl = document.getElementById("musicControl");
const musicIcon = document.getElementById("musicIcon");
const musicLabel = document.getElementById("musicLabel");

bgm.volume = 0.4;
bgm.loop = true;

function updateMusicUI() {
  const playing = !bgm.paused;
  musicIcon.textContent = playing ? "❚❚" : "▶";
  musicLabel.textContent = playing ? "MUSIC ON · 40%" : "MUSIC OFF";
}

async function playMusic() {
  try { await bgm.play(); }
  catch (error) { console.warn("브라우저가 자동 재생을 차단했습니다.", error); }
  updateMusicUI();
}

startExperience.addEventListener("click", async () => {
  enterGate.classList.add("hide");
  await playMusic();
});

musicControl.addEventListener("click", async () => {
  if (bgm.paused) await playMusic();
  else { bgm.pause(); updateMusicUI(); }
});

bgm.addEventListener("play", updateMusicUI);
bgm.addEventListener("pause", updateMusicUI);
updateMusicUI();
