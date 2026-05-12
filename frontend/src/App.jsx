import { useState, useEffect } from 'react'
import Search from './components/Search'
import ProfileReport from './components/ProfileReport'
import axios from 'axios'

export default function App() {
  const [report, setReport] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)

  // auto scan if username in URL
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const user = params.get('user')
    if (user) handleScan(user)
  }, [])

  async function handleScan(username) {
    setError('')
    setReport(null)
    setLoading(true)

    // update URL without reload
    window.history.pushState({}, '', `?user=${username}`)

    try {
      const { data } = await axios.get(`/api/profile/${username}`)
      setReport(data)
    } catch (err) {
      setError(err.response?.data?.detail ?? 'Something went wrong.')
    } finally {
      setLoading(false)
    }
  }

  function handleShare() {
    navigator.clipboard.writeText(window.location.href)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <main className="min-h-screen bg-[#060910] text-white px-6 py-12">
      <div className="max-w-4xl mx-auto">
        <Search onScan={handleScan} loading={loading} />

        {error && (
          <p className="text-red-400 text-center mt-4 font-mono text-sm">{error}</p>
        )}

        {loading && (
          <p className="text-center text-zinc-500 font-mono text-sm mt-12 tracking-widest">
            SCANNING...
          </p>
        )}

        {report && (
          <>
            <div className="flex justify-end mb-4">
              <button
                onClick={handleShare}
                className="font-mono text-xs px-4 py-2 border border-zinc-700 rounded-lg text-zinc-400 hover:border-green-500 hover:text-green-400 transition-colors"
              >
                {copied ? '✓ COPIED' : '⬡ SHARE PROFILE'}
              </button>
            </div>
            <ProfileReport report={report} />
          </>
        )}
      </div>
    </main>
  )
}