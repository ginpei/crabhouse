import { createDataRecord, DataRecord } from "./DataRecord";

export interface Room extends DataRecord {
  name: string;
  state: RoomState;
}

export type RoomState = "preparing" | "open" | "closed";

export function createRoom(initial?: Partial<Room>): Room {
  return {
    ...createDataRecord(initial),
    name: initial?.name || "",
    state: initial?.state || "preparing",
  };
}
