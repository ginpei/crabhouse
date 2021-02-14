import * as functions from "firebase-functions";
import {db} from "./firebase";

export const unfollow = functions.https.onCall(async (data, context) => {
  const userId = context.auth?.uid;
  if (!userId) {
    throw new Error("User must have logged in");
  }

  const {userId: targetId} = data;
  if (typeof targetId !== "string") {
    throw new Error(`User ID must be string but got ${typeof targetId}`);
  }

  if (!targetId) {
    throw new Error("User ID must be set");
  }

  const collUsers = db.collection("users");
  // const b = db.batch();
  const docUser = collUsers.doc(userId);
  const docTarget = collUsers.doc(targetId);
  await db.runTransaction(async (transaction) => {
    const docFollowing = docUser.collection("followings").doc(targetId);
    const pRemoveFollowing = transaction.delete(docFollowing);

    const docFollower = docTarget.collection("followers").doc(userId);
    const pRemoveFollower = transaction.delete(docFollower);

    await Promise.all([pRemoveFollowing, pRemoveFollower]);
  });

  // const ss = await collUsers.doc(targetId).get();
  // await collUsers.doc(userId).collection("followings").add(ss);
});
