/**
 * Sevalla deployment configuration
 */
module.exports = {
  name: 'saas-chatbot-backend',
  type: 'node',
  entrypoint: 'server/index.js',
  buildCommand: 'npm run build',
  env: {
    NODE_ENV: 'production',
    PORT: '3002',
    // These will be set in the Sevalla dashboard
    // DEFAULT_API_KEY: process.env.DEFAULT_API_KEY,
    // NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
    // NEXT_PUBLIC_AUTH0_DOMAIN: process.env.NEXT_PUBLIC_AUTH0_DOMAIN,
    // NEXT_PUBLIC_AUTH0_CLIENT_ID: process.env.NEXT_PUBLIC_AUTH0_CLIENT_ID,
    // NEXT_PUBLIC_AUTH0_AUDIENCE: process.env.NEXT_PUBLIC_AUTH0_AUDIENCE
  },
  // Ensure database persistence
  volumes: [
    {
      name: 'data',
      mountPath: '/app/data'
    }
  ],
  healthCheck: {
    path: '/api/health',
    initialDelaySeconds: 10,
    periodSeconds: 30
  }
};
