<!-- =========================================================
  MOLOTOV AUDIO PLAYER — BETA v2
  Автор: Van Molotov
========================================================= -->

<div id="mt-player-root"></div>

<style>
  :root{
    --mt-card:#151518;
    --mt-border:rgba(255,255,255,.12);
    --mt-text:#f3f4f6;
    --mt-muted:rgba(243,244,246,.70);
    --mt-accent:#D8FF00;
    --mt-accentText:#111;
    --mt-radius:18px;
    --mt-shadow:0 18px 45px rgba(0,0,0,.45);
    --mt-font: Helvetica, Arial, sans-serif;
  }

  #mt-player-root{ width:100%; }
  #mt-player-root, #mt-player-root *{
    box-sizing:border-box;
    font-family: var(--mt-font) !important;
  }

  .mt-shell{
    position:relative;
    display:flex;
    justify-content:flex-end;
    align-items:flex-start;
    width:auto;
    max-width:100%;
    min-height:72px;
  }

  .mt-mini{
    position:relative;
    margin-left:auto;
    z-index:5;

    display:flex;
    align-items:center;
    gap:10px;
    padding:10px;
    border-radius:16px;
    background:linear-gradient(180deg, rgba(255,255,255,.05), rgba(255,255,255,0)), var(--mt-card);
    border:1px solid var(--mt-border);
    box-shadow:var(--mt-shadow);
    overflow:hidden;
    flex:0 0 auto;
    transition:opacity .18s ease;
  }
  .mt-mini__bg{
    position:absolute; inset:0;
    background-size:cover;
    background-position:center;
    opacity:.22;
    transform:scale(1.02);
    pointer-events:none;
  }
  .mt-mini__row{
    position:relative;
    z-index:1;
    display:flex;
    align-items:center;
    gap:10px;
  }

  .mt-shell.is-open .mt-mini{
    opacity:0;
    pointer-events:none;
  }

  /* FULL WRAP:  (открытие вверх+влево) */
  .mt-fullWrap{
    position:absolute;
    right:0;
    bottom:0;
    z-index:6;
    overflow:visible;

    opacity:0;
    transform:translateX(10px);
    transition:opacity .18s ease, transform .28s ease;
    pointer-events:none;
  }
  .mt-shell.is-open .mt-fullWrap{
    opacity:1;
    transform:translateX(0);
    pointer-events:auto;
  }

  .mt-ico{
    appearance:none;
    border:1px solid rgba(255,255,255,.12);
    background:rgba(255,255,255,.06);
    color:rgba(243,244,246,.92);
    width:38px; height:38px;
    border-radius:12px;
    display:inline-flex;
    align-items:center;
    justify-content:center;
    cursor:pointer;
    transition:transform .12s ease, border-color .12s ease, opacity .18s ease;
    user-select:none;
    flex:0 0 auto;
  }
  .mt-ico:hover{ transform:translateY(-1px); border-color:rgba(255,255,255,.22); }
  .mt-ico:active{ transform:translateY(0) scale(.99); }
  .mt-ico svg{ width:18px; height:18px; fill:currentColor; display:block; }

  /* LIVE кнопка как “текстовая” */
  .mt-ico[data-live-btn]{
    width:auto;
    padding:0 12px;
    font-size:11px;
    font-weight:900;
    letter-spacing:.10em;
    text-transform:uppercase;
  }

  .mt-btn{
    appearance:none;
    border:1px solid var(--mt-border);
    background:rgba(255,255,255,.06);
    color:var(--mt-text);
    height:44px;
    border-radius:14px;
    padding:0;
    cursor:pointer;
    transition:transform .12s ease, border-color .12s ease;
    display:inline-flex;
    align-items:center;
    justify-content:center;
    user-select:none;
    width:44px;
    flex:0 0 auto;
  }
  .mt-btn:hover{ transform:translateY(-1px); border-color:rgba(255,255,255,.22); }
  .mt-btn:active{ transform:translateY(0) scale(.99); }
  .mt-btn svg{ width:18px; height:18px; fill:currentColor; display:block; }

  .mt-cover{
    width:46px; height:46px;
    border-radius:12px;
    border:1px solid var(--mt-border);
    background:rgba(255,255,255,.06);
    overflow:hidden;
    flex:0 0 auto;
    box-shadow:0 10px 25px rgba(0,0,0,.25);
    position:relative;
    z-index:1;
  }
  .mt-cover img{ width:100%; height:100%; object-fit:cover; display:block; }

  .mt-full{
    width:520px;
    max-width:calc(100vw - 24px);
    background:linear-gradient(180deg, rgba(255,255,255,.05), rgba(255,255,255,0)), var(--mt-card);
    border:1px solid var(--mt-border);
    border-radius:18px;
    box-shadow:var(--mt-shadow);
    overflow:hidden;
    position:relative;
    color:var(--mt-text);
    transform-origin:right bottom;
  }
  .mt-full__bg{
    position:absolute; inset:0;
    background-size:cover;
    background-position:center;
    opacity:.22;
    transform:scale(1.02);
    pointer-events:none;
  }

  .mt-fullHead{
    position:relative;
    z-index:3;
    padding:12px;
    display:flex;
    gap:10px;
    align-items:center;
    width:100%;
    min-width:0;
  }

  .mt-meta{ flex:1 1 auto; min-width:0; }
  .mt-title{
    font-size:12px;
    font-weight:900;
    letter-spacing:.02em;
    text-transform:uppercase;
    white-space:nowrap;
    overflow:hidden;
    text-overflow:ellipsis;
    margin:0 0 2px 0;
    color:#fff;
  }
  .mt-artist{
    font-size:11px;
    color:rgba(255,255,255,.75);
    white-space:nowrap;
    overflow:hidden;
    text-overflow:ellipsis;
    margin:0;
  }

  .mt-body{
    position:relative;
    z-index:2;
    border-top:1px solid rgba(255,255,255,.08);
    padding:0 12px 12px 12px;
  }

  .mt-progressRow{
    padding:12px 0 10px 0;
    display:flex; gap:10px; align-items:center;
    width:100%;
    min-width:0;
  }
  .mt-time{
    font-size:11px;
    color:rgba(255,255,255,.70);
    min-width:42px;
    text-align:right;
    flex:0 0 auto;
  }
  .mt-bar{
    flex:1 1 auto;
    min-width:0;
    height:8px;
    border-radius:999px;
    background:rgba(255,255,255,.10);
    border:1px solid rgba(255,255,255,.10);
    position:relative;
    cursor:pointer;
    overflow:hidden;
    touch-action:none;
  }
  .mt-fill{
    position:absolute; left:0; top:0; bottom:0;
    width:0%;
    background:rgba(216,255,0,.95);
  }
  .mt-dot{
    position:absolute; top:50%;
    width:12px; height:12px;
    border-radius:999px;
    transform:translate(-50%,-50%);
    background:var(--mt-accent);
    box-shadow:0 0 0 3px rgba(216,255,0,.25);
    left:0%;
    pointer-events:none;
  }

  .mt-footer{ position:relative; z-index:2; padding-top:10px; }
  .mt-controls{
    display:flex;
    align-items:center;
    justify-content:space-between;
    gap:10px;
    flex-wrap:nowrap;
    width:100%;
  }
  .mt-left, .mt-right{
    display:flex;
    align-items:center;
    gap:10px;
    flex-wrap:nowrap;
    min-width:0;
  }

  .mt-vol{
    display:flex; align-items:center; gap:8px;
    border:1px solid rgba(255,255,255,.12);
    background:rgba(255,255,255,.06);
    height:44px;
    border-radius:14px;
    padding:0 10px;
    flex:0 0 auto;
    overflow:hidden;
    touch-action:none;
  }
  .mt-vol__label{
    font-size:10px;
    font-weight:900;
    letter-spacing:.08em;
    text-transform:uppercase;
    color:rgba(255,255,255,.85);
  }
  .mt-vol input[type="range"]{
    width:92px;
    accent-color:var(--mt-accent);
    -webkit-user-select:none;
    user-select:none;
    -webkit-tap-highlight-color: transparent;

    -webkit-appearance:none;
    appearance:none;
    height:22px;
    background:transparent;
  }
  .mt-vol input[type="range"]::-webkit-slider-runnable-track{
    height:4px;
    border-radius:999px;
    background:rgba(255,255,255,.18);
  }
  .mt-vol input[type="range"]::-webkit-slider-thumb{
    -webkit-appearance:none;
    appearance:none;
    width:16px; height:16px;
    border-radius:999px;
    background:var(--mt-accent);
    margin-top:-6px;
    box-shadow:0 0 0 3px rgba(216,255,0,.25);
    border:0;
  }

  .mt-playlist{
    position:absolute;
    left:0;
    right:0;
    bottom: calc(100% + 10px);
    border:1px solid var(--mt-border);
    border-radius:18px;
    box-shadow:var(--mt-shadow);

    overflow-y:auto;
    overflow-x:hidden !important;

    max-height:0;
    opacity:0;
    transform:translateY(10px);
    transition:max-height .25s ease, opacity .18s ease, transform .25s ease;
    pointer-events:none;
    z-index:999;

    background: linear-gradient(180deg, rgba(255,255,255,.05), rgba(255,255,255,0)) , var(--mt-card);
    overscroll-behavior: contain;

    -webkit-overflow-scrolling: touch;
    touch-action: pan-y;
  }
  .mt-playlist.is-open{
    max-height:320px;
    opacity:1;
    transform:translateY(0);
    pointer-events:auto;
  }

  .mt-playlist__bg{
    position:absolute;
    inset:0;
    background-size:cover;
    background-position:center;
    opacity:.22;
    transform:scale(1.02);
    pointer-events:none;
  }

  /* INFO PANEL */
  .mt-info{
    position:absolute;
    right:0;
    bottom: calc(100% + 10px);
    width: min(520px, calc(100vw - 24px));
    border:1px solid var(--mt-border);
    border-radius:18px;
    box-shadow:var(--mt-shadow);

    max-height:0;
    opacity:0;
    transform:translateY(10px);
    transition:max-height .25s ease, opacity .18s ease, transform .25s ease;
    pointer-events:none;
    z-index:1000;

    overflow:hidden;
    background: linear-gradient(180deg, rgba(255,255,255,.05), rgba(255,255,255,0)) , var(--mt-card);
  }
  .mt-info.is-open{
    max-height:260px;
    opacity:1;
    transform:translateY(0);
    pointer-events:auto;
  }
  .mt-info__bg{
    position:absolute; inset:0;
    background-size:cover;
    background-position:center;
    opacity:.18;
    transform:scale(1.02);
    pointer-events:none;
  }
  .mt-info__inner{
    position:relative;
    z-index:1;
    padding:12px 14px 14px 14px;
    border-top:1px solid rgba(255,255,255,.08);
  }
  .mt-info__title{
    margin:0 0 8px 0;
    font-size:11px;
    font-weight:900;
    letter-spacing:.12em;
    text-transform:uppercase;
    color:#fff;
  }
  .mt-info__text{
    margin:0;
    font-size:12px;
    line-height:1.35;
    color:rgba(255,255,255,.78);
  }
  .mt-info__text b{ color:#fff; }
  .mt-info__text a{ color:var(--mt-accent); text-decoration:none; }
  .mt-info__text a:hover{ text-decoration:underline; }

  /* LIVE PANEL (VK iframe) */
  .mt-live{
    position:absolute;
    right:0;
    bottom: calc(100% + 10px);
    width: min(520px, calc(100vw - 24px));
    border:1px solid var(--mt-border);
    border-radius:18px;
    box-shadow:var(--mt-shadow);

    max-height:0;
    opacity:0;
    transform:translateY(10px);
    transition:max-height .25s ease, opacity .18s ease, transform .25s ease;
    pointer-events:none;
    z-index:1000;

    overflow:hidden;
    background: linear-gradient(180deg, rgba(255,255,255,.05), rgba(255,255,255,0)) , var(--mt-card);
  }
  .mt-live.is-open{
    max-height:560px;
    opacity:1;
    transform:translateY(0);
    pointer-events:auto;
  }
  .mt-live__bg{
    position:absolute; inset:0;
    background-size:cover;
    background-position:center;
    opacity:.18;
    transform:scale(1.02);
    pointer-events:none;
  }
  .mt-live__inner{
    position:relative;
    z-index:1;
    padding:12px 14px 14px 14px;
    border-top:1px solid rgba(255,255,255,.08);
  }
  .mt-live__head{
    display:flex;
    align-items:center;
    justify-content:space-between;
    gap:10px;
    margin-bottom:10px;
  }
  .mt-live__title{
    margin:0;
    font-size:11px;
    font-weight:900;
    letter-spacing:.12em;
    text-transform:uppercase;
    color:#fff;
    white-space:nowrap;
    overflow:hidden;
    text-overflow:ellipsis;
  }
  .mt-live__collapse{
    appearance:none;
    border:1px solid rgba(255,255,255,.14);
    background: rgba(255,255,255,.06);
    color:#fff;
    height:34px;
    padding:0 12px;
    border-radius:12px;
    cursor:pointer;
    font-size:10px;
    font-weight:900;
    letter-spacing:.10em;
    text-transform:uppercase;
    user-select:none;
    flex:0 0 auto;
  }
  .mt-live__collapse:hover{ border-color: rgba(216,255,0,.35); }

  .mt-live__frame{
    width:100%;
    aspect-ratio:16/9;
    border-radius:14px;
    overflow:hidden;
    border:1px solid rgba(255,255,255,.10);
    background: rgba(0,0,0,.25);
    position:relative;
  }
  .mt-live__frame iframe{
    width:100%;
    height:100%;
    display:block;
    background:#000;
  }
  .mt-live__hint{
    margin:10px 0 0 0;
    font-size:11px;
    line-height:1.35;
    color:rgba(255,255,255,.72);
  }

  /* MARQUEE */
  .mt-marquee{
    position:sticky;
    top:0;
    z-index:2;
    border-bottom:1px solid rgba(255,255,255,.10);
    background: rgba(0,0,0,.25);
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
    overflow:hidden;
  }
  .mt-marquee__a{ display:block; padding:10px 14px; text-decoration:none; }
  .mt-marquee__track{
    display:inline-block;
    white-space:nowrap;
    will-change: transform;
    animation: mtMarquee 14s linear infinite;

    font-size:11px;
    font-weight:900;
    letter-spacing:.12em;
    text-transform:uppercase;
    color: var(--mt-accent);
    text-shadow: 0 0 10px rgba(216,255,0,.25);
  }
  .mt-marquee__track span{ display:inline-block; padding-right:48px; }
  .mt-mq-link{ color:#fff; text-shadow:0 0 10px rgba(255,255,255,.22); }
  @keyframes mtMarquee{ 0%{ transform:translateX(0); } 100%{ transform:translateX(-50%); } }

  .mt-playlist__inner{ position:relative; z-index:1; overflow-x:hidden !important; }
  .mt-playlist, .mt-playlist__inner, .mt-playlist__item{ overflow-x:hidden !important; }

  .mt-playlist::-webkit-scrollbar{ width:10px; }
  .mt-playlist::-webkit-scrollbar-thumb{
    background: rgba(255,255,255,.14);
    border-radius:999px;
    border:3px solid rgba(0,0,0,0);
    background-clip:padding-box;
  }
  .mt-playlist::-webkit-scrollbar-track{ background: rgba(255,255,255,.04); }

  .mt-playlist__item{
    display:flex;
    align-items:center;
    gap:10px;
    padding:12px 14px;
    cursor:pointer;
    min-width:0;
    border-top:1px solid rgba(255,255,255,.08);
    background: rgba(255,255,255,.02);
    transition: background .12s ease;
  }
  .mt-playlist__item:first-child{ border-top:0; }
  .mt-playlist__item:hover{ background: rgba(255,255,255,.05); }
  .mt-playlist__item.is-active{ background: rgba(216,255,0,.08); }

  .mt-playlist__left{ flex:1 1 auto; min-width:0; overflow:hidden; }
  .mt-playlist__t{
    margin:0 0 2px 0;
    font-size:12px;
    font-weight:900;
    letter-spacing:.02em;
    text-transform:uppercase;
    white-space:nowrap;
    overflow:hidden;
    text-overflow:ellipsis;
    max-width:100%;
    color:#fff;
  }
  .mt-playlist__a{
    margin:0;
    font-size:11px;
    white-space:nowrap;
    overflow:hidden;
    text-overflow:ellipsis;
    max-width:100%;
    color:rgba(255,255,255,.75);
  }

  .mt-playlist__badge{
    flex:0 0 auto;
    font-size:10px;
    font-weight:900;
    letter-spacing:.08em;
    text-transform:uppercase;
    color:#fff;
    border:1px solid rgba(255,255,255,.14);
    padding:6px 10px;
    border-radius:10px;
    background: rgba(255,255,255,.04);
    max-width:84px;
    text-align:center;
  }
  .mt-playlist__item.is-active .mt-playlist__badge{
    border-color: rgba(216,255,0,.35);
    background: rgba(216,255,0,.16);
  }

  @media (max-width:520px){
    .mt-shell{ min-height:68px; }
    .mt-full{ width:360px; max-width:calc(100vw - 16px); }
    .mt-vol__label{ display:none; }
    .mt-vol input[type="range"]{ width:90px; }
    .mt-btn{ width:42px; height:42px; border-radius:13px; }
    .mt-vol{ height:42px; border-radius:13px; }
    .mt-info{ width: min(360px, calc(100vw - 16px)); }
    .mt-live{ width: min(360px, calc(100vw - 16px)); }
  }
  @media (max-width:360px){
    .mt-full{ width:320px; }
    .mt-vol{ display:none; }
    .mt-info{ width: min(320px, calc(100vw - 16px)); }
    .mt-live{ width: min(320px, calc(100vw - 16px)); }
  }

  /* MOBILE */
  @media (max-width: 520px){
    #mt-player-root{ height:auto !important; min-height:auto !important; }

    #mt-player-root .mt-shell{
      position:relative !important;
      right:auto !important;
      bottom:auto !important;
      left:auto !important;
      top:auto !important;
      transform:none !important;
      z-index:auto !important;

      width:auto !important;
      max-width:100% !important;
    }

    #mt-player-root .mt-mini{
      position:relative !important;
      margin-left:auto !important;
      right:auto !important;
      bottom:auto !important;
      top:auto !important;
      left:auto !important;
    }

    #mt-player-root .mt-fullWrap{
      position:absolute !important;
      right:0 !important;
      bottom:0 !important;
      top:auto !important;
    }
  }
