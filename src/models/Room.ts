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

export function getRoomStateLabel(room: Room): string {
  if (room.state === "closed") {
    return "Closed";
  }

  if (room.state === "open") {
    return "Open";
  }

  if (room.state === "live") {
    return "Live";
  }

  throw new Error(`Unknown room state "${room.state}"`);
}
