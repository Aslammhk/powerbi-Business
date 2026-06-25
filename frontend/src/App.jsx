import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useEffect } from 'react'
import { useTheme } from './store/useTheme'
import Landing from './pages/Landing'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import TreeView from './pages/TreeView'
import Leaderboard from './pages/Leaderboard'
import Points from './pages/Points'
import VanityURL from './pages/VanityURL'
import AdminDashboard from './pages/admin/AdminDashboard'
import AdminUsers from './pages/admin/AdminUsers'
import AdminChannels from './pages/admin/AdminChannels'

function PrivateRoute({ children }) {
  const token = localStorage.getItem('token')
  return token ? children : <Navigate to="/login" />
}

function AdminRoute({ children }) {
  const token = localStorage.getItem('token')
  const isAdmin = localStorage.getItem('is_admin') === 'true'
  return token && isAdmin ? children : <Navigate to="/login" />
}

export default function App() {
  const { isDark, initTheme } = useTheme()

  useEffect(() => {
    initTheme()
  }, [])

  return (
    <div className={isDark ? 'dark' : ''}>
      <BrowserRouter>
        <Routes>
          {/* Public */}
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/join/:slug" element={<Register />} />

          {/* Private */}
          <Route path="/dashboard" element={
            <PrivateRoute><Dashboard /></PrivateRoute>
          } />
          <Route path="/tree" element={
            <PrivateRoute><TreeView /></PrivateRoute>
          } />
          <Route path="/leaderboard" element={
            <PrivateRoute><Leaderboard /></PrivateRoute>
          } />
          <Route path="/points" element={
            <PrivateRoute><Points /></PrivateRoute>
          } />
          <Route path="/my-url" element={
            <PrivateRoute><VanityURL /></PrivateRoute>
          } />

          {/* Admin */}
          <Route path="/admin" element={
            <AdminRoute><AdminDashboard /></AdminRoute>
          } />
          <Route path="/admin/users" element={
            <AdminRoute><AdminUsers /></AdminRoute>
          } />
          <Route path="/admin/channels" element={
            <AdminRoute><AdminChannels /></AdminRoute>
          } />

          {/* 404 */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </BrowserRouter>
    </div>
  )
}
