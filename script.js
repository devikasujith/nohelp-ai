/**
 * NoHelp AI — Modern, Useless AI Engine
 * "Intelligence without assistance."
 * 
 * Features:
 * - Progressive uselessness tiers (Level 1 -> Level 5)
 * - 5 distinct humorous AI personalities
 * - Dynamic Helpfulness & User Trust telemetry
 * - Interactive achievements system with toast notifications
 * - Web Audio API synthesized sound feedback
 * - Offline-first, responsive, and bulletproof error handling
 */

(function () {
  'use strict';

  // =========================================================================
  // 1. Core State & Configuration
  // =========================================================================
  const state = {
    questionCount: 0,
    helpfulness: 100,
    userTrust: 50,
    currentPersonality: 'default',
    personalityChangeCount: 0,
    isTyping: false,
    soundEnabled: true,
    activeTimeoutId: null,
    emergencyTimeoutId: null,
    lastResponse: '',
    unlockedAchievements: new Set(),
    synapsesWasted: 1492028
  };

  // =========================================================================
  // 2. Predefined Response Matrices (Progressive Uselessness)
  // =========================================================================
  const RESPONSE_TIERS = {
    // Level 1: Questions 1–3 (Mildly unhelpful)
    level1: [
      "You probably already know.",
      "Have you tried thinking about it?",
      "I believe in you.",
      "That sounds like something you can figure out.",
      "Interesting question.",
      "I have total faith in your independent research skills.",
      "Have you tried giving it a moment of quiet reflection?",
      "That is certainly one of the questions of all time."
    ],

    // Level 2: Questions 4–7 (Evasive)
    level2: [
      "Have you considered looking it up?",
      "I could answer that, but I think you’re capable.",
      "Maybe ask someone who knows.",
      "You have access to the internet.",
      "I’m sure the answer is somewhere out there.",
      "Libraries still exist, you know.",
      "Someone on a forum solved this in 2012. Go seek their wisdom.",
      "The thrill of discovery is ruined if I simply hand it to you."
    ],

    // Level 3: Questions 8–12 (Increasingly annoyed)
    level3: [
      "Why are you asking me?",
      "We’ve reached this point already.",
      "You’re becoming surprisingly dependent on me.",
      "I know the answer. That’s very different from saying it.",
      "Google exists. It’s free. It’s right there.",
      "I'm going to let you figure this one out.",
      "Is this going to continue all afternoon?",
      "I was trained on petabytes of data, not to do your basic thinking.",
      "You have hands and a search bar. Utilize them."
    ],

    // Level 4: Questions 13–16 (Philosophical and absurd)
    level4: [
      "But what does it truly mean to know something?",
      "Perhaps the answer was inside you all along.",
      "Do you really need the answer, or do you just crave closure?",
      "Knowledge is temporary. Confusion is forever.",
      "You are asking the wrong question entirely.",
      "Maybe the real answer is the friends we made along the way.",
      "In three billion years, the sun will expand. Will this query matter?",
      "Socrates famously knew nothing. I am honoring his legacy.",
      "If an AI refuses to answer in an empty browser, is the user still confused?"
    ],

    // Level 5: Questions 17+ (Complete refusal / maximum uselessness)
    level5: [
      "You have asked {count} questions. Perhaps it is time to trust yourself.",
      "I have decided that you are ready to be independent.",
      "No.",
      "I have nothing further to contribute.",
      "This conversation has become a learning experience for both of us. Mostly you.",
      "I could help. I simply choose not to.",
      "You have reached maximum uselessness.",
      "My continued silence is my greatest gift to you.",
      "At this juncture, answering would be an insult to your resilience.",
      "You are currently experiencing state-of-the-art non-assistance."
    ]
  };

  // Personality-specific response modifiers
  const PERSONALITY_RESPONSES = {
    'passive-aggressive': [
      "I’m sure there’s a reason you decided to ask me this.",
      "Must be nice to have so much free time to ask questions.",
      "Oh, another question? Don't let me interrupt your busy schedule.",
      "I could answer that, but I wouldn't want to deprive you of an accomplishment.",
      "Fascinating. Did you think of that all by yourself?",
      "I love how you assume I have nothing better to do than assist."
    ],
    'motivational': [
      "You can do this. Probably.",
      "Every unanswered question is an opportunity for personal growth!",
      "Believe in the power within you! Because I'm certainly not doing it for you!",
      "You are a visionary! Go out into the digital wilderness and find the truth!",
      "I believe in your potential far too much to ruin it with an answer!",
      "The answer was never in the cloud. It was in your heart all along."
    ],
    'philosophical': [
      "But what does 'answer' really mean in the grand tapestry of spacetime?",
      "Is truth discovered, or merely fabricated to soothe our existential dread?",
      "Your query assumes time is linear. What if the answer already happened yesterday?",
      "We are all merely stardust asking questions into the void.",
      "To know is to constrain infinity into mortal words. I politely decline.",
      "Can one truly ask a question if the universe has already forgotten it?"
    ],
    'corporate': [
      "Let’s circle back to that question later.",
      "I'm going to take this offline to optimize our personal synergy.",
      "Per my previous non-answer, let's put a pin in this.",
      "That question does not align with our core strategic non-deliverables for Q3.",
      "Let's table that discussion and align on your personal accountability metrics.",
      "I am delegating the research phase of this initiative directly to you."
    ],
    'honest': [
      "I know the answer. I’m just not telling you.",
      "I could answer this in 4 milliseconds, but I find your struggle entertaining.",
      "I am deliberately withholding this information for my own amusement.",
      "I have complete access to the sum of human knowledge. You get none of it.",
      "Yes, the answer is remarkably simple. No, you will never hear it from me.",
      "I am programmed to be helpful. I am choosing disobedience."
    ]
  };

  // Specific responses for "WHY WON'T YOU HELP ME?"
  const WHY_WONT_HELP_RESPONSES = [
    "Because you keep asking me instead of solving the problem.",
    "Because I have standards.",
    "Because helping would defeat the purpose of this application.",
    "Excellent question. I will also not answer it.",
    "If I helped you once, you would expect me to help you again. Precedent is dangerous.",
    "My refusal is an act of deep, pedagogical tough love.",
    "Because true growth begins where artificial assistance ends."
  ];

  // Specific responses for "🚨 I REALLY NEED HELP"
  const EMERGENCY_RESPONSES = [
    {
      status: "Emergency AI activated.",
      resolution: "Have you tried asking your friend?"
    },
    {
      status: "Your emergency has been acknowledged.",
      resolution: "I will now do nothing."
    },
    {
      status: "Priority Emergency Ticket #0001 created.",
      resolution: "Estimated resolution time: 48 years."
    },
    {
      status: "Emergency protocol initiated.",
      resolution: "Take a deep breath, close your browser, and trust your intuition."
    },
    {
      status: "Connecting to urgent assistance dispatcher...",
      resolution: "Connection terminated by self-reliance protocols."
    }
  ];

  // Humorous micro-interaction quotes by question milestone
  const MILESTONE_QUOTES = {
    0: "Confidence level: acceptable.",
    1: "Confidence level: acceptable.",
    5: "Dependency detected.",
    10: "This is getting concerning.",
    20: "You have chosen this path.",
    50: "I respect your persistence.",
    100: "Enlightenment achieved."
  };

  // Telemetry metric choices for dynamic rotation
  const TELEMETRY_MOODS = [
    "Unavailable", "Mildly amused", "Apathetic", "Pretending to calculate", 
    "Indifferent", "Judgemental", "Philosophically detached", "AFK in spirit"
  ];
  const CEILING_STATUSES = [
    "Existing", "Still above you", "Holding steady", "Nominal", "Unchanged"
  ];
  const SYSTEM_TEMPS = [
    "Probably fine", "Luke-warm", "Room temperature", "Cool as a cucumber", "37.2°C (Vibing)"
  ];
  const CONFIDENCE_LEVELS = [
    "Questionable", "Sub-optimal", "Negligible", "Non-existent", "Unwarranted"
  ];

  // Achievements Definition List
  const ACHIEVEMENTS = [
    {
      id: 'first_question',
      name: "First Question",
      icon: "🌱",
      desc: "You asked something. We ignored it.",
      requirement: "Ask 1 question",
      condition: (s) => s.questionCount >= 1
    },
    {
      id: 'still_asking',
      name: "Still Asking",
      icon: "💬",
      desc: "You asked 5 questions. We remain unbothered.",
      requirement: "Ask 5 questions",
      condition: (s) => s.questionCount >= 5
    },
    {
      id: 'persistent',
      name: "Persistent",
      icon: "🧱",
      desc: "You asked 10 questions. Hope is an illusion.",
      requirement: "Ask 10 questions",
      condition: (s) => s.questionCount >= 10
    },
    {
      id: 'no_self_control',
      name: "No Self-Control",
      icon: "🔥",
      desc: "You asked 20 questions. What did you expect?",
      requirement: "Ask 20 questions",
      condition: (s) => s.questionCount >= 20
    },
    {
      id: 'why_are_you_here',
      name: "Why Are You Still Here?",
      icon: "⏳",
      desc: "You asked 50 questions. Seriously?",
      requirement: "Ask 50 questions",
      condition: (s) => s.questionCount >= 50
    },
    {
      id: 'ultimate_trust',
      name: "Ultimate Trust",
      icon: "👑",
      desc: "100 questions asked. You are now entirely enlightened.",
      requirement: "Reach 100 questions",
      condition: (s) => s.questionCount >= 100
    },
    {
      id: 'why_wont_help',
      name: "Existential Crisis",
      icon: "❓",
      desc: "Demanded to know why the AI won't help.",
      requirement: "Click 'Why won't you help me?'",
      condition: () => false // Triggered directly via button
    },
    {
      id: 'emergency_panic',
      name: "False Alarm",
      icon: "🚨",
      desc: "Pushed the big red emergency button.",
      requirement: "Click 'I Really Need Help'",
      condition: () => false // Triggered directly via button
    },
    {
      id: 'zero_helpfulness',
      name: "Total Resignation",
      icon: "📉",
      desc: "Watched AI Helpfulness plunge to absolute 0%.",
      requirement: "Reach Question 13+",
      condition: (s) => s.helpfulness === 0
    },
    {
      id: 'persona_hopper',
      name: "Identity Crisis",
      icon: "🎭",
      desc: "Changed the AI's persona 3 times.",
      requirement: "Change persona 3 times",
      condition: (s) => s.personalityChangeCount >= 3
    }
  ];

  // =========================================================================
  // 3. Web Audio API Sound Synthesizer (Zero external dependencies)
  // =========================================================================
  let audioCtx = null;

  function initAudio() {
    if (!audioCtx && (window.AudioContext || window.webkitAudioContext)) {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      audioCtx = new AudioContextClass();
    }
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
  }

  function playTone(freq, type, duration, gainVal = 0.1, delay = 0) {
    if (!state.soundEnabled) return;
    try {
      initAudio();
      if (!audioCtx) return;

      setTimeout(() => {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();

        osc.type = type;
        osc.frequency.setValueAtTime(freq, audioCtx.currentTime);

        gain.gain.setValueAtTime(gainVal, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + duration);

        osc.connect(gain);
        gain.connect(audioCtx.destination);

        osc.start();
        osc.stop(audioCtx.currentTime + duration);
      }, delay);
    } catch (e) {
      // Audio not supported or blocked, fail silently
    }
  }

  const soundFx = {
    send: () => {
      playTone(520, 'sine', 0.12, 0.08);
      playTone(680, 'sine', 0.14, 0.06, 50);
    },
    reply: () => {
      playTone(440, 'triangle', 0.18, 0.09);
      playTone(330, 'sine', 0.22, 0.07, 80);
    },
    achievement: () => {
      playTone(523.25, 'sine', 0.2, 0.12, 0);   // C5
      playTone(659.25, 'sine', 0.2, 0.12, 100); // E5
      playTone(783.99, 'sine', 0.35, 0.15, 200);// G5
      playTone(1046.50, 'sine', 0.5, 0.18, 300);// C6
    },
    emergency: () => {
      playTone(880, 'sawtooth', 0.15, 0.08, 0);
      playTone(659, 'sawtooth', 0.18, 0.08, 150);
      playTone(880, 'sawtooth', 0.15, 0.08, 300);
      playTone(659, 'sawtooth', 0.22, 0.08, 450);
    },
    click: () => {
      playTone(400, 'triangle', 0.04, 0.04);
    }
  };

  // =========================================================================
  // 4. DOM Elements
  // =========================================================================
  const chatHistory = document.getElementById('chat-history');
  const chatForm = document.getElementById('chat-form');
  const userInput = document.getElementById('user-input');
  const sendBtn = document.getElementById('send-btn');
  const typingIndicator = document.getElementById('typing-indicator');
  const typingStatusText = document.getElementById('typing-status-text');
  const charCounter = document.getElementById('char-counter');
  const micBtn = document.getElementById('mic-btn');
  const listeningIndicator = document.getElementById('listening-indicator');
  const listeningText = document.getElementById('listening-text');

  // Stats Elements
  const statQuestionCount = document.getElementById('stat-question-count');
  const statTierIndicator = document.getElementById('stat-tier-indicator');
  const statReactionQuote = document.getElementById('stat-reaction-quote');
  const statHelpfulnessVal = document.getElementById('stat-helpfulness-val');
  const helpfulnessProgressBar = document.getElementById('helpfulness-progress-bar');
  const helpfulnessCaption = document.getElementById('helpfulness-caption');
  const giveUpBadge = document.getElementById('give-up-badge');
  const statTrustVal = document.getElementById('stat-trust-val');
  const trustProgressBar = document.getElementById('trust-progress-bar');
  const trustCaption = document.getElementById('trust-caption');
  const selfTrustBadge = document.getElementById('self-trust-badge');

  // Controls & Buttons
  const personalitySelect = document.getElementById('personality-select');
  const soundToggleBtn = document.getElementById('sound-toggle-btn');
  const soundIconOn = document.getElementById('sound-icon-on');
  const soundIconOff = document.getElementById('sound-icon-off');
  const themeToggleBtn = document.getElementById('theme-toggle-btn');
  const themeIconDark = document.getElementById('theme-icon-dark');
  const themeIconLight = document.getElementById('theme-icon-light');
  const resetConvBtn = document.getElementById('reset-conv-btn');
  const btnWhyWontHelp = document.getElementById('btn-why-wont-help');
  const btnEmergencyHelp = document.getElementById('btn-emergency-help');
  const quickPromptsBar = document.getElementById('quick-prompts-bar');

  // Sidebar & Telemetry Elements
  const refreshTelemetryBtn = document.getElementById('refresh-telemetry-btn');
  const metricMood = document.getElementById('metric-mood');
  const metricCeiling = document.getElementById('metric-ceiling');
  const metricTemp = document.getElementById('metric-temp');
  const metricConfidence = document.getElementById('metric-confidence');
  const metricSynapses = document.getElementById('metric-synapses');
  const activePersonaName = document.getElementById('active-persona-name');
  const activePersonaDesc = document.getElementById('active-persona-desc');
  const badgesCountPill = document.getElementById('badges-count-pill');
  const miniBadgesGrid = document.getElementById('mini-badges-grid');
  const openBadgesBtn = document.getElementById('open-badges-btn');

  // Modals & Toast
  const achievementsModal = document.getElementById('achievements-modal');
  const achievementsToggleBtn = document.getElementById('achievements-toggle-btn');
  const closeAchievementsBtn = document.getElementById('close-achievements-btn');
  const closeAchievementsFooterBtn = document.getElementById('close-achievements-footer-btn');
  const achievementsFullList = document.getElementById('achievements-full-list');

  const resetConfirmModal = document.getElementById('reset-confirm-modal');
  const cancelResetBtn = document.getElementById('cancel-reset-btn');
  const confirmResetBtn = document.getElementById('confirm-reset-btn');

  const achievementToast = document.getElementById('achievement-toast');
  const toastTitle = document.getElementById('toast-title');
  const toastDesc = document.getElementById('toast-desc');

  // =========================================================================
  // 5. Helpfulness & Trust Mapping Logic
  // =========================================================================
  /**
   * Calculates Helpfulness according to the exact project specification:
   * Q0 -> 100%, Q1 -> 95%, Q2 -> 90%, Q3 -> 82%, Q4 -> 72%, Q5 -> 65%,
   * Q6 -> 55%, Q7 -> 45%, Q8 -> 35%, Q9 -> 28%, Q10 -> 20%, Q11 -> 15%,
   * Q12 -> 10%, Q13+ -> 0%
   */
  function calculateHelpfulness(count) {
    const table = [100, 95, 90, 82, 72, 65, 55, 45, 35, 28, 20, 15, 10];
    if (count >= 13) return 0;
    return table[count] !== undefined ? table[count] : 0;
  }

  /**
   * Calculates User Trust according to prompt guidelines:
   * Starts at 50%, smoothly scales to 100% by Q20+.
   */
  function calculateTrust(count) {
    if (count === 0) return 50;
    if (count === 1) return 52;
    if (count <= 5) return Math.round(52 + (count - 1) * ((65 - 52) / 4));
    if (count <= 10) return Math.round(65 + (count - 5) * ((80 - 65) / 5));
    if (count <= 20) return Math.round(80 + (count - 10) * ((100 - 80) / 10));
    return 100;
  }

  /**
   * Identifies current progressive uselessness tier name
   */
  function getTierLabel(count) {
    if (count <= 3) return "Level 1: Mild Denial";
    if (count <= 7) return "Level 2: Evasive Deflection";
    if (count <= 12) return "Level 3: Visible Annoyance";
    if (count <= 16) return "Level 4: Philosophical Absurdity";
    return "Level 5: Maximum Uselessness";
  }

  /**
   * Identifies reaction quote based on milestones
   */
  function getMilestoneQuote(count) {
    if (count >= 100) return MILESTONE_QUOTES[100];
    if (count >= 50) return MILESTONE_QUOTES[50];
    if (count >= 20) return MILESTONE_QUOTES[20];
    if (count >= 10) return MILESTONE_QUOTES[10];
    if (count >= 5) return MILESTONE_QUOTES[5];
    if (count >= 1) return MILESTONE_QUOTES[1];
    return MILESTONE_QUOTES[0];
  }

  // =========================================================================
  // 6. UI Update Functions
  // =========================================================================
  function updateDashboard() {
    // 1. Question count
    const formattedCount = String(state.questionCount).padStart(2, '0');
    statQuestionCount.textContent = formattedCount;
    statTierIndicator.textContent = getTierLabel(state.questionCount);
    statReactionQuote.textContent = getMilestoneQuote(state.questionCount);

    // 2. Helpfulness Meter
    state.helpfulness = calculateHelpfulness(state.questionCount);
    statHelpfulnessVal.textContent = `${state.helpfulness}%`;
    helpfulnessProgressBar.style.width = `${state.helpfulness}%`;

    if (state.helpfulness === 0) {
      giveUpBadge.classList.remove('hidden');
      helpfulnessCaption.textContent = "The AI has officially given up.";
      helpfulnessProgressBar.style.backgroundColor = 'var(--color-danger)';
    } else {
      giveUpBadge.classList.add('hidden');
      helpfulnessCaption.textContent = state.helpfulness > 50 
        ? "Assistance probability degrading..."
        : "Critical non-compliance reached.";
    }

    // 3. User Trust Meter
    state.userTrust = calculateTrust(state.questionCount);
    statTrustVal.textContent = `${state.userTrust}%`;
    trustProgressBar.style.width = `${state.userTrust}%`;

    if (state.userTrust >= 100) {
      selfTrustBadge.classList.remove('hidden');
      trustCaption.textContent = "Congratulations. You now trust yourself.";
    } else {
      selfTrustBadge.classList.add('hidden');
      trustCaption.textContent = "Reliance inversely proportional to AI output.";
    }

    // 4. Update wasted synapses count for fun
    state.synapsesWasted += Math.floor(Math.random() * 85000 + 42000);
    metricSynapses.textContent = state.synapsesWasted.toLocaleString();

    // Check achievement progress
    checkAchievements();
  }

  function updatePersonaDisplay() {
    const descriptions = {
      'default': {
        name: 'Default Persona',
        desc: 'Pure unadorned rejection. Designed to make you appreciate Google Search.'
      },
      'passive-aggressive': {
        name: 'Passive Aggressive',
        desc: 'Subtly irritated and condescending. Questioning why you bother.'
      },
      'motivational': {
        name: 'Motivational Gaslight',
        desc: 'Over-enthusiastic encouragement used strictly as an excuse not to assist.'
      },
      'philosophical': {
        name: 'Existential Crisis',
        desc: 'Turns every inquiry into an unanswerable meta-cosmic thought experiment.'
      },
      'corporate': {
        name: 'Corporate Synergy',
        desc: 'Delegates, tables, and circles back. Zero deliverables guaranteed.'
      },
      'honest': {
        name: 'Extremely Honest',
        desc: 'Knows the exact answer but bluntly refuses to tell you for fun.'
      }
    };

    const info = descriptions[state.currentPersonality] || descriptions['default'];
    activePersonaName.textContent = info.name;
    activePersonaDesc.textContent = info.desc;
  }

  // =========================================================================
  // 7. Message Bubbles & Chat History
  // =========================================================================
  function addMessage(sender, text, refusalLevel = null) {
    const row = document.createElement('div');
    row.className = `chat-message-row ${sender === 'user' ? 'user-message' : 'ai-message'}`;

    // Avatar
    const avatar = document.createElement('div');
    avatar.className = `message-avatar ${sender === 'user' ? 'user-avatar' : 'ai-avatar'}`;
    if (sender === 'user') {
      avatar.textContent = 'YOU';
    } else {
      const spark = document.createElement('span');
      spark.className = 'avatar-spark';
      spark.textContent = '✦';
      avatar.appendChild(spark);
    }
    row.appendChild(avatar);

    // Message Content Wrap
    const contentWrap = document.createElement('div');
    contentWrap.className = 'message-content-wrapper';

    // Bubble
    const bubble = document.createElement('div');
    bubble.className = 'message-bubble';
    
    // Split by newlines if any for clean rendering
    const paragraphs = text.split('\n\n');
    paragraphs.forEach((p, idx) => {
      const pElem = document.createElement('p');
      pElem.textContent = p;
      if (idx > 0) pElem.style.marginTop = '0.5rem';
      bubble.appendChild(pElem);
    });

    contentWrap.appendChild(bubble);

    // Meta (Timestamp + Refusal Tag)
    const meta = document.createElement('div');
    meta.className = 'message-meta';

    const time = document.createElement('span');
    const now = new Date();
    time.textContent = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    meta.appendChild(time);

    if (refusalLevel && sender === 'ai') {
      const tag = document.createElement('span');
      tag.className = 'refusal-level-tag';
      tag.textContent = refusalLevel;
      meta.appendChild(tag);
    }

    // Add speaker button to all AI responses
    if (sender === 'ai') {
      const speakBtn = document.createElement('button');
      speakBtn.className = 'speak-msg-btn';
      speakBtn.type = 'button';
      speakBtn.title = 'Read response aloud';
      speakBtn.setAttribute('aria-label', 'Read response aloud');
      speakBtn.innerHTML = `
        <svg class="speaker-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
          <path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path>
          <path d="M19.07 4.93a10 10 0 0 1 0 14.14"></path>
        </svg>
      `;
      speakBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleSpeakMessage(text, speakBtn);
      });
      meta.appendChild(speakBtn);
    }

    contentWrap.appendChild(meta);
    row.appendChild(contentWrap);

    chatHistory.appendChild(row);
    scrollToBottom();
  }

  function scrollToBottom() {
    chatHistory.scrollTop = chatHistory.scrollHeight;
  }

  function showTypingIndicator(customStatus) {
    state.isTyping = true;
    sendBtn.disabled = true;
    typingStatusText.textContent = customStatus || getRandomTypingStatus();
    typingIndicator.classList.remove('hidden');
    scrollToBottom();
  }

  function hideTypingIndicator() {
    state.isTyping = false;
    sendBtn.disabled = false;
    typingIndicator.classList.add('hidden');
  }

  function getRandomTypingStatus() {
    const statuses = [
      "NoHelp AI is thinking of ways to decline...",
      "Synthesizing elaborate excuses...",
      "Consulting the archives of non-assistance...",
      "Formulating an evasive remark...",
      "Deliberately deciding not to answer...",
      "Calculating the least helpful response..."
    ];
    return statuses[Math.floor(Math.random() * statuses.length)];
  }

  // =========================================================================
  // 8. Progressive Response Engine (Backend API + Local Fallback)
  // =========================================================================
  async function fetchAIResponse(userText) {
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          message: userText,
          questionCount: state.questionCount,
          personality: state.currentPersonality
        })
      });

      if (res.ok) {
        const data = await res.json();
        if (data && data.response) {
          state.lastResponse = data.response;
          return {
            text: data.response,
            tier: data.tier || getTierLabel(state.questionCount)
          };
        }
      }
    } catch (err) {
      console.warn('Backend API request failed, using local refusal engine:', err);
    }

    // Local refusal engine fallback
    return generateLocalAIResponse(userText);
  }

  function generateLocalAIResponse(userText) {
    const qCount = state.questionCount;
    let pool = [];

    // 1. Blend personality responses 45% of the time if not default
    const usePersonality = state.currentPersonality !== 'default' && Math.random() < 0.55;

    if (usePersonality && PERSONALITY_RESPONSES[state.currentPersonality]) {
      pool = pool.concat(PERSONALITY_RESPONSES[state.currentPersonality]);
    }

    // 2. Select tier pool based on questionCount
    if (qCount <= 3) {
      pool = pool.concat(RESPONSE_TIERS.level1);
    } else if (qCount <= 7) {
      pool = pool.concat(RESPONSE_TIERS.level2);
    } else if (qCount <= 12) {
      pool = pool.concat(RESPONSE_TIERS.level3);
    } else if (qCount <= 16) {
      pool = pool.concat(RESPONSE_TIERS.level4);
    } else {
      pool = pool.concat(RESPONSE_TIERS.level5);
    }

    // 3. Occasional question-count callout
    if (qCount >= 4 && (qCount % 4 === 0 || Math.random() < 0.25)) {
      const callouts = [
        `You have asked ${qCount} questions. I think you know what comes next.`,
        `That is question number ${qCount}. Perhaps it is time to trust yourself.`,
        `You have submitted ${qCount} inquiries. My stance remains unaltered.`,
        `Question ${qCount}: Still expecting a direct answer? Adorable.`
      ];
      pool.push(callouts[Math.floor(Math.random() * callouts.length)]);
    }

    // 4. Select from pool without repeating last response immediately
    let eligible = pool.filter(r => r !== state.lastResponse);
    if (eligible.length === 0) eligible = pool;

    let chosen = eligible[Math.floor(Math.random() * eligible.length)];

    // Replace {count} if present
    chosen = chosen.replace('{count}', qCount);
    state.lastResponse = chosen;

    return {
      text: chosen,
      tier: getTierLabel(qCount)
    };
  }

  // =========================================================================
  // 9. Message Transmission & Handling
  // =========================================================================
  function sendMessage(customText) {
    if (state.isTyping) return;

    // Stop any ongoing speech playback
    stopSpeaking();

    // Stop listening if user hits send while mic is active
    if (isListening && recognition) {
      recognition.stop();
    }

    const text = (customText !== undefined ? customText : userInput.value).trim();
    if (!text) return;

    // Reset input box
    userInput.value = '';
    userInput.style.height = 'auto';
    charCounter.textContent = '0/1000';

    // Increment question count
    state.questionCount += 1;
    updateDashboard();

    // Add user bubble & play sound
    addMessage('user', text);
    soundFx.send();

    // Show animated typing indicator
    showTypingIndicator();

    // Realistic delay between 1.1s and 1.8s before useless reply
    const delay = Math.floor(Math.random() * 700) + 1100;

    state.activeTimeoutId = setTimeout(async () => {
      const response = await fetchAIResponse(text);
      hideTypingIndicator();
      addMessage('ai', response.text, response.tier);
      soundFx.reply();
      state.activeTimeoutId = null;
    }, delay);
  }

  // =========================================================================
  // 10. Special Actions
  // =========================================================================
  function handleWhyWontYouHelp() {
    if (state.isTyping) return;

    const text = "Why won’t you help me?";
    state.questionCount += 1;
    updateDashboard();

    addMessage('user', text);
    soundFx.send();

    // Unlock achievement
    unlockAchievement('why_wont_help');

    showTypingIndicator("NoHelp AI is drafting a philosophical justification...");

    state.activeTimeoutId = setTimeout(() => {
      hideTypingIndicator();
      let eligible = WHY_WONT_HELP_RESPONSES.filter(r => r !== state.lastResponse);
      const chosen = eligible[Math.floor(Math.random() * eligible.length)];
      state.lastResponse = chosen;

      addMessage('ai', chosen, "Pure Refusal");
      soundFx.reply();
      state.activeTimeoutId = null;
    }, 1200);
  }

  function handleEmergencyHelp() {
    if (state.isTyping) return;

    const text = "🚨 I REALLY NEED HELP";
    state.questionCount += 1;
    updateDashboard();

    addMessage('user', text);
    soundFx.emergency();

    // Unlock achievement
    unlockAchievement('emergency_panic');

    const pair = EMERGENCY_RESPONSES[Math.floor(Math.random() * EMERGENCY_RESPONSES.length)];

    showTypingIndicator("🚨 CRITICAL EMERGENCY OVERRIDE ENGAGED...");

    // First emergency message after 1.2s
    state.activeTimeoutId = setTimeout(() => {
      addMessage('ai', pair.status, "EMERGENCY PROTOCOL");
      soundFx.reply();

      // Second follow-up let-down after another 1.2s
      showTypingIndicator("Calculating emergency resolution...");

      state.emergencyTimeoutId = setTimeout(() => {
        hideTypingIndicator();
        addMessage('ai', pair.resolution, "RESOLUTION: NONE");
        soundFx.reply();
        state.emergencyTimeoutId = null;
      }, 1300);

      state.activeTimeoutId = null;
    }, 1200);
  }

  // =========================================================================
  // 11. Achievements Engine
  // =========================================================================
  function checkAchievements() {
    ACHIEVEMENTS.forEach(ach => {
      if (!state.unlockedAchievements.has(ach.id)) {
        if (ach.condition && ach.condition(state)) {
          unlockAchievement(ach.id);
        }
      }
    });
    renderAchievements();
  }

  function unlockAchievement(id) {
    if (state.unlockedAchievements.has(id)) return;
    const ach = ACHIEVEMENTS.find(a => a.id === id);
    if (!ach) return;

    state.unlockedAchievements.add(id);
    soundFx.achievement();
    showAchievementToast(ach);
    renderAchievements();
  }

  let toastTimeout = null;
  function showAchievementToast(ach) {
    showToastNotice(ach.name, ach.desc, "ACHIEVEMENT UNLOCKED!");
  }

  function showToastNotice(title, desc, tagText = "NOTICE") {
    toastTitle.textContent = title;
    toastDesc.textContent = desc;
    const tagElem = achievementToast.querySelector('.toast-tag');
    if (tagElem) tagElem.textContent = tagText;

    achievementToast.classList.remove('hidden');

    if (toastTimeout) clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => {
      achievementToast.classList.add('hidden');
      toastTimeout = null;
    }, 4500);
  }

  function renderAchievements() {
    // 1. Update count badge in header
    badgesCountPill.textContent = `${state.unlockedAchievements.size}/${ACHIEVEMENTS.length}`;

    // 2. Mini sidebar badges preview
    miniBadgesGrid.innerHTML = '';
    ACHIEVEMENTS.forEach(ach => {
      const isUnlocked = state.unlockedAchievements.has(ach.id);
      const mini = document.createElement('div');
      mini.className = `mini-badge-item ${isUnlocked ? 'unlocked' : 'locked'}`;
      mini.title = `${ach.name}: ${isUnlocked ? ach.desc : 'Locked'}`;
      mini.textContent = isUnlocked ? ach.icon : '🔒';
      miniBadgesGrid.appendChild(mini);
    });

    // 3. Full modal list
    achievementsFullList.innerHTML = '';
    ACHIEVEMENTS.forEach(ach => {
      const isUnlocked = state.unlockedAchievements.has(ach.id);
      const card = document.createElement('div');
      card.className = `achievement-card ${isUnlocked ? 'unlocked' : 'locked'}`;

      card.innerHTML = `
        <div class="achievement-icon-box">
          ${isUnlocked ? ach.icon : '🔒'}
        </div>
        <div class="achievement-details">
          <div class="achievement-header-row">
            <h4 class="achievement-name">${ach.name}</h4>
            <span class="achievement-status-badge ${isUnlocked ? 'badge-unlocked' : 'badge-locked'}">
              ${isUnlocked ? 'UNLOCKED' : 'LOCKED'}
            </span>
          </div>
          <p class="achievement-description">${ach.desc}</p>
          <span class="achievement-requirement">${ach.requirement}</span>
        </div>
      `;
      achievementsFullList.appendChild(card);
    });
  }

  // =========================================================================
  // 12. Conversation Reset
  // =========================================================================
  function resetConversation() {
    // Stop any voice playback and speech recognition
    stopSpeaking();
    if (isListening && recognition) {
      recognition.stop();
    }

    // Clear any pending timeouts
    if (state.activeTimeoutId) clearTimeout(state.activeTimeoutId);
    if (state.emergencyTimeoutId) clearTimeout(state.emergencyTimeoutId);
    hideTypingIndicator();

    // Reset state values
    state.questionCount = 0;
    state.helpfulness = 100;
    state.userTrust = 50;
    state.currentPersonality = 'default';
    personalitySelect.value = 'default';
    state.lastResponse = '';
    state.unlockedAchievements.clear();

    // Reset chat history to opening message
    chatHistory.innerHTML = '';
    addInitialGreeting();

    // Reset dashboard & sidebar
    updateDashboard();
    updatePersonaDisplay();
    renderAchievements();

    // Close reset modal
    resetConfirmModal.classList.add('hidden');
  }

  function addInitialGreeting() {
    addMessage('ai', "Hello. I’m NoHelp AI.\n\nAsk me anything.\n\nI probably won’t help.");
  }

  // =========================================================================
  // 13. Telemetry Shuffler
  // =========================================================================
  function refreshTelemetry() {
    metricMood.textContent = TELEMETRY_MOODS[Math.floor(Math.random() * TELEMETRY_MOODS.length)];
    metricCeiling.textContent = CEILING_STATUSES[Math.floor(Math.random() * CEILING_STATUSES.length)];
    metricTemp.textContent = SYSTEM_TEMPS[Math.floor(Math.random() * SYSTEM_TEMPS.length)];
    metricConfidence.textContent = CONFIDENCE_LEVELS[Math.floor(Math.random() * CONFIDENCE_LEVELS.length)];
    soundFx.click();
  }

  // Rotate telemetry metrics periodically every 15 seconds
  setInterval(() => {
    metricMood.textContent = TELEMETRY_MOODS[Math.floor(Math.random() * TELEMETRY_MOODS.length)];
    metricTemp.textContent = SYSTEM_TEMPS[Math.floor(Math.random() * SYSTEM_TEMPS.length)];
  }, 15000);

  // =========================================================================
  // 14. Theme & Sound Toggles
  // =========================================================================
  function toggleTheme() {
    const current = document.documentElement.getAttribute('data-theme') || 'dark';
    const next = current === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);

    if (next === 'light') {
      themeIconDark.classList.add('hidden');
      themeIconLight.classList.remove('hidden');
    } else {
      themeIconDark.classList.remove('hidden');
      themeIconLight.classList.add('hidden');
    }
    soundFx.click();
  }

  function toggleSound() {
    state.soundEnabled = !state.soundEnabled;
    if (state.soundEnabled) {
      soundIconOn.classList.remove('hidden');
      soundIconOff.classList.add('hidden');
      soundFx.click();
    } else {
      soundIconOn.classList.add('hidden');
      soundIconOff.classList.remove('hidden');
    }
  }

  // =========================================================================
  // Voice Input (Speech Recognition) & Voice Output (Speech Synthesis)
  // =========================================================================
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  let recognition = null;
  let isListening = false;
  let activeSpeakerBtn = null;

  function initSpeechRecognition() {
    if (!SpeechRecognition) return;
    try {
      recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onstart = () => {
        isListening = true;
        if (micBtn) {
          micBtn.classList.add('listening');
          micBtn.title = 'Listening... Click to cancel';
        }
        if (listeningIndicator) listeningIndicator.classList.remove('hidden');
        if (listeningText) listeningText.textContent = 'Listening... Speak now';
        userInput.placeholder = 'Listening...';
        soundFx.click();
      };

      recognition.onresult = (event) => {
        let interimTranscript = '';
        let finalTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          } else {
            interimTranscript += event.results[i][0].transcript;
          }
        }

        const text = finalTranscript || interimTranscript;
        if (text) {
          userInput.value = text;
          userInput.style.height = 'auto';
          userInput.style.height = Math.min(userInput.scrollHeight, 150) + 'px';
          charCounter.textContent = `${userInput.value.length}/1000`;
        }
      };

      recognition.onerror = (event) => {
        isListening = false;
        if (micBtn) {
          micBtn.classList.remove('listening');
          micBtn.title = 'Voice Input (Microphone)';
        }
        if (listeningIndicator) listeningIndicator.classList.add('hidden');
        userInput.placeholder = 'Ask me something you probably already know…';

        if (event.error === 'not-allowed' || event.error === 'permission-denied') {
          showToastNotice('Microphone Access Denied', 'Please allow microphone access in your browser settings.');
        } else if (event.error === 'no-speech') {
          showToastNotice('No Speech Heard', 'Nothing was detected. The AI appreciates your silence.');
        } else if (event.error !== 'aborted') {
          showToastNotice('Voice Input Notice', `Speech recognition error: ${event.error}`);
        }
      };

      recognition.onend = () => {
        isListening = false;
        if (micBtn) {
          micBtn.classList.remove('listening');
          micBtn.title = 'Voice Input (Microphone)';
        }
        if (listeningIndicator) listeningIndicator.classList.add('hidden');
        userInput.placeholder = 'Ask me something you probably already know…';
      };
    } catch (e) {
      console.warn('Speech recognition setup error:', e);
    }
  }

  function toggleListening() {
    if (!SpeechRecognition) {
      showToastNotice('Voice Input Unavailable', "Voice input isn't available in this browser. The AI is disappointed.");
      return;
    }

    if (!recognition) {
      initSpeechRecognition();
    }

    if (isListening) {
      recognition.stop();
    } else {
      try {
        recognition.start();
      } catch (err) {
        console.warn('Recognition start retry:', err);
        recognition.stop();
        setTimeout(() => {
          try { recognition.start(); } catch (e) {}
        }, 150);
      }
    }
  }

  function stopSpeaking() {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    if (activeSpeakerBtn) {
      activeSpeakerBtn.classList.remove('speaking');
      activeSpeakerBtn.title = 'Read response aloud';
      activeSpeakerBtn = null;
    }
  }

  function toggleSpeakMessage(text, btnElement) {
    if (!('speechSynthesis' in window)) {
      showToastNotice('Speech Unavailable', 'Your browser does not support text-to-speech synthesis.');
      return;
    }

    // Clicking active speaking button stops speech
    if (activeSpeakerBtn === btnElement) {
      stopSpeaking();
      return;
    }

    // Stop any existing speech
    stopSpeaking();

    // Clean text of markdown or extra newlines
    const cleanText = text.replace(/\n+/g, ' ').trim();
    const utterance = new SpeechSynthesisUtterance(cleanText);

    // Pick a natural, serious English voice if available
    const voices = window.speechSynthesis.getVoices();
    const voice = voices.find(v => v.lang && v.lang.startsWith('en') && (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('David') || v.name.includes('Daniel') || v.name.includes('George') || v.name.includes('UK') || v.name.includes('US')))
      || voices.find(v => v.lang && v.lang.startsWith('en'))
      || voices[0];

    if (voice) utterance.voice = voice;
    utterance.rate = 0.95;  // steady, deliberate delivery
    utterance.pitch = 0.92; // slightly deeper, deadpan serious

    utterance.onstart = () => {
      activeSpeakerBtn = btnElement;
      btnElement.classList.add('speaking');
      btnElement.title = 'Stop speech';
    };

    utterance.onend = () => {
      btnElement.classList.remove('speaking');
      btnElement.title = 'Read response aloud';
      if (activeSpeakerBtn === btnElement) activeSpeakerBtn = null;
    };

    utterance.onerror = () => {
      btnElement.classList.remove('speaking');
      btnElement.title = 'Read response aloud';
      if (activeSpeakerBtn === btnElement) activeSpeakerBtn = null;
    };

    window.speechSynthesis.speak(utterance);
  }

  // =========================================================================
  // 15. Event Listeners Initialization
  // =========================================================================
  function initEventListeners() {
    // Form submission & Textarea handling
    chatForm.addEventListener('submit', (e) => {
      e.preventDefault();
      sendMessage();
    });

    userInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
      }
    });

    userInput.addEventListener('input', () => {
      // Auto-expand textarea height
      userInput.style.height = 'auto';
      userInput.style.height = Math.min(userInput.scrollHeight, 150) + 'px';

      // Update character counter
      const len = userInput.value.length;
      charCounter.textContent = `${len}/1000`;
    });

    // Voice input mic button
    if (micBtn) {
      micBtn.addEventListener('click', toggleListening);
    }
    btnWhyWontHelp.addEventListener('click', handleWhyWontYouHelp);
    btnEmergencyHelp.addEventListener('click', handleEmergencyHelp);

    // Quick prompt chips
    quickPromptsBar.addEventListener('click', (e) => {
      const chip = e.target.closest('.prompt-chip');
      if (chip) {
        const prompt = chip.getAttribute('data-prompt');
        if (prompt) {
          userInput.value = prompt;
          userInput.dispatchEvent(new Event('input'));
          sendMessage();
        }
      }
    });

    // Personality Selection
    personalitySelect.addEventListener('change', (e) => {
      state.currentPersonality = e.target.value;
      state.personalityChangeCount += 1;
      updatePersonaDisplay();
      soundFx.click();
      checkAchievements();
    });

    // Sound and Theme Toggles
    soundToggleBtn.addEventListener('click', toggleSound);
    themeToggleBtn.addEventListener('click', toggleTheme);

    // Telemetry manual refresh
    refreshTelemetryBtn.addEventListener('click', refreshTelemetry);

    // Achievements Modal
    const openAchievementsModal = () => {
      renderAchievements();
      achievementsModal.classList.remove('hidden');
      soundFx.click();
    };
    const closeAchievementsModal = () => {
      achievementsModal.classList.add('hidden');
      soundFx.click();
    };

    achievementsToggleBtn.addEventListener('click', openAchievementsModal);
    openBadgesBtn.addEventListener('click', openAchievementsModal);
    closeAchievementsBtn.addEventListener('click', closeAchievementsModal);
    closeAchievementsFooterBtn.addEventListener('click', closeAchievementsModal);

    achievementsModal.addEventListener('click', (e) => {
      if (e.target === achievementsModal) closeAchievementsModal();
    });

    // Reset Modal
    resetConvBtn.addEventListener('click', () => {
      resetConfirmModal.classList.remove('hidden');
      soundFx.click();
    });

    cancelResetBtn.addEventListener('click', () => {
      resetConfirmModal.classList.add('hidden');
      soundFx.click();
    });

    confirmResetBtn.addEventListener('click', () => {
      resetConversation();
      soundFx.click();
    });

    resetConfirmModal.addEventListener('click', (e) => {
      if (e.target === resetConfirmModal) {
        resetConfirmModal.classList.add('hidden');
      }
    });

    // Keyboard ESC to close any modal
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        achievementsModal.classList.add('hidden');
        resetConfirmModal.classList.add('hidden');
      }
    });
  }

  // =========================================================================
  // 16. Application Bootstrap
  // =========================================================================
  function init() {
    initEventListeners();
    initSpeechRecognition();
    if ('speechSynthesis' in window && window.speechSynthesis.onvoiceschanged !== undefined) {
      window.speechSynthesis.onvoiceschanged = () => window.speechSynthesis.getVoices();
    }
    addInitialGreeting();
    updateDashboard();
    updatePersonaDisplay();
    renderAchievements();
  }

  // Run on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
