import { AppError } from "./AppError";
import { DocumentData } from "./DataRecord";
import { auth, CollectionReference, db, DocumentReference } from "./firebase";
import { createUser, User } from "./User";

export async function saveUser(user: User): Promise<void> {
  if (!auth.currentUser) {
    throw new Error("User must have logged in");
  }

  const data = userToDocumentData(user);

  if (user.id) {
    const doc = getUserDocument(user.id);
    await doc.set(data);
  } else {
    const coll = getUserCollection();
    await coll.add(data);
  }
}

export async function getUser(userId: string): Promise<User> {
  const doc = getUserDocument(userId);
  const ss = await doc.get();
  if (!ss.exists) {
    throw new AppError(`User "${userId}" is not found`, "document-not-found");
  }

  const user = createUser({ ...ss.data(), id: ss.id });
  return user;
}

export function getUserCollection(): CollectionReference {
  return db.collection("users");
}

export function getUserDocument(userId: string): DocumentReference {
  return getUserCollection().doc(userId);
}

export function userToDocumentData(user: User): DocumentData<User> {
  const { id, ...data } = user;
  return data;
}
