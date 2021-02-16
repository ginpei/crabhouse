import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { connect } from "react-redux";
import { useHistory } from "react-router-dom";
import { AppState } from "../../../data/appStore";
import { useCurrentUserStore } from "../../../data/currentUser";
import { useOpenRooms } from "../../../data/RoomDb";
import { User } from "../../../data/User";
import { getUserCollection, ssToUser } from "../../../data/UserDb";
import { useErrorLog } from "../../../misc/misc";
import { LineLink } from "../../combination/LineLink";
import { NiceButton } from "../../pure/NiceButton";
import { loginPagePath } from "../login/LoginPage";
import { myPagePath } from "../my/MyPage";
import { BasicHeaderFrame } from "../shared/BasicHeaderFrame";
import { userRoomPagePath } from "../users/room/UserRoomPage";
import { userViewPagePath } from "../users/UserViewPage";
import "./HomePage.scss";

const mapState = (state: AppState) => ({
  currentUserId: state.currentUserId,
});

const HomePageBase: React.FC<ReturnType<typeof mapState>> = ({
  currentUserId,
}) => {
  useCurrentUserStore();

  return (
    <div className="HomePage">
      <Helmet>
        <title>Crabhouse 🦀 カニヤシキ</title>
      </Helmet>
      <BasicHeaderFrame />
      <div className="ui-container">
        <header className="HomePage-header">
          <h1 className="HomePage-heading">Crabhouse</h1>
          <div className="HomePage-hero">
            <div className="HomePage-heroLogo">🦀</div>
            <HeroLoginButton currentUserId={currentUserId} />
          </div>
        </header>
        <h2>🔊 Open rooms</h2>
        <OpenRoomList />
        <DebugSection />
      </div>
    </div>
  );
};

export const HomePage = connect(mapState)(HomePageBase);

const HeroLoginButton: React.FC<{ currentUserId: string | null }> = ({
  currentUserId,
}) => {
  const history = useHistory();

  const text = currentUserId ? "My page" : "Log in";

  const onClick = () => {
    if (currentUserId) {
      history.push(myPagePath());
      return;
    }

    history.push(loginPagePath());
  };

  if (currentUserId === null) {
    return (
      <NiceButton
        className="HomePage-HeroLoginButton"
        style={{ visibility: "hidden" }}
      />
    );
  }

  return (
    <NiceButton className="HomePage-HeroLoginButton" onClick={onClick}>
      {text}
    </NiceButton>
  );
};

const OpenRoomList: React.FC = () => {
  const [openRooms, openRoomsError] = useOpenRooms();
  useErrorLog(openRoomsError);

  if (!openRooms) {
    return <div>...</div>;
  }

  if (openRooms.length < 1) {
    return (
      <div>
        <small>(No open rooms now)</small>
      </div>
    );
  }

  return (
    <div>
      {openRooms.map((room) => (
        <LineLink key={room.id} to={userRoomPagePath(room.id)}>
          {room.name}
          {room.state === "live" && <span title="Live">📡</span>}
        </LineLink>
      ))}
    </div>
  );
};

const DebugSection: React.FC = () => {
  const [users, setUsers] = useState<User[] | null>(null);

  // temporary user list
  useEffect(() => {
    getUserCollection()
      .get()
      .then(async (ss) => {
        const newUsers = await ss.docs.map((v) => ssToUser(v));
        setUsers(newUsers);
      })
      .catch((error) => {
        // eslint-disable-next-line no-console
        console.error(error);
      });
  }, []);

  return (
    <details className="DebugSection" style={{ marginTop: "5rem" }}>
      <summary>Debug</summary>
      <h2>Users (debug)</h2>
      <div>
        {users
          ? users.map((user) => (
              <LineLink key={user.id} to={userViewPagePath(user.id)}>
                {user.name}
              </LineLink>
            ))
          : "..."}
      </div>
    </details>
  );
};
