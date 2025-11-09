import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  MenuItem,
  Box
} from '@mui/material';

const categories = ['Sports', 'Lab', 'Media', 'Music'];
const conditions = ['New', 'Good', 'Fair', 'Poor'];

export default function EquipmentForm({ open, onClose, onSubmit, initialData }) {
  const [formData, setFormData] = useState(initialData || {
    name: '',
    category: '',
    condition: '',
    quantity: 1,
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
    onClose();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <form onSubmit={handleSubmit}>
        <DialogTitle>{initialData ? 'Edit Equipment' : 'Add New Equipment'}</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
            <TextField
              label="Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              fullWidth
            />
            <TextField
              select
              label="Category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
              fullWidth
            >
              {categories.map(cat => (
                <MenuItem key={cat} value={cat}>{cat}</MenuItem>
              ))}
            </TextField>
            <TextField
              select
              label="Condition"
              name="condition"
              value={formData.condition}
              onChange={handleChange}
              required
              fullWidth
            >
              {conditions.map(cond => (
                <MenuItem key={cond} value={cond}>{cond}</MenuItem>
              ))}
            </TextField>
            <TextField
              label="Quantity"
              name="quantity"
              type="number"
              value={formData.quantity}
              onChange={handleChange}
              required
              fullWidth
              inputProps={{ min: 1 }}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="contained" color="primary">
            {initialData ? 'Save Changes' : 'Add Equipment'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}