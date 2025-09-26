const fs = require('fs');
const winston = require('winston');

// Analytics data storage
const ANALYTICS_FILE = 'analytics.json';
const DAILY_ANALYTICS_FILE = 'daily-analytics.json';

// Initialize analytics data structure
let analyticsData = {
  totalRequests: 0,
  uniqueIPs: new Set(),
  browsers: {},
  operatingSystems: {},
  referrers: {},
  pages: {},
  hourlyStats: {},
  dailyStats: {},
  lastUpdated: new Date().toISOString()
};

let dailyAnalytics = {};

// Load existing analytics data
function loadAnalyticsData(logger) {
  try {
    if (fs.existsSync(ANALYTICS_FILE)) {
      const data = JSON.parse(fs.readFileSync(ANALYTICS_FILE, 'utf8'));
      analyticsData = {
        ...data,
        uniqueIPs: new Set(data.uniqueIPs || [])
      };
      if (logger) logger.info('Analytics data loaded from file');
    }
  } catch (error) {
    if (logger) logger.error('Error loading analytics data:', error);
  }

  try {
    if (fs.existsSync(DAILY_ANALYTICS_FILE)) {
      dailyAnalytics = JSON.parse(fs.readFileSync(DAILY_ANALYTICS_FILE, 'utf8'));
      if (logger) logger.info('Daily analytics data loaded from file');
    }
  } catch (error) {
    if (logger) logger.error('Error loading daily analytics data:', error);
  }
}

// Save analytics data to file
function saveAnalyticsData(logger) {
  try {
    const dataToSave = {
      ...analyticsData,
      uniqueIPs: Array.from(analyticsData.uniqueIPs)
    };
    fs.writeFileSync(ANALYTICS_FILE, JSON.stringify(dataToSave, null, 2));
    fs.writeFileSync(DAILY_ANALYTICS_FILE, JSON.stringify(dailyAnalytics, null, 2));
  } catch (error) {
    if (logger) logger.error('Error saving analytics data:', error);
  }
}

// Parse user agent to extract browser and OS info
function parseUserAgent(userAgent) {
  const browser = {
    name: 'Unknown',
    version: 'Unknown'
  };
  const os = {
    name: 'Unknown',
    version: 'Unknown'
  };

  if (userAgent.includes('Chrome')) {
    browser.name = 'Chrome';
    const match = userAgent.match(/Chrome\/(\d+\.\d+)/);
    if (match) browser.version = match[1];
  } else if (userAgent.includes('Firefox')) {
    browser.name = 'Firefox';
    const match = userAgent.match(/Firefox\/(\d+\.\d+)/);
    if (match) browser.version = match[1];
  } else if (userAgent.includes('Safari') && !userAgent.includes('Chrome')) {
    browser.name = 'Safari';
    const match = userAgent.match(/Version\/(\d+\.\d+)/);
    if (match) browser.version = match[1];
  } else if (userAgent.includes('Edge')) {
    browser.name = 'Edge';
    const match = userAgent.match(/Edge\/(\d+\.\d+)/);
    if (match) browser.version = match[1];
  }

  if (userAgent.includes('Windows')) {
    os.name = 'Windows';
    if (userAgent.includes('Windows NT 10.0')) os.version = '10';
    else if (userAgent.includes('Windows NT 6.3')) os.version = '8.1';
    else if (userAgent.includes('Windows NT 6.1')) os.version = '7';
  } else if (userAgent.includes('Mac OS X')) {
    os.name = 'macOS';
    const match = userAgent.match(/Mac OS X (\d+[._]\d+)/);
    if (match) os.version = match[1].replace('_', '.');
  } else if (userAgent.includes('Linux')) {
    os.name = 'Linux';
  } else if (userAgent.includes('Android')) {
    os.name = 'Android';
    const match = userAgent.match(/Android (\d+\.\d+)/);
    if (match) os.version = match[1];
  } else if (userAgent.includes('iOS')) {
    os.name = 'iOS';
    const match = userAgent.match(/OS (\d+[._]\d+)/);
    if (match) os.version = match[1].replace('_', '.');
  }

  return { browser, os };
}

