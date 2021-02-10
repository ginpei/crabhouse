import { Dispatch } from "@reduxjs/toolkit";
import { Helmet } from "react-helmet-async";
import { connect } from "react-redux";
import { Link, useHistory } from "react-router-dom";
import { useErrorLog } from "../../misc/misc";
import { useOpenRooms } from "../../models/RoomDb";
import { NiceButton } from "../../shared/pure/NiceButton";
import { AppState } from "../../stores/appStore";
import { useCurrentUserStore } from "../../stores/currentUser";
import { loginPagePath } from "../login/LoginPage";
import { myPagePath } from "../my/MyPage";
import { roomViewPagePath } from "../rooms/view/RoomViewPage";
import { BasicHeaderFrame } from "../shared/BasicHeaderFrame";
import "./HomePage.scss";

const mapState = (state: AppState) => ({
  currentUserId: state.currentUserId,
});

const mapDispatch = (dispatch: Dispatch) => ({});

const HomePageBase: React.FC<
  ReturnType<typeof mapState> & ReturnType<typeof mapDispatch>
> = ({ currentUserId }) => {
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
        <p>
          <Link to={myPagePath()}>▶️ Open your room in your page</Link>
        </p>
        <OpenRoomList />
      </div>
    </div>
  );
};

export const HomePage = connect(mapState, mapDispatch)(HomePageBase);

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
    return (
      <ul>
        <li>...</li>
      </ul>
    );
  }

  if (openRooms.length < 1) {
    return (
      <ul>
        <li>
          <small>(No open rooms now)</small>
        </li>
      </ul>
    );
  }

  return (
    <ul>
      {openRooms.map((room) => (
        <li key={room.id}>
          <Link to={roomViewPagePath(room.id)}>{room.name}</Link>
        </li>
      ))}
    </ul>
  );
};
