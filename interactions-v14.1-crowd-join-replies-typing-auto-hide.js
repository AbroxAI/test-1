// interactions-realism-full-v14.5.js — Unified interactions + realism engine with 100 real replies
(function(){
'use strict';

/* =====================================================
   SHARED JOINERS QUEUE
===================================================== */
let pendingJoiners = [];
let joinerTimeout;

function queueJoiner(joinerPersona){
    if(!joinerPersona?.name) return;
    pendingJoiners.push(joinerPersona.name);

    if(joinerTimeout) clearTimeout(joinerTimeout);

    joinerTimeout = setTimeout(()=>{
        if(window.TGRenderer?.appendJoinSticker){
            window.TGRenderer.appendJoinSticker(pendingJoiners);

            const container = document.getElementById('tg-comments-container');
            if(container){
                container.scrollTo({ top: container.scrollHeight, behavior:'smooth' });
            }
        }
        pendingJoiners=[];
    },1200);
}

/* =====================================================
   INTERACTION QUEUE
===================================================== */
const interactionQueue=[];
let processingQueue=false;

function enqueueInteraction(interaction){
    if(!interaction||!interaction.persona||!interaction.text) return;
    interactionQueue.push(interaction);
    processQueue();
}

async function processQueue(){
    if(processingQueue||interactionQueue.length===0) return;
    processingQueue=true;

    while(interactionQueue.length>0){
        const inter=interactionQueue.shift();
        const {persona,text,parentText,parentId,meta}=inter;
        if(!persona||!text) continue;

        // HEADER TYPING
        if(persona?.name){
            document.dispatchEvent(new CustomEvent("headerTyping",{detail:{name:persona.name}}));
            const duration = window.TGRenderer?.calculateTypingDuration?.(text)||1200;
            setTimeout(()=>document.dispatchEvent(new CustomEvent("headerTypingStop",{detail:{name:persona.name}})),duration);
        }

        const typingDuration = window.TGRenderer?.calculateTypingDuration?.(text)||1200;
        await new Promise(r=>setTimeout(r,typingDuration+200));

        const opts={};
        if(parentText||parentId){ opts.replyToId=parentId; opts.replyToText=parentText; }
        if(meta){
            if(meta.reaction) opts.reactions=[{emoji:meta.reaction,count:Math.floor(Math.random()*4)+1}];
            if(meta.pill) opts.pill=meta.pill;
            if(meta.jumper) opts.jumper=meta.jumper;
            if(meta.sticker) opts.sticker=meta.sticker;
        }

        if(window.TGRenderer?.appendMessage){
            const msgId=window.TGRenderer.appendMessage(persona,text,opts);
            inter._msgId=msgId;
        }
    }
    processingQueue=false;
}

/* =====================================================
   RANDOM REPLIES — 100 REAL, NATURAL PHRASES
===================================================== */
const REPLY_TEMPLATES = [
    "Yeah, that makes total sense 💯",
    "I was just thinking the same thing!",
    "Exactly! Couldn't have said it better.",
    "Great point — thanks for sharing.",
    "Interesting take, I never saw it that way.",
    "Facts 🔥",
    "This is the content I signed up for.",
    "Agreed 100%.",
    "You read my mind 😄",
    "Honestly, this is underrated.",
    "Can we talk more about this?",
    "I've been waiting for someone to say this.",
    "Respect 🙌",
    "This aged well.",
    "Big brain energy 🧠",
    "Preach!",
    "Straight to the point — love it.",
    "I feel seen.",
    "Took the words right out of my mouth.",
    "This deserves more attention.",
    "Finally someone said it.",
    "I'm taking notes 📝",
    "Common sense isn't so common anymore.",
    "Could you elaborate a bit more?",
    "That's a solid argument.",
    "I'm convinced.",
    "Let's not ignore this.",
    "This hits different.",
    "Unpopular opinion but I agree.",
    "Based.",
    "Actually, that's a great observation.",
    "I had the exact opposite view, but you made me reconsider.",
    "This is the way.",
    "Who else thinks this is spot on?",
    "Thanks for the insight!",
    "I'm saving this comment.",
    "Why isn't this trending?",
    "Perfectly summarized.",
    "You dropped this 👑",
    "I've experienced the same thing.",
    "Real talk.",
    "I appreciate the nuance here.",
    "This is why I love this community.",
    "No lies detected.",
    "Straight facts.",
    "I'm here for this energy.",
    "Well articulated.",
    "This should be pinned.",
    "I'm sharing this with my friends.",
    "Classic example of wisdom.",
    "I needed to hear this today.",
    "You just changed my perspective.",
    "This is gold. Pure gold.",
    "Can't argue with that logic.",
    "Simple but profound.",
    "I've been saying this for years.",
    "Glad someone finally put it into words.",
    "This is the kind of content I pay for.",
    "Underrated comment right here.",
    "I'm screenshotting this.",
    "This deserves a standing ovation.",
    "You're absolutely right.",
    "I'm with you on this.",
    "Let's amplify this message.",
    "This is a masterpiece.",
    "I wish I could upvote twice.",
    "You've convinced me.",
    "I'm sharing this everywhere.",
    "This is the hill I'll die on.",
    "You've got a point there.",
    "I never thought of it that way.",
    "This is eye-opening.",
    "Thank you for saying this.",
    "I'm curious about your take on X as well.",
    "This is the discussion we needed.",
    "I'm saving this for future reference.",
    "You're spitting facts.",
    "This is the most sensible take I've seen.",
    "I'm nodding along.",
    "This is the real MVP comment.",
    "I wish more people thought like you.",
    "You've earned a follow.",
    "This is the kind of insight I come here for.",
    "I'm going to quote this later.",
    "You've summed it up perfectly.",
    "This is a breath of fresh air.",
    "I'm convinced you're right.",
    "This is the way.",
    "You've got my full support.",
    "This is a game-changer.",
    "I'm sharing this with my network.",
    "You've articulated what I couldn't.",
    "This is the comment of the year.",
    "I'm going to remember this.",
    "You've made my day.",
    "This is the most underrated comment.",
    "I'm coming back to this later.",
    "You've earned my respect.",
    "This is the content I live for.",
    "You're a legend for this.",
    "This is the best take I've seen.",
    "I'm sharing this with everyone I know.",
    "You've changed my mind completely."
];

function getRandomReply(){ return REPLY_TEMPLATES[Math.floor(Math.random()*REPLY_TEMPLATES.length)]; }

/* =====================================================
   REACTIONS
===================================================== */
function renderReactions(bubbleEntry,reactions){
    if(!bubbleEntry||!bubbleEntry.el) return;
    let pill=bubbleEntry.el.querySelector('.tg-bubble-reactions');
    if(pill) pill.remove();
    pill=document.createElement('div');
    pill.className='tg-bubble-reactions';
    reactions.forEach(r=>{
        const span=document.createElement('span');
        span.className='reaction';
        span.textContent=`${r.emoji} ${r.count}`;
        span.style.cursor='pointer';
        span.addEventListener('mouseenter',()=>span.style.backgroundColor='#eee');
        span.addEventListener('mouseleave',()=>span.style.backgroundColor='');
        span.addEventListener('click',()=>{ r.count+=1; span.textContent=`${r.emoji} ${r.count}`; });
        pill.appendChild(span);
    });
    bubbleEntry.el.querySelector('.tg-bubble-content')?.appendChild(pill);
}

function autoReactToMessage(message){
    if(!message||!window.TGRenderer) return;
    if(!message.reactions) message.reactions=[];
    if(Math.random()<0.25){
        const emojiPool=["🔥","💯","👍","💹","🚀","✨","👏"];
        message.reactions.push({ emoji:emojiPool[Math.floor(Math.random()*emojiPool.length)], count:Math.floor(Math.random()*5)+1 });
    }
    if(Math.random()<0.4&&window.identity){
        const crowdClicks=Math.floor(Math.random()*3)+1;
        for(let i=0;i<crowdClicks;i++){
            if(message.reactions.length===0) break;
            const r=message.reactions[Math.floor(Math.random()*message.reactions.length)];
            r.count+=1;
        }
    }
    const bubbleEntry=window.TGRenderer.MESSAGE_MAP?.get(message.id);
    renderReactions(bubbleEntry,message.reactions);
}

/* =====================================================
   JOINER REPLIES
===================================================== */
function simulateJoinerReply(joinerPersona){
    const text=getRandomReply();
    const randomComment=window.realismEngineV12Pool?.[Math.floor(Math.random()*window.realismEngineV12Pool.length)];
    enqueueInteraction({ persona:joinerPersona, text, parentText:randomComment?.text, parentId:randomComment?.id });
    autoReactToMessage(randomComment);
    queueJoiner(joinerPersona);
}

/* =====================================================
   PUBLIC API
===================================================== */
window.interactions={
    enqueue:enqueueInteraction,
    simulateReply:function(persona,parentMessage){
        const text=getRandomReply();
        enqueueInteraction({ persona,text,parentText:parentMessage?.text,parentId:parentMessage?.id });
        autoReactToMessage(parentMessage);
    },
    react:autoReactToMessage,
    joinReply:simulateJoinerReply
};

/* =====================================================
   AUTO SIMULATION LOOP
===================================================== */
function autoSimulate(){
    if(!window.realismEngineV12Pool||window.realismEngineV12Pool.length===0) return;
    const persona=window.identity?.getRandomPersona();
    if(!persona) return;
    const randomComment=window.realismEngineV12Pool[Math.floor(Math.random()*window.realismEngineV12Pool.length)];
    if(!randomComment) return;
    window.interactions.simulateReply(persona,randomComment);

    // batch joiners with shared queue
    if(Math.random()<0.15){
        const joinerCount=1+Math.floor(Math.random()*3);
        for(let i=0;i<joinerCount;i++){
            const joiner=window.identity?.getRandomPersona();
            if(joiner) window.interactions.joinReply(joiner);
        }
    }

    const nextInterval=800+Math.random()*2500;
    setTimeout(autoSimulate,nextInterval);
}

setTimeout(autoSimulate,1200);
console.log("✅ Interactions + Realism Engine unified v14.5 — 100 real replies, shared joiners queue, smooth scroll, batch joiners, reactions, header typing ready.");

})();
