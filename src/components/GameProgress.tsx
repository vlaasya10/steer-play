const defaultLabels = ['Observe', 'Find', 'Discover', 'Take away'];
export default function GameProgress({ step, labels = defaultLabels }: { step: number; labels?: string[] }) {
  return <ol className="game-progress" aria-label="Game progress" style={{ gridTemplateColumns: `repeat(${labels.length}, minmax(0, 1fr))` }}>{labels.map((label, i) => <li key={label} className={i <= step ? 'reached' : ''} aria-current={i === step ? 'step' : undefined}><span>{String(i + 1).padStart(2, '0')}</span>{label}</li>)}</ol>;
}
