import * as functions from "firebase-functions";
import {RtcTokenBuilder, RtcRole} from "agora-access-token";

// TODO find values from env
const appID = functions.config().agora.app_id;
const appCertificate = functions.config().agora.app_certificate;
const lifeTimeSec = 60 * 60; // 60 min in sec

export const getToken = functions.https.onCall((data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError("permission-denied", "Not logged in");
  }

  const {channelName: rawChannelName} = data;
  const channelName = String(rawChannelName);
  if (!channelName) {
    throw new functions.https.HttpsError(
        "invalid-argument",
        "`channelName` is required"
    );
  }

  const uid = Math.floor(Math.random() * 2 ** 30);
  const token = generateToken(channelName, uid);

  return {channelName, token, uid};
});

/**
 * https://docs.agora.io/en/Voice/token_server?platform=All%20Platforms
 */
function generateToken(channelName: string, uid: number): string {
  if (!appID) {
    throw new Error("Agora app ID is required");
  }

  if (!appCertificate) {
    throw new Error("Agora app certificate is required");
  }

  if (uid === 0) {
    // 0 means for anyone. See document
    throw new Error("You cannot open token");
  }

  const role = RtcRole.PUBLISHER;
  const privilegeExpiredTs = Math.floor(Date.now() / 1000) + lifeTimeSec;

  const token = RtcTokenBuilder.buildTokenWithUid(
      appID,
      appCertificate,
      channelName,
      uid,
      role,
      privilegeExpiredTs
  );
  return token;
}
