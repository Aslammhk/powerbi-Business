import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../../services/api'

export default function AdminDashboard() {
  const [stats, setStats] = useState({})
  const [users, setUsers] = useState([])
  const navigate = useNavigate()

  useEffect(() => {
    api.get('/admin/overview').then(r => setStats(r.data)).catch(() => {})
    api.get('/admin/users?limit=5').then(r => setUsers(r.data)).catch(() => {})
  }, [])

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-8">⚙️ Admin Panel</h1>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Total Users', value: stats.total_users || 0, icon: '👥' },
            { label: 'Channels', value: stats.total_channels || 0, icon: '📢' },
            { label: 'Jobs Today', value: stats.jobs_today || 0, icon: '🤖' },
            { label: 'Success Rate', value: `${stats.success_rate || 0}%`, icon: '✅' },
          ].map(s => (
            <div key={s.label} className="bg-white dark:bg-gray-800 rounded-2xl shadow p-6 text-center">
              <div className="text-3xl mb-2">{s.icon}</div>
              <div className="text-2xl font-bold text-green-600">{s.value}</div>
              <div className="text-gray-500 text-sm">{s.label}</div>
            </div>
          ))}
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {[
            { label: 'Users', path: '/admin/users', icon: '👥' },
            { label: 'Channels', path: '/admin/channels', icon: '📢' },
            { label: 'Dashboard', path: '/dashboard', icon: '🏠' },
          ].map(item => (
            <button key={item.label} onClick={() => navigate(item.path)}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow p-6 text-center hover:shadow-lg transition">
              <div className="text-4xl mb-2">{item.icon}</div>
              <div className="font-bold dark:text-white">{item.label}</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
