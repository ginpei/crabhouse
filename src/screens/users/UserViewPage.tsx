import { connect } from "react-redux";
import { useParams } from "react-router-dom";
import { AppError } from "../../data/AppError";
import { AppState } from "../../data/appStore";
import { useCurrentUserStore } from "../../data/currentUser";
import { useLiveRoom } from "../../data/RoomDb";
import { useUser, useUserFollowings } from "../../data/UserDb";
import { useErrorLog } from "../../misc/misc";
import { LineItem } from "../../shared/combination/LineItem";
import { LineLink } from "../../shared/combination/LineLink";
import { LoadingScreen } from "../../shared/pure/LoadingScreen";
import { LoginScreen } from "../../shared/screens/LoginScreen";
import { NotFoundScreen } from "../../shared/screens/NotFoundScreen";
import { FollowButton } from "../../shared/standalone/FollowButton";
import { BasicLayout } from "../shared/BasicLayout";
import { userRoomPagePath } from "./room/UserRoomPage";

export function userViewPagePath(userId: string | null): string {
  return `/users/${userId ?? ":userId"}/`;
}

const mapState = (state: AppState) => ({
  currentUser: state.currentUser,
  currentUserId: state.currentUserId,
});

const UserViewPageBase: React.FC<ReturnType<typeof mapState>> = ({
  currentUserId,
}) => {
  useCurrentUserStore();
  const { userId } = useParams<{ userId: string }>();
  const [user, userError] = useUser(userId);
  useErrorLog(userError);

  const [room, roomError] = useLiveRoom(userId);
  useErrorLog(roomError);

  const [followings, followingsError] = useUserFollowings(userId);
  useErrorLog(followingsError);

  const userName = user?.name || "(No name)";

  if (currentUserId === "") {
    return <LoginScreen />;
  }

  if (userError) {
    if (
      userError instanceof AppError &&
      userError.code === "document-not-found"
    ) {
      return <NotFoundScreen targetName="User" />;
    }

    // TODO create error page
    return (
      <div>
        <p>Error: {userError.message}</p>
      </div>
    );
  }

  if (currentUserId === null || user === null) {
    return <LoadingScreen />;
  }

  return (
    <BasicLayout className="UserViewPage" title={userName}>
      <h1>{userName}</h1>
      <p>
        <FollowButton user={user} />
      </p>
      <p>{user.bio}</p>
      {user.twitter && (
        <LineItem>
          <a className="LineLink" href={`https://twitter.com/${user.twitter}`}>
            @{user.twitter}
          </a>
        </LineItem>
      )}
      {user.website && (
        <LineItem>
          <a className="LineLink" href={user.website}>
            {user.website}
          </a>
        </LineItem>
      )}
      <section>
        <h2>{user.name}'s room</h2>
        <p>State: {room?.state ?? ""}</p>
        <LineLink to={userRoomPagePath(user.id)}>
          👉 Visit {user.name}'s room
        </LineLink>
      </section>
      {followings && (
        <section>
          <h2>Followings</h2>
          {followings.length > 0 ? (
            followings.map((following) => (
              <LineLink key={following.id} to={userViewPagePath(following.id)}>
                {following.name}
              </LineLink>
            ))
          ) : (
            <p>
              <small>No followings.</small>
            </p>
          )}
        </section>
      )}
    </BasicLayout>
  );
};

export const UserViewPage = connect(mapState)(UserViewPageBase);
