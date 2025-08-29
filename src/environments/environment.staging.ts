export const environment = {
  production: false,
  API_URL: 'https://staging-api.yevyev.am/',
  
  // Application settings
  appName: 'Yev-Yev',
  appVersion: '1.0.0',
  
  // Feature flags
  enableDebug: true,
  enableLogging: true,
  
  // External services
  googleMapsApiKey: '',
  firebaseConfig: {
    apiKey: '',
    authDomain: '',
    projectId: '',
    storageBucket: '',
    messagingSenderId: '',
    appId: ''
  },
  
  // Timeout settings
  requestTimeout: 30000,
  sessionTimeout: 3600000, // 1 hour
  
  // Pagination
  defaultPageSize: 20,
  maxPageSize: 100
};
