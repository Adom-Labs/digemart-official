import { useState, useCallback } from "react";

type LoadingStates = Record<string, boolean>;

export function useLoading(initialLoadingKeys: string[] = []) {
  const [loadingStates, setLoadingStates] = useState<LoadingStates>(() => {
    return initialLoadingKeys.reduce((acc, key) => {
      acc[key] = false;
      return acc;
    }, {} as LoadingStates);
  });

  const startLoading = useCallback((key: string) => {
    setLoadingStates((prev) => ({ ...prev, [key]: true }));
  }, []);

  const stopLoading = useCallback((key: string) => {
    setLoadingStates((prev) => ({ ...prev, [key]: false }));
  }, []);

  const isLoading = useCallback(
    (key: string): boolean => {
      return loadingStates[key] ?? false;
    },
    [loadingStates]
  );

  return { isLoading, startLoading, stopLoading, loadingStates };
}
