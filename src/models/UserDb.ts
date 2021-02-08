import { ssToDataRecord } from "./DataRecordDb";
import { DocumentSnapshot } from "./firebase";
import { createModelFunctions } from "./modelDbBase";
import { createUser, User } from "./User";

export const [
  saveUser,
  getUser,
  getUserCollection,
  getUserDocument,
  useUser,
] = createModelFunctions<User>({
  collectionName: "users",
  ssToModel: ssToUser,
});

export function ssToUser(ss: DocumentSnapshot): User {
  return createUser({ ...ss.data(), ...ssToDataRecord(ss) });
}
