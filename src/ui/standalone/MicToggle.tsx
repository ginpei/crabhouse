import { useEffect, useState } from "react";
import { connect } from "react-redux";
import {
  publishAgora,
  unpublishAgora,
  useAgoraChannelJoined,
  useAgoraSpeaking,
} from "../../data/agora";
import { NiceButton } from "../pure/NiceButton";
import "./MicToggle.scss";

const MicToggleBase: React.FC = () => {
  const [updating, setUpdating] = useState(false);
  const [live] = useAgoraChannelJoined();
  const speaking = useAgoraSpeaking();

  useEffect(() => {
    setUpdating(false);
  }, [speaking]);

  const onSpeakClick = async () => {
    setUpdating(true);
    await publishAgora();
  };

  const onMuteClick = async () => {
    setUpdating(true);
    await unpublishAgora();
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
