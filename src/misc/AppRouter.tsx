import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { HomePage } from "../pages/home/HomePage";
import {
  MyProfileEditPage,
  myProfileEditPagePath,
} from "../pages/my-profile/edit/MyProfileEditPage";
import {
  RoomCreatePage,
  roomCreatePagePath,
} from "../pages/rooms/create/RoomCreatePage";

export const AppRouter: React.FC = () => {
  return (
    <Router>
      <Switch>
        <Route
          exact={true}
          path={roomCreatePagePath()}
          component={RoomCreatePage}
        />
        <Route
          exact={true}
          path={myProfileEditPagePath()}
          component={MyProfileEditPage}
        />
        <Route exact={true} path="/" component={HomePage} />
      </Switch>
    </Router>
  );
};
