import { useEffect, useState } from "react";
import { connect } from "react-redux";
import { useErrorLog } from "../../../misc/misc";
import { Room } from "../../../models/Room";
import { saveRoom, useLiveRoom } from "../../../models/RoomDb";
import { WideNiceButton } from "../../../shared/pure/WideNiceButton";
import { joinAgoraChannel, leaveAgoraChannel } from "../../../stores/agora";
import { AppState } from "../../../stores/appStore";

const mapState = (state: AppState) => ({
  currentUserId: state.currentUserId,
});

const RoomStateSectionBase: React.FC<ReturnType<typeof mapState>> = ({
  currentUserId,
}) => {
  const [room, roomError] = useLiveRoom(currentUserId);
  useErrorLog(roomError);

  const [dirty, setDirty] = useState(false);

  useEffect(() => {
    setDirty(false);
  }, [room]);

  const onClosedClick = async () => {
    if (!room) {
      throw new Error("Room must be prepared");
    }

    setDirty(true);
    try {
      await Promise.all([
        saveRoom({ ...room, state: "closed" }),
        leaveAgoraChannel(),
      ]);
    } catch (error) {
      setDirty(false);
      // TODO
      throw error;
    }
  };

  const onOpenClick = async () => {
    if (!room) {
      throw new Error("Room must be prepared");
    }

    setDirty(true);
    try {
      await Promise.all([
        saveRoom({ ...room, state: "open" }),
        leaveAgoraChannel(),
      ]);
    } catch (error) {
      setDirty(false);
      // TODO
      throw error;
    }
  };

  const onLiveClick = async () => {
    if (!room) {
      throw new Error("Room must be prepared");
    }

    if (!currentUserId) {
      throw new Error("User data must have been loaded");
    }

    setDirty(true);
    try {
      await Promise.all([
        saveRoom({ ...room, state: "live" }),
        joinAgoraChannel(currentUserId, room),
      ]);
    } catch (error) {
      setDirty(false);
      // TODO
      throw error;
    }
  };

  return (
    <details className="MyRoomPage-RoomStateSelect" open>
      <summary>
        Room state: {getRoomStateLabel(room)}
        {room?.state === "live" && (
          <span className="MyRoomPage-speakerIcon">📡</span>
        )}
      </summary>
      <p>
        <WideNiceButton
          disabled={!room || dirty || room.state === "closed"}
          onClick={onClosedClick}
        >
          👋 Close
        </WideNiceButton>
        Not available now
      </p>
      <p>
        <WideNiceButton
          disabled={!room || dirty || room.state === "open"}
          onClick={onOpenClick}
        >
          🎉 Open
        </WideNiceButton>
        Can join but not sounds yet
      </p>
      <p>
        <WideNiceButton
          disabled={!room || dirty || room.state === "live"}
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

function getRoomStateLabel(room: Room | null): string {
  if (!room) {
    return "...";
  }

  if (room.state === "closed") {
    return "Closed";
  }

  if (room.state === "open") {
    return "Open";
  }

  if (room.state === "live") {
    return "Live";
  }

  throw new Error(`Unknown room state "${room.state}"`);
}
