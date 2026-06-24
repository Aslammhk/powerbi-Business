import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { useEffect } from 'react'
import { useTheme } from './store/useTheme'
import Landing from './pages/Landing'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import TreeView from './pages/TreeView'
import Leaderboard from './pages/Leaderboard'
import Points from './pages/Points'
import Revenue from './pages/Revenue'
import VanityURL from './pages/VanityURL'
import AdminDashboard from './pages/admin/AdminDashboard'
import AdminUsers from './pages/admin/AdminUsers'
import AdminChannels from './pages/admin/AdminChannels'

export default function App() {
  const { isDark, initTheme } = useTheme()

  useEffect(() => {
    initTheme()
  }, [])

  return (
    <div className={isDark ? 'dark' : ''}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/join/:slug" element={<Register />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/tree" element={<TreeView />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/points" element={<Points />} />
          <Route path="/revenue" element={<Revenue />} />
          <Route path="/my-url" element={<VanityURL />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/users" element={<AdminUsers />} />
          <Route path="/admin/channels" element={<AdminChannels />} />
        </Routes>
      </BrowserRouter>
    </div>
  )
}
