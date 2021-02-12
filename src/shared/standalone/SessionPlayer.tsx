import { useState } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { noop } from "../../misc/misc";
import { createRoom, Room } from "../../models/Room";
import { userRoomPagePath } from "../../screens/users/room/UserRoomPage";
import { AppState } from "../../stores/appStore";
import "./SessionPlayer.scss";

// TODO
const usePlayingRoomStore = noop;

const mapState = (state: AppState) => ({
  playingRoom: createRoom({
    id: "bP8WFpCeqNyIZgGNOzOOQ0b6g5sn",
    name: "Demo room",
  }) as Room | null,
});

const SessionPlayerBase: React.FC<ReturnType<typeof mapState>> = ({
  playingRoom,
}) => {
  usePlayingRoomStore();
  const [stopped, setStopped] = useState(false); // TODO replace with impl

  const onStopClick = () => {
    setStopped(true); // demo
  };

  const onCloseClick = () => {
    console.log(`# close`);
    // TODO update store
  };

  if (!playingRoom) {
    return null;
  }

  return (
    <div className="SessionPlayer">
      <div className="SessionPlayer-inner">
        <Link
          className="SessionPlayer-room"
          to={userRoomPagePath(playingRoom.id)}
        >
          {playingRoom.name}
        </Link>
        <div className="SessionPlayer-controls">
          {stopped ? (
            <button
              className="SessionPlayer-button"
              onClick={onCloseClick}
              title="Close"
            >
              &times;
            </button>
          ) : (
            <button
              className="SessionPlayer-button"
              onClick={onStopClick}
              title="Play"
            >
              ⏹
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export const SessionPlayer = connect(mapState)(SessionPlayerBase);
