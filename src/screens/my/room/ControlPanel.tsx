import { ConnectionState, IAgoraRTCClient } from "agora-rtc-sdk-ng";
import { useEffect, useState } from "react";
import { connect } from "react-redux";
import { WideNiceButton } from "../../../shared/pure/WideNiceButton";
import {
  joinAgoraChannel,
  leaveAgoraChannel,
  publishAgora,
  unpublishAgora,
  useAgoraConnectionState,
} from "../../../stores/agora";
import { AppState } from "../../../stores/appStore";
import "./ControlPanel.scss";

const projectId = process.env.REACT_APP_FIREBASE_PROJECT_ID;
const agoraAppId = process.env.REACT_APP_AGORA_APP_ID;
if (!projectId || !agoraAppId) {
  throw new Error("Project ID and Agora app ID must be prepared");
}

const mapState = (state: AppState) => ({
  currentUserId: state.currentUserId,
});

const ControlPanelBase: React.FC<
  ReturnType<typeof mapState> & {
    agoraClient: IAgoraRTCClient;
  }
> = ({ agoraClient, currentUserId }) => {
  // it has intermediate state
  const [roomOpened, setRoomOpened] = useState(false);
  const [roomClosed, setRoomClosed] = useState(true);

  const [muted, setMuted] = useState(true);

  const agoraState = useAgoraConnectionState(agoraClient);

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

    joinAgoraChannel(agoraClient, currentUserId, currentUserId);
  };

  const onCloseRoomClick = async () => {
    if (!agoraClient) {
      throw new Error("Client must be prepared");
    }

    leaveAgoraChannel(agoraClient);
    setMuted(true);
  };

  useEffect(() => {
    if (agoraState === "CONNECTED") {
      setRoomOpened(true);
      setRoomClosed(false);
    } else if (agoraState === "DISCONNECTED") {
      setRoomOpened(false);
      setRoomClosed(true);
    }
    // and ignore the other states like "CONNECTING"
  }, [agoraState]);

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
