/* ============================================
   JOSHUA OMANG — PORTFOLIO BACKEND
   Node.js + Express server
   - Serves the static portfolio site
   - Provides JSON REST API for newsletter
     subscriptions and contact messages
   ============================================ */

const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// --- Data store (JSON file) ---
const DATA_DIR = path.join(__dirname, 'data');
const STORE_FILE = path.join(DATA_DIR, 'store.json');

// Ensure the data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Default empty store
const DEFAULT_STORE = { subscribers: [], messages: [] };

// Read the store from disk (create if missing)
const readStore = () => {
  try {
    if (!fs.existsSync(STORE_FILE)) {
      fs.writeFileSync(STORE_FILE, JSON.stringify(DEFAULT_STORE, null, 2));
      return { ...DEFAULT_STORE };
    }
    const raw = fs.readFileSync(STORE_FILE, 'utf8');
    const parsed = JSON.parse(raw);
    return {
      subscribers: Array.isArray(parsed.subscribers) ? parsed.subscribers : [],
      messages: Array.isArray(parsed.messages) ? parsed.messages : []
    };
  } catch (err) {
    console.error('Error reading store:', err.message);
    return { ...DEFAULT_STORE };
  }
};

// Write the store to disk (atomic-ish write to temp then rename)
const writeStore = (store) => {
  try {
    const tmp = STORE_FILE + '.tmp';
    fs.writeFileSync(tmp, JSON.stringify(store, null, 2));
    fs.renameSync(tmp, STORE_FILE);
    return true;
  } catch (err) {
    console.error('Error writing store:', err.message);
    return false;
  }
};

// --- Middleware ---
app.use(cors());
app.use(express.json({ limit: '100kb' }));
app.use(express.urlencoded({ extended: true }));

// Simple request logger
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} ${req.method} ${req.url}`);
  next();
});

// --- Static files (the whole portfolio) ---
app.use(express.static(path.join(__dirname)));

// --- Validation helpers ---
const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email || ''));

// --- API: Health check ---
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'joshua-omang-portfolio-api',
    time: new Date().toISOString()
  });
});

// --- API: Newsletter subscribe ---
app.post('/api/subscribe', (req, res) => {
  const { email } = req.body || {};

  if (!email || !isValidEmail(email)) {
    return res.status(400).json({ success: false, error: 'A valid email address is required.' });
  }

  const store = readStore();
  const normalized = String(email).trim().toLowerCase();

  // Avoid duplicate subscriptions
  const exists = store.subscribers.some((s) => s.email === normalized);
  if (exists) {
    return res.status(409).json({ success: false, error: 'This email is already subscribed.' });
  }

  const subscriber = {
    email: normalized,
    subscribedAt: new Date().toISOString()
  };
  store.subscribers.push(subscriber);

  if (!writeStore(store)) {
    return res.status(500).json({ success: false, error: 'Could not save subscription. Please try again.' });
  }

  return res.status(201).json({
    success: true,
    message: 'Thanks for subscribing! 🎉',
    subscriber
  });
});

// --- API: Contact message ---
app.post('/api/contact', (req, res) => {
  const { name, email, message } = req.body || {};

  if (!name || !String(name).trim()) {
    return res.status(400).json({ success: false, error: 'Please provide your name.' });
  }
  if (!email || !isValidEmail(email)) {
    return res.status(400).json({ success: false, error: 'A valid email address is required.' });
  }
  if (!message || !String(message).trim()) {
    return res.status(400).json({ success: false, error: 'Please provide a message.' });
  }

  const store = readStore();
  const entry = {
    id: Date.now().toString(36) + Math.random().toString(36).slice(2, 7),
    name: String(name).trim().slice(0, 100),
    email: String(email).trim().toLowerCase(),
    message: String(message).trim().slice(0, 2000),
    receivedAt: new Date().toISOString()
  };
  store.messages.push(entry);

  if (!writeStore(store)) {
    return res.status(500).json({ success: false, error: 'Could not save your message. Please try again.' });
  }

  return res.status(201).json({
    success: true,
    message: `Thanks, ${entry.name}! Your message has been received.`,
    id: entry.id
  });
});

// --- API: List subscribers (admin view) ---
app.get('/api/subscribers', (req, res) => {
  const store = readStore();
  res.json({ success: true, count: store.subscribers.length, subscribers: store.subscribers });
});

// --- API: List messages (admin view) ---
app.get('/api/messages', (req, res) => {
  const store = readStore();
  res.json({ success: true, count: store.messages.length, messages: store.messages });
});

// --- Fallback: serve index.html for any unhandled non-API route ---
app.get(/^\/(?!api\/).*/, (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// --- Central error handler ---
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ success: false, error: 'Internal server error.' });
});

// --- Start server ---
app.listen(PORT, () => {
  console.log(`\n🚀 Portfolio backend running at http://localhost:${PORT}`);
  console.log(`   Health check:  http://localhost:${PORT}/api/health`);
  console.log(`   Static site:   http://localhost:${PORT}\n`);
});
