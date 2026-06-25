import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../services/api.js'

function Dashboard() {
  var navigate = useNavigate()
  var [user, setUser] = useState(null)
  var [stats, setStats] = useState({})
  var [inviteLink, setInviteLink] = useState('')
  var [copied, setCopied] = useState(false)
  var [error, setError] = useState('')

  useEffect(function() {
    var token = localStorage.getItem('token')
    if (!token) {
      navigate('/login')
      return
    }
    Promise.all([
      api.get('/api/auth/me'),
      api.get('/api/browse/stats')
    ])
    .then(function(results) {
      setUser(results[0].data)
      setStats(results[1].data)
    })
    .catch(function() {
      navigate('/login')
    })
  }, [])

  function generateInvite() {
    api.post('/api/invite/generate')
      .then(function(res) {
        setInviteLink(res.data.invite_link)
      })
      .catch(function() {
        setError('Failed to generate invite link')
      })
  }

  function copyLink() {
    navigator.clipboard.writeText(inviteLink)
    setCopied(true)
    setTimeout(function() { setCopied(false) }, 2000)
  }

  function logout() {
    localStorage.clear()
    navigate('/login')
  }

  if (!user) {
    return React.createElement(
      'div',
      { style: { minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f9fafb' } },
      React.createElement(
        'div',
        { style: { textAlign: 'center' } },
        React.createElement('div', { style: { fontSize: '60px' } }, String.fromCodePoint(0x1F333)),
        React.createElement('p', { style: { color: '#6b7280', marginTop: '16px' } }, 'Loading dashboard...')
      )
    )
  }

  var statItems = [
    { icon: '📺', label: 'Browsed', value: stats.total_browsed || 0, color: '#2563eb' },
    { icon: '✅', label: 'Success', value: stats.successful || 0, color: '#16a34a' },
    { icon: '👥', label: 'Referrals', value: user.total_referrals || 0, color: '#9333ea' },
    { icon: '🌳', label: 'Tree Size', value: stats.tree_size || 0, color: '#ea580c' }
  ]

  return React.createElement(
    'div',
    { style: { minHeight: '100vh', background: '#f9fafb' } },

    React.createElement(
      'nav',
      { style: { background: '#166534', color: 'white', padding: '16px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' } },
      React.createElement(
        'div',
        { style: { display: 'flex', alignItems: 'center', gap: '12px' } },
        React.createElement('span', { style: { fontSize: '28px' } }, String.fromCodePoint(0x1F333)),
        React.createElement(
          'div',
          null,
          React.createElement('div', { style: { fontWeight: 'bold', fontSize: '18px' } }, 'Money Tree'),
          React.createElement('div', { style: { color: '#bbf7d0', fontSize: '12px' } }, 'Welcome, ' + user.username)
        )
      ),
      React.createElement(
        'div',
        { style: { display: 'flex', gap: '8px' } },
        user.is_admin ? React.createElement('button', {
          onClick: function() { navigate('/admin') },
          style: { background: '#eab308', color: 'white', border: 'none', borderRadius: '8px', padding: '8px 16px', cursor: 'pointer', fontWeight: 'bold' }
        }, 'Admin') : null,
        React.createElement('button', {
          onClick: logout,
          style: { background: '#dc2626', color: 'white', border: 'none', borderRadius: '8px', padding: '8px 16px', cursor: 'pointer' }
        }, 'Logout')
      )
    ),

    React.createElement(
      'div',
      { style: { maxWidth: '1100px', margin: '0 auto', padding: '24px 16px' } },

      React.createElement(
        'div',
        { style: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '24px' } },
        statItems.map(function(s) {
          return React.createElement(
            'div',
            { key: s.label, style: { background: 'white', borderRadius: '20px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)', padding: '24px', textAlign: 'center' } },
            React.createElement('div', { style: { fontSize: '32px', marginBottom: '8px' } }, s.icon),
            React.createElement('div', { style: { fontSize: '28px', fontWeight: 'bold', color: s.color } }, s.value),
            React.createElement('div', { style: { color: '#6b7280', fontSize: '13px', marginTop: '4px' } }, s.label)
          )
        })
      ),

      React.createElement(
        'div',
        { style: { background: 'white', borderRadius: '20px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)', padding: '24px', marginBottom: '24px' } },
        React.createElement('h2', { style: { fontWeight: 'bold', fontSize: '18px', marginBottom: '8px', color: '#111827' } }, 'Invite People to Your Tree'),
        React.createElement('p', { style: { color: '#6b7280', fontSize: '14px', marginBottom: '16px' } }, 'When someone joins with your link the system auto-browses your channels!'),
        error ? React.createElement('p', { style: { color: '#dc2626', fontSize: '14px', marginBottom: '12px' } }, error) : null,
        !inviteLink
          ? React.createElement('button', {
              onClick: generateInvite,
              style: { background: '#16a34a', color: 'white', border: 'none', borderRadius: '12px', padding: '12px 32px', fontSize: '15px', fontWeight: 'bold', cursor: 'pointer' }
            }, 'Generate Invite Link')
          : React.createElement(
              'div',
              { style: { display: 'flex', gap: '8px', flexWrap: 'wrap' } },
              React.createElement('input', {
                readOnly: true, value: inviteLink,
                style: { flex: '1', minWidth: '200px', border: '1px solid #e5e7eb', borderRadius: '12px', padding: '12px', fontSize: '13px' }
              }),
              React.createElement('button', {
                onClick: copyLink,
                style: { background: copied ? '#16a34a' : '#2563eb', color: 'white', border: 'none', borderRadius: '12px', padding: '12px 24px', cursor: 'pointer', fontWeight: 'bold' }
              }, copied ? 'Copied!' : 'Copy')
            )
      )
    )
  )
}

export default Dashboard
