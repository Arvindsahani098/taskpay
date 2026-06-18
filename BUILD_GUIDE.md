# TaskPay v2.0 — APK Build Guide
## Apne PC pe yeh steps follow karo

---

## REQUIREMENTS (ek baar install karo)

1. Node.js — https://nodejs.org (LTS version)
2. Android Studio — https://developer.android.com/studio
   - Install karte waqt "Android SDK" checkbox zaroor tick karo
3. Java JDK 17 — Android Studio ke saath automatically aata hai

---

## STEP 1 — Project Setup

```bash
# Project folder mein jao
cd taskpay

# Dependencies install karo
npm install

# Capacitor Android add karo
npx cap add android
```

---

## STEP 2 — AdMob Setup (Zaroori!)

1. https://admob.google.com pe account banao
2. App add karo → Android → "TaskPay"
3. 3 Ad Units banao: Banner, Interstitial, Rewarded
4. `src/hooks/useAdMob.js` mein apne IDs daalo:
   ```js
   const PROD_IDS = {
     banner:       'ca-app-pub-XXXXXXXX/XXXXXXXX',
     interstitial: 'ca-app-pub-XXXXXXXX/XXXXXXXX',
     rewarded:     'ca-app-pub-XXXXXXXX/XXXXXXXX',
   };
   ```
5. `capacitor.config.ts` mein App ID daalo:
   ```ts
   android: 'ca-app-pub-XXXXXXXXXXXXXXXX~XXXXXXXXXX'
   ```

---

## STEP 3 — Razorpay Setup

1. https://razorpay.com pe account banao (free)
2. Settings → API Keys → Test Key ID copy karo
3. `src/pages/Plans.jsx` mein daalo:
   ```js
   key: 'rzp_test_XXXXXXXXXXXXXXXX'
   ```

---

## STEP 4 — AndroidManifest.xml Update

File: `android/app/src/main/AndroidManifest.xml`

`<application>` tag ke andar yeh add karo:
```xml
<meta-data
  android:name="com.google.android.gms.ads.APPLICATION_ID"
  android:value="ca-app-pub-XXXXXXXXXXXXXXXX~XXXXXXXXXX"/>
```

---

## STEP 5 — APK Build (Debug — testing ke liye)

```bash
# React build karo
npm run build

# Android mein sync karo
npx cap sync android

# Debug APK banao (testing ke liye)
cd android
./gradlew assembleDebug

# APK yahan milega:
# android/app/build/outputs/apk/debug/app-debug.apk
```

---

## STEP 6 — Release APK (Play Store ke liye)

```bash
# Android Studio kholo
npx cap open android

# Android Studio mein:
# Build menu → Generate Signed Bundle / APK
# → APK select karo
# → Create new keystore (ek baar):
#     Key store path: taskpay-release.jks
#     Password: apna strong password
#     Alias: taskpay-key
# → Next → Release → Finish

# Release APK yahan milega:
# android/app/build/outputs/apk/release/app-release.apk
```

---

## STEP 7 — APK Install karo (testing)

```bash
# USB se phone connect karo, Developer Mode on karo
adb install android/app/build/outputs/apk/debug/app-debug.apk

# Ya seedha phone pe bhejo aur install karo
```

---

## STEP 8 — Play Store Upload

1. https://play.google.com/console → $25 one-time fee
2. Create App → Fill details
3. Release → Production → Upload Release APK/AAB
4. Content rating fill karo
5. Review ke baad 3-7 din mein live hoga

---

## QUICK BUILD SCRIPT (Windows)

```batch
@echo off
echo Building TaskPay APK...
call npm run build
call npx cap sync android
cd android
call gradlew.bat assembleDebug
echo APK ready: android\app\build\outputs\apk\debug\app-debug.apk
pause
```
Save as `build-apk.bat` and double-click!

---

## QUICK BUILD SCRIPT (Mac/Linux)

```bash
#!/bin/bash
echo "Building TaskPay APK..."
npm run build
npx cap sync android
cd android
./gradlew assembleDebug
echo "APK ready: android/app/build/outputs/apk/debug/app-debug.apk"
```
Save as `build-apk.sh`, then: `chmod +x build-apk.sh && ./build-apk.sh`

---

## Troubleshooting

| Error | Fix |
|-------|-----|
| `JAVA_HOME not set` | Android Studio → Settings → JDK path copy karo, env variable set karo |
| `SDK not found` | Android Studio → SDK Manager → Android 13 install karo |
| `Gradle failed` | `cd android && ./gradlew clean` phir dobara try karo |
| `AdMob not showing` | Test IDs use karo, real IDs sirf published app mein kaam karte hain |

---

## File Structure

```
taskpay/
├── src/
│   ├── App.jsx              ← Main app + routing
│   ├── App.css              ← Dark theme CSS
│   ├── index.js             ← Entry point
│   ├── hooks/
│   │   └── useAdMob.js      ← AdMob integration
│   ├── components/
│   │   ├── BottomNav.jsx    ← Navigation bar
│   │   └── AdBanner.jsx     ← Banner ad
│   └── pages/
│       ├── Home.jsx         ← Dashboard + tasks
│       ├── Tasks.jsx        ← All tasks list
│       ├── Wallet.jsx       ← Earnings + withdraw
│       ├── Plans.jsx        ← Subscription plans
│       └── Profile.jsx      ← User profile
├── public/
│   └── index.html
├── capacitor.config.ts      ← Capacitor + AdMob config
├── package.json
└── BUILD_GUIDE.md           ← Yeh file
```
