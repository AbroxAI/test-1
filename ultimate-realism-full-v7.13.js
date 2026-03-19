(function(){
  'use strict';

  /* =====================================================
  DATA POOLS (same as your original code)
  ====================================================== */
  const ASSETS = [
    "assets/image1.jpg", "assets/image2.jpg", "assets/image3.jpg", "assets/image4.jpg", 
    "assets/image5.jpg", "assets/image6.jpg", "assets/image7.jpg" // Add more as needed
  ];

  const TESTIMONIALS = [
    "Made $450 in 2 hours using Abrox", "Closed 3 trades, all green today ✅",
    "Recovered a losing trade thanks to Abrox", "7 days straight of consistent profit 💹",
    "Abrox saved me from a $200 loss", "50% ROI in a single trading session 🚀",
    "Signal timing was perfect today", "Scalped 5 trades successfully today 🚀",
    "Missed entry but recovered", "Made $120 in micro trades this session",
    // Add more testimonials as needed
  ];

  const REPLY_TEMPLATES = [
    "Yes, I agree!", "Exactly 💯", "Nice point 👍", "I’ve been thinking the same.",
    "Can you elaborate?", "Interesting 🤔", "😂 That’s funny!", "Absolutely 🚀",
    "Good catch!", "Thanks for sharing 💡", "Welcome aboard! 👋",
    "That actually makes sense", "I noticed that too", "Same experience here"
  ];

  const PERSONAS = [
    {name:"Alex", tone:"excited", memory:[], style:"casual"},
    {name:"Jordan", tone:"analytical", memory:[], style:"professional"},
    {name:"Sam", tone:"sarcastic", memory:[], style:"funny"},
    {name:"Taylor", tone:"calm", memory:[], style:"supportive"},
    {name:"Riley", tone:"optimistic", memory:[], style:"cheerful"}
  ];

  /* =====================================================
  Image Generation Logic
  ====================================================== */
  const usedImages = new Set(); // Track images that have already been used

  // Function to pick a random image from the ASSETS pool
  function getRandomImage() {
    // Get a random index and ensure it's not already used
    let randomIndex = Math.floor(Math.random() * ASSETS.length);
    while (usedImages.has(randomIndex)) {
      randomIndex = Math.floor(Math.random() * ASSETS.length);
    }
    const imagePath = ASSETS[randomIndex];
    usedImages.add(randomIndex); // Mark this image as used
    return imagePath;
  }

  /* =====================================================
  COMMENT GENERATION (with image & testimonial)
  ====================================================== */
  function generateCommentWithImage(persona, lastTimestamp = new Date()) {
    const testimonial = smartPick(TESTIMONIALS, persona.memory);
    const image = getRandomImage();
    const text = testimonial;

    persona.memory.push(text);
    if (persona.memory.length > 150) persona.memory.shift();

    let meta = {};
    if (Math.random() < 0.6) { 
      meta.reaction = ["👍", "❤️", "😂", "💯", "🔥", "🚀"][Math.floor(Math.random() * 6)];
    }

    return {
      text,
      timestamp: generateTimestamp(lastTimestamp),
      persona,
      meta,
      image, // Include image in the comment
    };
  }

  /* =====================================================
  Generate Timestamp
  ====================================================== */
  function generateTimestamp(lastTimestamp = new Date()) {
    return new Date(lastTimestamp.getTime() + 5000 + Math.random() * 20000);
  }

  function smartPick(arr, memory = []) {
    let filtered = arr.filter(x => !memory.includes(x));
    if (!filtered.length) filtered = arr;
    let pick = filtered[Math.floor(Math.random() * filtered.length)];
    memory.push(pick);
    if (memory.length > 50) memory.shift();
    return pick;
  }

  /* =====================================================
  Typing Delay and Typing Indicator Logic
  ====================================================== */
  function humanTypingDelay(text, persona) {
    let base = 400, perChar = 25;
    if (persona.tone === "analytical") perChar = 30;
    if (persona.tone === "excited") perChar = 18;
    if (persona.tone === "sarcastic") perChar = 22;
    if (persona.tone === "calm") perChar = 20;
    if (persona.tone === "optimistic") perChar = 19;
    return Math.min(base + perChar * text.length, 5000);
  }

  /* =====================================================
  MERGED JOINERS QUEUE & QUEUE LOGIC
  ====================================================== */
  let pendingJoiners = [];
  let joinerTimeout;
  function queueJoiner(joinerPersona) {
    if (!joinerPersona?.name) return;
    pendingJoiners.push(joinerPersona.name);
    if (joinerTimeout) clearTimeout(joinerTimeout);
    joinerTimeout = setTimeout(() => {
      if (window.TGRenderer?.appendJoinSticker) {
        window.TGRenderer.appendJoinSticker(pendingJoiners);
        const container = document.getElementById('tg-comments-container');
        if (container) container.scrollTo({ top: container.scrollHeight, behavior: 'smooth' });
      }
      pendingJoiners = [];
    }, 1200);
  }

  const interactionQueue = [];
  let processingQueue = false;

  function enqueueInteraction(interaction) {
    if (!interaction || !interaction.persona || !interaction.text) return;
    interactionQueue.push(interaction);
    processQueue();
  }

  async function processQueue() {
    if (processingQueue || interactionQueue.length === 0) return;
    processingQueue = true;
    while (interactionQueue.length > 0) {
      const inter = interactionQueue.shift();
      const { persona, text, meta, image } = inter;
      const opts = {};
      
      if (meta && meta.reaction) {
        opts.reactions = [{ emoji: meta.reaction, count: 1 + Math.floor(Math.random() * 5) }];
      }

      // Simulating image sending with comment
      if (image) {
        console.log(`Image sent with comment: ${image}`);
      }

      // Simulate the delay for typing
      const typing = humanTypingDelay(text, persona);
      await new Promise(r => setTimeout(r, typing));

      // Simulate sending the message
      if (window.TGRenderer?.appendMessage) {
        window.TGRenderer.appendMessage(persona, text, opts);
      }

      // Optionally, append the image if it was attached to the comment
      if (image) {
        const imgElement = document.createElement('img');
        imgElement.src = image;
        imgElement.alt = 'Generated Image';
        document.body.appendChild(imgElement); // Or wherever you want to show it
      }
    }
    processingQueue = false;
  }

  /* =====================================================
  MULTI-TURN REPLIES (simulating replies and reactions)
  ====================================================== */
  function simulateMultiTurnReply(joinerPersona, parentComment, depth = 0) {
    if (depth > 3) return;
    let replyText = REPLY_TEMPLATES[Math.floor(Math.random() * REPLY_TEMPLATES.length)];
    const delay = randomDelay(2000, 12000);
    setTimeout(() => {
      enqueueInteraction({ persona: joinerPersona, text: replyText, parentText: parentComment.text, parentId: parentComment.id || null });
      joinerPersona.memory.push(replyText);
      if (Math.random() < 0.3) {
        const followUp = getRandomPersona();
        simulateMultiTurnReply(followUp, { text: replyText, id: parentComment.id }, depth + 1);
      }
    }, delay);
  }

  /* =====================================================
  AUTO SIMULATION LOOP (now with image and testimonial logic)
  ====================================================== */
  function autoSimulate(lastTimestamp = new Date()) {
    const persona = getRandomPersona();
    let randomComment = generateCommentWithImage(persona, lastTimestamp);
    enqueueInteraction(randomComment);

    // Randomly react or reply
    if (Math.random() < 0.25) {
      const randomReply = smartPick(REPLY_TEMPLATES, persona.memory);
      const reply = {
        text: randomReply,
        timestamp: new Date(),
        persona,
        meta: { reaction: ["👍", "❤️", "😂", "💯", "🔥", "🚀"][Math.floor(Math.random() * 6)] },
        image: null, // No image for regular replies
      };
      enqueueInteraction(reply);
    }

    const nextDelay = randomDelay(1500, 6000);
    setTimeout(() => autoSimulate(randomComment.timestamp), nextDelay);
  }

  /* =====================================================
  SIMULATION INITIALIZATION
  ====================================================== */
  (function initializeSimulation() {
    autoSimulate(new Date());
  })();

})();
