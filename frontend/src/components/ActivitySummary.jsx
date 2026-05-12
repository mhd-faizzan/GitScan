function StatBox({ label, value }) {
  return (
    <div className="bg-[#161b22] border border-zinc-800 rounded-xl p-5 flex flex-col gap-1">
      <p className="font-mono text-[10px] text-zinc-500 tracking-[2px] uppercase">{label}</p>
      <p className="font-mono text-2xl font-bold text-white">{value ?? '—'}</p>
    </div>
  )
}

export default function ActivitySummary({ activity }) {
  return (
    <div className="bg-[#0d1117] border border-zinc-800 rounded-xl p-6 mb-5">
      <p className="font-mono text-[10px] text-zinc-500 tracking-[2px] uppercase mb-5">
        Activity
      </p>
      <div className="grid grid-cols-4 gap-4">
        <StatBox label="Total Commits"     value={activity.total_commits} />
        <StatBox label="Active Days"       value={activity.active_days} />
        <StatBox label="Most Active Month" value={activity.most_active_month} />
        <StatBox label="Last Pushed"       value={activity.last_pushed} />
      </div>
    </div>
  )
}