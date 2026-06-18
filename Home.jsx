import { useAdMob } from '../hooks/useAdMob';

const TASKS = [
  { id:1, title:'Instagram Story Like', desc:'Story dekho, like karo, screenshot bhejo', reward:8,  time:'2 min',  tag:'easy'   },
  { id:2, title:'Product Review (100 words)', desc:'Hindi ya English mein honest review likhna hai', reward:35, time:'10 min', tag:'medium' },
  { id:3, title:'App Refer & Install',   desc:'Dost ko install karwao, dono ko bonus!', reward:80, time:'Referral', tag:'hot' },
  { id:4, title:'YouTube Video Watch',   desc:'2 min video dekho aur thumbs up do', reward:5,  time:'3 min',  tag:'easy'   },
  { id:5, title:'Survey Fill (5 questions)', desc:'Brand ka survey complete karo', reward:25, time:'5 min',  tag:'medium' },
];

export default function Home({ user, setUser }) {
  const { showRewarded } = useAdMob();

  async function handleWatchAd() {
    await showRewarded((reward) => {
      setUser(u => ({ ...u, wallet: u.wallet + 10 }));
      alert('+₹10 bonus mil gaya!');
    });
  }

  async function completeTask(task) {
    setUser(u => ({
      ...u,
      wallet: u.wallet + task.reward,
      tasksToday: u.tasksToday + 1,
      xp: u.xp + 10,
    }));
    alert(`+₹${task.reward} wallet mein add ho gaye!`);
  }

  return (
    <div className="page">
      {/* Header */}
      <div className="header">
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
          <div>
            <span style={{ color:'#3fb950', fontWeight:700, fontSize:18 }}>TASK</span>
            <span style={{ fontWeight:700, fontSize:18 }}>PAY</span>
            <span style={{ marginLeft:8, background:'#1f6feb22', color:'#58a6ff', fontSize:10, padding:'2px 8px', borderRadius:20 }}>v2.0</span>
          </div>
          <div style={{ background:'#1f3a1f', color:'#3fb950', fontSize:11, padding:'4px 10px', borderRadius:20 }}>
            👑 {user.plan === 'free' ? 'Free Plan' : user.plan === 'pro' ? 'Pro' : 'Elite'}
          </div>
        </div>
      </div>

      {/* Wallet Card */}
      <div className="card" style={{ marginTop:12 }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start' }}>
          <div>
            <div style={{ fontSize:11, color:'#8b949e' }}>Aaj ki kamai</div>
            <div style={{ fontSize:28, fontWeight:700, color:'#3fb950' }}>₹{user.wallet.toFixed(2)}</div>
          </div>
          <div style={{ textAlign:'right' }}>
            <div style={{ fontSize:11, color:'#8b949e' }}>Level {user.level} — Hustler</div>
            <div style={{ fontSize:11, color:'#3fb950', marginTop:4 }}>{user.tasksToday} tasks done today</div>
          </div>
        </div>
        {/* XP Bar */}
        <div style={{ marginTop:12 }}>
          <div style={{ display:'flex', justifyContent:'space-between', fontSize:10, color:'#8b949e', marginBottom:4 }}>
            <span>Lv.{user.level}</span><span>{user.xp}/1000 XP</span>
          </div>
          <div style={{ height:4, background:'#21262d', borderRadius:10 }}>
            <div style={{ height:'100%', width:`${(user.xp/1000)*100}%`, background:'#3fb950', borderRadius:10 }} />
          </div>
        </div>
        {/* Action Buttons */}
        <div style={{ display:'flex', gap:8, marginTop:12 }}>
          {['Withdraw','Refer','History'].map(t => (
            <button key={t} style={{ flex:1, background:'#21262d', border:'0.5px solid #30363d', color:'#8b949e', borderRadius:10, padding:'7px 0', fontSize:11, cursor:'pointer' }}>
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:8, padding:'4px 12px' }}>
        {[['₹'+user.totalEarned.toLocaleString(),'This Month'],['87','Tasks Done'],['4.9★','Rating']].map(([n,l]) => (
          <div key={l} style={{ background:'#161b22', border:'0.5px solid #21262d', borderRadius:10, padding:'10px 8px', textAlign:'center' }}>
            <div style={{ fontSize:14, fontWeight:600 }}>{n}</div>
            <div style={{ fontSize:10, color:'#8b949e', marginTop:2 }}>{l}</div>
          </div>
        ))}
      </div>

      {/* Watch Ad Button */}
      {user.plan === 'free' && (
        <div style={{ margin:'8px 12px' }}>
          <button onClick={handleWatchAd} style={{ width:'100%', background:'#1f6feb', color:'#fff', border:'none', borderRadius:10, padding:'10px 0', fontSize:13, fontWeight:600, cursor:'pointer' }}>
            Watch Ad → +₹10 Bonus Coins
          </button>
        </div>
      )}

      {/* Tasks */}
      <div style={{ padding:'8px 14px 4px', fontSize:11, color:'#8b949e', fontWeight:600, letterSpacing:0.5 }}>AVAILABLE TASKS</div>
      {TASKS.map(task => (
        <div key={task.id} className="card">
          <div style={{ display:'flex', justifyContent:'space-between' }}>
            <div style={{ fontSize:13, fontWeight:600 }}>{task.title}</div>
            <div style={{ fontSize:13, fontWeight:600, color:'#3fb950' }}>+₹{task.reward}</div>
          </div>
          <div style={{ fontSize:11, color:'#8b949e', marginTop:4 }}>{task.desc}</div>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginTop:8 }}>
            <span className={`tag tag-${task.tag}`}>{task.tag === 'easy' ? 'Easy' : task.tag === 'medium' ? 'Medium' : '🔥 Hot'}</span>
            <span style={{ fontSize:10, color:'#8b949e' }}>⏱ {task.time}</span>
            <button onClick={() => completeTask(task)} style={{ background:'#238636', color:'#fff', border:'none', borderRadius:8, padding:'5px 14px', fontSize:11, cursor:'pointer' }}>
              Start
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
