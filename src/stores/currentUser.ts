import { useEffect } from "react";
import { auth } from "../models/firebase";
import { appSlice, appStore } from "./appStore";

export function useCurrentUserIdStore(): void {
  useEffect(() => {
    return auth.onAuthStateChanged((user) => {
      const currentUserId = user?.uid ?? "";
      const action = appSlice.actions.setCurrentUserId({ currentUserId });
      appStore.dispatch(action);
    });
  }, []);
}
