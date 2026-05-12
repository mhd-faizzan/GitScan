export default function ProfileHeader({ report }) {
  return (
    <div className="bg-[#0d1117] border border-zinc-800 rounded-xl p-7 flex gap-7 items-start mb-5">
      <img
        src={report.avatar_url}
        alt="avatar"
        className="w-20 h-20 rounded-full border-2 border-zinc-800 flex-shrink-0"
      />

      <div className="flex-1 min-w-0">
        <span className="inline-block font-mono text-[10px] text-green-400 border border-green-500/30 bg-green-500/10 rounded px-2.5 py-1 tracking-widest uppercase mb-3">
          {report.dev_type}
        </span>

        <h2 className="text-xl font-semibold mb-1">
          {report.name ?? report.username}
        </h2>

        <p className="font-mono text-sm text-blue-400 mb-2">
          @{report.username}
        </p>

        {report.bio && (
          <p className="text-zinc-400 text-sm leading-relaxed mb-3">
            {report.bio}
          </p>
        )}

        <div className="flex flex-wrap gap-5">
          {report.location && (
            <span className="text-zinc-500 text-sm">📍 {report.location}</span>
          )}
          <span className="text-zinc-500 text-sm">
            <strong className="text-white">{report.public_repos}</strong> repos
          </span>
          <span className="text-zinc-500 text-sm">
            <strong className="text-white">{report.followers}</strong> followers
          </span>
          <span className="text-zinc-500 text-sm">
            <strong className="text-white">{report.following}</strong> following
          </span>
          <span className="text-zinc-500 text-sm">
            Joined <strong className="text-white">{report.joined_year}</strong>
          </span>
          {report.blog && (
            
              href={report.blog}
              target="_blank"
              rel="noreferrer"
              className="text-blue-400 text-sm hover:underline"
            >
              🔗 {report.blog}
            </a>
          )}
        </div>
      </div>
    </div>
  )
}