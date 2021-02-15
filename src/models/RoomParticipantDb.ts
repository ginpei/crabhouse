import { useEffect, useState } from "react";
import { noop } from "../misc/misc";
import { CollectionReference, DocumentReference, functions } from "./firebase";
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

export async function leaveFromSession(roomId: string): Promise<void> {
  const f = functions.httpsCallable("leaveFromSession");
  await f({ roomId });
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
