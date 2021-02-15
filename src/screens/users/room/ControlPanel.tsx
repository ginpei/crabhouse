import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { Room } from "../../../models/Room";
import { User } from "../../../models/User";
import { WideNiceButton } from "../../../shared/pure/WideNiceButton";
import { MicToggle } from "../../../shared/standalone/MicToggle";
import {
  joinAgoraChannel,
  leaveAgoraChannel,
  useAgoraChannelJoined,
  useAgoraConnectionState,
} from "../../../stores/agora";
import { AppState } from "../../../stores/appStore";
import { useCurrentUserStore } from "../../../stores/currentUser";
import { myRoomPagePath } from "../../my/room/MyRoomPage";

const mapState = (state: AppState) => ({
  currentUserId: state.currentUserId,
  participatingSession: state.participatingSession,
});

const ControlPanelBase: React.FC<
  ReturnType<typeof mapState> & {
    room: Room;
    user: User;
  }
> = ({ currentUserId, participatingSession, room, user }) => {
  useCurrentUserStore();
  const agoraState = useAgoraConnectionState();
  const [playing, stopped] = useAgoraChannelJoined();

  const listening = participatingSession?.id === room.id && playing;
  const left = participatingSession?.id !== room.id || stopped;

  const onPlayClick = () => {
    if (!user) {
      throw new Error("User data must be prepared");
    }

    if (!currentUserId) {
      throw new Error("User must have logged in");
    }

    if (!room) {
      throw new Error("Room must be fetched");
    }

    joinAgoraChannel(currentUserId, room);
  };

  const onStopClick = () => {
    if (!room) {
      throw new Error("Room must be fetched");
    }

    leaveAgoraChannel(room.id);
  };

  if (room.id === currentUserId) {
    return (
      <div className="UserRoomPage-ControlPanel">
        <p>
          <Link to={myRoomPagePath()}>⚙️ Go to control panel</Link>
        </p>
      </div>
    );
  }

  if (room.state !== "open" && room.state !== "live") {
    return (
      <div className="UserRoomPage-ControlPanel">
        <p>Room is not open.</p>
      </div>
    );
  }

  if (room.state !== "live") {
    const onWaitClick = () => {
      if (!currentUserId) {
        throw new Error("User must have logged in");
      }

      joinAgoraChannel(currentUserId, room);
    };

    const onStopWaitingClick = () => {
      if (!room) {
        throw new Error("Room must be fetched");
      }

      leaveAgoraChannel(room.id);
    };

    if (listening) {
      return (
        <div className="UserRoomPage-ControlPanel">
          <p>Waiting for start...</p>
          <p>
            <WideNiceButton onClick={onStopWaitingClick}>
              👋 Cancel waiting
            </WideNiceButton>
          </p>
        </div>
      );
    }

    return (
      <div className="UserRoomPage-ControlPanel">
        <p>This room is open, but streaming not yet started.</p>
        <p>
          <WideNiceButton
            className="UserRoomPage-playButton"
            onClick={onWaitClick}
          >
            <div className="UserRoomPage-playButtonIcon">▶️</div>
            <div className="UserRoomPage-playButtonLabel">Wait</div>
          </WideNiceButton>
          Line up and will start listening soon!
        </p>
      </div>
    );
  }

  return (
    <div className="UserRoomPage-ControlPanel">
      <p>State: [{agoraState}]</p>
      <MicToggle />
      <p>
        <WideNiceButton
          disabled={!left}
          className="UserRoomPage-playButton"
          onClick={onPlayClick}
        >
          <div className="UserRoomPage-playButtonIcon">▶️</div>
          <div className="UserRoomPage-playButtonLabel">Listen</div>
        </WideNiceButton>
      </p>
      <p>
        <WideNiceButton disabled={!listening} onClick={onStopClick}>
          ⏹ Stop
        </WideNiceButton>
      </p>
    </div>
  );
};

export const ControlPanel = connect(mapState)(ControlPanelBase);
