import { configureStore } from '@reduxjs/toolkit'
import authReducer from '../features/authSlice'
import equipmentReducer from '../features/equipmentSlice'
import requestsReducer from '../features/requestsSlice'

export default configureStore({
  reducer: {
    auth: authReducer,
    equipment: equipmentReducer,
    requests: requestsReducer,
  }
})
