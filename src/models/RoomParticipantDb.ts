import { useEffect, useState } from "react";
import { noop } from "../misc/misc";
import {
  callCloudFunction,
  CollectionReference,
  DocumentReference,
} from "./firebase";
import { getRoomDocument } from "./RoomDb";
import { User } from "./User";
import { ssToUser } from "./UserDb";

export function getRoomParticipantCollection(
  roomId: string
): CollectionReference {
  if (roomId === "") {
    throw new Error("Room ID must not be empty");
  }

  return getRoomDocument(roomId).collection("participants");
}

export function getRoomParticipantDocument(
  roomId: string,
  userId: string
): DocumentReference {
  if (userId === "") {
    throw new Error("User ID must not be empty");
  }

  return getRoomParticipantCollection(roomId).doc(userId);
}

export async function leaveFromSession(roomId: string): Promise<void> {
  await callCloudFunction("leaveFromSession", { roomId });
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
