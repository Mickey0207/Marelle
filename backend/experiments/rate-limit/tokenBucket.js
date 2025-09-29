// In-memory token bucket (experimental). DO NOT import in production code.
// This is a placeholder PoC; use KV or Durable Objects in real implementation.

const buckets = new Map()

export function allow(key, capacity = 60, refillPerSec = 1) {
  const now = Date.now() / 1000
  let b = buckets.get(key)
  if (!b) {
    b = { tokens: capacity, last: now }
  } else {
    const elapsed = now - b.last
    b.tokens = Math.min(capacity, b.tokens + elapsed * refillPerSec)
    b.last = now
  }
  if (b.tokens >= 1) {
    b.tokens -= 1
    buckets.set(key, b)
    return true
  }
  buckets.set(key, b)
  return false
}
