import { createDataRecord, DataRecord } from "./DataRecord";

export interface Room extends DataRecord {
  name: string;
  speakerIds: string[];
  status: "open" | "closed";
  userId: string;
}

export function createRoom(initial?: Partial<Room>): Room {
  return {
    ...createDataRecord(initial),
    name: initial?.name || "",
    speakerIds: initial?.speakerIds || [],
    status: initial?.status || "closed",
    userId: initial?.userId || "",
  };
}