// Analytics tracking middleware
function createAnalyticsMiddleware(logger) {
  return function analyticsMiddleware(req, res, next) {
    const now = new Date();
    const hour = now.getHours();
    const date = now.toISOString().split('T')[0];
    const userAgent = req.get('User-Agent') || 'Unknown';
    const ip = req.ip || req.connection.remoteAddress || 'Unknown';
    const referrer = req.get('Referer') || 'Direct';
    const page = req.path;

    // Parse user agent
    const { browser, os } = parseUserAgent(userAgent);
    const browserKey = `${browser.name} ${browser.version}`;
    const osKey = `${os.name} ${os.version}`;

    // Update analytics data
    analyticsData.totalRequests++;
    analyticsData.uniqueIPs.add(ip);
    analyticsData.lastUpdated = now.toISOString();

    // Browser stats
    analyticsData.browsers[browserKey] = (analyticsData.browsers[browserKey] || 0) + 1;

    // OS stats
    analyticsData.operatingSystems[osKey] = (analyticsData.operatingSystems[osKey] || 0) + 1;

    // Referrer stats
    analyticsData.referrers[referrer] = (analyticsData.referrers[referrer] || 0) + 1;

    // Page stats
    analyticsData.pages[page] = (analyticsData.pages[page] || 0) + 1;

    // Hourly stats
    if (!analyticsData.hourlyStats[hour]) {
      analyticsData.hourlyStats[hour] = 0;
    }
    analyticsData.hourlyStats[hour]++;

    // Daily stats
    if (!analyticsData.dailyStats[date]) {
      analyticsData.dailyStats[date] = 0;
    }
    analyticsData.dailyStats[date]++;

    // Daily detailed analytics
    if (!dailyAnalytics[date]) {
      dailyAnalytics[date] = {
        totalRequests: 0,
        uniqueIPs: new Set(),
        browsers: {},
        operatingSystems: {},
        pages: {},
        hourlyStats: {}
      };
    }

    dailyAnalytics[date].totalRequests++;
    dailyAnalytics[date].uniqueIPs.add(ip);
    dailyAnalytics[date].browsers[browserKey] = (dailyAnalytics[date].browsers[browserKey] || 0) + 1;
    dailyAnalytics[date].operatingSystems[osKey] = (dailyAnalytics[date].operatingSystems[osKey] || 0) + 1;
    dailyAnalytics[date].pages[page] = (dailyAnalytics[date].pages[page] || 0) + 1;
    dailyAnalytics[date].hourlyStats[hour] = (dailyAnalytics[date].hourlyStats[hour] || 0) + 1;

    // Save data every 10 requests to avoid too frequent file writes
    if (analyticsData.totalRequests % 10 === 0) {
      saveAnalyticsData(logger);
    }

    next();
  };
}

// Generate analytics response
function generateAnalyticsResponse(logger) {
  try {
    // Save current data before serving
    saveAnalyticsData(logger);

    // Get top browsers (limit to top 10)
    const topBrowsers = Object.entries(analyticsData.browsers)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 10)
      .map(([browser, count]) => ({ browser, count }));

    // Get top operating systems (limit to top 10)
    const topOperatingSystems = Object.entries(analyticsData.operatingSystems)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 10)
      .map(([os, count]) => ({ os, count }));

    // Get top pages (limit to top 10)
    const topPages = Object.entries(analyticsData.pages)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 10)
      .map(([page, count]) => ({ page, count }));

    // Get top referrers (limit to top 10)
    const topReferrers = Object.entries(analyticsData.referrers)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 10)
      .map(([referrer, count]) => ({ referrer, count }));

    // Get hourly distribution
    const hourlyDistribution = Object.entries(analyticsData.hourlyStats)
      .sort(([a], [b]) => parseInt(a) - parseInt(b))
      .map(([hour, count]) => ({ hour: parseInt(hour), count }));

    // Get daily stats (last 30 days)
    const dailyStats = Object.entries(analyticsData.dailyStats)
      .sort(([a], [b]) => new Date(a) - new Date(b))
      .slice(-30)
      .map(([date, count]) => ({ date, count }));

    return {
      summary: {
        totalRequests: analyticsData.totalRequests,
        uniqueVisitors: analyticsData.uniqueIPs.size,
        lastUpdated: analyticsData.lastUpdated
      },
      topBrowsers,
      topOperatingSystems,
      topPages,
      topReferrers,
      hourlyDistribution,
      dailyStats
    };
  } catch (error) {
    if (logger) logger.error('Error generating analytics:', error);
    throw error;
  }
}

module.exports = {
  loadAnalyticsData,
  saveAnalyticsData,
  createAnalyticsMiddleware,
  generateAnalyticsResponse
};
