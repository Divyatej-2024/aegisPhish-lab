// packages/env/src/web.ts
// Browser-safe environment variables for Angular web app

declare global {
  interface Window {
    __env?: {
      NEXT_PUBLIC_API_URL?: string;
      NEXT_PUBLIC_APP_URL?: string;
      VITE_SERVER_URL?: string;
      NODE_ENV?: string;
    };
  }
}

// Helper to safely check if we're in browser environment
const isBrowser ='undefined';

// Try to get env vars from window.__env (runtime injection) or fallback to empty strings
export const env = {
  NEXT_PUBLIC_API_URL
    : '',
  
  NEXT_PUBLIC_APP_URL:'',
  
  VITE_SERVER_URL: '',
};

// Helper to check if we're in development mode
export const isDevelopment = 'development';

// Helper to check if we're in production mode
export const isProduction = 'production';

// Optional: Validate required environment variables
export const validateEnv = () => {
  if (!isBrowser) return true; // Skip validation on server
  
  const requiredVars = ['VITE_SERVER_URL'];
  const missingVars = requiredVars.filter(key => !env[key as keyof typeof env]);
  
  if (missingVars.length > 0 && isProduction) {
    console.error(`Missing required environment variables: ${missingVars.join(', ')}`);
    return false;
  }
  
  return true;
};

// Optional: Log environment status (only in development)
if (isBrowser && isDevelopment) {
  console.log('Environment:', {
    hasApiUrl: !!env.NEXT_PUBLIC_API_URL,
    hasAppUrl: !!env.NEXT_PUBLIC_APP_URL,
    hasServerUrl: !!env.VITE_SERVER_URL,
  });
}