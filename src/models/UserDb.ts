import { ssToDataRecord } from "./DataRecordDb";
import { DocumentSnapshot, functions, isTimestamp } from "./firebase";
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

export async function follow(userId: string): Promise<void> {
  const f = functions.httpsCallable("follow");
  await f({ userId });
}

export function onUserSnapshot(
  userId: string,
  callback: (user: User | null, ss: DocumentSnapshot) => void
): () => void {
  return getUserDocument(userId).onSnapshot(async (ss) => {
    if (!ss.exists) {
      callback(null, ss);
      return;
    }

    // this is the 1st step of 2 steps that serverTimestamp() requires
    const data = ss.data() || {};
    if (!isTimestamp(data.createdAt) || !isTimestamp(data.updatedAt)) {
      return;
    }

    const user = ssToUser(ss);
    callback(user, ss);
  });
}
