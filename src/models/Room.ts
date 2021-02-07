import { createDataRecord, DataRecord } from "./DataRecord";

export interface Room extends DataRecord {
  name: string;
  speakerIds: string[];
  state: RoomState;
  userId: string;
}

export type RoomState = "preparing" | "open" | "closed";

export function createRoom(initial?: Partial<Room>): Room {
  return {
    ...createDataRecord(initial),
    name: initial?.name || "",
    speakerIds: initial?.speakerIds || [],
    state: initial?.state || "preparing",
    userId: initial?.userId || "",
  };
}
