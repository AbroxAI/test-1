/* widget.css — Original layout restored (pin banner top:6px) + low‑end overrides */

/* =========================
   VARIABLES
========================= */
:root {
  --tg-bg-main: #0e1621;
  --tg-text: #e6eef8;
  --tg-muted: #9aa7bd;
  --tg-accent: #2ea6ff;
  --tg-avatar-size: 40px;
  --tg-header-height: 58px;
  --tg-input-height: 46px;
  --tg-input-radius: 24px;
  --gold: #ffd166;
  --tg-gap: calc(var(--tg-avatar-size) * 0.7);
  --tg-nub-offset: calc(-1 * (var(--tg-gap) - 6px));
}

/* =========================
   BASE
========================= */
* { box-sizing: border-box; }

html, body {
  height: 100dvh;
  margin: 0;
  background: #0e1621;
  overflow: hidden;
}

body {
  position: relative;
  color: var(--tg-text);
  font-family: Inter, system-ui, -apple-system, "Segoe UI", Roboto, Arial;
  -webkit-font-smoothing: antialiased;
}

/* =========================
   WALLPAPER
========================= */
#tg-comments-app {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  height: 100dvh;
  overflow: hidden;
  background: transparent;
}

#tg-comments-app::before {
  content: "";
  position: absolute;
  inset: 0;
  background-image: url("assets/telegram-doodle.png");
  background-repeat: repeat;
  background-size: 520px;
  background-position: 0 0;
  opacity: 0.20;
  pointer-events: none;
  z-index: -2;
}

#tg-comments-app::after {
  content: "";
  position: absolute;
  inset: 0;
  background: rgba(14, 22, 33, 0.22);
  pointer-events: none;
  z-index: -1;
}

.hidden { display: none !important; }

/* =========================
   HEADER
========================= */
.tg-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: var(--tg-header-height);
  padding: 0 14px;
  background: rgba(23,33,43,0.55);
  backdrop-filter: blur(16px);
  position: sticky;
  top: 0;
  z-index: 60;
}
.tg-header-center {
  display: flex;
  align-items: center;
  gap: 10px;
  flex: 1;
  margin: 0 12px;
  min-width: 0;
}
.tg-header-avatar {
  width: var(--tg-avatar-size);
  height: var(--tg-avatar-size);
  border-radius: 50%;
  object-fit: cover;
}
.tg-title { font-size: 15px; font-weight: 700; }
.tg-meta { font-size: 12px; color: var(--tg-muted); margin-top: 2px; }

/* =========================
   ICON BUTTONS
========================= */
.tg-back-btn, .tg-options-btn {
  background: none;
  border: none;
  color: #fff;
  padding: 6px;
  cursor: pointer;
}
.tg-back-btn i, .tg-options-btn i { width: 22px; height: 22px; }

/* =========================
   PIN BANNER — original position (top:6px)
========================= */
.tg-pin-banner {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 18px;
  background: rgba(34, 44, 56, 0.92);
  backdrop-filter: blur(18px);
  border-radius: 40px;
  color: var(--tg-text);
  font-size: 14px;
  line-height: 1.2;
  position: sticky;
  top: 6px;            /* ← original value */
  z-index: 55;
  margin: 4px 12px 8px 12px;
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.28);
  transition: all 0.2s ease-out;
  width: auto;
  max-width: calc(100% - 24px);
}

.tg-pin-banner.compressed {
  padding: 5px 14px;
  gap: 6px;
  font-size: 12px;
  top: 4px;            /* ← original compressed value */
  margin-top: 2px;
  margin-bottom: 6px;
}

.tg-pin-banner img {
  width: 36px;
  height: 36px;
  border-radius: 10px;
  object-fit: cover;
  flex-shrink: 0;
  transition: all 0.2s ease;
}

.tg-pin-banner.compressed img {
  width: 26px;
  height: 26px;
}

.tg-pin-text {
  flex: 1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  min-width: 0;
}

.pin-btn-container {
  display: flex;
  gap: 8px;
  flex-shrink: 0;
}

