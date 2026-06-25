import React, { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import api from '../services/api.js'

function Register() {
  var navigate = useNavigate()
  var searchParams = useSearchParams()[0]
  var inviteCode = searchParams.get('invite') || ''

  var [email, setEmail] = useState('')
  var [username, setUsername] = useState('')
  var [password, setPassword] = useState('')
  var [channelUrl, setChannelUrl] = useState('')
  var [loading, setLoading] = useState(false)
  var [error, setError] = useState('')
  var [invitedBy, setInvitedBy] = useState('')

  useEffect(function() {
    if (inviteCode) {
      api.get('/api/invite/validate/' + inviteCode)
        .then(function(res) {
          if (res.data.valid) {
            setInvitedBy(res.data.invited_by)
          }
        })
        .catch(function() {})
    }
  }, [inviteCode])

  function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setError('')

    var params = 'email=' + encodeURIComponent(email)
    params += '&username=' + encodeURIComponent(username)
    params += '&password=' + encodeURIComponent(password)
    params += '&channel_url=' + encodeURIComponent(channelUrl)
    if (inviteCode) {
      params += '&invite_code=' + encodeURIComponent(inviteCode)
    }

    api.post('/api/auth/register?' + params)
      .then(function(res) {
        localStorage.setItem('token', res.data.access_token)
        navigate('/dashboard')
      })
      .catch(function(err) {
        var msg = 'Registration failed'
        if (err.response && err.response.data && err.response.data.detail) {
          msg = err.response.data.detail
        }
        setError(msg)
        setLoading(false)
      })
  }

  var inputStyle = {
    width: '100%',
    border: '1px solid #e5e7eb',
    borderRadius: '12px',
    padding: '12px',
    fontSize: '15px',
    marginBottom: '12px',
    boxSizing: 'border-box',
    outline: 'none'
  }

  return React.createElement(
    'div',
    { style: { minHeight: '100vh', background: 'linear-gradient(135deg, #166534, #14532d)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' } },
    React.createElement(
      'div',
      { style: { background: 'white', borderRadius: '24px', padding: '40px', width: '100%', maxWidth: '420px' } },
      React.createElement('div', { style: { textAlign: 'center', marginBottom: '24px' } },
        React.createElement('div', { style: { fontSize: '48px' } }, String.fromCodePoint(0x1F333)),
        React.createElement('h1', { style: { fontSize: '24px', fontWeight: 'bold', color: '#166534', margin: '8px 0 0' } }, 'Join Money Tree')
      ),
      invitedBy ? React.createElement('div', { style: { background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '12px', padding: '12px', marginBottom: '16px', textAlign: 'center' } },
        React.createElement('p', { style: { color: '#166534', fontWeight: 'bold', margin: '0 0 4px' } }, 'Invited by: ' + invitedBy),
        React.createElement('p', { style: { color: '#16a34a', fontSize: '13px', margin: '0' } }, '25 channels will be auto-browsed for you!')
      ) : null,
      error ? React.createElement('div', { style: { background: '#fef2f2', color: '#dc2626', borderRadius: '12px', padding: '12px', marginBottom: '16px', fontSize: '14px' } }, 'Error: ' + error) : null,
      React.createElement(
        'form',
        { onSubmit: handleSubmit },
        React.createElement('input', { type: 'email', required: true, placeholder: 'Email address', value: email, onChange: function(e) { setEmail(e.target.value) }, style: inputStyle }),
        React.createElement('input', { type: 'text', required: true, placeholder: 'Username', value: username, onChange: function(e) { setUsername(e.target.value) }, style: inputStyle }),
        React.createElement('input', { type: 'password', required: true, placeholder: 'Password', value: password, onChange: function(e) { setPassword(e.target.value) }, style: inputStyle }),
        React.createElement('input', { type: 'url', required: true, placeholder: 'Your YouTube channel URL', value: channelUrl, onChange: function(e) { setChannelUrl(e.target.value) }, style: inputStyle }),
        inviteCode ? React.createElement('div', { style: { background: '#f9fafb', borderRadius: '12px', padding: '10px 12px', fontSize: '13px', color: '#6b7280', marginBottom: '12px' } }, 'Invite Code: ' + inviteCode) : null,
        React.createElement(
          'button',
          {
            type: 'submit', disabled: loading,
            style: { width: '100%', background: loading ? '#9ca3af' : '#16a34a', color: 'white', border: 'none', borderRadius: '12px', padding: '14px', fontSize: '16px', fontWeight: 'bold', cursor: loading ? 'not-allowed' : 'pointer' }
          },
          loading ? 'Setting up...' : 'Join Money Tree Network'
        )
      ),
      React.createElement(
        'p',
        { style: { textAlign: 'center', marginTop: '20px', fontSize: '14px', color: '#6b7280' } },
        'Have account? ',
        React.createElement('span', { onClick: function() { navigate('/login') }, style: { color: '#16a34a', fontWeight: 'bold', cursor: 'pointer' } }, 'Login')
      )
    )
  )
}

export default Register
