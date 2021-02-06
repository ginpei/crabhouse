import AgoraRTC from "agora-rtc-sdk-ng";
import { useState } from "react";
import { connect } from "react-redux";
import { useParams } from "react-router-dom";
import { useErrorLog } from "../../../misc/misc";
import { useRoom } from "../../../models/RoomDb";
import { useUser } from "../../../models/UserDb";
import { useAgoraClient, useAgoraConnectionState } from "../../../stores/agora";
import { AppState } from "../../../stores/appStore";
import { useCurrentUserIdStore } from "../../../stores/currentUser";
import { BaseLayout } from "../../shared/BaseLayout";

const agoraAppId = process.env.REACT_APP_AGORA_APP_ID;
if (!agoraAppId) {
  throw new Error("Agora app ID must be prepared");
}

export function roomViewPagePath(roomId: string | null): string {
  return `/rooms/${roomId || ":roomId"}`;
}

const RoomViewPageBase: React.FC<ReturnType<typeof mapState>> = ({
  currentUserId,
}) => {
  const params = useParams<{ roomId: string }>();
  const [room, roomError] = useRoom(params.roomId);
  const [owner, ownerError] = useUser(room?.userId ?? null);
  const agoraClient = useAgoraClient();
  const agoraState = useAgoraConnectionState(agoraClient);
  const [published, setPublished] = useState(false);
  useCurrentUserIdStore();
  useErrorLog(roomError);
  useErrorLog(ownerError);

  const connected = agoraState !== "" && agoraState !== "DISCONNECTED";
  const disconnected = agoraState !== "CONNECTED";

  const onJoinClick = async () => {
    if (!room) {
      return;
    }

    const channel = room.id;
    const token = process.env.REACT_APP_AGORA_TOKEN || ""; // TODO

    const agoraUserId = await agoraClient?.join(agoraAppId, channel, token);
    // TODO remember this agora user is the app user
    console.log("# agoraUserId", agoraUserId);
  };

  const onLeaveClick = () => {
    setPublished(false);
    agoraClient?.leave();
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

    agoraClient.unpublish();
    setPublished(false);
  };

  // loading
  if (currentUserId === null || room === null || owner === null) {
    return null;
  }

  if (currentUserId === "") {
    throw new Error("User must have logged in");
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
    </BaseLayout>
  );
};

const mapState = (state: AppState) => ({
  currentUserId: state.currentUserId,
});

export const RoomViewPage = connect(mapState)(RoomViewPageBase);