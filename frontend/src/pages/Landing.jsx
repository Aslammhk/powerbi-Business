import { useNavigate } from 'react-router-dom'
export default function Landing() {
  const nav = useNavigate()
  return (
    <div style={{minHeight:'100vh',background:'linear-gradient(135deg,#166534,#14532d)',display:'flex',alignItems:'center',justifyContent:'center',padding:'24px'}}>
      <div style={{textAlign:'center',color:'white',maxWidth:'500px'}}>
        <div style={{fontSize:'80px',marginBottom:'16px'}}>🌳</div>
        <h1 style={{fontSize:'40px',fontWeight:'bold',marginBottom:'12px'}}>Money Tree Network</h1>
        <p style={{color:'#bbf7d0',fontSize:'18px',marginBottom:'32px'}}>
          Grow your YouTube channels together through automated referral browsing
        </p>
        <div style={{display:'flex',gap:'16px',justifyContent:'center',flexWrap:'wrap'}}>
          <button onClick={() => nav('/register')}
            style={{background:'white',color:'#166534',padding:'14px 36px',borderRadius:'50px',border:'none',fontWeight:'bold',fontSize:'16px',cursor:'pointer'}}>
            🌱 Join Free
          </button>
          <button onClick={() => nav('/login')}
            style={{background:'transparent',color:'white',padding:'14px 36px',borderRadius:'50px',border:'2px solid white',fontWeight:'bold',fontSize:'16px',cursor:'pointer'}}>
            Login
          </button>
        </div>
        <div style={{marginTop:'40px',display:'grid',gridTemplateColumns:'1fr 1fr',gap:'12px'}}>
          {[['📺','Auto Browse 25 Channels'],['💰','Earn Points & Rewards'],['🏆','Leaderboard Rankings'],['🔗','Custom Invite URLs']].map(([icon,label]) => (
            <div key={label} style={{background:'rgba(255,255,255,0.1)',borderRadius:'16px',padding:'16px'}}>
              <div style={{fontSize:'28px'}}>{icon}</div>
              <div style={{fontSize:'13px',color:'#bbf7d0',marginTop:'4px'}}>{label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
