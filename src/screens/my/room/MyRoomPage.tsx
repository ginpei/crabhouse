import { connect } from "react-redux";
import { useErrorLog } from "../../../misc/misc";
import { useUser } from "../../../models/UserDb";
import { LoadingScreen } from "../../../shared/pure/LoadingScreen";
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

  const agoraClient = useAgoraClient();
  const [speakers, participants] = useAgoraChannelParticipants(agoraClient);

  if (currentUserId === null) {
    return <LoadingScreen />;
  }

  if (currentUserId === "" || currentUser === null) {
    return <LoginScreen title="My room" />;
  }

  return (
    <BasicLayout className="MyRoomPage" title="My room">
      <p>My room</p>
      <h1>{currentUser.name}'s room</h1>
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

const UserInline: React.FC<{ id: string }> = ({ id }) => {
  const [user, userError] = useUser(id);
  useErrorLog(userError);

  if (user === null) {
    return <>…</>;
  }

  return <span className="UserInline">{user.name}</span>;
};
