import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface ReloadStatusState {
  reloadStatus: boolean;
}

const initialState: ReloadStatusState = {
  reloadStatus: Boolean(localStorage.getItem('reload_status'))
};

export const reloadStatusSlice = createSlice({
  name: 'reloadStatus',
  initialState,
  reducers: {
    update: (state, action: PayloadAction<boolean>) => {
      state.reloadStatus = action.payload;
      localStorage.setItem('reload_status', action.payload.toString());
    }
  }
});

export const { update } = reloadStatusSlice.actions;

export default reloadStatusSlice.reducer;
