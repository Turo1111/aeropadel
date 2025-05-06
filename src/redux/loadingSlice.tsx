import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface LoadingState {
  open: boolean;
}

const initialState: LoadingState = {
  open: false,
};

const loadingSlice = createSlice({
  name: 'loading',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.open = action.payload;
    },
    clearLoading: (state) => {
      state.open = false;
    },
  },
});

export const getLoading = (state: { loading: LoadingState }) => state.loading;
export const { setLoading, clearLoading } = loadingSlice.actions;
export default loadingSlice.reducer;
