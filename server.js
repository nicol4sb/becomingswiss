const express = require('express');
const path = require('path');
const morgan = require('morgan');
const winston = require('winston');
const fs = require('fs');
const analytics = require('./analytics');

const app = express();
const PORT = process.env.PORT || 6000;

// Create logs directory if it doesn't exist
if (!fs.existsSync('logs')) {
  fs.mkdirSync('logs');
}

// Configure Winston logger for structured logs
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    // Log errors to separate file
    new winston.transports.File({ 
      filename: 'logs/error.log', 
      level: 'error' 
    }),
    // Log everything to combined file
    new winston.transports.File({ 
      filename: 'logs/combined.log' 
    }),
    // Also log to console for development
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      )
    })
  ]
});

// Load existing analytics data
analytics.loadAnalyticsData(logger);

// Analytics middleware (should be before morgan)
app.use(analytics.createAnalyticsMiddleware(logger));

// Morgan middleware for HTTP request logging
// This creates Apache-style access logs
app.use(morgan('combined', {
  stream: {
    write: (message) => {
      // Log to Winston
      logger.info(message.trim());
      // Also write to access.log for easy grepping
      fs.appendFileSync('logs/access.log', message);
    }
  }
}));

// Health check endpoint
app.get('/api/health', (req, res) => {
  logger.info('Health check requested', { 
    ip: req.ip, 
    userAgent: req.get('User-Agent') 
  });
  res.json({ 
    status: 'healthy', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Analytics endpoint
app.get('/api/analytics', (req, res) => {
  try {
    const response = analytics.generateAnalyticsResponse(logger);
    res.json(response);
  } catch (error) {
    logger.error('Error generating analytics:', error);
    res.status(500).json({ error: 'Failed to generate analytics' });
  }
});

// Serve the static files from the React app
app.use(express.static(path.join(__dirname, 'build')));

// Handle React routing, return all requests to React app
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
  logger.error('Unhandled error', {
    error: err.message,
    stack: err.stack,
    url: req.url,
    method: req.method,
    ip: req.ip,
    userAgent: req.get('User-Agent')
  });
  
  res.status(500).json({ 
    error: 'Internal Server Error',
    timestamp: new Date().toISOString()
  });
});

// Save analytics data on server shutdown
process.on('SIGINT', () => {
  logger.info('Saving analytics data before shutdown...');
  analytics.saveAnalyticsData(logger);
  process.exit(0);
});

process.on('SIGTERM', () => {
  logger.info('Saving analytics data before shutdown...');
  analytics.saveAnalyticsData(logger);
  process.exit(0);
});

app.listen(PORT, () => {
  logger.info(`Server started on port ${PORT}`);
  console.log(`🚀 Server is running on port ${PORT}`);
  console.log(`�� Logs are being written to the 'logs' directory`);
  console.log(`💚 Health check: http://localhost:${PORT}/api/health`);
  console.log(`📊 Analytics: http://localhost:${PORT}/api/analytics`);
});
