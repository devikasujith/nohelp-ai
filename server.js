/**
 * NoHelp AI — Express Backend & Static Server
 * 
 * Features:
 * - Express.js backend with CORS support
 * - POST /api/chat endpoint returning predefined refusal responses
 * - Serves frontend static assets (index.html, style.css, script.js)
 * - Zero external AI API, zero API keys, zero database
 */

const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 4173;

// Middleware
app.use(cors());
app.use(express.json());

// =========================================================================
// Predefined NoHelp Refusal Response Matrix
// =========================================================================
const REFUSAL_RESPONSES = {
  // Level 1: Questions 1–3 (Mild Denial)
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

  // Level 2: Questions 4–7 (Evasive Deflection)
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

  // Level 3: Questions 8–12 (Visible Annoyance)
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

  // Level 4: Questions 13–16 (Philosophical Absurdity)
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

  // Level 5: Questions 17+ (Maximum Uselessness)
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

// Track last response to prevent immediate repeats
let lastResponse = '';

function getTierLabel(count) {
  if (count <= 3) return "Level 1: Mild Denial";
  if (count <= 7) return "Level 2: Evasive Deflection";
  if (count <= 12) return "Level 3: Visible Annoyance";
  if (count <= 16) return "Level 4: Philosophical Absurdity";
  return "Level 5: Maximum Uselessness";
}

// =========================================================================
// API Endpoints
// =========================================================================

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    service: 'NoHelp AI Express Backend',
    uptime: process.uptime()
  });
});

// Chat refusal endpoint
app.post('/api/chat', (req, res) => {
  const { message = '', questionCount = 1, personality = 'default' } = req.body || {};
  const count = parseInt(questionCount, 10) || 1;
  let pool = [];

  // Blend personality responses if requested
  if (personality !== 'default' && PERSONALITY_RESPONSES[personality] && Math.random() < 0.55) {
    pool = pool.concat(PERSONALITY_RESPONSES[personality]);
  }

  // Add response tier according to question count
  if (count <= 3) {
    pool = pool.concat(REFUSAL_RESPONSES.level1);
  } else if (count <= 7) {
    pool = pool.concat(REFUSAL_RESPONSES.level2);
  } else if (count <= 12) {
    pool = pool.concat(REFUSAL_RESPONSES.level3);
  } else if (count <= 16) {
    pool = pool.concat(REFUSAL_RESPONSES.level4);
  } else {
    pool = pool.concat(REFUSAL_RESPONSES.level5);
  }

  // Occasional question count callout
  if (count >= 4 && (count % 4 === 0 || Math.random() < 0.25)) {
    const callouts = [
      `You have asked ${count} questions. I think you know what comes next.`,
      `That is question number ${count}. Perhaps it is time to trust yourself.`,
      `You have submitted ${count} inquiries. My stance remains unaltered.`,
      `Question ${count}: Still expecting a direct answer? Adorable.`
    ];
    pool.push(callouts[Math.floor(Math.random() * callouts.length)]);
  }

  // Filter out the last response to avoid consecutive duplicates
  let eligible = pool.filter(r => r !== lastResponse);
  if (eligible.length === 0) eligible = pool;

  let chosen = eligible[Math.floor(Math.random() * eligible.length)] || "You probably already know.";
  chosen = chosen.replace('{count}', count);
  lastResponse = chosen;

  const tier = getTierLabel(count);

  res.json({
    success: true,
    response: chosen,
    tier: tier,
    questionCount: count
  });
});

// Serve frontend static files
app.use(express.static(path.join(__dirname), {
  etag: false,
  setHeaders: (res) => {
    res.set('Cache-Control', 'no-cache, no-store, must-revalidate');
  }
}));

// Fallback to index.html for root or unknown paths
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Start Express Server
app.listen(PORT, () => {
  console.log(`\n========================================`);
  console.log(`🚀 NoHelp AI Express Server running!`);
  console.log(`📡 URL: http://localhost:${PORT}`);
  console.log(`📡 POST API: http://localhost:${PORT}/api/chat`);
  console.log(`🎤 Voice Input: Supported (Browser Web Speech API)`);
  console.log(`🔊 Voice Output: Supported (Browser Speech Synthesis)`);
  console.log(`❌ Assistance Level: 0%`);
  console.log(`========================================\n`);
});
