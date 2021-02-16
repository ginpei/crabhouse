import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { AppState } from "../../../../data/appStore";
import { useCurrentUserStore } from "../../../../data/currentUser";
import { Reaction, ReactionType } from "../../../../data/Reaction";
import { useLiveReactionCollection } from "../../../../data/ReactionDb";
import { useLiveRoomParticipants } from "../../../../data/RoomParticipantDb";
import { User } from "../../../../data/User";
import { LineLink } from "../../../combination/LineLink";
import { LoadingScreen } from "../../../pure/LoadingScreen";
import { MicToggle } from "../../../standalone/MicToggle";
import { BasicLayout } from "../../shared/BasicLayout";
import { LoginScreen } from "../../shared/LoginScreen";
import { userRoomPagePath } from "../../users/room/UserRoomPage";
import { userViewPagePath } from "../../users/UserViewPage";
import { myPagePath } from "../MyPage";
import "./MyRoomPage.scss";
import { RoomStateSection } from "./RoomStateSection";

export function myRoomPagePath(): string {
  return `${myPagePath()}room/`;
}

const mapState = (state: AppState) => ({
  currentUser: state.currentUser,
  currentUserId: state.currentUserId,
});

const MyRoomPageBase: React.FC<ReturnType<typeof mapState>> = ({
  currentUser,
  currentUserId,
}) => {
  useCurrentUserStore();

  const reactions = useLiveReactionCollection(currentUserId);
  const [speakers, listeners] = useLiveRoomParticipants(currentUserId);

  if (currentUserId === null) {
    return <LoadingScreen />;
  }

  if (currentUserId === "" || currentUser === null) {
    return <LoginScreen title="My room" />;
  }

  if (reactions === null || speakers === null || listeners === null) {
    return <LoadingScreen />;
  }

  return (
    <BasicLayout className="MyRoomPage" title="My room">
      <p>
        <Link to={userViewPagePath(currentUser.id)}>{currentUser.name}</Link>{" "}
        &gt; <Link to={userRoomPagePath(currentUserId)}>Room</Link> &gt; My room
      </p>
      <h1>{currentUser.name}'s room</h1>
      <RoomStateSection currentUserId={currentUserId} />
      <details open>
        <summary>Sound control</summary>
        <MicToggle />
      </details>
      <h2>Reactions</h2>
      <div>
        {reactions.map((reaction) => (
          <ReactionLine
            key={reaction.id}
            participants={[...listeners, ...speakers]}
            reaction={reaction}
          />
        ))}
      </div>
      <h2>Speakers ({speakers.length})</h2>
      <div className="ui-uncontainer">
        {speakers.map((speaker) => (
          <LineLink key={speaker.id} to={userViewPagePath(speaker.id)}>
            {speaker.name}
          </LineLink>
        ))}
      </div>
      <h2>Listeners ({listeners.length})</h2>
      <div className="ui-uncontainer">
        {listeners.map((listener) => (
          <LineLink key={listener.id} to={userViewPagePath(listener.id)}>
            {listener.name}
          </LineLink>
        ))}
      </div>
    </BasicLayout>
  );
};

export const MyRoomPage = connect(mapState)(MyRoomPageBase);

const ReactionLine: React.FC<{ participants: User[]; reaction: Reaction }> = ({
  participants,
  reaction,
}) => {
  const user = participants.find((v) => v.id === reaction.userId);
  const emojiMap: Record<ReactionType, string> = {
    raiseHands: "🙌",
  };

  return (
    <div className="ReactionLine">
      {emojiMap[reaction.type]} by {user?.name ?? "???"} at{" "}
      {new Date(reaction.createdAt).toLocaleTimeString()}
    </div>
  );
};
