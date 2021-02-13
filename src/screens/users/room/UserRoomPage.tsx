import { connect } from "react-redux";
import { useParams } from "react-router-dom";
import { useErrorLog } from "../../../misc/misc";
import { useUser } from "../../../models/UserDb";
import { LoadingScreen } from "../../../shared/pure/LoadingScreen";
import { LoginScreen } from "../../../shared/screens/LoginScreen";
import { useAgoraClient } from "../../../stores/agora";
import { AppState } from "../../../stores/appStore";
import { useCurrentUserStore } from "../../../stores/currentUser";
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

  const agoraClient = useAgoraClient();

  const { userId } = useParams<{ userId: string }>();
  const [user, userError] = useUser(userId);
  useErrorLog(userError);

  if (currentUserId === null || user === null) {
    return <LoadingScreen />;
  }

  const title = `${user.name}'s room`;

  if (currentUserId === "") {
    return <LoginScreen title={title} />;
  }

  return (
    <BasicLayout className="UserRoomPage" title={title}>
      <h1>{title}</h1>
      <ControlPanel agoraClient={agoraClient} user={user} />
      <h2>Speakers (0)</h2>
      <h2>Participants (0)</h2>
    </BasicLayout>
  );
};

export const UserRoomPage = connect(mapState)(UserRoomPageBase);
