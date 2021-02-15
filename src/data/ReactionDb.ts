import firebase from "firebase/app";
import { useEffect, useState } from "react";
import { noop } from "../misc/misc";
import { ssToDataRecord } from "./DataRecordDb";
import {
  auth,
  CollectionReference,
  DocumentReference,
  DocumentSnapshot,
} from "./firebase";
import {
  createModelFunctions,
  defaultModelToDocumentData,
} from "./modelDbBase";
import { createReaction, Reaction } from "./Reaction";
import { getRoomDocument } from "./RoomDb";

// TODO use createModelFunctions()

export function ssToReaction(ss: DocumentSnapshot): Reaction {
  return createReaction({ ...ss.data(), ...ssToDataRecord(ss) });
}

export function getReactionCollection(roomId: string): CollectionReference {
  return getRoomDocument(roomId).collection("reactions");
}

export function getReactionDocument(
  roomId: string,
  reactionId: string
): DocumentReference {
  return getReactionCollection(roomId).doc(reactionId);
}

export async function saveReaction(model: Reaction): Promise<Reaction> {
  const data = defaultModelToDocumentData(model);
  const now = firebase.firestore.FieldValue.serverTimestamp();

  if (model.id) {
    // User can create with ID
    const createdAt = data.createdAt.toMillis() === 0 ? now : data.createdAt;

    const doc = getReactionDocument(model.roomId, model.id);
    await doc.set({ ...data, createdAt, updatedAt: now });
    return model;
  }

  const coll = getReactionCollection(model.roomId);
  const doc = await coll.add({
    ...data,
    createdAt: now,
    updatedAt: now,
  });
  const newSs = await doc.get();
  const newModel = ssToReaction(newSs);
  return newModel;
}

export async function raiseHands(roomId: string): Promise<void> {
  const userId = auth.currentUser?.uid;
  if (!userId) {
    throw new Error("User must have logged in");
  }

  const reaction = createReaction({
    roomId,
    type: "raiseHands",
    userId,
  });

  await saveReaction(reaction);
}

export function useLiveReactionCollection(
  roomId: string | null
): Reaction[] | null {
  const [items, setItems] = useState<Reaction[] | null>(null);

  useEffect(() => {
    setItems(null);

    if (!roomId) {
      return noop;
    }

    const query = getReactionCollection(roomId).orderBy("createdAt", "desc");
    return query.onSnapshot((ss) => {
      const newItems = ss.docs.map((v) => ssToReaction(v));
      setItems(newItems);
    });
  }, [roomId]);

  return items;
}

export const [
  // saveReaction,
  getReaction,
  // getReactionCollection,
  // getReactionDocument,
  useReaction,
  useLiveReaction,
] = createModelFunctions<Reaction>({
  collectionName: "reactions",
  ssToModel: ssToReaction,
});
