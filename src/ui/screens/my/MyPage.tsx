import { connect } from "react-redux";
import { Link, useHistory } from "react-router-dom";
import { AppState } from "../../../data/appStore";
import { useCurrentUserStore } from "../../../data/currentUser";
import { auth } from "../../../data/firebase";
import { useUserFollowers, useUserFollowings } from "../../../data/UserDb";
import { useErrorLog } from "../../../misc/misc";
import { LineLink } from "../../combination/LineLink";
import { LoadingScreen } from "../../pure/LoadingScreen";
import { WideNiceButton } from "../../pure/WideNiceButton";
import { BasicLayout } from "../shared/BasicLayout";
import { LoginScreen } from "../shared/LoginScreen";
import { userRoomPagePath } from "../users/room/UserRoomPage";
import { userViewPagePath } from "../users/UserViewPage";
import { profileEditPagePath } from "./profileEdit/ProfileEditPage";
import { myRoomPagePath } from "./room/MyRoomPage";

export function myPagePath(): string {
  return "/my/";
}

const mapState = (state: AppState) => ({
  currentUser: state.currentUser,
  currentUserId: state.currentUserId,
});

const MyPageBase: React.FC<ReturnType<typeof mapState>> = ({
  currentUser,
  currentUserId,
}) => {
  useCurrentUserStore();
  const history = useHistory();
  const [followings, followingsError] = useUserFollowings(currentUserId);
  useErrorLog(followingsError);
  const [followers, followersError] = useUserFollowers(currentUserId);
  useErrorLog(followersError);

  const onLogOutClick = () => {
    auth.signOut();
    history.push("/");
  };

  if (currentUserId === null) {
    return <LoadingScreen />;
  }

  if (currentUserId === "" || currentUser === null) {
    return <LoginScreen title="My page" />;
  }

  if (followings === null || followers === null) {
    return <LoadingScreen />;
  }

  return (
    <BasicLayout className="MyPage" title={currentUser.name}>
      <p>
        <Link to={userViewPagePath(currentUser.id)}>{currentUser.name}</Link>{" "}
        &gt; My page
      </p>
      <h1>{currentUser.name}</h1>
      <h2>Pages</h2>
      <div className="ui-uncontainer">
        <LineLink to={userViewPagePath(currentUserId)}>
          🦀 View profile
        </LineLink>
        <LineLink to={profileEditPagePath()}>✏️ Edit profile</LineLink>
        <LineLink to={userRoomPagePath(currentUserId)}>📡 View room</LineLink>
        <LineLink to={myRoomPagePath()}>⚙️ My room control panel</LineLink>
      </div>
      <h2>Followings</h2>
      {followings.length > 0 ? (
        <div className="ui-uncontainer">
          {followings.map((user) => (
            <LineLink key={user.id} to={userViewPagePath(user.id)}>
              {user.name}
            </LineLink>
          ))}
        </div>
      ) : (
        <p>
          <small>No followings.</small>
        </p>
      )}
      <h2>Followers</h2>
      {followers.length > 0 ? (
        <div className="ui-uncontainer">
          {followers.map((user) => (
            <LineLink key={user.id} to={userViewPagePath(user.id)}>
              {user.name}
            </LineLink>
          ))}
        </div>
      ) : (
        <p>
          <small>No followers.</small>
        </p>
      )}
      <h2>Session</h2>
      <p>
        <WideNiceButton onClick={onLogOutClick}>Log out</WideNiceButton>
      </p>
    </BasicLayout>
  );
};

export const MyPage = connect(mapState)(MyPageBase);
