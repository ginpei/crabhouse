import { createDataRecord, DataRecord } from "./DataRecord";

export interface Room extends DataRecord {
  name: string;
  state: RoomState;
}

/**
 * - "closed" - Not available
 * - "open" - Can join but not sounds yet
 * - "live" - Can join and listen
 */
export type RoomState = "closed" | "open" | "live";

export function createRoom(initial?: Partial<Room>): Room {
  return {
    ...createDataRecord(initial),
    name: initial?.name || "",
    state: initial?.state || "closed",
  };
}
