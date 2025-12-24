import { useCallback, useState } from 'react';

export interface AsyncState<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
}

export interface UseAsyncOptions {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

export function useAsync<T = unknown>(options?: UseAsyncOptions) {
  const [state, setState] = useState<AsyncState<T>>({
    data: null,
    loading: false,
    error: null,
  });

  const execute = useCallback(
    async (asyncFunction: () => Promise<T>) => {
      setState({ data: null, loading: true, error: null });

      try {
        const data = await asyncFunction();
        setState({ data, loading: false, error: null });
        options?.onSuccess?.();
        return { data, error: null };
      } catch (error) {
        const err = error instanceof Error ? error : new Error(String(error));
        setState({ data: null, loading: false, error: err });
        options?.onError?.(err);
        return { data: null, error: err };
      }
    },
    [options]
  );

  const reset = useCallback(() => {
    setState({ data: null, loading: false, error: null });
  }, []);

  return {
    ...state,
    execute,
    reset,
    isIdle: !state.loading && !state.data && !state.error,
    isSuccess: !state.loading && !!state.data && !state.error,
    isError: !state.loading && !!state.error,
  };
}
