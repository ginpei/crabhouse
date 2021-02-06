import { configureStore, createSlice, PayloadAction } from "@reduxjs/toolkit";

export type AppState = ReturnType<typeof appSlice["reducer"]>;
// export type AppActions = typeof appSlice["actions"];

export const appSlice = createSlice({
  name: "app",
  initialState: {
    currentUserId: null as string | null,
  },
  reducers: {
    setCurrentUserId(state, action: PayloadAction<{ currentUserId: string }>) {
      return {
        ...state,
        currentUserId: action.payload.currentUserId,
      };
    },
  },
});

export const appStore = configureStore({ reducer: appSlice.reducer });
