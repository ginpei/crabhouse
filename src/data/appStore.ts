import { configureStore, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Room } from "./Room";
import { User } from "./User";

export type AppState = ReturnType<typeof appSlice["reducer"]>;
// export type AppActions = typeof appSlice["actions"];

export const appSlice = createSlice({
  name: "app",
  initialState: {
    currentUser: null as User | null,
    currentUserFollowers: null as User[] | null,
    /**
     * Hold list to show follow buttons immediately
     */
    currentUserFollowings: null as User[] | null,
    currentUserId: null as string | null,
    participatingSession: null as Room | null,
    sessionPlayerVisible: false,
  },
  reducers: {
    setCurrentUser(state, action: PayloadAction<{ currentUser: User | null }>) {
      return {
        ...state,
        currentUser: action.payload.currentUser,
        currentUserId: action.payload.currentUser?.id || "",
      };
    },

    setCurrentUserFollowers(
      state,
      action: PayloadAction<{ currentUserFollowers: User[] }>
    ) {
      return {
        ...state,
        currentUserFollowers: action.payload.currentUserFollowers,
      };
    },

    setCurrentUserFollowings(
      state,
      action: PayloadAction<{ currentUserFollowings: User[] }>
    ) {
      return {
        ...state,
        currentUserFollowings: action.payload.currentUserFollowings,
      };
    },

    setCurrentUserId(state, action: PayloadAction<{ currentUserId: string }>) {
      return {
        ...state,
        currentUserId: action.payload.currentUserId,
      };
    },

    setPlayingSession(state, action: PayloadAction<{ room: Room | null }>) {
      return {
        ...state,
        participatingSession: action.payload.room,
        sessionPlayerVisible: true,
      };
    },

    hideSessionPlayer(state) {
      return {
        ...state,
        participatingSession: null,
        sessionPlayerVisible: true,
      };
    },
  },
});

export const appStore = configureStore({ reducer: appSlice.reducer });
