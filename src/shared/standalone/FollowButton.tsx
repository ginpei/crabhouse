import { DetailedHTMLProps, useEffect, useState } from "react";
import { connect } from "react-redux";
import { useHistory } from "react-router-dom";
import { AppState } from "../../data/appStore";
import { useCurrentUserStore } from "../../data/currentUser";
import { User } from "../../data/User";
import { follow, unfollow } from "../../data/UserDb";
import { useErrorLog } from "../../misc/misc";
import { myPagePath } from "../../screens/my/MyPage";
import { NiceButton } from "../pure/NiceButton";

const mapState = (state: AppState) => ({
  currentUser: state.currentUser,
  currentUserFollowings: state.currentUserFollowings,
  currentUserId: state.currentUserId,
});

const FollowButtonBase: React.FC<
  ReturnType<typeof mapState> & {
    user: User;
  }
> = ({ currentUser, currentUserFollowings, currentUserId, user }) => {
  useCurrentUserStore();
  const [updating, setUpdating] = useState(false);
  const [followError, setFollowError] = useState<Error | null>(null);
  useErrorLog(followError);
  const history = useHistory();

  const isFollowing = currentUserFollowings?.some((v) => v.id === user.id);

  useEffect(() => {
    setUpdating(false);
  }, [isFollowing]);

  const onFollowClick = async () => {
    setUpdating(true);
    try {
      if (isFollowing) {
        await unfollow(user.id);
      } else {
        await follow(user.id);
      }
    } catch (error) {
      setFollowError(error);
    }
  };

  if (currentUserId === null || currentUserFollowings === null) {
    return (
      <FollowButtonFrame style={{ visibility: "hidden" }}></FollowButtonFrame>
    );
  }

  if (currentUser && currentUser.id === user.id) {
    return (
      <FollowButtonFrame onClick={() => history.push(myPagePath())}>
        My page
      </FollowButtonFrame>
    );
  }

  return (
    <FollowButtonFrame disabled={updating} onClick={onFollowClick}>
      {isFollowing ? "Unfollow" : "Follow"}
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
