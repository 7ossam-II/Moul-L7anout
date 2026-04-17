export const env = {
  API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api',
  WS_URL: process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:5000',
  USE_MOCK: process.env.NEXT_PUBLIC_USE_MOCK === 'true',
  APP_ENV: process.env.NEXT_PUBLIC_APP_ENV || 'development',
} as const;