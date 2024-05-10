const appName = process.env.PROJECT_NAME || 'BudhApp';
const uid = process.env.PROJECT_UNIQUE_ID || 'budhapp-default';

module.exports = {
   experiments: { baseUrl: "/coinb" },
   name: appName,
   slug: appName,
   version: '1.0.0',
   orientation: 'portrait',
   icon: './assets/icon.png',
   userInterfaceStyle: 'light',
   splash: {
      image: './assets/splash.png',
      resizeMode: 'contain',
      backgroundColor: '#ffffff',
   },
   assetBundlePatterns: ['**/*'],
   ios: {
      bundleIdentifier: appName + '-' + uid,
      supportsTablet: true,
   },
   android: {
      package: appName + '-' + uid,
      adaptiveIcon: {
         foregroundImage: './assets/adaptive-icon.png',
         backgroundColor: '#ffffff',
      },
   },
   web: {
      "ouptut": "single",
      "bundler": "metro",
      favicon: './assets/favicon.png',
   },
   packagerOpts: {
      config: "./metro.config.js"
   },
   extra: {
      projectId: uid,
   },
};
