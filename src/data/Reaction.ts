import { createDataRecord, DataRecord } from "./DataRecord";

export type ReactionType = "raiseHands";

export interface Reaction extends DataRecord {
  roomId: string;
  type: ReactionType;
  userId: string;
}

export function createReaction(initial?: Partial<Reaction>): Reaction {
  return {
    ...createDataRecord(initial),
    roomId: initial?.roomId || "",
    type: initial?.type || "raiseHands",
    userId: initial?.userId || "",
  };
}
