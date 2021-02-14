import { useEffect } from "react";
import { connect } from "react-redux";
import { useParams } from "react-router-dom";
import { useErrorLog } from "../../../misc/misc";
import { useLiveRoom } from "../../../models/RoomDb";
import { useUser } from "../../../models/UserDb";
import { LoadingScreen } from "../../../shared/pure/LoadingScreen";
import { LoginScreen } from "../../../shared/screens/LoginScreen";
import {
  leaveAgoraChannel,
  useAgoraClient,
  useAgoraConnectionState,
} from "../../../stores/agora";
import { AppState } from "../../../stores/appStore";
import { useCurrentUserStore } from "../../../stores/currentUser";
import { BasicLayout } from "../../shared/BasicLayout";
import { userViewPagePath } from "../UserViewPage";
import { ControlPanel } from "./ControlPanel";
import "./UserRoomPage.scss";

export function userRoomPagePath(userId: string | null): string {
  return `${userViewPagePath(userId)}room/`;
}

const mapState = (state: AppState) => ({
  currentUserId: state.currentUserId,
});

const UserRoomPageBase: React.FC<ReturnType<typeof mapState>> = ({
  currentUserId,
}) => {
  useCurrentUserStore();

  const agoraClient = useAgoraClient();
  const agoraState = useAgoraConnectionState(agoraClient);

  const { userId } = useParams<{ userId: string }>();
  const [user, userError] = useUser(userId);
  useErrorLog(userError);
  const [room, roomError] = useLiveRoom(userId);
  useErrorLog(roomError);

  const roomOpen = room?.state === "open" || room?.state === "live";

  useEffect(() => {
    if (agoraState === "CONNECTED" && !roomOpen) {
      leaveAgoraChannel(agoraClient);
    }
  }, [agoraClient, agoraState, roomOpen]);

  if (currentUserId === null || user === null || room === null) {
    return <LoadingScreen />;
  }

  if (currentUserId === "") {
    return <LoginScreen title={room.name} />;
  }

  if (!roomOpen) {
    return (
      <BasicLayout className="UserRoomPage" title={room.name}>
        <h1>{room.name}</h1>
        <p>Room is not open now.</p>
        <p>Stay tuned and see you soon! 👋</p>
      </BasicLayout>
    );
  }

  return (
    <BasicLayout className="UserRoomPage" title={room.name}>
      <h1>{room.name}</h1>
      <ControlPanel agoraClient={agoraClient} room={room} user={user} />
      <h2>Speakers (0)</h2>
      <h2>Participants (0)</h2>
    </BasicLayout>
  );
};

export const UserRoomPage = connect(mapState)(UserRoomPageBase);
