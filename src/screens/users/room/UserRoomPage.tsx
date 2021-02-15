import { connect } from "react-redux";
import { Link, useParams } from "react-router-dom";
import { useErrorLog } from "../../../misc/misc";
import { useLiveRoom } from "../../../models/RoomDb";
import { useLiveRoomParticipants } from "../../../models/RoomParticipantDb";
import { useUser } from "../../../models/UserDb";
import { LineLink } from "../../../shared/combination/LineLink";
import { LoadingScreen } from "../../../shared/pure/LoadingScreen";
import { LoginScreen } from "../../../shared/screens/LoginScreen";
import { AppState } from "../../../stores/appStore";
import { useCurrentUserStore } from "../../../stores/currentUser";
import { myRoomPagePath } from "../../my/room/MyRoomPage";
import { BasicLayout } from "../../shared/BasicLayout";
import { userViewPagePath } from "../UserViewPage";
import { ControlPanel } from "./ControlPanel";
import "./UserRoomPage.scss";

export function userRoomPagePath(userId: string | null): string {
  return `${userViewPagePath(userId)}room/`;
}

const mapState = (state: AppState) => ({
  currentUserId: state.currentUserId,
});

const UserRoomPageBase: React.FC<ReturnType<typeof mapState>> = ({
  currentUserId,
}) => {
  useCurrentUserStore();

  const { userId } = useParams<{ userId: string }>();
  const [user, userError] = useUser(userId);
  useErrorLog(userError);
  const [room, roomError] = useLiveRoom(userId);
  useErrorLog(roomError);

  const [speakers, listeners] = useLiveRoomParticipants(room?.id ?? null);

  const roomOpen = room?.state === "open" || room?.state === "live";

  if (
    currentUserId === null ||
    user === null ||
    room === null ||
    speakers === null ||
    listeners === null
  ) {
    return <LoadingScreen />;
  }

  if (currentUserId === "") {
    return <LoginScreen title={room.name} />;
  }

  if (room.id === currentUserId) {
    return (
      <BasicLayout className="UserRoomPage" title={room.name}>
        <p>
          <Link to={userViewPagePath(user.id)}>{user.name}</Link> &gt; Room
        </p>
        <h1>{room.name}</h1>
        <p>
          <Link to={myRoomPagePath()}>⚙️ Go to control panel</Link>
        </p>
      </BasicLayout>
    );
  }

  if (!roomOpen) {
    return (
      <BasicLayout className="UserRoomPage" title={room.name}>
        <p>
          <Link to={userViewPagePath(user.id)}>{user.name}</Link> &gt; Room
        </p>
        <h1>{room.name}</h1>
        <p>Room is not open now.</p>
        <p>Stay tuned and see you soon! 👋</p>
      </BasicLayout>
    );
  }

  return (
    <BasicLayout className="UserRoomPage" title={room.name}>
      <p>
        <Link to={userViewPagePath(user.id)}>{user.name}</Link> &gt; Room
      </p>
      <h1>{room.name}</h1>
      <ControlPanel room={room} user={user} />
      <h2>Speakers (0)</h2>
      <div>
        {speakers.map((speaker) => (
          <LineLink key={speaker.id} to={userViewPagePath(speaker.id)}>
            {speaker.name}
          </LineLink>
        ))}
      </div>
      <h2>Listeners (0)</h2>
      <div>
        {listeners.map((listener) => (
          <LineLink key={listener.id} to={userViewPagePath(listener.id)}>
            {listener.name}
          </LineLink>
        ))}
      </div>
    </BasicLayout>
  );
};

export const UserRoomPage = connect(mapState)(UserRoomPageBase);
