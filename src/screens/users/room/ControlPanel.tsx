import { IAgoraRTCClient } from "agora-rtc-sdk-ng";
import { connect } from "react-redux";
import { User } from "../../../models/User";
import { WideNiceButton } from "../../../shared/pure/WideNiceButton";
import {
  joinAgoraChannel,
  leaveAgoraChannel,
  useAgoraConnectionState,
} from "../../../stores/agora";
import { AppState } from "../../../stores/appStore";
import { useCurrentUserStore } from "../../../stores/currentUser";

const mapState = (state: AppState) => ({
  currentUserId: state.currentUserId,
});

const ControlPanelBase: React.FC<
  ReturnType<typeof mapState> & { agoraClient: IAgoraRTCClient; user: User }
> = ({ agoraClient, currentUserId, user }) => {
  useCurrentUserStore();

  const agoraState = useAgoraConnectionState(agoraClient);

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

    joinAgoraChannel(agoraClient, currentUserId, user.id);
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
      <WideNiceButton
        disabled={agoraState !== "DISCONNECTED"}
        className="UserRoomPage-playButton"
        onClick={onPlayClick}
      >
        <div className="UserRoomPage-playButtonIcon">▶️</div>
        <div className="UserRoomPage-playButtonLabel">Listen</div>
      </WideNiceButton>
      <p>
        <WideNiceButton
          disabled={agoraState !== "CONNECTED"}
          onClick={onStopClick}
        >
          ⏹ Stop
        </WideNiceButton>
      </p>
    </div>
  );
};

export const ControlPanel = connect(mapState)(ControlPanelBase);
