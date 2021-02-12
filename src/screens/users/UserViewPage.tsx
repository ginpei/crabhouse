import { connect } from "react-redux";
import { Link, useParams } from "react-router-dom";
import { useErrorLog } from "../../misc/misc";
import { AppError } from "../../models/AppError";
import { useUser } from "../../models/UserDb";
import { LoadingScreen } from "../../shared/pure/LoadingScreen";
import { LoginScreen } from "../../shared/screens/LoginScreen";
import { NotFoundPage } from "../../shared/screens/NotFoundPage";
import { FollowButton } from "../../shared/standalone/FollowButton";
import { AppState } from "../../stores/appStore";
import { useCurrentUserStore } from "../../stores/currentUser";
import { BasicLayout } from "../shared/BasicLayout";
import { userRoomPagePath } from "./room/UserRoomPage";

export function userViewPagePath(userId: string | null): string {
  return `/users/${userId ?? ":userId"}/`;
}

const mapState = (state: AppState) => ({
  currentUser: state.currentUser,
  currentUserId: state.currentUserId,
});

const UserViewPageBase: React.FC<ReturnType<typeof mapState>> = ({
  currentUser,
  currentUserId,
}) => {
  useCurrentUserStore();
  const { userId } = useParams<{ userId: string }>();
  const [user, userError] = useUser(userId);
  useErrorLog(userError);

  const userName = user?.name || "(No name)";

  if (currentUserId === "") {
    return <LoginScreen />;
  }

  if (userError) {
    if (
      userError instanceof AppError &&
      userError.code === "document-not-found"
    ) {
      return <NotFoundPage targetName="User" />;
    }

    // TODO create error page
    return (
      <div>
        <p>Error: {userError.message}</p>
      </div>
    );
  }

  if (currentUserId === null || user === null) {
    return <LoadingScreen />;
  }

  return (
    <BasicLayout className="UserViewPage" title={userName}>
      <h1>{userName}</h1>
      <p>
        <FollowButton user={user} />
      </p>
      <p>
        <Link to={userRoomPagePath(user.id)}>Visit {user.name}'s room</Link>
      </p>
    </BasicLayout>
  );
};

export const UserViewPage = connect(mapState)(UserViewPageBase);
