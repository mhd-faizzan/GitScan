export default function Search({ onScan, loading }) {
  function handleSubmit(e) {
    e.preventDefault()
    const username = e.target.username.value.trim()
    if (username) onScan(username)
  }

  return (
    <div className="text-center mb-12">
      <p className="font-mono text-green-400 text-xs tracking-[5px] uppercase mb-5">
        GitScan
      </p>
      <h1 className="font-mono text-5xl font-bold tracking-tight mb-4">
        GitHub <span className="text-green-400">Profile</span> Analyzer
      </h1>
      <p className="text-zinc-400 text-sm font-light max-w-md mx-auto mb-10 leading-relaxed">
        Paste a GitHub username. See what they build, how often they ship,
        and whether their profile holds up.
      </p>

      <form onSubmit={handleSubmit} className="flex max-w-md mx-auto border border-zinc-800 rounded-lg overflow-hidden bg-[#0d1117] focus-within:border-green-500 transition-colors">
        <span className="font-mono text-xs text-zinc-500 px-3 flex items-center bg-[#161b22] border-r border-zinc-800 whitespace-nowrap">
          github.com/
        </span>
        <input
          name="username"
          type="text"
          placeholder="username"
          autoComplete="off"
          spellCheck="false"
          className="flex-1 bg-transparent outline-none text-white font-mono text-sm px-4 py-3 min-w-0"
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-green-500 text-black font-mono text-xs font-bold px-5 tracking-wider hover:bg-green-400 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {loading ? '...' : 'SCAN →'}
        </button>
      </form>
    </div>
  )
}