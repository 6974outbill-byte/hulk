const SETTINGS = {
  // 아래 주소만 실제 유튜브 영상 주소로 바꾸면 추천 카드가 해당 영상으로 바로 연결됩니다.
  videoLinks: [
    'https://www.youtube.com/watch?v=JEv3tsmnIpI',
    'https://www.youtube.com/watch?v=UGKBF5kjHHU',
    'https://www.youtube.com/watch?v=UENkyMqG_P4'
  ]
};

const intro=document.getElementById('intro');
const introImage=document.getElementById('introImage');
const enterBtn=document.getElementById('enterBtn');
const bgm=document.getElementById('bgm');
const musicBtn=document.getElementById('musicBtn');
const playerBtn=document.getElementById('playerBtn');
const prevBtn=document.getElementById('prevBtn');
const nextBtn=document.getElementById('nextBtn');
const seekBar=document.getElementById('seekBar');
const volumeBar=document.getElementById('volumeBar');
const volumeText=document.getElementById('volumeText');
const volumeIcon=document.getElementById('volumeIcon');
const playerCollapseBtn=document.getElementById('playerCollapseBtn');
const trackTitle=document.getElementById('trackTitle');
const timeText=document.getElementById('timeText');
const playerCard=document.querySelector('.player-card');
const fallback=[
  'Ass up ( ATMOX Remix ).mp3',
  'Avicii - The Nights (ATMOX Remix).mp3',
  'Booyah (Radio Edit).mp3',
  'Turbotronic - Disco Monster (Radio Edit)(1).mp3'
];
let playlist=[],bag=[],history=[],current=-1,keepPlaying=false,failed=new Set(),seeking=false;
bgm.volume=.4;

function fitIntro(){
  const sw=1536,sh=1024,vw=innerWidth,vh=innerHeight,scale=Math.min(vw/sw,vh/sh);
  const w=sw*scale,h=sh*scale,left=(vw-w)/2,top=(vh-h)/2;
  introImage.style.width=w+'px';introImage.style.height=h+'px';
  const b={x:515,y:760,w:525,h:114};
  Object.assign(enterBtn.style,{left:left+b.x*scale+'px',top:top+b.y*scale+'px',width:b.w*scale+'px',height:b.h*scale+'px'});
}
addEventListener('resize',fitIntro);fitIntro();

async function loadPlaylist(){
  if(playlist.length)return;
  let files=fallback;
  try{
    const r=await fetch('music/playlist.json?'+Date.now(),{cache:'no-store'});
    if(r.ok){const j=await r.json();if(Array.isArray(j)&&j.length)files=j;}
  }catch(e){console.warn('playlist.json을 불러오지 못해 기본 목록을 사용합니다.');}
  playlist=files
    .filter(x=>typeof x==='string'&&/\.(mp3|m4a|ogg|wav)$/i.test(x)&&!x.includes('Lost Control'))
    .map(x=>({title:x.replace(/\.[^.]+$/,''),src:'music/'+x.split('/').map(encodeURIComponent).join('/')}));
}
function shuffle(a){a=[...a];for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a}
function refill(){bag=shuffle(playlist.map((_,i)=>i).filter(i=>!failed.has(i)));if(bag.length>1&&bag[0]===current)[bag[0],bag[1]]=[bag[1],bag[0]]}
function loadIndex(index,{pushHistory=true}={}){
  if(index<0||!playlist[index])return false;
  if(pushHistory&&current>=0&&current!==index)history.push(current);
  current=index;
  const t=playlist[current];
  bgm.src=t.src;trackTitle.textContent=t.title;bgm.load();
  seekBar.value=0;timeText.textContent='00:00 / 00:00';
  return true;
}
function selectNext(){if(!bag.length)refill();if(!bag.length)return false;return loadIndex(bag.shift())}
function setPlayerUI(){
  const playing=!bgm.paused;
  musicBtn.querySelector('span').textContent=playing?'Ⅱ':'▶';
  playerBtn.textContent=playing?'Ⅱ':'▶';
  document.body.classList.toggle('paused',!playing);
}
async function playMusic(){
  keepPlaying=true;await loadPlaylist();
  if(!bgm.src&&!selectNext())return;
  try{await bgm.play()}catch(e){console.warn('브라우저 재생 제한 또는 파일 오류',e)}
  setPlayerUI();
}
function toggleMusic(){if(bgm.paused)playMusic();else{keepPlaying=false;bgm.pause();setPlayerUI()}}
async function nextTrack(){await loadPlaylist();if(!selectNext())return;keepPlaying=true;try{await bgm.play()}catch(e){}setPlayerUI()}
async function previousTrack(){
  await loadPlaylist();
  if(bgm.currentTime>4){bgm.currentTime=0;return;}
  const index=history.pop();
  if(index===undefined)return;
  loadIndex(index,{pushHistory:false});keepPlaying=true;
  try{await bgm.play()}catch(e){}setPlayerUI();
}

