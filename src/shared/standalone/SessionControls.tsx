import { Dispatch } from "@reduxjs/toolkit";
import { connect } from "react-redux";
import { useHistory } from "react-router-dom";
import { myRoomPagePath } from "../../screens/my/room/MyRoomPage";
import {
  leaveAgoraChannel,
  useAgoraChannelJoined,
  useAgoraClient,
} from "../../stores/agora";
import { appSlice, AppState } from "../../stores/appStore";
import { useCurrentUserStore } from "../../stores/currentUser";

const mapControlsState = (state: AppState) => ({
  currentUserId: state.currentUserId,
  playingSession: state.participatingSession,
  sessionPlayerVisible: state.sessionPlayerVisible,
});

const mapControlsDispatch = (dispatch: Dispatch) => ({
  hideSessionPlayer: () => dispatch(appSlice.actions.hideSessionPlayer()),
});

const SessionControlsBase: React.FC<
  ReturnType<typeof mapControlsState> & ReturnType<typeof mapControlsDispatch>
> = ({ currentUserId, hideSessionPlayer, playingSession }) => {
  useCurrentUserStore();
  const history = useHistory();

  const agoraClient = useAgoraClient();
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

  if (!listening && !left) {
    return (
      <div className="SessionPlayer-controls">
        <button className="SessionPlayer-button" disabled>
          <span className="SessionPlayer-spinner">*</span>
        </button>
      </div>
    );
  }

  if (ownRoom) {
    return (
      <div className="SessionPlayer-controls">
        <button
          className="SessionPlayer-button"
          onClick={onMyPageClick}
          title="My page"
        >
          🏠
        </button>
      </div>
    );
  }

  return (
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
    </div>
  );
};

export const SessionControls = connect(
  mapControlsState,
  mapControlsDispatch
)(SessionControlsBase);
