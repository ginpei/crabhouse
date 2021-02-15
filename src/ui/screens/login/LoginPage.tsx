import { connect } from "react-redux";
import { useHistory } from "react-router-dom";
import { AppState } from "../../../data/appStore";
import { useCurrentUserStore } from "../../../data/currentUser";
import { LoadingScreen } from "../../pure/LoadingScreen";
import { myPagePath } from "../my/MyPage";
import { LoginScreen } from "../shared/LoginScreen";

export function loginPagePath(): string {
  return "/login/";
}

const mapState = (state: AppState) => ({
  currentUserId: state.currentUserId,
});

const LoginPageBase: React.FC<ReturnType<typeof mapState>> = ({
  currentUserId,
}) => {
  useCurrentUserStore();
  const history = useHistory();

  if (currentUserId === null) {
    return <LoadingScreen />;
  }

  if (currentUserId !== "") {
    history.replace(myPagePath());
    return null;
  }

  return <LoginScreen />;
};

export const LoginPage = connect(mapState)(LoginPageBase);
