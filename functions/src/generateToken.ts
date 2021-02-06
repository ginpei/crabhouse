import { RtcTokenBuilder, RtcRole } from "agora-access-token";

// TODO find values from env
const appID = "";
const appCertificate = "";
const lifeTimeSec = 60 * 60; // 60 min in sec

/**
 * https://docs.agora.io/en/Voice/token_server?platform=All%20Platforms
 */
export function generateToken(channelName: string, uid: number): string {
  if (!appID) {
    throw new Error("Agora app ID is required")
  }

  if (!appCertificate) {
    throw new Error("Agora app certificate is required")
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
