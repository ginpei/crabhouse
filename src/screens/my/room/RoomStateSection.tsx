import { useEffect, useState } from "react";
import { connect } from "react-redux";
import { useErrorLog } from "../../../misc/misc";
import { getRoomStateLabel } from "../../../models/Room";
import { saveRoom, useLiveRoom } from "../../../models/RoomDb";
import { WideNiceButton } from "../../../shared/pure/WideNiceButton";
import {
  joinAgoraChannel,
  leaveAgoraChannel,
  useAgoraClient,
} from "../../../stores/agora";
import { AppState } from "../../../stores/appStore";

const mapState = (state: AppState) => ({
  currentUserId: state.currentUserId,
});

const RoomStateSectionBase: React.FC<ReturnType<typeof mapState>> = ({
  currentUserId,
}) => {
  const [room, roomError] = useLiveRoom(currentUserId);
  useErrorLog(roomError);

  const agoraClient = useAgoraClient();
  const [dirty, setDirty] = useState(false);

  useEffect(() => {
    setDirty(false);
  }, [room]);

  if (!currentUserId || !room) {
    return null;
  }

  const onClosedClick = () => {
    setDirty(true);
    saveRoom({ ...room, state: "closed" });
    leaveAgoraChannel(agoraClient);
  };

  const onOpenClick = () => {
    setDirty(true);
    saveRoom({ ...room, state: "open" });
    leaveAgoraChannel(agoraClient);
  };

  const onLiveClick = () => {
    setDirty(true);
    saveRoom({ ...room, state: "live" });
    joinAgoraChannel(agoraClient, currentUserId, room);
  };

  return (
    <details className="MyRoomPage-RoomStateSelect" open>
      <summary>
        Room state: {getRoomStateLabel(room)}
        {room.state === "live" && (
          <span className="MyRoomPage-speakerIcon">📡</span>
        )}
      </summary>
      <p>
        <WideNiceButton
          disabled={dirty || room.state === "closed"}
          onClick={onClosedClick}
        >
          👋 Close
        </WideNiceButton>
        Not available now
      </p>
      <p>
        <WideNiceButton
          disabled={dirty || room.state === "open"}
          onClick={onOpenClick}
        >
          🎉 Open
        </WideNiceButton>
        Can join but not sounds yet
      </p>
      <p>
        <WideNiceButton
          disabled={dirty || room.state === "live"}
          niceStyle="danger"
          onClick={onLiveClick}
        >
          📡 Live
        </WideNiceButton>
        Can join and listen!
      </p>
    </details>
  );
};

export const RoomStateSection = connect()(RoomStateSectionBase);