.pin-btn-container .glass-btn,
.pin-btn-container .pin-btn {
  height: 34px;
  padding: 0 16px;
  border-radius: 40px;
  border: none;
  background: var(--tg-accent);
  color: #fff;
  font-weight: 600;
  font-size: 13px;
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
}

.tg-pin-banner.compressed .pin-btn-container .glass-btn,
.tg-pin-banner.compressed .pin-btn-container .pin-btn {
  height: 28px;
  padding: 0 12px;
  font-size: 12px;
}

.pin-btn-container .glass-btn:hover,
.pin-btn-container .pin-btn:hover {
  transform: translateY(-1px);
  filter: brightness(1.05);
}

/* =========================
   GLASS BUTTON
========================= */
.glass-btn {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 36px;
  padding: 0 16px;
  font-size: 14px;
  font-weight: 600;
  letter-spacing: .2px;
  border-radius: 40px;
  color: #ffffff;
  text-decoration: none;
  background: linear-gradient(180deg, rgba(46,166,255,0.30) 0%, rgba(46,166,255,0.18) 45%, rgba(46,166,255,0.10) 100%);
  backdrop-filter: blur(20px) saturate(180%);
  -webkit-backdrop-filter: blur(20px) saturate(180%);
  border: 1px solid rgba(46,166,255,0.45);
  box-shadow: 0 6px 24px rgba(46,166,255,0.25), inset 0 1px 0 rgba(255,255,255,0.35);
  transition: all .28s cubic-bezier(.4,0,.2,1);
  overflow: hidden;
}
.glass-btn::before {
  content: '';
  position: absolute;
  top: 0;
  left: -120%;
  width: 120%;
  height: 100%;
  background: linear-gradient(120deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.55) 50%, rgba(255,255,255,0) 100%);
  transition: all .8s ease;
}
.glass-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 32px rgba(46,166,255,0.55), inset 0 1px 0 rgba(255,255,255,0.5);
}
.glass-btn:hover::before { left: 120%; }
.glass-btn:active { transform: scale(.95); box-shadow: 0 4px 14px rgba(0,0,0,0.4), inset 0 3px 8px rgba(0,0,0,0.35); }

/* =========================
   COMMENTS CONTAINER — bottom padding 80px
========================= */
.tg-comments-container {
  flex: 1 1 auto;
  padding: 12px 12px 80px 12px;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  background: transparent;
  position: relative;
  z-index: 1;
}

/* =========================
   DATE STICKER
========================= */
.tg-date-sticker {
  display: block;
  width: max-content;
  margin: 12px auto;
  background: rgba(255,255,255,0.04);
  padding: 6px 12px;
  border-radius: 16px;
  font-size: 12px;
  color: var(--tg-muted);
}

/* =========================
   BUBBLE WRAPPER
========================= */
.tg-bubble {
  display: flex;
  align-items: flex-start;
  gap: var(--tg-gap, 28px);
  margin-bottom: 14px;
  max-width: 78%;
  position: relative;
}
.tg-bubble.incoming { justify-content: flex-start; }
.tg-bubble.outgoing { flex-direction: row-reverse; margin-left: auto; }

/* =========================
   AVATAR
========================= */
.tg-bubble-avatar {
  width: var(--tg-avatar-size);
  height: var(--tg-avatar-size);
  border-radius: 50%;
  object-fit: cover;
  flex-shrink: 0;
  display: block;
}

