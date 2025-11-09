import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const fetchRequests = createAsyncThunk('requests/fetch', async () => {
  const res = await fetch('/api/requests', {
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    }
  });
  if (!res.ok) throw new Error('Failed to fetch requests');
  return res.json();
});

export const createRequest = createAsyncThunk('requests/create', async (requestData) => {
  const res = await fetch('/api/requests', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    },
    body: JSON.stringify(requestData)
  });
  if (!res.ok) throw new Error('Failed to create request');
  return res.json();
});

export const approveRequest = createAsyncThunk('requests/approve', async ({ id, approve }) => {
  const res = await fetch(`/api/requests/${id}/approve`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    },
    body: JSON.stringify({ approve })
  });
  if (!res.ok) throw new Error('Failed to approve/reject request');
  return res.json();
});

export const returnRequest = createAsyncThunk('requests/return', async (id) => {
  const res = await fetch(`/api/requests/${id}/return`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    }
  });
  if (!res.ok) throw new Error('Failed to mark request as returned');
  return res.json();
});

const requestsSlice = createSlice({
  name: 'requests',
  initialState: {
    list: [],
    status: 'idle',
    error: null
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchRequests.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchRequests.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.list = action.payload;
        state.error = null;
      })
      .addCase(fetchRequests.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(createRequest.fulfilled, (state, action) => {
        state.list.unshift(action.payload);
      })
      .addCase(approveRequest.fulfilled, (state, action) => {
        const idx = state.list.findIndex(r => r.id === action.payload.id);
        if (idx !== -1) state.list[idx] = action.payload;
      })
      .addCase(returnRequest.fulfilled, (state, action) => {
        const idx = state.list.findIndex(r => r.id === action.payload.id);
        if (idx !== -1) state.list[idx] = action.payload;
      });
  }
});

export default requestsSlice.reducer;