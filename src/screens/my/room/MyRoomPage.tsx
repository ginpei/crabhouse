import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { useErrorLog } from "../../../misc/misc";
import { useLiveRoomParticipants } from "../../../models/RoomParticipantDb";
import { useUser } from "../../../models/UserDb";
import { LoadingScreen } from "../../../shared/pure/LoadingScreen";
import { LoginScreen } from "../../../shared/screens/LoginScreen";
import { MicToggle } from "../../../shared/standalone/MicToggle";
import { AppState } from "../../../stores/appStore";
import { useCurrentUserStore } from "../../../stores/currentUser";
import { BasicLayout } from "../../shared/BasicLayout";
import { userRoomPagePath } from "../../users/room/UserRoomPage";
import { userViewPagePath } from "../../users/UserViewPage";
import { myPagePath } from "../MyPage";
import "./MyRoomPage.scss";
import { RoomStateSection } from "./RoomStateSection";

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

  const [speakers, listeners] = useLiveRoomParticipants(currentUserId);

  if (currentUserId === null || speakers === null || listeners === null) {
    return <LoadingScreen />;
  }

  if (currentUserId === "" || currentUser === null) {
    return <LoginScreen title="My room" />;
  }

  return (
    <BasicLayout className="MyRoomPage" title="My room">
      <p>
        <Link to={userViewPagePath(currentUser.id)}>{currentUser.name}</Link>{" "}
        &gt; <Link to={userRoomPagePath(currentUserId)}>Room</Link> &gt; My room
      </p>
      <h1>{currentUser.name}'s room</h1>
      <RoomStateSection currentUserId={currentUserId} />
      <details open>
        <summary>Sound control</summary>
        <MicToggle />
      </details>
      <h2>Speakers ({speakers.length})</h2>
      <ul>
        {speakers.map((user) => (
          <li key={user.id}>
            <UserInline id={String(user.id)} />
          </li>
        ))}
      </ul>
      <h2>Reactions (0)</h2>
      <h2>Participants ({listeners.length})</h2>
      <ul>
        {listeners.map((user) => (
          <li key={user.id}>
            <UserInline id={String(user.id)} />
          </li>
        ))}
      </ul>
    </BasicLayout>
  );
};

export const MyRoomPage = connect(mapState)(MyRoomPageBase);

const UserInline: React.FC<{ id: string }> = ({ id }) => {
  const [user, userError] = useUser(id);
  useErrorLog(userError);

  if (user === null) {
    return <>…</>;
  }

  return <span className="UserInline">{user.name}</span>;
};
