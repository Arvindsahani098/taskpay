# TaskPay v2.0 — Complete Ads Setup Guide
## Google AdMob + Capacitor + React

---

## STEP 1 — AdMob Account Setup (Free)

1. https://admob.google.com par jao
2. Google account se sign in karo
3. "Add App" → Android select karo → App name: "TaskPay"
4. 4 Ad Units banao (har ek ka ID copy karo):
   - Banner Ad      → ca-app-pub-XXXXXXX/XXXXXXX
   - Interstitial   → ca-app-pub-XXXXXXX/XXXXXXX
   - Rewarded Video → ca-app-pub-XXXXXXX/XXXXXXX
   - Native Ad      → ca-app-pub-XXXXXXX/XXXXXXX

---

## STEP 2 — Install Packages

```bash
npm install @capacitor/core @capacitor/android
npm install @capacitor-community/admob
npx cap init TaskPay com.taskpay.app
npx cap add android
```

---

## STEP 3 — capacitor.config.ts

```typescript
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.taskpay.app',
  appName: 'TaskPay',
  webDir: 'build',
  plugins: {
    AdMob: {
      appId: {
        android: 'ca-app-pub-XXXXXXXXXXXXXXXX~XXXXXXXXXX', // apna App ID
      },
      initializeForTesting: false, // production mein false rakho
    },
  },
};
export default config;
```

---

## STEP 4 — android/app/src/main/AndroidManifest.xml mein add karo

```xml
<manifest>
  <application>
    <!-- AdMob App ID -->
    <meta-data
      android:name="com.google.android.gms.ads.APPLICATION_ID"
      android:value="ca-app-pub-XXXXXXXXXXXXXXXX~XXXXXXXXXX"/>
  </application>

  <!-- Internet permission -->
  <uses-permission android:name="android.permission.INTERNET"/>
  <uses-permission android:name="android.permission.ACCESS_NETWORK_STATE"/>
</manifest>
```

---

## STEP 5 — useAdMob.js (React Hook)

```javascript
import { useEffect } from 'react';
import { AdMob, BannerAdSize, BannerAdPosition } from '@capacitor-community/admob';

// Ad Unit IDs — apne IDs se replace karo
const AD_IDS = {
  banner:       'ca-app-pub-XXXXXXX/XXXXXXX',
  interstitial: 'ca-app-pub-XXXXXXX/XXXXXXX',
  rewarded:     'ca-app-pub-XXXXXXX/XXXXXXX',
};

// Test IDs (development ke time use karo)
const TEST_IDS = {
  banner:       'ca-app-pub-3940256099942544/6300978111',
  interstitial: 'ca-app-pub-3940256099942544/1033173712',
  rewarded:     'ca-app-pub-3940256099942544/5224354917',
};

const IS_DEV = process.env.NODE_ENV === 'development';
const IDS = IS_DEV ? TEST_IDS : AD_IDS;

export function useAdMob() {

  // Initialize AdMob
  useEffect(() => {
    AdMob.initialize({
      requestTrackingAuthorization: true,
      testingDevices: IS_DEV ? ['YOUR_DEVICE_ID'] : [],
      initializeForTesting: IS_DEV,
    });
  }, []);

  // 1. BANNER AD — bottom pe fixed
  async function showBanner() {
    await AdMob.showBanner({
      adId: IDS.banner,
      adSize: BannerAdSize.BANNER,
      position: BannerAdPosition.BOTTOM_CENTER,
      margin: 0,
    });
  }

  async function hideBanner() {
    await AdMob.hideBanner();
  }

  // 2. INTERSTITIAL AD — task complete hone ke baad
  async function showInterstitial() {
    await AdMob.prepareInterstitial({ adId: IDS.interstitial });
    await AdMob.showInterstitial();
  }

  // 3. REWARDED VIDEO AD — user coins ke liye dekhta hai
  async function showRewardedAd(onRewarded) {
    await AdMob.prepareRewardVideoAd({ adId: IDS.rewarded });

    // Reward event listen karo
    AdMob.addListener('onRewardedVideoAdReward', (reward) => {
      // reward.type = 'coins', reward.amount = 10
      onRewarded(reward);
    });

    await AdMob.showRewardVideoAd();
  }

  return { showBanner, hideBanner, showInterstitial, showRewardedAd };
}
```

---

## STEP 6 — App.jsx mein use karo

