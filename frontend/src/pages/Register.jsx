import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import api from '../services/api'

export default function Register() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const inviteCode = searchParams.get('invite')
  const [form, setForm] = useState({ email:'', username:'', password:'', channel_url:'', invite_code: inviteCode||'' })
  const [inviteInfo, setInviteInfo] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (inviteCode) {
      api.get(/invite/validate/).then(r => setInviteInfo(r.data)).catch(() => {})
    }
  }, [inviteCode])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const res = await api.post('/auth/register', null, { params: form })
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
          <div className="text-5xl">ðŸŒ³</div>
          <h1 className="text-2xl font-bold text-green-800 mt-2">Join Money Tree</h1>
        </div>
        {inviteInfo?.valid && (
          <div className="bg-green-50 border border-green-200 rounded-xl p-3 mb-4 text-center">
            <p className="text-green-700 font-semibold">ðŸŽ‰ Invited by: {inviteInfo.invited_by}</p>
            <p className="text-green-600 text-sm">25 channels will be auto-browsed for you!</p>
          </div>
        )}
        {error && <div className="bg-red-50 text-red-600 p-3 rounded-xl mb-4 text-sm">âŒ {error}</div>}
        <form onSubmit={handleSubmit} className="space-y-4">
          {['email','username','password','channel_url'].map(field => (
            <input key={field} type={field === 'password' ? 'password' : field === 'email' ? 'email' : 'text'}
              required placeholder={field.replace('_',' ').replace(/\b\w/g, l => l.toUpperCase())}
              value={form[field]} onChange={e => setForm({...form, [field]: e.target.value})}
              className="w-full border rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-green-500" />
          ))}
          {inviteCode && <div className="bg-gray-50 rounded-xl p-3 text-sm text-gray-500">ðŸ"' Code: {inviteCode}</div>}
          <button type="submit" disabled={loading}
            className="w-full bg-green-600 text-white font-bold py-3 rounded-xl hover:bg-green-700 disabled:opacity-50">
            {loading ? 'âŒ› Setting up...' : 'ðŸŒ± Join Money Tree'}
          </button>
        </form>
      </div>
    </div>
  )
}
