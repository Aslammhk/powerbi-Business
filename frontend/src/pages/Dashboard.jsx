import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../services/api'
import { useTheme } from '../store/useTheme'

export default function Dashboard() {
  const [user, setUser] = useState(null)
  const [stats, setStats] = useState({})
  const [inviteLink, setInviteLink] = useState('')
  const [copied, setCopied] = useState(false)
  const [logs, setLogs] = useState([])
  const navigate = useNavigate()
  const { isDark, toggleDark } = useTheme()

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) { navigate('/login'); return }
    loadData()
  }, [])

  const loadData = async () => {
    try {
      const [userRes, statsRes, logsRes] = await Promise.all([
        api.get('/api/auth/me'),
        api.get('/api/browse/stats'),
        api.get('/api/browse/logs?limit=5')
      ])
      setUser(userRes.data)
      setStats(statsRes.data)
      setLogs(logsRes.data)
    } catch (e) {
      navigate('/login')
    }
  }

  const generateInvite = async () => {
    const res = await api.post('/api/invite/generate')
    setInviteLink(res.data.invite_link)
  }

  const copyLink = () => {
    navigator.clipboard.writeText(inviteLink)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const logout = () => {
    localStorage.clear()
    navigate('/login')
  }

  if (!user) return (
    <div className="flex items-center justify-center h-screen bg-gray-50 dark:bg-gray-900">
      <div className="text-center">
        <div className="text-6xl animate-bounce">🌳</div>
        <p className="text-gray-500 mt-4">Loading your dashboard...</p>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Navbar */}
      <nav className="bg-green-700 text-white p-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <span className="text-2xl">🌳</span>
          <div>
            <h1 className="font-bold text-lg">Money Tree</h1>
            <p className="text-green-200 text-xs">Welcome, {user.username}!</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button onClick={toggleDark} className="bg-white/20 px-3 py-1 rounded-lg text-sm">
            {isDark ? '☀️' : '🌙'}
          </button>
          {user.is_admin && (
            <button onClick={() => navigate('/admin')} className="bg-yellow-500 px-3 py-1 rounded-lg text-sm font-semibold">
              ⚙️ Admin
            </button>
          )}
          <button onClick={logout} className="bg-red-500 px-3 py-1 rounded-lg text-sm">
            Logout
          </button>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto p-4 md:p-6">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {[
            { icon: '📺', label: 'Browsed', value: stats.total_browsed || 0, color: 'text-blue-600' },
            { icon: '✅', label: 'Success', value: stats.successful || 0, color: 'text-green-600' },
            { icon: '👥', label: 'Referrals', value: user.total_referrals || 0, color: 'text-purple-600' },
            { icon: '🌳', label: 'Tree Size', value: stats.tree_size || 0, color: 'text-orange-600' }
          ].map(s => (
            <div key={s.label} className="bg-white dark:bg-gray-800 rounded-2xl shadow p-4 md:p-6 text-center">
              <div className="text-3xl mb-2">{s.icon}</div>
              <div className={	ext-2xl font-bold }>{s.value}</div>
              <div className="text-gray-500 text-sm">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Invite Section */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-2">
            🔗 Invite People to Your Tree
          </h2>
          <p className="text-gray-500 text-sm mb-4">
            When someone joins with your link, the system auto-browses your channels!
          </p>
          {!inviteLink ? (
            <button
              onClick={generateInvite}
              className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-xl font-bold transition"
            >
              🌱 Generate Invite Link
            </button>
          ) : (
            <div className="flex gap-2 flex-wrap">
              <input
                readOnly value={inviteLink}
                className="flex-1 min-w-0 border dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-xl p-3 text-sm"
              />
              <button
                onClick={copyLink}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold whitespace-nowrap"
              >
                {copied ? '✅ Copied!' : '📋 Copy'}
              </button>
            </div>
          )}
        </div>

        {/* Quick Navigation */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {[
            { icon: '🌳', label: 'View Tree', path: '/tree' },
            { icon: '🏆', label: 'Leaderboard', path: '/leaderboard' },
            { icon: '💰', label: 'My Points', path: '/points' },
            { icon: '🔗', label: 'My URL', path: '/my-url' }
          ].map(item => (
            <button
              key={item.label}
              onClick={() => navigate(item.path)}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow p-4 text-center hover:shadow-lg transition"
            >
              <div className="text-3xl mb-1">{item.icon}</div>
              <div className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                {item.label}
              </div>
            </button>
          ))}
        </div>

        {/* Recent Activity */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow p-6">
          <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
            📋 Recent Browse Activity
          </h2>
          {logs.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              <div className="text-4xl mb-2">🤖</div>
              <p>No activity yet. Invite someone to start auto-browsing!</p>
            </div>
          ) : (
            <div className="space-y-2">
              {logs.map((log, i) => (
                <div key={i} className={lex justify-between items-center p-3 rounded-xl text-sm }>
                  <span className="font-medium dark:text-white">
                    {log.status === 'success' ? '✅' : '❌'} {log.channel_name}
                  </span>
                  <span className="text-gray-400 text-xs">{log.executed_at?.slice(0, 16)}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
