import firebase from "firebase/app";
import { useEffect, useState } from "react";
import { noop } from "../misc/misc";
import { getAgoraConnectionState } from "./agora";
import { appSlice, appStore } from "./appStore";
import { auth } from "./firebase";
import { onCollectionSnapshot } from "./modelDbBase";
import { createRoom } from "./Room";
import { getRoom, saveRoom, setRoomState } from "./RoomDb";
import { createUser } from "./User";
import {
  getUserFollowerCollection,
  getUserFollowingCollection,
  onUserSnapshot,
  saveUser,
  ssToUser,
} from "./UserDb";

export function useCurrentUserStore(): void {
  const [userId, setUserId] = useState<string | null>(null);
  const [authCurrentUser, setAuthCurrentUser] = useState<firebase.User | null>(
    null
  );

  useCurrentUserSetter(userId, authCurrentUser);
  useCurrentUserFollowersSetter(userId);
  useCurrentUserFollowingsSetter(userId);
  useMyRoomCloser(userId);

  useEffect(() => {
    return auth.onAuthStateChanged((user) => {
      setAuthCurrentUser(user);
      const currentUserId = user?.uid ?? "";
      setUserId(currentUserId);
    });
  }, []);
}

function useCurrentUserSetter(
  userId: string | null,
  authCurrentUser: firebase.User | null
) {
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
}

function useCurrentUserFollowersSetter(userId: string | null) {
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
}

function useCurrentUserFollowingsSetter(userId: string | null) {
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

/**
 * Close my room if agora disconnected
 */
export function useMyRoomCloser(currentUserId: string | null): void {
  useEffect(() => {
    if (!currentUserId) {
      return;
    }

    getRoom(currentUserId).then((room) => {
      const agoraState = getAgoraConnectionState();
      if (room.state !== "closed" && agoraState === "DISCONNECTED") {
        setRoomState(currentUserId, "closed");
      }
    });
  }, [currentUserId]);
}
