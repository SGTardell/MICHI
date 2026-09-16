const fs = require('fs');
const path = require('path');

const TMP_FILE = path.join('/tmp', 'michi_sync.json');
let inMemoryStore = null;

function readTmpCache() {
  try {
    if (fs.existsSync(TMP_FILE)) {
      const raw = fs.readFileSync(TMP_FILE, 'utf8');
      if (raw) {
        return JSON.parse(raw);
      }
    }
  } catch (e) {}
  return null;
}

function writeTmpCache(dataObj) {
  try {
    fs.writeFileSync(TMP_FILE, JSON.stringify(dataObj), 'utf8');
  } catch (e) {}
}

async function hydrateFromNtfy() {
  try {
    const resp = await fetch('https://ntfy.sh/michi_app_sync_channel_2026/json?poll=1&since=12h');
    if (resp.ok) {
      const text = await resp.text();
      const lines = text.trim().split('\n');
      for (let i = lines.length - 1; i >= 0; i--) {
        if (!lines[i].trim()) continue;
        try {
          const parsedLine = JSON.parse(lines[i]);
          let payload = null;
          if (parsedLine.event === 'message' && parsedLine.message) {
            payload = typeof parsedLine.message === 'string' ? JSON.parse(parsedLine.message) : parsedLine.message;
          }
          if (payload && (payload.clip || payload.action || payload.latestClip || payload.state)) {
            return {
              lastUpdated: Date.now(),
              data: payload
            };
          }
        } catch (e) {}
      }
    }
  } catch (e) {}
  return null;
}

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'POST') {
    try {
      let body = req.body;
      if (typeof body === 'string') {
        try { body = JSON.parse(body); } catch(e) {}
      }
      if (body) {
        inMemoryStore = {
          lastUpdated: Date.now(),
          data: body
        };
        writeTmpCache(inMemoryStore);

        // Forward to ntfy.sh with retention
        try {
          fetch('https://ntfy.sh/michi_app_sync_channel_2026', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'X-Cache': 'yes',
              'Cache': 'yes'
            },
            body: JSON.stringify(body)
          }).catch(() => {});
        } catch (e) {}
      }
      return res.status(200).json({ status: 'ok', lastUpdated: inMemoryStore ? inMemoryStore.lastUpdated : Date.now() });
    } catch (e) {
      return res.status(400).json({ error: 'Invalid payload' });
    }
  }

  if (!inMemoryStore) {
    inMemoryStore = readTmpCache();
  }

  if (!inMemoryStore) {
    inMemoryStore = await hydrateFromNtfy();
    if (inMemoryStore) {
      writeTmpCache(inMemoryStore);
    }
  }

  return res.status(200).json({
    status: 'ok',
    data: inMemoryStore ? inMemoryStore.data : null,
    lastUpdated: inMemoryStore ? inMemoryStore.lastUpdated : 0
  });
};
