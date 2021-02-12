import { connect } from "react-redux";
import { useParams } from "react-router-dom";
import { useErrorLog } from "../../../misc/misc";
import { useUser } from "../../../models/UserDb";
import { LoadingScreen } from "../../../shared/pure/LoadingScreen";
import { WideNiceButton } from "../../../shared/pure/WideNiceButton";
import {
  joinAgoraChannel,
  leaveAgoraChannel,
  useAgoraClient,
  useAgoraConnectionState,
} from "../../../stores/agora";
import { AppState } from "../../../stores/appStore";
import { useCurrentUserStore } from "../../../stores/currentUser";
import { BasicLayout } from "../../shared/BasicLayout";
import { userViewPagePath } from "../UserViewPage";
import "./UserRoomPage.scss";

export function userRoomPagePath(userId: string | null): string {
  return `${userViewPagePath(userId)}/room`;
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

  const agoraClient = useAgoraClient();
  const agoraState = useAgoraConnectionState(agoraClient);

  const onPlayClick = () => {
    if (!agoraClient) {
      throw new Error("Client must be prepared");
    }

    if (!user) {
      throw new Error("User data must be prepared");
    }

    if (!currentUserId) {
      throw new Error("User must have logged in");
    }

    joinAgoraChannel(agoraClient, currentUserId, user.id);
  };

  const onStopClick = () => {
    if (!agoraClient) {
      throw new Error("Client must be prepared");
    }

    leaveAgoraChannel(agoraClient);
  };

  if (user === null) {
    return <LoadingScreen />;
  }

  const title = `${user.name}'s room`;

  return (
    <BasicLayout className="UserRoomPage" title={title}>
      <h1>{title}</h1>
      <p>State: [{agoraState}]</p>
      <WideNiceButton
        disabled={agoraState !== "DISCONNECTED"}
        className="UserRoomPage-playButton"
        onClick={onPlayClick}
      >
        <div className="UserRoomPage-playButtonIcon">▶️</div>
        <div className="UserRoomPage-playButtonLabel">Listen</div>
      </WideNiceButton>
      <p>
        <WideNiceButton
          disabled={agoraState !== "CONNECTED"}
          onClick={onStopClick}
        >
          ⏹ Stop
        </WideNiceButton>
      </p>
      <h2>Speakers (0)</h2>
      <h2>Participants (0)</h2>
    </BasicLayout>
  );
};

export const UserRoomPage = connect(mapState)(UserRoomPageBase);
