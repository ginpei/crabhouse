import { useState } from "react";
import { connect } from "react-redux";
import { Link, useHistory } from "react-router-dom";
import { useErrorLog } from "../../misc/misc";
import { createRoom } from "../../models/Room";
import { saveRoom } from "../../models/RoomDb";
import { LoadingScreen } from "../../shared/pure/LoadingScreen";
import { NiceButton } from "../../shared/pure/NiceButton";
import { AppState } from "../../stores/appStore";
import { useCurrentUserStore } from "../../stores/currentUser";
import { LoginPage } from "../login/LoginPage";
import { myProfileEditPagePath } from "../my-profile/edit/MyProfileEditPage";
import { roomViewPagePath } from "../rooms/view/RoomViewPage";
import { BaseLayout } from "../shared/BaseLayout";

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
  const [creatingRoom, setCreatingRoom] = useState(false);
  const [createRoomError, setCreateRoomError] = useState<Error | null>(null);
  useErrorLog(createRoomError);

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

  if (currentUserId === null) {
    return <LoadingScreen />;
  }

  if (currentUserId === "") {
    return <LoginPage title="My page" />;
  }

  return (
    <BaseLayout className="MyPage" title="My page">
      <h1>MyPage</h1>
      <p>
        <Link to={myProfileEditPagePath()}>Edit my profile</Link>
      </p>
      <p>
        <NiceButton disabled={creatingRoom} onClick={onOpenRoomClick}>
          Open your room
        </NiceButton>
      </p>
    </BaseLayout>
  );
};

export const MyPage = connect(mapState)(MyPageBase);
