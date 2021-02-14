import { useEffect, useState } from "react";
import { connect } from "react-redux";
import {
  publishAgora,
  unpublishAgora,
  useAgoraChannelJoined,
  useAgoraClient,
  useAgoraSpeaking,
} from "../../stores/agora";
import { NiceButton } from "../pure/NiceButton";
import "./MicToggle.scss";

const MicToggleBase: React.FC = () => {
  const [updating, setUpdating] = useState(false);
  const agoraClient = useAgoraClient();
  const [live] = useAgoraChannelJoined(agoraClient);
  const speaking = useAgoraSpeaking(agoraClient);

  useEffect(() => {
    setUpdating(false);
  }, [speaking]);

  const onSpeakClick = async () => {
    setUpdating(true);
    await publishAgora(agoraClient);
  };

  const onMuteClick = async () => {
    setUpdating(true);
    await unpublishAgora(agoraClient);
  };

  return (
    <div className="MicToggle">
      <NiceButton
        className="MicToggle-button"
        data-mictoggle-active={!updating && speaking}
        disabled={!live || updating}
        onClick={onSpeakClick}
      >
        💬 Speak
      </NiceButton>
      <NiceButton
        className="MicToggle-button"
        data-mictoggle-active={!updating && !speaking}
        disabled={!live || updating}
        onClick={onMuteClick}
      >
        🔇 Mute
      </NiceButton>
    </div>
  );
};

export const MicToggle = connect()(MicToggleBase);
