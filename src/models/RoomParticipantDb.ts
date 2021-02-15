import { useEffect, useState } from "react";
import { noop } from "../misc/misc";
import { CollectionReference, DocumentReference } from "./firebase";
import { getRoomDocument } from "./RoomDb";
import { User } from "./User";
import { ssToUser } from "./UserDb";

export function getRoomParticipantCollection(
  roomId: string
): CollectionReference {
  return getRoomDocument(roomId).collection("participants");
}

export function getRoomParticipantDocument(
  roomId: string,
  userId: string
): DocumentReference {
  return getRoomParticipantCollection(roomId).doc(userId);
}

export async function leaveFromRoom(
  roomId: string,
  userId: string
): Promise<void> {
  await getRoomParticipantDocument(roomId, userId).delete();
}

export function useLiveRoomParticipants(
  roomId: string | null
): [User[] | null, User[] | null] {
  const [speakers, setSpeakers] = useState<User[] | null>(null);
  const [listeners, setListeners] = useState<User[] | null>(null);

  useEffect(() => {
    setSpeakers(null);
    setListeners(null);

    if (roomId === null) {
      return noop;
    }

    return getRoomParticipantCollection(roomId).onSnapshot((ss) => {
      const participants = ss.docs.map((v) => ssToUser(v));
      setSpeakers([]);
      setListeners(participants);
    });
  }, [roomId]);

  return [speakers, listeners];
}
