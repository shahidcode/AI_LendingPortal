import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchRequests, approveRequest, returnRequest } from '../features/requestsSlice'
import {
  Box,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Chip
} from '@mui/material'
import AlertMessage from '../components/AlertMessage'

const statusColors = {
  pending: 'warning',
  approved: 'success',
  rejected: 'error',
  returned: 'info'
}

export default function Dashboard() {
  const dispatch = useDispatch()
  const requests = useSelector(state => state.requests.list)
  const user = useSelector(state => state.auth.user)
  const [alert, setAlert] = useState({ open: false, severity: 'success', message: '' })

  useEffect(() => {
    dispatch(fetchRequests())
  }, [dispatch])

  const handleApprove = async (id, approve) => {
    try {
      await dispatch(approveRequest({ id, approve })).unwrap()
      dispatch(fetchRequests())
      setAlert({
        open: true,
        severity: 'success',
        message: `Request ${approve ? 'approved' : 'rejected'} successfully`
      })
    } catch (err) {
      setAlert({
        open: true,
        severity: 'error',
        message: `Failed to ${approve ? 'approve' : 'reject'} request: ${err.message}`
      })
    }
  }

  const handleReturn = async (id) => {
    try {
      await dispatch(returnRequest(id)).unwrap()
      dispatch(fetchRequests())
      setAlert({
        open: true,
        severity: 'success',
        message: 'Equipment marked as returned successfully'
      })
    } catch (err) {
      setAlert({
        open: true,
        severity: 'error',
        message: 'Failed to mark equipment as returned: ' + err.message
      })
    }
  }

  return (
    <Box sx={{ mt: 3 }}>
      <Typography variant="h5" sx={{ mb: 2 }}>
        {user?.role === 'admin' ? 'All Equipment Requests' : 'My Requests'}
      </Typography>
      
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Equipment</TableCell>
              <TableCell>Requested By</TableCell>
              <TableCell>From</TableCell>
              <TableCell>To</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {requests.map((req) => (
              <TableRow key={req.id}>
                <TableCell>{req.equipment_name}</TableCell>
                <TableCell>{req.user_name}</TableCell>
                <TableCell>{new Date(req.from_date).toLocaleDateString()}</TableCell>
                <TableCell>{new Date(req.to_date).toLocaleDateString()}</TableCell>
                <TableCell>
                  <Chip 
                    label={req.status} 
                    color={statusColors[req.status]} 
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  {user?.role === 'admin' && req.status === 'pending' && (
                    <Box>
                      <Button
                        size="small"
                        variant="outlined"
                        color="success"
                        onClick={() => handleApprove(req.id, true)}
                        sx={{ mr: 1 }}
                      >
                        Approve
                      </Button>
                      <Button
                        size="small"
                        variant="outlined"
                        color="error"
                        onClick={() => handleApprove(req.id, false)}
                      >
                        Reject
                      </Button>
                    </Box>
                  )}
                  {req.status === 'approved' && (
                    <Button
                      size="small"
                      variant="outlined"
                      onClick={() => handleReturn(req.id)}
                    >
                      Mark Returned
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <AlertMessage
        open={alert.open}
        severity={alert.severity}
        message={alert.message}
        onClose={() => setAlert({ ...alert, open: false })}
      />
    </Box>
  )
}
