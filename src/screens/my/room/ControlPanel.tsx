import { useState } from "react";
import { sleep } from "../../../misc/misc";
import { NiceButton } from "../../../shared/pure/NiceButton";
import { WideNiceButton } from "../../../shared/pure/WideNiceButton";

export const ControlPanel: React.FC = () => {
  const [roomOpened, setRoomOpened] = useState(false);
  const [muted, setMuted] = useState(false);
  const [updatingRoom, setUpdatingRoom] = useState(false);

  const onUnmuteClick = async () => {
    setMuted(false);
  };

  const onMuteClick = async () => {
    setMuted(true);
  };

  const onOpenRoomClick = async () => {
    setUpdatingRoom(true);
    await sleep(1000);
    setRoomOpened(true);
    setUpdatingRoom(false);
  };

  const onCloseRoomClick = async () => {
    setUpdatingRoom(true);
    await sleep(1000);
    setRoomOpened(false);
    setUpdatingRoom(false);
  };

  return (
    <div className="ControlPanel">
      <p>
        {"Status: "}
        {roomOpened ? (
          <strong>
            Broadcasting...
            <span className="MyRoomPage-speakerIcon">🔊</span>
          </strong>
        ) : (
          <strong>Ready.</strong>
        )}
      </p>
      <p className="MyRoomPage-controlPanel">
        <span className="ui-center">{muted ? "🔇" : "🔊"}</span>
        <NiceButton disabled={!roomOpened || !muted} onClick={onUnmuteClick}>
          🔊 Unmute
        </NiceButton>
        <NiceButton disabled={!roomOpened || muted} onClick={onMuteClick}>
          🔇 Mute
        </NiceButton>
      </p>
      <p>
        <WideNiceButton
          disabled={roomOpened || updatingRoom}
          onClick={onOpenRoomClick}
        >
          🎉 Open room
        </WideNiceButton>
      </p>
      <p>
        <WideNiceButton
          disabled={!roomOpened || updatingRoom}
          niceStyle="danger"
          onClick={onCloseRoomClick}
        >
          👋 Close room
        </WideNiceButton>
      </p>
    </div>
  );
};
