const scoreColor = (n) => {
  if (n >= 75) return 'text-green-400'
  if (n >= 50) return 'text-yellow-400'
  return 'text-red-400'
}

const barColor = (n) => {
  if (n >= 75) return 'bg-green-400'
  if (n >= 50) return 'bg-yellow-400'
  return 'bg-red-400'
}

const descriptions = {
  activity: (n) =>
    n >= 70 ? 'Consistently pushing code.'
    : n >= 40 ? 'Some activity, room to grow.'
    : 'Limited public activity.',

  quality: (n) =>
    n >= 70 ? 'Well-documented repos with stars.'
    : 'Projects could use more polish.',

  consistency: (n) =>
    n >= 70 ? 'Ships code across the whole year.'
    : 'Activity is clustered in short bursts.',

  health: (n) =>
    n >= 70 ? 'Complete, professional profile.'
    : 'Profile is missing a few details.',
}

function ScoreCard({ label, value, descKey }) {
  return (
    <div className="bg-[#0d1117] border border-zinc-800 rounded-xl p-6">
      <p className="font-mono text-[10px] text-zinc-500 tracking-[2px] uppercase mb-3">
        {label}
      </p>
      <p className={`font-mono text-5xl font-bold mb-3 ${scoreColor(value)}`}>
        {value}
      </p>
      <div className="h-[3px] bg-zinc-800 rounded-full overflow-hidden mb-3">
        <div
          className={`h-full rounded-full transition-all duration-1000 ${barColor(value)}`}
          style={{ width: `${value}%` }}
        />
      </div>
      <p className="text-zinc-500 text-xs leading-relaxed">
        {descriptions[descKey](value)}
      </p>
    </div>
  )
}

export default function ScoreCards({ scores }) {
  return (
    <div className="grid grid-cols-2 gap-4 mb-5">
      <ScoreCard label="Activity Score"  value={scores.activity}    descKey="activity" />
      <ScoreCard label="Project Quality" value={scores.quality}     descKey="quality" />
      <ScoreCard label="Consistency"     value={scores.consistency} descKey="consistency" />
      <ScoreCard label="Profile Health"  value={scores.health}      descKey="health" />
    </div>
  )
}