/**
 * Data on Redux.
 */
export interface DataRecord {
  createdAt: number;
  id: string;
  updatedAt: number;
}

export function createDataRecord(initial?: Partial<DataRecord>): DataRecord {
  return {
    createdAt: initial?.createdAt || 0,
    id: initial?.id || "",
    updatedAt: initial?.updatedAt || 0,
  };
}

// export function modelToDocumentData<T extends DataRecord>(
//   model: T
// ): DocumentData<T> {
//   const { id, createdAt, ...data } = model;
//   return { ...data, createdAt: new firebase.firestore.Timestamp(createdAt, 0) };
// }

// export function isDocumentData<T extends DataRecord>(
//   model: Partial<T> | DocumentData<T> | undefined
// ): model is DocumentData<T> {
//   return model?.createdAt instanceof firebase.firestore.Timestamp;
// }
