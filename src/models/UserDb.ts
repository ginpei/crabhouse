import { useMemo } from "react";
import { ssToDataRecord } from "./DataRecordDb";
import {
  CollectionReference,
  DocumentSnapshot,
  functions,
  isTimestamp,
  QueryDocumentSnapshot,
} from "./firebase";
import { createModelFunctions, useCollection } from "./modelDbBase";
import { createUser, User } from "./User";

export const [
  saveUser,
  getUser,
  getUserCollection,
  getUserDocument,
  useUser,
] = createModelFunctions<User>({
  collectionName: "users",
  ssToModel: ssToUser,
});

export function getUserFollowingCollection(
  userId: string
): CollectionReference {
  return getUserDocument(userId).collection("followings");
}

export function getUserFollowerCollection(userId: string): CollectionReference {
  return getUserDocument(userId).collection("followers");
}

export function ssToUser(ss: DocumentSnapshot | QueryDocumentSnapshot): User {
  return createUser({ ...ss.data(), ...ssToDataRecord(ss) });
}

export async function follow(userId: string): Promise<void> {
  const f = functions.httpsCallable("follow");
  await f({ userId });
}

export async function unfollow(userId: string): Promise<void> {
  const f = functions.httpsCallable("unfollow");
  await f({ userId });
}

export async function getUserFollowings(userId: string): Promise<User[]> {
  const ss = await getUserFollowingCollection(userId)
    .orderBy("createdAt", "desc")
    .get();
  const followings = ss.docs.map((v) => ssToUser(v));
  return followings;
}

export async function getUserFollowers(userId: string): Promise<User[]> {
  const ss = await getUserFollowerCollection(userId)
    .orderBy("createdAt", "desc")
    .get();
  const followers = ss.docs.map((v) => ssToUser(v));
  return followers;
}

export function onUserSnapshot(
  userId: string,
  callback: (user: User | null, ss: DocumentSnapshot) => void
): () => void {
  return getUserDocument(userId).onSnapshot(async (ss) => {
    if (!ss.exists) {
      callback(null, ss);
      return;
    }

    // this is the 1st step of 2 steps that serverTimestamp() requires
    const data = ss.data() || {};
    if (!isTimestamp(data.createdAt) || !isTimestamp(data.updatedAt)) {
      return;
    }

    const user = ssToUser(ss);
    callback(user, ss);
  });
}

export function useUserFollowings(
  userId: string | null
): [User[] | null, Error | null] {
  const ref = useMemo(
    () => (userId ? getUserFollowingCollection(userId) : null),
    [userId]
  );
  return useCollection(ref, ssToUser);
}

export function useUserFollowers(
  userId: string | null
): [User[] | null, Error | null] {
  const ref = useMemo(
    () => (userId ? getUserFollowerCollection(userId) : null),
    [userId]
  );
  return useCollection(ref, ssToUser);
}
