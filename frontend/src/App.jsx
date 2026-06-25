import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Landing from './pages/Landing.jsx'
import Login from './pages/Login.jsx'
import Register from './pages/Register.jsx'
import Dashboard from './pages/Dashboard.jsx'
import AdminDashboard from './pages/admin/AdminDashboard.jsx'
import AdminUsers from './pages/admin/AdminUsers.jsx'
import AdminChannels from './pages/admin/AdminChannels.jsx'

function getToken() {
  return localStorage.getItem('token')
}

function PrivateRoute(props) {
  if (getToken()) {
    return props.children
  }
  return React.createElement(Navigate, { to: '/login', replace: true })
}

function App() {
  return React.createElement(
    BrowserRouter,
    null,
    React.createElement(
      Routes,
      null,
      React.createElement(Route, { path: '/', element: React.createElement(Landing) }),
      React.createElement(Route, { path: '/login', element: React.createElement(Login) }),
      React.createElement(Route, { path: '/register', element: React.createElement(Register) }),
      React.createElement(Route, {
        path: '/dashboard',
        element: React.createElement(PrivateRoute, null, React.createElement(Dashboard))
      }),
      React.createElement(Route, {
        path: '/admin',
        element: React.createElement(PrivateRoute, null, React.createElement(AdminDashboard))
      }),
      React.createElement(Route, {
        path: '/admin/users',
        element: React.createElement(PrivateRoute, null, React.createElement(AdminUsers))
      }),
      React.createElement(Route, {
        path: '/admin/channels',
        element: React.createElement(PrivateRoute, null, React.createElement(AdminChannels))
      }),
      React.createElement(Route, { path: '*', element: React.createElement(Navigate, { to: '/', replace: true }) })
    )
  )
}

export default App
