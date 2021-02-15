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

      await db
          .collection("rooms")
          .doc(roomId)
          .collection("participants")
          .doc(currentUserId).delete();
    }
);
