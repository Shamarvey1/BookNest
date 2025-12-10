// Simple in-memory cache (reset when server restarts)
const cache = {};

// key: string, value: any, ttlMs: number (default 5 minutes)
function setCache(key, value, ttlMs = 5 * 60 * 1000) {
  cache[key] = {
    value,
    expiry: Date.now() + ttlMs,
  };
}

function getCache(key) {
  const item = cache[key];
  if (!item) return null;
  if (Date.now() > item.expiry) {
    delete cache[key];
    return null;
  }
  return item.value;
}

module.exports = { setCache, getCache };
