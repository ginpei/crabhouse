import AgoraRTC, {
  ConnectionState,
  IAgoraRTCClient,
  IAgoraRTCRemoteUser,
  UID,
} from "agora-rtc-sdk-ng";
import { useEffect, useState } from "react";
import { functions } from "../models/firebase";
import { Room } from "../models/Room";
import { appSlice, appStore } from "./appStore";

// TODO delete
export interface AgoraRemoteUser {
  id: UID;
  type: "LISTENER" | "SPEAKER";
}

const agoraAppId = process.env.REACT_APP_AGORA_APP_ID;

let globalAgoraClient: IAgoraRTCClient | null = null;

export async function joinAgoraChannel(
  currentUserId: string,
  room: Room
): Promise<void> {
  const client = getClient();

  if (!agoraAppId) {
    throw new NoAgoraAppIdError();
  }

  if (client.connectionState !== "DISCONNECTED") {
    leaveAgoraChannel();
  }

  appStore.dispatch(appSlice.actions.setPlayingSession({ room }));
  try {
    const getRoomToken = functions.httpsCallable("getRoomToken");
    const { token } = (await getRoomToken({ roomId: room.id })).data;

    await client.join(agoraAppId, room.id, token, currentUserId);
  } catch (error) {
    appStore.dispatch(appSlice.actions.setPlayingSession({ room: null }));
    throw error;
  }
}

export async function leaveAgoraChannel(): Promise<void> {
  const client = getClient();

  await unpublishAgora();
  await client.leave();
}

export async function publishAgora(): Promise<void> {
  const client = getClient();

  const localAudioTrack = await AgoraRTC.createMicrophoneAudioTrack();
  await client.publish([localAudioTrack]);
}

export async function unpublishAgora(): Promise<void> {
  const client = getClient();

  if (client.localTracks.length > 0) {
    client.localTracks.forEach((v) => v.close());
    client.unpublish();
  }
}

export function useAgoraSound(): void {
  const client = getClient();

  useEffect(() => {
    client.on("user-published", onAgoraUserPublished);

    return () => {
      client.off("user-published", onAgoraUserPublished);
    };

    async function onAgoraUserPublished(
      user: IAgoraRTCRemoteUser,
      mediaType: "audio"
    ) {
      const remoteTrack = await client.subscribe(user, mediaType);
      remoteTrack.play();
    }
  }, [client]);
}

export function useAgoraConnectionState(): ConnectionState {
  const client = getClient();

  const [state, setState] = useState(client.connectionState);

  useEffect(() => {
    setState(client.connectionState);

    const listener = (newState: ConnectionState) => {
      setState(newState);
    };
    client.on("connection-state-change", listener);
    return () => client.off("connection-state-change", listener);
  }, [client]);

  return state;
}

/**
 * Both `opened` and `closed` can be `false` in the same time.
 * @example
 * const [opened, closed] = useAgoraChannelJoined(client);
 */
export function useAgoraChannelJoined(): [boolean, boolean] {
  const agoraState = useAgoraConnectionState();
  const [opened, setOpened] = useState(false);
  const [closed, setClosed] = useState(true);

  useEffect(() => {
    if (agoraState === "CONNECTED") {
      setOpened(true);
      setClosed(false);
    } else if (agoraState === "DISCONNECTED") {
      setOpened(false);
      setClosed(true);
    } else {
      // the other states like "CONNECTING"
      setOpened(false);
      setClosed(false);
    }
  }, [agoraState]);

  return [opened, closed];
}

export function useAgoraSpeaking(): boolean {
  const client = getClient();

  const [speaking, setSpeaking] = useState(false);

  useEffect(() => {
    const tm = setInterval(() => {
      setSpeaking(client.localTracks.length > 0);
    }, 100);
    return () => clearInterval(tm);
  }, [client]);

  return speaking;
}

export function useAgoraChannelParticipants(): [
  IAgoraRTCRemoteUser[],
  IAgoraRTCRemoteUser[]
] {
  const client = getClient();

  const [users, setUsers] = useState<IAgoraRTCRemoteUser[]>([]);
  const [speakerIds, setSpeakerIds] = useState<UID[]>([]);

  useEffect(() => {
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

function getClient(): IAgoraRTCClient {
  if (!globalAgoraClient) {
    const newClient = AgoraRTC.createClient({ mode: "rtc", codec: "vp8" });
    globalAgoraClient = newClient;
  }

  return globalAgoraClient;
}
