export default function TechStack({ languages }) {
  return (
    <div className="bg-[#0d1117] border border-zinc-800 rounded-xl p-6 mb-5">
      <p className="font-mono text-[10px] text-zinc-500 tracking-[2px] uppercase mb-5">
        Tech Stack
      </p>

      <div className="space-y-4">
        {languages.map((lang) => (
          <div key={lang.name} className="flex items-center gap-4">
            <div className="flex items-center gap-2 w-28 flex-shrink-0">
              <span
                className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                style={{ background: lang.color }}
              />
              <span className="font-mono text-xs text-white truncate">{lang.name}</span>
            </div>

            <div className="flex-1 h-2 bg-zinc-800 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-1000"
                style={{ width: `${lang.percentage}%`, background: lang.color }}
              />
            </div>

            <span className="font-mono text-xs text-zinc-500 w-9 text-right flex-shrink-0">
              {lang.percentage}%
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}