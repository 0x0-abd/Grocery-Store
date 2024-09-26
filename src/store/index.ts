import { configureStore } from '@reduxjs/toolkit';
import cartReducer from './cartSlice';
import userSlice from './userSlice';
import preferenceSlice from './preferenceSlice';

const store = configureStore({
  reducer: {
    cart: cartReducer,
    user: userSlice,
    preference: preferenceSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;

export default store;