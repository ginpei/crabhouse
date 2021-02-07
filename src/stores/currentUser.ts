import { useEffect, useState } from "react";
import { noop } from "../misc/misc";
import { auth } from "../models/firebase";
import { getUserDocument, ssToUser } from "../models/UserDb";
import { appSlice, appStore } from "./appStore";

export function useCurrentUserStore(): void {
  const [userId, setUserId] = useState("");

  useEffect(() => {
    return auth.onAuthStateChanged((user) => {
      const currentUserId = user?.uid ?? "";
      setUserId(currentUserId);
    });
  }, []);

  useEffect(() => {
    if (!userId) {
      return noop;
    }

    return getUserDocument(userId).onSnapshot((ss) => {
      const currentUser = ssToUser(ss);
      const action = appSlice.actions.setCurrentUser({ currentUser });
      appStore.dispatch(action);
    });
  }, [userId]);
}
