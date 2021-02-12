import { connect } from "react-redux";
import { useHistory } from "react-router-dom";
import { LoadingScreen } from "../../shared/pure/LoadingScreen";
import { LoginScreen } from "../../shared/screens/LoginScreen";
import { AppState } from "../../stores/appStore";
import { useCurrentUserStore } from "../../stores/currentUser";
import { myPagePath } from "../my/MyPage";

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
