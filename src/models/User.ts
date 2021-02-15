import { createDataRecord, DataRecord } from "./DataRecord";

export interface User extends DataRecord {
  bio: string;
  name: string;
  twitter: string;
  website: string;
}

export function createUser(initial?: Partial<User>): User {
  return {
    ...createDataRecord(initial),
    bio: initial?.bio || "",
    name: initial?.name || "",
    twitter: initial?.twitter || "",
    website: initial?.website || "",
  };
}
