import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../services/api'

export default function Dashboard() {
  const [user, setUser] = useState(null)
  const [stats, setStats] = useState({})
  const [invite, setInvite] = useState('')
  const [copied, setCopied] = useState(false)
  const nav = useNavigate()

  useEffect(() => {
    if (!localStorage.getItem('token')) { nav('/login'); return }
    Promise.all([api.get('/api/auth/me'), api.get('/api/browse/stats')])
      .then(([u,s]) => { setUser(u.data); setStats(s.data) })
      .catch(() => nav('/login'))
  }, [])

  const genInvite = async () => {
    const r = await api.post('/api/invite/generate')
    setInvite(r.data.invite_link)
  }

  const copy = () => {
    navigator.clipboard.writeText(invite)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (!user) return (
    <div style={{minHeight:'100vh',display:'flex',alignItems:'center',justifyContent:'center',background:'#f9fafb'}}>
      <div style={{textAlign:'center'}}>
        <div style={{fontSize:'60px',animation:'bounce 1s infinite'}}>🌳</div>
        <p style={{color:'#6b7280',marginTop:'16px'}}>Loading dashboard...</p>
      </div>
    </div>
  )

  return (
    <div style={{minHeight:'100vh',background:'#f9fafb'}}>
      <nav style={{background:'#166534',color:'white',padding:'16px 24px',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
        <div style={{display:'flex',alignItems:'center',gap:'12px'}}>
          <span style={{fontSize:'28px'}}>🌳</span>
          <div>
            <div style={{fontWeight:'bold',fontSize:'18px'}}>Money Tree</div>
            <div style={{color:'#bbf7d0',fontSize:'12px'}}>Welcome, {user.username}!</div>
          </div>
        </div>
        <div style={{display:'flex',gap:'8px'}}>
          {user.is_admin && (
            <button onClick={() => nav('/admin')} style={{background:'#eab308',color:'white',border:'none',borderRadius:'8px',padding:'8px 16px',cursor:'pointer',fontWeight:'bold'}}>⚙️ Admin</button>
          )}
          <button onClick={() => { localStorage.clear(); nav('/login') }} style={{background:'#dc2626',color:'white',border:'none',borderRadius:'8px',padding:'8px 16px',cursor:'pointer'}}>Logout</button>
        </div>
      </nav>

      <div style={{maxWidth:'1100px',margin:'0 auto',padding:'24px 16px'}}>
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(200px,1fr))',gap:'16px',marginBottom:'24px'}}>
          {[
            {icon:'📺',label:'Channels Browsed',value:stats.total_browsed||0,color:'#2563eb'},
            {icon:'✅',label:'Successful',value:stats.successful||0,color:'#16a34a'},
            {icon:'👥',label:'My Referrals',value:user.total_referrals||0,color:'#9333ea'},
            {icon:'🌳',label:'Tree Size',value:stats.tree_size||0,color:'#ea580c'},
          ].map(s => (
            <div key={s.label} style={{background:'white',borderRadius:'20px',boxShadow:'0 2px 12px rgba(0,0,0,0.06)',padding:'24px',textAlign:'center'}}>
              <div style={{fontSize:'32px',marginBottom:'8px'}}>{s.icon}</div>
              <div style={{fontSize:'28px',fontWeight:'bold',color:s.color}}>{s.value}</div>
              <div style={{color:'#6b7280',fontSize:'13px',marginTop:'4px'}}>{s.label}</div>
            </div>
          ))}
        </div>

        <div style={{background:'white',borderRadius:'20px',boxShadow:'0 2px 12px rgba(0,0,0,0.06)',padding:'24px',marginBottom:'24px'}}>
          <h2 style={{fontWeight:'bold',fontSize:'18px',marginBottom:'8px',color:'#111827'}}>🔗 Invite People to Your Tree</h2>
          <p style={{color:'#6b7280',fontSize:'14px',marginBottom:'16px'}}>When someone joins with your link, system auto-browses your channels!</p>
          {!invite ? (
            <button onClick={genInvite} style={{background:'#16a34a',color:'white',border:'none',borderRadius:'12px',padding:'12px 32px',fontSize:'15px',fontWeight:'bold',cursor:'pointer'}}>
              🌱 Generate Invite Link
            </button>
          ) : (
            <div style={{display:'flex',gap:'8px',flexWrap:'wrap'}}>
              <input readOnly value={invite} style={{flex:'1',minWidth:'200px',border:'1px solid #e5e7eb',borderRadius:'12px',padding:'12px',fontSize:'13px'}} />
              <button onClick={copy} style={{background:copied?'#16a34a':'#2563eb',color:'white',border:'none',borderRadius:'12px',padding:'12px 24px',cursor:'pointer',fontWeight:'bold',whiteSpace:'nowrap'}}>
                {copied ? '✅ Copied!' : '📋 Copy'}
              </button>
            </div>
          )}
        </div>

        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(150px,1fr))',gap:'16px'}}>
          {[
            {icon:'🌳',label:'View Tree',path:'/tree'},
            {icon:'🏆',label:'Leaderboard',path:'/leaderboard'},
            {icon:'💰',label:'My Points',path:'/points'},
            {icon:'🔗',label:'My URL',path:'/my-url'},
          ].map(item => (
            <button key={item.label} onClick={() => nav(item.path)}
              style={{background:'white',border:'none',borderRadius:'20px',boxShadow:'0 2px 12px rgba(0,0,0,0.06)',padding:'24px 16px',cursor:'pointer',textAlign:'center',transition:'box-shadow 0.2s'}}>
              <div style={{fontSize:'36px',marginBottom:'8px'}}>{item.icon}</div>
              <div style={{fontWeight:'600',color:'#374151',fontSize:'14px'}}>{item.label}</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
