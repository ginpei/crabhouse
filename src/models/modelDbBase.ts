import { useEffect, useState } from "react";
import { AppError } from "./AppError";
import { DataRecord, DocumentData } from "./DataRecord";
import {
  CollectionReference,
  db,
  DocumentReference,
  DocumentSnapshot,
} from "./firebase";

export function createModelFunctions<T extends DataRecord>(options: {
  collectionName: string;
  modelToDocumentData?: (model: T) => DocumentData<T>;
  ssToModel: (ss: DocumentSnapshot) => T;
}): [
  saveModel: (model: T) => Promise<T>,
  getModel: (id: string) => Promise<T>,
  getModelCollection: () => CollectionReference,
  getModelDocument: (id: string) => DocumentReference,
  useModel: (id: string | null) => [T | null, Error | null]
] {
  const {
    collectionName,
    modelToDocumentData = defaultModelToDocumentData,
    ssToModel,
  } = options;

  async function saveModel(model: T): Promise<T> {
    const data = modelToDocumentData(model);

    if (model.id) {
      const doc = getModelDocument(model.id);
      await doc.set(data);
      return model;
    }

    const coll = getModelCollection();
    const doc = await coll.add(data);
    const newSs = await doc.get();
    const newModel = ssToModel(newSs);
    return newModel;
  }

  async function getModel(id: string): Promise<T> {
    const doc = getModelDocument(id);
    const ss = await doc.get();
    if (!ss.exists) {
      throw new AppError(
        `Document "${id}" is not found in "${collectionName}"`,
        "document-not-found"
      );
    }

    const model = ssToModel(ss);
    return model;
  }

  function getModelCollection(): CollectionReference {
    return db.collection(collectionName);
  }

  function getModelDocument(id: string): DocumentReference {
    return getModelCollection().doc(id);
  }

  function useModel(id: string | null): [T | null, Error | null] {
    const [model, setModel] = useState<T | null>(null);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
      setModel(null);
      setError(null);

      if (id === null) {
        return;
      }

      getModel(id)
        .then((v) => setModel(v))
        .catch((v) => setError(v));
    }, [id]);

    return [model, error];
  }

  return [saveModel, getModel, getModelCollection, getModelDocument, useModel];
}

export function defaultModelToDocumentData<T extends DataRecord>(
  model: T
): DocumentData<T> {
  const { id, ...data } = model;
  return data;
}
