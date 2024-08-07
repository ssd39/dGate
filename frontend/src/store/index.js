import { configureStore } from '@reduxjs/toolkit'
import userReducer from './userSlice'
import subscriptionsReducer from './subscriptionsSlice'

export default configureStore({
  reducer: {
    user: userReducer,
    subscriptions: subscriptionsReducer
  }
})