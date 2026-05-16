const rateLimitMap = new Map();

export function checkRateLimit(identifier, limit = 50, windowMs = 60000) {
  const now = Date.now();
  const windowStart = now - windowMs;

  const userRequests = rateLimitMap.get(identifier) || [];
  
  // Filter out old requests
  const currentRequests = userRequests.filter(timestamp => timestamp > windowStart);
  
  if (currentRequests.length >= limit) {
    return false; // Rate limit exceeded
  }
  
  currentRequests.push(now);
  rateLimitMap.set(identifier, currentRequests);
  
  // Cleanup old entries randomly to prevent memory leaks in long-running processes
  if (Math.random() < 0.05) {
    for (const [key, timestamps] of rateLimitMap.entries()) {
      const valid = timestamps.filter(t => t > windowStart);
      if (valid.length === 0) {
        rateLimitMap.delete(key);
      } else {
        rateLimitMap.set(key, valid);
      }
    }
  }

  return true;
}
