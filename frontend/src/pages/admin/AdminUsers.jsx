import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../../services/api'
export default function AdminUsers() {
  const [users, setUsers] = useState([])
  const nav = useNavigate()
  useEffect(() => { api.get('/api/admin/users').then(r=>setUsers(r.data)).catch(()=>{}) }, [])
  return (
    <div style={{minHeight:'100vh',background:'#f9fafb',padding:'24px'}}>
      <div style={{maxWidth:'1100px',margin:'0 auto'}}>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'24px'}}>
          <h1 style={{fontSize:'28px',fontWeight:'bold'}}>👥 Users ({users.length})</h1>
          <button onClick={()=>nav('/admin')} style={{background:'#e5e7eb',border:'none',borderRadius:'12px',padding:'10px 20px',cursor:'pointer',fontWeight:'bold'}}>← Back</button>
        </div>
        <div style={{background:'white',borderRadius:'20px',boxShadow:'0 2px 12px rgba(0,0,0,0.06)',overflow:'hidden'}}>
          <table style={{width:'100%',borderCollapse:'collapse'}}>
            <thead style={{background:'#f9fafb',borderBottom:'1px solid #e5e7eb'}}>
              <tr>{['Username','Email','Referrals','Admin','Status'].map(h=>(
                <th key={h} style={{textAlign:'left',padding:'16px',color:'#6b7280',fontSize:'13px',fontWeight:'600'}}>{h}</th>
              ))}</tr>
            </thead>
            <tbody>
              {users.map(u=>(
                <tr key={u.id} style={{borderBottom:'1px solid #f3f4f6'}}>
                  <td style={{padding:'16px',fontWeight:'600',color:'#111827'}}>{u.username}</td>
                  <td style={{padding:'16px',color:'#6b7280',fontSize:'14px'}}>{u.email}</td>
                  <td style={{padding:'16px'}}><span style={{background:'#f3e8ff',color:'#9333ea',padding:'4px 12px',borderRadius:'999px',fontSize:'12px',fontWeight:'bold'}}>{u.total_referrals}</span></td>
                  <td style={{padding:'16px'}}>{u.is_admin?'✅':'—'}</td>
                  <td style={{padding:'16px'}}><span style={{background:u.is_active?'#dcfce7':'#fee2e2',color:u.is_active?'#16a34a':'#dc2626',padding:'4px 12px',borderRadius:'999px',fontSize:'12px',fontWeight:'bold'}}>{u.is_active?'Active':'Disabled'}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
          {users.length===0&&<div style={{textAlign:'center',padding:'48px',color:'#9ca3af'}}><div style={{fontSize:'48px',marginBottom:'12px'}}>👥</div>No users yet</div>}
        </div>
      </div>
    </div>
  )
}
