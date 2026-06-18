import { useState } from 'react';

export default function Wallet({ user, setUser }) {
  const [amount, setAmount] = useState('');
  const [msg, setMsg] = useState(null);

  function withdraw() {
    const amt = parseFloat(amount);
    if (!amt || amt < 100) return setMsg({ t:'error', m:'Minimum ₹100 withdraw karo' });
    if (amt > user.wallet) return setMsg({ t:'error', m:'Wallet mein itne paise nahi hain' });
    setUser(u => ({ ...u, wallet: u.wallet - amt }));
    setMsg({ t:'success', m:`₹${amt} UPI pe transfer ho rahe hain!` });
    setAmount('');
    setTimeout(() => setMsg(null), 3000);
  }

  return (
    <div className="page">
      <div className="header">
        <div style={{ fontSize:16, fontWeight:600 }}>Wallet</div>
      </div>

      <div className="card" style={{ textAlign:'center', marginTop:16 }}>
        <div style={{ fontSize:11, color:'#8b949e' }}>Total Balance</div>
        <div style={{ fontSize:36, fontWeight:700, color:'#3fb950', margin:'8px 0' }}>₹{user.wallet.toFixed(2)}</div>
        <div style={{ fontSize:11, color:'#8b949e' }}>UPI: {user.phone}@upi</div>
      </div>

      {msg && (
        <div style={{ margin:'0 12px', background: msg.t==='success'?'#1f3a1f':'#3a1a1f', color: msg.t==='success'?'#3fb950':'#f85149', border:`0.5px solid ${msg.t==='success'?'#3fb95055':'#f8514955'}`, borderRadius:10, padding:'10px 14px', fontSize:12 }}>
          {msg.m}
        </div>
      )}

      <div className="card">
        <div style={{ fontSize:13, fontWeight:600, marginBottom:12 }}>Withdraw to UPI</div>
        <input
          type="number" placeholder="Amount (min ₹100)"
          value={amount} onChange={e => setAmount(e.target.value)}
          style={{ width:'100%', padding:'10px 12px', background:'#0d1117', border:'0.5px solid #30363d', borderRadius:10, color:'#e6edf3', fontSize:14, marginBottom:10, outline:'none' }}
        />
        <div style={{ fontSize:11, color:'#8b949e', marginBottom:10 }}>⚡ Instant UPI • 🔒 Secured by RazorpayX</div>
        <button className="btn-primary" onClick={withdraw}>Withdraw Now</button>
      </div>

      <div className="card">
        <div style={{ fontSize:13, fontWeight:600, marginBottom:10 }}>Transaction History</div>
        {[{d:'Task Complete',a:'+₹35',t:'2 min ago'},{d:'Watch Ad Bonus',a:'+₹10',t:'1 hr ago'},{d:'Withdrawal',a:'-₹500',t:'Yesterday'}].map((tx,i) => (
          <div key={i} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'8px 0', borderBottom: i<2?'0.5px solid #21262d':'none' }}>
            <div>
              <div style={{ fontSize:12 }}>{tx.d}</div>
              <div style={{ fontSize:10, color:'#8b949e' }}>{tx.t}</div>
            </div>
            <div style={{ fontSize:13, fontWeight:600, color: tx.a.startsWith('+')?'#3fb950':'#f85149' }}>{tx.a}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
