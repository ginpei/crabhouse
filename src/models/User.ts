import { createDataRecord, DataRecord } from "./DataRecord";

export interface User extends DataRecord {
  name: string;
}

export function createUser(initial?: Partial<User>): User {
  return {
    ...createDataRecord(initial),
    name: initial?.name || "",
  };
}
