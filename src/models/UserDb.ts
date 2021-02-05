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
  ssToModel(ss) {
    return createUser({ ...ss.data(), id: ss.id });
  },
});
