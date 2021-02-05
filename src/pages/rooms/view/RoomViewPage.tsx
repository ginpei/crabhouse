import { connect } from "react-redux";
import { useParams } from "react-router-dom";
import { useRoom } from "../../../models/RoomDb";
import { useUser } from "../../../models/UserDb";
import { useErrorLog } from "../../../shared/misc/misc";
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
  const [room, roomError] = useRoom(params.roomId);
  const [owner, ownerError] = useUser(room?.userId ?? null);
  useCurrentUserIdStore();
  useErrorLog(roomError);
  useErrorLog(ownerError);

  // loading
  if (currentUserId === null || room === null || owner === null) {
    return null;
  }

  if (currentUserId === "") {
    throw new Error("User must have logged in");
  }

  return (
    <BaseLayout className="RoomViewPage">
      <h1>{room.name}</h1>
      <p>ID: {room.id}</p>
      <p>Status: {room.status}</p>
      <p>Owner: {owner.name}</p>
    </BaseLayout>
  );
};

const mapState = (state: AppState) => ({
  currentUserId: state.currentUserId,
});

export const RoomViewPage = connect(mapState)(RoomViewPageBase);
