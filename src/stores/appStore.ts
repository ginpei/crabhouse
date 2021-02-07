import { configureStore, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { User } from "../models/User";

export type AppState = ReturnType<typeof appSlice["reducer"]>;
// export type AppActions = typeof appSlice["actions"];

export const appSlice = createSlice({
  name: "app",
  initialState: {
    currentUser: null as User | null,
    currentUserId: null as string | null,
  },
  reducers: {
    setCurrentUser(state, action: PayloadAction<{ currentUser: User }>) {
      return {
        ...state,
        currentUser: action.payload.currentUser,
        currentUserId: action.payload.currentUser.id,
      };
    },

    setCurrentUserId(state, action: PayloadAction<{ currentUserId: string }>) {
      return {
        ...state,
        currentUserId: action.payload.currentUserId,
      };
    },
  },
});

export const appStore = configureStore({ reducer: appSlice.reducer });
