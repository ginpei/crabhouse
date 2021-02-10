import * as functions from "firebase-functions";
import {generateToken} from "./generateToken";
export * from "./follow";

// Start writing Firebase Functions
// https://firebase.google.com/docs/functions/typescript

export const helloWorld = functions.https.onRequest((request, response) => {
  functions.logger.info("Hello logs!", {structuredData: true});
  response.send("Hello from Firebase!");
});

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
