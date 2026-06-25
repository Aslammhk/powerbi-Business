import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../../services/api'
export default function AdminDashboard() {
  const [stats, setStats] = useState({})
  const nav = useNavigate()
  useEffect(() => { api.get('/api/admin/overview').then(r=>setStats(r.data)).catch(()=>{}) }, [])
  return (
    <div style={{minHeight:'100vh',background:'#f9fafb'}}>
      <nav style={{background:'#166534',color:'white',padding:'16px 24px',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
        <div style={{display:'flex',alignItems:'center',gap:'12px'}}>
          <span style={{fontSize:'28px'}}>⚙️</span>
          <div style={{fontWeight:'bold',fontSize:'18px'}}>Admin Panel</div>
        </div>
        <button onClick={()=>nav('/dashboard')} style={{background:'white',color:'#166534',border:'none',borderRadius:'8px',padding:'8px 16px',cursor:'pointer',fontWeight:'bold'}}>Dashboard</button>
      </nav>
      <div style={{maxWidth:'1100px',margin:'0 auto',padding:'24px 16px'}}>
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(200px,1fr))',gap:'16px',marginBottom:'24px'}}>
          {[
            {icon:'👥',label:'Total Users',value:stats.total_users||0},
            {icon:'📺',label:'Channels',value:stats.total_channels||0},
            {icon:'🌳',label:'Tree Nodes',value:stats.tree_nodes||0},
            {icon:'🔗',label:'Active Invites',value:stats.active_invites||0},
          ].map(s=>(
            <div key={s.label} style={{background:'white',borderRadius:'20px',boxShadow:'0 2px 12px rgba(0,0,0,0.06)',padding:'24px',textAlign:'center'}}>
              <div style={{fontSize:'32px',marginBottom:'8px'}}>{s.icon}</div>
              <div style={{fontSize:'28px',fontWeight:'bold',color:'#16a34a'}}>{s.value}</div>
              <div style={{color:'#6b7280',fontSize:'13px',marginTop:'4px'}}>{s.label}</div>
            </div>
          ))}
        </div>
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'16px'}}>
          {[
            {icon:'👥',label:'Manage Users',sub:'View all members',path:'/admin/users'},
            {icon:'📺',label:'Manage Channels',sub:'Add locked channels',path:'/admin/channels'},
          ].map(item=>(
            <button key={item.label} onClick={()=>nav(item.path)}
              style={{background:'white',border:'none',borderRadius:'20px',boxShadow:'0 2px 12px rgba(0,0,0,0.06)',padding:'24px',cursor:'pointer',textAlign:'left'}}>
              <div style={{fontSize:'36px',marginBottom:'8px'}}>{item.icon}</div>
              <div style={{fontWeight:'bold',fontSize:'16px',color:'#111827'}}>{item.label}</div>
              <div style={{color:'#6b7280',fontSize:'13px',marginTop:'4px'}}>{item.sub}</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
