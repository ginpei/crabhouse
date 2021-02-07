import { DetailedHTMLProps } from "react";
import { connect } from "react-redux";
import { useHistory } from "react-router-dom";
import { User } from "../../models/User";
import { myProfileEditPagePath } from "../../screens/my-profile/edit/MyProfileEditPage";
import { AppState } from "../../stores/appStore";
import { useCurrentUserStore } from "../../stores/currentUser";
import { NiceButton } from "../pure/NiceButton";

const mapState = (state: AppState) => ({
  currentUser: state.currentUser,
  currentUserId: state.currentUserId,
});

const FollowButtonBase: React.FC<
  ReturnType<typeof mapState> & {
    user: User;
  }
> = ({ currentUser, currentUserId, user }) => {
  useCurrentUserStore();
  const history = useHistory();

  if (currentUserId === null) {
    return (
      <FollowButtonFrame style={{ visibility: "hidden" }}></FollowButtonFrame>
    );
  }

  if (currentUser && currentUser.id === user.id) {
    return (
      <FollowButtonFrame onClick={() => history.push(myProfileEditPagePath())}>
        Edit
      </FollowButtonFrame>
    );
  }

  return <FollowButtonFrame>Follow</FollowButtonFrame>;
};

export const FollowButton = connect(mapState)(FollowButtonBase);

const FollowButtonFrame: React.FC<
  DetailedHTMLProps<
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  >
> = (props) => {
  return <NiceButton className="FollowButton" {...props} />;
};
