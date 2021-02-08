import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import "firebase/functions";
import { isProd } from "../misc/env";

export type DocumentReference<
  T = firebase.firestore.DocumentData
> = firebase.firestore.DocumentReference<T>;

export type DocumentSnapshot<
  T = firebase.firestore.DocumentData
> = firebase.firestore.DocumentSnapshot<T>;

export type CollectionReference<
  T = firebase.firestore.DocumentData
> = firebase.firestore.CollectionReference<T>;

export type Query<
  T = firebase.firestore.DocumentData
> = firebase.firestore.Query<T>;

export class Timestamp extends firebase.firestore.Timestamp {}

export const zeroTimestamp = new Timestamp(0, 0);

// eslint-disable-next-line import/no-mutable-exports, @typescript-eslint/no-explicit-any
export let auth: firebase.auth.Auth = null as any;
// eslint-disable-next-line import/no-mutable-exports, @typescript-eslint/no-explicit-any
export let db: firebase.firestore.Firestore = null as any;
// eslint-disable-next-line import/no-mutable-exports, @typescript-eslint/no-explicit-any
export let functions: firebase.functions.Functions = null as any;

export function initializeFirebase(): firebase.app.App {
  const existingApp = firebase.apps.find((v) => v.name === "[DEFAULT]");
  if (existingApp) {
    return existingApp;
  }

  const firebaseConfig = {
    apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
    authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
    storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.REACT_APP_FIREBASE_APP_ID,
  };
  const app = firebase.initializeApp(firebaseConfig);

  auth = app.auth();
  db = app.firestore();
  functions = app.functions();

  if (!isProd) {
    auth.useEmulator("http://localhost:9099");
    db.useEmulator("localhost", 8080);
    functions.useEmulator("localhost", 5001);
  }

  return app;
}

export function isTimestamp(obj: unknown): obj is Timestamp {
  return obj instanceof firebase.firestore.Timestamp;
}

// export function isFirebaseError(
//   error: unknown
// ): error is firebase.FirebaseError {
//   if (!(error instanceof Error)) {
//     return false;
//   }

//   const propNames = Object.getOwnPropertyNames(error);
//   if (!propNames.includes("code")) {
//     return false;
//   }

//   return true;
// }
