import { useCallback, useEffect, useRef, useState } from "react";

/** Minimal async loader: runs on mount, exposes reload, ignores results after unmount. */
export function useAsync<T>(fn: () => Promise<T>, deps: unknown[] = []) {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const alive = useRef(true);
  const fnRef = useRef(fn);
  fnRef.current = fn;

  const reload = useCallback(async () => {
    setLoading(true);
    try {
      const result = await fnRef.current();
      if (alive.current) { setData(result); setError(null); }
    } catch (e) {
      if (alive.current) setError(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      if (alive.current) setLoading(false);
    }
  }, []);

  useEffect(() => {
    alive.current = true;
    void reload();
    return () => { alive.current = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return { data, error, loading, reload, setData };
}
