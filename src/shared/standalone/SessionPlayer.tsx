import { Dispatch } from "@reduxjs/toolkit";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { noop } from "../../misc/misc";
import { userRoomPagePath } from "../../screens/users/room/UserRoomPage";
import {
  leaveAgoraChannel,
  useAgoraChannelJoined,
  useAgoraClient,
} from "../../stores/agora";
import { appSlice, AppState } from "../../stores/appStore";
import "./SessionPlayer.scss";

// TODO
const usePlayingRoomStore = noop;

const mapState = (state: AppState) => ({
  playingSession: state.participatingSession,
  sessionPlayerVisible: state.sessionPlayerVisible,
});

const mapDispatch = (dispatch: Dispatch) => ({
  hideSessionPlayer: () => dispatch(appSlice.actions.hideSessionPlayer()),
});

const SessionPlayerBase: React.FC<
  ReturnType<typeof mapState> & ReturnType<typeof mapDispatch>
> = ({ hideSessionPlayer, playingSession, sessionPlayerVisible }) => {
  usePlayingRoomStore();

  const agoraClient = useAgoraClient();
  const [listening, left] = useAgoraChannelJoined(agoraClient);

  const onStopClick = () => {
    leaveAgoraChannel(agoraClient);
  };

  const onCloseClick = () => {
    hideSessionPlayer();
  };

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
        <div className="SessionPlayer-controls">
          {listening && (
            <button
              className="SessionPlayer-button"
              onClick={onStopClick}
              title="Play"
            >
              ⏹
            </button>
          )}
          {left && (
            <button
              className="SessionPlayer-button"
              onClick={onCloseClick}
              title="Close"
            >
              &times;
            </button>
          )}
          {!listening && !left && (
            <button className="SessionPlayer-button" disabled></button>
          )}
        </div>
      </div>
    </div>
  );
};

export const SessionPlayer = connect(mapState, mapDispatch)(SessionPlayerBase);
