const $=s=>document.querySelector(s);const $$=s=>[...document.querySelectorAll(s)];
const intro=$('#intro'),enter=$('#enterBtn');
$$('.topbar nav a').forEach(a=>a.addEventListener('click',()=>{$$('.topbar nav a').forEach(x=>x.classList.remove('active'));a.classList.add('active')}));
const lb=$('#lightbox'),lbImg=lb?.querySelector('img');$$('.gallery-card').forEach(b=>b.addEventListener('click',()=>{lbImg.src=b.querySelector('img').src;lb.classList.add('show')}));lb?.querySelector('button')?.addEventListener('click',()=>lb.classList.remove('show'));lb?.addEventListener('click',e=>{if(e.target===lb)lb.classList.remove('show')});

const audio=$('#bgm'),player=$('#playerCard'),playBtn=$('#playerBtn'),musicBtn=$('#musicBtn'),prev=$('#prevBtn'),next=$('#nextBtn'),seek=$('#seekBar'),vol=$('#volumeBar'),title=$('#trackTitle'),cur=$('#currentTime'),dur=$('#duration'),volText=$('#volumeText'),status=$('#playerStatus'),collapseBtn=$('#playerCollapseBtn');
let tracks=[],idx=0,shuffle=false,repeat=false,ready=false;
const fallbackTracks=["Ass up ( ATMOX Remix ).mp3","Avicii - The Nights (ATMOX Remix).mp3","Booyah (Radio Edit).mp3","Turbotronic - Disco Monster (Radio Edit)(1).mp3"];
function labelFor(t){const f=typeof t==='string'?t:(t.file||t.src||'');return (typeof t==='object'&&t.title)||decodeURIComponent(f).replace(/\.mp3$/i,'')}
function fileFor(t){return typeof t==='string'?t:(t.file||t.src||'')}
async function loadTracks(){try{const r=await fetch('music/playlist.json?v=680',{cache:'no-store'});if(!r.ok)throw new Error('playlist');tracks=await r.json();if(!Array.isArray(tracks)||!tracks.length)throw new Error('empty')}catch{tracks=fallbackTracks}idx=Math.floor(Math.random()*tracks.length);setTrack(idx);ready=true;status.textContent='재생 준비 완료'}
function setTrack(i){if(!tracks.length)return;idx=(i+tracks.length)%tracks.length;const t=tracks[idx],file=fileFor(t);title.textContent=labelFor(t);audio.src='music/'+encodeURIComponent(file).replace(/%2F/g,'/');audio.load();seek.value=0;cur.textContent='00:00';dur.textContent='00:00'}
function setPlaying(on){playBtn.textContent=on?'Ⅱ':'▶';musicBtn.textContent=on?'Ⅱ':'▷';player?.classList.toggle('is-playing',on);status.textContent=on?'재생 중':'일시정지'}
async function playAudio(){if(!ready)await loadTracks();try{await audio.play();setPlaying(true);return true}catch(err){setPlaying(false);status.textContent='재생 버튼을 한 번 눌러주세요';return false}}
function pauseAudio(){audio.pause();setPlaying(false)}
async function toggle(){audio.paused?await playAudio():pauseAudio()}
enter?.addEventListener('click',async()=>{intro?.classList.add('hide');await playAudio()});
playBtn?.addEventListener('click',toggle);musicBtn?.addEventListener('click',toggle);
prev?.addEventListener('click',async()=>{setTrack(idx-1);await playAudio()});next?.addEventListener('click',async()=>{setTrack(shuffle?Math.floor(Math.random()*tracks.length):idx+1);await playAudio()});
$('#shuffleBtn')?.addEventListener('click',e=>{shuffle=!shuffle;e.currentTarget.style.color=shuffle?'#ff58b4':''});$('#repeatBtn')?.addEventListener('click',e=>{repeat=!repeat;e.currentTarget.style.color=repeat?'#ff58b4':''});
collapseBtn?.addEventListener('click',()=>{const c=player.classList.toggle('collapsed');collapseBtn.textContent=c?'+':'−'});
audio.addEventListener('loadedmetadata',()=>{dur.textContent=fmt(audio.duration)});audio.addEventListener('canplay',()=>{if(!audio.paused)status.textContent='재생 중'});audio.addEventListener('playing',()=>setPlaying(true));audio.addEventListener('pause',()=>{if(!audio.ended)setPlaying(false)});audio.addEventListener('error',()=>{status.textContent='음원 파일을 불러오지 못했습니다.';setPlaying(false)});
audio.addEventListener('timeupdate',()=>{if(Number.isFinite(audio.duration)&&audio.duration>0){seek.value=audio.currentTime/audio.duration*100;cur.textContent=fmt(audio.currentTime);dur.textContent=fmt(audio.duration)}});seek?.addEventListener('input',()=>{if(Number.isFinite(audio.duration)&&audio.duration>0)audio.currentTime=seek.value/100*audio.duration});vol?.addEventListener('input',()=>{audio.volume=vol.value/100;volText.textContent=vol.value+'%'});audio.volume=.7;
audio.addEventListener('ended',async()=>{if(repeat){audio.currentTime=0}else setTrack(shuffle?Math.floor(Math.random()*tracks.length):idx+1);await playAudio()});function fmt(s){s=Math.floor(s||0);return String(Math.floor(s/60)).padStart(2,'0')+':'+String(s%60).padStart(2,'0')}

