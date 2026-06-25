import { useNavigate } from 'react-router-dom'
import { useTheme } from '../store/useTheme'

export default function Landing() {
  const navigate = useNavigate()
  const { isDark, toggleDark } = useTheme()

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-800 to-green-950 flex flex-col items-center justify-center p-6 relative">
      <button
        onClick={toggleDark}
        className="absolute top-4 right-4 text-white text-2xl bg-white/10 p-2 rounded-xl hover:bg-white/20"
      >
        {isDark ? '☀️' : '🌙'}
      </button>

      <div className="text-center text-white max-w-2xl w-full">
        <div className="text-8xl mb-6">🌳</div>
        <h1 className="text-5xl font-bold mb-4">Money Tree Network</h1>
        <p className="text-green-200 text-xl mb-8">
          Grow your YouTube channel through automated referral browsing
        </p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          {[
            { icon: '📺', label: 'Auto Browse' },
            { icon: '💰', label: 'Earn Points' },
            { icon: '🏆', label: 'Leaderboard' },
            { icon: '🔗', label: 'Custom URLs' }
          ].map(f => (
            <div key={f.label} className="bg-white/10 rounded-2xl p-4 text-center">
              <div className="text-3xl mb-1">{f.icon}</div>
              <div className="text-sm text-green-100">{f.label}</div>
            </div>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => navigate('/register')}
            className="bg-white text-green-800 font-bold py-4 px-10 rounded-2xl text-lg hover:bg-green-50 transition"
          >
            🌱 Join Free
          </button>
          <button
            onClick={() => navigate('/login')}
            className="bg-transparent border-2 border-white text-white font-bold py-4 px-10 rounded-2xl text-lg hover:bg-white/10 transition"
          >
            Login
          </button>
        </div>
      </div>
    </div>
  )
}
