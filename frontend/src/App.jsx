import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useEffect } from 'react'
import { useTheme } from './store/useTheme'
import Landing from './pages/Landing'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import AdminDashboard from './pages/admin/AdminDashboard'
import AdminUsers from './pages/admin/AdminUsers'
import AdminChannels from './pages/admin/AdminChannels'

const Private = ({ c: C }) => localStorage.getItem('token') ? <C /> : <Navigate to="/login" />
const Admin = ({ c: C }) => localStorage.getItem('token') ? <C /> : <Navigate to="/login" />

export default function App() {
  const { initTheme } = useTheme()
  useEffect(() => { initTheme() }, [])
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/join/:slug" element={<Register />} />
        <Route path="/dashboard" element={<Private c={Dashboard} />} />
        <Route path="/admin" element={<Admin c={AdminDashboard} />} />
        <Route path="/admin/users" element={<Admin c={AdminUsers} />} />
        <Route path="/admin/channels" element={<Admin c={AdminChannels} />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  )
}
