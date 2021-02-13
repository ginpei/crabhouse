import firebase from "firebase/app";
import { useEffect, useState } from "react";
import { noop } from "../misc/misc";
import { auth } from "../models/firebase";
import { onCollectionSnapshot } from "../models/modelDbBase";
import { createRoom } from "../models/Room";
import { saveRoom } from "../models/RoomDb";
import { createUser } from "../models/User";
import {
  getUserFollowerCollection,
  getUserFollowingCollection,
  onUserSnapshot,
  saveUser,
  ssToUser,
} from "../models/UserDb";
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
    return onUserSnapshot(userId, async (currentUser, ss) => {
      if (!currentUser) {
        const user = {
          id: ss.id,
          name: authCurrentUser?.displayName || "Kani",
        };
        saveUser(createUser(user));
        saveRoom(
          createRoom({
            id: user.id,
            name: `${user.name}'s room`,
          })
        );
        return;
      }

      const action = appSlice.actions.setCurrentUser({ currentUser });
      appStore.dispatch(action);
    });
  }, [authCurrentUser?.displayName, userId]);

  useEffect(() => {
    if (!userId) {
      return noop;
    }

    const ref = getUserFollowerCollection(userId);
    return onCollectionSnapshot(ref, ssToUser, (currentUserFollowers) => {
      const action = appSlice.actions.setCurrentUserFollowers({
        currentUserFollowers,
      });
      appStore.dispatch(action);
    });
  }, [userId]);

  useEffect(() => {
    if (!userId) {
      return noop;
    }

    const ref = getUserFollowingCollection(userId);
    return onCollectionSnapshot(ref, ssToUser, (currentUserFollowings) => {
      const action = appSlice.actions.setCurrentUserFollowings({
        currentUserFollowings,
      });
      appStore.dispatch(action);
    });
  }, [userId]);
}
