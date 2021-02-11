import { useState } from "react";
import { connect } from "react-redux";
import { Link, useHistory } from "react-router-dom";
import { useErrorLog } from "../../misc/misc";
import { auth } from "../../models/firebase";
import { createRoom } from "../../models/Room";
import { saveRoom, useUserRooms } from "../../models/RoomDb";
import { useUserFollowers, useUserFollowings } from "../../models/UserDb";
import { LoadingScreen } from "../../shared/pure/LoadingScreen";
import { WideNiceButton } from "../../shared/pure/WideNiceButton";
import { LoginScreen } from "../../shared/screens/LoginScreen";
import { AppState } from "../../stores/appStore";
import { useCurrentUserStore } from "../../stores/currentUser";
import { roomViewPagePath } from "../rooms/view/RoomViewPage";
import { BasicLayout } from "../shared/BasicLayout";
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

  const [creatingRoom, setCreatingRoom] = useState(false);
  const [createRoomError, setCreateRoomError] = useState<Error | null>(null);
  useErrorLog(createRoomError);

  const [userRooms, userRoomsError] = useUserRooms(currentUserId);
  useErrorLog(userRoomsError);

  const onOpenRoomClick = async () => {
    if (!currentUser) {
      throw new Error();
    }

    // eslint-disable-next-line no-alert
    const name = window.prompt("Room name", `${currentUser.name}'s room`);
    if (!name) {
      return;
    }

    setCreateRoomError(null);
    setCreatingRoom(true);
    try {
      const room = await saveRoom(createRoom({ name, userId: currentUser.id }));
      history.push(roomViewPagePath(room.id));
    } catch (error) {
      setCreateRoomError(error);
      setCreatingRoom(false);
    }
  };

  const onLogOutClick = () => {
    auth.signOut();
    history.push("/");
  };

  if (currentUserId === null) {
    return <LoadingScreen />;
  }

  if (currentUserId === "") {
    return <LoginScreen title="My page" />;
  }

  if (
    currentUser === null ||
    userRooms === null ||
    followings === null ||
    followers === null
  ) {
    return <LoadingScreen />;
  }

  return (
    <BasicLayout className="MyPage" title={currentUser.name}>
      <p>My page</p>
      <h1>
        <Link to={userViewPagePath(currentUserId)}>{currentUser.name}</Link>
      </h1>
      <p>
        <Link to={profileEditPagePath()}>Edit my profile</Link>
      </p>
      <p>
        <Link to={myRoomPagePath()}>My room</Link>
      </p>
      <p>
        <WideNiceButton disabled={creatingRoom} onClick={onOpenRoomClick}>
          Open your room
        </WideNiceButton>
      </p>
      <h2>Followings</h2>
      <ul>
        {followings.map((user) => (
          <li key={user.id}>
            <Link to={userViewPagePath(user.id)}>{user.name}</Link>
          </li>
        ))}
      </ul>
      <h2>Followers</h2>
      <ul>
        {followers.map((user) => (
          <li key={user.id}>
            <Link to={userViewPagePath(user.id)}>{user.name}</Link>
          </li>
        ))}
      </ul>
      <h2>My rooms</h2>
      <ul>
        {userRooms.map((room) => (
          <li key={room.id}>
            <Link to={roomViewPagePath(room.id)}>
              {room.name} ({room.state})
            </Link>
          </li>
        ))}
      </ul>
      <h2>Session</h2>
      <p>
        <WideNiceButton onClick={onLogOutClick}>Log out</WideNiceButton>
      </p>
    </BasicLayout>
  );
};

export const MyPage = connect(mapState)(MyPageBase);
