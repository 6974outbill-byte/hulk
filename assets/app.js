(() => {
  const C = window.SITE_CONFIG || {};
  const $ = s => document.querySelector(s);
  const $$ = s => document.querySelectorAll(s);
  const intro = $("#intro");
  const launcher = $("#launcher");
  const bgm = $("#bgm");

  const store = {
    get(k, d) { try { const v = localStorage.getItem(k); return v === null ? d : JSON.parse(v); } catch { return d; } },
    set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} }
  };

  let progress = 0;
  const timer = setInterval(() => {
    progress = Math.min(100, progress + 10);
    $("#loadBar").style.width = progress + "%";
    $("#loadText").textContent = "LOADING " + progress + "%";
    if (progress >= 100) {
      clearInterval(timer);
      $("#loadText").textContent = "READY";
      $("#enterBtn").disabled = false;
      $("#silentBtn").disabled = false;
    }
  }, 55);

  let musicOn = store.get("gw_music_on", true);
  let volume = store.get("gw_volume", 45);
  let track = -1;
  $("#volume").value = volume;
  $("#volText").textContent = volume + "%";
  bgm.volume = volume / 100;

  function chooseTrack() {
    if (!C.music?.length) return false;
    let n = Math.floor(Math.random() * C.music.length);
    if (C.music.length > 1 && n === track) n = (n + 1) % C.music.length;
    track = n;
    bgm.src = C.music[track];
    return true;
  }

  function setMusicUI(on) {
    $("#musicStatus").textContent = on ? "ON" : "OFF";
  }

  async function playMusic() {
    if (!musicOn) return;
    if (!bgm.src && !chooseTrack()) return;
    try { await bgm.play(); setMusicUI(true); } catch { setMusicUI(false); }
  }

  function enter(withMusic) {
    intro.classList.add("hide");
    launcher.classList.add("show");
    launcher.setAttribute("aria-hidden", "false");
    if (withMusic) playMusic();
  }

  $("#enterBtn").addEventListener("click", () => enter(true));
  $("#silentBtn").addEventListener("click", () => enter(false));
  $("#musicToggle").addEventListener("click", () => {
    musicOn = !musicOn;
    store.set("gw_music_on", musicOn);
    if (musicOn) playMusic(); else { bgm.pause(); setMusicUI(false); }
  });
  bgm.addEventListener("ended", () => { chooseTrack(); if (musicOn) playMusic(); });
  $("#volume").addEventListener("input", e => {
    volume = Number(e.target.value);
    bgm.volume = volume / 100;
    $("#volText").textContent = volume + "%";
    store.set("gw_volume", volume);
  });

  const labels = {
    home:["OVERVIEW","GODWUBIN TV"],
    latest:["YOUTUBE","LATEST VIDEO"],
    shorts:["SHORT FORM","LATEST SHORTS"],
    live:["AUTO STATUS","LIVE"],
    support:["DONATION","SUPPORT CREATOR"],
    about:["PROFILE","ABOUT GODWUBIN"]
  };

  function switchTab(name) {
    $$(".view").forEach(v => v.classList.remove("active"));
    $("#view-" + name)?.classList.add("active");
    $$("[data-tab]").forEach(b => b.classList.toggle("active", b.dataset.tab === name));
    $("#viewLabel").textContent = labels[name][0];
    $("#viewTitle").textContent = labels[name][1];
  }

  $$("[data-tab]").forEach(el => el.addEventListener("click", e => {
    e.preventDefault();
    switchTab(el.dataset.tab);
  }));

  function tick() {
    $("#clock").textContent = new Date().toLocaleTimeString("ko-KR",{hour:"2-digit",minute:"2-digit",hour12:false});
  }
  tick(); setInterval(tick, 1000);

  $("#toonationLink").href = C.toonationUrl || "#";
  $("#twipLink").href = C.twipUrl || "#";
  $("#aboutText").textContent = C.about || "";

  const canvas = $("#particles");
  const ctx = canvas.getContext("2d");
  let pts = [];
  function resize() {
    canvas.width = innerWidth; canvas.height = innerHeight;
    pts = Array.from({length: innerWidth < 700 ? 22 : 45}, () => ({
      x:Math.random()*canvas.width,y:Math.random()*canvas.height,r:Math.random()*1.2+.2,v:Math.random()*.15+.03
    }));
  }
  function draw() {
    ctx.clearRect(0,0,canvas.width,canvas.height);
    ctx.fillStyle = "rgba(65,200,255,.32)";
    for (const p of pts) {
      p.y -= p.v;
      if (p.y < -3) p.y = canvas.height + 3;
      ctx.beginPath(); ctx.arc(p.x,p.y,p.r,0,Math.PI*2); ctx.fill();
    }
    requestAnimationFrame(draw);
  }
  resize(); draw(); addEventListener("resize", resize);

  const esc = s => String(s||"").replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[m]));
  const embed = id => `<iframe src="https://www.youtube-nocookie.com/embed/${encodeURIComponent(id)}?autoplay=1&mute=1&rel=0&playsinline=1" allow="autoplay; encrypted-media; picture-in-picture" allowfullscreen title="GODWUBIN TV latest video"></iframe>`;

  function setOffline() {
    $("#homeLiveTitle").textContent = "OFFLINE";
    $("#homeLiveText").textContent = "방송 준비 중";
    $("#rightLive").textContent = "OFFLINE";
    $("#liveBadge").innerHTML = "<i></i> OFFLINE";
    $("#liveTitle").textContent = "현재 방송 준비 중";
    $("#liveText").textContent = "방송이 시작되면 자동으로 LIVE NOW 상태로 변경됩니다.";
    $("#liveTerm").textContent = "OFFLINE";
  }

  function fallback(message) {
    const videos = C.fallbackVideos || [];
    const shorts = C.fallbackShorts || [];
    const first = videos[0] || {};
    $("#playerBox").innerHTML = `<a class="local-preview" href="${first.url || C.youtubeUrl}" target="_blank"><img src="${first.thumbnail || "assets/logo.jpg"}"><div><b>▶ GODWUBIN TV</b><span>${esc(message)}</span><small>클릭하면 유튜브 채널로 이동합니다.</small></div></a>`;
    $("#latestTitle").textContent = first.title || "GODWUBIN TV 최신 영상";
    $("#latestDesc").textContent = first.description || "";
    $("#latestDate").textContent = first.publishedAt || "AUTO";
    $("#latestLink").href = first.url || C.youtubeUrl;
    $("#homeLatestTitle").textContent = first.title || "GODWUBIN TV 최신 영상";
    $("#rightTitle").textContent = first.title || "GODWUBIN TV 최신 영상";
    $("#rightDate").textContent = first.publishedAt || "AUTO";
    $("#rightThumb").src = first.thumbnail || "assets/logo.jpg";
    $("#videoCards").innerHTML = videos.map(v=>`<a class="video-card" href="${v.url}" target="_blank"><img src="${v.thumbnail}"><div><small>${esc(v.publishedAt)}</small><h3>${esc(v.title)}</h3></div></a>`).join("");
    $("#shortCards").innerHTML = shorts.map(v=>`<a class="short-card" href="${v.url}" target="_blank"><img src="${v.thumbnail}"><h3>${esc(v.title)}</h3></a>`).join("");
    setOffline();
  }

  async function loadYT() {
    if (location.protocol === "file:") return fallback("PC 로컬 미리보기");
    try {
      const r = await fetch("api/youtube",{cache:"no-store"});
      if (!r.ok) throw new Error();
      const d = await r.json();
      const videos = d.videos || [], shorts = d.shorts || [], live = d.live;

      if (videos[0]) {
        const v = videos[0];
        $("#playerBox").innerHTML = embed(v.id);
        $("#latestTitle").textContent = v.title;
        $("#latestDesc").textContent = v.description || "";
        $("#latestDate").textContent = (v.publishedAt||"").slice(0,10);
        $("#latestLink").href = "https://youtu.be/" + v.id;
        $("#homeLatestTitle").textContent = v.title;
        $("#rightTitle").textContent = v.title;
        $("#rightDate").textContent = (v.publishedAt||"").slice(0,10);
        $("#rightThumb").src = v.thumbnail;
      }

      $("#videoCards").innerHTML = videos.slice(1,4).map(v=>`<a class="video-card" href="https://youtu.be/${v.id}" target="_blank"><img src="${v.thumbnail}"><div><small>${(v.publishedAt||"").slice(0,10)}</small><h3>${esc(v.title)}</h3></div></a>`).join("") || $("#videoCards").innerHTML;
      $("#shortCards").innerHTML = shorts.slice(0,4).map(v=>`<a class="short-card" href="https://youtube.com/shorts/${v.id}" target="_blank"><img src="${v.thumbnail}"><h3>${esc(v.title)}</h3></a>`).join("") || $("#shortCards").innerHTML;

      if (live) {
        $("#homeLiveTitle").textContent = "LIVE NOW";
        $("#homeLiveText").textContent = live.title;
        $("#rightLive").textContent = "LIVE NOW";
        $("#liveBadge").innerHTML = "<i></i> LIVE NOW";
        $("#liveTitle").textContent = live.title;
        $("#liveText").textContent = "현재 방송 중입니다. 지금 바로 참여하세요.";
        $("#liveThumb").src = live.thumbnail || "assets/logo.jpg";
        $("#liveLink").href = "https://youtu.be/" + live.id;
        $("#liveTerm").textContent = "LIVE NOW";
      } else setOffline();
    } catch {
      fallback("YouTube API 미설정 상태");
    }
  }

  fallback("화면 준비 완료");
  loadYT();
  if (location.protocol !== "file:") setInterval(loadYT,60000);
})();