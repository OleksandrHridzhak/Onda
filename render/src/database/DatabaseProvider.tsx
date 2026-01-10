/**
 * Database Provider
 *
 * React context provider for RxDB database.
 * Initializes the database and provides access to hooks.
 */

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from 'react';
import { getDatabase, OndaDatabase } from './index';

interface DatabaseContextValue {
  db: OndaDatabase | null;
  isReady: boolean;
  error: Error | null;
}

const DatabaseContext = createContext<DatabaseContextValue>({
  db: null,
  isReady: false,
  error: null,
});

interface DatabaseProviderProps {
  children: ReactNode;
}

export function DatabaseProvider({ children }: DatabaseProviderProps) {
  const [db, setDb] = useState<OndaDatabase | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let mounted = true;

    const init = async () => {
      try {
        const database = await getDatabase();
        if (mounted) {
          setDb(database);
          setIsReady(true);
        }
      } catch (err) {
        if (mounted) {
          setError(err as Error);
          console.error('Failed to initialize database:', err);
        }
      }
    };

    init();

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <DatabaseContext.Provider value={{ db, isReady, error }}>
      {children}
    </DatabaseContext.Provider>
  );
}

export function useDatabase() {
  return useContext(DatabaseContext);
}
