/**
 * Environment Variables Configuration
 * Load TikTok Shop API credentials from environment variables
 */

export const config = {
  // TikTok Partner API credentials
  partnerAppKey: import.meta.env.VITE_PARTNER_APP_KEY || '',
  partnerAppSecret: import.meta.env.VITE_PARTNER_APP_SECRET || '',
  
  // TikTok Business API credentials  
  businessAppKey: import.meta.env.VITE_BUSINESS_APP_KEY || '',
  businessAppSecret: import.meta.env.VITE_BUSINESS_APP_SECRET || '',
  
  // API Base URLs
  partnerApiUrl: 'https://business-api.tiktok.com/open_api/v1.3',
  businessApiUrl: 'https://business-api.tiktok.com/open_api/v1.3',
  
  // Development settings
  isDevelopment: import.meta.env.DEV,
  isProduction: import.meta.env.PROD,
};

// Validate required environment variables
export const validateConfig = () => {
  const required = [
    'partnerAppKey',
    'partnerAppSecret', 
    'businessAppKey',
    'businessAppSecret'
  ];
  
  const missing = required.filter(key => !config[key as keyof typeof config]);
  
  if (missing.length > 0) {
    console.warn('Missing environment variables:', missing);
    console.warn('Please check your .env file');
  }
  
  return missing.length === 0;
};

// Export for easy access
export default config;
