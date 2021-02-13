import { ConnectionState, IAgoraRTCClient } from "agora-rtc-sdk-ng";
import { useState } from "react";
import { connect } from "react-redux";
import { useErrorLog } from "../../../misc/misc";
import { useRoom } from "../../../models/RoomDb";
import { WideNiceButton } from "../../../shared/pure/WideNiceButton";
import {
  joinAgoraChannel,
  leaveAgoraChannel,
  publishAgora,
  unpublishAgora,
  useAgoraChannelJoined,
  useAgoraConnectionState,
} from "../../../stores/agora";
import { AppState } from "../../../stores/appStore";
import { useCurrentUserStore } from "../../../stores/currentUser";
import "./ControlPanel.scss";

const mapState = (state: AppState) => ({
  currentUserId: state.currentUserId,
});

const ControlPanelBase: React.FC<
  ReturnType<typeof mapState> & {
    agoraClient: IAgoraRTCClient;
  }
> = ({ agoraClient, currentUserId }) => {
  useCurrentUserStore();
  const [muted, setMuted] = useState(true);

  const [room, roomError] = useRoom(currentUserId);
  useErrorLog(roomError);

  const agoraState = useAgoraConnectionState(agoraClient);
  const [roomOpened, roomClosed] = useAgoraChannelJoined(agoraClient);

  const onSpeakClick = async () => {
    if (!agoraClient) {
      throw new Error("Client must be prepared");
    }

    setMuted(false);
    await publishAgora(agoraClient);
  };

  const onMuteClick = async () => {
    if (!agoraClient) {
      throw new Error("Client must be prepared");
    }

    setMuted(true);
    await unpublishAgora(agoraClient);
  };

  const onOpenRoomClick = async () => {
    if (!agoraClient) {
      throw new Error("Client must be prepared");
    }

    if (!currentUserId) {
      throw new Error("User must have logged in");
    }

    if (!room) {
      throw new Error("Room must be fetched");
    }

    joinAgoraChannel(agoraClient, currentUserId, room);
  };

  const onCloseRoomClick = async () => {
    if (!agoraClient) {
      throw new Error("Client must be prepared");
    }

    leaveAgoraChannel(agoraClient);
    setMuted(true);
  };

  return (
    <div className="MyRoomPage-ControlPanel">
      <p>Agora [{agoraState}]</p>
      <p>
        Status: <RoomState state={agoraState} />
      </p>
      <p
        className="MyRoomPage-ControlPanel-micIndicator"
        data-available={roomOpened}
      >
        <label className="ui-center">
          <input
            checked={roomOpened && !muted}
            disabled={!roomOpened}
            name="muted"
            onChange={onSpeakClick}
            type="radio"
            value="false"
          />
          💬 Speak
        </label>
        <label className="ui-center">
          <input
            checked={roomOpened && muted}
            disabled={!roomOpened}
            name="muted"
            onChange={onMuteClick}
            type="radio"
            value="true"
          />
          🔇 Mute
        </label>
      </p>
      <p>
        <WideNiceButton disabled={roomOpened} onClick={onOpenRoomClick}>
          🎉 Open room
        </WideNiceButton>
      </p>
      <p>
        <WideNiceButton
          disabled={roomClosed}
          niceStyle="danger"
          onClick={onCloseRoomClick}
        >
          👋 Close room
        </WideNiceButton>
      </p>
    </div>
  );
};

export const ControlPanel = connect(mapState)(ControlPanelBase);

const RoomState: React.FC<{ state: ConnectionState | "" }> = ({ state }) => {
  if (state === "CONNECTED") {
    return (
      <strong>
        Broadcasting...
        <span className="MyRoomPage-speakerIcon">🔊</span>
      </strong>
    );
  }

  if (state === "CONNECTING" || state === "DISCONNECTING") {
    return <>…</>;
  }

  return <strong>Ready.</strong>;
};
