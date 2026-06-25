import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../../services/api.js'

function AdminDashboard() {
  var navigate = useNavigate()
  var [stats, setStats] = useState({})

  useEffect(function() {
    api.get('/api/admin/overview')
      .then(function(res) { setStats(res.data) })
      .catch(function() {})
  }, [])

  var items = [
    { icon: '👥', label: 'Total Users', value: stats.total_users || 0 },
    { icon: '📺', label: 'Channels', value: stats.total_channels || 0 },
    { icon: '🌳', label: 'Tree Nodes', value: stats.tree_nodes || 0 },
    { icon: '🔗', label: 'Active Invites', value: stats.active_invites || 0 }
  ]

  return React.createElement(
    'div',
    { style: { minHeight: '100vh', background: '#f9fafb' } },

    React.createElement(
      'nav',
      { style: { background: '#166534', color: 'white', padding: '16px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' } },
      React.createElement('span', { style: { fontWeight: 'bold', fontSize: '20px' } }, 'Admin Panel'),
      React.createElement('button', {
        onClick: function() { navigate('/dashboard') },
        style: { background: 'white', color: '#166534', border: 'none', borderRadius: '8px', padding: '8px 16px', cursor: 'pointer', fontWeight: 'bold' }
      }, 'Dashboard')
    ),

    React.createElement(
      'div',
      { style: { maxWidth: '1000px', margin: '0 auto', padding: '24px 16px' } },

      React.createElement(
        'div',
        { style: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '24px' } },
        items.map(function(s) {
          return React.createElement(
            'div',
            { key: s.label, style: { background: 'white', borderRadius: '20px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)', padding: '24px', textAlign: 'center' } },
            React.createElement('div', { style: { fontSize: '32px', marginBottom: '8px' } }, s.icon),
            React.createElement('div', { style: { fontSize: '28px', fontWeight: 'bold', color: '#16a34a' } }, s.value),
            React.createElement('div', { style: { color: '#6b7280', fontSize: '13px', marginTop: '4px' } }, s.label)
          )
        })
      ),

      React.createElement(
        'div',
        { style: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' } },
        React.createElement('button', {
          onClick: function() { navigate('/admin/users') },
          style: { background: 'white', border: 'none', borderRadius: '20px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)', padding: '24px', cursor: 'pointer', textAlign: 'left' }
        },
          React.createElement('div', { style: { fontSize: '36px', marginBottom: '8px' } }, '👥'),
          React.createElement('div', { style: { fontWeight: 'bold', fontSize: '16px', color: '#111827' } }, 'Manage Users')
        ),
        React.createElement('button', {
          onClick: function() { navigate('/admin/channels') },
          style: { background: 'white', border: 'none', borderRadius: '20px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)', padding: '24px', cursor: 'pointer', textAlign: 'left' }
        },
          React.createElement('div', { style: { fontSize: '36px', marginBottom: '8px' } }, '📺'),
          React.createElement('div', { style: { fontWeight: 'bold', fontSize: '16px', color: '#111827' } }, 'Manage Channels')
        )
      )
    )
  )
}

export default AdminDashboard
