/* /tg/player.js */
/* =========================================================
  MOLOTOV AUDIO PLAYER — TG FULLSCREEN (BETA)
  Автор: Van Molotov
  UI: плеер + вкладки снизу (playlist/live/info)
========================================================= */
(function(){
  const COMMON_COVER = "https://raw.githubusercontent.com/Vanmolotov/Van-Molotov/main/sq%20yt1.jpg";
  const PLAYER_BG   = "https://raw.githubusercontent.com/Vanmolotov/Van-Molotov/main/sq%20yt1.jpg";

  const TRACKS = [
    { title:"CUTRIN - SBS FEST MIX 2024", artist:"Molotov х Sight By Sight", src:"https://pub-d2a415803b364284a1985f355a9cd244.r2.dev/tracks/Cutrin.mp3" },
    { title:"Maks Solo - SBS FEST MIX 2024", artist:"Molotov х Sight By Sight", src:"https://pub-d2a415803b364284a1985f355a9cd244.r2.dev/tracks/Maks%20Solo.mp3" },
    { title:"B-founder - SBS LIVE 2024.", artist:"Molotov х Sight By Sight", src:"https://pub-d2a415803b364284a1985f355a9cd244.r2.dev/tracks/B-founder%20-%20SBS%20LIVE%20%40%2030.11.2024.mp3" },
    { title:"BAADWRK - SBS LIVE 2022", artist:"Molotov х Sight By Sight", src:"https://pub-d2a415803b364284a1985f355a9cd244.r2.dev/tracks/BAADWRK%20-%20SBS%20LIVE%20%40%20Sight%20By%20Sight%2026.11.2022.mp3" },
    { title:"Costa - SBS LIVE 2022", artist:"Molotov х Sight By Sight", src:"https://pub-d2a415803b364284a1985f355a9cd244.r2.dev/tracks/Costa%20-%20SBS%20LIVE%20%40%20Sight%20By%20Sight%2030.04.2022.mp3" },
    { title:"Maks Solo - SBS LIVE 2022", artist:"Molotov х Sight By Sight", src:"https://pub-d2a415803b364284a1985f355a9cd244.r2.dev/tracks/Maks%20Solo%20-%20SBS%20LIVE%20%40%20Sight%20By%20Sight%2026.11.2022.mp3" },
    { title:"Graved - SBS FEST MIX 2024", artist:"Molotov х Sight By Sight", src:"https://pub-d2a415803b364284a1985f355a9cd244.r2.dev/tracks/Graved.mp3" },
    { title:"Maks Solo - SBS FEST 2025", artist:"Molotov х Sight By Sight", src:"https://pub-d2a415803b364284a1985f355a9cd244.r2.dev/tracks/Maks%20Solo%20%40%20SBS%20FEST%202025.mp3" },
    { title:"Lowriderz - SBS LIVE 2024", artist:"Molotov х Sight By Sight", src:"https://pub-d2a415803b364284a1985f355a9cd244.r2.dev/tracks/Lowriderz%20%20-%20SBS%20LIVE%20%40%2030.11.2024.mp3" },
    { title:"Malinoviy John - SBS FEST MIX 2024", artist:"Molotov х Sight By Sight", src:"https://pub-d2a415803b364284a1985f355a9cd244.r2.dev/tracks/Malinoviy%20John.mp3" },
    { title:"Spacexzol - SBS FEST MIX 2024", artist:"Molotov х Sight By Sight", src:"https://pub-d2a415803b364284a1985f355a9cd244.r2.dev/tracks/Spacexzol.mp3" },
    { title:"Dispa - SBS FEST MIX 2024", artist:"Molotov х Sight By Sight", src:"https://pub-d2a415803b364284a1985f355a9cd244.r2.dev/tracks/Dispa.mp3" }
  ];

  const START_VOLUME = 0.85;
  const AUTONEXT = true;

  // SAVE / RESTORE
  const STORE_KEY = "mt_audio_player_state_tg_v2";
  const SAVE_THROTTLE_MS = 900;

  // INFO
  const INFO_TITLE = "ИНФО / АВТОРСКИЕ ПРАВА";
  const INFO_TEXT_HTML =
    "Плеер — <b>MOLOTOV AUDIO PLAYER (BETA)</b>. Автор: <b>Van Molotov</b>.<br><br>" +
    "Материалы используются в <b>некоммерческих целях</b> (для ознакомления/комьюнити).<br>" +
    "Если у правообладателя есть вопросы или запрос на удаление — <b>удалим контент</b> по первому обращению.<br><br>" +
    "Связь: <a href='mailto:support@molotov.store'>support@molotov.store</a>";

  // LIVE
  const LIVE_TITLE = "ПОСЛЕДНИЙ СТРИМ / VK";
  const LIVE_VK_IFRAME_SRC = "https://vk.com/video_ext.php?oid=-38901360&id=456240842&autoplay=1";
  const LIVE_HINT = "MOLOTOV LIVE®.";

  const ICONS = {
    play: `<svg viewBox="0 0 24 24"><path d="M8 5v14l12-7z"/></svg>`,
    pause:`<svg viewBox="0 0 24 24"><path d="M6 5h4v14H6zm8 0h4v14h-4z"/></svg>`,
    prev: `<svg viewBox="0 0 24 24"><path d="M6 6h2v12H6zM20 18 9 12l11-6z"/></svg>`,
    next: `<svg viewBox="0 0 24 24"><path d="M16 6h2v12h-2zM4 18l11-6L4 6z"/></svg>`,
    stop: `<svg viewBox="0 0 24 24"><path d="M6 6h12v12H6z"/></svg>`,
    list: `<svg viewBox="0 0 24 24"><path d="M4 6h16v2H4zm0 5h16v2H4zm0 5h16v2H4z"/></svg>`,
    info: `<svg viewBox="0 0 24 24"><path d="M11 10h2v7h-2v-7zm0-3h2v2h-2V7zm1-5C6.486 2 2 6.486 2 12s4.486 10 10 10 10-4.486 10-10S17.514 2 12 2zm0 18c-4.411 0-8-3.589-8-8s3.589-8 8-8 8 3.589 8 8-3.589 8-8 8z"/></svg>`
  };

  function escapeHtml(str){
    return String(str||"")
      .replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;")
      .replaceAll('"',"&quot;").replaceAll("'","&#039;");
  }
  function clamp(n,a,b){ return Math.min(b, Math.max(a,n)); }
  function safeParse(json){ try{ return JSON.parse(json); }catch(e){ return null; } }

  function loadState(){
    const st = safeParse(localStorage.getItem(STORE_KEY));
    if(!st || typeof st !== "object") return null;
    const out = { idx:0, time:0, vol:START_VOLUME };
    if(Number.isFinite(st.idx)) out.idx = st.idx;
    if(Number.isFinite(st.time)) out.time = st.time;
    if(Number.isFinite(st.vol)) out.vol = st.vol;
    out.idx = clamp(parseInt(out.idx,10) || 0, 0, Math.max(0, TRACKS.length - 1));
    out.time = Math.max(0, out.time);
    out.vol = clamp(out.vol, 0, 1);
    return out;
  }

  function mountPlayer(){
    const root = document.getElementById("mt-player-root");
    if(!root) return false;
    if(root.dataset.mounted === "1") return true;
    root.dataset.mounted = "1";

    const uid = "mtAudioTG_" + Math.random().toString(16).slice(2);

    root.innerHTML = `
      <div class="mt-shell" id="${uid}">
        <div class="mt-fullWrap">

          <div class="mt-full">
            <div class="mt-full__bg" data-full-bg></div>

            <div class="mt-fullHead">
              <div class="mt-cover"><img data-full-cover alt=""></div>

              <div class="mt-meta">
                <p class="mt-title" data-title>—</p>
                <p class="mt-artist" data-artist>—</p>
              </div>

              <div class="mt-actions">
                <button class="mt-ico" data-info-btn type="button" aria-label="Info">${ICONS.info}</button>
                <button class="mt-ico" data-live-btn type="button" aria-label="Live">LIVE</button>
                <button class="mt-ico" data-list-btn type="button" aria-label="Playlist">${ICONS.list}</button>
              </div>
            </div>

            <div class="mt-body">
              <div class="mt-progressRow">
                <div class="mt-bar" data-bar>
                  <div class="mt-fill" data-fill></div>
                  <div class="mt-dot" data-dot></div>
                </div>
                <div class="mt-time" data-time>0:00</div>
              </div>

              <div class="mt-footer">
                <div class="mt-controls">
                  <div class="mt-left">
                    <button class="mt-btn" data-prev type="button" aria-label="Prev">${ICONS.prev}</button>
                    <button class="mt-btn" data-play type="button" aria-label="Play/Pause">${ICONS.play}</button>
                    <button class="mt-btn" data-stop type="button" aria-label="Stop">${ICONS.stop}</button>
                    <button class="mt-btn" data-next type="button" aria-label="Next">${ICONS.next}</button>
                  </div>

                  <div class="mt-right">
                    <div class="mt-vol">
                      <span class="mt-vol__label">Vol</span>
                      <input data-vol type="range" min="0" max="1" step="0.01" value="${START_VOLUME}">
                    </div>
                  </div>
                </div>
              </div>

              <!-- PANELS -->
              <div class="mt-panels">
                <div class="mt-panel" data-panel="playlist">
                  <div class="mt-panel__card">
                    <div class="mt-panel__head">
                      <p class="mt-panel__title">Плейлист</p>
                    </div>
                    <div class="mt-panel__body" data-pl-inner></div>
                  </div>
                </div>

                <div class="mt-panel" data-panel="info">
                  <div class="mt-panel__card">
                    <div class="mt-panel__head">
                      <p class="mt-panel__title">${escapeHtml(INFO_TITLE)}</p>
                    </div>
                    <div class="mt-panel__body">
                      <div class="mt-infoText">${INFO_TEXT_HTML}</div>
                    </div>
                  </div>
                </div>

                <div class="mt-panel" data-panel="live">
                  <div class="mt-panel__card">
                    <div class="mt-panel__head">
                      <p class="mt-panel__title">${escapeHtml(LIVE_TITLE)}</p>
                    </div>
                    <div class="mt-panel__body">
                      <div class="mt-liveFrame">
                        <div class="mt-liveFrame__box">
                          <iframe
                            data-live-iframe
                            src=""
                            allow="autoplay; encrypted-media; fullscreen; picture-in-picture; screen-wake-lock;"
                            frameborder="0"
                            allowfullscreen
                          ></iframe>
                        </div>
                        <p class="mt-liveHint">${escapeHtml(LIVE_HINT)}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <audio preload="metadata"></audio>
            </div>
          </div>

        </div>
      </div>
    `;

    const shell = root.querySelector("#"+uid);
    const audio = shell.querySelector("audio");

    const fullBg    = shell.querySelector("[data-full-bg]");
    const fullCov   = shell.querySelector("[data-full-cover]");
    const elTitle   = shell.querySelector("[data-title]");
    const elArtist  = shell.querySelector("[data-artist]");

    const elBar     = shell.querySelector("[data-bar]");
    const elFill    = shell.querySelector("[data-fill]");
    const elDot     = shell.querySelector("[data-dot]");
    const elTime    = shell.querySelector("[data-time]");

    const btnPrev   = shell.querySelector("[data-prev]");
    const btnNext   = shell.querySelector("[data-next]");
    const btnStop   = shell.querySelector("[data-stop]");
    const btnPlay   = shell.querySelector("[data-play]");

    const btnList   = shell.querySelector("[data-list-btn]");
    const btnInfo   = shell.querySelector("[data-info-btn]");
    const btnLive   = shell.querySelector("[data-live-btn]");

    const plInner   = shell.querySelector("[data-pl-inner]");
    const liveIframe= shell.querySelector("[data-live-iframe]");

    const vol       = shell.querySelector("[data-vol]");
    const volWrap   = vol.closest(".mt-vol");

    const panels = {
      playlist: shell.querySelector('[data-panel="playlist"]'),
      info:     shell.querySelector('[data-panel="info"]'),
      live:     shell.querySelector('[data-panel="live"]')
    };

    const restored = loadState();
    let idx = restored ? restored.idx : 0;

    audio.volume = restored ? restored.vol : START_VOLUME;
    vol.value = String(audio.volume);

    fullBg.style.backgroundImage = PLAYER_BG ? `url("${PLAYER_BG}")` : "none";
    fullCov.src = COMMON_COVER;

    if(liveIframe){
      liveIframe.src = LIVE_VK_IFRAME_SRC || "";
    }

    const fmtTime = (s)=>{
      if(!isFinite(s)||s<0) return "0:00";
      const m=Math.floor(s/60), r=Math.floor(s%60);
      return m+":"+String(r).padStart(2,"0");
    };

    function safeSetSrc(url){
      audio.pause();
      audio.currentTime=0;
      audio.removeAttribute("src");
      audio.load();
      audio.src=url;
      audio.load();
    }

    function setPlayIcon(){
      btnPlay.innerHTML = audio.paused ? ICONS.play : ICONS.pause;
    }

    function updateProgress(){
      const dur=audio.duration||0, cur=audio.currentTime||0;
      const p=dur ? (cur/dur)*100 : 0;
      elFill.style.width=p+"%";
      elDot.style.left=p+"%";
      elTime.textContent=fmtTime(cur);
    }

    let saveTimer = null;
    function saveNow(){
      const state = {
        idx: idx,
        time: Number.isFinite(audio.currentTime) ? audio.currentTime : 0,
        vol: Number.isFinite(audio.volume) ? audio.volume : START_VOLUME
      };
      try{ localStorage.setItem(STORE_KEY, JSON.stringify(state)); }catch(e){}
    }
    function scheduleSave(){
      if(saveTimer) return;
      saveTimer = setTimeout(()=>{
        saveTimer = null;
        saveNow();
      }, SAVE_THROTTLE_MS);
    }

    function renderPlaylist(){
      plInner.innerHTML = TRACKS.map((t,i)=>`
        <div class="mt-playlist__item ${i===idx ? 'is-active' : ''}" data-pi="${i}">
          <div class="mt-playlist__left">
            <p class="mt-playlist__t">${escapeHtml((t.title||"—").toUpperCase())}</p>
            <p class="mt-playlist__a">${escapeHtml(t.artist||"—")}</p>
          </div>
          <div class="mt-playlist__badge">${(i===idx && !audio.paused) ? "PLAYING" : "PLAY"}</div>
        </div>
      `).join("");

      plInner.querySelectorAll("[data-pi]").forEach(el=>{
        el.addEventListener("click", ()=>{
          const i = parseInt(el.getAttribute("data-pi"),10);
          setTrack(i, true, null);
        });
      });
    }

    function setTrack(i, autoplay=false, restoreTime=null){
      idx = (i + TRACKS.length) % TRACKS.length;
      const t = TRACKS[idx];

      elTitle.textContent  = (t.title || "—").toUpperCase();
      elArtist.textContent = t.artist || "—";
      fullCov.src = COMMON_COVER;

      safeSetSrc(t.src);

      elFill.style.width="0%";
      elDot.style.left="0%";
      elTime.textContent="0:00";

      renderPlaylist();
      setPlayIcon();

      if(Number.isFinite(restoreTime) && restoreTime > 0){
        const wanted = Math.max(0, restoreTime);
        const seekOnce = ()=>{
          if(isFinite(audio.duration) && audio.duration > 0){
            audio.currentTime = Math.min(wanted, Math.max(0, audio.duration - 0.25));
            updateProgress();
            audio.removeEventListener("loadedmetadata", seekOnce);
          }
        };
        audio.addEventListener("loadedmetadata", seekOnce);
      }

      saveNow();

      if(autoplay){
        audio.play().catch(()=>{});
      }
    }

    async function togglePlay(){
      if(!audio.src) setTrack(idx,false,null);
      if(audio.paused){
        try{ await audio.play(); }catch(e){}
      }else{
        audio.pause();
      }
      setPlayIcon();
      renderPlaylist();
      saveNow();
    }

    // ===== Tabs logic (нижний блок)
    function setTab(name){
      Object.keys(panels).forEach(k=>{
        if(panels[k]) panels[k].classList.toggle("is-active", k === name);
      });

      // подсветка активной кнопки
      btnList.classList.toggle("is-active", name === "playlist");
      btnInfo.classList.toggle("is-active", name === "info");
      btnLive.classList.toggle("is-active", name === "live");
    }

    // ===== Controls
    btnPlay.addEventListener("click", (e)=>{ e.stopPropagation(); togglePlay(); });
    btnStop.addEventListener("click", ()=>{
      audio.pause(); audio.currentTime=0;
      updateProgress(); setPlayIcon(); renderPlaylist();
      saveNow();
    });
    btnNext.addEventListener("click", ()=> setTrack(idx+1,true,null));
    btnPrev.addEventListener("click", ()=> setTrack(idx-1,true,null));

    btnList.addEventListener("click", (e)=>{ e.stopPropagation(); setTab("playlist"); });
    btnInfo.addEventListener("click", (e)=>{ e.stopPropagation(); setTab("info"); });
    btnLive.addEventListener("click", (e)=>{ e.stopPropagation(); setTab("live"); });

    // click seek + swipe seek
    function seekByClientX(clientX){
      const rect = elBar.getBoundingClientRect();
      const x = Math.min(Math.max(0, clientX - rect.left), rect.width);
      const ratio = rect.width ? (x / rect.width) : 0;
      if (isFinite(audio.duration) && audio.duration > 0) {
        audio.currentTime = ratio * audio.duration;
        updateProgress();
        scheduleSave();
      }
    }

    elBar.addEventListener("click",(e)=>{ seekByClientX(e.clientX); });

    let seeking = false;
    elBar.addEventListener("pointerdown", (e)=>{
      seeking = true;
      try{ elBar.setPointerCapture(e.pointerId); }catch(_){}
      seekByClientX(e.clientX);
    });
    elBar.addEventListener("pointermove", (e)=>{
      if(!seeking) return;
      seekByClientX(e.clientX);
    });
    elBar.addEventListener("pointerup", ()=>{ seeking=false; });
    elBar.addEventListener("pointercancel", ()=>{ seeking=false; });

    elBar.addEventListener("touchstart", (e)=>{
      seeking = true;
      const t = e.touches && e.touches[0];
      if(t) seekByClientX(t.clientX);
    }, {passive:true});

    elBar.addEventListener("touchmove", (e)=>{
      if(!seeking) return;
      const t = e.touches && e.touches[0];
      if(t) seekByClientX(t.clientX);
      e.preventDefault();
    }, {passive:false});

    elBar.addEventListener("touchend", ()=>{ seeking=false; }, {passive:true});
    elBar.addEventListener("touchcancel", ()=>{ seeking=false; }, {passive:true});

    // volume input + swipe volume on wrapper
    vol.addEventListener("input", ()=>{
      audio.volume = clamp(parseFloat(vol.value||"0"), 0, 1);
      scheduleSave();
    });

    function setVolume(v){
      const vv = clamp(v, 0, 1);
      audio.volume = vv;
      vol.value = String(vv);
      scheduleSave();
    }

    let volSwipe = { active:false, startX:0, startV:0 };
    if(volWrap){
      volWrap.addEventListener("pointerdown", (e)=>{
        volSwipe.active = true;
        volSwipe.startX = e.clientX;
        volSwipe.startV = audio.volume || 0;
        try{ volWrap.setPointerCapture(e.pointerId); }catch(_){}
      });
      volWrap.addEventListener("pointermove", (e)=>{
        if(!volSwipe.active) return;
        const dx = e.clientX - volSwipe.startX;
        const delta = dx / 160;
        setVolume((volSwipe.startV || 0) + delta);
      });
      volWrap.addEventListener("pointerup", ()=>{ volSwipe.active = false; });
      volWrap.addEventListener("pointercancel", ()=>{ volSwipe.active = false; });

      volWrap.addEventListener("touchstart", (e)=>{
        const t = e.touches && e.touches[0];
        if(!t) return;
        volSwipe.active = true;
        volSwipe.startX = t.clientX;
        volSwipe.startV = audio.volume || 0;
      }, {passive:true});

      volWrap.addEventListener("touchmove", (e)=>{
        if(!volSwipe.active) return;
        const t = e.touches && e.touches[0];
        if(!t) return;
        const dx = t.clientX - volSwipe.startX;
        const delta = dx / 160;
        setVolume((volSwipe.startV || 0) + delta);
        e.preventDefault();
      }, {passive:false});

      volWrap.addEventListener("touchend", ()=>{ volSwipe.active = false; }, {passive:true});
      volWrap.addEventListener("touchcancel", ()=>{ volSwipe.active = false; }, {passive:true});
    }

    audio.addEventListener("loadedmetadata", updateProgress);
    audio.addEventListener("timeupdate", ()=>{ updateProgress(); scheduleSave(); });
    audio.addEventListener("play", ()=>{ setPlayIcon(); renderPlaylist(); saveNow(); });
    audio.addEventListener("pause", ()=>{ setPlayIcon(); renderPlaylist(); saveNow(); });
    audio.addEventListener("ended", ()=>{ if(AUTONEXT) setTrack(idx+1,true,null); saveNow(); });

    window.addEventListener("beforeunload", saveNow);

    // init
    if(restored) setTrack(restored.idx, false, restored.time);
    else setTrack(0,false,null);

    renderPlaylist();
    setPlayIcon();

    // по умолчанию: playlist
    setTab("playlist");

    return true;
  }

  function run(){
    let tries=0;
    const timer=setInterval(()=>{
      tries++;
      if(mountPlayer() || tries>80) clearInterval(timer);
    },100);
  }

  if(typeof window.t_onReady==="function") window.t_onReady(run);
  else{ document.addEventListener("DOMContentLoaded",run); window.addEventListener("load",run); }
})();
