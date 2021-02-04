import { configureStore, createSlice, PayloadAction } from "@reduxjs/toolkit";

export type AppState = ReturnType<typeof appSlice["reducer"]>;
// export type AppActions = typeof appSlice["actions"];

export const appSlice = createSlice({
  name: "app",
  initialState: {
    xMessage: "Hello World!",
  },
  reducers: {
    setMessage(state, { payload }: PayloadAction<{ message: string }>) {
      return {
        ...state,
        xMessage: payload.message,
      };
    },
  },
});

export const appStore = configureStore({ reducer: appSlice.reducer });
