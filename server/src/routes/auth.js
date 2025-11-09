import express from 'express';
import db from '../db.js';
const router = express.Router();

// Simple simulated login: client posts {email, password}
// We'll look up user by email in users table and return a simple base64 token.
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'email+password required' });
  try {
    const result = await db.query('SELECT id, name, role, email FROM users WHERE email=$1 AND password=$2', [email, password]);
    const user = result.rows[0];
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });
    const token = Buffer.from(JSON.stringify({ id: user.id, role: user.role, name: user.name })).toString('base64');
    return res.json({ token, user: { id: user.id, name: user.name, role: user.role, email: user.email } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
