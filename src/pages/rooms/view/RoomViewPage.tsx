import { connect } from "react-redux";
import { useParams } from "react-router-dom";
import { BaseLayout } from "../../../shared/screens/BaseLayout";
import { AppState } from "../../../stores/appStore";
import { useCurrentUserIdStore } from "../../../stores/currentUser";

export function roomViewPagePath(roomId: string | null): string {
  return `/rooms/${roomId || ":roomId"}`;
}

const RoomViewPageBase: React.FC<ReturnType<typeof mapState>> = ({
  currentUserId,
}) => {
  const params = useParams<{ roomId: string }>();
  useCurrentUserIdStore();

  // loading
  if (currentUserId === null) {
    return null;
  }

  if (currentUserId === "") {
    throw new Error("User must have logged in");
  }

  return (
    <BaseLayout className="RoomViewPage">
      <h1>RoomViewPage</h1>
      <p>ID: {params.roomId}</p>
    </BaseLayout>
  );
};

const mapState = (state: AppState) => ({
  currentUserId: state.currentUserId,
});

export const RoomViewPage = connect(mapState)(RoomViewPageBase);
