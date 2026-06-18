// TaskPay v2.0 — Razorpay Payment Integration
// React + Razorpay Subscription & Withdrawal Flow
// ------------------------------------------------
// Install: npm install razorpay axios react react-dom
// Add Razorpay script in index.html:
//   <script src="https://checkout.razorpay.com/v1/checkout.js"></script>

import { useState, useEffect } from "react";

// ─── CONFIG ───────────────────────────────────────────
const RAZORPAY_KEY_ID = "rzp_test_XXXXXXXXXXXXXXXX"; // apna key yahan daalo
const APP_NAME = "TaskPay";
const APP_LOGO = "https://yourdomain.com/logo.png";

// ─── PLANS ────────────────────────────────────────────
const PLANS = [
  {
    id: "free",
    name: "Free",
    price: 0,
    razorpay_plan_id: null,
    features: ["10 tasks/day", "Basic tasks only", "Withdraw ₹500/week"],
    color: "#8b949e",
  },
  {
    id: "pro",
    name: "Pro",
    price: 99,
    razorpay_plan_id: "plan_XXXXXXXXXXXXXXXX", // Razorpay dashboard se copy karo
    features: [
      "Unlimited tasks/day",
      "Priority + Bonus tasks",
      "Withdraw ₹10,000/week",
      "2x XP boost",
      "Early task access",
    ],
    color: "#3fb950",
  },
  {
    id: "elite",
    name: "Elite",
    price: 249,
    razorpay_plan_id: "plan_YYYYYYYYYYYYYYYY", // Razorpay dashboard se copy karo
    features: [
      "All Pro features",
      "Unlimited withdrawal",
      "High-pay exclusive tasks",
      "5x Referral bonus",
      "Priority support",
    ],
    color: "#d29922",
  },
];

// ─── RAZORPAY HELPER ──────────────────────────────────
function loadRazorpay() {
  return new Promise((resolve) => {
    if (window.Razorpay) return resolve(true);
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

// ─── SUBSCRIPTION PAYMENT ─────────────────────────────
async function handleSubscription(plan, user, onSuccess, onError) {
  if (plan.price === 0) {
    onSuccess({ plan: "free", message: "Free plan activated!" });
    return;
  }

  const loaded = await loadRazorpay();
  if (!loaded) {
    onError("Razorpay load nahi hua. Internet check karo.");
    return;
  }

  // Step 1: Apne backend se subscription create karo
  // POST /api/create-subscription => { subscription_id }
  let subscriptionId;
  try {
    const res = await fetch("/api/create-subscription", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        plan_id: plan.razorpay_plan_id,
        user_id: user.id,
      }),
    });
    const data = await res.json();
    subscriptionId = data.subscription_id;
  } catch (err) {
    onError("Subscription create karne mein error aaya.");
    return;
  }

  // Step 2: Razorpay checkout open karo
  const options = {
    key: RAZORPAY_KEY_ID,
    subscription_id: subscriptionId,
    name: APP_NAME,
    description: `${plan.name} Plan — ₹${plan.price}/month`,
    image: APP_LOGO,
    prefill: {
      name: user.name,
      email: user.email,
      contact: user.phone,
    },
    theme: { color: plan.color },
    handler: function (response) {
      // response.razorpay_payment_id
      // response.razorpay_subscription_id
      // response.razorpay_signature
      verifySubscription(response, plan, onSuccess, onError);
    },
    modal: {
      ondismiss: () => onError("Payment cancel kar diya."),
    },
  };

  const rzp = new window.Razorpay(options);
  rzp.open();
}

// Step 3: Backend pe verify karo
async function verifySubscription(response, plan, onSuccess, onError) {
  try {
    const res = await fetch("/api/verify-subscription", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(response),
    });
    const data = await res.json();
    if (data.verified) {
      onSuccess({ plan: plan.id, message: `${plan.name} plan active ho gaya!` });
    } else {
      onError("Payment verify nahi hua. Support se contact karo.");
    }
  } catch {
    onError("Verification error aaya.");
  }
}

// ─── WITHDRAWAL PAYMENT ───────────────────────────────
async function handleWithdrawal(amount, user, onSuccess, onError) {
  // Razorpay Payout API use karo (razorpayx.com)
  // Yeh backend se hoga — frontend pe private key kabhi mat daalo!
  try {
    const res = await fetch("/api/withdraw", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        amount: amount * 100, // paise mein
        user_id: user.id,
        upi_id: user.upi_id, // user ka UPI
      }),
    });
    const data = await res.json();
    if (data.success) {
      onSuccess(`₹${amount} aapke UPI pe bhej diye gaye!`);
    } else {
      onError(data.message || "Withdrawal failed.");
    }
  } catch {
    onError("Network error. Dobara try karo.");
  }
}

