import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.taskpay.app',
  appName: 'TaskPay',
  webDir: 'build',
  server: {
    androidScheme: 'https'
  },
  plugins: {
    AdMob: {
      appId: {
        android: 'ca-app-pub-3940256099942544~3347511713', // TEST ID - apna daalo
      },
      initializeForTesting: true,
    },
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: '#0d1117',
      showSpinner: false,
    },
    StatusBar: {
      style: 'dark',
      backgroundColor: '#0d1117',
    },
  },
};

export default config;
