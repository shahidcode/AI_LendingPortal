import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { login } from '../features/authSlice'
import { TextField, Button, Box, Alert } from '@mui/material'

export default function Login(){
  const [email, setEmail] = useState('alice@student.school')
  const [password, setPassword] = useState('password')
  const dispatch = useDispatch()
  const status = useSelector(s=>s.auth.status)
  const error = useSelector(s=>s.auth.error)

  const submit = async () => {
    try {
      await dispatch(login({ email, password })).unwrap()
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <Box sx={{maxWidth:400, mx:'auto', mt:4}}>
      {error && <Alert severity="error">{error}</Alert>}
      <TextField label="Email" fullWidth sx={{my:1}} value={email} onChange={e=>setEmail(e.target.value)} />
      <TextField label="Password" type="password" fullWidth sx={{my:1}} value={password} onChange={e=>setPassword(e.target.value)} />
      <Button variant="contained" onClick={submit} disabled={status==='loading'}>Login</Button>
    </Box>
  )
}
