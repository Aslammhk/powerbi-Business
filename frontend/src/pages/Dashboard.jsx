import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../services/api'

export default function Dashboard() {
  const [user, setUser] = useState(null)
  const [stats, setStats] = useState({})
  const [inviteLink, setInviteLink] = useState('')
  const [copied, setCopied] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) { navigate('/login'); return }
    api.get('/auth/me').then(r => setUser(r.data)).catch(() => navigate('/login'))
    api.get('/browse/stats').then(r => setStats(r.data)).catch(() => {})
  }, [])

  const generateInvite = async () => {
    const res = await api.post('/invite/generate')
    setInviteLink(res.data.invite_link)
  }

  const copyLink = () => {
    navigator.clipboard.writeText(inviteLink)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const logout = () => {
    localStorage.removeItem('token')
    navigate('/login')
  }

  if (!user) return (
    <div className="flex items-center justify-center h-screen bg-gray-50 dark:bg-gray-900">
      <div className="text-center">
        <div className="text-6xl animate-bounce">ðŸŒ³</div>
        <p className="text-gray-500 mt-4">Loading...</p>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">

        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white">ðŸŒ³ Money Tree</h1>
            <p className="text-gray-500">Welcome, {user.username}!</p>
          </div>
          <div className="flex gap-3">
            <button onClick={() => navigate('/tree')} className="bg-green-100 text-green-700 px-4 py-2 rounded-xl font-semibold hover:bg-green-200">ðŸŒ³ Tree</button>
            <button onClick={() => navigate('/leaderboard')} className="bg-yellow-100 text-yellow-700 px-4 py-2 rounded-xl font-semibold hover:bg-yellow-200">ðŸ† Board</button>
            <button onClick={logout} className="bg-red-100 text-red-600 px-4 py-2 rounded-xl font-semibold hover:bg-red-200">Logout</button>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { icon: 'ðŸ"º', label: 'Browsed', value: stats.total_browsed || 0 },
            { icon: 'âœ…', label: 'Success', value: stats.successful || 0 },
            { icon: 'ðŸ'¥', label: 'Referrals', value: user.total_referrals || 0 },
            { icon: 'ðŸ'°', label: 'Points', value: stats.points || 0 },
          ].map(s => (
            <div key={s.label} className="bg-white dark:bg-gray-800 rounded-2xl shadow p-6 text-center">
              <div className="text-3xl mb-2">{s.icon}</div>
              <div className="text-2xl font-bold text-green-600">{s.value}</div>
              <div className="text-gray-500 text-sm">{s.label}</div>
            </div>
          ))}
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-3">ðŸ"— Invite People</h2>
          <p className="text-gray-500 mb-4">When someone joins with your link, the system auto-browses your channels!</p>
          {!inviteLink ? (
            <button onClick={generateInvite} className="bg-green-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-green-700">
              ðŸŒ± Generate Invite Link
            </button>
          ) : (
            <div className="flex gap-3">
              <input readOnly value={inviteLink} className="flex-1 border dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-xl p-3 text-sm" />
              <button onClick={copyLink} className="bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700">
                {copied ? 'âœ… Copied!' : 'ðŸ"‹ Copy'}
              </button>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { icon: 'ðŸ"Š', label: 'Browse Logs', path: '/tree', color: 'blue' },
            { icon: 'ðŸ'°', label: 'My Points', path: '/points', color: 'yellow' },
            { icon: 'ðŸ"—', label: 'My URL', path: '/my-url', color: 'purple' },
          ].map(item => (
            <button key={item.label} onClick={() => navigate(item.path)}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow p-6 text-center hover:shadow-md transition">
              <div className="text-4xl mb-2">{item.icon}</div>
              <div className="font-bold text-gray-800 dark:text-white">{item.label}</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
