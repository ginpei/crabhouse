import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { userRoomPagePath } from "../../screens/users/room/UserRoomPage";
import { useAgoraClient, useAgoraSound } from "../../stores/agora";
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
  const agoraClient = useAgoraClient();
  useAgoraSound(agoraClient);

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
