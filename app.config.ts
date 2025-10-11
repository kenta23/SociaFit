import { ConfigContext, ExpoConfig } from 'expo/config';

export default ({ config }: ConfigContext): ExpoConfig => ({
  name: "SociaFit",
  slug: "sociafit",
  version: "1.0.0",
  orientation: "portrait",
  icon: "./assets/images/logo_icon.png",
  scheme: "sociafit",
  userInterfaceStyle: "automatic",
  newArchEnabled: true,
  ios: {
    supportsTablet: true
  },
  android: {
    intentFilters: [
      { 
         "action": "VIEW",
         "autoVerify": true,
         "data": [
           {
            "scheme": "https",
            "host": "*.webapp.io",
            "pathPrefix": "/sociafit"
           }
         ],
         "category": ["BROWSABLE", "DEFAULT"]
      }
    ],
    package: "com.sociafit.app",
    newArchEnabled: true,
    adaptiveIcon: {
      foregroundImage: "./assets/images/logo_icon.png"
    },
    edgeToEdgeEnabled: true
  },
  web: {
    bundler: "metro",
    output: "static",
    favicon: "./assets/images/logo.png"
  },
  plugins: [
    "expo-router",
    "expo-sensors",
    [
      "expo-camera",
      {
        "cameraPermission": "Allow $(PRODUCT_NAME) to access your camera",
      }
    ],
    [
      "expo-location",
      {
        locationAlwaysAndWhenInUsePermission: "Allow $(PRODUCT_NAME) to use your location."
      }
    ],
    [
      "expo-splash-screen",
      {
        image: "./assets/images/logo.png",
        width: 200,
        resizeMode: "contain"
      }
    ],
    "expo-font",
    [
      "expo-build-properties",
      {
        ios: {
          useFrameworks: "static"
        },
        android: {
          compileSdkVersion: 36,
          targetSdkVersion: 36,
          minSdkVersion: 26,
          permissions: [
            "android.permission.health.READ_HEART_RATE",
            "android.permission.health.WRITE_HEART_RATE",
            "android.permission.health.READ_STEPS",
            "android.permission.health.WRITE_STEPS",
            "android.permission.health.READ_ACTIVE_CALORIES_BURNED",
            "android.permission.health.READ_DISTANCE",
            "android.permission.health.WRITE_DISTANCE",
            "android.permission.health.WRITE_ACTIVE_CALORIES_BURNED"
          ]
        }
      }
    ],
    "expo-web-browser",
    "expo-health-connect",
    [
      "react-native-maps",
      {
        androidGoogleMapsApiKey: process.env.GOOGLE_MAPS_API_KEY
      }
    ],
    [
      "expo-image-picker",
      { photosPermission: "Allow $(PRODUCT_NAME) to access your photos." }
    ],
  ],
  experiments: {
    typedRoutes: true
  },
  
  extra: {
    router: {},
    eas: {
      projectId: "1af13048-3fe8-43fb-958a-95ff7b5323b4"
    }
  },
  owner: "drey_rm23"
});
