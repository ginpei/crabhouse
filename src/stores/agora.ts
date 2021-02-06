import AgoraRTC, {
  ConnectionState,
  IAgoraRTCClient,
  IAgoraRTCRemoteUser,
  UID,
} from "agora-rtc-sdk-ng";
import { useEffect, useState } from "react";
import { noop } from "../misc/misc";

export interface AgoraRemoteUser {
  id: UID;
  type: "LISTENER" | "SPEAKER";
}

export function useAgoraClient(): IAgoraRTCClient | null {
  const [client, setClient] = useState<IAgoraRTCClient | null>(null);

  useEffect(() => {
    const newClient = AgoraRTC.createClient({ mode: "rtc", codec: "vp8" });
    setClient(newClient);
    return () => {
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
): [AgoraRemoteUser[]] {
  const [users, setUsers] = useState<AgoraRemoteUser[]>([]);

  useEffect(() => {
    setUsers([]);
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
      setUsers([...users, { id: user.uid, type: "LISTENER" }]);
    }

    function onAgoraUserLeft(user: IAgoraRTCRemoteUser) {
      setUsers(users.filter(({ id }) => id !== user.uid));
    }

    function onAgoraUserPublished(user: IAgoraRTCRemoteUser) {
      setUsers(
        users.map((v) => (v.id === user.uid ? { ...v, type: "SPEAKER" } : v))
      );
    }

    function onAgoraUserUnpublished(user: IAgoraRTCRemoteUser) {
      setUsers(
        users.map((v) => (v.id === user.uid ? { ...v, type: "LISTENER" } : v))
      );
    }
  }, [client, users]);

  return [users];
}
