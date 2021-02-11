import AgoraRTC, {
  ConnectionState,
  IAgoraRTCClient,
  IAgoraRTCRemoteUser,
  UID,
} from "agora-rtc-sdk-ng";
import { useEffect, useState } from "react";
import { noop } from "../misc/misc";
import { functions } from "../models/firebase";

export interface AgoraRemoteUser {
  id: UID;
  type: "LISTENER" | "SPEAKER";
}

const agoraAppId = process.env.REACT_APP_AGORA_APP_ID;

export async function joinAgoraChannel(
  client: IAgoraRTCClient,
  currentUserId: string,
  roomId: string
): Promise<void> {
  if (!agoraAppId) {
    throw new NoAgoraAppIdError();
  }

  const getToken = functions.httpsCallable("getToken");
  const { token } = (await getToken({ roomId })).data;

  await client.join(agoraAppId, roomId, token, currentUserId);
}

export async function leaveAgoraChannel(
  client: IAgoraRTCClient
): Promise<void> {
  await client.leave();
}
export function useAgoraClient(): IAgoraRTCClient | null {
  const [client, setClient] = useState<IAgoraRTCClient | null>(null);

  useEffect(() => {
    const newClient = AgoraRTC.createClient({ mode: "rtc", codec: "vp8" });
    setClient(newClient);
    return () => {
      if (newClient.localTracks.length > 0) {
        newClient.localTracks.forEach((v) => v.close());
        newClient.unpublish();
      }
      newClient.leave();
    };
  }, []);

  return client;
}

export function useAgoraConnectionState(
  client: IAgoraRTCClient | null
): ConnectionState | "" {
  const [state, setState] = useState<ConnectionState | "">("");

  useEffect(() => {
    setState("");
    if (!client) {
      return noop;
    }

    const listener = (newState: ConnectionState) => {
      setState(newState);
    };
    client.on("connection-state-change", listener);
    return () => client.off("connection-state-change", listener);
  }, [client]);

  return state;
}

export function useAgoraChannelParticipants(
  client: IAgoraRTCClient | null
): [IAgoraRTCRemoteUser[], IAgoraRTCRemoteUser[]] {
  const [users, setUsers] = useState<IAgoraRTCRemoteUser[]>([]);
  const [speakerIds, setSpeakerIds] = useState<UID[]>([]);

  useEffect(() => {
    if (!client) {
      return noop;
    }

    client.on("user-joined", onAgoraUserJoined);
    client.on("user-left", onAgoraUserLeft);
    client.on("user-published", onAgoraUserPublished);
    client.on("user-unpublished", onAgoraUserUnpublished);

    return () => {
      client.off("user-joined", onAgoraUserJoined);
      client.off("user-left", onAgoraUserLeft);
      client.off("user-published", onAgoraUserPublished);
      client.off("user-unpublished", onAgoraUserUnpublished);
    };

    function onAgoraUserJoined(user: IAgoraRTCRemoteUser) {
      setUsers([...users, user]);
    }

    function onAgoraUserLeft(user: IAgoraRTCRemoteUser) {
      setUsers(users.filter(({ uid }) => uid !== user.uid));
    }

    function onAgoraUserPublished(user: IAgoraRTCRemoteUser) {
      setSpeakerIds([...speakerIds, user.uid]);
    }

    function onAgoraUserUnpublished(user: IAgoraRTCRemoteUser) {
      setSpeakerIds(speakerIds.filter((v) => v !== user.uid));
    }
  }, [client, speakerIds, users]);

  return [
    users.filter((v) => speakerIds.includes(v.uid)),
    users.filter((v) => !speakerIds.includes(v.uid)),
  ];
}

class NoAgoraAppIdError extends Error {
  constructor() {
    super("Agora app ID must be prepared");
  }
}
