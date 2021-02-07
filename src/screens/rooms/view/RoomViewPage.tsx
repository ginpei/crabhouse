import AgoraRTC from "agora-rtc-sdk-ng";
import { useEffect, useMemo, useState } from "react";
import { connect } from "react-redux";
import { useParams } from "react-router-dom";
import { useErrorLog } from "../../../misc/misc";
import { functions } from "../../../models/firebase";
import { saveRoom, useRoom } from "../../../models/RoomDb";
import { useUser } from "../../../models/UserDb";
import { LoadingScreen } from "../../../shared/pure/LoadingScreen";
import { NiceButton } from "../../../shared/pure/NiceButton";
import {
  useAgoraChannelParticipants,
  useAgoraClient,
  useAgoraConnectionState,
} from "../../../stores/agora";
import { AppState } from "../../../stores/appStore";
import { useCurrentUserStore } from "../../../stores/currentUser";
import { LoginPage } from "../../login/LoginPage";
import { BasicLayout } from "../../shared/BasicLayout";

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

  const [initialRoom, roomError] = useRoom(
    currentUserId ? params.roomId : null
  );
  const [room, setRoom] = useState(initialRoom);
  const [owner, ownerError] = useUser(room?.userId ?? null);
  const [updatingRoom, setUpdatingRoom] = useState(false);
  useCurrentUserStore();
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

  useEffect(() => {
    setRoom(initialRoom);
  }, [initialRoom]);

  const onOpenRoomClick = async () => {
    if (!room) {
      throw new Error();
    }

    // eslint-disable-next-line no-alert
    const ok = window.confirm("Are you ready to open?");
    if (!ok) {
      return;
    }

    setUpdatingRoom(true);
    try {
      const updatedRoom = await saveRoom({ ...room, state: "open" });
      setRoom(updatedRoom);
    } catch (err) {
      setError(err);
    } finally {
      setUpdatingRoom(false);
    }
  };

  const onCloseRoomClick = async () => {
    if (!room) {
      throw new Error();
    }

    // eslint-disable-next-line no-alert
    const ok = window.confirm("Are you sure you want to close this room?");
    if (!ok) {
      return;
    }

    setUpdatingRoom(true);
    try {
      const updatedRoom = await saveRoom({ ...room, state: "closed" });
      setRoom(updatedRoom);
    } catch (err) {
      setError(err);
    } finally {
      setUpdatingRoom(false);
    }
  };

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
    return <LoadingScreen />;
  }

  return (
    <BasicLayout className="RoomViewPage" title={room.name}>
      <h1>{room.name}</h1>
      <p>ID: {room.id}</p>
      <p>State: {room.state}</p>
      <p>Owner: {owner.name}</p>
      {room.state === "preparing" && (
        <p>
          <NiceButton disabled={updatingRoom} onClick={onOpenRoomClick}>
            🎉 Open room
          </NiceButton>
        </p>
      )}
      {room.state !== "closed" && (
        <p>
          <NiceButton disabled={updatingRoom} onClick={onCloseRoomClick}>
            👋 Close room
          </NiceButton>
        </p>
      )}
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
    </BasicLayout>
  );
};

const mapState = (state: AppState) => ({
  currentUserId: state.currentUserId,
});

export const RoomViewPage = connect(mapState)(RoomViewPageBase);
