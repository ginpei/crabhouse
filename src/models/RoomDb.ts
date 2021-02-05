import { useEffect, useState } from "react";
import { AppError } from "./AppError";
import { DocumentData } from "./DataRecord";
import { CollectionReference, db, DocumentReference } from "./firebase";
import { createRoom, Room } from "./Room";

export async function saveRoom(room: Room): Promise<Room> {
  const data = roomToDocumentData(room);

  if (room.id) {
    const doc = getRoomDocument(room.id);
    await doc.set(data);
    return room;
  }

  const coll = getRoomCollection();
  const doc = await coll.add(data);
  const newSs = await doc.get();
  const newRoom = createRoom({ ...newSs.data(), id: newSs.id });
  return newRoom;
}

export async function getRoom(roomId: string): Promise<Room> {
  const doc = getRoomDocument(roomId);
  const ss = await doc.get();
  if (!ss.exists) {
    throw new AppError(`Room "${roomId}" is not found`, "document-not-found");
  }

  const room = createRoom({ ...ss.data(), id: ss.id });
  return room;
}

export function useRoom(roomId: string): [Room | null, Error | null] {
  const [room, setRoom] = useState<Room | null>(null);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    setRoom(null);
    setError(null);

    if (roomId === null) {
      return;
    }

    getRoom(roomId)
      .then((v) => setRoom(v))
      .catch((v) => setError(v));
  }, [roomId]);

  return [room, error];
}

export function getRoomCollection(): CollectionReference {
  return db.collection("rooms");
}

export function getRoomDocument(roomId: string): DocumentReference {
  return getRoomCollection().doc(roomId);
}

export function roomToDocumentData(room: Room): DocumentData<Room> {
  const { id, ...data } = room;
  return data;
}
