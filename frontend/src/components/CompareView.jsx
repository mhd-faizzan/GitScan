import { useState } from 'react'
import axios from 'axios'
import ProfileHeader from './ProfileHeader'
import ActivitySummary from './ActivitySummary'
import TechStack from './TechStack'
import TopRepos from './TopRepos'

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
      const { data } = await axios.get(`/api/compare?user1=${user1}&user2=${user2}`)
      setProfiles(data)
    } catch (err) {
      setError(err.response?.data?.detail ?? 'Something went wrong.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <div className="text-center mb-10">
        <p className="font-mono text-green-400 text-xs tracking-[5px] uppercase mb-4">
          Compare
        </p>
        <h2 className="font-mono text-3xl font-bold tracking-tight mb-8">
          Compare Two <span className="text-green-400">Profiles</span>
        </h2>

        <div className="flex gap-3 max-w-xl mx-auto">
          <input
            type="text"
            placeholder="First username"
            value={user1}
            onChange={e => setUser1(e.target.value)}
            className="flex-1 bg-[#0d1117] border border-zinc-800 rounded-lg px-4 py-3 font-mono text-sm text-white outline-none focus:border-green-500 transition-colors"
          />
          <span className="font-mono text-zinc-500 flex items-center">vs</span>
          <input
            type="text"
            placeholder="Second username"
            value={user2}
            onChange={e => setUser2(e.target.value)}
            className="flex-1 bg-[#0d1117] border border-zinc-800 rounded-lg px-4 py-3 font-mono text-sm text-white outline-none focus:border-green-500 transition-colors"
          />
          <button
            onClick={handleCompare}
            disabled={loading}
            className="bg-green-500 text-black font-mono text-xs font-bold px-5 rounded-lg hover:bg-green-400 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {loading ? '...' : 'GO →'}
          </button>
        </div>

        {error && (
          <p className="text-red-400 font-mono text-sm mt-4">{error}</p>
        )}
      </div>

      {profiles && (
        <div className="grid grid-cols-2 gap-6">
          <div>
            <p className="font-mono text-xs text-zinc-500 tracking-widest uppercase mb-4 text-center">
              Profile 1
            </p>
            <ProfileHeader report={profiles.profile1} />
            <ActivitySummary activity={profiles.profile1.activity} />
            <TechStack languages={profiles.profile1.languages} />
            <TopRepos repos={profiles.profile1.top_repos} />
          </div>
          <div>
            <p className="font-mono text-xs text-zinc-500 tracking-widest uppercase mb-4 text-center">
              Profile 2
            </p>
            <ProfileHeader report={profiles.profile2} />
            <ActivitySummary activity={profiles.profile2.activity} />
            <TechStack languages={profiles.profile2.languages} />
            <TopRepos repos={profiles.profile2.top_repos} />
          </div>
        </div>
      )}
    </div>
  )
}