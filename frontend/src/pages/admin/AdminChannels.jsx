import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../../services/api'
export default function AdminChannels() {
  const [channels, setChannels] = useState([])
  const [form, setForm] = useState({name:'',url:''})
  const [adding, setAdding] = useState(false)
  const nav = useNavigate()
  const load = () => api.get('/api/admin/channels').then(r=>setChannels(r.data)).catch(()=>{})
  useEffect(()=>{load()},[])
  const add = async e => {
    e.preventDefault(); setAdding(true)
    try {
      await api.post(/api/admin/channels/add?youtube_url=&channel_name=)
      setForm({name:'',url:''}); load()
      alert('✅ Channel added and locked!')
    } catch(err){ alert('❌ '+(err.response?.data?.detail||'Failed')) }
    finally{ setAdding(false) }
  }
  const adminCount = channels.filter(c=>c.is_admin_default).length
  return (
    <div style={{minHeight:'100vh',background:'#f9fafb',padding:'24px'}}>
      <div style={{maxWidth:'800px',margin:'0 auto'}}>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'24px'}}>
          <h1 style={{fontSize:'28px',fontWeight:'bold'}}>📺 Channels ({adminCount}/10 admin)</h1>
          <button onClick={()=>nav('/admin')} style={{background:'#e5e7eb',border:'none',borderRadius:'12px',padding:'10px 20px',cursor:'pointer',fontWeight:'bold'}}>← Back</button>
        </div>
        <div style={{background:'white',borderRadius:'20px',boxShadow:'0 2px 12px rgba(0,0,0,0.06)',padding:'24px',marginBottom:'24px'}}>
          <h2 style={{fontWeight:'bold',fontSize:'16px',marginBottom:'16px'}}>➕ Add Admin Channel</h2>
          <form onSubmit={add} style={{display:'flex',gap:'12px',flexWrap:'wrap'}}>
            <input required value={form.name} onChange={e=>setForm({...form,name:e.target.value})} placeholder="Channel Name" style={{flex:'1',minWidth:'180px',border:'1px solid #e5e7eb',borderRadius:'12px',padding:'12px',fontSize:'14px',outline:'none'}} />
            <input required value={form.url} onChange={e=>setForm({...form,url:e.target.value})} placeholder="https://youtube.com/@channel" style={{flex:'2',minWidth:'200px',border:'1px solid #e5e7eb',borderRadius:'12px',padding:'12px',fontSize:'14px',outline:'none'}} />
            <button type="submit" disabled={adding||adminCount>=10} style={{background:adminCount>=10?'#9ca3af':'#16a34a',color:'white',border:'none',borderRadius:'12px',padding:'12px 24px',cursor:'pointer',fontWeight:'bold',whiteSpace:'nowrap'}}>
              {adding?'Adding...':adminCount>=10?'Max 10 reached':'🔒 Add & Lock'}
            </button>
          </form>
          {adminCount>=10&&<p style={{color:'#dc2626',fontSize:'13px',marginTop:'8px'}}>Maximum 10 admin channels reached</p>}
        </div>
        <div style={{display:'flex',flexDirection:'column',gap:'12px'}}>
          {channels.map(c=>(
            <div key={c.id} style={{background:'white',borderRadius:'16px',boxShadow:'0 2px 8px rgba(0,0,0,0.06)',padding:'16px',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
              <div>
                <div style={{display:'flex',alignItems:'center',gap:'8px',marginBottom:'4px'}}>
                  <span style={{fontWeight:'600',color:'#111827'}}>{c.channel_name}</span>
                  {c.is_locked&&<span style={{background:'#fee2e2',color:'#dc2626',padding:'2px 10px',borderRadius:'999px',fontSize:'11px',fontWeight:'bold'}}>🔒 Locked</span>}
                  {c.is_admin_default&&<span style={{background:'#dcfce7',color:'#16a34a',padding:'2px 10px',borderRadius:'999px',fontSize:'11px',fontWeight:'bold'}}>Admin</span>}
                </div>
                <div style={{color:'#6b7280',fontSize:'13px'}}>{c.youtube_url}</div>
              </div>
              <span style={{background:c.is_active?'#dcfce7':'#f3f4f6',color:c.is_active?'#16a34a':'#9ca3af',padding:'4px 16px',borderRadius:'999px',fontSize:'12px',fontWeight:'bold'}}>{c.is_active?'Active':'Off'}</span>
            </div>
          ))}
          {channels.length===0&&(
            <div style={{textAlign:'center',padding:'48px',background:'white',borderRadius:'20px',color:'#9ca3af'}}>
              <div style={{fontSize:'48px',marginBottom:'12px'}}>📺</div>
              <p>No channels yet. Add your first one above!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
