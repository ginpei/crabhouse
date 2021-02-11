import { useState } from "react";
import { connect } from "react-redux";
import { sleep } from "../../../misc/misc";
import { LoadingScreen } from "../../../shared/pure/LoadingScreen";
import { NiceButton } from "../../../shared/pure/NiceButton";
import { WideNiceButton } from "../../../shared/pure/WideNiceButton";
import { LoginScreen } from "../../../shared/screens/LoginScreen";
import { AppState } from "../../../stores/appStore";
import { useCurrentUserStore } from "../../../stores/currentUser";
import { BasicLayout } from "../../shared/BasicLayout";
import { myPagePath } from "../MyPage";
import "./MyRoomPage.scss";

export function myRoomPagePath(): string {
  return `${myPagePath()}/room`;
}

const mapState = (state: AppState) => ({
  currentUser: state.currentUser,
  currentUserId: state.currentUserId,
});

const MyRoomPageBase: React.FC<ReturnType<typeof mapState>> = ({
  currentUser,
  currentUserId,
}) => {
  useCurrentUserStore();
  const [roomOpened, setRoomOpened] = useState(false);
  const [muted, setMuted] = useState(false);
  const [updatingRoom, setUpdatingRoom] = useState(false);

  const onUnmuteClick = async () => {
    setMuted(false);
  };

  const onMuteClick = async () => {
    setMuted(true);
  };

  const onOpenRoomClick = async () => {
    setUpdatingRoom(true);
    await sleep(1000);
    setRoomOpened(true);
    setUpdatingRoom(false);
  };

  const onCloseRoomClick = async () => {
    setUpdatingRoom(true);
    await sleep(1000);
    setRoomOpened(false);
    setUpdatingRoom(false);
  };

  if (currentUserId === null) {
    return <LoadingScreen />;
  }

  if (currentUserId === "") {
    return <LoginScreen title="My room" />;
  }

  return (
    <BasicLayout className="MyRoomPage" title="My room">
      <h1>My room</h1>
      <p>
        {"Status: "}
        {roomOpened ? (
          <strong>
            Broadcasting...
            <span className="MyRoomPage-speakerIcon">🔊</span>
          </strong>
        ) : (
          <strong>Ready.</strong>
        )}
      </p>
      <p className="MyRoomPage-controlPanel">
        <span className="ui-center">{muted ? "🔇" : "🔊"}</span>
        <NiceButton disabled={!roomOpened || !muted} onClick={onUnmuteClick}>
          🔊 Unmute
        </NiceButton>
        <NiceButton disabled={!roomOpened || muted} onClick={onMuteClick}>
          🔇 Mute
        </NiceButton>
      </p>
      <p>
        <WideNiceButton
          disabled={roomOpened || updatingRoom}
          onClick={onOpenRoomClick}
        >
          🎉 Open room
        </WideNiceButton>
      </p>
      <p>
        <WideNiceButton
          disabled={!roomOpened || updatingRoom}
          niceStyle="danger"
          onClick={onCloseRoomClick}
        >
          👋 Close room
        </WideNiceButton>
      </p>
      <h2>Speakers (0)</h2>
      <h2>Reactions (0)</h2>
      <h2>Participants (0)</h2>
    </BasicLayout>
  );
};

export const MyRoomPage = connect(mapState)(MyRoomPageBase);
