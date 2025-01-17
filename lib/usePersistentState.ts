import { useCallback, useEffect, useState } from 'react';

export function usePersistentState<T>(
  defaultState: T,
  config?: { store?: Storage; storeKey?: string },
) {
  const store = config?.store ?? localStorage;
  const storeKey = config?.storeKey ?? 'state';

  const [state, setState] = useState<T>(() => {
    const storedState = store.getItem(storeKey);
    return storedState ? JSON.parse(storedState) : defaultState;
  });

  useEffect(() => {
    store.setItem(storeKey, JSON.stringify(state));
  }, [store, storeKey, state]);

  const clear = useCallback(() => {
    store.removeItem(storeKey);
    setState(defaultState);
  }, [store, storeKey, defaultState]);

  return [state, setState, clear] as const;
}
