export default function Checklist({ checklist }) {
  return (
    <div className="bg-[#0d1117] border border-zinc-800 rounded-xl p-6 mb-5">
      <p className="font-mono text-[10px] text-zinc-500 tracking-[2px] uppercase mb-5">
        Profile Checklist
      </p>
      <div className="grid grid-cols-3 gap-3">
        {checklist.map((item) => (
          <div
            key={item.label}
            className="flex items-center gap-3 bg-[#161b22] border border-zinc-800 rounded-lg px-4 py-3"
          >
            <span
              className={`w-2 h-2 rounded-full flex-shrink-0 ${
                item.passed ? 'bg-green-400' : 'bg-zinc-700'
              }`}
            />
            <span className="text-zinc-400 text-sm">{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}