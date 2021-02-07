import { useEffect, useState } from "react";
import { noop } from "../misc/misc";
import { auth } from "../models/firebase";
import { getUserDocument, ssToUser } from "../models/UserDb";
import { appSlice, appStore } from "./appStore";

export function useCurrentUserStore(): void {
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    return auth.onAuthStateChanged((user) => {
      const currentUserId = user?.uid ?? "";
      setUserId(currentUserId);
    });
  }, []);

  useEffect(() => {
    // loading
    if (userId === null) {
      return noop;
    }

    // not logged in
    if (userId === "") {
      const action = appSlice.actions.setCurrentUser({ currentUser: null });
      appStore.dispatch(action);
      return noop;
    }

    // watch logged in user profile
    return getUserDocument(userId).onSnapshot((ss) => {
      const currentUser = ssToUser(ss);
      const action = appSlice.actions.setCurrentUser({ currentUser });
      appStore.dispatch(action);
    });
  }, [userId]);
}
