import { useEffect } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { useErrorLog } from "../../misc/misc";
import { useLiveRoom } from "../../models/RoomDb";
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
  currentUserId: state.currentUserId,
  playingSession: state.participatingSession,
  sessionPlayerVisible: state.sessionPlayerVisible,
});

const SessionPlayerBase: React.FC<ReturnType<typeof mapState>> = ({
  currentUserId,
  playingSession,
  sessionPlayerVisible,
}) => {
  const agoraState = useAgoraConnectionState();
  useAgoraSound();

  const [room, roomError] = useLiveRoom(playingSession?.id ?? null);
  useErrorLog(roomError);
  const roomOpen = room?.state === "open" || room?.state === "live";

  useEffect(() => {
    if (!room) {
      return;
    }

    if (agoraState !== "DISCONNECTED" && !roomOpen) {
      leaveAgoraChannel(room.id);
    }
  }, [agoraState, currentUserId, room, roomOpen]);

  if (!room || !sessionPlayerVisible) {
    return null;
  }

  return (
    <div className="SessionPlayer">
      <div className="SessionPlayer-inner">
        <Link className="SessionPlayer-room" to={userRoomPagePath(room.id)}>
          {room.name}
        </Link>
        <SessionControls />
      </div>
    </div>
  );
};

export const SessionPlayer = connect(mapState)(SessionPlayerBase);
