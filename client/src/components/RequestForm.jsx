import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box
} from '@mui/material';

export default function RequestForm({ open, onClose, onSubmit, equipment }) {
  const [formData, setFormData] = useState({
    equipment_id: equipment?.id,
    quantity: 1,
    from_date: '',
    to_date: '',
    purpose: ''
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
        <DialogTitle>Request Equipment: {equipment?.name}</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
            <TextField
              label="Quantity"
              name="quantity"
              type="number"
              value={formData.quantity}
              onChange={handleChange}
              required
              fullWidth
              inputProps={{ min: 1, max: equipment?.quantity || 1 }}
            />
            <TextField
              label="From Date"
              name="from_date"
              type="date"
              value={formData.from_date}
              onChange={handleChange}
              required
              fullWidth
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              label="To Date"
              name="to_date"
              type="date"
              value={formData.to_date}
              onChange={handleChange}
              required
              fullWidth
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              label="Purpose"
              name="purpose"
              value={formData.purpose}
              onChange={handleChange}
              required
              fullWidth
              multiline
              rows={3}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="contained" color="primary">
            Submit Request
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}