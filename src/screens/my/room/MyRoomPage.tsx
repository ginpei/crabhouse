import { useEffect, useState } from "react";
import { connect } from "react-redux";
import { useErrorLog } from "../../../misc/misc";
import { getRoomStateLabel, Room } from "../../../models/Room";
import { saveRoom, useLiveRoom } from "../../../models/RoomDb";
import { useUser } from "../../../models/UserDb";
import { LoadingScreen } from "../../../shared/pure/LoadingScreen";
import { WideNiceButton } from "../../../shared/pure/WideNiceButton";
import { LoginScreen } from "../../../shared/screens/LoginScreen";
import {
  useAgoraChannelParticipants,
  useAgoraClient,
} from "../../../stores/agora";
import { AppState } from "../../../stores/appStore";
import { useCurrentUserStore } from "../../../stores/currentUser";
import { BasicLayout } from "../../shared/BasicLayout";
import { myPagePath } from "../MyPage";
import { ControlPanel } from "./ControlPanel";
import "./MyRoomPage.scss";

export function myRoomPagePath(): string {
  return `${myPagePath()}room/`;
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

  const [room, roomError] = useLiveRoom(currentUserId);
  useErrorLog(roomError);

  const agoraClient = useAgoraClient();
  const [speakers, participants] = useAgoraChannelParticipants(agoraClient);

  if (currentUserId === null || room === null) {
    return <LoadingScreen />;
  }

  if (currentUserId === "" || currentUser === null) {
    return <LoginScreen title="My room" />;
  }

  return (
    <BasicLayout className="MyRoomPage" title="My room">
      <p>My room</p>
      <h1>{currentUser.name}'s room</h1>
      <RoomStateSection room={room} />
      <h2>Sound control</h2>
      <ControlPanel agoraClient={agoraClient} />
      <h2>Speakers ({speakers.length})</h2>
      <ul>
        {speakers.map((user) => (
          <li key={user.uid}>
            <UserInline id={String(user.uid)} />
          </li>
        ))}
      </ul>
      <h2>Reactions (0)</h2>
      <h2>Participants ({participants.length})</h2>
      <ul>
        {participants.map((user) => (
          <li key={user.uid}>
            <UserInline id={String(user.uid)} />
          </li>
        ))}
      </ul>
    </BasicLayout>
  );
};

export const MyRoomPage = connect(mapState)(MyRoomPageBase);

const RoomStateSection: React.FC<{ room: Room }> = ({ room }) => {
  const [dirty, setDirty] = useState(false);

  const onClosedClick = () => {
    setDirty(true);
    saveRoom({ ...room, state: "closed" });
    // TODO stop streaming
  };

  const onOpenClick = () => {
    setDirty(true);
    saveRoom({ ...room, state: "open" });
  };

  const onLiveClick = () => {
    setDirty(true);
    saveRoom({ ...room, state: "live" });
    // TODO start streaming
  };

  useEffect(() => {
    setDirty(false);
  }, [room]);

  return (
    <details className="MyRoomPage-RoomStateSelect" open>
      <summary>
        Room state: {getRoomStateLabel(room)}
        {room.state === "live" && (
          <span className="MyRoomPage-speakerIcon">📡</span>
        )}
      </summary>
      <p>
        <WideNiceButton
          disabled={dirty || room.state === "closed"}
          onClick={onClosedClick}
        >
          🛌 Closed
        </WideNiceButton>
        Not available now
      </p>
      <p>
        <WideNiceButton
          disabled={dirty || room.state === "open"}
          onClick={onOpenClick}
        >
          🎉 Open
        </WideNiceButton>
        Can join but not sounds yet
      </p>
      <p>
        <WideNiceButton
          disabled={dirty || room.state === "live"}
          niceStyle="danger"
          onClick={onLiveClick}
        >
          📡 Live
        </WideNiceButton>
        Can join and listen!
      </p>
    </details>
  );
};

const UserInline: React.FC<{ id: string }> = ({ id }) => {
  const [user, userError] = useUser(id);
  useErrorLog(userError);

  if (user === null) {
    return <>…</>;
  }

  return <span className="UserInline">{user.name}</span>;
};