const cv=$('#fxCanvas'),ctx=cv.getContext('2d');let petals=[];function resize(){cv.width=innerWidth;cv.height=innerHeight}addEventListener('resize',resize);resize();for(let i=0;i<85;i++)petals.push({x:Math.random()*innerWidth,y:Math.random()*innerHeight,r:2+Math.random()*5,s:.35+Math.random()*1.1,d:Math.random()*6.28});function draw(){ctx.clearRect(0,0,cv.width,cv.height);for(const p of petals){p.y+=p.s;p.x+=Math.sin(p.d+=.01)*.45;if(p.y>innerHeight+10){p.y=-10;p.x=Math.random()*innerWidth}ctx.save();ctx.translate(p.x,p.y);ctx.rotate(p.d);ctx.fillStyle='rgba(255,86,177,.7)';ctx.beginPath();ctx.ellipse(0,0,p.r,p.r*.55,0,0,Math.PI*2);ctx.fill();ctx.restore()}requestAnimationFrame(draw)}draw();loadTracks();

// V6.9 loader, transitions, reveals and light performance helpers
const pageLoader=document.querySelector('#pageLoader');
const loaderBar=pageLoader?.querySelector('.loader-line i');
const loaderPercent=document.querySelector('#loaderPercent');
let loadProgress=0;
const loaderTimer=setInterval(()=>{loadProgress=Math.min(loadProgress+Math.ceil(Math.random()*11),92);if(loaderBar)loaderBar.style.width=loadProgress+'%';if(loaderPercent)loaderPercent.textContent=loadProgress+'%'},90);
window.addEventListener('load',()=>{clearInterval(loaderTimer);if(loaderBar)loaderBar.style.width='100%';if(loaderPercent)loaderPercent.textContent='100%';setTimeout(()=>pageLoader?.classList.add('done'),260)},{once:true});
setTimeout(()=>pageLoader?.classList.add('done'),4500);

const transition=document.querySelector('#pageTransition');
document.querySelectorAll('a[href^="#"]').forEach(a=>a.addEventListener('click',e=>{const target=document.querySelector(a.getAttribute('href'));if(!target)return;e.preventDefault();transition?.classList.add('show');setTimeout(()=>{target.scrollIntoView({behavior:'smooth',block:'start'});setTimeout(()=>transition?.classList.remove('show'),230)},170)}));
const revealObserver=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('in-view');revealObserver.unobserve(entry.target)}}),{threshold:.12,rootMargin:'0px 0px -40px'});document.querySelectorAll('.reveal-section').forEach(el=>revealObserver.observe(el));
const sections=[...document.querySelectorAll('main section[id]')];const navLinks=[...document.querySelectorAll('.topbar nav a')];const sectionObserver=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){navLinks.forEach(a=>a.classList.toggle('active',a.getAttribute('href')==='#'+entry.target.id))}}),{rootMargin:'-30% 0px -60%'});sections.forEach(s=>sectionObserver.observe(s));
const themeBtn=document.querySelector('#themeBtn');themeBtn?.addEventListener('click',()=>{document.body.classList.toggle('light-neon');themeBtn.textContent=document.body.classList.contains('light-neon')?'✦':'☾'});
document.querySelectorAll('img').forEach(img=>{if(!img.hasAttribute('decoding'))img.decoding='async'});
