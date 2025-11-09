export function requireAuth(req, res, next) {
  const h = req.headers.authorization;
  if (!h) return res.status(401).json({ error: 'Missing Authorization header' });
  const parts = h.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') return res.status(401).json({ error: 'Malformed auth header' });
  const token = parts[1];
  // Token format: base64(JSON) for this demo: {"id":1,"role":"student","name":"Alice"}
  try {
    const raw = Buffer.from(token, 'base64').toString('utf8');
    const payload = JSON.parse(raw);
    req.user = payload;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid token' });
  }
}

export function requireRole(role) {
  return (req, res, next) => {
    if (!req.user) return res.status(401).json({ error: 'Not authenticated' });
    if (req.user.role !== role && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Insufficient role' });
    }
    next();
  };
}
