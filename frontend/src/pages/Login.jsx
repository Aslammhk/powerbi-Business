import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import api from '../services/api'

export default function Login() {
  const [email, setEmail] = useState('')
  const [pass, setPass] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const nav = useNavigate()

  const submit = async e => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const form = new FormData()
      form.append('username', email)
      form.append('password', pass)
      const res = await api.post('/api/auth/login', form, {
        headers: {'Content-Type': 'multipart/form-data'}
      })
      localStorage.setItem('token', res.data.access_token)
      const me = await api.get('/api/auth/me')
      localStorage.setItem('is_admin', me.data.is_admin)
      nav(me.data.is_admin ? '/admin' : '/dashboard')
    } catch(err) {
      setError(err.response?.data?.detail || 'Login failed')
    } finally { setLoading(false) }
  }

  const s = {
    page: {minHeight:'100vh',background:'#f9fafb',display:'flex',alignItems:'center',justifyContent:'center',padding:'16px'},
    card: {background:'white',borderRadius:'24px',boxShadow:'0 4px 24px rgba(0,0,0,0.1)',padding:'40px',width:'100%',maxWidth:'400px'},
    input: {width:'100%',border:'1px solid #e5e7eb',borderRadius:'12px',padding:'12px',fontSize:'15px',outline:'none',boxSizing:'border-box',marginBottom:'12px'},
    btn: {width:'100%',background:'#16a34a',color:'white',border:'none',borderRadius:'12px',padding:'14px',fontSize:'16px',fontWeight:'bold',cursor:'pointer'},
    err: {background:'#fef2f2',color:'#dc2626',borderRadius:'12px',padding:'12px',marginBottom:'16px',fontSize:'14px'}
  }

  return (
    <div style={s.page}>
      <div style={s.card}>
        <div style={{textAlign:'center',marginBottom:'32px'}}>
          <div style={{fontSize:'48px'}}>🌳</div>
          <h1 style={{fontSize:'24px',fontWeight:'bold',color:'#111827',margin:'8px 0 4px'}}>Welcome Back</h1>
          <p style={{color:'#6b7280',fontSize:'14px'}}>Login to Money Tree Network</p>
        </div>
        {error && <div style={s.err}>❌ {error}</div>}
        <form onSubmit={submit}>
          <input style={s.input} type="email" required placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
          <input style={s.input} type="password" required placeholder="Password" value={pass} onChange={e=>setPass(e.target.value)} />
          <button style={s.btn} type="submit" disabled={loading}>
            {loading ? '⏳ Logging in...' : '🌳 Login'}
          </button>
        </form>
        <p style={{textAlign:'center',marginTop:'20px',fontSize:'14px',color:'#6b7280'}}>
          No account? <Link to="/register" style={{color:'#16a34a',fontWeight:'bold'}}>Join Free</Link>
        </p>
      </div>
    </div>
  )
}
