import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchEquipment } from '../features/equipmentSlice'
import { createRequest } from '../features/requestsSlice'
import { Box, Grid, Card, CardContent, Typography, Button, TextField, MenuItem, IconButton } from '@mui/material'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import AddIcon from '@mui/icons-material/Add'
import RequestForm from '../components/RequestForm'
import EquipmentForm from '../components/EquipmentForm'
import AlertMessage from '../components/AlertMessage'

export default function EquipmentList(){
  const dispatch = useDispatch()
  const equipments = useSelector(s=>s.equipment.list)
  const status = useSelector(s=>s.equipment.status)
  const user = useSelector(s=>s.auth.user)
  const [category, setCategory] = useState('')
  const [addOpen, setAddOpen] = useState(false)
  const [editItem, setEditItem] = useState(null)
  const [requestItem, setRequestItem] = useState(null)
  const [alert, setAlert] = useState({ open: false, severity: 'success', message: '' })

  useEffect(()=>{ dispatch(fetchEquipment({ category: category || undefined })) }, [dispatch, category])

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this item?')) return;
    try {
      const res = await fetch(`/api/equipment/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      if (res.ok) {
        dispatch(fetchEquipment());
        setAlert({
          open: true,
          severity: 'success',
          message: 'Equipment deleted successfully'
        });
      } else {
        throw new Error('Failed to delete equipment');
      }
    } catch (err) {
      setAlert({
        open: true,
        severity: 'error',
        message: err.message || 'Error deleting equipment'
      });
    }
  }

  const handleSubmitEquipment = async (data) => {
    const method = editItem ? 'PUT' : 'POST';
    const url = editItem ? `/api/equipment/${editItem.id}` : '/api/equipment';
    
    try {
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(data)
      });
      
      if (res.ok) {
        dispatch(fetchEquipment());
        setEditItem(null);
        setAddOpen(false);
        setAlert({
          open: true,
          severity: 'success',
          message: `Equipment ${editItem ? 'updated' : 'added'} successfully`
        });
      } else {
        throw new Error(`Failed to ${editItem ? 'update' : 'add'} equipment`);
      }
    } catch (err) {
      setAlert({
        open: true,
        severity: 'error',
        message: err.message || `Error ${editItem ? 'updating' : 'adding'} equipment`
      });
    }
  }

  const handleSubmitRequest = async (data) => {
    console.log(data);
    try {
      await dispatch(createRequest(data)).unwrap();
      setRequestItem(null);
      setAlert({
        open: true,
        severity: 'success',
        message: 'Request created successfully'
      });
    } catch (err) {
      setAlert({
        open: true,
        severity: 'error',
        message: err.message || 'Failed to create request'
      });
    }
  }

  return (
    <Box sx={{mt:2}}>
      <Box sx={{display:'flex', gap:2, mb:2, alignItems: 'center'}}>
        <TextField select label="Category" value={category} onChange={e=>setCategory(e.target.value)} sx={{width:200}}>
          <MenuItem value="">All</MenuItem>
          <MenuItem value="Sports">Sports</MenuItem>
          <MenuItem value="Lab">Lab</MenuItem>
          <MenuItem value="Media">Media</MenuItem>
          <MenuItem value="Music">Music</MenuItem>
        </TextField>
        <Button color='secondary' variant="contained" onClick={()=>dispatch(fetchEquipment())}>Refresh</Button>
        {user?.role === 'admin' && (
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setAddOpen(true)}
          >
            Add Equipment
          </Button>
        )}
      </Box>

      {status==='loading' && <div>Loading...</div>}
      <Grid container spacing={2}>
        {equipments.map(e => (
          <Grid item key={e.id} xs={12} sm={6} md={4}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <Typography variant="h6">{e.name}</Typography>
                  {user?.role === 'admin' && (
                    <Box>
                      <IconButton size="small" onClick={() => setEditItem(e)}>
                        <EditIcon />
                      </IconButton>
                      <IconButton size="small" onClick={() => handleDelete(e.id)}>
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  )}
                </Box>
                <Typography>Category: {e.category}</Typography>
                <Typography>Condition: {e.condition}</Typography>
                <Typography>Quantity: {e.quantity}</Typography>
                <Typography>Available: {e.available ? 'Yes' : 'No'}</Typography>
                {user && user.role !== 'admin' && e.available && (
                  <Button
                    variant="contained"
                    size="small"
                    sx={{ mt: 1 }}
                    onClick={() => setRequestItem(e)}
                  >
                    Request
                  </Button>
                )}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <EquipmentForm
        open={addOpen || !!editItem}
        onClose={() => { setAddOpen(false); setEditItem(null); }}
        onSubmit={handleSubmitEquipment}
        initialData={editItem}
      />

      <RequestForm
        open={!!requestItem}
        onClose={() => setRequestItem(null)}
        onSubmit={handleSubmitRequest}
        equipment={requestItem}
      />

      <AlertMessage
        open={alert.open}
        severity={alert.severity}
        message={alert.message}
        onClose={() => setAlert({ ...alert, open: false })}
      />
    </Box>
  )
}
