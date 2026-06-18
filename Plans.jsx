const PLANS = [
  {
    id:'free', name:'Free', price:0, color:'#8b949e',
    features:['10 tasks/day','Basic tasks only','Withdraw ₹500/week','Ads dikhenge'],
  },
  {
    id:'pro', name:'Pro', price:99, color:'#3fb950', popular:true,
    features:['Unlimited tasks/day','Priority + Bonus tasks','Withdraw ₹10,000/week','2x XP boost','No banner/interstitial ads','Early task access'],
  },
  {
    id:'elite', name:'Elite', price:249, color:'#d29922',
    features:['All Pro features','Unlimited withdrawal','Exclusive high-pay tasks','5x Referral bonus','Priority support + badge'],
  },
];

export default function Plans({ user, setUser }) {

  async function handleSubscribe(plan) {
    if (plan.price === 0) return alert('Free plan already active hai!');

    // Razorpay checkout
    const options = {
      key: 'rzp_test_XXXXXXXXXXXXXXXX', // apna key daalo
      amount: plan.price * 100,
      currency: 'INR',
      name: 'TaskPay',
      description: `${plan.name} Plan — ₹${plan.price}/month`,
      theme: { color: plan.color },
      prefill: { name: user.name, contact: user.phone },
      handler: function(response) {
        setUser(u => ({ ...u, plan: plan.id }));
        alert(`${plan.name} plan active ho gaya!`);
      },
      modal: { ondismiss: () => {} },
    };

    if (window.Razorpay) {
      new window.Razorpay(options).open();
    } else {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => new window.Razorpay(options).open();
      document.body.appendChild(script);
    }
  }

  return (
    <div className="page">
      <div className="header">
        <div style={{ fontSize:16, fontWeight:600 }}>Subscription Plans</div>
        <div style={{ fontSize:11, color:'#8b949e', marginTop:2 }}>Zyada kamao, ads hatao</div>
      </div>

      {PLANS.map(plan => (
        <div key={plan.id} className="card" style={{
          border: plan.popular ? `2px solid ${plan.color}` : '0.5px solid #21262d',
          marginTop: plan.popular ? 12 : 8,
        }}>
          {plan.popular && (
            <div style={{ background:'#1f3a1f', color:'#3fb950', fontSize:10, padding:'2px 10px', borderRadius:20, display:'inline-block', marginBottom:8 }}>
              Most Popular
            </div>
          )}
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
            <div style={{ fontSize:16, fontWeight:700, color: plan.color }}>
              {plan.id === 'elite' ? '💎' : plan.id === 'pro' ? '👑' : '🆓'} {plan.name}
            </div>
            <div>
              <span style={{ fontSize:22, fontWeight:700, color: plan.color }}>₹{plan.price}</span>
              <span style={{ fontSize:11, color:'#8b949e' }}>/mo</span>
            </div>
          </div>
          <div style={{ marginTop:10, display:'flex', flexDirection:'column', gap:5 }}>
            {plan.features.map(f => (
              <div key={f} style={{ fontSize:12, color:'#8b949e', display:'flex', gap:6 }}>
                <span style={{ color:'#3fb950' }}>✓</span> {f}
              </div>
            ))}
          </div>
          <button
            onClick={() => handleSubscribe(plan)}
            disabled={user.plan === plan.id}
            style={{
              marginTop:12, width:'100%', padding:'10px 0', borderRadius:10, border:'none',
              background: user.plan === plan.id ? '#21262d' : plan.price === 0 ? '#21262d' : plan.id === 'elite' ? '#854f0b' : '#238636',
              color: user.plan === plan.id ? '#8b949e' : '#fff',
              fontWeight:600, fontSize:13, cursor: user.plan === plan.id ? 'default' : 'pointer',
            }}
          >
            {user.plan === plan.id ? 'Current Plan' : plan.price === 0 ? 'Free Plan' : `Subscribe — ₹${plan.price}/mo`}
          </button>
        </div>
      ))}
    </div>
  );
}
