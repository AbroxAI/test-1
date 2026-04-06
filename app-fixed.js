// app-fixed.js — FINAL Telegram 2026 Integration
// FIXED: Broadcast message has NO button. Pin banner has ONLY blue "Contact Admin" button.
// Whole pill clickable, jumps to admin broadcast.

document.addEventListener("DOMContentLoaded", () => {

  const pinBanner = document.getElementById("tg-pin-banner");
  const container = document.getElementById("tg-comments-container");
  const headerMeta = document.getElementById("tg-meta-line");

  if (!container) {
    console.error("tg-comments-container missing in DOM");
    return;
  }

  /* =====================================================
     TELEGRAM HIGHLIGHT PULSE
  ===================================================== */
  const style = document.createElement('style');
  style.textContent = `
  .tg-highlight { 
    background-color: rgba(255, 229, 100, 0.3); 
    border-radius: 14px; 
    animation: tgFadePulse 2.6s ease-out forwards; 
  } 
  @keyframes tgFadePulse { 
    0% { opacity: 1; transform: scale(1.02); } 
    20% { opacity: 1; transform: scale(1); } 
    100% { opacity: 0; transform: scale(1); } 
  }`;
  document.head.appendChild(style);

  /* =====================================================
     SAFE APPEND WRAPPER
  ===================================================== */
  function appendSafe(persona, text, opts = {}) {
    if (!window.TGRenderer?.appendMessage) {
      console.warn("TGRenderer not ready");
      return null;
    }

    const result = window.TGRenderer.appendMessage(persona, text, opts);

    document.dispatchEvent(
      new CustomEvent("messageAppended", { detail: { persona } })
    );

    return result;
  }

  /* =====================================================
     HEADER TYPING MANAGER
  ===================================================== */
  const typingPersons = new Map();

  document.addEventListener("headerTyping", (ev) => {
    const name = ev.detail?.name;
    if (!name) return;

    if (typingPersons.has(name)) {
      clearTimeout(typingPersons.get(name));
    }

    const timeout = setTimeout(() => {
      typingPersons.delete(name);
      updateHeaderTyping();
    }, 5000);

    typingPersons.set(name, timeout);
    updateHeaderTyping();
  });

  document.addEventListener("messageAppended", (ev) => {
    const persona = ev.detail?.persona;
    if (!persona?.name) return;

    if (typingPersons.has(persona.name)) {
      clearTimeout(typingPersons.get(persona.name));
      typingPersons.delete(persona.name);
      updateHeaderTyping();
    }
  });

  function updateHeaderTyping() {
    if (!headerMeta) return;

    const names = Array.from(typingPersons.keys());

    if (names.length === 0) {
      headerMeta.textContent =
        `${window.MEMBER_COUNT?.toLocaleString?.() || "0"} members, ` +
        `${window.ONLINE_COUNT?.toLocaleString?.() || "0"} online`;
    }
    else if (names.length === 1) {
      headerMeta.textContent = `${names[0]} is typing…`;
    }
    else if (names.length === 2) {
      headerMeta.textContent = `${names[0]} & ${names[1]} are typing…`;
    }
    else {
      headerMeta.textContent =
        `${names[0]}, ${names[1]} +${names.length - 2} are typing…`;
    }
  }

  /* =====================================================
     PIN SYSTEM
  ===================================================== */
  function jumpToMessage(el) {
    if (!el) return;
    el.scrollIntoView({ behavior: "smooth", block: "center" });
    el.classList.add("tg-highlight");
    setTimeout(() => el.classList.remove("tg-highlight"), 2600);
  }

  function safeJumpById(id, retries = 6) {
    const el = document.querySelector(`[data-id="${id}"]`);
    if (el) jumpToMessage(el);
    else if (retries > 0)
      setTimeout(() => safeJumpById(id, retries - 1), 200);
  }

  function postAdminBroadcast() {
    const admin = window.identity?.Admin || {
      name: "Admin",
      avatar: "assets/admin.jpg",
      isAdmin: true
    };

    // Plain text caption - NO BUTTONS, NO HTML
    const caption = `📌 Important Notice

⚠️ This group is for verified members only.
🚫 Do NOT trust random messages.
🚫 Admin will NEVER DM you first.

❗ Stay alert and protect yourself.

👇 Use the Contact Admin button at the top (pinned banner) for help.`;

    const image = "assets/broadcast.jpg";
    const timestamp = new Date();

    const id = appendSafe(admin, "", {
      timestamp,
      type: "incoming",
      image,
      caption
    });

    return { id, image };
  }

  function showPinBanner(image, pinnedMessageId) {
    if (!pinBanner) return;
    pinBanner.innerHTML = "";

    // Make the whole pill clickable -> jump to admin broadcast
    pinBanner.style.cursor = "pointer";
    pinBanner.onclick = () => {
      if (pinnedMessageId) safeJumpById(pinnedMessageId);
    };

    // Icon: broadcast image (small)
    const img = document.createElement("img");
    img.src = image;
    img.onerror = () => (img.src = "assets/admin.jpg");
    img.alt = "broadcast";

    // Text: brief group rule
    const text = document.createElement("div");
    text.className = "tg-pin-text";
    text.textContent = "📌 Group Rules";

    // Single BLUE button (no glass)
    const blueBtn = document.createElement("button");
    blueBtn.className = "pin-btn";  // This uses the blue style from CSS
    blueBtn.textContent = "Contact Admin";
    blueBtn.onclick = (e) => {
      e.stopPropagation();
      if (pinnedMessageId) safeJumpById(pinnedMessageId);
    };

    const btnContainer = document.createElement("div");
    btnContainer.className = "pin-btn-container";
    btnContainer.appendChild(blueBtn);

    pinBanner.appendChild(img);
    pinBanner.appendChild(text);
    pinBanner.appendChild(btnContainer);

    pinBanner.classList.remove("hidden");
    requestAnimationFrame(() => pinBanner.classList.add("show"));
  }

  function postPinNotice() {
    appendSafe(
      { name: "System", avatar: "assets/admin.jpg" },
      "Admin pinned a message",
      { timestamp: new Date(), type: "incoming" }
    );
  }

  const broadcast = postAdminBroadcast();

  setTimeout(() => {
    postPinNotice();
    showPinBanner(broadcast.image, broadcast.id);
  }, 1200);

  /* =====================================================
     GLOBAL HEADER TYPING QUEUE
  ===================================================== */
  let typingQueue = Promise.resolve();

  function queuedTyping(persona, message) {
    if (!persona?.name) return Promise.resolve();

    typingQueue = typingQueue.then(async () => {
      document.dispatchEvent(
        new CustomEvent("headerTyping", { detail: { name: persona.name } })
      );

      const duration =
        window.TGRenderer?.calculateTypingDuration?.(message) || 1200;

      await new Promise(resolve => setTimeout(resolve, duration));
    }).catch(err => {
      console.error("Typing queue error:", err);
    });

    return typingQueue;
  }

  /* =====================================================
     ADMIN AUTO RESPONSE
  ===================================================== */
  document.addEventListener("sendMessage", async (ev) => {
    const text = ev.detail?.text || "";
    const admin = window.identity?.Admin || {
      name: "Admin",
      avatar: "assets/admin.jpg"
    };

    await queuedTyping(admin, text);

    appendSafe(
      admin,
      "Please use the Contact Admin button in the pinned banner above.",
      { timestamp: new Date(), type: "incoming" }
    );
  });

  /* =====================================================
     AUTO REPLY HANDLER
  ===================================================== */
  document.addEventListener("autoReply", async (ev) => {
    const { parentText, persona, text } = ev.detail || {};
    if (!persona || !text) return;

    await queuedTyping(persona, text);

    appendSafe(persona, text, {
      timestamp: new Date(),
      type: "incoming",
      replyToText: parentText
    });
  });

  /* =====================================================
     START REALISM ENGINE
  ===================================================== */
  if (window.realism?.simulate) {
    setTimeout(() => {
      window.realism.simulate();

      if (window.TGRenderer) {
        const originalAppendJoin = window.TGRenderer.appendJoinSticker;
        window.TGRenderer.appendJoinSticker = function(names) {
          if (!names || names.length === 0) return;

          const container = document.getElementById("tg-comments-container");
          const lastSticker = container?.querySelector(".tg-join-sticker:last-of-type");
          if (lastSticker) lastSticker.remove();

          const wrapper = document.createElement("div");
          wrapper.className = "tg-join-sticker";

          const textEl = document.createElement("div");
          textEl.className = "tg-join-text";
          textEl.textContent = names.length > 3
            ? `${names.slice(0,3).join(", ")} & ${names.length-3} others joined the chat`
            : `${names.join(", ")} joined the chat`;

          wrapper.appendChild(textEl);
          container?.appendChild(wrapper);

          const atBottom = container.scrollTop + container.clientHeight >= container.scrollHeight - 80;
          if (atBottom) container.scrollTop = container.scrollHeight;
        };
      }

    }, 800);
  }

  console.log("✅ app-fixed.js — Broadcast has NO button, pin banner has ONLY blue Contact Admin button.");
});
