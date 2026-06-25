import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../services/api.js'

function Login() {
  var navigate = useNavigate()
  var [email, setEmail] = useState('')
  var [password, setPassword] = useState('')
  var [loading, setLoading] = useState(false)
  var [error, setError] = useState('')

  function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setError('')

    var form = new FormData()
    form.append('username', email)
    form.append('password', password)

    api.post('/api/auth/login', form)
      .then(function(res) {
        localStorage.setItem('token', res.data.access_token)
        return api.get('/api/auth/me')
      })
      .then(function(res) {
        localStorage.setItem('is_admin', String(res.data.is_admin))
        if (res.data.is_admin) {
          navigate('/admin')
        } else {
          navigate('/dashboard')
        }
      })
      .catch(function(err) {
        var msg = 'Login failed'
        if (err.response && err.response.data && err.response.data.detail) {
          msg = err.response.data.detail
        }
        setError(msg)
        setLoading(false)
      })
  }

  return React.createElement(
    'div',
    { style: { minHeight: '100vh', background: '#f9fafb', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' } },
    React.createElement(
      'div',
      { style: { background: 'white', borderRadius: '24px', boxShadow: '0 4px 24px rgba(0,0,0,0.1)', padding: '40px', width: '100%', maxWidth: '400px' } },
      React.createElement('div', { style: { textAlign: 'center', marginBottom: '32px' } },
        React.createElement('div', { style: { fontSize: '48px' } }, String.fromCodePoint(0x1F333)),
        React.createElement('h1', { style: { fontSize: '24px', fontWeight: 'bold', color: '#111827', margin: '8px 0 4px' } }, 'Welcome Back'),
        React.createElement('p', { style: { color: '#6b7280', fontSize: '14px', margin: '0' } }, 'Login to Money Tree Network')
      ),
      error ? React.createElement('div', { style: { background: '#fef2f2', color: '#dc2626', borderRadius: '12px', padding: '12px', marginBottom: '16px', fontSize: '14px' } }, 'Error: ' + error) : null,
      React.createElement(
        'form',
        { onSubmit: handleSubmit },
        React.createElement('input', {
          type: 'email', required: true, placeholder: 'Email address', value: email,
          onChange: function(e) { setEmail(e.target.value) },
          style: { width: '100%', border: '1px solid #e5e7eb', borderRadius: '12px', padding: '12px', fontSize: '15px', marginBottom: '12px', boxSizing: 'border-box', outline: 'none' }
        }),
        React.createElement('input', {
          type: 'password', required: true, placeholder: 'Password', value: password,
          onChange: function(e) { setPassword(e.target.value) },
          style: { width: '100%', border: '1px solid #e5e7eb', borderRadius: '12px', padding: '12px', fontSize: '15px', marginBottom: '16px', boxSizing: 'border-box', outline: 'none' }
        }),
        React.createElement(
          'button',
          {
            type: 'submit', disabled: loading,
            style: { width: '100%', background: loading ? '#9ca3af' : '#16a34a', color: 'white', border: 'none', borderRadius: '12px', padding: '14px', fontSize: '16px', fontWeight: 'bold', cursor: loading ? 'not-allowed' : 'pointer' }
          },
          loading ? 'Logging in...' : 'Login'
        )
      ),
      React.createElement(
        'p',
        { style: { textAlign: 'center', marginTop: '20px', fontSize: '14px', color: '#6b7280' } },
        'No account? ',
        React.createElement('span', { onClick: function() { navigate('/register') }, style: { color: '#16a34a', fontWeight: 'bold', cursor: 'pointer' } }, 'Join Free')
      )
    )
  )
}

export default Login
