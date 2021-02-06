import AgoraRTC from "agora-rtc-sdk-ng";
import { useMemo, useState } from "react";
import { connect } from "react-redux";
import { useParams } from "react-router-dom";
import { useErrorLog } from "../../../misc/misc";
import { functions } from "../../../models/firebase";
import { useRoom } from "../../../models/RoomDb";
import { useUser } from "../../../models/UserDb";
import {
  useAgoraChannelParticipants,
  useAgoraClient,
  useAgoraConnectionState,
} from "../../../stores/agora";
import { AppState } from "../../../stores/appStore";
import { useCurrentUserIdStore } from "../../../stores/currentUser";
import { LoginPage } from "../../login/LoginPage";
import { BaseLayout } from "../../shared/BaseLayout";

const projectId = process.env.REACT_APP_FIREBASE_PROJECT_ID;
const agoraAppId = process.env.REACT_APP_AGORA_APP_ID;
if (!projectId || !agoraAppId) {
  throw new Error("Project ID and Agora app ID must be prepared");
}

export function roomViewPagePath(roomId: string | null): string {
  return `/rooms/${roomId || ":roomId"}`;
}

const RoomViewPageBase: React.FC<ReturnType<typeof mapState>> = ({
  currentUserId,
}) => {
  const params = useParams<{ roomId: string }>();

  // any error
  const [error, setError] = useState<Error | null>(null);
  useErrorLog(error);

  const [room, roomError] = useRoom(currentUserId ? params.roomId : null);
  const [owner, ownerError] = useUser(room?.userId ?? null);
  useCurrentUserIdStore();
  useErrorLog(roomError);
  useErrorLog(ownerError);

  const agoraClient = useAgoraClient();
  const agoraState = useAgoraConnectionState(agoraClient);
  const [published, setPublished] = useState(false);
  const [speakers, listeners] = useAgoraChannelParticipants(agoraClient);
  // const [agoraUserId, setAgoraUserId] = useState<UID>("");
  const agoraUserId = useMemo(() => Math.floor(Math.random() * 2 ** 30), []);

  const connected = agoraState !== "" && agoraState !== "DISCONNECTED";
  const disconnected = agoraState !== "CONNECTED";

  const getToken = functions.httpsCallable("getToken");

  const onJoinClick = async () => {
    if (!room) {
      throw new Error("Room must be prepared");
    }

    if (!agoraClient) {
      throw new Error("Agora client must be prepared");
    }

    try {
      const channelName = room.id;
      const result = await getToken({ channelName });
      const { token, uid } = result.data;

      const id = await agoraClient.join(agoraAppId, channelName, token, uid);
      // eslint-disable-next-line no-console
      console.log("# id", id);
    } catch (err) {
      setError(err);
    }
  };

  const onLeaveClick = () => {
    if (!agoraClient) {
      throw new Error("Agora client must be prepared");
    }

    if (agoraClient.localTracks.length > 0) {
      agoraClient.localTracks.forEach((v) => v.close());
      agoraClient.unpublish();
    }
    agoraClient.leave();
    setPublished(false);
    // setAgoraUserId("");
  };

  const onPublishClick = async () => {
    if (!agoraClient) {
      throw new Error("Agora client must be prepared");
    }

    const localAudioTrack = await AgoraRTC.createMicrophoneAudioTrack();
    await agoraClient.publish([localAudioTrack]);
    setPublished(true);
  };

  const onUnpublishClick = () => {
    if (!agoraClient) {
      throw new Error("Agora client must be prepared");
    }

    if (agoraClient.localTracks.length > 0) {
      agoraClient.localTracks.forEach((v) => v.close());
      agoraClient.unpublish();
    }
    setPublished(false);
  };

  if (currentUserId === "") {
    return <LoginPage />;
  }

  // loading
  if (currentUserId === null || room === null || owner === null) {
    return null;
  }

  return (
    <BaseLayout className="RoomViewPage">
      <h1>{room.name}</h1>
      <p>ID: {room.id}</p>
      <p>Status: {room.status}</p>
      <p>Owner: {owner.name}</p>
      <hr />
      <p>
        <button disabled={connected} onClick={onJoinClick}>
          ▶️ Join
        </button>
        <button disabled={disconnected} onClick={onLeaveClick}>
          ⏹ Leave
        </button>
        {" | "}
        <button disabled={disconnected || published} onClick={onPublishClick}>
          🔊 Publish (unmute)
        </button>
        <button
          disabled={disconnected || !published}
          onClick={onUnpublishClick}
        >
          🔇 Unpublish (mute)
        </button>
      </p>
      <p>State: {agoraState}</p>
      <p>Speakers ({speakers.length}):</p>
      <ul>
        {published && <li>{agoraUserId}</li>}
        {speakers.map((speaker) => (
          <li key={speaker.uid}>{speaker.uid}</li>
        ))}
      </ul>
      <p>Listeners ({listeners.length}):</p>
      <ul>
        {connected && !published && agoraUserId && <li>{agoraUserId}</li>}
        {listeners.map((listener) => (
          <li key={listener.uid}>{listener.uid}</li>
        ))}
      </ul>
    </BaseLayout>
  );
};

const mapState = (state: AppState) => ({
  currentUserId: state.currentUserId,
});

export const RoomViewPage = connect(mapState)(RoomViewPageBase);
