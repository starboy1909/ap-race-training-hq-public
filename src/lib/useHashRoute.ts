import { useCallback, useSyncExternalStore } from 'react';
import { parseHash, toHash, type Route } from './route.ts';

const subscribe = (cb: () => void) => { addEventListener('hashchange', cb); return () => removeEventListener('hashchange', cb); };
const snapshot = () => location.hash;

export function useHashRoute(): [Route, (r: Route, opts?: { replace?: boolean }) => void] {
  const hash = useSyncExternalStore(subscribe, snapshot, () => '');
  const navigate = useCallback((r: Route, opts?: { replace?: boolean }) => {
    const next = toHash(r);
    if (next === location.hash) return;
    if (opts?.replace) history.replaceState(null, '', next); else location.hash = next;
    if (opts?.replace) dispatchEvent(new HashChangeEvent('hashchange'));
  }, []);
  return [parseHash(hash), navigate];
}
