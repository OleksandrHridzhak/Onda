import { useEffect, useState, useCallback } from 'react';
import { RxDocument, RxCollection, RxQuery } from 'rxdb';
import { getDatabase, OndaDatabase } from '../database/rxdb';

/**
 * Hook to get RxDB database instance
 */
export function useRxDB(): OndaDatabase | null {
  const [db, setDb] = useState<OndaDatabase | null>(null);

  useEffect(() => {
    let mounted = true;

    getDatabase().then((database) => {
      if (mounted) {
        setDb(database);
      }
    });

    return () => {
      mounted = false;
    };
  }, []);

  return db;
}

/**
 * Hook to get a specific collection
 */
export function useRxCollection<T = any>(
  collectionName: string,
): RxCollection<T> | null {
  const db = useRxDB();
  return db ? (db[collectionName] as RxCollection<T>) : null;
}

/**
 * Hook to subscribe to a query and get reactive results
 */
export function useRxQuery<T = any>(query: RxQuery<T> | null): T[] | null {
  const [results, setResults] = useState<T[] | null>(null);

  useEffect(() => {
    if (!query) {
      setResults(null);
      return;
    }

    // Initial fetch
    query.exec().then(setResults);

    // Subscribe to changes
    const subscription = query.$.subscribe((docs) => {
      setResults(docs as any);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [query]);

  return results;
}

/**
 * Hook to subscribe to a single document
 */
export function useRxDocument<T = any>(doc: RxDocument<T> | null): T | null {
  const [data, setData] = useState<T | null>(null);

  useEffect(() => {
    if (!doc) {
      setData(null);
      return;
    }

    // Initial value
    setData(doc.toJSON() as T);

    // Subscribe to changes
    const subscription = doc.$.subscribe((document) => {
      setData(document.toJSON() as T);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [doc]);

  return data;
}

/**
 * Hook to get all documents from a collection reactively
 */
export function useRxCollectionData<T = any>(
  collectionName: string,
): T[] | null {
  const collection = useRxCollection<T>(collectionName);
  const [data, setData] = useState<T[] | null>(null);

  useEffect(() => {
    if (!collection) {
      setData(null);
      return;
    }

    // Initial fetch
    collection
      .find()
      .exec()
      .then((docs) => setData(docs.map((d) => d.toJSON() as T)));

    // Subscribe to changes
    const subscription = collection.find().$.subscribe((docs) => {
      setData(docs.map((d) => d.toJSON() as T));
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [collection]);

  return data;
}

/**
 * Hook to get a single document by ID reactively
 */
export function useRxDocumentById<T = any>(
  collectionName: string,
  docId: string | null,
): T | null {
  const collection = useRxCollection<T>(collectionName);
  const [data, setData] = useState<T | null>(null);

  useEffect(() => {
    if (!collection || !docId) {
      setData(null);
      return;
    }

    // Initial fetch
    collection
      .findOne(docId)
      .exec()
      .then((doc) => {
        if (doc) {
          setData(doc.toJSON() as T);
        }
      });

    // Subscribe to changes
    const subscription = collection.findOne(docId).$.subscribe((doc) => {
      if (doc) {
        setData(doc.toJSON() as T);
      } else {
        setData(null);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [collection, docId]);

  return data;
}
