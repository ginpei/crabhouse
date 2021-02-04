import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { HomePage } from "../home/HomePage";

export const AppRouter: React.FC = () => {
  return (
    <Router>
      <Switch>
        <Route exact={true} path="/" component={HomePage} />
      </Switch>
    </Router>
  );
};
