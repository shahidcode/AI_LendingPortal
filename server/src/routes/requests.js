import express from 'express';
import db from '../db.js';
import { requireAuth, requireRole } from '../middleware/auth.js';
const router = express.Router();

// Student creates request
router.post('/', requireAuth, async (req, res) => {
  const { equipment_id, quantity, from_date, to_date, purpose } = req.body;
  const userId = req.user.id;
  try {
    // Prevent overlapping bookings: check requests for same equipment with overlapping dates that are approved or pending
    const conflict = await db.query(
      `SELECT 1 FROM requests WHERE equipment_id=$1 AND status IN ('approved','pending') AND NOT (to_date < $2 OR from_date > $3) LIMIT 1`,
      [equipment_id, from_date, to_date]
    );
    if (conflict.rows.length) return res.status(409).json({ error: 'Conflicting booking exists for these dates' });
    const result = await db.query(
      'INSERT INTO requests(equipment_id, user_id, quantity, from_date, to_date, purpose, status) VALUES($1,$2,$3,$4,$5,$6, $7) RETURNING *',
      [equipment_id, userId, quantity, from_date, to_date, purpose, 'pending']
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// List requests (admins see all; users see own)
router.get('/', requireAuth, async (req, res) => {
  try {
    if (req.user.role === 'admin') {
      const r = await db.query('SELECT r.*, u.name as user_name, e.name as equipment_name FROM requests r JOIN users u ON r.user_id=u.id JOIN equipment e ON r.equipment_id=e.id ORDER BY r.id DESC');
      return res.json(r.rows);
    }
    const r = await db.query('SELECT r.*, e.name as equipment_name FROM requests r JOIN equipment e ON r.equipment_id=e.id WHERE r.user_id=$1 ORDER BY r.id DESC', [req.user.id]);
    res.json(r.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Admin approve/reject
router.post('/:id/approve', requireAuth, requireRole('admin'), async (req, res) => {
  const { id } = req.params;
  const { approve } = req.body; // true/false
  try {
    const status = approve ? 'approved' : 'rejected';
    const r = await db.query('UPDATE requests SET status=$1, processed_by=$2, processed_at=NOW() WHERE id=$3 RETURNING *', [status, req.user.id, id]);
    res.json(r.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Mark returned
router.post('/:id/return', requireAuth, async (req, res) => {
  const { id } = req.params;
  try {
    // Only processed by admin or the requester can mark returned after approved
    const rq = await db.query('SELECT * FROM requests WHERE id=$1', [id]);
    const rr = rq.rows[0];
    if (!rr) return res.status(404).json({ error: 'Not found' });
    if (req.user.role !== 'admin' && req.user.id !== rr.user_id) return res.status(403).json({ error: 'Forbidden' });
    if (rr.status !== 'approved') return res.status(400).json({ error: 'Only approved requests can be returned' });
    const r = await db.query('UPDATE requests SET status=$1, returned_at=NOW() WHERE id=$2 RETURNING *', ['returned', id]);
    res.json(r.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