// ─── MAIN COMPONENT ───────────────────────────────────
export default function TaskPayPayments() {
  const [activeTab, setActiveTab] = useState("plans");
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [status, setStatus] = useState(null); // { type: 'success'|'error', msg }
  const [loading, setLoading] = useState(false);

  // Demo user — real app mein auth se aayega
  const user = {
    id: "user_123",
    name: "Rahul Sharma",
    email: "rahul@example.com",
    phone: "9876543210",
    upi_id: "rahul@upi",
    wallet: 1420,
    plan: "free",
  };

  function showStatus(type, msg) {
    setStatus({ type, msg });
    setTimeout(() => setStatus(null), 4000);
  }

  async function onSubscribe(plan) {
    if (plan.price === 0) {
      showStatus("success", "Free plan already active hai!");
      return;
    }
    setLoading(true);
    setSelectedPlan(plan.id);
    await handleSubscription(
      plan,
      user,
      (res) => {
        showStatus("success", res.message);
        setLoading(false);
      },
      (err) => {
        showStatus("error", err);
        setLoading(false);
      }
    );
  }

  async function onWithdraw() {
    const amt = parseFloat(withdrawAmount);
    if (!amt || amt < 100) {
      showStatus("error", "Minimum withdrawal ₹100 hai.");
      return;
    }
    if (amt > user.wallet) {
      showStatus("error", "Wallet mein itne paise nahi hain.");
      return;
    }
    setLoading(true);
    await handleWithdrawal(
      amt,
      user,
      (msg) => {
        showStatus("success", msg);
        setWithdrawAmount("");
        setLoading(false);
      },
      (err) => {
        showStatus("error", err);
        setLoading(false);
      }
    );
  }

  return (
    <div style={{ maxWidth: 400, margin: "0 auto", fontFamily: "sans-serif", padding: 16 }}>
      {/* Header */}
      <div style={{ background: "#0d1117", borderRadius: 16, padding: 16, marginBottom: 16 }}>
        <div style={{ color: "#3fb950", fontSize: 20, fontWeight: 600 }}>
          TASK<span style={{ color: "#e6edf3" }}>PAY</span>
          <span style={{
            marginLeft: 10, background: "#1f6feb22", border: "0.5px solid #1f6feb66",
            color: "#58a6ff", fontSize: 10, padding: "2px 10px", borderRadius: 20
          }}>v2.0</span>
        </div>
        <div style={{ color: "#8b949e", fontSize: 12, marginTop: 6 }}>
          Wallet: <span style={{ color: "#3fb950", fontWeight: 600 }}>₹{user.wallet}</span>
          &nbsp;|&nbsp; Plan: <span style={{ color: "#d29922", textTransform: "capitalize" }}>{user.plan}</span>
        </div>
      </div>

      {/* Status Banner */}
      {status && (
        <div style={{
          background: status.type === "success" ? "#1f3a1f" : "#3a1a1f",
          color: status.type === "success" ? "#3fb950" : "#f85149",
          border: `0.5px solid ${status.type === "success" ? "#3fb95055" : "#f8514955"}`,
          borderRadius: 10, padding: "10px 14px", marginBottom: 12, fontSize: 13
        }}>
          {status.type === "success" ? "✓" : "✗"} {status.msg}
        </div>
      )}

      {/* Tabs */}
      <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
        {["plans", "withdraw"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              flex: 1, padding: "8px 0", borderRadius: 10, border: "none", cursor: "pointer",
              background: activeTab === tab ? "#238636" : "#161b22",
              color: activeTab === tab ? "#fff" : "#8b949e",
              fontWeight: activeTab === tab ? 600 : 400, fontSize: 13,
            }}
          >
            {tab === "plans" ? "💎 Subscription Plans" : "💸 Withdraw"}
          </button>
        ))}
      </div>

      {/* Plans Tab */}
      {activeTab === "plans" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {PLANS.map((plan) => (
            <div key={plan.id} style={{
              background: "#161b22",
              border: `${plan.id === "pro" ? "2px" : "0.5px"} solid ${plan.id === "pro" ? "#3fb950" : "#30363d"}`,
              borderRadius: 14, padding: 14,
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <div style={{ color: plan.color, fontWeight: 600, fontSize: 15 }}>
                    {plan.name === "Elite" ? "💎" : plan.name === "Pro" ? "👑" : "🆓"} {plan.name}
                  </div>
                  {plan.id === "pro" && (
                    <span style={{ background: "#1f3a1f", color: "#3fb950", fontSize: 10, padding: "2px 8px", borderRadius: 20 }}>
                      Most Popular
                    </span>
                  )}
                </div>
                <div style={{ color: plan.color, fontWeight: 700, fontSize: 18 }}>
                  ₹{plan.price}<span style={{ color: "#8b949e", fontSize: 11, fontWeight: 400 }}>/mo</span>
                </div>
              </div>
              <ul style={{ marginTop: 10, paddingLeft: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 4 }}>
                {plan.features.map((f) => (
                  <li key={f} style={{ fontSize: 12, color: "#8b949e" }}>
                    <span style={{ color: "#3fb950" }}>✓ </span>{f}
                  </li>
                ))}
              </ul>
              <button
                onClick={() => onSubscribe(plan)}
                disabled={loading && selectedPlan === plan.id}
                style={{
                  marginTop: 12, width: "100%", padding: "9px 0", borderRadius: 9, border: "none",
                  cursor: "pointer", fontWeight: 600, fontSize: 13,
                  background: plan.price === 0 ? "#21262d" : plan.color === "#d29922" ? "#854f0b" : "#238636",
                  color: plan.price === 0 ? "#8b949e" : "#fff",
                  opacity: loading && selectedPlan === plan.id ? 0.6 : 1,
                }}
              >
                {loading && selectedPlan === plan.id
                  ? "Processing..."
                  : plan.price === 0
                  ? user.plan === "free" ? "Current Plan" : "Downgrade"
                  : `Subscribe — ₹${plan.price}/mo`}
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Withdraw Tab */}
      {activeTab === "withdraw" && (
        <div style={{ background: "#161b22", border: "0.5px solid #30363d", borderRadius: 14, padding: 16 }}>
          <div style={{ color: "#e6edf3", fontWeight: 600, marginBottom: 12 }}>Paise Nikalo</div>
          <div style={{ color: "#8b949e", fontSize: 12, marginBottom: 10 }}>
            Available: <span style={{ color: "#3fb950" }}>₹{user.wallet}</span>
          </div>
          <div style={{ color: "#8b949e", fontSize: 11, marginBottom: 6 }}>UPI ID: {user.upi_id}</div>
          <input
            type="number"
            placeholder="Amount (min ₹100)"
            value={withdrawAmount}
            onChange={(e) => setWithdrawAmount(e.target.value)}
            style={{
              width: "100%", padding: "10px 12px", borderRadius: 9,
              background: "#0d1117", border: "0.5px solid #30363d",
              color: "#e6edf3", fontSize: 14, marginBottom: 12, outline: "none",
            }}
          />
          <div style={{ fontSize: 11, color: "#8b949e", marginBottom: 12 }}>
            ⚡ Instant UPI transfer &nbsp;|&nbsp; 🔒 Secure via RazorpayX
          </div>
          <button
            onClick={onWithdraw}
            disabled={loading}
            style={{
              width: "100%", padding: "10px 0", borderRadius: 9, border: "none",
              background: "#238636", color: "#fff", fontWeight: 600,
              fontSize: 14, cursor: "pointer", opacity: loading ? 0.6 : 1,
            }}
          >
            {loading ? "Processing..." : "Withdraw to UPI"}
          </button>
        </div>
      )}

      {/* Footer */}
      <div style={{ textAlign: "center", color: "#8b949e", fontSize: 11, marginTop: 16 }}>
        🔒 Payments secured by Razorpay &nbsp;|&nbsp; PCI-DSS Compliant
      </div>
    </div>
  );
}

// ─── BACKEND API (Node.js/Express) ────────────────────
/*
// server.js mein yeh routes add karo:

const Razorpay = require('razorpay');
const crypto = require('crypto');

const rzp = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// 1. Subscription create karo
app.post('/api/create-subscription', async (req, res) => {
  const { plan_id, user_id } = req.body;
  const subscription = await rzp.subscriptions.create({
    plan_id,
    customer_notify: 1,
    total_count: 12,
    notes: { user_id },
  });
  res.json({ subscription_id: subscription.id });
});

// 2. Verify karo
app.post('/api/verify-subscription', (req, res) => {
  const { razorpay_payment_id, razorpay_subscription_id, razorpay_signature } = req.body;
  const body = razorpay_payment_id + '|' + razorpay_subscription_id;
  const expected = crypto
    .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
    .update(body)
    .digest('hex');
  res.json({ verified: expected === razorpay_signature });
});

// 3. Withdraw (RazorpayX Payout)
app.post('/api/withdraw', async (req, res) => {
  const { amount, upi_id, user_id } = req.body;
  const payout = await fetch('https://api.razorpay.com/v1/payouts', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Basic ' + Buffer.from(
        process.env.RAZORPAYХ_KEY_ID + ':' + process.env.RAZORPAYX_SECRET
      ).toString('base64'),
    },
    body: JSON.stringify({
      account_number: process.env.RAZORPAYX_ACCOUNT,
      amount,
      currency: 'INR',
      mode: 'UPI',
      purpose: 'payout',
      fund_account: { account_type: 'vpa', vpa: { address: upi_id } },
    }),
  });
  const data = await payout.json();
  res.json({ success: data.status === 'processing' });
});
*/
