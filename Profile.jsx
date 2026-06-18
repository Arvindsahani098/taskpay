export default function Profile({ user }) {
  return (
    <div className="page">
      <div className="header"><div style={{fontSize:16,fontWeight:600}}>Profile</div></div>
      <div className="card" style={{textAlign:'center',marginTop:16}}>
        <div style={{width:64,height:64,borderRadius:'50%',background:'#1f3a1f',color:'#3fb950',fontSize:24,fontWeight:700,display:'flex',alignItems:'center',justifyContent:'center',margin:'0 auto 12px'}}>
          {user.name[0]}
        </div>
        <div style={{fontSize:18,fontWeight:600}}>{user.name}</div>
        <div style={{fontSize:12,color:'#8b949e',marginTop:4}}>{user.phone}</div>
        <div style={{marginTop:8,background:'#1f3a1f',color:'#3fb950',fontSize:12,padding:'4px 14px',borderRadius:20,display:'inline-block'}}>
          Level {user.level} — Hustler
        </div>
      </div>
      <div className="card">
        {[['Total Earned','₹'+user.totalEarned.toLocaleString()],['Tasks Done','87'],['Current Plan',user.plan.toUpperCase()],['Member Since','June 2026']].map(([l,v]) => (
          <div key={l} style={{display:'flex',justifyContent:'space-between',padding:'9px 0',borderBottom:'0.5px solid #21262d'}}>
            <span style={{fontSize:12,color:'#8b949e'}}>{l}</span>
            <span style={{fontSize:12,fontWeight:600}}>{v}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
