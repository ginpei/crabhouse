import * as functions from "firebase-functions";
import {db} from "../firebase";

// TODO reflect user profile update

export const follow = functions.https.onCall(async (data, context) => {
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
    const pAddFollowings = transaction.get(docTarget).then((ssTarget) => {
      transaction.set(
          docUser.collection("followings").doc(targetId),
          ssTarget.data()
      );
    });

    const pAddFollower = transaction.get(docUser).then((ssUser) => {
      transaction.set(
          docTarget.collection("followers").doc(userId),
          ssUser.data()
      );
    });

    await Promise.all([pAddFollowings, pAddFollower]);
  });

  // const ss = await collUsers.doc(targetId).get();
  // await collUsers.doc(userId).collection("followings").add(ss);
});
