import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { useLiveRoomParticipants } from "../../../models/RoomParticipantDb";
import { LoadingScreen } from "../../../shared/pure/LoadingScreen";
import { LoginScreen } from "../../../shared/screens/LoginScreen";
import { MicToggle } from "../../../shared/standalone/MicToggle";
import { UserOneLine } from "../../../shared/UserOneLine";
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
      <div>
        {speakers.map((speaker) => (
          <UserOneLine key={speaker.id} user={speaker} />
        ))}
      </div>
      <h2>Reactions (0)</h2>
      <h2>Listeners ({listeners.length})</h2>
      <div>
        {listeners.map((listener) => (
          <UserOneLine key={listener.id} user={listener} />
        ))}
      </div>
    </BasicLayout>
  );
};

export const MyRoomPage = connect(mapState)(MyRoomPageBase);
