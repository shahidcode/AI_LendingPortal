import express from 'express';
import db from '../db.js';
import { requireAuth, requireRole } from '../middleware/auth.js';
const router = express.Router();

// List equipment with optional filters
router.get('/', async (req, res) => {
  const { category, available } = req.query;
  let q = 'SELECT * FROM equipment';
  const params = [];
  const clauses = [];
  if (category) {
    params.push(category);
    clauses.push(`category = $${params.length}`);
  }
  if (available) {
    params.push(available === 'true');
    clauses.push(`available = $${params.length}`);
  }
  if (clauses.length) q += ' WHERE ' + clauses.join(' AND ');
  q += ' ORDER BY id';
  const result = await db.query(q, params);
  res.json(result.rows);
});

// Admin create
router.post('/', requireAuth, requireRole('admin'), async (req, res) => {
  const { name, category, condition, quantity } = req.body;
  try {
    const result = await db.query(
      'INSERT INTO equipment(name, category, condition, quantity, available) VALUES($1,$2,$3,$4, TRUE) RETURNING *',
      [name, category, condition, quantity]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Admin edit
router.put('/:id', requireAuth, requireRole('admin'), async (req, res) => {
  const { id } = req.params;
  const { name, category, condition, quantity, available } = req.body;
  try {
    const result = await db.query(
      'UPDATE equipment SET name=$1, category=$2, condition=$3, quantity=$4, available=$5 WHERE id=$6 RETURNING *',
      [name, category, condition, quantity, available, id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Admin delete
router.delete('/:id', requireAuth, requireRole('admin'), async (req, res) => {
  const { id } = req.params;
  try {
    await db.query('DELETE FROM equipment WHERE id=$1', [id]);
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
