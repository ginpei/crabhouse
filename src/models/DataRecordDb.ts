import { DataRecord } from "./DataRecord";
import { DocumentSnapshot, isTimestamp, Timestamp } from "./firebase";

/**
 * Data on Firebase Firestore.
 */
export type DocumentData<T extends DataRecord> = Omit<
  T,
  "createdAt" | "id" | "updatedAt"
> &
  DataRecordDocumentData;

interface DataRecordDocumentData {
  updatedAt: Timestamp;
  createdAt: Timestamp;
}

/**
 * Returns exact DataRecord without any extra props.
 */
export function ssToDataRecord(ss: DocumentSnapshot): DataRecord {
  const data = ss.data();
  if (!data) {
    throw new Error();
  }

  assertDataRecordDocumentData(data);

  const dataRecord: DataRecord = {
    createdAt: data.createdAt.toMillis(),
    id: ss.id,
    updatedAt: data.createdAt.toMillis(),
  };
  return dataRecord;
}

function assertDataRecordDocumentData(
  data: unknown
): asserts data is DataRecordDocumentData {
  if (typeof data !== "object" || !data) {
    throw new Error("Data must be an object");
  }

  if (
    !("createdAt" in data) ||
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    !isTimestamp((data as any).createdAt)
  ) {
    throw new Error("Data must have `createdAt` as Timestamp");
  }

  if (
    !("updatedAt" in data) ||
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    !isTimestamp((data as any).updatedAt)
  ) {
    throw new Error("Data must have `updatedAt` as Timestamp");
  }
}
