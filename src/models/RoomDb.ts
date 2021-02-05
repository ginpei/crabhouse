import { createModelFunctions } from "./modelDbBase";
import { createRoom, Room } from "./Room";

export const [
  saveRoom,
  getRoom,
  getRoomCollection,
  getRoomDocument,
  useRoom,
] = createModelFunctions<Room>({
  collectionName: "rooms",
  ssToModel(ss) {
    return createRoom({ ...ss.data(), id: ss.id });
  },
});
