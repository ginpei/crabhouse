import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { HomePage } from "../ui/screens/home/HomePage";
import { LoginPage, loginPagePath } from "../ui/screens/login/LoginPage";
import { MyPage, myPagePath } from "../ui/screens/my/MyPage";
import {
  ProfileEditPage,
  profileEditPagePath,
} from "../ui/screens/my/profileEdit/ProfileEditPage";
import { MyRoomPage, myRoomPagePath } from "../ui/screens/my/room/MyRoomPage";
import { NotFoundScreen } from "../ui/screens/shared/NotFoundScreen";
import {
  UserRoomPage,
  userRoomPagePath,
} from "../ui/screens/users/room/UserRoomPage";
import {
  UserViewPage,
  userViewPagePath,
} from "../ui/screens/users/UserViewPage";

export const AppRouter: React.FC = ({ children }) => {
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
        <Route exact={true} path={myPagePath()} component={MyPage} />
        <Route exact={true} path={myRoomPagePath()} component={MyRoomPage} />
        <Route
          exact={true}
          path={profileEditPagePath()}
          component={ProfileEditPage}
        />
        <Route exact={true} path={loginPagePath()} component={LoginPage} />
        <Route exact={true} path="/" component={HomePage} />
        <Route component={NotFoundScreen} />
      </Switch>
      {children}
    </Router>
  );
};