</style>

<script>
(function(){
  const COMMON_COVER = "https://raw.githubusercontent.com/Vanmolotov/Van-Molotov/main/sq%20yt1.jpg";

  const PLAYER_BG   = "https://raw.githubusercontent.com/Vanmolotov/Van-Molotov/main/sq%20yt1.jpg";
  const PLAYLIST_BG = "https://raw.githubusercontent.com/Vanmolotov/Van-Molotov/main/site%20%281%29.jpg";

  /* Бегущая строка */
  const MARQUEE_TEXT = "SBS HANGOVER 2026 - 2 ЯНВАРЯ - ПЕРМЬ - <b class='mt-mq-link'>КЛИКАЙ СЮДА</b> ЧТОБЫ УЗНАТЬ БОЛЬШЕ";
  const MARQUEE_URL  = "https://sbsrussia.ru";
  const MARQUEE_NEW_TAB = true;

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

  /* SAVE / RESTORE */
  const STORE_KEY = "mt_audio_player_state_v1";
  const SAVE_THROTTLE_MS = 900;

  /* INFO TEXT */
  const INFO_TITLE = "ИНФО / АВТОРСКИЕ ПРАВА";
  const INFO_TEXT_HTML =
    "Плеер — <b>MOLOTOV AUDIO PLAYER (BETA v1)</b>. Автор: <b>Van Molotov</b>.<br><br>" +
    "Материалы используются в <b>некоммерческих целях</b> (для ознакомления/комьюнити).<br>" +
    "Если у правообладателя есть вопросы или запрос на удаление — <b>удалим контент</b> по первому обращению.<br><br>" +
    "Связь: <a href='mailto:support@molotov.store'>support@molotov.store</a>";

  /* LIVE (VK) */
  const LIVE_TITLE = "ПОСЛЕДНИЙ СТРИМ / VK";
  const LIVE_VK_IFRAME_SRC = "https://vk.com/video_ext.php?oid=-38901360&id=456240842&autoplay=1";
  const LIVE_HINT = "MOLOTOV LIVE®.";

  const ICONS = {
    play: `<svg viewBox="0 0 24 24"><path d="M8 5v14l12-7z"/></svg>`,
    pause:`<svg viewBox="0 0 24 24"><path d="M6 5h4v14H6zm8 0h4v14h-4z"/></svg>`,
    open: `<svg viewBox="0 0 24 24"><path d="m7.41 10.59 4.59 4.58 4.59-4.58L18 12l-6 6-6-6z"/></svg>`,
    close:`<svg viewBox="0 0 24 24"><path d="m7.41 13.41 4.59-4.58 4.59 4.58L18 12l-6-6-6 6z"/></svg>`,
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

    const uid = "mtAudio_" + Math.random().toString(16).slice(2);

    root.innerHTML = `
      <div class="mt-shell" id="${uid}">
        <div class="mt-mini">
          <div class="mt-mini__bg" data-mini-bg></div>
          <div class="mt-mini__row">
            <div class="mt-cover"><img data-mini-cover alt=""></div>
            <button class="mt-ico" data-mini-play type="button" aria-label="Play/Pause">${ICONS.play}</button>
            <button class="mt-ico" data-mini-open type="button" aria-label="Open">${ICONS.open}</button>
          </div>
        </div>

        <div class="mt-fullWrap">
          <div class="mt-info" data-info>
            <div class="mt-info__bg" data-info-bg></div>
            <div class="mt-info__inner">
              <p class="mt-info__title">${escapeHtml(INFO_TITLE)}</p>
              <p class="mt-info__text">${INFO_TEXT_HTML}</p>
            </div>
          </div>

          <div class="mt-live" data-live>
            <div class="mt-live__bg" data-live-bg></div>
            <div class="mt-live__inner">
              <div class="mt-live__head">
                <p class="mt-live__title">${escapeHtml(LIVE_TITLE)}</p>
                <button class="mt-live__collapse" type="button" data-live-collapse>Свернуть</button>
              </div>

              <div class="mt-live__frame">
                <iframe
                  data-live-iframe
                  src=""
                  width="1280"
                  height="720"
                  style="background-color:#000"
                  allow="autoplay; encrypted-media; fullscreen; picture-in-picture; screen-wake-lock;"
                  frameborder="0"
                  allowfullscreen
                ></iframe>
              </div>

              <p class="mt-live__hint">${escapeHtml(LIVE_HINT)}</p>
            </div>
          </div>

          <div class="mt-playlist" data-playlist>
            <div class="mt-playlist__bg" data-pl-bg></div>

            <div class="mt-marquee" data-marquee>
              <a class="mt-marquee__a" data-marquee-a href="#" rel="noopener">
                <span class="mt-marquee__track" data-marquee-track>
                  <span></span><span></span>
                </span>
              </a>
            </div>

            <div class="mt-playlist__inner" data-pl-inner></div>
          </div>

          <div class="mt-full">
            <div class="mt-full__bg" data-full-bg></div>

            <div class="mt-fullHead">
              <div class="mt-cover"><img data-full-cover alt=""></div>
              <div class="mt-meta">
                <p class="mt-title" data-title>—</p>
                <p class="mt-artist" data-artist>—</p>
              </div>

              <button class="mt-ico" data-info-btn type="button" aria-label="Info">${ICONS.info}</button>
              <button class="mt-ico" data-live-btn type="button" aria-label="Live">LIVE</button>
              <button class="mt-ico" data-list type="button" aria-label="Playlist">${ICONS.list}</button>
              <button class="mt-ico" data-full-close type="button" aria-label="Close">${ICONS.close}</button>
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
                    <button class="mt-btn" data-full-play type="button" aria-label="Play/Pause">${ICONS.play}</button>
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

              <audio preload="metadata"></audio>
            </div>
          </div>
        </div>
      </div>
    `;

    const shell = root.querySelector("#"+uid);
    const audio = shell.querySelector("audio");

    const miniBg    = shell.querySelector("[data-mini-bg]");
    const miniCov   = shell.querySelector("[data-mini-cover]");
    const miniPlay  = shell.querySelector("[data-mini-play]");
    const miniOpen  = shell.querySelector("[data-mini-open]");

    const fullBg    = shell.querySelector("[data-full-bg]");
    const fullCov   = shell.querySelector("[data-full-cover]");
    const elTitle   = shell.querySelector("[data-title]");
    const elArtist  = shell.querySelector("[data-artist]");
    const fullPlay  = shell.querySelector("[data-full-play]");
    const fullClose = shell.querySelector("[data-full-close]");

    const elBar     = shell.querySelector("[data-bar]");
    const elFill    = shell.querySelector("[data-fill]");
    const elDot     = shell.querySelector("[data-dot]");
    const elTime    = shell.querySelector("[data-time]");

    const btnPrev   = shell.querySelector("[data-prev]");
    const btnNext   = shell.querySelector("[data-next]");
    const btnStop   = shell.querySelector("[data-stop]");
    const btnList   = shell.querySelector("[data-list]");
    const elList    = shell.querySelector("[data-playlist]");
    const plBg      = shell.querySelector("[data-pl-bg]");
    const plInner   = shell.querySelector("[data-pl-inner]");
    const vol       = shell.querySelector("[data-vol]");
    const volWrap   = vol.closest(".mt-vol");

    const infoBtn   = shell.querySelector("[data-info-btn]");
    const infoBox   = shell.querySelector("[data-info]");
    const infoBg    = shell.querySelector("[data-info-bg]");

    const liveBtn       = shell.querySelector("[data-live-btn]");
    const liveBox       = shell.querySelector("[data-live]");
    const liveBg        = shell.querySelector("[data-live-bg]");
    const liveIframe    = shell.querySelector("[data-live-iframe]");
    const liveCollapse  = shell.querySelector("[data-live-collapse]");

    const mqA     = shell.querySelector("[data-marquee-a]");
    const mqTrack = shell.querySelector("[data-marquee-track]");
    const mqSpans = mqTrack ? mqTrack.querySelectorAll("span") : [];

    const restored = loadState();
    let idx = restored ? restored.idx : 0;

    audio.volume = restored ? restored.vol : START_VOLUME;
    vol.value = String(audio.volume);

    miniBg.style.backgroundImage = PLAYER_BG ? `url("${PLAYER_BG}")` : "none";
    fullBg.style.backgroundImage = PLAYER_BG ? `url("${PLAYER_BG}")` : "none";
    plBg.style.backgroundImage   = PLAYLIST_BG ? `url("${PLAYLIST_BG}")` : "none";
    if(infoBg) infoBg.style.backgroundImage = PLAYER_BG ? `url("${PLAYER_BG}")` : "none";
    if(liveBg) liveBg.style.backgroundImage = PLAYER_BG ? `url("${PLAYER_BG}")` : "none";

    /* LIVE init */
    if(liveIframe){ liveIframe.src = LIVE_VK_IFRAME_SRC || ""; }

    if (mqA && mqSpans && mqSpans.length){
      mqA.href = MARQUEE_URL || "#";
      if (MARQUEE_NEW_TAB) mqA.target = "_blank";
      const txt = (MARQUEE_TEXT || "").trim();
      mqSpans[0].innerHTML = txt;
      mqSpans[1].innerHTML = txt;
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

    function setPlayIcons(){
      const icon = audio.paused ? ICONS.play : ICONS.pause;
      miniPlay.innerHTML = icon;
      fullPlay.innerHTML = icon;
    }

    function setOpen(v){
      shell.classList.toggle("is-open", !!v);
      if(!v){
        elList.classList.remove("is-open");
        if(infoBox) infoBox.classList.remove("is-open");
        if(liveBox) liveBox.classList.remove("is-open");
      }
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

    function setTrack(i, autoplay=false, restoreTime=null){
      idx = (i + TRACKS.length) % TRACKS.length;
      const t = TRACKS[idx];

      elTitle.textContent = (t.title || "—").toUpperCase();
      elArtist.textContent = t.artist || "—";

      miniCov.src = COMMON_COVER;
      fullCov.src = COMMON_COVER;

      safeSetSrc(t.src);

      elFill.style.width="0%";
      elDot.style.left="0%";
      elTime.textContent="0:00";

      renderPlaylist();
      setPlayIcons();

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
      setPlayIcons();
      renderPlaylist();
      saveNow();
    }

    function togglePlaylist(){
      elList.classList.toggle("is-open");
      if(infoBox) infoBox.classList.remove("is-open");
      if(liveBox) liveBox.classList.remove("is-open");
    }

    function toggleInfo(){
      if(!infoBox) return;
      infoBox.classList.toggle("is-open");
      elList.classList.remove("is-open");
      if(liveBox) liveBox.classList.remove("is-open");
    }

    function toggleLive(){
      if(!liveBox) return;
      liveBox.classList.toggle("is-open");
      elList.classList.remove("is-open");
      if(infoBox) infoBox.classList.remove("is-open");
    }

    function closePopups(){
      elList.classList.remove("is-open");
      if(infoBox) infoBox.classList.remove("is-open");
      if(liveBox) liveBox.classList.remove("is-open");
    }

    miniPlay.addEventListener("click",(e)=>{ e.stopPropagation(); togglePlay(); });
    miniOpen.addEventListener("click",(e)=>{ e.stopPropagation(); setOpen(true); });

    fullPlay.addEventListener("click",(e)=>{ e.stopPropagation(); togglePlay(); });
    fullClose.addEventListener("click",(e)=>{ e.stopPropagation(); setOpen(false); });
    btnList.addEventListener("click",(e)=>{ e.stopPropagation(); togglePlaylist(); });

    if(infoBtn) infoBtn.addEventListener("click",(e)=>{ e.stopPropagation(); toggleInfo(); });
    if(liveBtn) liveBtn.addEventListener("click",(e)=>{ e.stopPropagation(); toggleLive(); });

    if(liveCollapse){
      liveCollapse.addEventListener("click",(e)=>{
        e.stopPropagation();
        if(liveBox) liveBox.classList.remove("is-open");
      });
    }

    btnStop.addEventListener("click", ()=>{
      audio.pause(); audio.currentTime=0;
      updateProgress(); setPlayIcons(); renderPlaylist();
      saveNow();
    });
    btnNext.addEventListener("click", ()=> setTrack(idx+1,true,null));
    btnPrev.addEventListener("click", ()=> setTrack(idx-1,true,null));

    /* click seek */
    elBar.addEventListener("click",(e)=>{
      const rect=elBar.getBoundingClientRect();
      const x=Math.min(Math.max(0,e.clientX-rect.left),rect.width);
      const ratio=rect.width ? (x/rect.width) : 0;
      if(isFinite(audio.duration)&&audio.duration>0){
        audio.currentTime=ratio*audio.duration;
        updateProgress();
        scheduleSave();
      }
    });

    /* SWIPE SEEK */
    let seeking = false;
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
    elBar.addEventListener("pointerdown", (e)=>{
      seeking = true;
      try{ elBar.setPointerCapture(e.pointerId); }catch(_){}
      seekByClientX(e.clientX);
    });
    elBar.addEventListener("pointermove", (e)=>{
      if(!seeking) return;
      seekByClientX(e.clientX);
    });
    elBar.addEventListener("pointerup", ()=>{ seeking = false; });
    elBar.addEventListener("pointercancel", ()=>{ seeking = false; });

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

    elBar.addEventListener("touchend", ()=>{ seeking = false; }, {passive:true});
    elBar.addEventListener("touchcancel", ()=>{ seeking = false; }, {passive:true});

    /* volume range */
    vol.addEventListener("input", ()=>{
      audio.volume=Math.min(1,Math.max(0,parseFloat(vol.value||"0")));
      scheduleSave();
    });

    /* SWIPE VOLUME */
    function setVolume(v){
      const vv = Math.min(1, Math.max(0, v));
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
        const delta = dx / 140;
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
        const delta = dx / 140;
        setVolume((volSwipe.startV || 0) + delta);
        e.preventDefault();
      }, {passive:false});

      volWrap.addEventListener("touchend", ()=>{ volSwipe.active = false; }, {passive:true});
      volWrap.addEventListener("touchcancel", ()=>{ volSwipe.active = false; }, {passive:true});
    }

    audio.addEventListener("loadedmetadata", updateProgress);
    audio.addEventListener("timeupdate", ()=>{ updateProgress(); scheduleSave(); });
    audio.addEventListener("play", ()=>{ setPlayIcons(); renderPlaylist(); saveNow(); });
    audio.addEventListener("pause", ()=>{ setPlayIcons(); renderPlaylist(); saveNow(); });
    audio.addEventListener("ended", ()=>{
      if(AUTONEXT) setTrack(idx+1,true,null);
      saveNow();
    });

    document.addEventListener("click",(e)=>{
      if(!shell.contains(e.target)) closePopups();
    });

    elList.addEventListener("click",(e)=> e.stopPropagation());
    if(infoBox) infoBox.addEventListener("click",(e)=> e.stopPropagation());
    if(liveBox) liveBox.addEventListener("click",(e)=> e.stopPropagation());

    window.addEventListener("beforeunload", saveNow);

    setOpen(false);

    if(restored) setTrack(restored.idx, false, restored.time);
    else setTrack(0,false,null);

    renderPlaylist();
    setPlayIcons();

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
</script>
