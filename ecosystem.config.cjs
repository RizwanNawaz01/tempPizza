// PM2 configuration for better process management
module.exports = {
  apps: [{
    name: 'pizza-app',
    script: '.output/server/index.mjs',
    instances: 1, // Single instance to conserve resources
    exec_mode: 'cluster',
    autorestart: true,
    watch: false,
    max_memory_restart: '500M', // Restart if memory exceeds 500MB
    
    // Environment variables
    env_production: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    
    // Logging
    error_file: 'logs/err.log',
    out_file: 'logs/out.log',
    log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
    merge_logs: true,
    
    // Performance optimization
    max_restarts: 10,
    min_uptime: '10s',
    listen_timeout: 3000,
    kill_timeout: 5000,
    
    // Resource limits
    node_args: [
      '--max-old-space-size=384', // Limit Node.js heap to 384MB
      '--optimize-for-size',
      '--gc-interval=100'
    ]
  }]
}