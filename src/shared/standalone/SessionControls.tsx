import { Dispatch } from "@reduxjs/toolkit";
import { useEffect } from "react";
import { connect } from "react-redux";
import { useHistory } from "react-router-dom";
import { noop } from "../../misc/misc";
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

  const processing = !listening && !left;
  const ownRoom = playingSession?.id === currentUserId;
  const inMyRoom = history.location.pathname === myRoomPagePath();

  useEffect(() => {
    if (left) {
      return noop;
    }

    window.onbeforeunload = () => "";
    return () => {
      window.onbeforeunload = null;
    };
  }, [left]);

  if (processing) {
    return (
      <div className="SessionPlayer-controls">
        <button className="SessionPlayer-button" disabled>
          <span className="SessionPlayer-spinner">*</span>
        </button>
      </div>
    );
  }

  if (left && (!ownRoom || inMyRoom)) {
    const onCloseClick = () => {
      hideSessionPlayer();
    };

    return (
      <div className="SessionPlayer-controls">
        <button
          className="SessionPlayer-button"
          onClick={onCloseClick}
          title="Close"
        >
          ❌
        </button>
      </div>
    );
  }

  if (ownRoom) {
    const onMyPageClick = () => {
      history.push(myRoomPagePath());
    };

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

  const onStopClick = () => {
    leaveAgoraChannel(agoraClient);
  };

  return (
    <div className="SessionPlayer-controls">
      <button
        className="SessionPlayer-button"
        onClick={onStopClick}
        title="Play"
      >
        ⏹
      </button>
    </div>
  );
};

export const SessionControls = connect(
  mapControlsState,
  mapControlsDispatch
)(SessionControlsBase);
