import { useState } from "react";
import { connect } from "react-redux";
import {
  useAgoraChannelJoined,
  useAgoraConnectionState,
} from "../../../../data/agora";
import { joinRoom, leaveRoom } from "../../../../data/agoraRoom";
import { AppState } from "../../../../data/appStore";
import { useCurrentUserStore } from "../../../../data/currentUser";
import { raiseHands } from "../../../../data/ReactionDb";
import { Room } from "../../../../data/Room";
import { User } from "../../../../data/User";
import { NiceButton } from "../../../pure/NiceButton";
import { WideNiceButton } from "../../../pure/WideNiceButton";
import { MicToggle } from "../../../standalone/MicToggle";

const mapState = (state: AppState) => ({
  currentUser: state.currentUser,
  currentUserId: state.currentUserId,
  participatingSession: state.participatingSession,
});

const ControlPanelBase: React.FC<
  ReturnType<typeof mapState> & {
    room: Room;
    user: User;
  }
> = ({ currentUser, currentUserId, participatingSession, room, user }) => {
  useCurrentUserStore();
  const agoraState = useAgoraConnectionState();
  const [playing, stopped] = useAgoraChannelJoined();

  const listening = participatingSession?.id === room.id && playing;
  const left = participatingSession?.id !== room.id || stopped;

  const onPlayClick = () => {
    // TODO remove or use
    if (!user) {
      throw new Error("User data must be prepared");
    }

    if (!currentUserId) {
      throw new Error("User must have logged in");
    }

    if (!room) {
      throw new Error("Room must be fetched");
    }

    joinRoom(currentUserId, room);
  };

  const onStopClick = () => {
    if (!room) {
      throw new Error("Room must be fetched");
    }

    leaveRoom(room.id);
  };

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

      joinRoom(currentUserId, room);
    };

    const onStopWaitingClick = () => {
      if (!room) {
        throw new Error("Room must be fetched");
      }

      leaveRoom(room.id);
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

  if (listening) {
    return <ListenerControlPanel room={room} user={currentUser} />;
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

const ListenerControlPanel: React.FC<{ room: Room; user: User | null }> = ({
  room,
  user,
}) => {
  const [updating, setUpdating] = useState(false);

  const onRaiseHandsClick = async () => {
    setUpdating(true);
    await raiseHands(room.id);
    setUpdating(false);
  };

  const onLeaveClick = () => {
    setUpdating(true);
    leaveRoom(room.id);
  };

  return (
    <div className="ListenerControlPanel">
      <p>Listening...</p>
      <p>
        <NiceButton disabled={updating} onClick={onRaiseHandsClick}>
          🙌 Raise hands
        </NiceButton>
      </p>
      <hr />
      <p>
        <WideNiceButton disabled={updating} onClick={onLeaveClick}>
          ⏹ Leave
        </WideNiceButton>
      </p>
    </div>
  );
};
