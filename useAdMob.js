import { useEffect, useCallback } from 'react';
import { Capacitor } from '@capacitor/core';

// Test Ad IDs (Google official test IDs)
const TEST_IDS = {
  banner:       'ca-app-pub-3940256099942544/6300978111',
  interstitial: 'ca-app-pub-3940256099942544/1033173712',
  rewarded:     'ca-app-pub-3940256099942544/5224354917',
};

// Apne production IDs yahan daalo
const PROD_IDS = {
  banner:       'ca-app-pub-XXXXXXXXXXXXXXXX/XXXXXXXXXX',
  interstitial: 'ca-app-pub-XXXXXXXXXXXXXXXX/XXXXXXXXXX',
  rewarded:     'ca-app-pub-XXXXXXXXXXXXXXXX/XXXXXXXXXX',
};

const IDS = process.env.NODE_ENV === 'development' ? TEST_IDS : PROD_IDS;
const isNative = Capacitor.isNativePlatform();

export function useAdMob() {

  useEffect(() => {
    if (!isNative) return;
    async function init() {
      try {
        const { AdMob } = await import('@capacitor-community/admob');
        await AdMob.initialize({ initializeForTesting: process.env.NODE_ENV === 'development' });
      } catch (e) { console.log('AdMob init error:', e); }
    }
    init();
  }, []);

  const showBanner = useCallback(async () => {
    if (!isNative) return;
    try {
      const { AdMob, BannerAdSize, BannerAdPosition } = await import('@capacitor-community/admob');
      await AdMob.showBanner({
        adId: IDS.banner,
        adSize: BannerAdSize.BANNER,
        position: BannerAdPosition.BOTTOM_CENTER,
        margin: 60, // bottom nav height ke upar
      });
    } catch (e) { console.log('Banner error:', e); }
  }, []);

  const hideBanner = useCallback(async () => {
    if (!isNative) return;
    try {
      const { AdMob } = await import('@capacitor-community/admob');
      await AdMob.hideBanner();
    } catch (e) {}
  }, []);

  const showInterstitial = useCallback(async () => {
    if (!isNative) return false;
    try {
      const { AdMob } = await import('@capacitor-community/admob');
      await AdMob.prepareInterstitial({ adId: IDS.interstitial });
      await AdMob.showInterstitial();
      return true;
    } catch (e) { console.log('Interstitial error:', e); return false; }
  }, []);

  const showRewarded = useCallback(async (onRewarded) => {
    if (!isNative) {
      // Web fallback — simulate reward
      onRewarded({ type: 'coins', amount: 10 });
      return;
    }
    try {
      const { AdMob } = await import('@capacitor-community/admob');
      await AdMob.prepareRewardVideoAd({ adId: IDS.rewarded });
      const listener = await AdMob.addListener('onRewardedVideoAdReward', (reward) => {
        onRewarded(reward);
        listener.remove();
      });
      await AdMob.showRewardVideoAd();
    } catch (e) { console.log('Rewarded error:', e); }
  }, []);

  return { showBanner, hideBanner, showInterstitial, showRewarded };
}
