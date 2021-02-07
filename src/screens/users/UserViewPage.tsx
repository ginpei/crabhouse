import { connect } from "react-redux";
import { useParams } from "react-router-dom";
import { useErrorLog } from "../../misc/misc";
import { useUser } from "../../models/UserDb";
import { FollowButton } from "../../shared/standalone/FollowButton";
import { AppState } from "../../stores/appStore";
import { useCurrentUserStore } from "../../stores/currentUser";
import { LoginPage } from "../login/LoginPage";
import { BaseLayout } from "../shared/BaseLayout";

export function userViewPagePath(userId: string | null): string {
  return `/users/${userId ?? ":userId"}`;
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
    return <LoginPage />;
  }

  if (userError) {
    // TODO create error page
    return (
      <div>
        <p>Error: {userError.message}</p>
      </div>
    );
  }

  if (currentUserId === null || user === null) {
    return null;
  }

  return (
    <BaseLayout className="UserViewPage" title={userName}>
      <h1>{userName}</h1>
      <p>
        <FollowButton user={user} />
      </p>
    </BaseLayout>
  );
};

export const UserViewPage = connect(mapState)(UserViewPageBase);
