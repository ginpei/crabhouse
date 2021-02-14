import { useState } from "react";
import { connect } from "react-redux";
import { NiceButton } from "../../../shared/pure/NiceButton";
import {
  publishAgora,
  unpublishAgora,
  useAgoraChannelJoined,
  useAgoraClient,
} from "../../../stores/agora";
import "./MicToggle.scss";

type MicState = "speaking" | "muted" | "toggling";

const MicToggleBase: React.FC = () => {
  const [micState, setMicState] = useState<MicState>("muted");
  const agoraClient = useAgoraClient();
  const [live] = useAgoraChannelJoined(agoraClient);

  const onSpeakClick = async () => {
    setMicState("toggling");
    try {
      await publishAgora(agoraClient);
      setMicState("speaking");
    } catch (error) {
      setMicState("muted");
      throw error;
    }
  };

  const onMuteClick = async () => {
    setMicState("toggling");
    try {
      await unpublishAgora(agoraClient);
    } finally {
      setMicState("muted");
    }
  };

  return (
    <div className="MicToggle">
      <NiceButton
        className="MicToggle-button"
        data-mictoggle-active={micState === "speaking"}
        disabled={!live}
        onClick={onSpeakClick}
      >
        💬 Speak
      </NiceButton>
      <NiceButton
        className="MicToggle-button"
        data-mictoggle-active={micState === "muted"}
        disabled={!live}
        onClick={onMuteClick}
      >
        🔇 Mute
      </NiceButton>
    </div>
  );
};

export const MicToggle = connect()(MicToggleBase);
