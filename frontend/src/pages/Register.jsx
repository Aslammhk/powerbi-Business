import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams, Link } from 'react-router-dom'
import api from '../services/api'

export default function Register() {
  const [sp] = useSearchParams()
  const nav = useNavigate()
  const code = sp.get('invite')
  const [form, setForm] = useState({email:'',username:'',password:'',channel_url:'',invite_code:code||''})
  const [info, setInfo] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (code) api.get(/api/invite/validate/).then(r=>setInfo(r.data)).catch(()=>{})
  }, [code])

  const submit = async e => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const p = new URLSearchParams(form)
      const res = await api.post(/api/auth/register?)
      localStorage.setItem('token', res.data.access_token)
      nav('/dashboard')
    } catch(err) {
      setError(err.response?.data?.detail || 'Registration failed')
    } finally { setLoading(false) }
  }

  const s = {
    page: {minHeight:'100vh',background:'linear-gradient(135deg,#166534,#14532d)',display:'flex',alignItems:'center',justifyContent:'center',padding:'16px'},
    card: {background:'white',borderRadius:'24px',padding:'40px',width:'100%',maxWidth:'420px'},
    input: {width:'100%',border:'1px solid #e5e7eb',borderRadius:'12px',padding:'12px',fontSize:'15px',outline:'none',boxSizing:'border-box',marginBottom:'12px'},
    btn: {width:'100%',background:'#16a34a',color:'white',border:'none',borderRadius:'12px',padding:'14px',fontSize:'16px',fontWeight:'bold',cursor:'pointer'},
  }

  return (
    <div style={s.page}>
      <div style={s.card}>
        <div style={{textAlign:'center',marginBottom:'24px'}}>
          <div style={{fontSize:'48px'}}>🌳</div>
          <h1 style={{fontSize:'24px',fontWeight:'bold',color:'#166534',margin:'8px 0 4px'}}>Join Money Tree</h1>
        </div>
        {info?.valid && (
          <div style={{background:'#f0fdf4',border:'1px solid #bbf7d0',borderRadius:'12px',padding:'12px',marginBottom:'16px',textAlign:'center'}}>
            <p style={{color:'#166534',fontWeight:'bold'}}>🎉 Invited by: {info.invited_by}</p>
            <p style={{color:'#16a34a',fontSize:'13px',marginTop:'4px'}}>25 channels will be auto-browsed for you!</p>
          </div>
        )}
        {error && <div style={{background:'#fef2f2',color:'#dc2626',borderRadius:'12px',padding:'12px',marginBottom:'16px',fontSize:'14px'}}>❌ {error}</div>}
        <form onSubmit={submit}>
          <input style={s.input} type="email" required placeholder="Email address" value={form.email} onChange={e=>setForm({...form,email:e.target.value})} />
          <input style={s.input} type="text" required placeholder="Username" value={form.username} onChange={e=>setForm({...form,username:e.target.value})} />
          <input style={s.input} type="password" required placeholder="Password" value={form.password} onChange={e=>setForm({...form,password:e.target.value})} />
          <input style={s.input} type="url" required placeholder="Your YouTube channel URL" value={form.channel_url} onChange={e=>setForm({...form,channel_url:e.target.value})} />
          {code && <div style={{background:'#f9fafb',borderRadius:'12px',padding:'12px',fontSize:'13px',color:'#6b7280',marginBottom:'12px'}}>🔑 Invite Code: {code}</div>}
          <button style={s.btn} type="submit" disabled={loading}>
            {loading ? '⏳ Setting up...' : '🌱 Join Money Tree Network'}
          </button>
        </form>
        <p style={{textAlign:'center',marginTop:'20px',fontSize:'14px',color:'#6b7280'}}>
          Have account? <Link to="/login" style={{color:'#16a34a',fontWeight:'bold'}}>Login</Link>
        </p>
      </div>
    </div>
  )
}
