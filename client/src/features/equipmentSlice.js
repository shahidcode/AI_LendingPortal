import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

export const fetchEquipment = createAsyncThunk('equipment/fetch', async (params) => {
  const q = new URLSearchParams(params || {}).toString();
  const res = await fetch('/api/equipment' + (q ? `?${q}` : ''));
  if (!res.ok) throw new Error('Fetch failed');
  return res.json();
});

const slice = createSlice({
  name: 'equipment',
  initialState: { list: [], status: 'idle', error: null },
  reducers: {},
  extraReducers: (b) => {
    b.addCase(fetchEquipment.pending, (s) => { s.status = 'loading' })
    b.addCase(fetchEquipment.fulfilled, (s, a) => { s.status = 'succeeded'; s.list = a.payload })
    b.addCase(fetchEquipment.rejected, (s, a) => { s.status = 'failed'; s.error = a.error.message })
  }
})

export default slice.reducer
