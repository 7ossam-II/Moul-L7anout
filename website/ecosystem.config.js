module.exports = {
  apps: [
    {
      name: 'moul7anout-website',
      script: '.next/standalone/server.js',
      cwd: './',
      instances: 'max',
      exec_mode: 'cluster',
      watch: false,
      max_memory_restart: '500M',
      env: {
        NODE_ENV: 'production',
        PORT: 3000,
        HOSTNAME: '127.0.0.1',
      },
      error_file: '/var/log/pm2/moul7anout-website-error.log',
      out_file: '/var/log/pm2/moul7anout-website-out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      merge_logs: true,
      time: true,
    },
  ],
};
