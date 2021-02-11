import { connect } from "react-redux";
import { useParams } from "react-router-dom";
import { useErrorLog } from "../../../misc/misc";
import { useUser } from "../../../models/UserDb";
import { LoadingScreen } from "../../../shared/pure/LoadingScreen";
import { WideNiceButton } from "../../../shared/pure/WideNiceButton";
import { AppState } from "../../../stores/appStore";
import { BasicLayout } from "../../shared/BasicLayout";
import { userViewPagePath } from "../UserViewPage";
import "./UserRoomPage.scss";

export function userRoomPagePath(userId: string | null): string {
  return `${userViewPagePath(userId)}/room`;
}

const mapState = (state: AppState) => ({
  currentUser: state.currentUser,
  currentUserId: state.currentUserId,
});

const UserRoomPageBase: React.FC<ReturnType<typeof mapState>> = ({
  currentUser,
  currentUserId,
}) => {
  const { userId } = useParams<{ userId: string }>();
  const [user, userError] = useUser(userId);
  useErrorLog(userError);

  const onPlayClick = () => {
    console.log(`# play`);
  };

  if (user === null) {
    return <LoadingScreen />;
  }

  const title = `${user.name}'s room`;

  return (
    <BasicLayout className="UserRoomPage" title={title}>
      <h1>{title}</h1>
      <WideNiceButton
        disabled
        className="UserRoomPage-playButton"
        onClick={onPlayClick}
      >
        <div className="UserRoomPage-playButtonIcon">▶️</div>
        <div className="UserRoomPage-playButtonLabel">Listen</div>
      </WideNiceButton>
      <h2>Speakers (0)</h2>
      <h2>Participants (0)</h2>
    </BasicLayout>
  );
};

export const UserRoomPage = connect(mapState)(UserRoomPageBase);
