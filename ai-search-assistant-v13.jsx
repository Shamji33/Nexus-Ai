import { useState, useRef, useEffect, useCallback } from "react";

/* ════════════════════════════════════════════════
   STYLES — dark & light themes via body.light class
   ════════════════════════════════════════════════ */
const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=JetBrains+Mono:wght@300;400;500&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  /* ── DARK THEME (default) ── */
  :root {
    --bg:       #0a0a0f;
    --bg2:      #0d0d16;
    --surface:  #11111a;
    --surface2: #1a1a28;
    --surface3: #222235;
    --border:   rgba(120,100,255,0.15);
    --border2:  rgba(120,100,255,0.08);
    --accent:   #7c5cff;
    --accent2:  #00e5c8;
    --accent3:  #ff5c8a;
    --text:     #e8e6ff;
    --text2:    #b8b6d8;
    --muted:    #6a6880;
    --glow:     0 0 30px rgba(124,92,255,0.22);
    --shadow:   0 20px 60px rgba(0,0,0,0.55);
    --orb1:     rgba(124,92,255,0.10);
    --orb2:     rgba(0,229,200,0.06);
    --grid:     rgba(124,92,255,0.04);
    --card-shadow: 0 8px 32px rgba(0,0,0,0.4);
  }

  /* ── LIGHT THEME ── */
  body.light {
    --bg:       #f3f2ff;
    --bg2:      #ebebff;
    --surface:  #ffffff;
    --surface2: #f0effe;
    --surface3: #e6e3fb;
    --border:   rgba(100,80,220,0.18);
    --border2:  rgba(100,80,220,0.09);
    --accent:   #6644ee;
    --accent2:  #00b8a0;
    --accent3:  #e03070;
    --text:     #1a1740;
    --text2:    #3d3870;
    --muted:    #7872a8;
    --glow:     0 0 30px rgba(102,68,238,0.16);
    --shadow:   0 20px 60px rgba(80,60,200,0.10);
    --orb1:     rgba(102,68,238,0.07);
    --orb2:     rgba(0,184,160,0.06);
    --grid:     rgba(102,68,238,0.05);
    --card-shadow: 0 8px 32px rgba(80,60,180,0.09);
  }

  body {
    background: var(--bg);
    color: var(--text);
    font-family: 'Syne', sans-serif;
    transition: background 0.38s ease, color 0.38s ease;
    min-height: 100vh;
  }

  /* ────────────────────────────────
     THEME TOGGLE SWITCH
  ──────────────────────────────── */
  .theme-btn {
    position: relative;
    width: 56px; height: 30px;
    border-radius: 15px;
    border: 1.5px solid var(--border);
    background: var(--surface2);
    cursor: pointer;
    transition: border-color 0.3s, background 0.38s, box-shadow 0.3s;
    flex-shrink: 0;
    overflow: hidden;
  }

  .theme-btn:hover {
    border-color: var(--accent);
    box-shadow: var(--glow);
  }

  .theme-icons {
    position: absolute; inset: 0;
    display: flex; align-items: center;
    justify-content: space-between;
    padding: 0 7px;
    pointer-events: none;
    z-index: 1;
  }

  .theme-icon { font-size: 12px; line-height: 1; transition: opacity 0.25s; }

  .theme-knob {
    position: absolute;
    top: 3px; left: 3px;
    width: 22px; height: 22px;
    border-radius: 50%;
    background: linear-gradient(135deg, var(--accent), var(--accent2));
    box-shadow: 0 2px 8px rgba(0,0,0,0.22);
    transition: transform 0.32s cubic-bezier(.34,1.56,.64,1);
    z-index: 2;
  }

  body.light .theme-knob { transform: translateX(26px); }

  /* ────────────────────────────────
     BACKGROUNDS
  ──────────────────────────────── */
  .grid-bg {
    position: fixed; inset: 0;
    background-image:
      linear-gradient(var(--grid) 1px, transparent 1px),
      linear-gradient(90deg, var(--grid) 1px, transparent 1px);
    background-size: 48px 48px;
    pointer-events: none; z-index: 0;
    transition: opacity 0.38s;
  }

  .orb {
    position: fixed; border-radius: 50%;
    filter: blur(100px); pointer-events: none; z-index: 0;
    transition: background 0.38s;
  }
  .orb-1 { width: 520px; height: 520px; background: var(--orb1); top: -200px; right: -100px; }
  .orb-2 { width: 420px; height: 420px; background: var(--orb2); bottom: -100px; left: -100px; }

  /* ────────────────────────────────
     AUTH SCREEN
  ──────────────────────────────── */
  .auth-screen {
    min-height: 100vh;
    display: flex; align-items: center; justify-content: center;
    position: relative; overflow: hidden;
    background: var(--bg);
    transition: background 0.38s;
  }

  .auth-card {
    position: relative; z-index: 10;
    width: 100%; max-width: 430px;
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 26px;
    padding: 42px 38px;
    box-shadow: var(--shadow), var(--glow);
    animation: cardIn 0.5s cubic-bezier(.22,1,.36,1);
    transition: background 0.38s, border-color 0.38s, box-shadow 0.38s;
  }

  @keyframes cardIn {
    from { opacity: 0; transform: translateY(28px) scale(0.97); }
    to   { opacity: 1; transform: translateY(0) scale(1); }
  }

  .auth-top-row {
    display: flex; align-items: center; justify-content: space-between;
    margin-bottom: 34px;
  }

  .auth-logo { display: flex; align-items: center; gap: 11px; }

  .auth-logo-icon {
    width: 44px; height: 44px;
    background: linear-gradient(135deg, var(--accent), var(--accent2));
    border-radius: 13px;
    display: flex; align-items: center; justify-content: center;
    font-size: 22px; box-shadow: var(--glow);
  }

  .auth-logo-text {
    font-size: 22px; font-weight: 800; letter-spacing: -0.5px;
    background: linear-gradient(90deg, var(--text), var(--accent2));
    -webkit-background-clip: text; -webkit-text-fill-color: transparent;
  }

  .auth-title  { font-size: 26px; font-weight: 800; letter-spacing: -0.5px; margin-bottom: 6px; color: var(--text); }
  .auth-sub    { font-size: 13.5px; color: var(--muted); margin-bottom: 26px; line-height: 1.55; }

  .auth-tabs {
    display: flex; gap: 4px;
    background: var(--surface2); border-radius: 13px; padding: 4px;
    margin-bottom: 22px;
    transition: background 0.38s;
  }

  .auth-tab {
    flex: 1; padding: 9px; border-radius: 10px; border: none;
    font-family: 'Syne', sans-serif; font-size: 13px; font-weight: 600;
    cursor: pointer; transition: all 0.22s; color: var(--muted); background: transparent;
  }

  .auth-tab.active {
    background: linear-gradient(135deg, var(--accent), #5a3de0);
    color: white; box-shadow: 0 4px 14px rgba(124,92,255,0.30);
  }

  .auth-field { margin-bottom: 15px; }

  .auth-label {
    display: block; font-size: 11px; font-weight: 600;
    font-family: 'JetBrains Mono', monospace;
    letter-spacing: 0.7px; color: var(--muted);
    text-transform: uppercase; margin-bottom: 7px;
    transition: color 0.38s;
  }

  .auth-input {
    width: 100%; padding: 12px 16px;
    background: var(--surface2); border: 1.5px solid var(--border);
    border-radius: 12px; color: var(--text);
    font-family: 'Syne', sans-serif; font-size: 14px;
    outline: none; transition: all 0.22s;
  }

  .auth-input:focus  { border-color: var(--accent); box-shadow: 0 0 0 3px rgba(124,92,255,0.10); }
  .auth-input::placeholder { color: var(--muted); }

  .auth-btn {
    width: 100%; padding: 14px;
    background: linear-gradient(135deg, var(--accent), #5a3de0);
    border: none; border-radius: 13px;
    color: white; font-family: 'Syne', sans-serif;
    font-size: 15px; font-weight: 700; cursor: pointer;
    transition: all 0.22s; margin-top: 8px;
    box-shadow: 0 6px 20px rgba(124,92,255,0.36);
    letter-spacing: 0.3px;
  }

  .auth-btn:hover  { transform: translateY(-1px); box-shadow: 0 10px 28px rgba(124,92,255,0.46); }
  .auth-btn:active { transform: translateY(0); }

  .auth-error {
    margin-top: 13px; padding: 10px 14px;
    background: rgba(255,92,138,0.09); border: 1px solid rgba(255,92,138,0.22);
    border-radius: 10px; font-size: 13px;
    color: var(--accent3); font-family: 'JetBrains Mono', monospace;
  }

  .auth-footer { margin-top: 20px; text-align: center; font-size: 12px; color: var(--muted); }

  /* ────────────────────────────────
     LOADING SCREEN
  ──────────────────────────────── */
  .loading-screen {
    position: fixed; inset: 0; z-index: 9999;
    background: var(--bg);
    display: flex; flex-direction: column;
    align-items: center; justify-content: center; gap: 34px;
    animation: fadeInScreen 0.3s ease;
    transition: background 0.38s;
  }

  @keyframes fadeInScreen { from { opacity: 0; } to { opacity: 1; } }

  .loading-screen.exit { animation: fadeOutScreen 0.5s ease forwards; }

  @keyframes fadeOutScreen {
    from { opacity: 1; transform: scale(1); }
    to   { opacity: 0; transform: scale(1.04); }
  }

  .ls-logo { display: flex; flex-direction: column; align-items: center; gap: 16px; }

  .ls-icon {
    width: 76px; height: 76px;
    background: linear-gradient(135deg, var(--accent), var(--accent2));
    border-radius: 22px;
    display: flex; align-items: center; justify-content: center;
    font-size: 36px;
    animation: iconPulse 1.8s ease-in-out infinite;
  }

  @keyframes iconPulse {
    0%,100% { box-shadow: 0 0 40px rgba(124,92,255,0.35), 0 0 80px rgba(0,229,200,0.1); transform: scale(1); }
    50%      { box-shadow: 0 0 80px rgba(124,92,255,0.65), 0 0 140px rgba(0,229,200,0.22); transform: scale(1.06); }
  }

  .ls-brand {
    font-size: 28px; font-weight: 800; letter-spacing: -0.5px;
    background: linear-gradient(90deg, var(--text), var(--accent2));
    -webkit-background-clip: text; -webkit-text-fill-color: transparent;
  }

  .ls-track {
    width: 270px; height: 3px;
    background: var(--surface2); border-radius: 3px; overflow: hidden;
  }

  .ls-bar {
    height: 100%; border-radius: 3px;
    background: linear-gradient(90deg, var(--accent), var(--accent2));
    animation: fillBar 1.85s cubic-bezier(.4,0,.2,1) forwards;
    box-shadow: 0 0 12px var(--accent);
  }

  @keyframes fillBar {
    0%   { width: 0%; }
    30%  { width: 40%; }
    60%  { width: 70%; }
    85%  { width: 90%; }
    100% { width: 100%; }
  }

  .ls-steps { display: flex; flex-direction: column; align-items: center; gap: 7px; min-height: 52px; }

  .ls-step {
    font-family: 'JetBrains Mono', monospace; font-size: 12px;
    color: var(--muted); animation: stepFade 0.38s ease;
    display: flex; align-items: center; gap: 8px;
  }

  .ls-step.done { color: var(--accent2); }

  @keyframes stepFade {
    from { opacity: 0; transform: translateY(6px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  .ls-spinner {
    width: 15px; height: 15px;
    border: 2px solid var(--border); border-top-color: var(--accent);
    border-radius: 50%; animation: spin 0.7s linear infinite; flex-shrink: 0;
  }

  /* ────────────────────────────────
     MAIN APP SHELL
  ──────────────────────────────── */
  .app {
    min-height: 100vh;
    display: flex; flex-direction: column;
    position: relative;
  }

  /* ── GPT-STYLE SIDEBAR LAYOUT ── */
  .app-shell {
    display: flex; min-height: 100vh; position: relative;
  }

  /* SIDEBAR */
  .sidebar {
    position: fixed; top: 0; left: 0; bottom: 0;
    width: 260px; background: var(--surface);
    border-right: 1px solid var(--border);
    display: flex; flex-direction: column;
    z-index: 300; transition: transform 0.28s cubic-bezier(.22,1,.36,1), width 0.28s ease;
    box-shadow: 4px 0 30px rgba(0,0,0,0.3);
  }
  .sidebar.collapsed { transform: translateX(-260px); }

  .sidebar-top {
    padding: 16px 14px 12px;
    border-bottom: 1px solid var(--border);
    display: flex; flex-direction: column; gap: 10px;
  }

  .sidebar-brand {
    display: flex; align-items: center; gap: 10px;
  }
  .sidebar-logo-icon {
    width: 36px; height: 36px; border-radius: 10px; flex-shrink: 0;
    background: linear-gradient(135deg, var(--accent), var(--accent2));
    display: flex; align-items: center; justify-content: center;
    font-size: 17px; box-shadow: var(--glow);
  }
  .sidebar-logo-text {
    font-size: 18px; font-weight: 800; letter-spacing: -0.5px;
    background: linear-gradient(90deg, var(--text), var(--accent2));
    -webkit-background-clip: text; -webkit-text-fill-color: transparent;
  }
  .sidebar-status {
    display: flex; align-items: center; gap: 6px;
    font-family: 'JetBrains Mono', monospace; font-size: 10px;
    color: var(--muted); padding: 4px 10px; border-radius: 20px;
    background: var(--surface2); border: 1px solid var(--border);
    width: fit-content;
  }
  .sidebar-status-dot {
    width: 6px; height: 6px; border-radius: 50%;
    background: var(--accent2); box-shadow: 0 0 6px var(--accent2);
    animation: pulse 2s infinite;
  }
  @keyframes pulse {
    0%,100% { opacity: 1; transform: scale(1); }
    50% { opacity: 0.5; transform: scale(0.85); }
  }

  .new-chat-btn {
    display: flex; align-items: center; gap: 9px;
    padding: 11px 14px; border-radius: 12px; border: none;
    background: linear-gradient(135deg, var(--accent), #5a3de0);
    color: white; font-family: 'Syne', sans-serif; font-size: 13px; font-weight: 700;
    cursor: pointer; transition: all 0.22s; width: 100%;
    box-shadow: 0 4px 14px rgba(124,92,255,0.35);
  }
  .new-chat-btn:hover { transform: translateY(-1px); box-shadow: 0 6px 20px rgba(124,92,255,0.5); }

  /* SIDEBAR NAV */
  .sidebar-nav { padding: 8px 8px 4px; }
  .sidebar-nav-label {
    font-family: 'JetBrains Mono', monospace; font-size: 9px; font-weight: 700;
    color: var(--muted); letter-spacing: 1.4px; text-transform: uppercase;
    padding: 8px 8px 4px; display: block;
  }
  .sidebar-nav-item {
    display: flex; align-items: center; gap: 10px;
    padding: 9px 10px; border-radius: 10px; border: 1px solid transparent;
    background: transparent; color: var(--muted);
    font-family: 'Syne', sans-serif; font-size: 12.5px; font-weight: 600;
    cursor: pointer; transition: background 0.15s, color 0.15s, border-color 0.15s;
    width: 100%; text-align: left; margin-bottom: 1px; line-height: 1.2;
  }
  .sidebar-nav-item:hover { background: var(--surface2); color: var(--text); }
  .sidebar-nav-item.active {
    background: rgba(124,92,255,0.1); border-color: rgba(124,92,255,0.22);
    color: var(--accent);
  }
  .sidebar-nav-icon { font-size: 15px; width: 20px; text-align: center; flex-shrink: 0; line-height: 1; }
  .sidebar-nav-badge {
    margin-left: auto; font-family: 'JetBrains Mono', monospace;
    font-size: 8px; padding: 2px 6px; border-radius: 20px; font-weight: 700;
    background: linear-gradient(135deg,var(--accent),#5a3de0); color: white;
    letter-spacing: 0.3px;
  }

  /* SIDEBAR HISTORY */
  .sidebar-history { flex: 1; overflow-y: auto; padding: 4px 10px; }
  .sidebar-history-label {
    font-family: 'JetBrains Mono', monospace; font-size: 9px; font-weight: 700;
    color: var(--muted); letter-spacing: 1.2px; text-transform: uppercase;
    padding: 10px 6px 4px; display: flex; align-items: center; gap: 6px;
  }

  /* SIDEBAR BOTTOM */
  .sidebar-bottom {
    padding: 12px 10px; border-top: 1px solid var(--border);
    display: flex; flex-direction: column; gap: 8px;
  }
  .sidebar-user {
    display: flex; align-items: center; gap: 10px;
    padding: 10px 12px; border-radius: 11px; cursor: pointer;
    transition: background 0.18s;
  }
  .sidebar-user:hover { background: var(--surface2); }
  .sidebar-user-avatar {
    width: 32px; height: 32px; border-radius: 50%; flex-shrink: 0;
    background: linear-gradient(135deg, var(--accent3), var(--accent));
    display: flex; align-items: center; justify-content: center;
    font-size: 13px; font-weight: 700; color: white;
  }
  .sidebar-user-name { font-size: 13px; font-weight: 600; color: var(--text); }
  .sidebar-user-role { font-size: 10px; color: var(--muted); font-family: 'JetBrains Mono', monospace; }
  .sidebar-user-logout {
    margin-left: auto; font-size: 12px; color: var(--muted);
    padding: 4px 8px; border-radius: 7px; border: 1px solid var(--border);
    background: transparent; cursor: pointer; font-family: 'JetBrains Mono', monospace;
    transition: all 0.18s;
  }
  .sidebar-user-logout:hover { border-color: var(--accent3); color: var(--accent3); }

  /* SIDEBAR TOGGLE BUTTON (hamburger) */
  .sidebar-toggle {
    position: fixed; top: 16px; left: 16px; z-index: 400;
    width: 40px; height: 40px; border-radius: 11px;
    background: var(--surface); border: 1px solid var(--border);
    color: var(--text); cursor: pointer; font-size: 18px;
    display: flex; align-items: center; justify-content: center;
    transition: all 0.22s; box-shadow: var(--card-shadow);
  }
  .sidebar-toggle:hover { border-color: var(--accent); color: var(--accent); }
  .sidebar-toggle.open { left: 272px; }

  /* SIDEBAR OVERLAY */
  .sidebar-overlay {
    position: fixed; inset: 0; background: rgba(0,0,0,0.55);
    z-index: 299; animation: fadeIn 0.2s ease;
    backdrop-filter: blur(2px);
  }

  /* MAIN CONTENT AREA */
  .main-content {
    flex: 1; min-height: 100vh;
    margin-left: 260px;
    transition: margin-left 0.28s cubic-bezier(.22,1,.36,1);
    display: flex; flex-direction: column;
    min-width: 0;
  }
  .main-content.sidebar-collapsed { margin-left: 0; }

  /* RESPONSIVE */
  @media (max-width: 768px) {
    .sidebar { width: 240px; }
    .sidebar-toggle.open { left: 252px; }
    .main-content { margin-left: 0 !important; }
    .sidebar-toggle { top: 12px; left: 12px; }
  }

  /* TOP BAR (replaces header) */
  .topbar {
    position: sticky; top: 0; z-index: 100;
    display: flex; align-items: center; justify-content: space-between;
    padding: 14px 24px; background: var(--bg);
    border-bottom: 1px solid var(--border);
    backdrop-filter: blur(12px);
    transition: all 0.38s;
  }
  .topbar-left { display: flex; align-items: center; gap: 12px; }
  .topbar-title { font-size: 16px; font-weight: 700; color: var(--text); }
  .topbar-right { display: flex; align-items: center; gap: 10px; }

  .status-badge {
    display: flex; align-items: center; gap: 7px;
    font-family: 'JetBrains Mono', monospace; font-size: 11px;
    color: var(--muted); background: var(--surface);
    border: 1px solid var(--border); padding: 5px 11px; border-radius: 20px;
    transition: all 0.38s;
  }
  .status-dot {
    width: 6px; height: 6px; border-radius: 50%;
    background: var(--accent2); box-shadow: 0 0 6px var(--accent2);
    animation: pulse 2s infinite;
  }

  .topbar-spacer { width: 52px; flex-shrink: 0; }

  /* CONTENT WRAPPER */
  .content-wrapper {
    flex: 1; max-width: 900px; width: 100%;
    margin: 0 auto; padding: 0 20px;
    display: flex; flex-direction: column;
  }

  /* IMAGE GALLERY */
  .img-gallery {
    display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 12px; margin-top: 16px;
  }
  .img-gallery-item {
    position: relative; border-radius: 12px; overflow: hidden;
    border: 1px solid var(--border); cursor: pointer;
    transition: all 0.22s; aspect-ratio: 4/3;
    background: var(--surface2);
  }
  .img-gallery-item:hover { transform: scale(1.03); box-shadow: var(--glow); border-color: var(--accent); }
  .img-gallery-item img { width: 100%; height: 100%; object-fit: cover; display: block; }
  .img-gallery-item-overlay {
    position: absolute; inset: 0; background: linear-gradient(transparent 50%, rgba(0,0,0,0.85));
    opacity: 0; transition: opacity 0.22s; display: flex; align-items: flex-end; padding: 10px;
  }
  .img-gallery-item:hover .img-gallery-item-overlay { opacity: 1; }
  .img-gallery-item-label {
    font-size: 10px; color: rgba(255,255,255,0.85);
    font-family: 'JetBrains Mono', monospace; line-height: 1.4;
  }
  .img-gallery-del {
    position: absolute; top: 6px; right: 6px; width: 24px; height: 24px;
    border-radius: 6px; border: none; background: rgba(255,92,138,0.85);
    color: white; font-size: 11px; cursor: pointer;
    display: flex; align-items: center; justify-content: center;
    opacity: 0; transition: opacity 0.18s;
  }
  .img-gallery-item:hover .img-gallery-del { opacity: 1; }

  .img-lightbox {
    position: fixed; inset: 0; background: rgba(0,0,0,0.94); z-index: 9000;
    display: flex; flex-direction: column; align-items: center; justify-content: center;
    animation: fadeIn 0.2s ease; padding: 20px; gap: 0;
  }
  .img-lightbox img {
    max-width: min(90vw, 800px); max-height: 60vh;
    border-radius: 16px; object-fit: contain;
    box-shadow: 0 20px 60px rgba(0,0,0,0.6);
  }
  .img-lightbox-close {
    position: absolute; top: 16px; right: 16px; width: 40px; height: 40px;
    border-radius: 50%; border: none; background: rgba(255,255,255,0.12);
    color: white; font-size: 20px; cursor: pointer; display: flex;
    align-items: center; justify-content: center; transition: background 0.2s; z-index: 2;
  }
  .img-lightbox-close:hover { background: rgba(255,92,138,0.5); }
  .img-lightbox-info {
    margin-top: 12px;
    background: rgba(255,255,255,0.08); border-radius: 10px; padding: 7px 16px;
    font-size: 11px; color: rgba(255,255,255,0.65);
    font-family: 'JetBrains Mono', monospace; text-align: center;
    max-width: min(90vw, 600px); white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
  }
  .img-lightbox-actions {
    display: flex; gap: 12px; margin-top: 18px;
  }
  .img-lightbox-btn {
    display: flex; align-items: center; gap: 7px;
    padding: 12px 28px; border-radius: 14px; border: none;
    font-family: 'Syne', sans-serif; font-size: 15px; font-weight: 700;
    cursor: pointer; transition: all 0.22s;
  }
  .img-lightbox-btn.back {
    background: rgba(255,255,255,0.10); color: white;
    border: 1.5px solid rgba(255,255,255,0.22);
  }
  .img-lightbox-btn.back:hover { background: rgba(255,255,255,0.20); }
  .img-lightbox-btn.download {
    background: linear-gradient(135deg, var(--accent2), #00b89e); color: #0a0a0f;
    box-shadow: 0 4px 18px rgba(0,229,200,0.35);
  }
  .img-lightbox-btn.download:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(0,229,200,0.50); }

  @keyframes skeletonShimmer {
    0%   { background-position: 200% 0; }
    100% { background-position: -200% 0; }
  }
  @keyframes fadeInImg {
    from { opacity: 0; transform: scale(0.96); }
    to   { opacity: 1; transform: scale(1); }
  }

  /* HISTORY ITEMS (in sidebar) */
  .history-item {
    display: flex; align-items: center; gap: 8px;
    padding: 9px 10px; border-radius: 10px; cursor: pointer;
    transition: background 0.18s; margin-bottom: 2px;
    border: 1px solid transparent;
  }
  .history-item:hover { background: var(--surface2); }
  .history-item.active { background: rgba(124,92,255,0.10); border-color: var(--border); }
  .history-item-icon { font-size: 13px; flex-shrink: 0; }
  .history-item-text { flex: 1; min-width: 0; }
  .history-item-title {
    font-size: 12px; font-weight: 600; color: var(--text);
    white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
  }
  .history-item-date { font-size: 10px; color: var(--muted); font-family: 'JetBrains Mono', monospace; }
  .history-item-del {
    width: 20px; height: 20px; border-radius: 5px; border: none;
    background: transparent; color: var(--muted); cursor: pointer;
    display: flex; align-items: center; justify-content: center;
    font-size: 11px; opacity: 0; transition: all 0.18s; flex-shrink: 0;
  }
  .history-item:hover .history-item-del { opacity: 1; }
  .history-item-del:hover { background: rgba(255,92,138,0.15); color: var(--accent3); }

  .user-avatar {
    width: 22px; height: 22px; border-radius: 50%;
    background: linear-gradient(135deg, var(--accent3), var(--accent));
    display: flex; align-items: center; justify-content: center;
    font-size: 11px; font-weight: 700; color: white;
  }

  /* ────────────────────────────────
     MESSAGE ACTION BUTTONS
  ──────────────────────────────── */
  .msg-actions {
    display: flex; gap: 6px; margin-top: 10px; flex-wrap: wrap;
  }
  .msg-action-btn {
    display: inline-flex; align-items: center; gap: 4px;
    padding: 4px 10px; border-radius: 16px;
    border: 1px solid var(--border); background: var(--surface2);
    color: var(--muted); font-family: 'JetBrains Mono', monospace;
    font-size: 10px; cursor: pointer; transition: all 0.2s;
  }
  .msg-action-btn:hover { border-color: var(--accent); color: var(--accent); }
  .msg-action-btn.copied { border-color: var(--accent2); color: var(--accent2); }




  /* ────────────────────────────────
     SUMMARIZER TAB
  ──────────────────────────────── */
  .summarizer {
    position: relative; z-index: 10; padding: 20px 0; flex: 1;
    display: flex; flex-direction: column; gap: 16px;
  }
  .sum-card {
    background: var(--surface); border: 1px solid var(--border);
    border-radius: 18px; padding: 22px; box-shadow: var(--card-shadow);
    transition: all 0.38s;
  }
  .sum-label {
    font-family: 'JetBrains Mono', monospace; font-size: 10px;
    color: var(--accent2); text-transform: uppercase; letter-spacing: 1px;
    margin-bottom: 10px;
  }
  .sum-textarea {
    width: 100%; padding: 14px 16px; background: var(--surface2);
    border: 1.5px solid var(--border); border-radius: 12px;
    color: var(--text); font-family: 'Syne', sans-serif; font-size: 13.5px;
    outline: none; resize: none; min-height: 120px; line-height: 1.6;
    transition: all 0.22s;
  }
  .sum-textarea:focus { border-color: var(--accent); box-shadow: 0 0 0 3px rgba(124,92,255,0.10); }
  .sum-textarea::placeholder { color: var(--muted); }
  .sum-options { display: flex; gap: 8px; flex-wrap: wrap; margin: 10px 0; }
  .sum-opt {
    padding: 6px 14px; border-radius: 20px; border: 1px solid var(--border);
    background: var(--surface2); color: var(--muted); font-size: 12px;
    font-family: 'JetBrains Mono', monospace; cursor: pointer; transition: all 0.2s;
  }
  .sum-opt.active, .sum-opt:hover { background: rgba(124,92,255,0.12); border-color: var(--accent); color: var(--accent); }
  .sum-btn {
    width: 100%; padding: 12px; background: linear-gradient(135deg, var(--accent2), #00b89e);
    border: none; border-radius: 12px; color: #0a0a0f;
    font-family: 'Syne', sans-serif; font-size: 14px; font-weight: 700;
    cursor: pointer; transition: all 0.22s;
    display: flex; align-items: center; justify-content: center; gap: 8px;
  }
  .sum-btn:hover:not(:disabled) { transform: translateY(-1px); box-shadow: 0 8px 22px rgba(0,229,200,0.35); }
  .sum-btn:disabled { opacity: 0.42; cursor: not-allowed; transform: none; }
  .sum-result {
    background: var(--surface2); border: 1px solid var(--border);
    border-radius: 14px; padding: 16px; font-size: 14px;
    line-height: 1.7; color: var(--text); white-space: pre-wrap;
    animation: slideIn 0.3s ease;
  }

  /* ────────────────────────────────
     CODE INTERPRETER TAB
  ──────────────────────────────── */
  .code-tab {
    position: relative; z-index: 10; padding: 20px 0; flex: 1;
    display: flex; flex-direction: column; gap: 16px;
  }
  .code-card {
    background: var(--surface); border: 1px solid var(--border);
    border-radius: 18px; padding: 22px; box-shadow: var(--card-shadow);
    transition: all 0.38s;
  }
  .code-lang-row { display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 12px; }
  .code-lang-btn {
    padding: 5px 14px; border-radius: 20px; border: 1px solid var(--border);
    background: var(--surface2); color: var(--muted); font-size: 11px;
    font-family: 'JetBrains Mono', monospace; cursor: pointer; transition: all 0.2s;
  }
  .code-lang-btn.active { background: rgba(124,92,255,0.15); border-color: var(--accent); color: var(--accent); }
  .code-editor {
    width: 100%; padding: 14px 16px; background: #0d0d18;
    border: 1.5px solid var(--border); border-radius: 12px;
    color: #e8e6ff; font-family: 'JetBrains Mono', monospace; font-size: 13px;
    outline: none; resize: none; min-height: 140px; line-height: 1.6;
    transition: border-color 0.22s; tab-size: 2;
  }
  .code-editor:focus { border-color: var(--accent); }
  .code-editor::placeholder { color: #6a6880; }
  .code-run-row { display: flex; gap: 10px; margin-top: 10px; }
  .code-run-btn {
    flex: 1; padding: 11px; background: linear-gradient(135deg, var(--accent), #5a3de0);
    border: none; border-radius: 12px; color: white;
    font-family: 'Syne', sans-serif; font-size: 13px; font-weight: 700;
    cursor: pointer; transition: all 0.22s;
    display: flex; align-items: center; justify-content: center; gap: 7px;
  }
  .code-run-btn:hover:not(:disabled) { transform: translateY(-1px); box-shadow: 0 8px 22px rgba(124,92,255,0.45); }
  .code-run-btn:disabled { opacity: 0.42; cursor: not-allowed; transform: none; }
  .code-explain-btn {
    padding: 11px 16px; border-radius: 12px; border: 1.5px solid var(--border);
    background: var(--surface2); color: var(--muted); font-size: 13px;
    font-family: 'Syne', sans-serif; font-weight: 600; cursor: pointer; transition: all 0.22s;
  }
  .code-explain-btn:hover:not(:disabled) { border-color: var(--accent2); color: var(--accent2); }
  .code-explain-btn:disabled { opacity: 0.42; cursor: not-allowed; }
  .code-output {
    background: #0a0a14; border: 1px solid var(--border); border-radius: 12px;
    padding: 14px 16px; font-family: 'JetBrains Mono', monospace; font-size: 12.5px;
    line-height: 1.65; color: #e8e6ff; white-space: pre-wrap; word-break: break-word;
    min-height: 60px; animation: slideIn 0.3s ease;
  }
  .code-output.error { color: var(--accent3); }
  .code-output-label {
    font-family: 'JetBrains Mono', monospace; font-size: 10px;
    text-transform: uppercase; letter-spacing: 1px; margin-bottom: 8px;
    display: flex; align-items: center; gap: 8px;
  }



  /* ────────────────────────────────
     THINK MODE BADGE & REASONING BOX
  ──────────────────────────────── */
  .think-badge {
    display: inline-flex; align-items: center; gap: 6px;
    font-family: 'JetBrains Mono', monospace; font-size: 10px;
    color: #a78bff; background: rgba(124,92,255,0.10);
    border: 1px solid rgba(124,92,255,0.28); padding: 3px 10px;
    border-radius: 10px; margin-bottom: 8px; letter-spacing: 0.5px;
    animation: thinkPulse 2s ease-in-out infinite;
  }
  @keyframes thinkPulse {
    0%,100% { opacity:1; } 50% { opacity:0.6; }
  }
  .think-block {
    background: rgba(124,92,255,0.06); border: 1px solid rgba(124,92,255,0.18);
    border-radius: 10px; padding: 10px 14px; margin-bottom: 10px;
    font-size: 12.5px; line-height: 1.6; color: var(--muted);
    font-family: 'JetBrains Mono', monospace; white-space: pre-wrap;
    cursor: pointer; transition: all 0.2s;
  }
  .think-block:hover { background: rgba(124,92,255,0.10); }
  .think-toggle { font-size: 10px; color: var(--accent); margin-top:4px; display:inline-block; }

  /* ────────────────────────────────
     PERSONA / TONE SELECTOR
  ──────────────────────────────── */
  .persona-bar {
    display: flex; gap: 6px; flex-wrap: wrap;
    padding: 10px 0 2px; align-items: center;
  }
  .persona-label {
    font-family: 'JetBrains Mono', monospace; font-size: 10px;
    color: var(--muted); letter-spacing: 0.5px; margin-right: 4px;
  }
  .persona-btn {
    padding: 5px 13px; border-radius: 20px; border: 1px solid var(--border);
    background: var(--surface2); color: var(--muted); font-size: 11.5px;
    font-family: 'Syne', sans-serif; font-weight: 600; cursor: pointer;
    transition: all 0.2s; display: flex; align-items: center; gap: 5px;
  }
  .persona-btn:hover { border-color: var(--accent); color: var(--accent); }
  .persona-btn.active {
    background: linear-gradient(135deg,var(--accent),#5a3de0);
    border-color: transparent; color: #fff;
    box-shadow: 0 3px 12px rgba(124,92,255,0.35);
  }

  /* ────────────────────────────────
     MATH SOLVER TAB
  ──────────────────────────────── */
  .math-tab {
    position:relative; z-index:10; padding:20px 0; flex:1;
    display:flex; flex-direction:column; gap:16px;
  }
  .math-card {
    background: var(--surface); border: 1px solid var(--border);
    border-radius: 18px; padding: 22px; box-shadow: var(--card-shadow);
  }
  .math-input {
    width: 100%; padding: 14px 16px; background: var(--surface2);
    border: 1.5px solid var(--border); border-radius: 12px;
    color: var(--text); font-family: 'JetBrains Mono', monospace; font-size: 15px;
    outline: none; resize: none; min-height: 80px; line-height: 1.6;
    transition: all 0.22s;
  }
  .math-input:focus { border-color: var(--accent); box-shadow: 0 0 0 3px rgba(124,92,255,0.10); }
  .math-input::placeholder { color: var(--muted); font-size: 13px; }
  .math-steps {
    display: flex; flex-direction: column; gap: 10px; margin-top: 4px;
  }
  .math-step {
    background: var(--surface2); border: 1px solid var(--border);
    border-radius: 12px; padding: 12px 16px;
    font-family: 'JetBrains Mono', monospace; font-size: 13px;
    line-height: 1.65; white-space: pre-wrap; color: var(--text);
    animation: slideIn 0.3s ease;
  }
  .math-step-label {
    font-size: 10px; color: var(--accent2); text-transform: uppercase;
    letter-spacing: 1px; margin-bottom: 6px;
  }
  .math-answer {
    background: rgba(0,229,200,0.08); border: 1.5px solid rgba(0,229,200,0.3);
    border-radius: 14px; padding: 16px 20px;
    font-family: 'JetBrains Mono', monospace; font-size: 16px;
    font-weight: 700; color: var(--accent2); text-align: center;
    animation: slideIn 0.3s ease; letter-spacing: 0.5px;
  }

  /* ────────────────────────────────
     FILE Q&A TAB
  ──────────────────────────────── */
  .fileqa-tab {
    position:relative; z-index:10; padding:20px 0; flex:1;
    display:flex; flex-direction:column; gap:16px;
  }
  .fileqa-card {
    background: var(--surface); border: 1px solid var(--border);
    border-radius: 18px; padding: 22px; box-shadow: var(--card-shadow);
  }
  .fileqa-drop {
    border: 2px dashed var(--border); border-radius: 14px;
    padding: 32px 16px; text-align: center; cursor: pointer;
    transition: all 0.22s;
  }
  .fileqa-drop:hover, .fileqa-drop.drag { border-color: var(--accent2); background: rgba(0,229,200,0.04); }
  .fileqa-drop-icon { font-size: 36px; margin-bottom: 10px; }
  .fileqa-drop-text { font-size: 13.5px; color: var(--muted); }
  .fileqa-drop-hint { font-size: 11px; color: var(--muted); margin-top:6px; font-family:'JetBrains Mono',monospace; }
  .fileqa-file-info {
    display: flex; align-items: center; gap: 10px;
    background: var(--surface2); border: 1px solid var(--border);
    border-radius: 12px; padding: 12px 16px; margin-bottom: 12px;
  }
  .fileqa-file-icon { font-size: 22px; }
  .fileqa-file-name { font-size: 13px; font-weight: 600; color: var(--text); }
  .fileqa-file-size { font-size: 11px; color: var(--muted); font-family:'JetBrains Mono',monospace; }
  .fileqa-file-clear {
    margin-left: auto; width:28px; height:28px; border-radius:8px;
    border:1px solid var(--border); background: transparent;
    color: var(--muted); cursor: pointer; font-size:13px;
    display:flex; align-items:center; justify-content:center; transition:all 0.2s;
  }
  .fileqa-file-clear:hover { border-color:var(--accent3); color:var(--accent3); }
  .fileqa-qa-list { display:flex; flex-direction:column; gap:10px; margin-top:4px; }
  .fileqa-qa-item {
    background: var(--surface2); border:1px solid var(--border);
    border-radius: 12px; padding:12px 16px; animation: slideIn 0.3s ease;
  }
  .fileqa-q { font-size:12px; color:var(--muted); margin-bottom:6px; font-family:'JetBrains Mono',monospace; }
  .fileqa-a { font-size:13.5px; color:var(--text); line-height:1.65; white-space:pre-wrap; }

  /* ────────────────────────────────
     TRENDS TAB
  ──────────────────────────────── */
  .trends-tab {
    position:relative; z-index:10; padding:20px 0; flex:1;
    display:flex; flex-direction:column; gap:16px;
  }
  .trends-card {
    background: var(--surface); border: 1px solid var(--border);
    border-radius: 18px; padding: 22px; box-shadow: var(--card-shadow);
  }
  .trends-grid { display:grid; grid-template-columns:1fr 1fr; gap:10px; margin-top:4px; }
  @media(max-width:580px){ .trends-grid{ grid-template-columns:1fr; } }
  .trend-card {
    background: var(--surface2); border:1px solid var(--border); border-radius:14px;
    padding:14px 16px; cursor:pointer; transition:all 0.22s; animation: slideIn 0.3s ease;
  }
  .trend-card:hover { border-color:var(--accent); transform:translateY(-2px); box-shadow:var(--glow); }
  .trend-card-top { display:flex; align-items:center; gap:8px; margin-bottom:6px; }
  .trend-num { font-family:'JetBrains Mono',monospace; font-size:11px; color:var(--accent); font-weight:700; }
  .trend-category { font-size:10px; color:var(--muted); font-family:'JetBrains Mono',monospace;
    background:var(--surface3); padding:2px 8px; border-radius:10px; }
  .trend-title { font-size:13px; font-weight:700; color:var(--text); line-height:1.4; }
  .trend-snippet { font-size:11.5px; color:var(--muted); margin-top:5px; line-height:1.5; }
  .trend-ask-btn {
    margin-top:8px; padding:5px 12px; border-radius:20px; border:1px solid var(--border);
    background:transparent; color:var(--accent); font-size:11px; cursor:pointer;
    font-family:'JetBrains Mono',monospace; transition:all 0.2s;
  }
  .trend-ask-btn:hover { background:rgba(124,92,255,0.10); border-color:var(--accent); }
  .trends-cats { display:flex; gap:6px; flex-wrap:wrap; margin-bottom:14px; }
  .trends-cat-btn {
    padding:5px 13px; border-radius:20px; border:1px solid var(--border);
    background:var(--surface2); color:var(--muted); font-size:11px;
    font-family:'JetBrains Mono',monospace; cursor:pointer; transition:all 0.2s;
  }
  .trends-cat-btn.active { background:rgba(0,229,200,0.12); border-color:var(--accent2); color:var(--accent2); }
  .think-toggle-row {
    display: flex; align-items: center; gap: 8px;
    font-family: 'JetBrains Mono', monospace; font-size: 11px;
    color: var(--muted); cursor: pointer; user-select: none;
    padding: 6px 0;
  }
  .think-toggle-row:hover { color: var(--accent); }
  .think-pill {
    width: 32px; height: 18px; border-radius: 9px;
    background: var(--surface2); border: 1px solid var(--border);
    position: relative; transition: all 0.25s; flex-shrink: 0;
  }
  .think-pill.on {
    background: linear-gradient(90deg, var(--accent), #5a3de0);
    border-color: transparent; box-shadow: 0 0 10px rgba(124,92,255,0.35);
  }
  .think-knob {
    position: absolute; width: 12px; height: 12px; border-radius: 50%;
    background: white; top: 2px; left: 2px;
    transition: transform 0.25s; box-shadow: 0 1px 3px rgba(0,0,0,0.26);
  }
  .think-pill.on .think-knob { transform: translateX(14px); }

  .messages {
    flex: 1; padding: 20px 0;
    display: flex; flex-direction: column; gap: 20px;
    position: relative; z-index: 10;
    overflow-y: auto;
    min-height: 300px; max-height: calc(100vh - 320px);
  }

  .empty-state {
    flex: 1; display: flex; flex-direction: column;
    align-items: center; justify-content: center;
    gap: 16px; padding: 60px 20px; text-align: center;
  }

  .empty-icon {
    width: 72px; height: 72px; background: var(--surface2);
    border: 1px solid var(--border); border-radius: 20px;
    display: flex; align-items: center; justify-content: center;
    font-size: 32px; box-shadow: var(--glow);
    animation: float 3s ease-in-out infinite;
    transition: background 0.38s, border-color 0.38s;
  }

  @keyframes float {
    0%,100% { transform: translateY(0); }
    50% { transform: translateY(-8px); }
  }

  .empty-title { font-size: 24px; font-weight: 800; letter-spacing: -0.5px; color: var(--text); }
  .empty-sub   { color: var(--muted); font-size: 14px; max-width: 340px; line-height: 1.6; }

  .suggestions { display: flex; flex-wrap: wrap; gap: 8px; justify-content: center; margin-top: 8px; }

  .suggestion {
    background: var(--surface); border: 1px solid var(--border);
    border-radius: 20px; padding: 8px 16px; font-size: 13px;
    color: var(--text); cursor: pointer; transition: all 0.22s;
    font-family: 'Syne', sans-serif;
  }

  .suggestion:hover {
    background: var(--surface2); border-color: var(--accent);
    color: var(--accent); transform: translateY(-1px); box-shadow: var(--glow);
  }

  .message { display: flex; gap: 12px; animation: slideIn 0.3s ease; }

  @keyframes slideIn {
    from { opacity: 0; transform: translateY(10px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  .message.user { flex-direction: row-reverse; }

  .avatar {
    width: 36px; height: 36px; border-radius: 10px;
    display: flex; align-items: center; justify-content: center;
    font-size: 16px; flex-shrink: 0;
  }

  .avatar.ai   { background: linear-gradient(135deg, var(--accent), #5a3de0); box-shadow: var(--glow); }
  .avatar.user { background: var(--surface2); border: 1px solid var(--border); transition: all 0.38s; }

  .bubble {
    max-width: 78%; padding: 14px 18px;
    border-radius: 16px; font-size: 14.5px; line-height: 1.65;
    transition: background 0.38s, border-color 0.38s;
  }

  .bubble.ai {
    background: var(--surface); border: 1px solid var(--border);
    border-top-left-radius: 4px; color: var(--text);
  }

  .bubble.user {
    background: linear-gradient(135deg, var(--accent), #5a3de0);
    border-top-right-radius: 4px; color: white;
  }

  .web-badge {
    display: inline-flex; align-items: center; gap: 5px;
    font-family: 'JetBrains Mono', monospace; font-size: 10px;
    color: var(--accent2); background: rgba(0,229,200,0.08);
    border: 1px solid rgba(0,229,200,0.22); padding: 3px 8px;
    border-radius: 10px; margin-bottom: 10px; letter-spacing: 0.5px;
  }

  .answer-text { white-space: pre-wrap; word-break: break-word; }

  .sources {
    margin-top: 14px; padding-top: 12px;
    border-top: 1px solid var(--border);
    display: flex; flex-direction: column; gap: 6px;
  }

  .sources-label {
    font-family: 'JetBrains Mono', monospace; font-size: 10px;
    color: var(--muted); text-transform: uppercase; letter-spacing: 1px; margin-bottom: 4px;
  }

  .source-link {
    display: flex; align-items: center; gap: 8px;
    font-size: 12px; color: var(--accent); text-decoration: none;
    padding: 6px 10px; background: rgba(124,92,255,0.06);
    border: 1px solid rgba(124,92,255,0.12); border-radius: 8px;
    transition: all 0.22s; overflow: hidden;
  }

  .source-link:hover { background: rgba(124,92,255,0.12); border-color: var(--accent); transform: translateX(2px); }

  .source-favicon { width: 14px; height: 14px; flex-shrink: 0; }
  .source-title   { white-space: nowrap; overflow: hidden; text-overflow: ellipsis; flex: 1; }
  .source-domain  { color: var(--muted); font-family: 'JetBrains Mono', monospace; font-size: 10px; flex-shrink: 0; }

  .typing { display: flex; gap: 5px; align-items: center; padding: 4px 0; }

  .dot { width: 7px; height: 7px; border-radius: 50%; background: var(--accent); animation: bounce 1.2s infinite; }
  .dot:nth-child(2) { animation-delay: 0.2s; background: var(--accent2); }
  .dot:nth-child(3) { animation-delay: 0.4s; background: var(--accent3); }

  @keyframes bounce {
    0%,60%,100% { transform: translateY(0); opacity: 0.5; }
    30% { transform: translateY(-6px); opacity: 1; }
  }

  .search-status {
    font-family: 'JetBrains Mono', monospace; font-size: 12px;
    color: var(--accent2); display: flex; align-items: center; gap: 8px; padding: 10px 0 4px;
  }

  .search-spinner {
    width: 14px; height: 14px;
    border: 2px solid var(--border2); border-top-color: var(--accent2);
    border-radius: 50%; animation: spin 0.8s linear infinite;
  }

  @keyframes spin { to { transform: rotate(360deg); } }

  /* ────────────────────────────────
     INPUT AREA
  ──────────────────────────────── */
  .input-area {
    position: sticky; bottom: 0; z-index: 50;
    padding: 14px 0 18px;
    border-top: 1px solid var(--border);
    background: var(--bg);
    transition: border-color 0.38s, background 0.38s;
  }
  @media (max-width: 768px) {
    .input-area {
      position: fixed; bottom: 0; left: 0; right: 0;
      padding: 10px 16px 20px;
      border-top: 1.5px solid var(--border);
      box-shadow: 0 -8px 32px rgba(0,0,0,0.35);
      z-index: 200;
    }
    .messages {
      padding-bottom: 180px !important;
      max-height: none !important;
    }
    .content-wrapper {
      padding: 0 12px !important;
    }
    .bubble { max-width: 90% !important; }
    .persona-bar { gap: 4px !important; }
    .persona-btn { padding: 4px 8px !important; font-size: 10px !important; }
  }

  .input-wrapper {
    display: flex; gap: 10px; align-items: flex-end;
    background: var(--surface); border: 1.5px solid var(--border);
    border-radius: 16px; padding: 12px 12px 12px 18px;
    transition: border-color 0.22s, box-shadow 0.22s, background 0.38s;
  }

  .input-wrapper:focus-within { border-color: var(--accent); box-shadow: var(--glow); }

  textarea {
    flex: 1; background: transparent; border: none; outline: none;
    color: var(--text); font-family: 'Syne', sans-serif;
    font-size: 14.5px; line-height: 1.5; resize: none;
    min-height: 24px; max-height: 150px;
    transition: color 0.38s;
  }

  textarea::placeholder { color: var(--muted); }

  .send-btn {
    width: 42px; height: 42px; border-radius: 12px; border: none;
    cursor: pointer; display: flex; align-items: center; justify-content: center;
    font-size: 18px; transition: all 0.22s; flex-shrink: 0;
    background: linear-gradient(135deg, var(--accent), #5a3de0);
    box-shadow: 0 4px 15px rgba(124,92,255,0.36); color: white;
  }

  .send-btn:hover:not(:disabled) { transform: scale(1.06); box-shadow: 0 6px 20px rgba(124,92,255,0.50); }
  .send-btn:disabled { opacity: 0.38; cursor: not-allowed; transform: none; }

  .stop-btn {
    width: 42px; height: 42px; border-radius: 12px; border: none;
    cursor: pointer; display: flex; align-items: center; justify-content: center;
    font-size: 16px; transition: all 0.22s; flex-shrink: 0;
    background: rgba(255,92,138,0.15);
    border: 1.5px solid var(--accent3); color: var(--accent3);
    animation: stopPulse 1.4s ease-in-out infinite;
  }
  .stop-btn:hover { background: rgba(255,92,138,0.28); transform: scale(1.06); }
  @keyframes stopPulse {
    0%,100% { box-shadow: 0 0 0 0 rgba(255,92,138,0.35); }
    50%      { box-shadow: 0 0 0 7px rgba(255,92,138,0); }
  }

  .input-footer {
    display: flex; align-items: center; justify-content: space-between;
    margin-top: 10px; padding: 0 4px;
  }

  .mode-toggle {
    display: flex; align-items: center; gap: 8px;
    font-family: 'JetBrains Mono', monospace; font-size: 11px;
    color: var(--muted); cursor: pointer; user-select: none; transition: color 0.22s;
  }

  .mode-toggle:hover { color: var(--text); }

  .toggle-pill {
    width: 32px; height: 18px; border-radius: 9px;
    background: var(--surface2); border: 1px solid var(--border);
    position: relative; transition: all 0.25s;
  }

  .toggle-pill.on {
    background: linear-gradient(90deg, var(--accent), var(--accent2));
    border-color: transparent; box-shadow: 0 0 10px rgba(0,229,200,0.26);
  }

  .toggle-knob-sm {
    position: absolute; width: 12px; height: 12px; border-radius: 50%;
    background: white; top: 2px; left: 2px;
    transition: transform 0.25s; box-shadow: 0 1px 3px rgba(0,0,0,0.26);
  }

  .toggle-pill.on .toggle-knob-sm { transform: translateX(14px); }

  .char-count { font-family: 'JetBrains Mono', monospace; font-size: 11px; color: var(--muted); }

  .error-msg {
    font-size: 13px; color: var(--accent3); font-family: 'JetBrains Mono', monospace;
    margin-top: 8px; padding: 10px 14px;
    background: rgba(255,92,138,0.08); border: 1px solid rgba(255,92,138,0.20); border-radius: 10px;
  }

  /* ────────────────────────────────
     IMAGE STUDIO
  ──────────────────────────────── */
  .image-studio {
    position: relative; z-index: 10; padding: 20px 0; flex: 1;
    display: flex; flex-direction: column; gap: 20px;
  }

  .studio-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }

  @media(max-width: 640px) { .studio-grid { grid-template-columns: 1fr; } }

  .studio-card {
    background: var(--surface); border: 1px solid var(--border);
    border-radius: 18px; padding: 20px;
    transition: all 0.22s;
    box-shadow: var(--card-shadow);
  }

  .studio-card:hover { border-color: rgba(124,92,255,0.30); box-shadow: var(--glow); }

  .card-header { display: flex; align-items: center; gap: 10px; margin-bottom: 16px; }

  .card-icon {
    width: 36px; height: 36px; border-radius: 10px;
    display: flex; align-items: center; justify-content: center; font-size: 17px;
  }

  .card-icon.upload   { background: rgba(0,229,200,0.10); }
  .card-icon.generate { background: rgba(124,92,255,0.12); }

  .card-title { font-size: 15px; font-weight: 700; color: var(--text); }
  .card-sub   { font-size: 12px; color: var(--muted); margin-top: 2px; }

  .upload-zone {
    border: 2px dashed var(--border); border-radius: 14px;
    padding: 28px 16px; text-align: center; cursor: pointer; transition: all 0.22s;
  }

  .upload-zone:hover, .upload-zone.drag-over {
    border-color: var(--accent2); background: rgba(0,229,200,0.04);
  }

  .upload-zone-icon { font-size: 28px; margin-bottom: 8px; }
  .upload-zone-text { font-size: 13px; color: var(--muted); }
  .upload-zone-hint { font-size: 11px; color: var(--muted); margin-top: 4px; font-family: 'JetBrains Mono', monospace; }

  .upload-preview img {
    width: 100%; max-height: 220px; object-fit: cover;
    border-radius: 12px; display: block;
  }

  .preview-actions { display: flex; gap: 8px; margin-top: 10px; }

  .preview-btn {
    flex: 1; padding: 9px 12px; border-radius: 10px; border: none;
    font-family: 'Syne', sans-serif; font-size: 12px; font-weight: 600;
    cursor: pointer; transition: all 0.22s;
    display: flex; align-items: center; justify-content: center; gap: 5px;
  }

  .preview-btn.remove  { background: rgba(255,92,138,0.10); color: var(--accent3); border: 1px solid rgba(255,92,138,0.20); }
  .preview-btn.remove:hover { background: rgba(255,92,138,0.20); }

  .preview-btn.analyze {
    background: linear-gradient(135deg, var(--accent), #5a3de0);
    color: white; box-shadow: 0 4px 14px rgba(124,92,255,0.30);
  }

  .preview-btn.analyze:hover    { transform: translateY(-1px); box-shadow: 0 6px 18px rgba(124,92,255,0.44); }
  .preview-btn.analyze:disabled { opacity: 0.46; cursor: not-allowed; transform: none; }

  .gen-input-wrap { display: flex; flex-direction: column; gap: 10px; }

  .gen-textarea {
    width: 100%; padding: 12px 16px;
    background: var(--surface2); border: 1.5px solid var(--border);
    border-radius: 12px; color: var(--text);
    font-family: 'Syne', sans-serif; font-size: 13.5px;
    outline: none; resize: none; min-height: 80px; line-height: 1.5;
    transition: all 0.22s;
  }

  .gen-textarea:focus        { border-color: var(--accent); box-shadow: 0 0 0 3px rgba(124,92,255,0.10); }
  .gen-textarea::placeholder { color: var(--muted); }

  .gen-btn {
    width: 100%; padding: 12px;
    background: linear-gradient(135deg, var(--accent), #5a3de0);
    border: none; border-radius: 12px; color: white;
    font-family: 'Syne', sans-serif; font-size: 14px; font-weight: 700;
    cursor: pointer; transition: all 0.22s;
    box-shadow: 0 4px 16px rgba(124,92,255,0.36);
    display: flex; align-items: center; justify-content: center; gap: 8px;
  }

  .gen-btn:hover:not(:disabled) { transform: translateY(-1px); box-shadow: 0 8px 22px rgba(124,92,255,0.50); }
  .gen-btn:disabled { opacity: 0.42; cursor: not-allowed; transform: none; }

  .result-panel {
    background: var(--surface); border: 1px solid var(--border);
    border-radius: 18px; padding: 20px;
    box-shadow: var(--card-shadow); transition: all 0.38s;
  }

  .result-header {
    display: flex; align-items: center; justify-content: space-between; margin-bottom: 14px;
  }

  .result-title { font-size: 15px; font-weight: 700; color: var(--text); }

  .download-row { display: flex; gap: 8px; margin-top: 12px; }

  .dl-btn {
    display: flex; align-items: center; gap: 7px;
    padding: 10px 18px; border-radius: 10px; border: none;
    font-family: 'Syne', sans-serif; font-size: 13px; font-weight: 600;
    cursor: pointer; transition: all 0.22s;
  }

  .dl-btn.primary {
    background: linear-gradient(135deg, var(--accent2), #00b89e);
    color: #0a0a0f; box-shadow: 0 4px 14px rgba(0,229,200,0.26); flex: 1;
  }

  .dl-btn.primary:hover { transform: translateY(-1px); box-shadow: 0 6px 20px rgba(0,229,200,0.36); }

  .dl-btn.secondary {
    background: var(--surface2); border: 1px solid var(--border); color: var(--muted);
  }

  .dl-btn.secondary:hover { color: var(--text); }

  .analyze-result {
    margin-top: 14px; padding: 14px;
    background: var(--surface2); border: 1px solid var(--border);
    border-radius: 12px; font-size: 13.5px; line-height: 1.65;
    color: var(--text); white-space: pre-wrap;
    animation: slideIn 0.3s ease; transition: all 0.38s;
  }

  .analyze-label {
    font-family: 'JetBrains Mono', monospace; font-size: 10px;
    color: var(--accent2); text-transform: uppercase; letter-spacing: 1px; margin-bottom: 8px;
  }

  .style-tags { display: flex; flex-wrap: wrap; gap: 6px; margin-bottom: 12px; }

  .style-tag {
    padding: 5px 12px; border-radius: 20px; font-size: 11.5px;
    border: 1px solid var(--border); background: var(--surface2);
    color: var(--muted); cursor: pointer; transition: all 0.22s;
    font-family: 'JetBrains Mono', monospace;
  }

  .style-tag:hover, .style-tag.active {
    background: rgba(124,92,255,0.12); border-color: var(--accent); color: var(--accent);
  }

  .shimmer-bar {
    height: 3px; border-radius: 3px;
    background: linear-gradient(90deg, var(--accent), var(--accent2));
    animation: loadBar 1.5s ease-in-out infinite;
    margin-bottom: 14px;
  }

  @keyframes loadBar {
    0%   { width: 0%;  margin-left: 0; }
    50%  { width: 60%; margin-left: 20%; }
    100% { width: 0%;  margin-left: 100%; }
  }

  ::-webkit-scrollbar { width: 4px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: var(--border); border-radius: 2px; }

  /* ── FREE IMAGES TAB ── */
  .free-img-search-row {
    display: flex; gap: 8px; margin-bottom: 14px; align-items: center;
  }
  .free-img-search-input {
    flex: 1; padding: 10px 16px; background: var(--surface2);
    border: 1.5px solid var(--border); border-radius: 12px;
    color: var(--text); font-family: 'Syne', sans-serif; font-size: 13.5px;
    outline: none; transition: all 0.22s;
  }
  .free-img-search-input:focus { border-color: var(--accent); box-shadow: 0 0 0 3px rgba(124,92,255,.10); }
  .free-img-search-input::placeholder { color: var(--muted); }
  .free-img-cats { display: flex; gap: 6px; flex-wrap: wrap; margin-bottom: 12px; }
  .free-img-cat-btn {
    padding: 5px 12px; border-radius: 20px; border: 1px solid var(--border);
    background: var(--surface2); color: var(--muted); font-size: 11px;
    font-family: 'JetBrains Mono', monospace; cursor: pointer; transition: all 0.2s;
  }
  .free-img-cat-btn:hover, .free-img-cat-btn.active {
    background: rgba(0,229,200,0.10); border-color: var(--accent2); color: var(--accent2);
  }
  .free-img-grid {
    display: grid; grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
    gap: 10px; margin-top: 8px;
  }
  @media(max-width:480px) { .free-img-grid { grid-template-columns: repeat(2,1fr); } }
  .free-img-item {
    position: relative; border-radius: 12px; overflow: hidden;
    border: 1px solid var(--border); cursor: pointer;
    transition: all 0.22s; aspect-ratio: 1; background: var(--surface2);
  }
  .free-img-item:hover { transform: scale(1.04); box-shadow: var(--glow); border-color: var(--accent2); }
  .free-img-item img { width: 100%; height: 100%; object-fit: cover; display: block; }
  .free-img-item-overlay {
    position: absolute; inset: 0; background: linear-gradient(transparent 55%, rgba(0,0,0,0.80));
    opacity: 0; transition: opacity 0.22s; display: flex; align-items: flex-end; padding: 8px;
  }
  .free-img-item:hover .free-img-item-overlay { opacity: 1; }
  .free-img-item-label {
    font-size: 9px; color: rgba(255,255,255,0.85);
    font-family: 'JetBrains Mono', monospace; line-height: 1.4;
  }
  .free-img-skeleton {
    border-radius: 12px; aspect-ratio: 1;
    background: linear-gradient(90deg,var(--surface2) 25%,var(--surface3) 50%,var(--surface2) 75%);
    background-size: 200% 100%;
    animation: skeletonShimmer 1.5s ease-in-out infinite;
  }

  /* ── STUDIO SUB-TABS ── */
  .studio-subtabs {
    display: flex; gap: 4px;
    background: var(--surface2); border-radius: 12px; padding: 4px;
    margin-bottom: 16px; transition: background 0.35s;
  }

  .studio-subtab {
    flex: 1; padding: 9px 10px; border-radius: 9px; border: none;
    font-family: 'Syne', sans-serif; font-size: 12px; font-weight: 600;
    cursor: pointer; transition: all 0.22s; color: var(--muted); background: transparent;
    display: flex; align-items: center; justify-content: center; gap: 5px;
  }

  .studio-subtab.active {
    background: linear-gradient(135deg, var(--accent), #5a3de0);
    color: white; box-shadow: 0 3px 12px rgba(124,92,255,0.30);
  }

  .studio-subtab:not(.active):hover { color: var(--text); background: var(--surface3); }

  /* ── LANGUAGE SELECTOR ── */
  .lang-btn {
    display: flex; align-items: center; gap: 7px;
    padding: 8px 13px; border-radius: 10px;
    background: var(--surface2); border: 1px solid var(--border);
    color: var(--text); font-family: 'JetBrains Mono', monospace;
    font-size: 11px; font-weight: 700; cursor: pointer;
    transition: all 0.22s; letter-spacing: 0.4px;
    width: 100%;
  }
  .lang-btn:hover { border-color: var(--accent); color: var(--accent); background: rgba(124,92,255,0.08); }

  .lang-flag { font-size: 15px; line-height: 1; }

  /* Portal dropdown - rendered into document.body via fixed positioning */
  .lang-dropdown-portal {
    position: fixed;
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 14px; padding: 6px;
    box-shadow: 0 24px 60px rgba(0,0,0,0.55), 0 0 30px rgba(124,92,255,0.18);
    z-index: 999999;
    min-width: 180px;
    animation: dropIn 0.18s cubic-bezier(.22,1,.36,1);
    overflow: hidden;
  }

  @keyframes dropIn {
    from { opacity: 0; transform: translateY(-8px) scale(0.96); }
    to   { opacity: 1; transform: translateY(0) scale(1); }
  }

  .lang-option {
    display: flex; align-items: center; gap: 10px;
    width: 100%; padding: 10px 12px; border-radius: 10px; border: none;
    background: transparent; color: var(--text2);
    font-family: 'Syne', sans-serif; font-size: 13px; font-weight: 600;
    cursor: pointer; transition: all 0.18s; text-align: left;
  }

  .lang-option:hover    { background: var(--surface2); color: var(--text); }
  .lang-option.selected { color: var(--accent); background: rgba(124,92,255,0.08); }

  .lang-option-name  { flex: 1; }
  .lang-option-code  { font-family: 'JetBrains Mono', monospace; font-size: 10px; color: var(--muted); }
  /* ── VOICE / TTS BUTTON ── */
  .voice-btn {
    display: inline-flex; align-items: center; gap: 5px;
    margin-top: 8px; padding: 5px 12px;
    border-radius: 20px; border: 1px solid var(--border);
    background: var(--surface2); color: var(--muted);
    font-family: 'JetBrains Mono', monospace; font-size: 11px;
    cursor: pointer; transition: all 0.22s; user-select: none;
  }
  .voice-btn:hover { border-color: var(--accent); color: var(--accent); }
  .voice-btn.speaking {
    border-color: var(--accent2); color: var(--accent2);
    background: rgba(0,229,200,0.08);
    animation: voicePulse 1s ease-in-out infinite;
  }
  @keyframes voicePulse {
    0%,100% { box-shadow: 0 0 0 0 rgba(0,229,200,0.3); }
    50%      { box-shadow: 0 0 0 6px rgba(0,229,200,0); }
  }

  /* ── MIC / VOICE INPUT BUTTON ── */
  .mic-btn {
    width: 42px; height: 42px; border-radius: 12px; border: none;
    cursor: pointer; display: flex; align-items: center; justify-content: center;
    font-size: 18px; transition: all 0.22s; flex-shrink: 0;
    background: var(--surface2); border: 1.5px solid var(--border); color: var(--muted);
  }
  .mic-btn:hover:not(:disabled) { border-color: var(--accent2); color: var(--accent2); }
  .mic-btn.recording {
    background: rgba(255,92,138,0.12);
    border-color: var(--accent3); color: var(--accent3);
    animation: micPulse 0.9s ease-in-out infinite;
  }
  .mic-btn:disabled { opacity: 0.35; cursor: not-allowed; }
  @keyframes micPulse {
    0%,100% { box-shadow: 0 0 0 0 rgba(255,92,138,0.40); }
    50%      { box-shadow: 0 0 0 8px rgba(255,92,138,0); }
  }
`;

/* ════ CONSTANTS ════ */
const SUGGESTIONS = [
  "What happened in tech news today?",
  "Explain quantum computing simply",
  "Best programming languages in 2025?",
  "How does inflation affect markets?",
];

const STYLE_TAGS = ["Photorealistic","Anime","Oil Painting","Cyberpunk","Watercolor","Sketch","3D Render","Vintage"];

const LOAD_STEPS = [
  "Authenticating credentials…",
  "Initializing AI engine…",
  "Loading image studio…",
  "Preparing workspace…",
];

/* ════ LANGUAGE CONFIG ════ */
const LANGUAGES = [
  { code: "en",  label: "EN",  name: "English",  flag: "🇬🇧" },
  { code: "hi",  label: "HI",  name: "हिन्दी",    flag: "🇮🇳" },
  { code: "gu",  label: "GU",  name: "ગુજરાતી",   flag: "🇮🇳" },
];

/* UI strings per language */
const LANG_UI = {
  en: {
    askTitle:    "Ask me anything",
    askSub:      "I can answer questions, search the web for live info, explain topics, and help you think through problems.",
    placeholder: "Ask anything — I'll search the web…",
    placeholderNoSearch: "Ask me anything…",
    searching:   "Searching the web…",
    processing:  "Processing search results…",
    suggestions: [
      "What happened in tech news today?",
      "Explain quantum computing simply",
      "Best programming languages in 2025?",
      "How does inflation affect markets?",
    ],
    systemWeb:   "You are a highly capable AI assistant with real-time web search. You MUST always reply exclusively in English. Do NOT use any other language under any circumstances. Answer clearly, accurately, and helpfully.",
    systemOnly:  "You are a highly capable AI assistant. You MUST always reply exclusively in English. Do NOT use any other language under any circumstances. Be helpful and informative.",
  },
  hi: {
    askTitle:    "कुछ भी पूछें",
    askSub:      "मैं सवालों के जवाब दे सकता हूँ, वेब सर्च कर सकता हूँ, विषयों को समझा सकता हूँ।",
    placeholder: "कुछ भी पूछें — मैं वेब सर्च करूँगा…",
    placeholderNoSearch: "कुछ भी पूछें…",
    searching:   "वेब पर खोज हो रही है…",
    processing:  "खोज परिणाम संसाधित हो रहे हैं…",
    suggestions: [
      "आज की तकनीकी खबर क्या है?",
      "क्वांटम कंप्यूटिंग सरल भाषा में समझाइए",
      "2025 में सबसे अच्छी प्रोग्रामिंग भाषाएं?",
      "महंगाई बाज़ार को कैसे प्रभावित करती है?",
    ],
    systemWeb:   "You are a highly capable AI assistant with real-time web search. CRITICAL INSTRUCTION: You MUST reply ONLY in Hindi using Devanagari script (हिन्दी). Every single word of your response must be in Hindi. Do NOT use English or any other language. Answer clearly and helpfully in Hindi.",
    systemOnly:  "You are a highly capable AI assistant. CRITICAL INSTRUCTION: You MUST reply ONLY in Hindi using Devanagari script (हिन्दी). Every single word of your response must be in Hindi. Do NOT use English or any other language. Be helpful and informative in Hindi.",
  },
  gu: {
    askTitle:    "કંઈ પણ પૂછો",
    askSub:      "હું સવાલોના જવાબ આપી શકું છું, વેબ સર્ચ કરી શકું છું અને વિષયો સમજાવી શકું છું।",
    placeholder: "કંઈ પણ પૂછો — હું વેબ સર્ચ કરીશ…",
    placeholderNoSearch: "કંઈ પણ પૂછો…",
    searching:   "વેબ પર શોધ થઈ રહી છે…",
    processing:  "શોધ પરિણામો પ્રક્રિયા થઈ રહ્યા છે…",
    suggestions: [
      "આજની ટેક્નોલૉજી ન્યૂઝ શું છે?",
      "ક્વૉન્ટમ કમ્પ્યૂટિંગ સરળ ભાષામાં સમજાવો",
      "2025 માં સૌથી સારી પ્રોગ્રામિંગ ભાષાઓ?",
      "ફુગાવો બજારને કેવી રીતે અસર કરે છે?",
    ],
    systemWeb:   "You are a highly capable AI assistant with real-time web search. CRITICAL INSTRUCTION: You MUST reply ONLY in Gujarati using Gujarati script (ગુજરાતી). Every single word of your response must be in Gujarati. Do NOT use English or any other language. Answer clearly and helpfully in Gujarati.",
    systemOnly:  "You are a highly capable AI assistant. CRITICAL INSTRUCTION: You MUST reply ONLY in Gujarati using Gujarati script (ગુજરાતી). Every single word of your response must be in Gujarati. Do NOT use English or any other language. Be helpful and informative in Gujarati.",
  },
};

function getDomain(url) {
  try { return new URL(url).hostname.replace("www.",""); } catch { return url; }
}

/* ════ LANGUAGE → SYSTEM PROMPT BUILDER ════
   Single source of truth — used by ALL components.
   The language rule is placed LAST so it overrides everything else.
*/
const LANG_NAMES = { en: "English", hi: "Hindi (Devanagari script हिन्दी)", gu: "Gujarati (Gujarati script ગુજરાતી)" };

function buildSystem(lang, mode = "chat", extra = "") {
  const langName = LANG_NAMES[lang] || "English";
  const langRule = lang === "en"
    ? "Always reply in English."
    : `CRITICAL: You MUST write every single word of your reply in ${langName}. Do NOT use English or any other language. Not even technical terms — translate or transliterate everything into ${langName}.`;

  const modeBase = {
    chat:    "You are NexusAI, a highly capable AI assistant.",
    sum:     "You are NexusAI, a professional summarization assistant.",
    math:    "You are NexusAI, an expert math tutor and problem solver.",
    code:    "You are NexusAI, an expert software engineer and code analyst.",
    fileqa:  "You are NexusAI, a precise document analysis assistant.",
    trends:  "You are NexusAI, a real-time trends analyst.",
  };

  return `${modeBase[mode] || modeBase.chat} ${extra} ${langRule}`.trim();
}

/* ════ SHARED API HELPER ════
   FIX: Added "anthropic-beta" header required for web_search tool.
   All API calls go through this helper for consistency.
*/
async function callClaude(body, signal) {
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    signal,
    headers: {
      "Content-Type": "application/json",
      "anthropic-beta": "web-search-2025-03-05",
      "anthropic-dangerous-direct-browser-access": "true",
    },
    body: JSON.stringify(body),
  });
  return res;
}

/* ════ THEME TOGGLE ════ */
function ThemeToggle({ dark, onToggle }) {
  return (
    <button className="theme-btn" onClick={onToggle}
      title={dark ? "Switch to Light Mode" : "Switch to Dark Mode"} aria-label="Toggle theme">
      <div className="theme-icons">
        <span className="theme-icon" style={{ opacity: dark ? 0.35 : 1 }}>☀️</span>
        <span className="theme-icon" style={{ opacity: dark ? 1 : 0.35 }}>🌙</span>
      </div>
      <div className="theme-knob" />
    </button>
  );
}

/* ════ LANGUAGE SELECTOR ════ */
function LanguageSelector({ lang, onChange }) {
  const [open, setOpen] = useState(false);
  const [dropStyle, setDropStyle] = useState({});
  const btnRef = useRef(null);
  const dropRef = useRef(null);
  const current = LANGUAGES.find(l => l.code === lang) || LANGUAGES[0];

  /* Close on outside click */
  useEffect(() => {
    if (!open) return;
    const handler = (e) => {
      const inBtn = btnRef.current?.contains(e.target);
      const inDrop = dropRef.current?.contains(e.target);
      if (!inBtn && !inDrop) setOpen(false);
    };
    document.addEventListener("mousedown", handler, true);
    return () => document.removeEventListener("mousedown", handler, true);
  }, [open]);

  /* Close on Escape */
  useEffect(() => {
    if (!open) return;
    const handler = (e) => { if (e.key === "Escape") setOpen(false); };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [open]);

  const handleOpen = () => {
    if (!open && btnRef.current) {
      const rect = btnRef.current.getBoundingClientRect();
      const DROPDOWN_W = 190;
      const DROPDOWN_H = LANGUAGES.length * 46 + 12;

      // Calculate left position, clamp so it stays in viewport
      let left = rect.left;
      if (left + DROPDOWN_W > window.innerWidth - 8) {
        left = window.innerWidth - DROPDOWN_W - 8;
      }
      if (left < 8) left = 8;

      // Show above or below based on available space
      const spaceBelow = window.innerHeight - rect.bottom;
      const top = spaceBelow >= DROPDOWN_H + 8
        ? rect.bottom + 6
        : rect.top - DROPDOWN_H - 6;

      setDropStyle({ top, left, width: Math.max(DROPDOWN_W, rect.width) });
    }
    setOpen(v => !v);
  };

  const handleSelect = (code) => {
    onChange(code);
    setOpen(false);
  };

  return (
    <>
      <button ref={btnRef} className="lang-btn" onClick={handleOpen}
        title="Change language" aria-haspopup="listbox" aria-expanded={open}>
        <span className="lang-flag">{current.flag}</span>
        <span style={{flex:1}}>{current.name}</span>
        <span style={{fontSize:8,opacity:0.5,transition:"transform 0.2s",display:"inline-block",transform:open?"rotate(180deg)":"rotate(0deg)"}}>▼</span>
      </button>
      {open && (
        <div ref={dropRef} className="lang-dropdown-portal"
          role="listbox"
          style={{ ...dropStyle, position: "fixed", zIndex: 999999 }}>
          {LANGUAGES.map(l => (
            <button key={l.code} role="option" aria-selected={lang === l.code}
              className={"lang-option" + (lang === l.code ? " selected" : "")}
              onMouseDown={(e) => { e.preventDefault(); e.stopPropagation(); handleSelect(l.code); }}>
              <span className="lang-flag">{l.flag}</span>
              <span style={{flex:1,fontSize:13}}>{l.name}</span>
              <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:9,color:"var(--muted)",letterSpacing:"0.5px"}}>{l.label}</span>
              {lang === l.code && <span style={{color:"var(--accent2)",fontSize:12}}>✓</span>}
            </button>
          ))}
        </div>
      )}
    </>
  );
}

/* ════ LOADING SCREEN ════ */
function LoadingScreen({ onDone }) {
  const [stepIdx, setStepIdx] = useState(0);
  const [doneSteps, setDoneSteps] = useState([]);
  const [exiting, setExiting] = useState(false);
  useEffect(() => {
    let idx = 0;
    const iv = setInterval(() => {
      setDoneSteps(prev => [...prev, LOAD_STEPS[idx]]);
      idx++;
      if (idx < LOAD_STEPS.length) setStepIdx(idx);
      else { clearInterval(iv); setTimeout(() => { setExiting(true); setTimeout(onDone, 500); }, 280); }
    }, 400);
    return () => clearInterval(iv);
  }, []);
  return (
    <div className={`loading-screen${exiting ? " exit" : ""}`}>
      <div className="ls-logo">
        <div className="ls-icon">✦</div>
        <div className="ls-brand">NexusAI</div>
      </div>
      <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:16 }}>
        <div className="ls-track"><div className="ls-bar" /></div>
        <div className="ls-steps">
          {doneSteps.map((s,i) => <div key={i} className="ls-step done"><span>✓</span>{s}</div>)}
          {stepIdx < LOAD_STEPS.length && doneSteps.length < LOAD_STEPS.length && (
            <div className="ls-step"><div className="ls-spinner" />{LOAD_STEPS[stepIdx]}</div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ════ AUTH SCREEN ════ */
function AuthScreen({ onAuth, dark, onToggleTheme }) {
  const [tab, setTab] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showLoader, setShowLoader] = useState(false);
  const validate = () => {
    if (!email.trim()) return "Please enter your email.";
    if (!/\S+@\S+\.\S+/.test(email)) return "Enter a valid email address.";
    if (password.length < 4) return "Password must be at least 4 characters.";
    return null;
  };
  const handleSubmit = () => { const e = validate(); if (e) { setError(e); return; } setError(""); setShowLoader(true); };
  const handleKey = (e) => { if (e.key === "Enter") handleSubmit(); };
  if (showLoader) return <LoadingScreen onDone={() => onAuth({ email, name: email.split("@")[0] })} />;
  return (
    <div className="auth-screen">
      <div className="orb orb-1" /><div className="orb orb-2" /><div className="grid-bg" />
      <div className="auth-card">
        <div className="auth-top-row">
          <div className="auth-logo">
            <div className="auth-logo-icon">✦</div>
            <span className="auth-logo-text">NexusAI</span>
          </div>
          <ThemeToggle dark={dark} onToggle={onToggleTheme} />
        </div>
        <div className="auth-title">{tab === "login" ? "Welcome back" : "Create account"}</div>
        <div className="auth-sub">{tab === "login" ? "Sign in to access your AI workspace & image studio." : "Join NexusAI — chat with AI, upload & generate images."}</div>
        <div className="auth-tabs">
          <button className={`auth-tab ${tab==="login"?"active":""}`} onClick={() => { setTab("login"); setError(""); }}>Sign In</button>
          <button className={`auth-tab ${tab==="signup"?"active":""}`} onClick={() => { setTab("signup"); setError(""); }}>Sign Up</button>
        </div>
        <div className="auth-field">
          <label className="auth-label">Email address</label>
          <input className="auth-input" type="email" placeholder="you@example.com" value={email} onChange={e=>setEmail(e.target.value)} onKeyDown={handleKey} />
        </div>
        <div className="auth-field">
          <label className="auth-label">Password</label>
          <input className="auth-input" type="password" placeholder="••••••••" value={password} onChange={e=>setPassword(e.target.value)} onKeyDown={handleKey} />
        </div>
        <button className="auth-btn" onClick={handleSubmit}>{tab==="login" ? "→ Sign In" : "→ Create Account"}</button>
        {error && <div className="auth-error">⚠ {error}</div>}
        <div className="auth-footer">{tab==="login" ? "Don't have an account? Click Sign Up above." : "Already have an account? Click Sign In above."}</div>
      </div>
    </div>
  );
}



/* ═══════════════════════════════════════
   IMAGE STUDIO — fully self-contained
═══════════════════════════════════════ */

/* Draws a rich 800×500 PNG directly on a canvas element and returns data URL */
function buildCanvasImage(prompt, style, palette, mood, sceneStr) {
  const W = 800, H = 500;
  const cv = document.createElement("canvas");
  cv.width = W; cv.height = H;
  const g = cv.getContext("2d");

  /* palette with fallbacks */
  const DEF = ["#0a0520","#1a0a50","#7c5cff","#00e5c8","#ff5c8a"];
  const C = [0,1,2,3,4].map(i => {
    const v = (palette||[])[i];
    return v && /^#[0-9a-fA-F]{3,6}$/.test(v) ? v : DEF[i];
  });

  const ALL = ((prompt||"")+" "+(style||"")+" "+(mood||"")+" "+(sceneStr||"")).toLowerCase();
  const has = (...w) => w.some(k => ALL.includes(k));

  function rgb(hex) {
    const h = (hex||"#888").replace("#","").padEnd(6,"0");
    const n = parseInt(h,16);
    return [(n>>16)&255,(n>>8)&255,n&255];
  }
  function radial(cx,cy,r,stops) {
    const gr = g.createRadialGradient(cx,cy,0,cx,cy,r);
    stops.forEach(([t,c]) => gr.addColorStop(t,c));
    g.fillStyle = gr;
    g.beginPath(); g.arc(cx,cy,r,0,Math.PI*2); g.fill();
  }

  /* ─── 1. SKY ─── */
  const sky = g.createLinearGradient(0,0,0,H*0.78);
  if(has("sunset","dusk","golden hour")) {
    sky.addColorStop(0,"#120520"); sky.addColorStop(0.3,"#7a1a55");
    sky.addColorStop(0.65,"#d84515"); sky.addColorStop(1,"#f09020");
  } else if(has("sunrise","dawn")) {
    sky.addColorStop(0,"#050818"); sky.addColorStop(0.5,"#e05525"); sky.addColorStop(1,"#f8c040");
  } else if(has("night","dark","midnight","star","galaxy","space","cosmos","nebula")) {
    sky.addColorStop(0,"#01020a"); sky.addColorStop(0.55,"#06041c"); sky.addColorStop(1,"#0e0828");
  } else if(has("day","clear","sunny","bright","afternoon","summer","noon")) {
    sky.addColorStop(0,"#0048b8"); sky.addColorStop(0.6,"#1878e0"); sky.addColorStop(1,"#58b0f8");
  } else if(has("storm","thunder","rain","overcast")) {
    sky.addColorStop(0,"#0c0c18"); sky.addColorStop(1,"#353548");
  } else if(has("autumn","fall")) {
    sky.addColorStop(0,"#180800"); sky.addColorStop(0.5,"#5a2808"); sky.addColorStop(1,"#c05818");
  } else if(has("snow","winter","arctic","frozen")) {
    sky.addColorStop(0,"#c8d8f0"); sky.addColorStop(1,"#e8f0ff");
  } else {
    sky.addColorStop(0,C[0]); sky.addColorStop(0.5,C[1]); sky.addColorStop(1,C[2]+"bb");
  }
  g.fillStyle = sky; g.fillRect(0,0,W,H);

  /* ─── 2. STARS ─── */
  if(has("night","dark","star","galaxy","space","cosmos","nebula","midnight")) {
    for(let i=0;i<260;i++) {
      const sx=Math.random()*W, sy=Math.random()*H*0.85, sr=Math.random()*1.8+0.2;
      g.beginPath(); g.arc(sx,sy,sr,0,Math.PI*2);
      g.fillStyle=`rgba(255,255,255,${(Math.random()*0.7+0.3).toFixed(2)})`; g.fill();
    }
    const mw = g.createLinearGradient(0,H*0.05,W,H*0.5);
    mw.addColorStop(0,"transparent"); mw.addColorStop(0.4,"rgba(160,140,255,0.07)");
    mw.addColorStop(0.6,"rgba(200,180,255,0.11)"); mw.addColorStop(1,"transparent");
    g.fillStyle=mw; g.fillRect(0,0,W,H*0.8);
  }

  /* ─── 3. NEBULA GLOW ─── */
  if(has("space","nebula","galaxy","cosmos","universe")) {
    [[0.25,0.3,200,C[3],0.13],[0.72,0.42,180,C[4],0.10],[0.5,0.18,150,C[2],0.09]].forEach(([ox,oy,or_,oc,oa]) => {
      const [r,gr2,b]=rgb(oc);
      radial(ox*W,oy*H,or_,[[0,`rgba(${r},${gr2},${b},${oa})`],[1,"transparent"]]);
    });
  }

  /* ─── 4. SUN ─── */
  if(has("sun","sunset","sunrise","day","golden","bright","morning","noon")) {
    const sx = has("sunset")?W*0.77:has("sunrise")?W*0.24:W*0.28;
    const sy = has("sunset","sunrise")?H*0.36:H*0.14;
    radial(sx,sy,100,[[0,"#ffffff"],[0.12,"#fffbdd"],[0.38,"#ffcc44bb"],[0.65,"#ff881133"],[1,"transparent"]]);
    g.beginPath(); g.arc(sx,sy,27,0,Math.PI*2); g.fillStyle="#fffbe0"; g.fill();
    if(!has("sunset")) {
      g.save(); g.strokeStyle="rgba(255,240,120,0.12)"; g.lineWidth=2;
      for(let a=0;a<12;a++) {
        const ang=a*(Math.PI/6);
        g.beginPath(); g.moveTo(sx+Math.cos(ang)*34,sy+Math.sin(ang)*34);
        g.lineTo(sx+Math.cos(ang)*82,sy+Math.sin(ang)*82); g.stroke();
      }
      g.restore();
    }
  }

  /* ─── 5. MOON ─── */
  if(has("moon","night","lunar","moonlight")) {
    const mx=W*0.78, my=H*0.13;
    radial(mx,my,50,[[0,"#f4eeff"],[0.5,"#c8b0eebb"],[1,"transparent"]]);
    g.beginPath(); g.arc(mx,my,23,0,Math.PI*2); g.fillStyle="#ede0ff"; g.fill();
    g.beginPath(); g.arc(mx+10,my-5,19,0,Math.PI*2); g.fillStyle="rgba(2,5,28,0.55)"; g.fill();
    radial(mx,my,90,[[0,"rgba(180,160,255,0.12)"],[1,"transparent"]]);
  }

  /* ─── 6. CLOUDS ─── */
  if(has("cloud","overcast","rain","storm","day","sunny","sky","fluffy")) {
    const cc = has("storm","rain","overcast")?"rgba(55,50,75,0.55)":
               has("sunset","golden")?"rgba(255,180,100,0.20)":"rgba(255,255,255,0.22)";
    [[0.12,0.10,130,44],[0.40,0.07,165,52],[0.68,0.12,140,46],[0.88,0.07,95,34]].forEach(([cx,cy,cw,ch]) => {
      g.fillStyle=cc;
      [[-0.3,0.12,0.62,0.72],[0.28,0.08,0.58,0.68],[0,0,1,1]].forEach(([dx,dy,sw,sh]) => {
        g.beginPath(); g.ellipse(cx*W+dx*cw,cy*H+dy*ch,cw*sw,ch*sh,0,0,Math.PI*2); g.fill();
      });
    });
  }

  /* ─── 7. MOUNTAINS ─── */
  if(has("mountain","hill","landscape","valley","alpine","peak","ridge","highland")) {
    [[-0.08,0.68,0.26,0.38],[0.18,0.60,0.30,0.48],[0.42,0.65,0.28,0.42],
     [0.62,0.58,0.32,0.50],[0.84,0.66,0.28,0.40],[1.08,0.70,0.24,0.36]].forEach(([cx,cy,hw,hh],i) => {
      const gr = g.createLinearGradient(cx*W,(cy-hh)*H,cx*W,cy*H);
      gr.addColorStop(0,i%2===0?C[2]+"88":C[1]+"aa"); gr.addColorStop(1,C[0]+"cc");
      g.beginPath(); g.moveTo((cx-hw)*W,cy*H); g.lineTo(cx*W,(cy-hh)*H); g.lineTo((cx+hw)*W,cy*H);
      g.closePath(); g.fillStyle=gr; g.fill();
    });
    [[-0.08,0.68,0.26,0.38],[0.18,0.60,0.30,0.48],[0.84,0.66,0.28,0.40]].forEach(([cx,cy,hw,hh]) => {
      const sf=0.20;
      g.beginPath();
      g.moveTo((cx-hw*sf)*W,(cy-hh+hh*sf)*H); g.lineTo(cx*W,(cy-hh)*H); g.lineTo((cx+hw*sf)*W,(cy-hh+hh*sf)*H);
      g.closePath(); g.fillStyle="rgba(235,232,255,0.88)"; g.fill();
    });
  }

  /* ─── 8. CITY ─── */
  if(has("city","urban","building","skyline","futuristic","metropolis","skyscraper","downtown","neon","cyberpunk")) {
    [
      [0.03,0.56,0.055,0.42],[0.09,0.42,0.048,0.56],[0.14,0.60,0.065,0.38],[0.22,0.47,0.048,0.51],
      [0.28,0.34,0.038,0.64],[0.33,0.54,0.055,0.44],[0.40,0.61,0.065,0.37],[0.48,0.27,0.038,0.71],
      [0.54,0.46,0.048,0.52],[0.60,0.56,0.065,0.42],[0.68,0.41,0.048,0.57],[0.74,0.31,0.038,0.67],
      [0.79,0.51,0.055,0.47],[0.86,0.59,0.065,0.39],[0.93,0.44,0.052,0.54],
    ].forEach(([bx,by,bw,bh]) => {
      const bg = g.createLinearGradient(bx*W,by*H,(bx+bw)*W,(by+bh)*H);
      bg.addColorStop(0,C[2]+"cc"); bg.addColorStop(1,C[0]+"ff");
      g.fillStyle=bg; g.fillRect(bx*W,by*H,bw*W,bh*H);
      for(let wy=by*H+9;wy<(by+bh)*H-8;wy+=15)
        for(let wx=bx*W+5;wx<(bx+bw)*W-5;wx+=10)
          if(Math.random()>0.32) {
            const wa=0.55+Math.random()*0.45;
            g.fillStyle=Math.random()>0.5?`rgba(0,229,200,${wa*0.7})`:`rgba(255,220,80,${wa*0.6})`;
            g.fillRect(wx,wy,5,7);
          }
    });
    if(has("futuristic","neon","cyberpunk","rain")) {
      const rg=g.createLinearGradient(0,H*0.75,0,H);
      rg.addColorStop(0,C[3]+"55"); rg.addColorStop(1,C[4]+"22");
      g.fillStyle=rg; g.fillRect(0,H*0.75,W,H*0.25);
    }
  }

  /* ─── 9. OCEAN / WATER ─── */
  if(has("ocean","sea","water","lake","river","wave","beach","coastal","bay")) {
    const wY = has("beach","coastal","bay")?H*0.72:H*0.64;
    const wg = g.createLinearGradient(0,wY,0,H);
    const top = has("tropical","clear","turquoise")?"#00c8d8bb":
                has("night","dark")?"#001840bb":has("sunset")?"#602040aa":"#004880aa";
    wg.addColorStop(0,top); wg.addColorStop(1,C[0]+"ff");
    g.fillStyle=wg; g.fillRect(0,wY,W,H-wY);
    g.lineWidth=1.5;
    for(let wi=0;wi<10;wi++) {
      const wy=wY+wi*((H-wY)/10);
      g.strokeStyle=`rgba(255,255,255,${0.08+wi*0.01})`;
      g.beginPath(); g.moveTo(0,wy);
      for(let wx=0;wx<=W;wx+=50) {
        g.quadraticCurveTo(wx+18,wy-5,wx+32,wy+2);
        g.quadraticCurveTo(wx+44,wy+6,wx+50,wy);
      }
      g.stroke();
    }
    if(has("sunset","sunrise","golden")) {
      const rf=g.createLinearGradient(W*0.38,wY,W*0.62,H);
      rf.addColorStop(0,"rgba(255,150,30,0.40)"); rf.addColorStop(1,"transparent");
      g.fillStyle=rf; g.fillRect(W*0.32,wY,W*0.36,H-wY);
    }
  }

  /* ─── 10. FOREST ─── */
  if(has("forest","tree","jungle","wood","nature","pine","oak","bamboo","rainforest")) {
    const tc = has("autumn","fall")?"#b04018":has("tropical","jungle")?"#1a8035":"#256a30";
    const tc2 = has("autumn","fall")?"#d06020":"#307a40";
    [[0.02,0.88,10,32],[0.08,0.85,12,40],[0.16,0.87,9,30],[0.80,0.86,11,36],[0.88,0.84,13,42],[0.95,0.88,9,30]].forEach(([tx,ty,tw,th]) => {
      g.fillStyle=tc+"77";
      g.beginPath(); g.moveTo(tx*W-tw,ty*H); g.lineTo(tx*W,ty*H-th); g.lineTo(tx*W+tw,ty*H); g.closePath(); g.fill();
    });
    [[0.04,0.96,15,58],[0.11,0.93,13,50],[0.19,0.97,11,40],
     [0.76,0.96,15,58],[0.84,0.94,13,52],[0.92,0.97,11,42]].forEach(([tx,ty,tw,th]) => {
      g.fillStyle="#3a1e08"; g.fillRect(tx*W-2.5,ty*H-14,6,16);
      [[tw,th*0.5,ty*H-th*0.42],[tw*0.75,th*0.64,ty*H-th*0.66],[tw*0.50,th*0.82,ty*H-th*0.90]].forEach(([lw,lh,ly],li) => {
        g.fillStyle=li===1?tc2+"ee":tc+"cc";
        g.beginPath(); g.moveTo(tx*W-lw,ly+lh); g.lineTo(tx*W,ly); g.lineTo(tx*W+lw,ly+lh); g.closePath(); g.fill();
      });
    });
  }

  /* ─── 11. DESERT ─── */
  if(has("desert","sand","dune","sahara","arid")) {
    const dg=g.createLinearGradient(0,H*0.45,0,H);
    dg.addColorStop(0,"#d8904e"); dg.addColorStop(0.5,"#bc6e2a"); dg.addColorStop(1,"#7e4212");
    g.fillStyle=dg;
    g.beginPath(); g.moveTo(0,H*0.76);
    g.bezierCurveTo(W*0.18,H*0.52,W*0.42,H*0.70,W*0.58,H*0.54);
    g.bezierCurveTo(W*0.74,H*0.40,W*0.88,H*0.62,W,H*0.50);
    g.lineTo(W,H); g.lineTo(0,H); g.closePath(); g.fill();
  }

  /* ─── 12. SNOW ─── */
  if(has("snow","winter","blizzard","frozen","tundra","arctic","ice")) {
    const sg=g.createLinearGradient(0,H*0.7,0,H);
    sg.addColorStop(0,"#dde8ff"); sg.addColorStop(1,"#c0d4f8");
    g.fillStyle=sg; g.fillRect(0,H*0.72,W,H*0.28);
    g.fillStyle="rgba(255,255,255,0.75)";
    for(let i=0;i<80;i++) {
      const fx=Math.random()*W,fy=Math.random()*H*0.72,fr=Math.random()*2+0.5;
      g.beginPath(); g.arc(fx,fy,fr,0,Math.PI*2); g.fill();
    }
  }

  /* ─── 13. GROUND ─── */
  const noGround = has("ocean","sea","water")&&!has("beach","coastal");
  const gY = has("city","urban","skyscraper")?H*0.77:has("desert","sand")?H*0.99:noGround?H*1.1:H*0.82;
  if(gY<H) {
    const gg=g.createLinearGradient(0,gY,0,H);
    if(has("grass","meadow","field","park","lawn","nature")&&!has("desert","snow","winter"))
      { gg.addColorStop(0,"#1c4e18cc"); gg.addColorStop(1,"#0c2808ff"); }
    else if(has("snow","winter","frozen"))
      { gg.addColorStop(0,"#dde8ffcc"); gg.addColorStop(1,"#b0c8f8ff"); }
    else
      { gg.addColorStop(0,C[1]+"cc"); gg.addColorStop(1,C[0]+"ff"); }
    g.fillStyle=gg; g.fillRect(0,gY,W,H-gY);
  }

  /* ─── 14. ATMOSPHERE ORBS ─── */
  [[0.15,0.38,170,C[3],0.13],[0.85,0.52,145,C[4],0.11],[0.50,0.18,120,C[2],0.09]].forEach(([ox,oy,or_,oc,oa]) => {
    const [r,gr2,b]=rgb(oc);
    const og=g.createRadialGradient(ox*W,oy*H,0,ox*W,oy*H,or_);
    og.addColorStop(0,`rgba(${r},${gr2},${b},${oa})`); og.addColorStop(1,"transparent");
    g.fillStyle=og; g.fillRect(0,0,W,H);
  });

  /* ─── 15. BOKEH ─── */
  for(let i=0;i<55;i++) {
    const px=Math.random()*W,py=Math.random()*H,pr=Math.random()*3.5+0.5;
    const [r,gr2,b]=rgb(C[i%5]);
    const bkg=g.createRadialGradient(px,py,0,px,py,pr*2.5);
    bkg.addColorStop(0,`rgba(${r},${gr2},${b},0.65)`); bkg.addColorStop(1,"transparent");
    g.fillStyle=bkg; g.beginPath(); g.arc(px,py,pr*2.5,0,Math.PI*2); g.fill();
  }

  /* ─── 16. STYLE OVERLAYS ─── */
  const sty = (style||"").toLowerCase();
  if(sty.includes("watercolor")) {
    g.save(); g.globalAlpha=0.20;
    for(let i=0;i<22;i++) {
      const [r,gr2,b]=rgb(C[i%5]);
      g.fillStyle=`rgba(${r},${gr2},${b},0.38)`;
      g.beginPath(); g.ellipse(Math.random()*W,Math.random()*H,70+Math.random()*110,45+Math.random()*80,Math.random()*Math.PI,0,Math.PI*2); g.fill();
    }
    g.globalAlpha=1; g.restore();
  }
  if(sty.includes("oil painting")) {
    g.save(); g.globalAlpha=0.06;
    for(let i=0;i<220;i++) {
      const [r,gr2,b]=rgb(C[i%5]);
      const x=Math.random()*W,y=Math.random()*H,l=8+Math.random()*28,a=Math.random()*Math.PI;
      g.strokeStyle=`rgba(${r},${gr2},${b},0.55)`; g.lineWidth=2+Math.random()*3.5;
      g.beginPath(); g.moveTo(x,y); g.lineTo(x+Math.cos(a)*l,y+Math.sin(a)*l); g.stroke();
    }
    g.globalAlpha=1; g.restore();
  }
  if(sty.includes("sketch")) {
    g.save(); g.globalAlpha=0.06;
    for(let i=0;i<180;i++) {
      g.strokeStyle="rgba(200,200,255,0.55)"; g.lineWidth=0.6;
      const x=Math.random()*W,y=Math.random()*H;
      g.beginPath(); g.moveTo(x,y); g.lineTo(x+(Math.random()-.5)*55,y+(Math.random()-.5)*55); g.stroke();
    }
    g.globalAlpha=1; g.restore();
  }
  if(sty.includes("vintage")||sty.includes("retro")) {
    g.save();
    const vig=g.createRadialGradient(W/2,H/2,H*0.22,W/2,H/2,H*0.90);
    vig.addColorStop(0,"transparent"); vig.addColorStop(1,"rgba(28,12,0,0.62)");
    g.fillStyle=vig; g.fillRect(0,0,W,H);
    g.globalAlpha=0.15; g.fillStyle="#c8a048"; g.fillRect(0,0,W,H);
    g.globalAlpha=1; g.restore();
  }
  if(sty.includes("cyberpunk")||sty.includes("neon")||sty.includes("anime")) {
    g.save(); g.globalAlpha=0.07;
    for(let ly=0;ly<H;ly+=3) { g.fillStyle=ly%6===0?"#00e5c8":"#7c5cff"; g.fillRect(0,ly,W,1.5); }
    g.globalAlpha=0.24;
    const eg=g.createLinearGradient(0,0,W,0);
    eg.addColorStop(0,"#7c5cff44"); eg.addColorStop(0.5,"transparent"); eg.addColorStop(1,"#00e5c844");
    g.fillStyle=eg; g.fillRect(0,0,W,H);
    g.globalAlpha=1; g.restore();
  }
  if(sty.includes("3d render")||sty.includes("photorealistic")) {
    g.save();
    const dof=g.createRadialGradient(W/2,H/2,H*0.14,W/2,H/2,H*0.72);
    dof.addColorStop(0,"transparent"); dof.addColorStop(1,"rgba(0,0,0,0.38)");
    g.fillStyle=dof; g.fillRect(0,0,W,H); g.restore();
  }

  /* ─── 17. WATERMARK ─── */
  g.fillStyle="rgba(0,0,0,0.42)"; g.fillRect(0,H-30,W,30);
  g.font="12px 'Segoe UI',Arial,sans-serif";
  g.fillStyle="rgba(255,255,255,0.62)"; g.textAlign="left";
  g.fillText("✦ NexusAI · "+(prompt.length>84?prompt.slice(0,81)+"…":prompt),14,H-10);

  return cv.toDataURL("image/png");
}

/* ─── BG REMOVE: iterative BFS, no recursion ─── */
function removeBg(dataUrl) {
  return new Promise(resolve => {
    const img = new Image();
    img.onload = () => {
      const MAXD = 500;
      const scale = Math.min(1, MAXD / Math.max(img.width||1, img.height||1));
      const W = Math.max(1, Math.round(img.width * scale));
      const H = Math.max(1, Math.round(img.height * scale));

      const cv = document.createElement("canvas"); cv.width=W; cv.height=H;
      const ctx = cv.getContext("2d");
      ctx.drawImage(img, 0, 0, W, H);

      const d = ctx.getImageData(0,0,W,H);
      const px = d.data;

      const corners = [[0,0],[W-1,0],[0,H-1],[W-1,H-1]];
      let rS=0,gS=0,bS=0;
      corners.forEach(([x,y])=>{ const i=(y*W+x)*4; rS+=px[i]; gS+=px[i+1]; bS+=px[i+2]; });
      const bgR=rS/4, bgG=gS/4, bgB=bS/4;
      const TOL = 55;
      const diff = (r,g,b) => Math.sqrt((r-bgR)**2+(g-bgG)**2+(b-bgB)**2);

      const seen = new Uint8Array(W*H);
      const queue = new Int32Array(W*H*2);
      let head=0, tail=0;

      const push = (x,y) => {
        if(x<0||y<0||x>=W||y>=H) return;
        const i = y*W+x;
        if(seen[i]) return;
        seen[i] = 1;
        const p = i*4;
        if(diff(px[p],px[p+1],px[p+2]) > TOL) return;
        queue[tail++] = x;
        queue[tail++] = y;
      };

      for(let x=0;x<W;x++) { push(x,0); push(x,H-1); }
      for(let y=1;y<H-1;y++) { push(0,y); push(W-1,y); }

      while(head < tail) {
        const x=queue[head++], y=queue[head++];
        px[(y*W+x)*4+3] = 0;
        push(x+1,y); push(x-1,y); push(x,y+1); push(x,y-1);
      }

      for(let y=1;y<H-1;y++) for(let x=1;x<W-1;x++) {
        const i=(y*W+x)*4;
        if(px[i+3]===255) {
          let near=0;
          if(px[((y-1)*W+x)*4+3]===0) near++;
          if(px[((y+1)*W+x)*4+3]===0) near++;
          if(px[(y*W+x-1)*4+3]===0) near++;
          if(px[(y*W+x+1)*4+3]===0) near++;
          if(near) px[i+3]=Math.max(0,200-near*50);
        }
      }

      ctx.putImageData(d,0,0);

      const out=document.createElement("canvas");
      out.width=img.width; out.height=img.height;
      const octx=out.getContext("2d");
      octx.imageSmoothingEnabled=true; octx.imageSmoothingQuality="high";
      octx.drawImage(cv,0,0,out.width,out.height);
      resolve(out.toDataURL("image/png"));
    };
    img.onerror=()=>resolve(dataUrl);
    img.src=dataUrl;
  });
}

/* ─── FREE IMAGES — Real photos via Claude API web search ─── */
const FREE_IMG_CATEGORIES = ["Nature","Cityscape","Animals","Technology","Food","Travel","Abstract","Fashion","Sunset","Ocean"];

const CAT_SEARCH_TERMS = {
  Nature:     ["beautiful forest waterfall","mountain meadow flowers","tropical jungle birds","autumn leaves river","cherry blossom garden"],
  Cityscape:  ["new york city skyline night","tokyo street lights","paris architecture","london bridge evening","dubai skyscrapers"],
  Animals:    ["lion savanna wildlife","colorful tropical fish","red fox forest","eagle flying sky","wolf pack nature"],
  Technology: ["futuristic technology concept","computer circuit neon","robot artificial intelligence","space station earth","cyberpunk city"],
  Food:       ["gourmet restaurant dish","colorful fresh fruits","coffee art latte","sushi platter japanese","pizza artisan wood fire"],
  Travel:     ["santorini greece blue","maldives overwater bungalow","bali rice terraces","paris eiffel tower","iceland northern lights"],
  Abstract:   ["colorful abstract paint","neon light bokeh photography","geometric shapes minimal","liquid marble texture","rainbow prism light"],
  Fashion:    ["fashion model portrait","street style photography","elegant dress editorial","urban fashion photography","model outdoor shoot"],
  Sunset:     ["golden hour sunset beach","dramatic sunset clouds","sunset mountain silhouette","ocean sunset orange sky","desert sunset dunes"],
  Ocean:      ["crystal clear turquoise ocean","coral reef underwater","tropical beach paradise","ocean waves dramatic","deep sea creatures"],
};

/* Fetch real image URLs using Claude API + web_search */
async function fetchImagesFromAPI(searchTerm) {
  try {
    const resp = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 2000,
        tools: [{ type: "web_search_20250305", name: "web_search" }],
        messages: [{
          role: "user",
          content: `Search for high quality photos of "${searchTerm}" on the web. Find direct image URLs (ending in .jpg, .jpeg, .png, or .webp) from photo sites. Return ONLY a raw JSON array with NO markdown, no backticks, no explanation. Format: [{"url":"https://example.com/photo.jpg","title":"Photo title"},{"url":"...","title":"..."}]. Find at least 8 different direct image URLs. Only include URLs that are publicly accessible images.`
        }]
      })
    });
    const data = await resp.json();
    const fullText = (data.content || []).filter(b => b.type === "text").map(b => b.text).join("");
    const match = fullText.match(/\[[\s\S]*?\]/);
    if (match) {
      const arr = JSON.parse(match[0]);
      return arr.filter(i => i && i.url && /\.(jpg|jpeg|png|webp)/i.test(i.url)).slice(0, 12);
    }
  } catch(e) { console.warn("API fetch error:", e); }
  return [];
}

/* Fallback: generate a beautiful placeholder with unique per-slot design */
function makePlaceholder(index, label, category) {
  const cv = document.createElement("canvas"); cv.width=400; cv.height=400;
  const g = cv.getContext("2d");
  const themes = {
    Nature:    {bg:["#0a3d1f","#1a6b3a","#2d9e5a","#5dbb7a"],acc:"#a8f0b8"},
    Cityscape: {bg:["#050d1a","#0d2137","#1a3a5c","#2a5f8f"],acc:"#7ec8e3"},
    Animals:   {bg:["#3d1f00","#7a3f00","#b86800","#e8900a"],acc:"#ffe0a0"},
    Technology:{bg:["#050510","#0d0d2e","#1a1a4e","#2d2d80"],acc:"#00e5c8"},
    Food:      {bg:["#2c0a0a","#5c1a1a","#8c3030","#c05050"],acc:"#ffa07a"},
    Travel:    {bg:["#0d2b4e","#1a4b7a","#2a6fa8","#4090cc"],acc:"#a8d4f0"},
    Abstract:  {bg:["#1a0a2e","#2d1a4e","#4a2a7c","#6a3aaa"],acc:"#c8a0f8"},
    Fashion:   {bg:["#1a0a14","#3a1428","#5c2040","#8a3060"],acc:"#f0a0c8"},
    Sunset:    {bg:["#1a0500","#5c1500","#c04000","#ff7000"],acc:"#ffd080"},
    Ocean:     {bg:["#000d1a","#001a3a","#003060","#005090"],acc:"#60c0ff"},
  };
  const t = themes[category] || themes.Nature;
  // Multi-stop gradient
  const gr = g.createLinearGradient(0,0,400,400);
  t.bg.forEach((c,i) => gr.addColorStop(i/(t.bg.length-1), c));
  g.fillStyle = gr; g.fillRect(0,0,400,400);
  // Decorative circles with unique positioning per index
  const positions = [[0.2,0.3],[0.8,0.2],[0.5,0.7],[0.1,0.8],[0.9,0.6],[0.4,0.15],[0.7,0.85]];
  positions.forEach(([px,py], i) => {
    const r2 = 30 + ((index * 7 + i * 13) % 60);
    const alpha = 0.08 + ((index + i) % 5) * 0.04;
    const cg = g.createRadialGradient(px*400,py*400,0,px*400,py*400,r2);
    cg.addColorStop(0,t.acc+Math.floor(alpha*255).toString(16).padStart(2,"0")); cg.addColorStop(1,"transparent");
    g.fillStyle=cg; g.fillRect(0,0,400,400);
  });
  // Grid lines unique to index
  g.strokeStyle="rgba(255,255,255,0.04)"; g.lineWidth=1;
  const offset = (index * 23) % 30;
  for(let x=offset;x<400;x+=30){g.beginPath();g.moveTo(x,0);g.lineTo(x,400);g.stroke();}
  for(let y=offset;y<400;y+=30){g.beginPath();g.moveTo(0,y);g.lineTo(400,y);g.stroke();}
  // Unique diagonal accent per image
  const diag = g.createLinearGradient(0,0,400,400);
  diag.addColorStop(0,"transparent"); diag.addColorStop(0.45+index%3*0.05,"transparent");
  diag.addColorStop(0.5+index%3*0.05, t.acc+"22"); diag.addColorStop(1,"transparent");
  g.fillStyle=diag; g.fillRect(0,0,400,400);
  // Label
  g.fillStyle="rgba(255,255,255,0.85)";
  g.font="bold 22px Syne,sans-serif"; g.textAlign="center"; g.textBaseline="middle";
  const short = label.length>18 ? label.slice(0,16)+"…" : label;
  g.fillText(short,200,200);
  g.fillStyle=t.acc+"cc"; g.font="11px 'JetBrains Mono',monospace";
  g.fillText(category.toUpperCase(),200,228);
  return cv.toDataURL("image/jpeg",0.88);
}

function FreeImagesTab({ onOpenLightbox }) {
  const [category, setCategory] = useState("Nature");
  const [searchVal, setSearchVal] = useState("");
  const [images, setImages]     = useState([]);
  const [loading, setLoading]   = useState(false);
  const [page, setPage]         = useState(0);
  const [status, setStatus]     = useState("");
  const PER_PAGE = 12;

  /* Load: show placeholders immediately, then swap in real photos */
  const loadImages = useCallback(async (cat, term, pg) => {
    setLoading(true);
    const terms = CAT_SEARCH_TERMS[cat] || CAT_SEARCH_TERMS.Nature;
    const searchTerm = term || terms[(pg + cat.length) % terms.length];
    const label = term || cat;

    /* Step 1: Show unique placeholders instantly */
    const placeholders = Array.from({length: PER_PAGE}, (_,i) => ({
      key: `${cat}-${pg}-${i}`,
      id: i,
      src: makePlaceholder(pg * PER_PAGE + i, `${label} ${pg*PER_PAGE+i+1}`, cat),
      fullSrc: null,
      label: `${label} #${pg*PER_PAGE+i+1}`,
      loaded: false,
      cat,
    }));
    setImages(placeholders);
    setLoading(false);
    setStatus("🔍 Searching for real photos...");

    /* Step 2: Fetch real image URLs from API */
    const results = await fetchImagesFromAPI(searchTerm + " " + (pg>0 ? "page "+pg : ""));
    if (results.length > 0) {
      setStatus(`✓ Found ${results.length} real photos`);
      setImages(prev => prev.map((img, i) => {
        if (results[i]) return { ...img, src: results[i].url, fullSrc: results[i].url, label: results[i].title || img.label, loaded: true };
        return img;
      }));
    } else {
      setStatus("⚠ Network limited — showing generated previews");
    }
    setTimeout(() => setStatus(""), 3000);
  }, []);

  useEffect(() => {
    setSearchVal(""); setPage(0);
    loadImages(category, "", 0);
  }, [category]);

  const handleSearch = () => {
    const q = searchVal.trim();
    setPage(0);
    loadImages(category, q, 0);
  };

  const go = (np) => { setPage(np); loadImages(category, searchVal.trim(), np); };

  return (
    <div className="studio-card" style={{marginBottom:20}}>
      <div className="card-header">
        <div className="card-icon" style={{background:"rgba(0,229,200,0.12)"}}>🌐</div>
        <div>
          <div className="card-title">Free Images</div>
          <div className="card-sub">Real photos fetched live — Pinterest/Pixabay style</div>
        </div>
      </div>

      <div className="free-img-search-row">
        <input className="free-img-search-input"
          placeholder="Search: sunset beach, wolf, tokyo, pizza…"
          value={searchVal}
          onChange={e=>setSearchVal(e.target.value)}
          onKeyDown={e=>e.key==="Enter"&&handleSearch()}
        />
        <button className="gen-btn" style={{width:"auto",padding:"10px 16px",fontSize:13,flexShrink:0}}
          onClick={handleSearch}>🔍</button>
      </div>

      <div className="free-img-cats">
        {FREE_IMG_CATEGORIES.map(cat=>(
          <button key={cat}
            className={"free-img-cat-btn"+(category===cat&&!searchVal?" active":"")}
            onClick={()=>{setCategory(cat);setSearchVal("");}}>
            {cat}
          </button>
        ))}
      </div>

      {status && (
        <div style={{fontSize:11,color:"var(--accent2)",fontFamily:"'JetBrains Mono',monospace",padding:"6px 4px",textAlign:"center"}}>
          {status}
        </div>
      )}

      <div className="free-img-grid">
        {loading
          ? Array.from({length:PER_PAGE}).map((_,i)=><div key={i} className="free-img-skeleton"/>)
          : images.map(img=>(
            <div key={img.key} className="free-img-item"
              onClick={()=>onOpenLightbox({src:img.fullSrc||img.src, prompt:img.label, downloadName:`photo-${img.cat}-${img.id}.jpg`})}>
              <img
                src={img.src}
                alt={img.label}
                style={{width:"100%",height:"100%",objectFit:"cover",display:"block",
                  transition:"opacity 0.3s", opacity: img.loaded ? 1 : 0.7}}
                onError={e=>{
                  if(!e.target.dataset.fb){
                    e.target.dataset.fb="1";
                    e.target.src = makePlaceholder(img.id, img.label, img.cat||category);
                  }
                }}
              />
              {!img.loaded && (
                <div style={{position:"absolute",inset:0,display:"flex",alignItems:"center",justifyContent:"center",
                  background:"rgba(0,0,0,0.15)",pointerEvents:"none"}}>
                  <div style={{width:24,height:24,border:"2px solid var(--accent2)",borderTopColor:"transparent",borderRadius:"50%",animation:"spin 0.8s linear infinite"}}/>
                </div>
              )}
              <div className="free-img-item-overlay">
                <div className="free-img-item-label">{img.label}</div>
              </div>
            </div>
          ))
        }
      </div>

      <div style={{display:"flex",gap:8,justifyContent:"center",marginTop:18,alignItems:"center"}}>
        <button className="msg-action-btn" disabled={page===0||loading} onClick={()=>go(page-1)}>← Prev</button>
        <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:11,color:"var(--muted)",padding:"0 8px"}}>Page {page+1}</span>
        <button className="msg-action-btn" disabled={loading} onClick={()=>go(page+1)}>Next →</button>
      </div>
    </div>
  );
}


/* ─── IMAGE STUDIO COMPONENT ─── */
function ImageStudio({ galleryImages = [], setGalleryImages = ()=>{}, lightboxImg, setLightboxImg = ()=>{} }) {
  const [tab, setTab]             = useState("generate");
  const [img, setImg]             = useState(null);
  const [dragOver, setDragOver]   = useState(false);
  const fileRef                   = useRef(null);
  const galleryTopRef             = useRef(null);

  /* Auto-scroll to top of gallery when new image added */
  useEffect(() => {
    if (tab === "gallery" && galleryImages.length > 0 && galleryTopRef.current) {
      galleryTopRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [galleryImages.length, tab]);

  /* Generate */
  const [genPrompt, setGenPrompt] = useState("");
  const [genStyle, setGenStyle]   = useState("");
  const [genSrc, setGenSrc]       = useState(null);
  const [genDesc, setGenDesc]     = useState("");
  const [genBusy, setGenBusy]     = useState(false);
  const [genMsg, setGenMsg]       = useState("");

  /* Analyze */
  const [analyzeText, setAnalyzeText] = useState("");
  const [analyzeBusy, setAnalyzeBusy] = useState(false);

  /* BG Remove */
  const [bgSrc, setBgSrc]         = useState(null);
  const [bgBusy, setBgBusy]       = useState(false);
  const [bgMsg, setBgMsg]         = useState("");

  const [copied, setCopied]       = useState(false);

  /* ── file load ── */
  const loadFile = f => {
    if(!f||!f.type.startsWith("image/")) return;
    const r = new FileReader();
    r.onload = e => { setImg(e.target.result); setAnalyzeText(""); setBgSrc(null); setBgMsg(""); };
    r.readAsDataURL(f);
  };

  /* ── download ── */
  const dl = (src,name) => {
    const a=document.createElement("a"); a.href=src; a.download=name||"nexusai.png";
    document.body.appendChild(a); a.click(); document.body.removeChild(a);
  };

  /* ── generate: Real AI image via Pollinations.ai with live gallery streaming ── */
  const generate = async () => {
    if (!genPrompt.trim()) return;

    const styleMap = {
      "Photorealistic": "photorealistic, ultra detailed, 8k, professional photography, sharp focus, award winning",
      "Anime":          "anime style, studio ghibli, vibrant colors, detailed illustration, cel shaded",
      "Oil Painting":   "oil painting, impressionist, thick brushstrokes, museum quality, masterpiece",
      "Cyberpunk":      "cyberpunk, neon lights, futuristic dystopia, blade runner aesthetic, rain",
      "Watercolor":     "watercolor painting, soft washes, artistic, delicate, flowing pigments, paper texture",
      "Sketch":         "pencil sketch, detailed line art, black and white, hand drawn, cross hatching",
      "3D Render":      "3D render, octane render, ray tracing, cinema 4d, hyperrealistic, studio lighting",
      "Vintage":        "vintage photograph, film grain, retro aesthetic, faded colors, nostalgic, 1970s",
    };
    const styleStr = genStyle ? (styleMap[genStyle] || genStyle) : "highly detailed, professional quality, 4k uhd";
    const fullPrompt = `${genPrompt}, ${styleStr}`;
    const seed = Math.floor(Math.random() * 999999);
    const url = `https://image.pollinations.ai/prompt/${encodeURIComponent(fullPrompt)}?width=1024&height=768&seed=${seed}&model=flux&nologo=true&enhance=true`;

    // ── Add a PENDING item to gallery immediately (live update) ──
    const pendingId = Date.now().toString(36);
    const pendingItem = { id: pendingId, src: null, prompt: fullPrompt, ts: Date.now(), style: genStyle, loading: true };
    setGalleryImages(prev => [pendingItem, ...prev.slice(0, 29)]);
    setGenBusy(true);
    setGenSrc(null);
    setGenDesc("");
    setGenMsg("Generating real AI image…");

    // Switch to gallery tab to show live progress
    // (keep on generate tab so user can see result inline too)

    const finalizeItem = (src, failed = false) => {
      setGalleryImages(prev => prev.map(img =>
        img.id === pendingId
          ? { ...img, src: failed ? null : src, loading: false, failed }
          : img
      ));
    };

    try {
      setGenMsg("Sending to Flux AI model…");

      // Load image with timeout — show it as soon as it's ready
      await new Promise((resolve, reject) => {
        const testImg = new Image();
        testImg.crossOrigin = "anonymous";
        testImg.onload = () => {
          setGenSrc(url);
          setGenDesc(fullPrompt);
          setGenMsg("");
          finalizeItem(url);
          resolve();
        };
        testImg.onerror = () => reject(new Error("Image load failed"));
        testImg.src = url;

        // Progress messages while waiting
        const msgs = [
          [3000,  "Initializing Flux model…"],
          [8000,  "Rendering scene…"],
          [15000, "Adding fine details…"],
          [25000, "Almost ready…"],
          [40000, "Still generating (complex scene)…"],
        ];
        msgs.forEach(([delay, msg]) => {
          setTimeout(() => { setGenMsg(msg); }, delay);
        });

        setTimeout(() => reject(new Error("Generation timeout after 90s")), 90000);
      });

    } catch(e) {
      console.warn("[ImageGen] Primary failed:", e.message, "— retrying with new seed");
      setGenMsg("Retrying…");

      // Retry with fresh seed
      const seed2 = Math.floor(Math.random() * 99999) + 1;
      const url2 = `https://image.pollinations.ai/prompt/${encodeURIComponent(fullPrompt)}?width=1024&height=768&seed=${seed2}&model=flux&nologo=true`;

      try {
        await new Promise((resolve, reject) => {
          const img2 = new Image();
          img2.crossOrigin = "anonymous";
          img2.onload = () => {
            setGenSrc(url2);
            setGenDesc(fullPrompt);
            setGenMsg("");
            finalizeItem(url2);
            resolve();
          };
          img2.onerror = () => reject(new Error("Retry failed"));
          img2.src = url2;
          setTimeout(() => reject(new Error("Retry timeout")), 60000);
        });
      } catch(e2) {
        setGenMsg("⚠ Generation failed. Check network and try again.");
        finalizeItem(null, true);
      }
    } finally {
      setGenBusy(false);
    }
  };

  /* ── analyze ──
     FIX: Uses shared callClaude() helper (includes beta header).
  */
  const analyze = async () => {
    if(!img) return;
    setAnalyzeBusy(true); setAnalyzeText("");
    try {
      const b64  = img.split(",")[1];
      const mime = img.split(";")[0].split(":")[1];

      const res = await callClaude({
        model: "claude-sonnet-4-20250514",
        max_tokens: 600,
        messages: [{
          role: "user",
          content: [
            { type: "image", source: { type: "base64", media_type: mime, data: b64 } },
            { type: "text", text: "Analyze this image: describe subjects, colors, mood, composition, style, and key details in 3-4 sentences." }
          ]
        }]
      });

      const d = await res.json();
      if (!res.ok) throw new Error(d.error?.message || `API error ${res.status}`);

      // FIX: Correctly extract text content blocks.
      const text = (d.content || [])
        .filter(b => b.type === "text")
        .map(b => b.text || "")
        .join("");
      setAnalyzeText(text || "Could not analyze.");
    } catch(e) { setAnalyzeText("Error: " + e.message); }
    setAnalyzeBusy(false);
  };

  /* ── bg remove ── */
  const bgRemove = async () => {
    if(!img) return;
    setBgBusy(true); setBgSrc(null); setBgMsg("Detecting background…");
    try {
      setBgMsg("Removing background pixels…");
      const result = await removeBg(img);
      setBgSrc(result); setBgMsg("");
    } catch(e) { setBgMsg("Error: " + e.message); }
    setBgBusy(false);
  };

  /* ── shared upload zone ── */
  const UZ = ({icon="☁️",label="Click or drag & drop an image"}) => (
    <div className={`upload-zone${dragOver?" drag-over":""}`}
      onClick={()=>fileRef.current?.click()}
      onDragOver={e=>{e.preventDefault();setDragOver(true);}}
      onDragLeave={()=>setDragOver(false)}
      onDrop={e=>{e.preventDefault();setDragOver(false);loadFile(e.dataTransfer.files[0]);}}>
      <div className="upload-zone-icon">{icon}</div>
      <div className="upload-zone-text">{label}</div>
      <div className="upload-zone-hint">PNG · JPG · WEBP · GIF</div>
      <input ref={fileRef} type="file" accept="image/*" style={{display:"none"}}
        onChange={e=>loadFile(e.target.files[0])} />
    </div>
  );

  /* ── tab styles ── */
  const tabStyle = active => ({
    flex:1, padding:"10px 8px", border:"none", borderRadius:10, cursor:"pointer",
    fontFamily:"'Syne',sans-serif", fontSize:12, fontWeight:700,
    transition:"all .22s",
    background: active ? "linear-gradient(135deg,var(--accent),#5a3de0)" : "transparent",
    color: active ? "#fff" : "var(--muted)",
    boxShadow: active ? "0 3px 12px rgba(124,92,255,.30)" : "none",
  });

  return (
    <div className="image-studio">

      {/* ── Tab bar ── */}
      <div style={{display:"flex",gap:4,background:"var(--surface2)",borderRadius:14,padding:4,marginBottom:20,marginTop:16,flexWrap:"wrap"}}>
        {[["generate","✨ Generate"],["free","🌐 Free Images"],["gallery","🖼️ Gallery"+(galleryImages.length?" ("+galleryImages.length+")":"")],["analyze","🔍 Analyze"],["bgremove","✂️ Remove BG"]].map(([k,label])=>(
          <button key={k} style={{...tabStyle(tab===k),flex:"1 1 auto",minWidth:80,fontSize:11}} onClick={()=>setTab(k)}>{label}</button>
        ))}
      </div>

      {/* ══════════ GENERATE TAB ══════════ */}
      {tab==="generate" && (
        <div className="studio-card" style={{marginBottom:20}}>
          <div className="card-header">
            <div className="card-icon generate">✨</div>
            <div><div className="card-title">Generate Image</div><div className="card-sub">Real AI images via Flux model — like Grok</div></div>
          </div>
          <div className="gen-input-wrap">
            <div className="style-tags">
              {STYLE_TAGS.map(s=>(
                <button key={s} className={"style-tag"+(genStyle===s?" active":"")}
                  onClick={()=>setGenStyle(genStyle===s?"":s)}>{s}</button>
              ))}
            </div>
            <textarea className="gen-textarea"
              placeholder="Describe anything… e.g. 'A majestic lion at sunset in the African savanna, photorealistic'"
              value={genPrompt} onChange={e=>setGenPrompt(e.target.value)} />
            <button className="gen-btn" onClick={generate} disabled={genBusy||!genPrompt.trim()}>
              {genBusy
                ? <><div className="search-spinner" style={{borderTopColor:"#fff"}} />Generating real image…</>
                : <>🎨 Generate Real AI Image</>}
            </button>
          </div>

          {(genSrc||genBusy) && (
            <div style={{marginTop:16}}>
              {genBusy && (
                <div style={{background:"var(--surface2)",borderRadius:12,overflow:"hidden",border:"1px solid var(--border)",minHeight:300,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:16,padding:"40px 20px"}}>
                  <div style={{width:64,height:64,borderRadius:"50%",background:"linear-gradient(135deg,var(--accent),var(--accent2))",display:"flex",alignItems:"center",justifyContent:"center",fontSize:28,animation:"iconPulse 1.8s ease-in-out infinite"}}>🎨</div>
                  <div style={{textAlign:"center"}}>
                    <div style={{color:"var(--text)",fontWeight:700,marginBottom:6}}>{genMsg||"Generating your image…"}</div>
                    <div style={{color:"var(--muted)",fontSize:11,fontFamily:"'JetBrains Mono',monospace"}}>Real AI image · Flux model · 10–30s</div>
                  </div>
                  <div className="shimmer-bar" style={{width:"80%"}}/>
                </div>
              )}
              {genSrc && !genBusy && (
                <>
                  <div style={{position:"relative",borderRadius:14,overflow:"hidden",border:"1px solid var(--border)",boxShadow:"0 8px 32px rgba(0,0,0,0.4)",cursor:"pointer"}}
                    onClick={()=>setLightboxImg({src:genSrc,prompt:genDesc,downloadName:"nexusai-gen-"+Date.now()+".png"})}>
                    <img src={genSrc} alt="Generated" style={{width:"100%",display:"block",maxHeight:480,objectFit:"cover"}} crossOrigin="anonymous" />
                    <div style={{position:"absolute",bottom:0,left:0,right:0,background:"linear-gradient(transparent,rgba(0,0,0,0.7))",padding:"20px 14px 10px",fontFamily:"'JetBrains Mono',monospace",fontSize:10,color:"rgba(255,255,255,0.7)"}}>
                      ✦ NexusAI · Flux Model · Click to expand
                    </div>
                  </div>
                  {genDesc && (
                    <div className="analyze-result" style={{marginTop:10}}>
                      <div className="analyze-label">🎨 Prompt Used</div>
                      <div style={{fontSize:12,color:"var(--text2)",lineHeight:1.6}}>{genDesc}</div>
                    </div>
                  )}
                  <div style={{display:"flex",gap:8,marginTop:10,flexWrap:"wrap"}}>
                    <button className="dl-btn secondary" style={{fontSize:12}} onClick={()=>{
                      navigator.clipboard.writeText(genDesc||genPrompt).catch(()=>{});
                      setCopied(true); setTimeout(()=>setCopied(false),2000);
                    }}>{copied?"✓ Copied!":"📋 Copy Prompt"}</button>
                    <button className="gen-btn" style={{flex:1,fontSize:12,padding:"10px",minWidth:130}} onClick={generate}>🔄 Generate Again</button>
                    <button style={{
                      padding:"10px 14px",borderRadius:12,border:"1.5px solid var(--accent2)",
                      background:"rgba(0,229,200,0.08)",color:"var(--accent2)",
                      fontSize:12,fontFamily:"'Syne',sans-serif",fontWeight:700,cursor:"pointer",
                      transition:"all 0.22s",whiteSpace:"nowrap"
                    }} onClick={()=>setTab("gallery")}>
                      🖼️ View Gallery ({galleryImages.filter(g=>!g.loading&&!g.failed).length})
                    </button>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      )}

      {/* ══════════ FREE IMAGES TAB ══════════ */}
      {tab==="free" && (
        <FreeImagesTab onOpenLightbox={setLightboxImg} />
      )}

      {/* ══════════ GALLERY TAB ══════════ */}
      {tab==="gallery" && (
        <div className="studio-card" style={{marginBottom:20}}>
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:16}}>
            <div>
              <div className="card-title" style={{fontSize:16}}>🖼️ Live Gallery</div>
              <div style={{fontSize:11,color:"var(--muted)",fontFamily:"'JetBrains Mono',monospace",marginTop:3}}>
                {galleryImages.filter(g=>!g.loading&&!g.failed).length} images · {galleryImages.filter(g=>g.loading).length > 0 ? "⏳ Generating…" : "Ready"}
              </div>
            </div>
            <div style={{display:"flex",gap:8,alignItems:"center"}}>
              {genBusy && <div style={{display:"flex",alignItems:"center",gap:6,fontSize:11,color:"var(--accent2)",fontFamily:"'JetBrains Mono',monospace"}}>
                <div className="search-spinner" style={{width:11,height:11,borderTopColor:"var(--accent2)"}}/>
                Live
              </div>}
              {galleryImages.length>0 && (
                <button className="msg-action-btn" style={{fontSize:11,color:"var(--accent3)"}} onClick={()=>setGalleryImages([])}>🗑 Clear All</button>
              )}
            </div>
          </div>

          {galleryImages.length === 0 ? (
            <div style={{textAlign:"center",padding:"50px 20px",color:"var(--muted)"}}>
              <div style={{fontSize:48,marginBottom:12}}>🎨</div>
              <div style={{fontSize:15,fontWeight:700,color:"var(--text)",marginBottom:6}}>No images yet</div>
              <div style={{fontSize:13,marginBottom:20}}>Generate your first AI image to see it here</div>
              <button className="gen-btn" style={{width:"auto",padding:"10px 24px"}} onClick={()=>setTab("generate")}>✨ Generate Image</button>
            </div>
          ) : (
            <div className="img-gallery" ref={galleryTopRef}>
              {galleryImages.map((img, i) => (
                img.loading ? (
                  /* ── LOADING SKELETON (live while generating) ── */
                  <div key={img.id||i} className="img-gallery-item" style={{cursor:"default"}}>
                    <div style={{
                      width:"100%", height:"100%", minHeight:150,
                      background:"linear-gradient(90deg,var(--surface2) 25%,var(--surface3) 50%,var(--surface2) 75%)",
                      backgroundSize:"200% 100%",
                      animation:"skeletonShimmer 1.5s ease-in-out infinite",
                      display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:10
                    }}>
                      <div style={{fontSize:28,animation:"iconPulse 1.8s ease-in-out infinite"}}>🎨</div>
                      <div style={{fontSize:10,color:"var(--muted)",fontFamily:"'JetBrains Mono',monospace",textAlign:"center",padding:"0 8px"}}>
                        {genMsg||"Generating…"}
                      </div>
                      <div style={{width:"60%",height:2,borderRadius:2,background:"linear-gradient(90deg,var(--accent),var(--accent2))",animation:"loadBar 1.5s ease-in-out infinite"}}/>
                    </div>
                  </div>
                ) : img.failed ? (
                  /* ── FAILED STATE ── */
                  <div key={img.id||i} className="img-gallery-item" style={{cursor:"default"}}>
                    <div style={{width:"100%",height:"100%",minHeight:150,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:8,background:"rgba(255,92,138,0.06)"}}>
                      <div style={{fontSize:28}}>⚠️</div>
                      <div style={{fontSize:10,color:"var(--accent3)",fontFamily:"'JetBrains Mono',monospace"}}>Failed</div>
                      <button className="msg-action-btn" style={{fontSize:10}} onClick={()=>setGalleryImages(prev=>prev.filter(g=>g.id!==img.id))}>Remove</button>
                    </div>
                  </div>
                ) : (
                  /* ── LOADED IMAGE ── */
                  <div key={img.id||i} className="img-gallery-item"
                    onClick={()=>setLightboxImg({src:img.src,prompt:img.prompt,downloadName:"nexusai-"+Date.now()+".png"})}>
                    <img src={img.src} alt={img.prompt} loading="lazy"
                      style={{animation:"fadeInImg 0.4s ease"}} />
                    <div className="img-gallery-item-overlay">
                      <div className="img-gallery-item-label">
                        {img.style && <span style={{color:"var(--accent2)",marginRight:4}}>[{img.style}]</span>}
                        {img.prompt?.slice(0,55)}{img.prompt?.length>55?"…":""}
                      </div>
                    </div>
                    <button className="img-gallery-del"
                      onClick={e=>{e.stopPropagation();setGalleryImages(prev=>prev.filter(g=>g.id!==img.id));}}>✕</button>
                  </div>
                )
              ))}
            </div>
          )}
        </div>
      )}

      {/* ══════════ ANALYZE TAB ══════════ */}
      {tab==="analyze" && (
        <div className="studio-card" style={{marginBottom:20}}>
          <div className="card-header">
            <div className="card-icon upload">🔍</div>
            <div><div className="card-title">Analyze Image</div><div className="card-sub">Upload any image — AI describes it</div></div>
          </div>
          {!img ? <UZ label="Upload image to analyze" /> : (
            <>
              <img src={img} alt="Uploaded" style={{width:"100%",maxHeight:280,objectFit:"contain",borderRadius:10,display:"block",background:"var(--surface2)"}} />
              <div className="preview-actions" style={{marginTop:10}}>
                <button className="preview-btn remove" onClick={()=>{setImg(null);setAnalyzeText("");}}>🗑 Remove</button>
                <button className="preview-btn analyze" onClick={analyze} disabled={analyzeBusy}>{analyzeBusy?"⏳ Analyzing…":"✦ Analyze with AI"}</button>
              </div>
              {analyzeBusy && <div className="shimmer-bar" style={{marginTop:10}}/>}
              {analyzeText && (
                <div className="analyze-result" style={{marginTop:10}}>
                  <div className="analyze-label">🔍 AI Analysis</div>
                  {analyzeText}
                </div>
              )}
              <div className="download-row" style={{marginTop:10}}>
                <button className="dl-btn primary" onClick={()=>dl(img,"image.png")}>⬇ Download Image</button>
              </div>
            </>
          )}
        </div>
      )}

      {/* ══════════ BG REMOVE TAB ══════════ */}
      {tab==="bgremove" && (
        <div className="studio-card" style={{marginBottom:20}}>
          <div className="card-header">
            <div className="card-icon generate">✂️</div>
            <div><div className="card-title">Remove Background</div><div className="card-sub">AI detects & removes BG pixels</div></div>
          </div>
          {!img ? <UZ icon="✂️" label="Upload image to remove background" /> : (
            <>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:12}}>
                <div>
                  <div className="analyze-label" style={{marginBottom:5,fontSize:"9px"}}>ORIGINAL</div>
                  <img src={img} alt="Original" style={{width:"100%",height:180,objectFit:"cover",borderRadius:10,display:"block"}} />
                </div>
                <div>
                  <div className="analyze-label" style={{marginBottom:5,fontSize:"9px"}}>{bgSrc?"RESULT — BG REMOVED":"RESULT"}</div>
                  {bgSrc ? (
                    <img src={bgSrc} alt="Result" style={{width:"100%",height:180,objectFit:"contain",borderRadius:10,display:"block",backgroundImage:"repeating-conic-gradient(#80808022 0% 25%,transparent 0% 50%)",backgroundSize:"14px 14px",border:"1px solid var(--border)"}} />
                  ) : (
                    <div style={{width:"100%",height:180,borderRadius:10,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:8,backgroundImage:"repeating-conic-gradient(var(--surface2) 0% 25%,var(--surface3) 0% 50%)",backgroundSize:"14px 14px",border:"1px dashed var(--border)"}}>
                      {bgBusy ? <><div className="search-spinner"/><div style={{fontSize:11,color:"var(--muted)",fontFamily:"'JetBrains Mono',monospace"}}>{bgMsg}</div></> : <div style={{fontSize:28,opacity:.4}}>🔲</div>}
                    </div>
                  )}
                </div>
              </div>
              {bgBusy && <div className="shimmer-bar"/>}
              {bgMsg && !bgBusy && <div className="error-msg">{bgMsg}</div>}
              <div className="preview-actions">
                <button className="preview-btn remove" onClick={()=>{setImg(null);setBgSrc(null);setBgMsg("");}}>🗑 Clear</button>
                <button className="preview-btn analyze" onClick={bgRemove} disabled={bgBusy}>{bgBusy?"⏳ Removing BG…":"✂️ Remove Background"}</button>
              </div>
              {bgSrc && (
                <div className="download-row" style={{marginTop:10}}>
                  <button className="dl-btn primary" onClick={()=>dl(bgSrc,"bg-removed.png")}>⬇ Download Transparent PNG</button>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}




/* ════ SUMMARIZER ════ */
const SUM_MODES = ["Bullet Points","Short Summary","Detailed","ELI5","Key Takeaways","TLDR"];
function Summarizer({ lang = "en" }) {
  const [text, setText]     = useState("");
  const [mode, setMode]     = useState("Bullet Points");
  const [result, setResult] = useState("");
  const [busy, setBusy]     = useState(false);
  const [copied, setCopied] = useState(false);

  const run = async () => {
    if (!text.trim()) return;
    setBusy(true); setResult("");
    try {
      const prompt = `Summarize the following text in "${mode}" format.\n\nText:\n${text}`;
      const res = await callClaude({
        model: "claude-sonnet-4-20250514", max_tokens: 800,
        system: buildSystem(lang, "sum"),
        messages: [{ role: "user", content: prompt }]
      });
      const d = await res.json();
      if (!res.ok) throw new Error(d.error?.message || "API error");
      setResult((d.content||[]).filter(b=>b.type==="text").map(b=>b.text).join("") || "No summary.");
    } catch(e) { setResult("Error: "+e.message); }
    setBusy(false);
  };

  const copy = () => {
    navigator.clipboard.writeText(result).catch(()=>{});
    setCopied(true); setTimeout(()=>setCopied(false),2000);
  };

  return (
    <div className="summarizer">
      <div className="sum-card">
        <div className="sum-label">📝 Input Text</div>
        <textarea className="sum-textarea" placeholder="Paste any text, article, paragraph, or content here…"
          value={text} onChange={e=>setText(e.target.value)} />
        <div className="sum-label" style={{marginTop:14}}>Summary Style</div>
        <div className="sum-options">
          {SUM_MODES.map(m=>(
            <button key={m} className={`sum-opt${mode===m?" active":""}`} onClick={()=>setMode(m)}>{m}</button>
          ))}
        </div>
        <button className="sum-btn" onClick={run} disabled={busy||!text.trim()}>
          {busy ? <><div className="search-spinner" style={{borderTopColor:"#0a0a0f"}}/>Summarizing…</> : "✦ Summarize"}
        </button>
      </div>
      {result && (
        <div className="sum-card">
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:10}}>
            <div className="sum-label" style={{margin:0}}>✅ Result — {mode}</div>
            <button className="msg-action-btn" style={{fontSize:11}} onClick={copy}>
              {copied?"✓ Copied":"📋 Copy"}
            </button>
          </div>
          <div className="sum-result">{result}</div>
        </div>
      )}
    </div>
  );
}

/* ════ CODE INTERPRETER ════ */
const CODE_LANGS = ["JavaScript","Python","SQL","Bash","HTML","TypeScript","JSON","Regex"];
function CodeInterpreter({ lang: appLang = "en" }) {
  const [codeLang, setCodeLang] = useState("JavaScript");
  const [code, setCode]         = useState("");
  const [output, setOutput]     = useState(null);
  const [isErr, setIsErr]       = useState(false);
  const [busy, setBusy]         = useState(false);
  const [copied, setCopied]     = useState(false);

  const analyze = async (mode) => {
    if (!code.trim()) return;
    setBusy(true); setOutput(null); setIsErr(false);
    try {
      const prompts = {
        run:     `Analyze this ${codeLang} code and simulate its exact output as a runtime would. Show console output or return value only. If there's a bug, show the error.\n\nCode:\n\`\`\`${codeLang.toLowerCase()}\n${code}\n\`\`\``,
        explain: `Explain this ${codeLang} code clearly, step by step. Describe what each part does.\n\nCode:\n\`\`\`${codeLang.toLowerCase()}\n${code}\n\`\`\``,
        fix:     `Review this ${codeLang} code for bugs or improvements. Show fixed code with explanation.\n\nCode:\n\`\`\`${codeLang.toLowerCase()}\n${code}\n\`\`\``,
      };
      const res = await callClaude({
        model: "claude-sonnet-4-20250514", max_tokens: 1200,
        system: buildSystem(appLang, "code"),
        messages: [{ role: "user", content: prompts[mode] }]
      });
      const d = await res.json();
      if (!res.ok) throw new Error(d.error?.message || "API error");
      setOutput((d.content||[]).filter(b=>b.type==="text").map(b=>b.text).join("") || "No output.");
    } catch(e) { setOutput("Error: "+e.message); setIsErr(true); }
    setBusy(false);
  };

  return (
    <div className="code-tab">
      <div className="code-card">
        <div className="code-lang-row">
          {CODE_LANGS.map(l=>(
            <button key={l} className={`code-lang-btn${codeLang===l?" active":""}`} onClick={()=>setCodeLang(l)}>{l}</button>
          ))}
        </div>
        <textarea className="code-editor"
          placeholder={`Write or paste ${codeLang} code here…`}
          value={code} onChange={e=>setCode(e.target.value)}
          spellCheck={false}
        />
        <div className="code-run-row">
          <button className="code-run-btn" onClick={()=>analyze("run")} disabled={busy||!code.trim()}>
            {busy?<><div className="search-spinner" style={{borderTopColor:"#fff",width:13,height:13}}/>Running…</>:"▶ Run / Simulate"}
          </button>
          <button className="code-explain-btn" onClick={()=>analyze("explain")} disabled={busy||!code.trim()}>💡 Explain</button>
          <button className="code-explain-btn" onClick={()=>analyze("fix")} disabled={busy||!code.trim()}>🔧 Fix</button>
        </div>
      </div>
      {output && (
        <div className="code-card">
          <div className="code-output-label">
            <span style={{color:isErr?"var(--accent3)":"var(--accent2)"}}>
              {isErr?"❌ Error":"✅ Output"}
            </span>
            <button className="msg-action-btn" onClick={()=>{
              navigator.clipboard.writeText(output).catch(()=>{});
              setCopied(true); setTimeout(()=>setCopied(false),2000);
            }}>{copied?"✓ Copied":"📋 Copy"}</button>
          </div>
          <div className={`code-output${isErr?" error":""}`}>{output}</div>
        </div>
      )}
    </div>
  );
}

/* ════ CHAT HISTORY HELPERS ════ */
function genId() { return Date.now().toString(36) + Math.random().toString(36).slice(2,6); }
function fmtDate(ts) {
  const d = new Date(ts);
  const now = new Date();
  if (d.toDateString()===now.toDateString()) return "Today";
  const y = new Date(now); y.setDate(now.getDate()-1);
  if (d.toDateString()===y.toDateString()) return "Yesterday";
  return d.toLocaleDateString("en-US",{month:"short",day:"numeric"});
}

/* ════ MATH SOLVER ════ */
function MathSolver({ lang = "en" }) {
  const [problem, setProblem] = useState("");
  const [result, setResult]   = useState(null);
  const [busy, setBusy]       = useState(false);
  const [copied, setCopied]   = useState(false);

  const solve = async () => {
    if (!problem.trim()) return;
    setBusy(true); setResult(null);
    try {
      const prompt = `Solve this math problem step by step with clear working.\n\nProblem: ${problem}\n\nFormat EXACTLY:\nSTEPS:\nStep 1: [working]\nStep 2: [working]\nANSWER: [final answer]`;
      const res = await callClaude({
        model: "claude-sonnet-4-20250514", max_tokens: 1200,
        system: buildSystem(lang, "math"),
        messages: [{ role: "user", content: prompt }]
      });
      const d = await res.json();
      if (!res.ok) throw new Error(d.error?.message||"API error");
      const raw = (d.content||[]).filter(b=>b.type==="text").map(b=>b.text).join("");
      const answerMatch = raw.match(/ANSWER:\s*(.+)/i);
      const stepsMatch  = raw.match(/STEPS:\s*([\s\S]+?)(?=ANSWER:|$)/i);
      setResult({ steps: stepsMatch?.[1]?.trim() || raw, answer: answerMatch?.[1]?.trim() || "" });
    } catch(e) { setResult({ steps: "Error: "+e.message, answer:"" }); }
    setBusy(false);
  };

  const EXAMPLES = ["2x + 5 = 13", "∫ x² dx", "Find the derivative of sin(x)·cos(x)", "25% of 840", "Solve x² - 7x + 12 = 0"];

  return (
    <div className="math-tab">
      <div className="math-card">
        <div className="sum-label">🧮 Math Problem</div>
        <textarea className="math-input"
          placeholder={"Type any math problem…\ne.g. 2x + 5 = 13  or  ∫ x² dx  or  25% of 840"}
          value={problem} onChange={e=>setProblem(e.target.value)} />
        <div style={{display:"flex",gap:6,flexWrap:"wrap",margin:"10px 0"}}>
          {EXAMPLES.map(ex=>(
            <button key={ex} className="sum-opt" onClick={()=>setProblem(ex)}>{ex}</button>
          ))}
        </div>
        <button className="sum-btn" style={{background:"linear-gradient(135deg,var(--accent),#5a3de0)"}}
          onClick={solve} disabled={busy||!problem.trim()}>
          {busy?<><div className="search-spinner" style={{borderTopColor:"#fff"}}/>Solving…</>:"🧮 Solve Step by Step"}
        </button>
      </div>
      {result && (
        <div className="math-card">
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:12}}>
            <div className="sum-label" style={{margin:0}}>📐 Solution</div>
            <button className="msg-action-btn" onClick={()=>{
              navigator.clipboard.writeText((result.steps||"")+(result.answer?"\nAnswer: "+result.answer:"")).catch(()=>{});
              setCopied(true); setTimeout(()=>setCopied(false),2000);
            }}>{copied?"✓ Copied":"📋 Copy"}</button>
          </div>
          <div className="math-steps">
            <div className="math-step">
              <div className="math-step-label">📝 Working</div>
              {result.steps}
            </div>
          </div>
          {result.answer && <div className="math-answer">= {result.answer}</div>}
        </div>
      )}
    </div>
  );
}

/* ════ FILE Q&A ════ */
function FileQA({ onAskInChat, lang = "en" }) {
  const [fileText, setFileText] = useState("");
  const [fileName, setFileName] = useState("");
  const [fileSize, setFileSize] = useState("");
  const [question, setQuestion] = useState("");
  const [qaList, setQaList]     = useState([]);
  const [busy, setBusy]         = useState(false);
  const [drag, setDrag]         = useState(false);
  const fileRef = useRef(null);

  const loadFile = (file) => {
    if (!file) return;
    setFileName(file.name);
    setFileSize((file.size/1024).toFixed(1)+" KB");
    const reader = new FileReader();
    reader.onload = e => setFileText(e.target.result);
    reader.readAsText(file);
  };

  const ask = async () => {
    if (!fileText || !question.trim()) return;
    setBusy(true);
    const q = question.trim();
    setQuestion("");
    try {
      const prompt = `File: "${fileName}"\n\nContent:\n${fileText.slice(0,8000)}\n\nQuestion: ${q}\n\nAnswer based strictly on the document. If not found, say so.`;
      const res = await callClaude({
        model: "claude-sonnet-4-20250514", max_tokens: 900,
        system: buildSystem(lang, "fileqa"),
        messages: [{ role: "user", content: prompt }]
      });
      const d = await res.json();
      if (!res.ok) throw new Error(d.error?.message||"API error");
      const answer = (d.content||[]).filter(b=>b.type==="text").map(b=>b.text).join("") || "No answer.";
      setQaList(prev=>[...prev, {q, a: answer}]);
    } catch(e) { setQaList(prev=>[...prev, {q, a:"Error: "+e.message}]); }
    setBusy(false);
  };

  const QUICK_QS = ["Summarize this document","What are the key points?","What is the main conclusion?","List all dates mentioned","Who are the main people/entities?"];

  return (
    <div className="fileqa-tab">
      <div className="fileqa-card">
        <div className="sum-label">📄 Upload Document</div>
        {!fileText ? (
          <div className={`fileqa-drop${drag?" drag":""}`}
            onClick={()=>fileRef.current?.click()}
            onDragOver={e=>{e.preventDefault();setDrag(true);}}
            onDragLeave={()=>setDrag(false)}
            onDrop={e=>{e.preventDefault();setDrag(false);loadFile(e.dataTransfer.files[0]);}}>
            <div className="fileqa-drop-icon">📄</div>
            <div className="fileqa-drop-text">Click or drag & drop a file</div>
            <div className="fileqa-drop-hint">TXT · MD · CSV · JSON · HTML · PDF (text)</div>
            <input ref={fileRef} type="file" accept=".txt,.md,.csv,.json,.html,.pdf,.js,.py,.jsx"
              style={{display:"none"}} onChange={e=>loadFile(e.target.files[0])} />
          </div>
        ) : (
          <>
            <div className="fileqa-file-info">
              <div className="fileqa-file-icon">📄</div>
              <div>
                <div className="fileqa-file-name">{fileName}</div>
                <div className="fileqa-file-size">{fileSize} · {fileText.length} chars</div>
              </div>
              <button className="fileqa-file-clear" onClick={()=>{setFileText("");setFileName("");setQaList([]);}}>✕</button>
            </div>
            <div className="sum-label">Quick questions</div>
            <div style={{display:"flex",gap:6,flexWrap:"wrap",marginBottom:12}}>
              {QUICK_QS.map(q=>(
                <button key={q} className="sum-opt" onClick={()=>setQuestion(q)}>{q}</button>
              ))}
            </div>
            <div style={{display:"flex",gap:8}}>
              <input style={{flex:1,padding:"11px 14px",background:"var(--surface2)",border:"1.5px solid var(--border)",
                borderRadius:12,color:"var(--text)",fontFamily:"'Syne',sans-serif",fontSize:13.5,outline:"none"}}
                placeholder="Ask anything about this file…"
                value={question} onChange={e=>setQuestion(e.target.value)}
                onKeyDown={e=>{if(e.key==="Enter")ask();}} />
              <button className="code-run-btn" style={{flex:"none",width:48,padding:0}} onClick={ask} disabled={busy||!question.trim()}>
                {busy?<div className="search-spinner" style={{borderTopColor:"#fff",width:13,height:13}}/>:"↑"}
              </button>
            </div>
          </>
        )}
      </div>
      {qaList.length > 0 && (
        <div className="fileqa-card">
          <div className="sum-label">💬 Q&A</div>
          <div className="fileqa-qa-list">
            {qaList.map((item,i)=>(
              <div key={i} className="fileqa-qa-item">
                <div className="fileqa-q">Q: {item.q}</div>
                <div className="fileqa-a">{item.a}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/* ════ TRENDS ════ */
const TREND_CATS = ["All","Tech","Science","Business","AI","Health","Space"];
function Trends({ onAskInChat, lang = "en" }) {
  const [cat, setCat]         = useState("All");
  const [trends, setTrends]   = useState([]);
  const [busy, setBusy]       = useState(false);
  const [fetched, setFetched] = useState(false);

  const fetch_ = async (category) => {
    setBusy(true); setTrends([]);
    try {
      const prompt = `List 8 trending topics right now in ${category==="All"?"technology, AI, science, business, and health":category}. Return ONLY a raw JSON array, no markdown, no explanation:\n[{"num":1,"category":"Tech","title":"Topic title","snippet":"One sentence why it is trending."}]\nExactly 8 items.`;
      const res = await callClaude({
        model: "claude-sonnet-4-20250514", max_tokens: 900,
        system: buildSystem("en", "trends"), // trends always in English for JSON reliability
        messages: [{ role: "user", content: prompt }]
      });
      const d = await res.json();
      if (!res.ok) throw new Error(d.error?.message||"API error");
      let raw = (d.content||[]).filter(b=>b.type==="text").map(b=>b.text).join("").trim();
      // Strip markdown fences robustly
      raw = raw.replace(/^```[a-zA-Z]*\s*/,"").replace(/\s*```$/,"").trim();
      // Extract just the JSON array
      const arrMatch = raw.match(/\[[\s\S]*\]/);
      const parsed = JSON.parse(arrMatch ? arrMatch[0] : raw);
      setTrends(parsed);
      setFetched(true);
    } catch(e) { setTrends([{num:1,category:"Error",title:"Failed to load",snippet:e.message}]); setFetched(true); }
    setBusy(false);
  };

  return (
    <div className="trends-tab">
      <div className="trends-card">
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:14}}>
          <div className="sum-label" style={{margin:0}}>🔥 What's Trending</div>
          <button className="msg-action-btn" onClick={()=>fetch_(cat)} disabled={busy}>
            {busy?<><div className="search-spinner" style={{width:10,height:10}}/>Loading…</>:"↻ Refresh"}
          </button>
        </div>
        <div className="trends-cats">
          {TREND_CATS.map(c=>(
            <button key={c} className={`trends-cat-btn${cat===c?" active":""}`}
              onClick={()=>{setCat(c);fetch_(c);}}>
              {c}
            </button>
          ))}
        </div>
        {!fetched && !busy && (
          <div style={{textAlign:"center",padding:"30px 0",color:"var(--muted)",fontSize:13}}>
            Click a category or Refresh to load trends
          </div>
        )}
        {busy && (
          <div style={{display:"flex",justifyContent:"center",padding:"30px 0",gap:10,color:"var(--muted)",fontSize:13}}>
            <div className="search-spinner"/><span>Fetching trends…</span>
          </div>
        )}
        {trends.length > 0 && (
          <div className="trends-grid">
            {trends.map((t,i)=>(
              <div key={i} className="trend-card" onClick={()=>onAskInChat&&onAskInChat("Tell me more about: "+t.title)}>
                <div className="trend-card-top">
                  <span className="trend-num">#{t.num||i+1}</span>
                  <span className="trend-category">{t.category}</span>
                </div>
                <div className="trend-title">{t.title}</div>
                <div className="trend-snippet">{t.snippet}</div>
                <button className="trend-ask-btn" onClick={e=>{e.stopPropagation();onAskInChat&&onAskInChat("Tell me more about: "+t.title);}}>
                  Ask AI →
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/* ════ TRANSLATOR (New Feature) ════ */
const TRANSLATE_LANGS = [
  "Hindi","Gujarati","Spanish","French","German","Japanese","Chinese","Arabic","Portuguese","Russian","Korean","Italian"
];
function Translator({ lang: appLang = "en" }) {
  const [srcText, setSrcText]   = useState("");
  const [toLang, setToLang]     = useState("Hindi");
  const [result, setResult]     = useState("");
  const [busy, setBusy]         = useState(false);
  const [copied, setCopied]     = useState(false);
  const [detected, setDetected] = useState("");

  const translate = async () => {
    if (!srcText.trim()) return;
    setBusy(true); setResult(""); setDetected("");
    try {
      const res = await callClaude({
        model: "claude-sonnet-4-20250514", max_tokens: 1200,
        system: "You are an expert multilingual translator.",
        messages: [{ role: "user", content: `Detect the source language, then translate the following text to ${toLang}.\n\nRespond in this exact format:\nDETECTED: [language name]\nTRANSLATION:\n[translated text]\n\nText to translate:\n${srcText}` }]
      });
      const d = await res.json();
      if (!res.ok) throw new Error(d.error?.message||"API error");
      const raw = (d.content||[]).filter(b=>b.type==="text").map(b=>b.text).join("");
      const detMatch = raw.match(/DETECTED:\s*(.+)/i);
      const transMatch = raw.match(/TRANSLATION:\s*([\s\S]+)/i);
      setDetected(detMatch?.[1]?.trim()||"");
      setResult(transMatch?.[1]?.trim()||raw);
    } catch(e) { setResult("Error: "+e.message); }
    setBusy(false);
  };

  return (
    <div style={{padding:"20px 0",display:"flex",flexDirection:"column",gap:16,position:"relative",zIndex:10}}>
      <div className="sum-card">
        <div className="sum-label">🌐 Translator — Powered by Claude AI</div>
        <div style={{marginBottom:12}}>
          <div style={{fontSize:11,color:"var(--muted)",fontFamily:"'JetBrains Mono',monospace",marginBottom:8,letterSpacing:"0.5px"}}>TRANSLATE TO</div>
          <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
            {TRANSLATE_LANGS.map(l=>(
              <button key={l} className={"sum-opt"+(toLang===l?" active":"")} onClick={()=>setToLang(l)}>{l}</button>
            ))}
          </div>
        </div>
        <textarea className="sum-textarea" placeholder="Type or paste text to translate…" value={srcText} onChange={e=>setSrcText(e.target.value)} />
        {detected && <div style={{fontSize:11,color:"var(--accent2)",fontFamily:"'JetBrains Mono',monospace",margin:"6px 0"}}>🔍 Detected: {detected}</div>}
        <button className="sum-btn" style={{background:"linear-gradient(135deg,var(--accent),#5a3de0)"}} onClick={translate} disabled={busy||!srcText.trim()}>
          {busy?<><div className="search-spinner" style={{borderTopColor:"#fff"}}/>Translating…</>:"🌐 Translate"}
        </button>
      </div>
      {result && (
        <div className="sum-card">
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:10}}>
            <div className="sum-label" style={{margin:0}}>✅ {toLang} Translation</div>
            <button className="msg-action-btn" onClick={()=>{navigator.clipboard.writeText(result).catch(()=>{});setCopied(true);setTimeout(()=>setCopied(false),2000);}}>
              {copied?"✓ Copied":"📋 Copy"}
            </button>
          </div>
          <div className="sum-result">{result}</div>
        </div>
      )}
    </div>
  );
}

/* ════ MAIN APP ════ */
export default function AIAssistant() {
  const [dark, setDark] = useState(true);
  const [lang, setLang] = useState("en");
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState("chat");
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [webSearch, setWebSearch] = useState(true);
  const [error, setError] = useState("");
  const [searchStatus, setSearchStatus] = useState("");
  const [speakingIdx, setSpeakingIdx] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [voiceType, setVoiceType] = useState("default"); // "default","male","female","child"
  // Chat history: [{id, title, messages, ts}]
  const [histories, setHistories] = useState([]);
  const [currentHistId, setCurrentHistId] = useState(null);
  const [showHistory, setShowHistory] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [galleryImages, setGalleryImages] = useState([]);
  const [lightboxImg, setLightboxImg] = useState(null);
  // Copied state per-message index
  const [copiedIdx, setCopiedIdx] = useState(null);
  // Grok-like features
  const [thinkMode, setThinkMode] = useState(false);
  const [persona, setPersona]     = useState("default");
  const [thinkOpen, setThinkOpen] = useState({});
  const recognitionRef = useRef(null);
  const abortRef      = useRef(null);
  const langRef       = useRef(lang);
  const messagesEndRef = useRef(null);
  const textareaRef   = useRef(null);

  useEffect(() => { langRef.current = lang; }, [lang]);

  /* ── Stop generation ── */
  const handleStop = () => {
    if (abortRef.current) {
      abortRef.current.abort();
      abortRef.current = null;
    }
  };

  /* ── Copy message ── */
  const handleCopy = (text, idx) => {
    navigator.clipboard.writeText(text).catch(()=>{});
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 2000);
  };

  /* ── Regenerate last AI response ── */
  const handleRegenerate = () => {
    if (loading) return;
    // Find last user message and re-send it
    const lastUser = [...messages].reverse().find(m => m.role === "user");
    if (!lastUser) return;
    // Remove the last assistant message
    setMessages(prev => {
      const last = prev[prev.length - 1];
      return last?.role === "assistant" ? prev.slice(0, -1) : prev;
    });
    // Re-trigger send with that query
    setTimeout(() => handleSend(lastUser.content), 50);
  };

  /* ── Save current chat to history ── */
  const saveHistory = (msgs) => {
    if (!msgs.length) return;
    const title = msgs[0]?.content?.slice(0, 48) || "Chat";
    if (currentHistId) {
      setHistories(prev => prev.map(h => h.id === currentHistId ? {...h, messages: msgs, ts: Date.now()} : h));
    } else {
      const id = genId();
      setCurrentHistId(id);
      setHistories(prev => [{ id, title, messages: msgs, ts: Date.now() }, ...prev]);
    }
  };

  /* ── Load a history session ── */
  const loadHistory = (h) => {
    setMessages(h.messages);
    setCurrentHistId(h.id);
    setShowHistory(false);
    setActiveTab("chat");
  };

  /* ── Delete a history session ── */
  const deleteHistory = (id, e) => {
    e.stopPropagation();
    setHistories(prev => prev.filter(h => h.id !== id));
    if (currentHistId === id) { setMessages([]); setCurrentHistId(null); }
  };

  /* ── New chat ── */
  const newChat = () => {
    if (messages.length) saveHistory(messages);
    setMessages([]); setCurrentHistId(null); setInput(""); setError("");
    setShowHistory(false);
  };

  /* ── Text-to-Speech handler ── */
  const handleSpeak = (text, idx) => {
    if (!window.speechSynthesis) return;
    if (speakingIdx === idx) {
      window.speechSynthesis.cancel();
      setSpeakingIdx(null);
      return;
    }
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    const langMap = { en: "en-US", hi: "hi-IN", gu: "gu-IN" };
    utterance.lang = langMap[lang] || "en-US";
    /* Apply voice personality */
    const voiceSettings = {
      default: { rate:1.0, pitch:1.0 },
      male:    { rate:0.92, pitch:0.7 },
      female:  { rate:1.05, pitch:1.5 },
      child:   { rate:1.15, pitch:1.9 },
    };
    const vs = voiceSettings[voiceType] || voiceSettings.default;
    utterance.rate  = vs.rate;
    utterance.pitch = vs.pitch;
    /* Try to pick a matching system voice */
    const voices = window.speechSynthesis.getVoices();
    if (voices.length > 0) {
      const langVoices = voices.filter(v => v.lang.startsWith(langMap[lang]?.slice(0,2) || "en"));
      const allVoices  = langVoices.length ? langVoices : voices;
      if (voiceType === "female") {
        const fem = allVoices.find(v => /female|woman|girl|zira|samantha|victoria|karen|moira|tessa|fiona/i.test(v.name));
        if (fem) utterance.voice = fem;
      } else if (voiceType === "male") {
        const mal = allVoices.find(v => /male|man|david|daniel|alex|lee|arthur|james|rishi/i.test(v.name));
        if (mal) utterance.voice = mal;
      } else if (voiceType === "child") {
        /* child: just use pitch/rate, pick any light voice */
        const lit = allVoices.find(v => /junior|child|kid/i.test(v.name)) || allVoices[0];
        if (lit) utterance.voice = lit;
      }
    }
    utterance.onstart = () => setSpeakingIdx(idx);
    utterance.onend   = () => setSpeakingIdx(null);
    utterance.onerror = () => setSpeakingIdx(null);
    window.speechSynthesis.speak(utterance);
  };

  /* ── Voice Input (Mic) handler ── */
  const handleMic = () => {
    // ── STOP ──
    if (isRecording) {
      try { recognitionRef.current?.stop(); } catch(_) {}
      recognitionRef.current = null;
      setIsRecording(false);
      setError("");
      return;
    }

    setError("");

    // SpeechRecognition API check — works in Chrome/Edge natively
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) {
      setError("🎤 Voice input needs Chrome or Edge browser.");
      return;
    }

    // NOTE: getUserMedia() is intentionally NOT used here.
    // Claude.ai artifacts run inside a sandboxed <iframe> where getUserMedia
    // is blocked by the browser regardless of HTTPS. SpeechRecognition API
    // handles its own permission prompt natively — so we call it directly.
    try {
      try { recognitionRef.current?.abort(); } catch(_) {}
      recognitionRef.current = null;

      const rec = new SR();
      const langMap = { en: "en-US", hi: "hi-IN", gu: "gu-IN" };
      rec.lang           = langMap[langRef.current] || "en-US";
      rec.continuous     = true;
      rec.interimResults = true;
      rec.maxAlternatives = 1;

      let final = "";

      rec.onstart = () => { setIsRecording(true); setError(""); final = ""; };

      rec.onresult = (e) => {
        let interim = "";
        for (let i = e.resultIndex; i < e.results.length; i++) {
          const t = e.results[i][0].transcript;
          e.results[i].isFinal ? (final += t + " ") : (interim += t);
        }
        const text = (final + interim).trim();
        if (text) {
          setInput(text);
          const ta = textareaRef.current;
          if (ta) { ta.style.height = "24px"; ta.style.height = Math.min(ta.scrollHeight, 150) + "px"; }
        }
      };

      rec.onerror = (e) => {
        setIsRecording(false);
        recognitionRef.current = null;
        // "not-allowed" here means the browser itself blocked the mic
        // (sandboxed iframe, user denied, or site not trusted)
        const msgs = {
          "not-allowed":         "🎤 Mic blocked by browser. Open this app in a new tab (not inside Claude.ai) for voice to work.",
          "no-speech":           "🎤 Kuch suna nahi — thoda loud boliye.",
          "audio-capture":       "🎤 Mic nahi mila. Audio device check karein.",
          "network":             "🎤 Network error. Connection check karein.",
          "aborted":             "",
          "service-not-allowed": "🎤 Speech service yahan available nahi. App ko alag tab mein kholo.",
        };
        const msg = msgs[e.error] ?? ("🎤 Error: " + e.error);
        if (msg) setError(msg);
      };

      rec.onend = () => {
        setIsRecording(false);
        recognitionRef.current = null;
        if (final.trim()) setInput(final.trim());
        setTimeout(() => textareaRef.current?.focus(), 50);
      };

      recognitionRef.current = rec;
      rec.start();
    } catch(err) {
      setIsRecording(false);
      setError("🎤 Start nahi hua: " + err.message);
    }
  };

  useEffect(() => {
    document.body.classList.toggle("light", !dark);
    return () => document.body.classList.remove("light");
  }, [dark]);

  const toggleTheme = useCallback(() => setDark(d => !d), []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  // Auto-save to history whenever messages grow
  useEffect(() => {
    if (messages.length > 0) saveHistory(messages);
  }, [messages]); // eslint-disable-line

  const autoResize = () => {
    const ta = textareaRef.current;
    if (ta) { ta.style.height = "24px"; ta.style.height = Math.min(ta.scrollHeight, 150) + "px"; }
  };

  const handleSend = async (text) => {
    const query = (text || input).trim();
    if (!query || loading) return;
    setInput(""); setError(""); setSearchStatus("");
    if (textareaRef.current) textareaRef.current.style.height = "24px";

    const userMsg = { role: "user", content: query };
    setMessages(prev => [...prev, userMsg]);
    setLoading(true);

    const controller = new AbortController();
    abortRef.current = controller;
    const { signal } = controller;

    try {
      const ui = LANG_UI[lang] || LANG_UI.en;
      const today = new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" });

      // Persona style (in English — placed BEFORE the language rule in buildSystem so lang rule wins)
      const personaExtra = {
        default: "",
        fun:     "Be playful, witty, use light humour and relevant emojis.",
        expert:  "Respond as a world-class domain expert with precise technical language.",
        concise: "Be extremely concise — maximum 3 sentences, no fluff.",
        teacher: "Explain like a patient teacher using analogies and simple steps.",
      }[persona] || "";

      const thinkExtra = thinkMode
        ? "Before answering, reason step by step inside <think>...</think> tags, then give your final answer."
        : "";

      // buildSystem() puts the language rule LAST so it always wins
      const systemPrompt = buildSystem(lang, "chat",
        `Today is ${today}. ${personaExtra} ${thinkExtra}`.trim()
      );

      // Inject language reminder into every user message content
      const langHint = { en: "", hi: " (हिंदी में जवाब दें)", gu: " (ગુજરાતીમાં જવાબ આપો)" }[lang] || "";
      const history = [...messages, userMsg];
      const apiMessages = history.map(m => ({
        role: m.role === "user" ? "user" : "assistant",
        content: m.role === "user" ? m.content + langHint : m.content,
      }));

      if (webSearch) setSearchStatus(ui.searching);
      const tools = webSearch ? [{ type: "web_search_20250305", name: "web_search" }] : undefined;

      const res = await callClaude({
        model: "claude-sonnet-4-20250514",
        max_tokens: 1500,
        system: systemPrompt,
        messages: apiMessages,
        ...(tools ? { tools } : {})
      }, signal);

      const data = await res.json();
      if (!res.ok) throw new Error(data.error?.message || `API error ${res.status}`);

      let answerText = "";
      let finalContent = data.content || [];
      let collectedToolResults = [];

      if (data.stop_reason === "tool_use" && webSearch) {
        setSearchStatus(ui.processing);

        const toolUseBlocks = finalContent.filter(b => b.type === "tool_use");
        const toolResultBlocks = toolUseBlocks.map(tu => ({
          type: "tool_result",
          tool_use_id: tu.id,
          content: JSON.stringify(tu.input || {})
        }));

        // IMPORTANT: tool_result follow-up user message must ONLY contain tool_result blocks
        // Language is enforced via the system prompt — do NOT mix text blocks here
        const followUpMessages = [
          ...apiMessages,
          { role: "assistant", content: finalContent },
          { role: "user",      content: toolResultBlocks }
        ];

        const res2 = await callClaude({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1500,
          system: systemPrompt,
          messages: followUpMessages,
          ...(tools ? { tools } : {})
        }, signal);

        const data2 = await res2.json();
        if (!res2.ok) throw new Error(data2.error?.message || `API error ${res2.status}`);

        finalContent = data2.content || [];
        collectedToolResults = toolResultBlocks;
      }

      setSearchStatus("");

      for (const b of finalContent) {
        if (b.type === "text") answerText += b.text;
      }

      // Extract <think> blocks if Think Mode is on
      let thinkText = "";
      const thinkMatch = answerText.match(/<think>([\s\S]*?)<\/think>/i);
      if (thinkMatch) {
        thinkText  = thinkMatch[1].trim();
        answerText = answerText.replace(/<think>[\s\S]*?<\/think>/gi, "").trim();
      }

      const sources = extractSources(data.content || [], collectedToolResults);

      setMessages(prev => [...prev, {
        role: "assistant",
        content: answerText || "...",
        thinkText,
        sources,
        usedWebSearch: webSearch
      }]);

    } catch (err) {
      if (err.name === "AbortError") {
        setMessages(prev => {
          const last = prev[prev.length - 1];
          return last?.role === "user" ? prev.slice(0, -1) : prev;
        });
        setError("");
      } else {
        setError("Something went wrong: " + err.message);
      }
    } finally {
      abortRef.current = null;
      setLoading(false); setSearchStatus("");
    }
  };

  /* FIX: Rewrote extractSources to correctly pull URLs from web_search tool_use
     blocks (the query and results live in the tool_use input/output, not tool_result
     content in the way the original code expected).
     We extract from the tool_use blocks in the first response content array.
  */
  const extractSources = (firstResponseContent, toolResultBlocks) => {
    const sources = [];
    const seen = new Set();

    // Look through tool_use blocks for web search results
    for (const b of firstResponseContent) {
      if (b.type === "tool_use" && b.name === "web_search") {
        // The search results come back inside the tool_use input.results or similar
        const inp = b.input || {};
        // Try to find URLs in the input object
        const results = inp.results || inp.organic_results || [];
        for (const r of results.slice(0, 4)) {
          const url = r.url || r.link || r.href;
          if (url && !seen.has(url)) {
            seen.add(url);
            sources.push({ title: r.title || url, url });
          }
        }
        // Also try query as fallback hint
        if (inp.query && sources.length === 0) {
          // We at least know what was searched — no URL to show, skip.
        }
      }
    }

    // Secondary: try parsing tool_result content blocks if present
    for (const b of toolResultBlocks || []) {
      if (b.type === "tool_result" && b.content) {
        try {
          const parsed = JSON.parse(b.content);
          const results = parsed.results || parsed.organic_results || [];
          for (const r of results.slice(0, 4)) {
            const url = r.url || r.link;
            if (url && !seen.has(url)) {
              seen.add(url);
              sources.push({ title: r.title || url, url });
            }
          }
        } catch(_) {}
      }
    }

    return sources;
  };

  const handleKey = (e) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); }
  };

  // AUTH
  if (!user) {
    return (
      <>
        <style>{STYLES}</style>
        <AuthScreen onAuth={setUser} dark={dark} onToggleTheme={toggleTheme} />
      </>
    );
  }

  // MAIN APP
  const TAB_ITEMS = [
    { id:"chat",     icon:"💬", label:"AI Chat",      badge:null },
    { id:"images",   icon:"🖼️", label:"Image Studio",  badge:"AI" },
    { id:"summarize",icon:"📝", label:"Summarize",     badge:null },
    { id:"code",     icon:"⌨️", label:"Code",          badge:null },
    { id:"math",     icon:"🧮", label:"Math",          badge:null },
    { id:"fileqa",   icon:"📄", label:"File Q&A",      badge:null },
    { id:"trends",   icon:"🔥", label:"Trends",        badge:"Live" },
    { id:"translate",icon:"🌐", label:"Translate",     badge:"New" },
  ];

  const tabLabels = { chat:"AI Chat", images:"Image Studio", summarize:"Summarize", code:"Code Interpreter", math:"Math Solver", fileqa:"File Q&A", trends:"Trending Now", translate:"Translator" };

  return (
    <>
      <style>{STYLES}</style>
      <div className="grid-bg" />
      <div className="orb orb-1" />
      <div className="orb orb-2" />

      {/* SIDEBAR TOGGLE BUTTON */}
      <button
        className={"sidebar-toggle" + (sidebarOpen ? " open" : "")}
        onClick={() => setSidebarOpen(v => !v)}
        title={sidebarOpen ? "Close sidebar" : "Open sidebar"}
      >
        {sidebarOpen ? "✕" : "☰"}
      </button>

      {/* SIDEBAR OVERLAY (click to close on mobile) */}
      {sidebarOpen && (
        <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)} />
      )}

      {/* ══ SIDEBAR ══ */}
      <aside className={"sidebar" + (sidebarOpen ? "" : " collapsed")}>
        {/* Top: Brand + Status + New Chat */}
        <div className="sidebar-top">
          <div className="sidebar-brand">
            <div className="sidebar-logo-icon">✦</div>
            <span className="sidebar-logo-text">NexusAI</span>
          </div>
          <div className="sidebar-status">
            <div className="sidebar-status-dot" />
            Claude Sonnet · Live
          </div>
          <button className="new-chat-btn" onClick={() => { newChat(); setActiveTab("chat"); }}>
            ✦ New Chat
          </button>
        </div>

        {/* Nav Items */}
        <div className="sidebar-nav">
          <div className="sidebar-nav-label">Features</div>
          {TAB_ITEMS.map(t => (
            <button key={t.id}
              className={"sidebar-nav-item" + (activeTab === t.id ? " active" : "")}
              onClick={() => { setActiveTab(t.id); if(window.innerWidth < 768) setSidebarOpen(false); }}
            >
              <span className="sidebar-nav-icon">{t.icon}</span>
              {t.label}
              {t.badge && <span className="sidebar-nav-badge">{t.badge}</span>}
            </button>
          ))}
        </div>

        {/* Language Selector in sidebar */}
        <div style={{padding:"4px 10px 2px"}}>
          <div className="sidebar-nav-label">Language</div>
          <div style={{padding:"2px 4px"}}>
            <LanguageSelector lang={lang} onChange={(code) => { setLang(code); setMessages([]); setError(""); }} />
          </div>
        </div>

        {/* Voice Selector */}
        <div style={{padding:"2px 10px 4px"}}>
          <div className="sidebar-nav-label">AI Voice</div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:4,padding:"2px 4px"}}>
            {[{id:"default",icon:"🤖",label:"Auto"},{id:"male",icon:"👨",label:"Male"},{id:"female",icon:"👩",label:"Girl"},{id:"child",icon:"🧒",label:"Kid"}].map(v=>(
              <button key={v.id} onClick={()=>setVoiceType(v.id)} style={{
                padding:"6px 2px", borderRadius:8, border:"1.5px solid",
                borderColor: voiceType===v.id ? "var(--accent)" : "var(--border)",
                background: voiceType===v.id ? "rgba(124,92,255,0.18)" : "transparent",
                color: voiceType===v.id ? "var(--accent)" : "var(--muted)",
                fontFamily:"'Syne',sans-serif", fontSize:9, fontWeight:700,
                cursor:"pointer", transition:"all 0.18s",
                display:"flex", flexDirection:"column", alignItems:"center", gap:2,
              }}>
                <span style={{fontSize:16}}>{v.icon}</span>
                <span>{v.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Theme toggle */}
        <div style={{padding:"2px 14px 6px",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
          <span style={{fontSize:9,color:"var(--muted)",fontFamily:"'JetBrains Mono',monospace",letterSpacing:"1.4px",textTransform:"uppercase",fontWeight:700}}>Theme</span>
          <ThemeToggle dark={dark} onToggle={toggleTheme} />
        </div>

        {/* History */}
        <div className="sidebar-history">
          <div className="sidebar-history-label">
            🕐 Recent Chats
          </div>
          {histories.length === 0 && (
            <div style={{textAlign:"center",color:"var(--muted)",fontSize:11,padding:"16px 0",fontFamily:"'JetBrains Mono',monospace"}}>
              No chats yet
            </div>
          )}
          {histories.slice(0,20).map(h => (
            <div key={h.id}
              className={"history-item" + (currentHistId === h.id ? " active" : "")}
              onClick={() => { loadHistory(h); setActiveTab("chat"); if(window.innerWidth<768) setSidebarOpen(false); }}
            >
              <div className="history-item-icon">💬</div>
              <div className="history-item-text">
                <div className="history-item-title">{h.title}</div>
                <div className="history-item-date">{fmtDate(h.ts)}</div>
              </div>
              <button className="history-item-del" onClick={e => deleteHistory(h.id, e)}>🗑</button>
            </div>
          ))}
        </div>

        {/* Bottom: User */}
        <div className="sidebar-bottom">
          <div className="sidebar-user">
            <div className="sidebar-user-avatar">{user.name.charAt(0).toUpperCase()}</div>
            <div>
              <div className="sidebar-user-name">{user.name}</div>
              <div className="sidebar-user-role">Free Plan</div>
            </div>
            <button className="sidebar-user-logout" onClick={() => setUser(null)} title="Logout">↩</button>
          </div>
        </div>
      </aside>

      {/* ══ MAIN CONTENT ══ */}
      <div className={"main-content" + (sidebarOpen ? "" : " sidebar-collapsed")}>

        {/* TOP BAR */}
        <div className="topbar">
          <div className="topbar-left">
            <div className="topbar-spacer" />
            <span className="topbar-title">{tabLabels[activeTab] || "NexusAI"}</span>
          </div>
          <div className="topbar-right">
            <div className="status-badge">
              <div className="status-dot" />
              Claude · Live
            </div>
          </div>
        </div>

        {/* PAGE CONTENT */}
        <div className="content-wrapper">

          {/* ── CHAT TAB ── */}
          {activeTab === "chat" && (
            <>
              <div className="messages">
                {messages.length === 0 && !loading && (
                  <div className="empty-state">
                    <div className="empty-icon">🔭</div>
                    <div className="empty-title">{(LANG_UI[lang]||LANG_UI.en).askTitle}</div>
                    <div className="empty-sub">{(LANG_UI[lang]||LANG_UI.en).askSub}</div>
                    <div className="suggestions">
                      {(LANG_UI[lang]||LANG_UI.en).suggestions.map((s, i) => (
                        <button key={i} className="suggestion" onClick={() => handleSend(s)}>{s}</button>
                      ))}
                    </div>
                  </div>
                )}
                {messages.map((msg, i) => (
                  <div key={i} className={"message " + msg.role}>
                    <div className={"avatar " + (msg.role === "user" ? "user" : "ai")}>
                      {msg.role === "user" ? user.name.charAt(0).toUpperCase() : "✦"}
                    </div>
                    <div className={"bubble " + (msg.role === "user" ? "user" : "ai")}>
                      {msg.role === "assistant" ? (
                        <>
                          {msg.usedWebSearch && <div className="web-badge">⚡ WEB SEARCH</div>}
                          {msg.thinkText && (
                            <div className="think-block" onClick={()=>setThinkOpen(p=>({...p,[i]:!p[i]}))}>
                              <div className="think-badge">🧠 Thinking {thinkOpen[i]?"▲":"▼"}</div>
                              {thinkOpen[i] && <div style={{fontSize:12,lineHeight:1.6,marginTop:6}}>{msg.thinkText}</div>}
                            </div>
                          )}
                          <div className="answer-text">{msg.content}</div>
                          <div className="msg-actions">
                            <button className={"msg-action-btn"+(copiedIdx===i?" copied":"")} onClick={() => handleCopy(msg.content, i)}>
                              {copiedIdx===i ? "✓ Copied" : "📋 Copy"}
                            </button>
                            {i === messages.length - 1 && (
                              <button className="msg-action-btn" onClick={handleRegenerate} disabled={loading}>🔄 Regenerate</button>
                            )}
                            {window.speechSynthesis && (
                              <button className={"msg-action-btn"+(speakingIdx===i?" copied":"")} onClick={() => handleSpeak(msg.content, i)}>
                                {speakingIdx===i ? "⏹ Stop" : `🔊 Listen (${voiceType})`}
                              </button>
                            )}
                          </div>
                          {msg.sources?.length > 0 && (
                            <div className="sources">
                              <div className="sources-label">Sources</div>
                              {msg.sources.map((s, si) => (
                                <a key={si} className="source-link" href={s.url} target="_blank" rel="noopener noreferrer">
                                  <img className="source-favicon" src={"https://www.google.com/s2/favicons?domain="+getDomain(s.url)+"&sz=16"} alt="" onError={e => e.target.style.display="none"} />
                                  <span className="source-title">{s.title || s.url}</span>
                                  <span className="source-domain">{getDomain(s.url)}</span>
                                </a>
                              ))}
                            </div>
                          )}
                        </>
                      ) : msg.content}
                    </div>
                  </div>
                ))}
                {loading && (
                  <div className="message">
                    <div className="avatar ai">✦</div>
                    <div className="bubble ai">
                      {searchStatus
                        ? <div className="search-status"><div className="search-spinner" />{searchStatus}</div>
                        : <div className="typing"><div className="dot" /><div className="dot" /><div className="dot" /></div>}
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              <div className="input-area">
                <div className="persona-bar">
                  <span className="persona-label">PERSONA</span>
                  {[
                    {id:"default",label:"⚡ Default"},
                    {id:"fun",    label:"😄 Fun"},
                    {id:"expert", label:"🎓 Expert"},
                    {id:"concise",label:"⚡ Concise"},
                    {id:"teacher",label:"📚 Teacher"},
                  ].map(p=>(
                    <button key={p.id} className={"persona-btn"+(persona===p.id?" active":"")} onClick={()=>setPersona(p.id)}>{p.label}</button>
                  ))}
                  <div className="think-toggle-row" onClick={()=>setThinkMode(v=>!v)} style={{marginLeft:"auto"}}>
                    <div className={"think-pill"+(thinkMode?" on":"")}><div className="think-knob"/></div>
                    🧠 Think
                  </div>
                </div>
                <div className="input-wrapper">
                  <textarea ref={textareaRef} value={input}
                    onChange={e => { setInput(e.target.value); autoResize(); }}
                    onKeyDown={handleKey}
                    placeholder={webSearch ? (LANG_UI[lang]||LANG_UI.en).placeholder : (LANG_UI[lang]||LANG_UI.en).placeholderNoSearch}
                    rows={1} disabled={loading}
                  />
                  <button className={"mic-btn"+(isRecording?" recording":"")} onClick={handleMic} disabled={loading}
                    title={isRecording ? "Recording… click to stop" : "Voice input (works in Chrome/Edge)"}>
                    {isRecording ? "⏹" : "🎤"}
                  </button>
                  {loading
                    ? <button className="stop-btn" onClick={handleStop}>⏹</button>
                    : <button className="send-btn" onClick={() => handleSend()} disabled={!input.trim()}>↑</button>
                  }
                </div>
                <div className="input-footer">
                  <div className="mode-toggle" onClick={() => setWebSearch(v => !v)}>
                    <div className={"toggle-pill " + (webSearch ? "on" : "")}><div className="toggle-knob-sm" /></div>
                    {webSearch ? "🌐 Web Search ON" : "🧠 AI Only"}
                  </div>
                  {isRecording
                    ? <div style={{display:"flex",alignItems:"center",gap:6,fontFamily:"'JetBrains Mono',monospace",fontSize:11,color:"var(--accent3)"}}>
                        <span style={{width:7,height:7,borderRadius:"50%",background:"var(--accent3)",display:"inline-block"}}/>
                        Listening…
                      </div>
                    : <div className="char-count">{input.length > 0 ? input.length+" chars" : "Enter ↵ to send"}</div>
                  }
                </div>
                {error && <div className="error-msg">⚠ {error}</div>}
              </div>
            </>
          )}

          {/* ── IMAGE STUDIO ── */}
          {activeTab === "images" && (
            <ImageStudio
              galleryImages={galleryImages}
              setGalleryImages={setGalleryImages}
              lightboxImg={lightboxImg}
              setLightboxImg={setLightboxImg}
            />
          )}

          {/* ── SUMMARIZER ── */}
          {activeTab === "summarize" && <Summarizer lang={lang} />}

          {/* ── CODE ── */}
          {activeTab === "code" && <CodeInterpreter lang={lang} />}

          {/* ── MATH ── */}
          {activeTab === "math" && <MathSolver lang={lang} />}

          {/* ── FILE Q&A ── */}
          {activeTab === "fileqa" && <FileQA lang={lang} />}

          {/* ── TRENDS ── */}
          {activeTab === "trends" && <Trends lang={lang} onAskInChat={q=>{setActiveTab("chat");setTimeout(()=>handleSend(q),100);}} />}

          {/* ── TRANSLATE (New Feature) ── */}
          {activeTab === "translate" && <Translator lang={lang} />}

        </div>
      </div>

      {/* LIGHTBOX */}
      {lightboxImg && (
        <div className="img-lightbox" onClick={() => setLightboxImg(null)}>
          <button className="img-lightbox-close" onClick={() => setLightboxImg(null)}>✕</button>
          <img src={lightboxImg.src} alt={lightboxImg.prompt} onClick={e => e.stopPropagation()}
            onError={e=>{ if(!e.target.dataset.fb){ e.target.dataset.fb="1"; e.target.style.opacity="0.4"; }}} />
          {lightboxImg.prompt && (
            <div className="img-lightbox-info">{lightboxImg.prompt}</div>
          )}
          <div className="img-lightbox-actions" onClick={e => e.stopPropagation()}>
            <button className="img-lightbox-btn back" onClick={() => setLightboxImg(null)}>← Back</button>
            <button className="img-lightbox-btn download" onClick={() => {
              const a = document.createElement("a");
              a.href = lightboxImg.src;
              a.download = lightboxImg.downloadName || "nexusai-image.png";
              a.target = "_blank";
              document.body.appendChild(a);
              a.click();
              document.body.removeChild(a);
            }}>⬇ Download</button>
          </div>
        </div>
      )}
    </>
  );
}
