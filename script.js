
const SETTINGS = {
  youtube: "https://www.youtube.com/",
  instagram: "https://www.instagram.com/",
  email: "your@email.com"
};

const bgm = document.getElementById("bgm");
const enterGate = document.getElementById("enterGate");
const startExperience = document.getElementById("startExperience");
const musicControl = document.getElementById("musicControl");
const musicIcon = document.getElementById("musicIcon");
const musicLabel = document.getElementById("musicLabel");
const flashLayer = document.getElementById("flashLayer");
const themeToggle = document.getElementById("themeToggle");
const menuBtn = document.getElementById("menuBtn");
const navMenu = document.getElementById("navMenu");

document.querySelector(".youtube").href = SETTINGS.youtube;
document.querySelector(".instagram").href = SETTINGS.instagram;
document.querySelector('a[href^="mailto:"]').href = `mailto:${SETTINGS.email}`;

bgm.volume = 0.4;
bgm.loop = true;

function updateMusicUI(){
  const on = !bgm.paused;
  musicIcon.textContent = on ? "❚❚" : "▶";
  musicLabel.textContent = on ? "MUSIC ON · 40%" : "MUSIC OFF";
}
async function playMusic(){
  try{ await bgm.play(); }catch(e){ console.warn("자동 재생이 차단되었습니다.", e); }
  updateMusicUI();
}
startExperience.addEventListener("click", async ()=>{
  flashLayer.classList.add("active");
  setTimeout(()=>flashLayer.classList.remove("active"),500);
  document.body.animate(
    [{transform:"translate(0,0)"},{transform:"translate(-8px,5px)"},{transform:"translate(7px,-4px)"},{transform:"translate(0,0)"}],
    {duration:420}
  );
  enterGate.classList.add("hide");
  await playMusic();
});
musicControl.addEventListener("click", async ()=>{
  if(bgm.paused) await playMusic();
  else{ bgm.pause(); updateMusicUI(); }
});
bgm.addEventListener("play",updateMusicUI);
bgm.addEventListener("pause",updateMusicUI);
updateMusicUI();

menuBtn.addEventListener("click",()=>{
  const open = navMenu.classList.toggle("open");
  menuBtn.setAttribute("aria-expanded",open);
});
document.querySelectorAll("nav a").forEach(a=>a.addEventListener("click",()=>navMenu.classList.remove("open")));

themeToggle.addEventListener("click",()=>{
  document.body.classList.toggle("light-mode");
  themeToggle.textContent = document.body.classList.contains("light-mode") ? "☀" : "☾";
});

const observer = new IntersectionObserver(entries=>{
  entries.forEach(entry=>{
    if(entry.isIntersecting) entry.target.classList.add("show");
  });
},{threshold:.13});
document.querySelectorAll(".reveal").forEach(el=>observer.observe(el));

const toTop = document.getElementById("toTop");
toTop.addEventListener("click",()=>window.scrollTo({top:0,behavior:"smooth"}));

function updateClock(){
  const now = new Date();
  document.getElementById("liveClock").textContent = now.toLocaleTimeString("ko-KR",{hour12:false});
  document.getElementById("liveDate").textContent = now.toLocaleDateString("ko-KR",{year:"numeric",month:"2-digit",day:"2-digit",weekday:"short"});
}
setInterval(updateClock,1000); updateClock();
document.getElementById("year").textContent = new Date().getFullYear();

// Gamma particles
const canvas = document.getElementById("particleCanvas");
const ctx = canvas.getContext("2d");
let particles = [];
function resize(){
  canvas.width = innerWidth * devicePixelRatio;
  canvas.height = innerHeight * devicePixelRatio;
  canvas.style.width = innerWidth+"px";
  canvas.style.height = innerHeight+"px";
  ctx.setTransform(devicePixelRatio,0,0,devicePixelRatio,0,0);
}
function makeParticle(){
  return {
    x:Math.random()*innerWidth,
    y:Math.random()*innerHeight,
    r:Math.random()*2+0.5,
    vx:(Math.random()-.5)*.25,
    vy:-Math.random()*.35-.05,
    a:Math.random()*.55+.1
  };
}
function initParticles(){ particles = Array.from({length:90},makeParticle); }
function animate(){
  ctx.clearRect(0,0,innerWidth,innerHeight);
  for(const p of particles){
    p.x+=p.vx; p.y+=p.vy;
    if(p.y<-10) Object.assign(p,makeParticle(),{y:innerHeight+10});
    ctx.beginPath();
    ctx.fillStyle=`rgba(101,255,69,${p.a})`;
    ctx.arc(p.x,p.y,p.r,0,Math.PI*2);
    ctx.fill();
  }
  requestAnimationFrame(animate);
}
addEventListener("resize",()=>{resize();initParticles()});
resize();initParticles();animate();

// Random lightning flash
setInterval(()=>{
  if(Math.random()>.56){
    flashLayer.classList.add("active");
    setTimeout(()=>flashLayer.classList.remove("active"),450);
  }
},4800);
