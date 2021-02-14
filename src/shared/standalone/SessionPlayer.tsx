import { useEffect } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { userRoomPagePath } from "../../screens/users/room/UserRoomPage";
import {
  leaveAgoraChannel,
  useAgoraConnectionState,
  useAgoraSound,
} from "../../stores/agora";
import { AppState } from "../../stores/appStore";
import { SessionControls } from "./SessionControls";
import "./SessionPlayer.scss";

const mapState = (state: AppState) => ({
  playingSession: state.participatingSession,
  sessionPlayerVisible: state.sessionPlayerVisible,
});

const SessionPlayerBase: React.FC<ReturnType<typeof mapState>> = ({
  playingSession,
  sessionPlayerVisible,
}) => {
  const agoraState = useAgoraConnectionState();
  useAgoraSound();

  const roomOpen =
    playingSession?.state === "open" || playingSession?.state === "live";

  useEffect(() => {
    if (agoraState !== "DISCONNECTED" && !roomOpen) {
      leaveAgoraChannel();
    }
  }, [agoraState, roomOpen]);

  if (!playingSession || !sessionPlayerVisible) {
    return null;
  }

  return (
    <div className="SessionPlayer">
      <div className="SessionPlayer-inner">
        <Link
          className="SessionPlayer-room"
          to={userRoomPagePath(playingSession.id)}
        >
          {playingSession.name}
        </Link>
        <SessionControls />
      </div>
    </div>
  );
};

export const SessionPlayer = connect(mapState)(SessionPlayerBase);
