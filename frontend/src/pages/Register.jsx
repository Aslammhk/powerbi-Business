import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams, Link } from 'react-router-dom'
import api from '../services/api'

export default function Register() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const inviteCode = searchParams.get('invite')
  const [inviteInfo, setInviteInfo] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({
    email: '', username: '', password: '',
    channel_url: '', invite_code: inviteCode || ''
  })

  useEffect(() => {
    if (inviteCode) {
      api.get(/api/invite/validate/)
        .then(r => setInviteInfo(r.data))
        .catch(() => {})
    }
  }, [inviteCode])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const params = new URLSearchParams(form)
      const res = await api.post(/api/auth/register?)
      localStorage.setItem('token', res.data.access_token)
      navigate('/dashboard')
    } catch (err) {
      setError(err.response?.data?.detail || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-800 to-green-950 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
        <div className="text-center mb-6">
          <div className="text-5xl">🌳</div>
          <h1 className="text-2xl font-bold text-green-800 mt-2">Join Money Tree</h1>
          <p className="text-gray-500 text-sm mt-1">Start growing your channels today</p>
        </div>

        {inviteInfo?.valid && (
          <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-4 text-center">
            <p className="text-green-700 font-semibold">
              🎉 Invited by: <strong>{inviteInfo.invited_by}</strong>
            </p>
            <p className="text-green-600 text-sm mt-1">
              25 channels will be auto-browsed for you!
            </p>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-xl mb-4 text-sm">
            ❌ {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            type="email" required placeholder="Email address"
            value={form.email}
            onChange={e => setForm({...form, email: e.target.value})}
            className="w-full border rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          <input
            type="text" required placeholder="Username"
            value={form.username}
            onChange={e => setForm({...form, username: e.target.value})}
            className="w-full border rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          <input
            type="password" required placeholder="Password"
            value={form.password}
            onChange={e => setForm({...form, password: e.target.value})}
            className="w-full border rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          <input
            type="url" required placeholder="Your YouTube channel URL"
            value={form.channel_url}
            onChange={e => setForm({...form, channel_url: e.target.value})}
            className="w-full border rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          {inviteCode && (
            <div className="bg-gray-50 rounded-xl p-3 text-sm text-gray-500">
              🔑 Invite Code: <strong>{inviteCode}</strong>
            </div>
          )}
          <button
            type="submit" disabled={loading}
            className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-xl transition disabled:opacity-50"
          >
            {loading ? '⏳ Setting up your tree...' : '🌱 Join Money Tree Network'}
          </button>
        </form>

        <p className="text-center text-gray-500 mt-4 text-sm">
          Already have account?{' '}
          <Link to="/login" className="text-green-600 font-semibold hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  )
}
