import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import api from '../services/api'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const form = new FormData()
      form.append('username', email)
      form.append('password', password)
      const res = await api.post('/auth/login', form)
      localStorage.setItem('token', res.data.access_token)
      navigate('/dashboard')
    } catch (err) {
      setError(err.response?.data?.detail || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="text-5xl">ðŸŒ³</div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white mt-2">Welcome Back</h1>
        </div>
        {error && <div className="bg-red-50 text-red-600 p-3 rounded-xl mb-4 text-sm">âŒ {error}</div>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="email" required placeholder="Email" value={email}
            onChange={e => setEmail(e.target.value)}
            className="w-full border dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-green-500" />
          <input type="password" required placeholder="Password" value={password}
            onChange={e => setPassword(e.target.value)}
            className="w-full border dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-green-500" />
          <button type="submit" disabled={loading}
            className="w-full bg-green-600 text-white font-bold py-3 rounded-xl hover:bg-green-700 transition disabled:opacity-50">
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        <p className="text-center text-gray-500 mt-4 text-sm">
          No account? <Link to="/register" className="text-green-600 font-semibold">Join Free</Link>
        </p>
      </div>
    </div>
  )
}
