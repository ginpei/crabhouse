import { IAgoraRTCClient } from "agora-rtc-sdk-ng";
import { useState } from "react";
import { connect } from "react-redux";
import { Room } from "../../../models/Room";
import { User } from "../../../models/User";
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

const mapState = (state: AppState) => ({
  currentUserId: state.currentUserId,
});

const ControlPanelBase: React.FC<
  ReturnType<typeof mapState> & {
    agoraClient: IAgoraRTCClient;
    room: Room;
    user: User;
  }
> = ({ agoraClient, currentUserId, room, user }) => {
  useCurrentUserStore();
  const [muted, setMuted] = useState(true);

  const agoraState = useAgoraConnectionState(agoraClient);
  const [listening, left] = useAgoraChannelJoined(agoraClient);

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

  const onPlayClick = () => {
    if (!agoraClient) {
      throw new Error("Client must be prepared");
    }

    if (!user) {
      throw new Error("User data must be prepared");
    }

    if (!currentUserId) {
      throw new Error("User must have logged in");
    }

    if (!room) {
      throw new Error("Room must be fetched");
    }

    joinAgoraChannel(agoraClient, currentUserId, room);
  };

  const onStopClick = () => {
    if (!agoraClient) {
      throw new Error("Client must be prepared");
    }

    leaveAgoraChannel(agoraClient);
  };

  return (
    <div className="UserRoomPage-ControlPanel">
      <p>State: [{agoraState}]</p>
      <p
        className="MyRoomPage-ControlPanel-micIndicator"
        data-available={listening}
      >
        <label className="ui-center">
          <input
            checked={listening && !muted}
            disabled={!listening}
            name="muted"
            onChange={onSpeakClick}
            type="radio"
            value="false"
          />
          💬 Speak
        </label>
        <label className="ui-center">
          <input
            checked={listening && muted}
            disabled={!listening}
            name="muted"
            onChange={onMuteClick}
            type="radio"
            value="true"
          />
          🔇 Mute
        </label>
      </p>
      <WideNiceButton
        disabled={!left}
        className="UserRoomPage-playButton"
        onClick={onPlayClick}
      >
        <div className="UserRoomPage-playButtonIcon">▶️</div>
        <div className="UserRoomPage-playButtonLabel">Listen</div>
      </WideNiceButton>
      <p>
        <WideNiceButton disabled={!listening} onClick={onStopClick}>
          ⏹ Stop
        </WideNiceButton>
      </p>
    </div>
  );
};

export const ControlPanel = connect(mapState)(ControlPanelBase);
