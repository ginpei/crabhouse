import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { HomePage } from "../screens/home/HomePage";
import { LoginPage, loginPagePath } from "../screens/login/LoginPage";
import { MyPage, myPagePath } from "../screens/my/MyPage";
import {
  ProfileEditPage,
  profileEditPagePath,
} from "../screens/my/profileEdit/ProfileEditPage";
import {
  RoomCreatePage,
  roomCreatePagePath,
} from "../screens/rooms/create/RoomCreatePage";
import {
  RoomViewPage,
  roomViewPagePath,
} from "../screens/rooms/view/RoomViewPage";
import {
  UserRoomPage,
  userRoomPagePath,
} from "../screens/users/room/UserRoomPage";
import { UserViewPage, userViewPagePath } from "../screens/users/UserViewPage";
import { NotFoundPage } from "../shared/screens/NotFoundPage";

export const AppRouter: React.FC = () => {
  return (
    <Router>
      <Switch>
        <Route
          exact={true}
          path={userViewPagePath(null)}
          component={UserViewPage}
        />
        <Route
          exact={true}
          path={userRoomPagePath(null)}
          component={UserRoomPage}
        />
        <Route
          exact={true}
          path={roomCreatePagePath()}
          component={RoomCreatePage}
        />
        <Route
          exact={true}
          path={roomViewPagePath(null)}
          component={RoomViewPage}
        />
        <Route exact={true} path={myPagePath()} component={MyPage} />
        <Route
          exact={true}
          path={profileEditPagePath()}
          component={ProfileEditPage}
        />
        <Route exact={true} path={loginPagePath()} component={LoginPage} />
        <Route exact={true} path="/" component={HomePage} />
        <Route component={NotFoundPage} />
      </Switch>
    </Router>
  );
};
