import { useEffect } from 'react';
import { useAdMob } from '../hooks/useAdMob';

export default function AdBanner() {
  const { showBanner, hideBanner } = useAdMob();

  useEffect(() => {
    showBanner();
    return () => hideBanner();
  }, []);

  // Native mein AdMob khud render karta hai
  // Web pe placeholder dikhao
  return (
    <div style={{
      position: 'fixed', bottom: 60, left: 0, right: 0,
      height: 50, background: '#1a1f2e',
      borderTop: '0.5px solid #21262d',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: 11, color: '#8b949e', zIndex: 5,
    }}>
      Advertisement • Upgrade to Pro to remove ads
    </div>
  );
}
