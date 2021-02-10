import { DetailedHTMLProps, useState } from "react";
import { connect } from "react-redux";
import { useHistory } from "react-router-dom";
import { useErrorLog } from "../../misc/misc";
import { User } from "../../models/User";
import { follow } from "../../models/UserDb";
import { profileEditPagePath } from "../../screens/my/profileEdit/ProfileEditPage";
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
  const [following, setFollowing] = useState(false);
  const [followError, setFollowError] = useState<Error | null>(null);
  useErrorLog(followError);
  const history = useHistory();

  const onFollowClick = async () => {
    setFollowing(true);
    try {
      await follow(user.id);
    } catch (error) {
      setFollowError(error);
    } finally {
      setFollowing(false);
    }
  };

  if (currentUserId === null) {
    return (
      <FollowButtonFrame style={{ visibility: "hidden" }}></FollowButtonFrame>
    );
  }

  if (currentUser && currentUser.id === user.id) {
    return (
      <FollowButtonFrame onClick={() => history.push(profileEditPagePath())}>
        Edit
      </FollowButtonFrame>
    );
  }

  return (
    <FollowButtonFrame disabled={following} onClick={onFollowClick}>
      Follow
    </FollowButtonFrame>
  );
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
