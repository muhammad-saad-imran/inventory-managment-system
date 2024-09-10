import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "@/store";

export enum LOADING_STATES {
  LOADING,
  COMPLETE,
}

interface LoadingState {
  status: LOADING_STATES;
}

const initialState = {
  status: LOADING_STATES.COMPLETE,
} satisfies LoadingState as LoadingState;

const loadingSlice = createSlice({
  name: "loading",
  initialState,
  reducers: {
    startLoading(state) {
      state.status = LOADING_STATES.LOADING;
    },
    completeLoading(state) {
      state.status = LOADING_STATES.COMPLETE;
    },
  },
});

export const { completeLoading, startLoading } = loadingSlice.actions;
export default loadingSlice.reducer;

export const selectLoadingStatus = (state: RootState) => state.loading.status;
