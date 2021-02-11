import { useEffect, useState } from "react";
import { connect } from "react-redux";
import { WideNiceButton } from "../../../shared/pure/WideNiceButton";
import {
  joinAgoraChannel,
  leaveAgoraChannel,
  useAgoraClient,
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

const ControlPanelBase: React.FC<ReturnType<typeof mapState>> = ({
  currentUserId,
}) => {
  const [roomOpened, setRoomOpened] = useState(false);
  const [muted, setMuted] = useState(false);
  const [updatingRoom, setUpdatingRoom] = useState(false);

  const agoraClient = useAgoraClient();
  const agoraState = useAgoraConnectionState(agoraClient);

  const onUnmuteClick = async () => {
    setMuted(false);
  };

  const onMuteClick = async () => {
    setMuted(true);
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
  };

  useEffect(() => {
    if (agoraState === "CONNECTED") {
      setRoomOpened(true);
    } else if (agoraState === "DISCONNECTED") {
      setRoomOpened(false);
    }
  }, [agoraState]);

  return (
    <div className="MyRoomPage-ControlPanel">
      <p>Agora [{agoraState}]</p>
      <p>
        {"Status: "}
        {roomOpened ? (
          <strong>
            Broadcasting...
            <span className="MyRoomPage-speakerIcon">🔊</span>
          </strong>
        ) : (
          <strong>Ready.</strong>
        )}
      </p>
      <p className="MyRoomPage-ControlPanel-micIndicator">
        <label className="NiceButton">
          <input
            checked={roomOpened && !muted}
            name="muted"
            onChange={onUnmuteClick}
            type="radio"
            value="false"
          />
          💬 Speak
        </label>
        <label className="NiceButton">
          <input
            checked={roomOpened && muted}
            name="muted"
            onChange={onMuteClick}
            type="radio"
            value="true"
          />
          🔇 Mute
        </label>
      </p>
      <p>
        <WideNiceButton
          disabled={roomOpened || updatingRoom}
          onClick={onOpenRoomClick}
        >
          🎉 Open room
        </WideNiceButton>
      </p>
      <p>
        <WideNiceButton
          disabled={!roomOpened || updatingRoom}
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
