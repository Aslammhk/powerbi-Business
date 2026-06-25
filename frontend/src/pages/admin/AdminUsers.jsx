import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../../services/api.js'

function AdminUsers() {
  var navigate = useNavigate()
  var [users, setUsers] = useState([])

  useEffect(function() {
    api.get('/api/admin/users')
      .then(function(res) { setUsers(res.data) })
      .catch(function() {})
  }, [])

  return React.createElement(
    'div',
    { style: { minHeight: '100vh', background: '#f9fafb', padding: '24px' } },
    React.createElement(
      'div',
      { style: { maxWidth: '1000px', margin: '0 auto' } },
      React.createElement(
        'div',
        { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' } },
        React.createElement('h1', { style: { fontSize: '28px', fontWeight: 'bold', margin: '0' } }, 'Users (' + users.length + ')'),
        React.createElement('button', {
          onClick: function() { navigate('/admin') },
          style: { background: '#e5e7eb', border: 'none', borderRadius: '12px', padding: '10px 20px', cursor: 'pointer', fontWeight: 'bold' }
        }, 'Back')
      ),
      React.createElement(
        'div',
        { style: { background: 'white', borderRadius: '20px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)', overflow: 'hidden' } },
        users.length === 0
          ? React.createElement('div', { style: { textAlign: 'center', padding: '48px', color: '#9ca3af' } }, 'No users yet')
          : React.createElement(
              'table',
              { style: { width: '100%', borderCollapse: 'collapse' } },
              React.createElement('thead', null,
                React.createElement('tr', null,
                  ['Username', 'Email', 'Referrals', 'Admin', 'Status'].map(function(h) {
                    return React.createElement('th', { key: h, style: { textAlign: 'left', padding: '16px', color: '#6b7280', fontSize: '13px', background: '#f9fafb', borderBottom: '1px solid #e5e7eb' } }, h)
                  })
                )
              ),
              React.createElement('tbody', null,
                users.map(function(u) {
                  return React.createElement('tr', { key: u.id, style: { borderBottom: '1px solid #f3f4f6' } },
                    React.createElement('td', { style: { padding: '16px', fontWeight: '600' } }, u.username),
                    React.createElement('td', { style: { padding: '16px', color: '#6b7280', fontSize: '14px' } }, u.email),
                    React.createElement('td', { style: { padding: '16px' } },
                      React.createElement('span', { style: { background: '#f3e8ff', color: '#9333ea', padding: '4px 12px', borderRadius: '999px', fontSize: '12px', fontWeight: 'bold' } }, u.total_referrals)
                    ),
                    React.createElement('td', { style: { padding: '16px' } }, u.is_admin ? 'Yes' : 'No'),
                    React.createElement('td', { style: { padding: '16px' } },
                      React.createElement('span', {
                        style: { background: u.is_active ? '#dcfce7' : '#fee2e2', color: u.is_active ? '#16a34a' : '#dc2626', padding: '4px 12px', borderRadius: '999px', fontSize: '12px', fontWeight: 'bold' }
                      }, u.is_active ? 'Active' : 'Disabled')
                    )
                  )
                })
              )
            )
      )
    )
  )
}

export default AdminUsers
