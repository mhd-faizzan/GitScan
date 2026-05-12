import { useState } from 'react'
import Search from './components/Search'
import ProfileReport from './components/ProfileReport'
import axios from 'axios'

export default function App() {
  const [report, setReport] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleScan(username) {
    setError('')
    setReport(null)
    setLoading(true)

    try {
      const { data } = await axios.get(`/api/profile/${username}`)
      setReport(data)
    } catch (err) {
      setError(err.response?.data?.detail ?? 'Something went wrong.')
    } finally {
      setLoading(false)
    }
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
        {report && <ProfileReport report={report} />}
      </div>
    </main>
  )
}