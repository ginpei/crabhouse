import * as functions from "firebase-functions";
import {db} from "../firebase";

export const leaveFromSession = functions.https.onCall(
    async (data, context) => {
      const currentUserId = context.auth?.uid;
      if (!currentUserId) {
        throw new functions.https.HttpsError(
            "permission-denied",
            "Not logged in"
        );
      }

      const roomId = data.roomId;
      if (!roomId || typeof roomId !== "string") {
        throw new functions.https.HttpsError(
            "invalid-argument",
            "`roomId` is required"
        );
      }

      if (roomId === currentUserId) {
        closeRoom(currentUserId);
      } else {
        removeFromParticipantList(roomId, currentUserId);
      }
    }
);

/**
 */
async function closeRoom(currentUserId: string) {
  const docRoom = db
      .collection("rooms")
      .doc(currentUserId);
  const collParticipants = docRoom.collection("participants");
  const collReactions = docRoom.collection("reactions");

  await Promise.all([
    deleteCollection(collParticipants),
    deleteCollection(collReactions),
  ]);
}

/**
 */
async function deleteCollection(
    coll: FirebaseFirestore.CollectionReference
): Promise<void> {
  // this is not a good way tho
  // https://firebase.google.com/docs/firestore/solutions/delete-collections

  const ss = await coll.get();
  await Promise.all(ss.docs.map((v) => coll.doc(v.id).delete()));
}

/**
 */
async function removeFromParticipantList(
    roomId: string,
    currentUserId: string
) {
  await db
      .collection("rooms")
      .doc(roomId)
      .collection("participants")
      .doc(currentUserId).delete();
}
