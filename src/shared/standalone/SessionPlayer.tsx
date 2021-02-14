import { Dispatch } from "@reduxjs/toolkit";
import { connect } from "react-redux";
import { Link, useHistory } from "react-router-dom";
import { noop } from "../../misc/misc";
import { myRoomPagePath } from "../../screens/my/room/MyRoomPage";
import { userRoomPagePath } from "../../screens/users/room/UserRoomPage";
import {
  leaveAgoraChannel,
  useAgoraChannelJoined,
  useAgoraClient,
  useAgoraSound,
} from "../../stores/agora";
import { appSlice, AppState } from "../../stores/appStore";
import "./SessionPlayer.scss";

// TODO
const usePlayingRoomStore = noop;

const mapState = (state: AppState) => ({
  currentUserId: state.currentUserId,
  playingSession: state.participatingSession,
  sessionPlayerVisible: state.sessionPlayerVisible,
});

const mapDispatch = (dispatch: Dispatch) => ({
  hideSessionPlayer: () => dispatch(appSlice.actions.hideSessionPlayer()),
});

const SessionPlayerBase: React.FC<
  ReturnType<typeof mapState> & ReturnType<typeof mapDispatch>
> = ({
  currentUserId,
  hideSessionPlayer,
  playingSession,
  sessionPlayerVisible,
}) => {
  const history = useHistory();
  usePlayingRoomStore();

  const agoraClient = useAgoraClient();
  useAgoraSound(agoraClient);
  const [listening, left] = useAgoraChannelJoined(agoraClient);

  const ownRoom = playingSession?.id === currentUserId;

  const onMyPageClick = () => {
    history.push(myRoomPagePath());
  };

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
          {ownRoom && (listening || left) && (
            <button
              className="SessionPlayer-button"
              onClick={onMyPageClick}
              title="My page"
            >
              🏠
            </button>
          )}
          {!ownRoom && listening && (
            <button
              className="SessionPlayer-button"
              onClick={onStopClick}
              title="Play"
            >
              ⏹
            </button>
          )}
          {!ownRoom && left && (
            <button
              className="SessionPlayer-button"
              onClick={onCloseClick}
              title="Close"
            >
              &times;
            </button>
          )}
          {!listening && !left && (
            <button className="SessionPlayer-button" disabled>
              <span className="SessionPlayer-spinner">*</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export const SessionPlayer = connect(mapState, mapDispatch)(SessionPlayerBase);
