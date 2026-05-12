const LANG_COLORS = {
  JavaScript: '#f1e05a', TypeScript: '#3178c6', Python: '#3572A5',
  HTML: '#e34c26', CSS: '#563d7c', Java: '#b07219', Go: '#00ADD8',
  Rust: '#dea584', Ruby: '#701516', PHP: '#4F5D95', Shell: '#89e051',
}

function RepoCard({ repo }) {
  const langColor = LANG_COLORS[repo.language] ?? '#8b949e'

  return (
    <div className="bg-[#161b22] border border-zinc-800 rounded-xl p-5 hover:border-green-500 transition-colors">
      <p className="font-mono text-sm text-blue-400 mb-2 truncate">{repo.name}</p>
      <p className="text-zinc-500 text-xs leading-relaxed mb-4 min-h-[32px]">
        {repo.description ?? 'No description provided.'}
      </p>
      <div className="flex gap-3 flex-wrap">
        {repo.language && (
          <span className="flex items-center gap-1.5 font-mono text-xs text-zinc-400">
            <span className="w-2.5 h-2.5 rounded-full" style={{ background: langColor }} />
            {repo.language}
          </span>
        )}
        <span className="font-mono text-xs text-zinc-400">★ {repo.stars}</span>
        <span className="font-mono text-xs text-zinc-400">⑂ {repo.forks}</span>
        <span className="font-mono text-xs text-zinc-400">⬆ {repo.commits} commits</span>
      </div>
    </div>
  )
}

export default function TopRepos({ repos }) {
  return (
    <div className="bg-[#0d1117] border border-zinc-800 rounded-xl p-6 mb-5">
      <p className="font-mono text-[10px] text-zinc-500 tracking-[2px] uppercase mb-5">
        Top Repositories
      </p>
      <div className="grid grid-cols-3 gap-4">
        {repos.map((repo) => (
          <RepoCard key={repo.name} repo={repo} />
        ))}
      </div>
    </div>
  )
}