/* =========================
   BUBBLE CONTENT
========================= */
.tg-bubble-content {
  padding: 10px 14px;
  border-radius: 16px;
  font-size: 14px;
  line-height: 1.35;
  word-break: break-word;
  position: relative;
  max-width: 100%;
  box-shadow: 0 6px 18px rgba(0,0,0,0.18);
  overflow: visible;
  z-index: 1;
  background: #182533;
  color: var(--tg-text);
  --bubble-tail-color: #182533;
}
.tg-bubble.incoming .tg-bubble-content { background: #182533; --bubble-tail-color: #182533; }
.tg-bubble.outgoing .tg-bubble-content { background: #2b6df6; color: #fff; --bubble-tail-color: #2b6df6; }

/* =========================
   BUBBLE TAIL
========================= */
.tg-bubble-content::after {
  content: "";
  position: absolute;
  width: 16px;
  height: 18px;
  bottom: 2px;
  pointer-events: none;
  background: var(--bubble-tail-color);
}
.tg-bubble.incoming .tg-bubble-content::after {
  left: -7px;
  clip-path: polygon(100% 0, 0 100%, 100% 100%);
}
.tg-bubble.outgoing .tg-bubble-content::after {
  right: -7px;
  transform: scaleX(-1);
  clip-path: polygon(100% 0, 0 100%, 100% 100%);
}

/* =========================
   SENDER COLORS
========================= */
.tg-bubble-sender {
  font-weight: 600;
  margin-bottom: 2px;
  font-size: 13px;
}
.tg-bubble-sender[data-color="1"] { color:#2ea6ff; }
.tg-bubble-sender[data-color="2"] { color:#ff6b6b; }
.tg-bubble-sender[data-color="3"] { color:#ffb86c; }
.tg-bubble-sender[data-color="4"] { color:#8be9fd; }
.tg-bubble-sender[data-color="5"] { color:#50fa7b; }
.tg-bubble-sender[data-color="6"] { color:#ff79c6; }
.tg-bubble-sender[data-color="7"] { color:#bd93f9; }
.tg-bubble-sender[data-color="8"] { color:#f1fa8c; }
.tg-bubble-sender[data-color="9"] { color:#ff5555; }
.tg-bubble-sender[data-color="10"] { color:#6272a4; }
.tg-bubble-sender[data-color="11"] { color:#ff6e96; }
.tg-bubble-sender[data-color="12"] { color:#8affff; }
.tg-bubble-sender[data-color="13"] { color:#ffde6d; }
.tg-bubble-sender[data-color="14"] { color:#5aff7a; }
.tg-bubble-sender[data-color="15"] { color:#d16fff; }

/* =========================
   REPLY PREVIEW
========================= */
.tg-reply-preview {
  background: rgba(255, 255, 255, 0.06);
  border-left: 3px solid var(--tg-accent);
  padding: 4px 8px;
  margin-bottom: 6px;
  border-radius: 8px;
  font-size: 12px;
  color: var(--tg-muted);
  cursor: pointer;
  transition: background 0.2s ease;
}
.tg-reply-preview:hover { background: rgba(46,166,255,0.15); }

/* =========================
   META TIMESTAMP
========================= */
.tg-bubble-meta {
  font-size: 11px;
  font-weight: 400;
  color: var(--tg-muted);
  margin-top: 2px;
}

/* =========================
   REACTION FLOATING PILLS
========================= */
.tg-bubble-reactions{
  position:absolute;
  bottom:-12px;
  display:flex;
  gap:4px;
  padding:2px;
  pointer-events:none;
  z-index:3;
}

.tg-bubble.incoming .tg-bubble-reactions{ left:54px; }
.tg-bubble.outgoing .tg-bubble-reactions{ right:10px; }

.tg-bubble-reactions .reaction{
  background:#1f2c3a;
  border-radius:16px;
  font-size:11px;
  padding:2px 6px;
  display:flex;
  align-items:center;
  gap:3px;
  box-shadow:0 2px 6px rgba(0,0,0,0.35);
  border:1px solid rgba(255,255,255,0.08);
  backdrop-filter:blur(6px);
  pointer-events:auto;
}

/* =========================
   TYPING DOTS
========================= */
.tg-typing span{
  width:6px; height:6px; border-radius:50%;
  background:var(--tg-muted);
  display:inline-block;
  animation: tgTyping 1.4s infinite;
}
.tg-typing span:nth-child(2){ animation-delay:.2s; }
.tg-typing span:nth-child(3){ animation-delay:.4s; }

@keyframes tgTyping{
  0%,80%,100%{ opacity:.3; transform:scale(.7);}
  40%{ opacity:1; transform:scale(1);}
}

/* =========================
   NEW MESSAGE BLUE PILL
========================= */
#tg-jump-indicator {
  position: fixed;
  bottom: 90px;
  left: 50%;
  transform: translateX(-50%);
  background: var(--tg-accent);
  color: #fff;
  padding: 6px 16px;
  border-radius: 24px;
  font-size: 13px;
  font-weight: 600;
  box-shadow: 0 6px 18px rgba(0,0,0,0.32);
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  z-index: 80;
  transition: all .28s cubic-bezier(.4,0,.2,1);
}
#tg-jump-indicator:hover {
  transform: translateX(-50%) translateY(-2px);
  box-shadow: 0 10px 24px rgba(46,166,255,0.5);
}
#tg-jump-indicator i { width: 16px; height: 16px; stroke-width: 3; }
#tg-jump-indicator.hidden {
  opacity: 0;
  pointer-events: none;
  transform: translateX(-50%) translateY(8px);
}
#tg-jump-text { white-space: nowrap; }

/* =========================
   INPUT BAR
========================= */
.tg-input-wrapper {
  padding: 8px 12px;
  background: transparent;
  backdrop-filter: blur(16px);
  position: sticky;
  bottom: 0;
  z-index: 60;
}

.tg-input-bar {
  display: flex;
  align-items: center;
  gap: 10px;
  background: rgba(23, 33, 43, 0.85);
  border-radius: 40px;
  padding: 6px 18px;
  backdrop-filter: blur(12px);
  transition: all 0.2s ease;
  border: 1px solid rgba(255, 255, 255, 0.08);
}

.tg-input-bar:hover {
  background: rgba(23, 33, 43, 0.95);
}

.tg-comment-input {
  flex: 1;
  background: transparent;
  border: none;
  outline: none;
  color: #e6eef8;
  font-size: 14px;
  padding: 8px 0;
}

.tg-verified-lock {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: var(--tg-muted);
  background: rgba(0,0,0,0.3);
  padding: 4px 10px;
  border-radius: 40px;
  white-space: nowrap;
}

.tg-input-lock-message {
  font-size: 11px;
  color: var(--tg-muted);
  margin-top: 6px;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
}

/* =========================
   JOIN STICKER
========================= */
.tg-join-sticker {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 10px;
  border-radius: 18px;
  font-size: 12px;
  font-weight: 500;
  background: rgba(46,166,255,0.18);
  color: #ffffff;
  box-shadow: 0 2px 6px rgba(0,0,0,0.2);
  margin: 4px 0;
  max-width: fit-content;
  white-space: nowrap;
  animation: joinSlideIn 0.4s ease-out;
}
@keyframes joinSlideIn {
  0% { opacity: 0; transform: translateY(-8px); }
  100% { opacity: 1; transform: translateY(0); }
}

/* =========================
   RESPONSIVE
========================= */
@media (max-width: 520px) {
  .tg-bubble { max-width: 86%; }
  .tg-bubble-image { max-height: 220px; }
  .tg-pin-banner img { max-width: 50px; max-height: 50px; }
  .tg-pin-banner .pin-btn-container { flex-direction: column; align-items: flex-start; gap: 6px; }
  .tg-input-bar { padding: 6px 14px; }
}

/* ============================================
   LOW-END DEVICE OVERRIDES (layout unchanged)
   ============================================ */
body.low-end .tg-header {
  background: rgba(23,33,43,0.85);
  backdrop-filter: none;
}
body.low-end .tg-pin-banner {
  background: rgba(34,44,56,0.92);
  backdrop-filter: none;
}
body.low-end .tg-input-bar {
  background: rgba(23,33,43,0.95);
  backdrop-filter: none;
}
body.low-end .tg-bubble-content {
  box-shadow: 0 1px 3px rgba(0,0,0,0.2);
}
body.low-end .tg-bubble-reactions .reaction {
  backdrop-filter: none;
}
body.low-end .glass-btn {
  backdrop-filter: none;
  background: linear-gradient(180deg, rgba(46,166,255,0.5) 0%, rgba(46,166,255,0.3) 100%);
}
body.low-end .tg-join-sticker {
  animation: none;
}
