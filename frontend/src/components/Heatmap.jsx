function getColor(count) {
  if (count === 0) return '#161b22'
  if (count <= 2)  return '#0e4429'
  if (count <= 5)  return '#006d32'
  if (count <= 10) return '#26a641'
  return '#39d353'
}

function getLast365Days() {
  const days = []
  const today = new Date()

  for (let i = 364; i >= 0; i--) {
    const d = new Date(today)
    d.setDate(d.getDate() - i)
    days.push(d.toISOString().slice(0, 10))
  }

  return days
}

export default function Heatmap({ heatmap }) {
  const days = getLast365Days()

  // pad start so grid aligns to Sunday
  const firstDay = new Date(days[0]).getDay()
  const paddedDays = [...Array(firstDay).fill(null), ...days]

  const weeks = []
  for (let i = 0; i < paddedDays.length; i += 7) {
    weeks.push(paddedDays.slice(i, i + 7))
  }

  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

  return (
    <div className="bg-[#0d1117] border border-zinc-800 rounded-xl p-6 mb-5">
      <p className="font-mono text-[10px] text-zinc-500 tracking-[2px] uppercase mb-5">
        Contribution Activity
      </p>

      <div className="overflow-x-auto">
        <div className="flex gap-1 min-w-max">
          {weeks.map((week, wi) => (
            <div key={wi} className="flex flex-col gap-1">
              {week.map((day, di) => {
                if (!day) return <div key={di} className="w-3 h-3" />
                const count = heatmap[day] ?? 0
                return (
                  <div
                    key={di}
                    className="w-3 h-3 rounded-sm cursor-pointer transition-transform hover:scale-125"
                    style={{ background: getColor(count) }}
                    title={`${day}: ${count} commits`}
                  />
                )
              })}
            </div>
          ))}
        </div>

        <div className="flex justify-between mt-2 text-zinc-600 font-mono text-[10px]">
          {months.map(m => <span key={m}>{m}</span>)}
        </div>
      </div>

      <div className="flex items-center gap-2 mt-4 justify-end">
        <span className="font-mono text-[10px] text-zinc-600">Less</span>
        {['#161b22', '#0e4429', '#006d32', '#26a641', '#39d353'].map(c => (
          <div key={c} className="w-3 h-3 rounded-sm" style={{ background: c }} />
        ))}
        <span className="font-mono text-[10px] text-zinc-600">More</span>
      </div>
    </div>
  )
}