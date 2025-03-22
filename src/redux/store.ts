import { configureStore } from '@reduxjs/toolkit';
import reloadStatusReducer from './reloadStatusSlice';

export const store = configureStore({
  reducer: {
    reloadStatus: reloadStatusReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;
