import { useEffect, useState } from "react";
import { DocumentSnapshot } from "./firebase";
import { createModelFunctions } from "./modelDbBase";
import { createRoom, Room } from "./Room";

export function ssToRoom(ss: DocumentSnapshot): Room {
  return createRoom({ ...ss.data(), id: ss.id });
}

export const [
  saveRoom,
  getRoom,
  getRoomCollection,
  getRoomDocument,
  useRoom,
] = createModelFunctions<Room>({
  collectionName: "rooms",
  ssToModel: ssToRoom,
});

export async function getOpenRooms(): Promise<Room[]> {
  const ss = await getRoomCollection()
    .where("state", "==", "open")
    .orderBy("updatedAt", "desc")
    .get();
  const rooms = ss.docs.map((v) => ssToRoom(v));
  return rooms;
}

export function useOpenRooms(): [Room[] | null, Error | null] {
  const [rooms, setRooms] = useState<Room[] | null>(null);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    getOpenRooms()
      .then((v) => setRooms(v))
      .catch((v) => setError(v));
  }, []);

  return [rooms, error];
}
