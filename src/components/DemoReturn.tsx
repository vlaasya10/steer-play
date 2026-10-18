import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
const DemoReturn = createContext<string | null>(null);
export function validReturn(value: unknown): value is string {
  return typeof value === 'string' && /^\/demo(?:\?[^#\r\n]*|\/reels\?[^#\r\n]*)?$/.test(value);
}
// Navigation context stays in memory; shared URLs never contain demo state.
export function DemoReturnProvider({ children }: { children: ReactNode }) {
  const location = useLocation();
  const requested: unknown = location.state?.demoReturn;
  const [remembered, setRemembered] = useState<string | null>(null);
  useEffect(() => {
    if (validReturn(requested)) setRemembered(requested);
    else if (location.pathname === '/demo' || location.pathname === '/demo/reels') setRemembered(`${location.pathname}${location.search}`);
    else if (location.pathname === '/') setRemembered(null);
  }, [requested, location.pathname, location.search]);
  return <DemoReturn.Provider value={validReturn(requested) ? requested : location.pathname === '/' ? null : remembered}>{children}</DemoReturn.Provider>;
}
export default function DemoReturnLink() {
  const destination = useContext(DemoReturn);
  return destination ? <Link className="text-link demo-return" to={destination}>← Return to {destination.startsWith('/demo?') && new URL(destination,'https://demo.invalid').searchParams.get('guided') === '1' ? 'guided demo' : 'demo'}</Link> : null;
}
