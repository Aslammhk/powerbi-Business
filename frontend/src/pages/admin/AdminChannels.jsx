import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../../services/api.js'

function AdminChannels() {
  var navigate = useNavigate()
  var [channels, setChannels] = useState([])
  var [name, setName] = useState('')
  var [url, setUrl] = useState('')
  var [adding, setAdding] = useState(false)
  var [msg, setMsg] = useState('')
  var [err, setErr] = useState('')

  function load() {
    api.get('/api/admin/channels')
      .then(function(res) { setChannels(res.data) })
      .catch(function() {})
  }

  useEffect(function() { load() }, [])

  var adminCount = channels.filter(function(c) {
    return c.is_admin_default
  }).length

  function handleAdd(e) {
    e.preventDefault()
    setAdding(true)
    setMsg('')
    setErr('')
    api.post('/api/admin/channels/add?youtube_url=' + encodeURIComponent(url) + '&channel_name=' + encodeURIComponent(name))
      .then(function() {
        setName('')
        setUrl('')
        setMsg('Channel added and locked!')
        load()
      })
      .catch(function(e) {
        setErr(e.response && e.response.data && e.response.data.detail ? e.response.data.detail : 'Failed to add channel')
      })
      .finally(function() { setAdding(false) })
  }

  var inputStyle = {
    border: '1px solid #e5e7eb',
    borderRadius: '12px',
    padding: '12px',
    fontSize: '14px',
    outline: 'none',
    flex: '1',
    minWidth: '160px'
  }

  return React.createElement(
    'div',
    { style: { minHeight: '100vh', background: '#f9fafb', padding: '24px' } },
    React.createElement(
      'div',
      { style: { maxWidth: '800px', margin: '0 auto' } },

      React.createElement(
        'div',
        { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' } },
        React.createElement('h1', { style: { fontSize: '28px', fontWeight: 'bold', margin: '0' } }, 'Channels (' + adminCount + '/10)'),
        React.createElement('button', {
          onClick: function() { navigate('/admin') },
          style: { background: '#e5e7eb', border: 'none', borderRadius: '12px', padding: '10px 20px', cursor: 'pointer', fontWeight: 'bold' }
        }, 'Back')
      ),

      React.createElement(
        'div',
        { style: { background: 'white', borderRadius: '20px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)', padding: '24px', marginBottom: '24px' } },
        React.createElement('h2', { style: { fontWeight: 'bold', fontSize: '16px', marginBottom: '16px', marginTop: '0' } }, 'Add Admin Channel'),
        React.createElement(
          'form',
          { onSubmit: handleAdd, style: { display: 'flex', gap: '12px', flexWrap: 'wrap' } },
          React.createElement('input', { required: true, type: 'text', placeholder: 'Channel Name', value: name, onChange: function(e) { setName(e.target.value) }, style: inputStyle }),
          React.createElement('input', { required: true, type: 'url', placeholder: 'https://youtube.com/@channel', value: url, onChange: function(e) { setUrl(e.target.value) }, style: Object.assign({}, inputStyle, { flex: '2' }) }),
          React.createElement('button', {
            type: 'submit',
            disabled: adding || adminCount >= 10,
            style: { background: adminCount >= 10 ? '#9ca3af' : '#16a34a', color: 'white', border: 'none', borderRadius: '12px', padding: '12px 20px', cursor: adminCount >= 10 ? 'not-allowed' : 'pointer', fontWeight: 'bold', whiteSpace: 'nowrap' }
          }, adding ? 'Adding...' : adminCount >= 10 ? 'Limit Reached' : 'Add and Lock')
        ),
        msg ? React.createElement('div', { style: { background: '#f0fdf4', color: '#16a34a', borderRadius: '12px', padding: '12px', marginTop: '12px', fontSize: '14px' } }, msg) : null,
        err ? React.createElement('div', { style: { background: '#fef2f2', color: '#dc2626', borderRadius: '12px', padding: '12px', marginTop: '12px', fontSize: '14px' } }, err) : null
      ),

      React.createElement(
        'div',
        { style: { display: 'flex', flexDirection: 'column', gap: '12px' } },
        channels.length === 0
          ? React.createElement('div', { style: { textAlign: 'center', padding: '48px', background: 'white', borderRadius: '20px', color: '#9ca3af' } }, 'No channels yet. Add your first channel above!')
          : channels.map(function(c) {
              return React.createElement(
                'div',
                { key: c.id, style: { background: 'white', borderRadius: '16px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' } },
                React.createElement(
                  'div',
                  null,
                  React.createElement(
                    'div',
                    { style: { display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' } },
                    React.createElement('span', { style: { fontWeight: '600', color: '#111827' } }, c.channel_name),
                    c.is_locked ? React.createElement('span', { style: { background: '#fee2e2', color: '#dc2626', padding: '2px 8px', borderRadius: '999px', fontSize: '11px', fontWeight: 'bold' } }, 'Locked') : null,
                    c.is_admin_default ? React.createElement('span', { style: { background: '#dcfce7', color: '#16a34a', padding: '2px 8px', borderRadius: '999px', fontSize: '11px', fontWeight: 'bold' } }, 'Admin') : null
                  ),
                  React.createElement('div', { style: { color: '#6b7280', fontSize: '13px' } }, c.youtube_url)
                ),
                React.createElement('span', {
                  style: { background: c.is_active ? '#dcfce7' : '#f3f4f6', color: c.is_active ? '#16a34a' : '#9ca3af', padding: '6px 16px', borderRadius: '999px', fontSize: '12px', fontWeight: 'bold' }
                }, c.is_active ? 'Active' : 'Inactive')
              )
            })
      )
    )
  )
}

export default AdminChannels