musicBtn.addEventListener('click',toggleMusic);
playerBtn.addEventListener('click',toggleMusic);
nextBtn.addEventListener('click',nextTrack);
prevBtn.addEventListener('click',previousTrack);
playerCollapseBtn.addEventListener('click',()=>{playerCard.classList.toggle('collapsed');playerCollapseBtn.textContent=playerCard.classList.contains('collapsed')?'+':'−'});

volumeBar.addEventListener('input',()=>{
  bgm.volume=Number(volumeBar.value)/100;
  volumeText.textContent=volumeBar.value+'%';
  volumeIcon.textContent=bgm.volume===0?'🔇':bgm.volume<.5?'🔉':'🔊';
});
seekBar.addEventListener('pointerdown',()=>seeking=true);
seekBar.addEventListener('pointerup',()=>seeking=false);
seekBar.addEventListener('input',()=>{if(bgm.duration)bgm.currentTime=(Number(seekBar.value)/100)*bgm.duration});

bgm.addEventListener('play',setPlayerUI);
bgm.addEventListener('pause',setPlayerUI);
bgm.addEventListener('ended',()=>{if(keepPlaying)nextTrack()});
bgm.addEventListener('error',()=>{if(current>=0)failed.add(current);if(keepPlaying)nextTrack()});
bgm.addEventListener('timeupdate',()=>{
  const d=bgm.duration||0,c=bgm.currentTime||0;
  if(!seeking)seekBar.value=d?c/d*100:0;
  const f=s=>`${Math.floor(s/60).toString().padStart(2,'0')}:${Math.floor(s%60).toString().padStart(2,'0')}`;
  timeText.textContent=`${f(c)} / ${f(d)}`;
});

enterBtn.addEventListener('click',async()=>{if(intro.classList.contains('entering'))return;intro.classList.add('entering');await playMusic();setTimeout(()=>intro.classList.add('hide'),250);setTimeout(()=>intro.remove(),1200)});

document.getElementById('themeBtn').addEventListener('click',()=>document.body.classList.toggle('soft'));
document.querySelectorAll('.main-nav a').forEach(a=>a.addEventListener('click',()=>{document.querySelectorAll('.main-nav a').forEach(x=>x.classList.remove('active'));a.classList.add('active')}));
const sections=document.querySelectorAll('.section-observe');
const observer=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){document.querySelectorAll('.main-nav a').forEach(a=>a.classList.toggle('active',a.dataset.section===e.target.id))}}),{rootMargin:'-35% 0px -55%'});sections.forEach(s=>observer.observe(s));

const petals=document.getElementById('petals');for(let i=0;i<(innerWidth<700?34:72);i++){const p=document.createElement('i');p.className='petal';p.style.left=Math.random()*100+'%';p.style.setProperty('--s',8+Math.random()*14+'px');p.style.setProperty('--o',.25+Math.random()*.6);p.style.setProperty('--d',8+Math.random()*10+'s');p.style.setProperty('--delay',-Math.random()*16+'s');p.style.setProperty('--drift',-120+Math.random()*240+'px');petals.appendChild(p)}

const lightbox=document.getElementById('lightbox'),lightImg=lightbox.querySelector('img');document.querySelectorAll('.gallery-item').forEach(b=>b.addEventListener('click',()=>{lightImg.src=b.querySelector('img').src;lightbox.classList.add('show');lightbox.setAttribute('aria-hidden','false')}));lightbox.addEventListener('click',e=>{if(e.target===lightbox||e.target.tagName==='BUTTON'){lightbox.classList.remove('show');lightbox.setAttribute('aria-hidden','true')}});

SETTINGS.videoLinks.forEach((url,index)=>{const link=document.getElementById(`videoLink${index+1}`);if(link&&url)link.href=url});
document.getElementById('year').textContent=new Date().getFullYear();
setPlayerUI();


