import { useState } from "react";
import { connect } from "react-redux";
import { useHistory } from "react-router-dom";
import { useErrorLog } from "../../../misc/misc";
import { createRoom, Room } from "../../../models/Room";
import { saveRoom } from "../../../models/RoomDb";
import { LoadingScreen } from "../../../shared/pure/LoadingScreen";
import { NiceButton } from "../../../shared/pure/NiceButton";
import { AppState } from "../../../stores/appStore";
import { useCurrentUserStore } from "../../../stores/currentUser";
import { BasicLayout } from "../../shared/BasicLayout";
import { roomViewPagePath } from "../view/RoomViewPage";

export function roomCreatePagePath(): string {
  return "/rooms/new/";
}

export const RoomCreatePageBase: React.FC<ReturnType<typeof mapState>> = ({
  currentUserId,
}) => {
  const [room, setNewRoom] = useState(createRoom());
  const [roomError, setRoomError] = useState<Error | null>(null);
  const [saving, setSaving] = useState(false);
  const history = useHistory();
  useCurrentUserStore();
  useErrorLog(roomError);

  const onFormSubmit = async (newRoom: Room) => {
    if (!currentUserId) {
      throw new Error("User must have logged in");
    }

    setSaving(true);
    setRoomError(null);
    try {
      const createdRoom = await saveRoom({ ...newRoom, userId: currentUserId });
      // replace for better page back experience
      history.replace(roomViewPagePath(createdRoom.id));
    } catch (error) {
      setRoomError(error);
      setSaving(false);
    }
  };

  const onFormChange = (newRoom: Room) => {
    setNewRoom(newRoom);
  };

  if (currentUserId === null) {
    return <LoadingScreen />;
  }

  if (currentUserId === "") {
    throw new Error("User must have logged in");
  }

  return (
    <BasicLayout className="RoomCreatePage" title="Create a new room">
      <h1>RoomCreatePage</h1>
      <RoomForm
        disabled={saving}
        onSubmit={onFormSubmit}
        onChange={onFormChange}
        room={room}
      />
    </BasicLayout>
  );
};

const mapState = (state: AppState) => ({
  currentUserId: state.currentUserId,
});

export const RoomCreatePage = connect(mapState)(RoomCreatePageBase);

const RoomForm: React.FC<{
  disabled: boolean;
  onSubmit: (room: Room) => void;
  onChange: (room: Room) => void;
  room: Room;
}> = ({ disabled, onSubmit, onChange, room }) => {
  const onFormSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    onSubmit(room);
  };

  const onValueChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.currentTarget;
    if (name === "name") {
      onChange({ ...room, name: value });
    } else {
      throw new Error(`Unknown name "${name}"`);
    }
  };

  return (
    <form className="RoomForm" onSubmit={onFormSubmit}>
      <p>
        <label>
          Name:{" "}
          <input
            disabled={disabled}
            type="text"
            name="name"
            value={room.name}
            onChange={onValueChange}
          />
        </label>
      </p>
      <p>
        <NiceButton disabled={disabled}>OK</NiceButton>
      </p>
    </form>
  );
};
