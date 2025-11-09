import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

export const login = createAsyncThunk('auth/login', async ({ email, password }) => {
  const res = await fetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  if (!res.ok) throw new Error('Login failed');
  return res.json();
});

const persistedToken = typeof localStorage !== 'undefined' ? localStorage.getItem('token') : null;
const persistedUser = typeof localStorage !== 'undefined' ? JSON.parse(localStorage.getItem('user') || 'null') : null;

const slice = createSlice({
  name: 'auth',
  initialState: { user: persistedUser, token: persistedToken, status: 'idle', error: null },
  reducers: {
    logout: (state) => { state.user = null; state.token = null; try{ localStorage.removeItem('token'); localStorage.removeItem('user'); }catch(e){} }
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (s) => { s.status = 'loading'; s.error = null })
      .addCase(login.fulfilled, (s, a) => { 
        s.status = 'succeeded'; 
        s.user = a.payload.user; 
        s.token = a.payload.token;
        try{
          localStorage.setItem('token', a.payload.token);
          localStorage.setItem('user', JSON.stringify(a.payload.user));
        }catch(e){/* ignore */}
      })
      .addCase(login.rejected, (s, a) => { s.status = 'failed'; s.error = a.error.message })
  }
})

export const { logout } = slice.actions
export default slice.reducer