```jsx
import { useAdMob } from './useAdMob';
import { Capacitor } from '@capacitor/core';

export default function App() {
  const { showBanner, hideBanner, showInterstitial, showRewardedAd } = useAdMob();
  const isNative = Capacitor.isNativePlatform();
  const userPlan = 'free'; // auth se aayega

  // Free users ko banner dikhao
  useEffect(() => {
    if (isNative && userPlan === 'free') {
      showBanner();
    }
    return () => hideBanner();
  }, [userPlan]);

  // Task complete hone ke baad interstitial
  async function handleTaskComplete(task) {
    // Task reward do
    addToWallet(task.reward);

    // Har 3rd task ke baad interstitial
    if (isNative && taskCount % 3 === 0 && userPlan === 'free') {
      await showInterstitial();
    }
  }

  // User "2x Coins" button dabata hai
  async function handleWatchAd() {
    if (!isNative) {
      alert('Ads sirf app mein chalte hain!');
      return;
    }
    await showRewardedAd((reward) => {
      // User ne ad dekha, reward do
      addToWallet(reward.amount * 2); // 2x coins
      showToast(`+₹${reward.amount * 2} bonus mil gaya!`);
    });
  }

  return (
    <div>
      {/* Normal app content */}

      {/* Watch Ad button — free users ke liye */}
      {userPlan === 'free' && (
        <button onClick={handleWatchAd} style={{
          background: '#1f6feb', color: '#fff',
          padding: '10px 20px', borderRadius: 10, border: 'none'
        }}>
          Watch Ad → 2x Coins
        </button>
      )}
    </div>
  );
}
```

---

## STEP 7 — Native Ad (Task-style) — sabse smart trick

```jsx
// NativeAdTask.jsx — Ad ko task jaisa dikhao
export function NativeAdTask({ adData }) {
  return (
    <div style={{
      background: '#161b22',
      border: '0.5px solid #30363d',
      borderRadius: 12, padding: 12,
      position: 'relative'
    }}>
      {/* Sponsored badge */}
      <span style={{
        position: 'absolute', top: 8, right: 8,
        background: '#1f6feb22', color: '#58a6ff',
        fontSize: 9, padding: '1px 6px', borderRadius: 20
      }}>Sponsored</span>

      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <div style={{ fontSize: 12, fontWeight: 500, color: '#e6edf3' }}>
          {adData.headline}  {/* "Swiggy ka naya app try karo" */}
        </div>
        <div style={{ fontSize: 12, color: '#3fb950' }}>+₹10</div>
      </div>
      <div style={{ fontSize: 11, color: '#8b949e', marginTop: 4 }}>
        {adData.body}
      </div>
      <button style={{
        marginTop: 8, background: '#238636', color: '#fff',
        border: 'none', borderRadius: 8, padding: '5px 14px',
        fontSize: 11, cursor: 'pointer'
      }}>
        Complete Task
      </button>
    </div>
  );
}
```

---

## STEP 8 — APK Build karo

```bash
# React build karo
npm run build

# Android mein copy karo
npx cap copy android
npx cap sync android

# Android Studio open karo
npx cap open android

# Android Studio mein:
# Build → Generate Signed Bundle/APK → APK → Create keystore → Build
```

---

## Revenue Estimate (1000 daily active users)

| Ad Type        | Daily Views | CPM (India) | Daily Revenue |
|----------------|-------------|-------------|---------------|
| Banner         | 3,000       | ₹40         | ₹120          |
| Interstitial   | 1,500       | ₹80         | ₹120          |
| Rewarded Video | 800         | ₹150        | ₹120          |
| Native Ad      | 500         | ₹100        | ₹50           |
| **Total/day**  |             |             | **₹410**      |
| **Total/month**|             |             | **₹12,300**   |

---

## Important Notes

1. AdMob policy: Fake clicks ya impressions mat banao — account ban ho jaata hai
2. Test mode mein test IDs use karo, real IDs sirf production mein
3. Pro users ko banner/interstitial mat dikhao — sirf rewarded (opt-in) allowed
4. Play Store publish ke baad 24-48 hrs mein AdMob activate hota hai
5. GDPR/consent — India mein abhi required nahi, but UMP SDK laga lo future ke liye

---

## Free Tools Summary

| Tool           | Cost    | Kaam          |
|----------------|---------|---------------|
| AdMob          | Free    | Ads serve     |
| Capacitor      | Free    | APK build     |
| Supabase       | Free    | Database      |
| Razorpay       | Free*   | Payments      |
| Vercel         | Free    | Web hosting   |
| Firebase FCM   | Free    | Notifications |
| Play Store     | ₹1,700  | One-time only |

*Razorpay 2% transaction fee leta hai per payment
