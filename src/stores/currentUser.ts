import firebase from "firebase/app";
import { useEffect, useState } from "react";
import { noop } from "../misc/misc";
import { auth } from "../models/firebase";
import { createUser } from "../models/User";
import { getUserDocument, saveUser, ssToUser } from "../models/UserDb";
import { appSlice, appStore } from "./appStore";

export function useCurrentUserStore(): void {
  const [userId, setUserId] = useState<string | null>(null);
  const [authCurrentUser, setAuthCurrentUser] = useState<firebase.User | null>(
    null
  );

  useEffect(() => {
    return auth.onAuthStateChanged((user) => {
      setAuthCurrentUser(user);
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
    return getUserDocument(userId).onSnapshot(async (ss) => {
      if (!ss.exists) {
        saveUser(
          createUser({
            id: ss.id,
            name: authCurrentUser?.displayName || "Kani",
          })
        );
        return;
      }

      const currentUser = ssToUser(ss);
      const action = appSlice.actions.setCurrentUser({ currentUser });
      appStore.dispatch(action);
    });
  }, [authCurrentUser?.displayName, userId]);
}
