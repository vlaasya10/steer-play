import { useRef, useState } from 'react';
import { Check, Copy, Share2 } from 'lucide-react';

export const challengePath = '/play/missing-clue';
export function getChallengeUrl() { return new URL(challengePath, window.location.origin).href; }
export type ShareOutcome = 'shared' | 'copied' | 'manual' | 'cancelled';
export interface ShareChallengeProps { path?: string; title?: string; text?: string; label?: string; linkKind?: 'challenge' | 'learning'; onShare?: () => void; onResult?: (result: ShareOutcome) => void }

export default function ShareChallenge({ path = challengePath, title = 'Steer Play — Can you spot what’s missing?', text = 'One breakfast table. One missing detail. Try this little challenge.', label = 'Challenge a Friend', linkKind = 'challenge', onShare, onResult }: ShareChallengeProps) {
  const [status, setStatus] = useState<'idle' | 'copied' | 'manual' | 'shared' | 'cancelled'>('idle');
  const [busy, setBusy] = useState(false);
  const inFlight = useRef(false);
  const url = new URL(path, window.location.origin).href;
  async function share() {
    if (inFlight.current) return;
    inFlight.current = true;
    setBusy(true);
    setStatus('idle');
    onShare?.();
    try {
      if (navigator.share) {
        try { await navigator.share({ title, text, url }); setStatus('shared'); onResult?.('shared'); return; }
        catch (error) { if (typeof error === 'object' && error !== null && 'name' in error && error.name === 'AbortError') { setStatus('cancelled'); onResult?.('cancelled'); return; } }
      }
      try {
        if (!navigator.clipboard?.writeText) throw new Error('Clipboard unavailable');
        await navigator.clipboard.writeText(url);
        setStatus('copied');
        onResult?.('copied');
      } catch { setStatus('manual'); onResult?.('manual'); }
    } finally { inFlight.current = false; setBusy(false); }
  }
  return <div className="share-challenge">
    <p className="share-description">{linkKind === 'learning' ? 'Share a public educational explanation. No personal answers or health information.' : 'Can you solve this challenge too? Share the same public challenge, without your answers.'}</p>
    <button className="button outline" onClick={share} disabled={busy} aria-busy={busy}>{status === 'copied' ? <Check size={17} /> : <Share2 size={17} />}{busy ? 'Opening share options…' : status === 'copied' ? `${linkKind === 'learning' ? 'Learning' : 'Challenge'} link copied` : label}</button>
    {status !== 'idle' && <p role="status">{status === 'copied' ? 'Ready to paste into a message to a friend.' : status === 'shared' ? 'Thanks for sharing a little curiosity.' : status === 'cancelled' ? `Sharing cancelled. Your ${linkKind === 'learning' ? 'explanation' : 'challenge'} is still here.` : `Couldn’t copy automatically. Copy this ${linkKind} link to share:`}</p>}
    {status === 'manual' && <label className="manual-copy"><Copy size={16} /><span className="sr-only">{linkKind === 'learning' ? 'Learning URL' : 'Challenge URL'}</span><input readOnly value={url} onFocus={event => event.currentTarget.select()} /></label>}
  </div>;
}
