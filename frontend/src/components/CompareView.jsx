import { useState } from 'react'
import axios from 'axios'
import ProfileHeader from './ProfileHeader'
import ActivitySummary from './ActivitySummary'
import TechStack from './TechStack'
import TopRepos from './TopRepos'

const API = import.meta.env.VITE_API_URL || ''

export default function CompareView() {
  const [user1, setUser1] = useState('')
  const [user2, setUser2] = useState('')
  const [profiles, setProfiles] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleCompare() {
    if (!user1.trim() || !user2.trim()) return
    setError('')
    setProfiles(null)
    setLoading(true)

    try {
      const { data } = await axios.get(`${API}/api/compare?user1=${user1}&user2=${user2}`)
      setProfiles(data)
    } catch (err) {
      setError(err.response?.data?.detail ?? 'Something went wrong.')
    } finally {
      setLoading(false)
    }
  }

  function handleKey(e) {
    if (e.key === 'Enter') handleCompare()
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="text-center mb-12">
        <p className="font-mono text-green-400 text-xs tracking-[5px] uppercase mb-4">
          Compare
        </p>
        <h2 className="font-mono text-4xl font-bold tracking-tight mb-10">
          Compare Two <span className="text-green-400">Profiles</span>
        </h2>

        <div className="flex gap-3 max-w-2xl mx-auto">
          <input
            type="text"
            placeholder="First username"
            value={user1}
            onChange={e => setUser1(e.target.value)}
            onKeyDown={handleKey}
            className="flex-1 bg-[#0d1117] border border-zinc-800 rounded-lg px-4 py-3 font-mono text-sm text-white outline-none focus:border-green-500 transition-colors placeholder-zinc-600"
          />
          <span className="font-mono text-zinc-500 flex items-center px-2 text-lg">vs</span>
          <input
            type="text"
            placeholder="Second username"
            value={user2}
            onChange={e => setUser2(e.target.value)}
            onKeyDown={handleKey}
            className="flex-1 bg-[#0d1117] border border-zinc-800 rounded-lg px-4 py-3 font-mono text-sm text-white outline-none focus:border-green-500 transition-colors placeholder-zinc-600"
          />
          <button
            onClick={handleCompare}
            disabled={loading}
            className="bg-green-500 text-black font-mono text-xs font-bold px-6 rounded-lg hover:bg-green-400 transition-colors disabled:opacity-40 disabled:cursor-not-allowed whitespace-nowrap"
          >
            {loading ? '...' : 'COMPARE →'}
          </button>
        </div>

        {error && (
          <p className="text-red-400 font-mono text-sm mt-4">{error}</p>
        )}
      </div>

      {profiles && (
        <div className="grid grid-cols-2 gap-8">
          {[profiles.profile1, profiles.profile2].map((profile, i) => (
            <div key={i}>
              <div className="flex items-center gap-3 mb-5">
                <div className="h-px flex-1 bg-zinc-800" />
                <span className="font-mono text-xs text-zinc-500 tracking-[3px] uppercase">
                  Profile {i + 1}
                </span>
                <div className="h-px flex-1 bg-zinc-800" />
              </div>
              <ProfileHeader report={profile} />
              <ActivitySummary activity={profile.activity} />
              <TechStack languages={profile.languages} />
              <TopRepos repos={profile.top_repos} />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}