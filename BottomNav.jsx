import { useNavigate, useLocation } from 'react-router-dom';

const NAV = [
  { path: '/',        icon: '⊞', label: 'Home'    },
  { path: '/tasks',   icon: '✓', label: 'Tasks'   },
  { path: '/wallet',  icon: '₹', label: 'Wallet'  },
  { path: '/plans',   icon: '👑', label: 'Plans'   },
  { path: '/profile', icon: '◉', label: 'Profile' },
];

export default function BottomNav() {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  return (
    <div style={{
      position: 'fixed', bottom: 0, left: '50%', transform: 'translateX(-50%)',
      width: '100%', maxWidth: 420,
      background: '#0d1117', borderTop: '0.5px solid #21262d',
      display: 'flex', justifyContent: 'space-around',
      padding: '8px 0 12px', zIndex: 20,
    }}>
      {NAV.map(n => (
        <button key={n.path} onClick={() => navigate(n.path)} style={{
          background: 'none', border: 'none', cursor: 'pointer',
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2,
        }}>
          <span style={{ fontSize: 18, color: pathname === n.path ? '#3fb950' : '#8b949e' }}>
            {n.icon}
          </span>
          <span style={{ fontSize: 9, color: pathname === n.path ? '#3fb950' : '#8b949e', fontWeight: pathname === n.path ? 600 : 400 }}>
            {n.label}
          </span>
        </button>
      ))}
    </div>
  );
}
