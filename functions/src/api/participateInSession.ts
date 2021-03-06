import * as functions from "firebase-functions";
import {RtcTokenBuilder, RtcRole} from "agora-access-token";
import {db} from "../firebase";

if (!functions.config().agora) {
  // see README.md
  throw new Error("Config must be set; `functions.config().agora`");
}
const appID = functions.config().agora.app_id;
const appCertificate = functions.config().agora.app_certificate;
const lifeTimeSec = 60 * 60; // 60 min in sec

export const participateInSession = functions.https.onCall(
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

      const isOwner = currentUserId === roomId;
      if (!isOwner && !isOpenRoom(roomId)) {
        throw new functions.https.HttpsError(
            "failed-precondition",
            "Room is not open"
        );
      }

      await addUserToParticipantList(roomId, currentUserId);

      // const uid = Math.floor(Math.random() * 2 ** 30);
      const token = generateToken(roomId, currentUserId);

      return {roomId, token, userId: currentUserId};
    });

/**
 * @param roomId ID
 */
async function isOpenRoom(roomId: string): Promise<boolean> {
  const ss = await db.collection("rooms").doc(roomId).get();
  const roomState = ss.data()?.state ?? "";
  return roomState !== "open" && roomState !== "live";
}

/**
 * Clone user data to participant list.
 */
async function addUserToParticipantList(roomId: string, currentUserId: string) {
  const ssUser = await db
      .collection("users")
      .doc(currentUserId)
      .get();
  const userData = ssUser.data();
  if (!userData) {
    throw new functions.https.HttpsError(
        "failed-precondition",
        "User data must exist"
    );
  }

  await db
      .collection("rooms")
      .doc(roomId)
      .collection("participants")
      .doc(currentUserId)
      .set(userData);
}

/**
 * https://docs.agora.io/en/Voice/token_server?platform=All%20Platforms
 */
function generateToken(channelName: string, userId: string): string {
  if (!appID) {
    throw new Error("Agora app ID is required");
  }

  if (!appCertificate) {
    throw new Error("Agora app certificate is required");
  }

  if (!channelName) {
    throw new functions.https.HttpsError(
        "invalid-argument",
        "Channel name is required"
    );
  }

  if (!userId) {
    throw new functions.https.HttpsError(
        "invalid-argument",
        "User ID is required"
    );
  }

  const role = RtcRole.PUBLISHER;
  const privilegeExpiredTs = Math.floor(Date.now() / 1000) + lifeTimeSec;

  const token = RtcTokenBuilder.buildTokenWithAccount(
      appID,
      appCertificate,
      channelName,
      userId,
      role,
      privilegeExpiredTs
  );
  return token;
}
