import { useEffect, useState } from "react";
import { getRoomStateLabel, Room } from "../../../models/Room";
import { saveRoom } from "../../../models/RoomDb";
import { WideNiceButton } from "../../../shared/pure/WideNiceButton";

export const RoomStateSection: React.FC<{ room: Room }> = ({ room }) => {
  const [dirty, setDirty] = useState(false);

  const onClosedClick = () => {
    setDirty(true);
    saveRoom({ ...room, state: "closed" });
    // TODO stop streaming
  };

  const onOpenClick = () => {
    setDirty(true);
    saveRoom({ ...room, state: "open" });
  };

  const onLiveClick = () => {
    setDirty(true);
    saveRoom({ ...room, state: "live" });
    // TODO start streaming
  };

  useEffect(() => {
    setDirty(false);
  }, [room]);

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
          🛌 Closed
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
