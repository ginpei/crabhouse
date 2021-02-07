import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { HomePage } from "../screens/home/HomePage";
import {
  MyProfileEditPage,
  myProfileEditPagePath,
} from "../screens/my-profile/edit/MyProfileEditPage";
import { MyPage, myPagePath } from "../screens/my/MyPage";
import {
  RoomCreatePage,
  roomCreatePagePath,
} from "../screens/rooms/create/RoomCreatePage";
import {
  RoomViewPage,
  roomViewPagePath,
} from "../screens/rooms/view/RoomViewPage";
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
          path={myProfileEditPagePath()}
          component={MyProfileEditPage}
        />
        <Route exact={true} path="/" component={HomePage} />
        <Route component={NotFoundPage} />
      </Switch>
    </Router>
  );
};