// V6.3 cinematic particle field + mouse parallax
(() => {
  const canvas = document.getElementById('fxCanvas');
  if (!canvas || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const ctx = canvas.getContext('2d', { alpha: true });
  let dpr = Math.min(devicePixelRatio || 1, 2), w = 0, h = 0, raf = 0;
  let pointerX = 0, pointerY = 0, targetX = 0, targetY = 0;
  const petalsFx = [], sparks = [], dust = [];
  const rnd = (a,b) => a + Math.random() * (b-a);

  function resize(){
    w = innerWidth; h = innerHeight; dpr = Math.min(devicePixelRatio || 1, 2);
    canvas.width = Math.round(w*dpr); canvas.height = Math.round(h*dpr);
    canvas.style.width = w+'px'; canvas.style.height = h+'px';
    ctx.setTransform(dpr,0,0,dpr,0,0);
  }
  function makePetal(reset=false){
    return {x:rnd(-80,w+80),y:reset?rnd(-h,0):rnd(0,h),s:rnd(4,13),vx:rnd(-.65,.85),vy:rnd(.55,1.7),rot:rnd(0,Math.PI*2),vr:rnd(-.045,.055),a:rnd(.28,.88),wave:rnd(0,Math.PI*2)};
  }
  function makeSpark(reset=false){
    return {x:rnd(0,w),y:reset?rnd(h*.45,h+80):rnd(0,h),r:rnd(.7,2.4),vx:rnd(-.18,.18),vy:rnd(-.75,-.18),a:rnd(.18,.85),life:rnd(120,360),hue:rnd(320,355)};
  }
  function makeDust(){return {x:rnd(0,w),y:rnd(0,h),r:rnd(.3,1.4),a:rnd(.08,.4),phase:rnd(0,Math.PI*2),speed:rnd(.005,.02)}}
  function seed(){
    petalsFx.length=sparks.length=dust.length=0;
    const compact=w<700;
    for(let i=0;i<(compact?45:105);i++) petalsFx.push(makePetal());
    for(let i=0;i<(compact?42:95);i++) sparks.push(makeSpark());
    for(let i=0;i<(compact?55:130);i++) dust.push(makeDust());
  }
  addEventListener('resize',()=>{resize();seed()},{passive:true});
  addEventListener('pointermove',e=>{
    targetX=(e.clientX/w-.5)*24; targetY=(e.clientY/h-.5)*18;
    document.documentElement.style.setProperty('--px',targetX+'px');
    document.documentElement.style.setProperty('--py',targetY+'px');
    document.documentElement.style.setProperty('--px-soft',(targetX*.55)+'px');
    document.documentElement.style.setProperty('--py-soft',(targetY*.55)+'px');
  },{passive:true});
  addEventListener('pointerleave',()=>{targetX=targetY=0},{passive:true});

  function drawPetal(p,t){
    p.wave += .018; p.x += p.vx + Math.sin(p.wave)*.65 + pointerX*.003; p.y += p.vy; p.rot += p.vr;
    if(p.y>h+30 || p.x<-120 || p.x>w+120) Object.assign(p,makePetal(true));
    ctx.save();ctx.translate(p.x,p.y);ctx.rotate(p.rot);ctx.globalAlpha=p.a;
    const g=ctx.createLinearGradient(-p.s,0,p.s,0);g.addColorStop(0,'rgba(255,214,235,.95)');g.addColorStop(.55,'rgba(255,82,167,.95)');g.addColorStop(1,'rgba(143,24,92,.75)');
    ctx.fillStyle=g;ctx.shadowColor='rgba(255,69,164,.8)';ctx.shadowBlur=8;
    ctx.beginPath();ctx.moveTo(0,-p.s*.35);ctx.bezierCurveTo(p.s*.9,-p.s*.8,p.s*.95,p.s*.35,0,p.s*.55);ctx.bezierCurveTo(-p.s*.9,p.s*.25,-p.s*.7,-p.s*.65,0,-p.s*.35);ctx.fill();ctx.restore();
  }
  function drawSpark(s){
    s.x+=s.vx+pointerX*.0015;s.y+=s.vy;s.life--;
    if(s.life<0||s.y<-20) Object.assign(s,makeSpark(true));
    const pulse=.55+.45*Math.sin(s.life*.08);
    ctx.globalAlpha=s.a*pulse;ctx.fillStyle=`hsl(${s.hue} 100% 68%)`;ctx.shadowColor=`hsla(${s.hue},100%,65%,.9)`;ctx.shadowBlur=12;
    ctx.beginPath();ctx.arc(s.x,s.y,s.r,0,Math.PI*2);ctx.fill();
  }
  function frame(t){
    pointerX += (targetX-pointerX)*.045; pointerY += (targetY-pointerY)*.045;
    ctx.clearRect(0,0,w,h);ctx.globalCompositeOperation='lighter';
    for(const d of dust){d.phase+=d.speed;ctx.globalAlpha=d.a*(.45+.55*Math.sin(d.phase));ctx.fillStyle='#ff8ac7';ctx.beginPath();ctx.arc(d.x+pointerX*.08,d.y+pointerY*.08,d.r,0,Math.PI*2);ctx.fill()}
    for(const s of sparks) drawSpark(s);
    ctx.globalCompositeOperation='source-over';
    for(const p of petalsFx) drawPetal(p,t);
    ctx.globalAlpha=1;ctx.shadowBlur=0;raf=requestAnimationFrame(frame);
  }
  resize();seed();frame(0);
})();
