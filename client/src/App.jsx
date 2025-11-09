import React from 'react'
import { useSelector } from 'react-redux'
import Login from './pages/Login'
import EquipmentList from './pages/EquipmentList'
import Dashboard from './pages/Dashboard'
import { Box, AppBar, Toolbar, Typography, Button } from '@mui/material'
import { useDispatch } from 'react-redux'
import { logout } from './features/authSlice'

export default function App(){
  const user = useSelector(s=>s.auth.user)
  const dispatch = useDispatch()
  return (
    <Box>
      <AppBar position="static" color='warning'>
        <Toolbar>
          <Typography variant="h6" sx={{ flex: 1 }}>School Equipment Lending</Typography>
          {user ? (
            <>
              <Typography sx={{mr:2}}>{user.name} ({user.role})</Typography>
              <Button color="inherit" onClick={()=>dispatch(logout())}>Logout</Button>
            </>
          ) : null}
        </Toolbar>
      </AppBar>
      <Box sx={{mt:2}}>
        {!user ? <Login /> : (
          <>
            <EquipmentList />
            {user.role === 'admin' && <Dashboard />}
          </>
        )}
      </Box>
    </Box>
  )
}
